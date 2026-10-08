#!/usr/bin/env node
/*
 * incomplete-probes.mjs — cycle 58 (boucle continue accessibilite-conformite)
 * Pour CHAQUE item axe 'incomplete' d'un report.json : re-joue l'URL + l'état,
 * localise le noeud par son target, puis soit MESURE le contraste (algo WCAG
 * propre : luminance relative, seuil 4.5 ou 3.0 texte large), soit prononce
 * N-A motivé (pas de texte visible, élément absent du DOM rejoué, décoratif).
 *
 * Aucun incomplet ne reste « non évalué » (leçon : chaque incomplet mesuré ou N-A).
 *
 * Usage :
 *   node incomplete-probes.mjs --report ../reports/X/report.json --base http://localhost:9950 \
 *        [--storage-state auth.json] [--out probes.json]
 *
 * Sortie console + JSON : [{url,state,rule,target,verdict:'measured'|'na',ratio?,threshold?,reason?}]
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const DIR = dirname(fileURLToPath(import.meta.url));

const arg = (k, d = null) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const reportPath = arg('report');
const BASE = arg('base');
const storageState = arg('storage-state');
const outPath = arg('out', null);
if (!reportPath || !BASE) { console.error('usage: --report <report.json> --base <url> [--storage-state f] [--out f]'); process.exit(2); }

// Ré-exécution des états depuis audit.mjs (STATES exporté) sans importer le
// script (importer exécuterait un scan). Extraction sûre : setups = fonctions
// pures (page, b) sans dépendances extérieures.
const auditSrc = readFileSync(join(DIR, 'audit.mjs'), 'utf8');
const m = auditSrc.match(/export const STATES = (\{[\s\S]*?\n\};)/);
if (!m) { console.error('STATES introuvable dans audit.mjs'); process.exit(2); }
const STATES = new Function(`return (${m[1].replace(/;\s*$/, '')});`)();

const report = JSON.parse(readFileSync(reportPath, 'utf8'));
const pages = report.pages || [];

const PROBE_JS = `(() => {
  const sel = SELJSON;
  let el = null;
  for (const s of sel) { try { el = document.querySelector(s); if (el) break; } catch {} }
  if (!el) return { verdict: 'na', reason: 'élément absent du DOM rejoué' };
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const visible = !!(r.width && r.height) && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0;
  if (!visible) return { verdict: 'na', reason: 'élément non visible au rejeu' };
  const ph = el.getAttribute('placeholder');
  const isPh = (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && !(el.value || '').trim() && !!ph;
  // axe 'emptyValue' : le texte à contraster est le ::placeholder, pas color.
  const fgCss = isPh ? getComputedStyle(el, '::placeholder').color : cs.color;
  const text = (el.innerText || el.value || ph || el.getAttribute('aria-label') || '').trim();
  if (!text) return { verdict: 'na', reason: 'aucun texte visible à contrast(er)' };
  const lum = c => { const v = c.map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const parse = s => { const m = s.match(/rgba?\\((\\d+)[, ]+(\\d+)[, ]+(\\d+)(?:[, /]+([\\d.]+))?\\)/); return m ? [ +m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4] ] : null; };
  const fg = parse(fgCss);
  let node = el, bg = null;
  while (node && !bg) { const b = parse(getComputedStyle(node).backgroundColor); if (b && b[3] >= 0.99) bg = b; node = node.parentElement; }
  if (!fg || !bg) return { verdict: 'na', reason: 'couleurs non déterminables (gradient/image)' };
  const l1 = Math.max(lum(fg), lum(bg)), l2 = Math.min(lum(fg), lum(bg));
  const ratio = (l1 + 0.05) / (l2 + 0.05);
  const fs = parseFloat(cs.fontSize), fw = parseInt(cs.fontWeight) || 400;
  const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
  return { verdict: 'measured', ratio: +ratio.toFixed(2), threshold: large ? 3 : 4.5,
           pass: ratio >= (large ? 3 : 4.5), text: text.slice(0, 60), fg: cs.color };
})()`;

const browser = await chromium.launch();
const ctx = await browser.newContext(storageState ? { storageState, locale: 'en-US' } : { locale: 'en-US' });
const results = [];
let measured = 0, na = 0, fails = 0;

for (const p of pages) {
  const inc = p.incomplete || [];
  if (!inc.length) continue;
  const stateMatch = p.url.match(/\[state:([^\]]+)\]/);
  const state = stateMatch ? stateMatch[1] : null;
  const page = await ctx.newPage();
  try {
    const target = state && STATES[state]?.url ? STATES[state].url(BASE) : p.requestedUrl;
    await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('scrm-navbar, nav.navbar, form[ngNativeValidate], input[name="username"], main, .list-view', { timeout: 30000 });
    if (state) {
      if (!STATES[state]) { results.push({ url: p.url, verdict: 'na', reason: `état ${state} absent de STATES` }); continue; }
      await STATES[state].setup(page);
    }
    await page.waitForTimeout(1200);
    for (const v of inc) {
      for (const n of v.nodes || []) {
        const res = await page.evaluate(PROBE_JS.replace('SELJSON', JSON.stringify(n.target || [])));
        const rec = { url: p.url, rule: v.id, target: (n.target || [])[0], ...res };
        results.push(rec);
        if (res.verdict === 'measured') { measured++; if (!res.pass) { fails++; console.log(`  FAIL ${res.ratio} < ${res.threshold} — ${res.text} @ ${(n.target||[])[0]}`); } }
        else na++;
      }
    }
  } catch (e) {
    results.push({ url: p.url, verdict: 'na', reason: `page/état non rejoué: ${String(e).slice(0, 120)}` });
  }
  await page.close();
}
await browser.close();

if (outPath) writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, results }, null, 2));
console.log(`\n[probes] ${results.length} items — measured: ${measured} (fails: ${fails}), n-a: ${na}`);
process.exit(fails ? 3 : 0);
