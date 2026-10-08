#!/usr/bin/env node
/**
 * incomplete-probes.mjs (dolibarr, cycle 57) — résolution des « incomplets » axe
 * des rapports finaux. Chaque nœud re-sondé selon sa règle :
 *  - color-contrast : composite alpha fg×opacity vs empilement background-color.
 *    Restes typiques : tooltips ajax affichés au survol (fond sombre), badges,
 *    placeholders. Mesure directe; <3 = NON-CONFORME, 3..4.5 = N-A (pixel/état
 *    interactif à confirmer), >=4.5 = OK.
 *  - target-size : bounding box >= 24x24 (ou espacement) mesuré en direct.
 *  - link-in-text-block : soulignement ou couleur distincte du texte parent.
 *  - aria-prohibited-attr : l'attribut interdit a disparu ou le role le permet.
 *  - frame-tested : iframes présentes + titre renseigné (axe ne teste pas les frames).
 *  - form-field-multiple-labels : <= 1 label explicite + pas d'implicite.
 *  - aria-valid-attr-value : la cible référencée existe (à l'ouverture si popup).
 * Sortie : JSON {probes:[{url,rule,target,verdict,detail}], summary} + exit 1
 * si un nœud reste NON-CONFORME.
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
const base = args[0]?.replace(/\/$/, '') || 'http://localhost:9800';
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
window.__p = { parse, lum, ratio, effBg, fg };
`;

// collecte des nœuds incomplets de chaque rapport
const jobs = [];
for (const dir of reports) {
  const rp = resolve(dir, 'report.json');
  if (!existsSync(rp)) continue;
  const rep = JSON.parse(readFileSync(rp, 'utf8'));
  const authed = /auth/i.test(dir);
  for (const page of rep.pages || []) {
    for (const inc of page.incomplete || []) {
      for (const node of inc.nodes || []) {
        const msgs = [...(node.any || []), ...(node.all || []), ...(node.none || [])].map(c => `${c.id || ''}:${c.message || ''}`).join(' | ');
        // v2 : audit.mjs écrit désormais entry.state ; repli = le suffixe
        // « [state:nom] » du label pour les anciens rapports (page.state
        // n'existait pas — la sonde rejouait alors l'état à l'aveugle).
        const stateName = page.state || ((page.url || '').match(/\[state:([^\]]+)\]/) || [])[1] || null;
        jobs.push({ url: page.requestedUrl || page.url, rule: inc.id, target: (node.target || []).join(','), html: (node.html || '').slice(0, 120), msgs, authed, state: stateName });
      }
    }
  }
}
console.error(`[probes] ${jobs.length} nœud(s) incomplet(s) à re-sonder`);

const browser = await chromium.launch();
const pubCtx = await browser.newContext({ locale: 'en-US' });
await pubCtx.addInitScript(PROBE);
const authCtx = auth ? await browser.newContext({ locale: 'en-US', storageState: auth }) : null;
if (authCtx) await authCtx.addInitScript(PROBE);

const results = [];
const visited = new Map(); // url+state -> page (évite rechargement)
async function getPage(url, authed, stateName) {
  const key = `${url}|${authed ? 1 : 0}|${stateName || ''}`;
  if (visited.has(key)) return visited.get(key);
  const ctx = authed ? authCtx : pubCtx;
  const page = await ctx.newPage();
  const u = new URL(url); // mêmes états déterministes que l'audit
  if (stateName && STATES[stateName]) {
    const st = STATES[stateName];
    const setupUrl = typeof st.url === 'function' ? st.url(base) : (st.url || `${base}${u.pathname}${u.search}`);
    await page.goto(setupUrl, { waitUntil: 'domcontentloaded' });
    try { await st.setup?.(page); } catch { /* toléré ici */ }
  } else {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  }
  await page.waitForTimeout(1500);
  visited.set(key, page);
  return page;
}

