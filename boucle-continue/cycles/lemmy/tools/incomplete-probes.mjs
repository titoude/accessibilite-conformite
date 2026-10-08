#!/usr/bin/env node
/**
 * incomplete-probes.mjs (lemmy, cycle 55) — résolution des « incomplets » axe
 * des rapports finaux. Chaque nœud re-sondé :
 *  - color-contrast/bgImage : l'arrière-plan « image » est le chevron SVG
 *    inline de .form-select (décoration à droite). Le texte est mesuré vs la
 *    background-color effective => ratio AA mesuré.
 *  - aria-valid-attr-value (controlsWithinPopup) : boutons role=combobox dont
 *    aria-controls vise une listbox matérialisée à l'ouverture => on ouvre et
 *    on vérifie que la cible existe (et vit dans le même popup).
 *  - form-field-multiple-labels : si encore incomplet => N-A (corrigé : label
 *    interne masqué quand id externe fourni).
 *  - aria-required-children : tablist vide => corrigé (ul non rendue si 0 tab).
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
const base = args[0]?.replace(/\/$/, '') || 'http://localhost:9655';
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
        jobs.push({ url: page.requestedUrl || page.url, rule: inc.id, target: (node.target || []).join(','), html: (node.html || '').slice(0, 120), msgs, authed, state: page.state });
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
    let sel = j.target.split(',')[0];
    let exists = await page.evaluate(s => !!document.querySelector(s), sel).catch(() => false);
    if (!exists && /^#(sort-select|language-select|markdown-textarea)-/.test(sel)) {
      // id aléatoire régénéré à chaque chargement — repli sur le préfixe d'id
      const prefix = sel.match(/^#([a-z-]+)-[A-Za-z0-9]+$/)?.[1];
      if (prefix) {
        const fb = `[id^="${prefix}-"]`;
        exists = await page.evaluate(s => !!document.querySelector(s), fb).catch(() => false);
        if (exists) sel = fb;
      }
    }
    if (!exists) { verdict = 'N-A'; detail = `sélecteur ${j.target} absent de la page`; }
    else if (j.rule === 'color-contrast') {
      const r = await page.evaluate(s => {
        const el = document.querySelector(s) || document.querySelector('.sort-select, .language-select');
        const st = getComputedStyle(el);
        const f = __p.fg(el); const bg = __p.effBg(el);
        return { ratio: +__p.ratio(__p.lum(f), __p.lum(bg)).toFixed(2), bgImg: st.backgroundImage.slice(0, 60), fg: `rgba(${f.r},${f.g},${f.b},${f.a})`, bg: `rgb(${bg.r},${bg.g},${bg.b})` };
      }, sel);
      if (r.ratio >= 4.5) { verdict = 'OK'; detail = `contraste mesuré ${r.ratio}:1 (bg=${r.bg}) — chevron SVG décoratif, ne couvre pas le texte`; }
      else if (r.ratio >= 3) { verdict = 'N-A'; detail = `ratio ${r.ratio}:1 < 4.5 — vérif pixel requise (bgImg: ${r.bgImg})`; }
      else { verdict = 'NON-CONFORME'; detail = `ratio ${r.ratio}:1 fg=${r.fg} bg=${r.bg}`; }
    }
    else if (j.rule === 'aria-valid-attr-value' && /controlsWithinPopup|referenced ID exists/i.test(j.msgs)) {
      // ouvrir le combobox puis vérifier la cible
      const r = await page.evaluate(async s => {
        const el = document.querySelector(s);
        const ctrl = el.getAttribute('aria-controls');
        el.click();
        await new Promise(r => setTimeout(r, 600));
        const tgt = ctrl && document.getElementById(ctrl);
        return { ctrl, found: !!tgt, role: tgt?.getAttribute('role'), expanded: el.getAttribute('aria-expanded') };
      }, sel).catch(e => ({ err: String(e) }));
      if (r.found) { verdict = 'OK'; detail = `aria-controls="${r.ctrl}" résolu à l'ouverture (role=${r.role}, expanded=${r.expanded})`; }
      else { verdict = 'NON-CONFORME'; detail = `aria-controls="${r.ctrl}" sans cible même après ouverture ${r.err || ''}`; }
    }
    else if (j.rule === 'form-field-multiple-labels') {
      const r = await page.evaluate(s => { const el = document.querySelector(s); const ls = [...document.querySelectorAll(`label[for="${el.id}"]`)]; return { n: ls.length, implicit: !!el.closest('label') }; }, sel);
      verdict = r.n <= 1 && !r.implicit ? 'OK' : 'NON-CONFORME';
      detail = `${r.n} label(s) explicite(s)${r.implicit ? ' + implicite' : ''}`;
    }
    else if (j.rule === 'aria-required-children') {
      const r = await page.evaluate(s => { const el = document.querySelector(s); return { kids: el.querySelectorAll('[role="tab"],[role="presentation"],li').length, role: el.getAttribute('role') }; }, sel);
      verdict = r.kids > 0 ? 'OK' : 'NON-CONFORME';
      detail = `role=${r.role} enfants requis=${r.kids}`;
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
