// incomplete-probes.mjs — sonde manuelle rejouable pour les résultats axe
// "incomplete" du cycle 54 twenty. axe ne tranche pas les nœuds dont le fond
// vient de pseudo-éléments/gradients/overlays — on mesure à la main en
// rejouant les mêmes pages/états que l'audit.
//   - color-contrast : couleur calculée vs premier fond ancêtre opaque →
//     ratio WCAG → PASS si >= seuil (4.5 normal, 3.0 gros texte).
//   - autre règle    : N-A documenté (jamais un PASS muet).
// Usage : node tools/incomplete-probes.mjs <baseUrl> --report <report.json>
//         [--storage-state tools/auth.json] [--out reports/probes/incomplete.json]
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const req = createRequire(import.meta.url);
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
const baseUrl = args.find(a => !a.startsWith('--')) || 'http://localhost:9540';
const reportPath = opt('report');
const storageState = opt('storage-state') || resolve(HERE, 'auth.json');
const outPath = opt('out') || resolve(HERE, '../reports/probes/incomplete.json');
if (!reportPath) { console.error('usage: node incomplete-probes.mjs <base> --report <report.json>'); process.exit(2); }
const report = JSON.parse(readFileSync(reportPath, 'utf8'));

const MEASURE = `((sel) => {
  const el = document.querySelector(sel);
  if (!el) return { found: false };
  const lum = (r, g, b) => { const c = [r,g,b].map(v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }); return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]; };
  const parse = (s) => { const m = (s||'').match(/rgba?\\(([^)]+)\\)/); return m ? m[1].split(',').map(Number) : null; };
  const ratio = (f,b) => (Math.max(lum(...f),lum(...b))+0.05)/(Math.min(lum(...f),lum(...b))+0.05);
  const fg = parse(getComputedStyle(el).color) || [0,0,0];
  let stack = [], node = el;
  while (node && node !== document.documentElement) {
    const c = parse(getComputedStyle(node).backgroundColor);
    if (c && (c[3] ?? 1) > 0) stack.push(c);
    node = node.parentElement;
  }
  let bg = [255,255,255];
  for (let i = stack.length - 1; i >= 0; i--) {
    const [r,g,b,a] = stack[i];
    bg = [Math.round(r*a + bg[0]*(1-a)), Math.round(g*a + bg[1]*(1-a)), Math.round(b*a + bg[2]*(1-a))];
  }
  const cs = getComputedStyle(el);
  const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && cs.fontWeight >= 700);
  const r = el.getBoundingClientRect();
  return { found: true, ratio: Math.round(ratio(fg, bg)*100)/100, fg, bg, bigText: big,
           needed: big ? 3 : 4.5, visible: r.width > 0 && r.height > 0, text: (el.innerText||'').trim().slice(0,60) };
})`;

const probes = [];
const seen = new Set();
for (const page of report.pages || []) {
  for (const v of page.incomplete || []) {
    for (const node of v.nodes || []) {
      const target = Array.isArray(node.target) ? node.target[0] : node.target;
      if (!target || typeof target !== 'string') continue;
      const key = `${page.url}|${v.id}|${target}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const cleanUrl = String(page.url).replace(/\s+\[state:[^\]]+\]$/, '');
      probes.push({ url: cleanUrl, rule: v.id, target, html: (node.html || '').slice(0, 140) });
    }
  }
}
console.log(`[probes] ${probes.length} incomplets à mesurer`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState, locale: 'en-US' });
const page = await ctx.newPage();
let currentUrl = null;
const results = [];

for (const p of probes) {
  if (p.url !== currentUrl) {
    const path = p.url.startsWith('http') ? p.url : baseUrl + p.url;
    await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(2000);
    currentUrl = p.url;
  }
  let verdict = 'N-A', details = '';
  if (p.rule === 'color-contrast') {
    const m = await page.evaluate(`(${MEASURE})(${JSON.stringify(p.target)})`).catch(e => ({ err: String(e).slice(0, 80) }));
    if (m.err || m.found === false) { verdict = 'N-A'; details = `sélecteur absent: ${p.target.slice(0,50)}`; }
    else if (!m.visible) { verdict = 'N-A'; details = `invisible (0x0)`; }
    else { verdict = m.ratio >= m.needed ? 'PASS' : 'FAIL'; details = `${m.ratio}:1 vs ${m.needed} requis fg=${m.fg} bg=${m.bg}`; }
  } else {
    details = `règle ${p.rule} — pas de mesure manuelle implémentée`;
  }
  results.push({ ...p, verdict, details });
}

await browser.close();
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
const counts = results.reduce((a, r) => { a[r.verdict] = (a[r.verdict] || 0) + 1; return a; }, {});
console.log('[probes]', JSON.stringify(counts), '->', outPath);
process.exit(results.some(r => r.verdict === 'FAIL') ? 1 : 0);
