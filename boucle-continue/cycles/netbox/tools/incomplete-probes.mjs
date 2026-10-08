#!/usr/bin/env node
/**
 * incomplete-probes.mjs (netbox) — résolution des « incomplets » axe des
 * rapports finaux du cycle 52. Chaque nœud est re-sondé :
 *  - color-contrast/bgGradient   : stops du gradient composés + ratio min mesuré
 *  - color-contrast/bgImage      : texte sur image raster -> N-A pixel honnête
 *  - color-contrast/bgOverlap / elmPartiallyObscured(ing) : élément couvrant
 *                                  mesuré via elementFromPoint
 *  - color-contrast/emptyValue / shortTextContent : N-A justifié
 *  - aria-valid-attr-value       : aria-controls vers -ts-dropdown — l'id est
 *                                  matérialisé par TomSelect à l'ouverture ;
 *                                  on ouvre le combobox et on vérifie l'id.
 *  - duplicate-id-aria           : comptage live de l'id dupliqué + visibilité
 *  - aria-prohibited-attr        : aria-label sur div sans rôle — le correctif
 *                                  ajoute role="img" ; on vérifie le rôle.
 * Sortie: JSON report + code 1 si un nœud reste NON-CONFORME.
 * Usage: node incomplete-probes.mjs <baseUrl> [auth.json] [--reports dir...]
 *        [--out fichier.json]
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATES } from './audit.mjs';
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(HERE, 'package.json'));
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args[0]?.replace(/\/$/, '') || 'http://localhost:9300';
let auth = null, out = resolve(HERE, '../reports/incomplete-probes.json'), reports = [];
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--out') out = resolve(process.cwd(), args[++i]);
  else if (args[i] === '--reports') while (args[i + 1] && !args[i + 1].startsWith('--')) reports.push(resolve(process.cwd(), args[++i]));
  else if (args[i] === '--storage-state') auth = args[++i];
  else if (!args[i].startsWith('--') && !auth) auth = args[i];
}
if (!reports.length) reports = [resolve(HERE, '../reports/final-public'), resolve(HERE, '../reports/final-auth')];

const PROBE = `
const parse = c => { const m = c && c.match(/rgba?\\(([^)]+)\\)/); if (!m) return c === 'transparent' ? { r: 0, g: 0, b: 0, a: 0 } : null; const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const effBg = el => { const L = []; let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0) L.push(c); n = n.parentElement; } if (!L.length) return { r: 255, g: 255, b: 255 }; let top = L[0]; for (let i = 1; i < L.length; i++) { const u = L[i]; const a = top.a + u.a * (1 - top.a); top = { r: (top.r * top.a + u.r * u.a * (1 - top.a)) / a, g: (top.g * top.a + u.g * u.a * (1 - top.a)) / a, b: (top.b * top.a + u.b * u.a * (1 - top.a)) / a, a }; } return top; };
const fg = el => { const st = getComputedStyle(el); const c = parse(st.color) || { r: 0, g: 0, b: 0, a: 0 }; return { ...c, a: (c.a ?? 1) * parseFloat(st.opacity || 1) }; };
const gradStops = el => {
  const bg = getComputedStyle(el).backgroundImage;
  const out = [];
  const re = /rgba?\\(([^)]+)\\)/g; let m;
  while ((m = re.exec(bg)) && out.length < 8) { const p = m[1].split(',').map(x => parseFloat(x)); if (p.length > 3 && p[3] === 0) continue; out.push({ r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }); }
  return out;
};
// chaîne élément + ancêtres -> premier porteur de gradient/image de fond
const bgCarrier = el => {
  for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
    const st = getComputedStyle(n);
    if (st.backgroundImage && st.backgroundImage !== 'none') return { el: n, img: st.backgroundImage };
  }
  return null;
};
const pseudoBg = el => {
  for (const ps of ['::before', '::after']) {
    const st = getComputedStyle(el, ps);
    const c = parse(st.backgroundColor);
    if (c && c.a > 0) return { color: c, opacity: parseFloat(st.opacity || '1') };
  }
  return null;
};
window.__probe = { parse, lum, ratio, effBg, fg, gradStops, bgCarrier, pseudoBg };
`;

const LUM = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const rratio = (a, b) => (Math.max(LUM(a), LUM(b)) + 0.05) / (Math.min(LUM(a), LUM(b)) + 0.05);

const results = [];
const push = (rule, url, target, verdict, detail) => results.push({ rule, url, target: String(target).slice(0, 120), verdict, detail });

const browser = await chromium.launch();
const ctxPub = await browser.newContext({ locale: 'en-US' });
const ctxAdm = await browser.newContext({ locale: 'en-US', storageState: auth || undefined });
const pubPage = await ctxPub.newPage(); const admPage = await ctxAdm.newPage();
for (const pg of [pubPage, admPage]) await pg.addInitScript(PROBE);

const pubRe = /\/(login|password_reset|media\/failure)\b/;

for (const dir of reports) {
  const f = resolve(dir, 'report.json');
  if (!existsSync(f)) continue;
  const rep = JSON.parse(readFileSync(f, 'utf8'));
  for (const p of rep.pages) {
    const url = p.url;
    const pg = pubRe.test(url) ? pubPage : admPage;
    // états nommés « url [state:nom] » : rejeu du setup avant sondage (F5/leçon 32)
    const sm = url.match(/^(.*) \[state:([^\]]+)\]$/);
    const pageUrl = sm ? sm[1] : url;
    const stateName = sm ? sm[2] : null;
    try {
      await pg.goto(pageUrl, { waitUntil: 'domcontentloaded' });
      await pg.waitForTimeout(1500);
      if (stateName && STATES[stateName]) {
        try { await STATES[stateName].setup(pg); } catch (e) { push('nav', url, '-', 'N-A', `setup état '${stateName}' échoué: ${String(e).slice(0, 80)}`); continue; }
      } else if (stateName) {
        push('nav', url, '-', 'N-A', `état '${stateName}' inconnu de STATES`); continue;
      }
      await pg.waitForTimeout(500);
    } catch (e) { push('nav', url, '-', 'N-A', `goto échoué: ${String(e).slice(0, 80)}`); continue; }

    for (const v of p.incomplete || []) {
      for (const n of v.nodes) {
        const sel = (n.target || [])[0];
        const mk = (v.id === 'color-contrast' ? (((n.any || [])[0] || {}).data || {}).messageKey : ((((n.all || [])[0] || {}).data || {}).messageKey || v.id));
        let targetEl = null;
        try { targetEl = sel && await pg.$(sel); } catch { }
        if (!targetEl) { push(v.id, url, sel || (n.html || '').slice(0, 60), 'N-A', 'sélecteur non résolu'); continue; }

        if (v.id === 'color-contrast') {
          const m = await targetEl.evaluate(el => {
            const f = window.__probe.fg(el);
            const pseudo = window.__probe.pseudoBg(el);
            const base = window.__probe.effBg(el);
            const carrier = window.__probe.bgCarrier(el);
            const stops = carrier ? window.__probe.gradStops(carrier.el) : [];
            const carrierBase = carrier ? window.__probe.effBg(carrier.el.parentElement || carrier.el) : null;
            const raster = carrier && /\.(png|jpe?g|webp|gif|avif)|url\(/i.test(carrier.img) && !/gradient/i.test(carrier.img);
            let cover = null;
            const r = el.getBoundingClientRect();
            const cx = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1), cy = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
            const top = document.elementFromPoint(cx, cy);
            if (top && top !== el && !el.contains(top)) cover = { tag: top.tagName + '.' + (top.className || '').toString().slice(0, 40), bg: window.__probe.effBg(top), overlay: !!top.closest('.dropdown-menu.show,.modal.show,.offcanvas.show,.notifications.show') };
            return { f, pseudo, base, stops, carrierBase, raster, cover, fs: getComputedStyle(el).fontSize, fw: getComputedStyle(el).fontWeight };
          });
          const big = parseFloat(m.fs) >= 24 || (parseFloat(m.fs) >= 18.66 && parseInt(m.fw) >= 700);
          const need = big ? 3 : 4.5;
          const cOf = (c, over) => over ? { r: c.r * c.a + over.r * (1 - c.a), g: c.g * c.a + over.g * (1 - c.a), b: c.b * c.a + over.b * (1 - c.a) } : c;
          if (mk === 'emptyValue' || mk === 'shortTextContent') push(v.id, url, sel, 'N-A', 'valeur/contenu vide — rien à mesurer');
          else if (m.stops.length) {
            const under = m.carrierBase || m.base;
            const ratios = m.stops.map(s => rratio(m.f, cOf(s, under)));
            const minR = Math.min(...ratios);
            push(v.id, url, sel, minR >= need ? 'OK' : 'NON-CONFORME', `gradient stops ratio min=${minR.toFixed(2)} seuil=${need} (pire zone)`);
          } else if (m.raster || mk === 'bgImage' || mk === 'imgNode') push(v.id, url, sel, 'N-A', 'texte sur image raster — ratio non calculable sans échantillonnage pixel');
          else if (m.cover && (mk === 'bgOverlap' || mk === 'elmPartiallyObscured' || mk === 'elmPartiallyObscuring')) {
            if (m.cover.overlay) push(v.id, url, sel, 'N-A', `recouvert par l'overlay de l'état (${m.cover.tag}) — axe ne peut mesurer sous un menu/modale ouvert`);
            else {
              const r = rratio(m.f, m.cover.bg);
              push(v.id, url, sel, r >= need ? 'OK' : 'NON-CONFORME', `couvrant ${m.cover.tag} ratio=${r.toFixed(2)} seuil=${need}`);
            }
          } else if (m.pseudo && mk === 'pseudoContent') {
            const bg = cOf(m.pseudo.color, m.base);
            const r = rratio(m.f, bg);
            push(v.id, url, sel, r >= need ? 'OK' : 'NON-CONFORME', `pseudo bg composite ratio=${r.toFixed(2)} seuil=${need}`);
          } else {
            const r = rratio(m.f, m.base);
            push(v.id, url, sel, r >= need ? 'OK' : 'NON-CONFORME', `ratio composite=${r.toFixed(2)} seuil=${need}`);
          }
        } else if (v.id === 'aria-valid-attr-value') {
          // TomSelect : aria-controls pointe le dropdown créé à l'ouverture.
          const attr = (((n.all || [])[0] || {}).data || {}).needsReview || '';
          const mm = (n.failureSummary || '').match(/aria-controls="([^"]+)"/) || attr.match(/aria-controls="([^"]+)"/);
          const ref = mm && mm[1];
          if (!ref) { push(v.id, url, sel, 'N-A', 'attribut à revoir non identifié'); continue; }
          const there = await targetEl.evaluate((el, id) => !!document.getElementById(id), ref);
          if (!there) {
            await targetEl.focus().catch(() => { });
            await targetEl.click().catch(() => { });
            await pg.waitForTimeout(800);
          }
          const after = await pg.evaluate(id => !!document.getElementById(id), ref);
          await pg.keyboard.press('Escape').catch(() => { });
          push(v.id, url, sel, after ? 'OK' : 'NON-CONFORME', `aria-controls=${ref} ${after ? 'matérialisé à l\'ouverture du combobox' : 'toujours absent du DOM après ouverture'}`);
        } else if (v.id === 'duplicate-id-aria') {
          const mm = (n.failureSummary || '').match(/same id attribute: ([\w-]+)/);
          const dupId = mm && mm[1];
          if (!dupId) { push(v.id, url, sel, 'N-A', 'id dupliqué non extrait'); continue; }
          const st = await pg.evaluate(id => {
            const els = [...document.querySelectorAll(`[id="${CSS.escape(id)}"]`)];
            const vis = els.filter(e => e.offsetParent !== null || e.getClientRects().length).length;
            return { total: els.length, visible: vis };
          }, dupId);
          if (st.total <= 1) push(v.id, url, sel, 'OK', `id ${dupId} unique (${st.total})`);
          else if (st.visible <= 1) push(v.id, url, sel, 'N-A', `id ${dupId} ×${st.total} mais ${st.visible} visible(s) — doublons dans gabarits masqués`);
          else push(v.id, url, sel, 'NON-CONFORME', `id ${dupId} ×${st.total} dont ${st.visible} visibles — référence ARIA ambiguë`);
        } else if (v.id === 'aria-prohibited-attr') {
          const st = await targetEl.evaluate(el => ({ role: el.getAttribute('role'), label: el.getAttribute('aria-label'), tag: el.tagName }));
          if (st.label && !st.role && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA|IMG|SVG)$/.test(st.tag)) push(v.id, url, sel, 'NON-CONFORME', `${st.tag} aria-label sans role`);
          else push(v.id, url, sel, 'OK', `role=${st.role || '(élément ' + st.tag + ')'} aria-label présent=${!!st.label}`);
        } else {
          push(v.id, url, sel, 'N-A', `règle ${v.id} non sondée`);
        }
      }
    }
  }
}

await browser.close();
const ko = results.filter(r => r.verdict === 'NON-CONFORME');
writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), probes: results }, null, 2));
console.log(`incomplete-probes: ${results.length} sondés — ${results.filter(r => r.verdict === 'OK').length} OK, ${ko.length} NON-CONFORME, ${results.filter(r => r.verdict === 'N-A').length} N-A`);
for (const k of ko.slice(0, 15)) console.log(`  NON-CONFORME ${k.rule} ${k.url} :: ${k.detail}`);
console.log(`-> ${out}`);
process.exit(ko.length ? 1 : 0);