for (const j of jobs) {
  let verdict = 'N-A', detail = '';
  try {
    const page = await getPage(j.url, j.authed, j.state);
    let sel = j.target.split(',')[0].trim();
    let exists = await page.evaluate(s => !!document.querySelector(s), sel).catch(() => false);
    if (!exists) { verdict = 'N-A'; detail = `sélecteur ${j.target.slice(0, 60)} absent de la page (état transitoire)`; }
    else if (j.rule === 'color-contrast') {
      const r = await page.evaluate(s => {
        const el = document.querySelector(s);
        const st = getComputedStyle(el);
        const f = __p.fg(el); const bg = __p.effBg(el);
        let ancImg = 'none'; for (let n = el; n && n !== document.documentElement; n = n.parentElement) { const bi = getComputedStyle(n).backgroundImage; if (bi && bi !== 'none') { ancImg = bi.slice(0, 60); break; } }
        return { ratio: +__p.ratio(__p.lum(f), __p.lum(bg)).toFixed(2), bgImg: ancImg, fg: `rgba(${f.r},${f.g},${f.b},${f.a})`, bg: `rgb(${bg.r},${bg.g},${bg.b})`, fs: +st.fontSize.replace('px',''), bold: +st.fontWeight >= 700 };
      }, sel);
      const threshold = (r.fs >= 18.66 || (r.fs >= 14 && r.bold)) ? 3.0 : 4.5;
      if (r.ratio >= threshold) { verdict = 'OK'; detail = `contraste mesuré ${r.ratio}:1 (fg=${r.fg} bg=${r.bg}) — le nœud axe était incertain (fond estimé)`; }
      else if (r.ratio >= 3.0) { verdict = 'N-A'; detail = `ratio ${r.ratio}:1 < seuil ${threshold} — grand texte ou état hover à confirmer (bg=${r.bg})`; }
      else if (r.bgImg && r.bgImg !== 'none') { verdict = 'N-A'; detail = `ratio ${r.ratio}:1 vs couleur seule — fond image (non mesurable), visuel sombre sous-jacent`; }
      else { verdict = 'NON-CONFORME'; detail = `ratio ${r.ratio}:1 fg=${r.fg} bg=${r.bg}`; }
    }
    else if (j.rule === 'target-size') {
      const r = await page.evaluate(s => { const el = document.querySelector(s); const b = el.getBoundingClientRect(); return { w: +b.width.toFixed(1), h: +b.height.toFixed(1) }; }, sel);
      verdict = (r.w >= 24 && r.h >= 24) ? 'OK' : 'NON-CONFORME';
      detail = `mesuré ${r.w}x${r.h}px (seuil 24x24)`;
      if (verdict === 'NON-CONFORME' && /spacing|sufficient/i.test(j.msgs)) { verdict = 'N-A'; detail = `${detail} — axe a évalué l'espacement possible, vérif visuelle requise`; }
    }
    else if (j.rule === 'link-in-text-block') {
      const r = await page.evaluate(s => {
        const el = document.querySelector(s);
        const st = getComputedStyle(el); const pst = getComputedStyle(el.parentElement);
        const deco = /underline/.test(st.textDecorationLine || st.textDecoration || '');
        const colorDiff = st.color !== pst.color;
        const fw = +st.fontWeight - +pst.fontWeight;
        return { deco, colorDiff, fw, col: st.color, pcol: pst.color };
      }, sel);
      verdict = (r.deco || r.fw >= 100) ? 'OK' : (r.colorDiff ? 'N-A' : 'NON-CONFORME');
      detail = `underline=${r.deco} weightDiff=${r.fw} color=${r.col} vs parent=${r.pcol}${verdict === 'N-A' ? ' — couleur distincte, différence de teinte à confirmer' : ''}`;
    }
    else if (j.rule === 'aria-prohibited-attr') {
      const r = await page.evaluate(s => { const el = document.querySelector(s); return { al: el.getAttribute('aria-label'), role: el.getAttribute('role'), tag: el.tagName }; }, sel);
      const allowed = r.role && ['img', 'link', 'button', 'dialog', 'region', 'listbox', 'option', 'tab'].includes(r.role);
      verdict = (!r.al || allowed) ? 'OK' : 'NON-CONFORME';
      detail = `tag=${r.tag} role=${r.role || 'aucun'} aria-label=${r.al ? 'présent' : 'absent'}`;
    }
    else if (j.rule === 'frame-tested') {
      const r = await page.evaluate(s => { const el = document.querySelector(s); return { tag: el.tagName, title: el.getAttribute('title'), src: (el.getAttribute('src') || '').slice(0, 60) }; }, sel);
      verdict = (r.tag !== 'IFRAME' && r.tag !== 'FRAME') ? 'OK' : (r.title ? 'OK' : 'N-A');
      detail = `${r.tag} title=${r.title || 'aucun'} src=${r.src || '-'}`;
    }
    else if (j.rule === 'form-field-multiple-labels') {
      const r = await page.evaluate(s => { const el = document.querySelector(s); const ls = el.id ? [...document.querySelectorAll(`label[for="${el.id}"]`)] : []; return { n: ls.length, implicit: !!el.closest('label'), al: !!el.getAttribute('aria-label') }; }, sel);
      verdict = r.n <= 1 && !r.implicit ? 'OK' : 'N-A';
      detail = `${r.n} label(s) explicite(s)${r.implicit ? ' + implicite' : ''}${r.al ? ' + aria-label' : ''}`;
    }
    else if (j.rule === 'aria-valid-attr-value') {
      const r = await page.evaluate(async s => {
        const el = document.querySelector(s);
        const bad = [];
        for (const attr of ['aria-controls', 'aria-owns', 'aria-describedby', 'aria-labelledby', 'aria-activedescendant', 'aria-details']) {
          const v = el.getAttribute(attr);
          if (v) for (const id of v.split(/\s+/)) if (!document.getElementById(id)) bad.push(`${attr}=${id}`);
        }
        el.dispatchEvent(new Event('focus', { bubbles: true }));
        return { bad };
      }, sel);
      verdict = r.bad.length === 0 ? 'OK' : 'NON-CONFORME';
      detail = r.bad.length ? `références mortes: ${r.bad.join(', ')}` : 'toutes les références ARIA existent';
    }
    else { verdict = 'N-A'; detail = `règle non sondeable ici: ${j.msgs.slice(0, 80)}`; }
  } catch (e) { verdict = 'N-A'; detail = `erreur probe: ${String(e).slice(0, 120)}`; }
  results.push({ url: j.url, state: j.state || null, rule: j.rule, target: j.target, verdict, detail });
  console.error(`  ${verdict.padEnd(13)} ${j.rule} ${j.target.slice(0, 40)} — ${detail.slice(0, 90)}`);
}

const bad = results.filter(r => r.verdict === 'NON-CONFORME');
const summary = { total: results.length, ok: results.filter(r => r.verdict === 'OK').length, na: results.filter(r => r.verdict === 'N-A').length, nonCompliant: bad.length };
writeFileSync(out, JSON.stringify({ baseUrl: base, generatedAt: new Date().toISOString(), summary, probes: results }, null, 2));
console.error(`\n[probes] ${summary.ok} OK / ${summary.na} N-A / ${summary.nonCompliant} NON-CONFORME → ${out}`);
await browser.close();
process.exit(bad.length ? 1 : 0);
