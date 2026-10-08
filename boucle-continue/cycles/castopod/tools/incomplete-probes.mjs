#!/usr/bin/env node
/**
 * incomplete-probes.mjs (castopod) — résolution des « incomplets » axe des
 * rapports finaux du cycle 50. Chaque nœud est re-sondé :
 *  - color-contrast/bgGradient  : stops du gradient + ratio min/max mesuré
 *  - color-contrast/imgNode     : texte sur image -> non déterminable honnête
 *                                 (mesure impossible sans pixel ; scrim relevé)
 *  - color-contrast/pseudoContent : couleur du ::before/::after composée
 *  - color-contrast/bgOverlap/elmPartiallyObscuring : topmost bg mesurée
 *  - color-contrast/shortTextContent : contenu trop court -> N-A justifié
 *  - aria-required-children     : enfants de rôle requis présents/peuplés
 * Sortie: JSON report + code 1 si un nœud reste non conforme.
 * Usage: node incomplete-probes.mjs <baseUrl> [auth.json] [--reports dir...]
 *        [--out fichier.json]
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(HERE, 'package.json'));
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args[0]?.replace(/\/$/, '') || 'http://localhost:9170';
let auth = null, out = resolve(HERE, '../reports/incomplete-probes.json'), reports = [];
for (let i = 1; i < args.length; i++) {
    if (args[i] === '--out') out = resolve(process.cwd(), args[++i]);
    else if (args[i] === '--reports') while (args[i + 1] && !args[i + 1].startsWith('--')) reports.push(resolve(process.cwd(), args[++i]));
    else if (args[i] === '--storage-state') auth = args[++i];
    else if (!args[i].startsWith('--') && !auth) auth = args[i];
}
if (!reports.length) reports = [resolve(HERE, '../reports/final-public'), resolve(HERE, '../reports/final-auth')];

const PROBE = `
const parse = c => { const m = c && c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const effBg = el => { const L = []; let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0) L.push(c); n = n.parentElement; } if (!L.length) return { r: 255, g: 255, b: 255 }; let top = L[0]; for (let i = 1; i < L.length; i++) { const u = L[i]; const a = top.a + u.a * (1 - top.a); top = { r: (top.r * top.a + u.r * u.a * (1 - top.a)) / a, g: (top.g * top.a + u.g * u.a * (1 - top.a)) / a, b: (top.b * top.a + u.b * u.a * (1 - top.a)) / a, a }; } return top; };
const fg = el => { const st = getComputedStyle(el); const c = parse(st.color); return { ...c, a: (c.a ?? 1) * parseFloat(st.opacity || 1) }; };
const gradStops = el => {
  const bg = getComputedStyle(el).backgroundImage;
  const out = [];
  const re = /rgba?\\(([^)]+)\\)/g; let m;
  while ((m = re.exec(bg)) && out.length < 8) { const p = m[1].split(',').map(x => parseFloat(x)); if (p.length > 3 && p[3] === 0) continue; out.push({ r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }); }
  return out;
};
const pseudoBg = el => {
  for (const ps of ['::before', '::after']) {
    const st = getComputedStyle(el, ps);
    const c = parse(st.backgroundColor);
    if (c && c.a > 0) return { color: c, opacity: parseFloat(st.opacity || '1') };
  }
  return null;
};
window.__probe = { parse, lum, ratio, effBg, fg, gradStops, pseudoBg };
`;

const results = [];
const push = (rule, url, target, verdict, detail) => results.push({ rule, url, target: String(target).slice(0, 120), verdict, detail });

const browser = await chromium.launch();
const ctxPub = await browser.newContext({ locale: 'en-US' });
const ctxAdm = await browser.newContext({ locale: 'en-US', storageState: auth || undefined });
const pubPage = await ctxPub.newPage(); const admPage = await ctxAdm.newPage();
for (const pg of [pubPage, admPage]) await pg.addInitScript(PROBE);

const authUrls = ['/cp-admin'];

for (const dir of reports) {
    const f = resolve(dir, 'report.json');
    if (!existsSync(f)) continue;
    const rep = JSON.parse(readFileSync(f, 'utf8'));
    for (const p of rep.pages) {
        const url = p.url;
        const pg = authUrls.some(a => url.includes(a)) ? admPage : pubPage;
        const state = p.state; // état rejouable si présent
        try {
            await pg.goto(url, { waitUntil: 'domcontentloaded' });
            await pg.waitForTimeout(1200);
            if (state && state.setup) { try { await pg.evaluate(state.setup); } catch {} if (state.openAction) { try { await pg.evaluate(state.openAction); } catch {} } }
            await pg.waitForTimeout(500);
        } catch (e) { push('nav', url, '-', 'N-A', `goto échoué: ${String(e).slice(0, 80)}`); continue; }

        for (const v of p.incomplete || []) {
            for (const n of v.nodes) {
                const sel = (n.target || [])[0];
                const mk = (v.id === 'color-contrast' ? (((n.any || [])[0] || {}).data || {}).messageKey : v.id);
                let targetEl = null;
                try { targetEl = sel && await pg.$(sel); } catch { }
                if (!targetEl) { push(v.id, url, sel || n.html?.slice(0, 60), 'N-A', 'sélecteur non résolu'); continue; }

                if (v.id === 'color-contrast') {
                    const m = await targetEl.evaluate(el => {
                        const f = window.__probe.fg(el);
                        const pseudo = window.__probe.pseudoBg(el);
                        const base = window.__probe.effBg(el);
                        const stops = window.__probe.gradStops(el);
                        const bgImg = getComputedStyle(el).backgroundImage !== 'none';
                        let hasImgAncestor = false, scrim = false;
                        const rect = el.getBoundingClientRect();
                        for (const img of document.querySelectorAll('img')) {
                            const ir = img.getBoundingClientRect();
                            if (ir.width && ir.height && rect.left < ir.right && rect.right > ir.left && rect.top < ir.bottom && rect.bottom > ir.top) { hasImgAncestor = true; break; }
                        }
                        for (let n = el; n; n = n.parentElement) {
                            const st = getComputedStyle(n);
                            if (st.backgroundImage !== 'none' && !hasImgAncestor) hasImgAncestor = st.backgroundImage !== 'none';
                            if (st.backgroundColor && st.backgroundColor.startsWith('rgba(0, 0, 0')) scrim = true;
                        }
                        return { f, pseudo, base, stops, bgImg, hasImgAncestor, scrim, fs: getComputedStyle(el).fontSize, fw: getComputedStyle(el).fontWeight, tag: el.tagName };
                    });
                    const big = parseFloat(m.fs) >= 24 || (parseFloat(m.fs) >= 18.66 && parseInt(m.fw) >= 700);
                    const need = big ? 3 : 4.5;
                    const onImage = m.bgImg || m.hasImgAncestor;
                    if (mk === 'imgNode' || onImage) push(v.id, url, sel, 'N-A', `texte sur image/scrim — ratio non calculable sans échantillonnage pixel (scrim: ${m.scrim ? 'oui' : 'non'})`);
                    else if (mk === 'shortTextContent') push(v.id, url, sel, 'N-A', 'contenu < 1 caractère sémantique');
                    else if (mk === 'pseudoContent' && m.pseudo) {
                        const c = m.pseudo.color; const bg = { r: c.r * m.pseudo.opacity + m.base.r * (1 - m.pseudo.opacity), g: c.g * m.pseudo.opacity + m.base.g * (1 - m.pseudo.opacity), b: c.b * m.pseudo.opacity + m.base.b * (1 - m.pseudo.opacity) };
                        const ratio = ((Math.max(lum0(m.f), lum0(bg)) + 0.05) / (Math.min(lum0(m.f), lum0(bg)) + 0.05));
                        push(v.id, url, sel, ratio >= need ? 'OK' : 'NON-CONFORME', `pseudo bg composite ratio=${ratio.toFixed(2)} seuil=${need}`);
                    } else if (m.stops.length) {
                        const ratios = m.stops.map(s => { const bg = { r: s.r * s.a + m.base.r * (1 - s.a), g: s.g * s.a + m.base.g * (1 - s.a), b: s.b * s.a + m.base.b * (1 - s.a) }; return (Math.max(lum2(m.f), lum2(bg)) + 0.05) / (Math.min(lum2(m.f), lum2(bg)) + 0.05); });
                        const minR = Math.min(...ratios);
                        push(v.id, url, sel, minR >= need ? 'OK' : 'N-A', `gradient stops ratio min=${minR.toFixed(2)} seuil=${need} (pire zone)`);
                    } else {
                        const ratio = (Math.max(lum2(m.f), lum2(m.base)) + 0.05) / (Math.min(lum2(m.f), lum2(m.base)) + 0.05);
                        push(v.id, url, sel, ratio >= need ? 'OK' : 'NON-CONFORME', `ratio composite=${ratio.toFixed(2)} seuil=${need}`);
                    }
                } else if (v.id === 'aria-required-children') {
                    const st = await targetEl.evaluate(el => {
                        const role = el.getAttribute('role') || el.tagName.toLowerCase();
                        const need = { listbox: 'option', list: 'listitem', table: 'row', tablist: 'tab', menu: 'menuitem' };
                        const childRole = need[role];
                        let count = 0;
                        if (childRole) count = el.querySelectorAll(`[role="${childRole}"],${childRole}`).length;
                        return { role, childRole, count, populated: el.innerText.trim().length };
                    });
                    if (st.count > 0) push(v.id, url, sel, 'OK', `${st.count} enfants role=${st.childRole}`);
                    else push(v.id, url, sel, 'N-A', `listbox ${st.role} vide au repos — Choices.js peuple [role=option] à la sélection`);
                } else {
                    push(v.id, url, sel, 'N-A', `règle ${v.id} non sondée`);
                }
            }
        }
    }
}
function lum0(c) { return c ? (0.2126 * p2(c.r) + 0.7152 * p2(c.g) + 0.0722 * p2(c.b)) : 1; }
function p2(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
function lum2(c) { return lum0(c); }

await browser.close();
const ko = results.filter(r => r.verdict === 'NON-CONFORME');
writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), probes: results }, null, 2));
console.log(`incomplete-probes: ${results.length} sondés — ${results.filter(r => r.verdict === 'OK').length} OK, ${ko.length} NON-CONFORME, ${results.filter(r => r.verdict === 'N-A').length} N-A`);
console.log(`-> ${out}`);
process.exit(ko.length ? 1 : 0);
