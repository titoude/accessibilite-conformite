#!/usr/bin/env node
/**
 * measure-badges.mjs — cycle 57 v2. Matrice complète .badge-statusN.
 * (a) parse la CSS GÉNÉRÉE par le serveur (/theme/<t>/style.css.php) et
 *     calcule le ratio texte/fond de chaque variante (borderOnly -> fond page).
 * (b) mesure les badges réellement rendus en DOM sur la liste factures.
 * Usage: node measure-badges.mjs <baseUrl> [auth.json] [eldy,md]
 */
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(HERE, 'package.json'));
const { chromium } = require('playwright');

const base = (process.argv[2] || 'http://localhost:9800').replace(/\/$/, '');
const authPath = process.argv[3] || resolve(HERE, 'auth.json');
const themes = (process.argv[4] || 'eldy,md').split(',');

const parse = c => {
  if (!c) return null;
  let m = c.match(/#([0-9a-f]{6})/i);
  if (m) { const n = parseInt(m[1], 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 }; }
  m = c.match(/rgba?\(([^)]+)\)/);
  if (m) { const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
  if (/hsl\(0, 0%, 0%, 0\)|transparent/.test(c)) return { r: 0, g: 0, b: 0, a: 0 };
  return null;
};
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const browser = await chromium.launch();
const page = await (await browser.newContext({ locale: 'en-US', storageState: authPath })).newPage();

// ---- (a) CSS générée par thème ----
for (const th of themes) {
  await page.goto(`${base}/admin/ihm.php?mode=js&theme=${th}`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  // fetch style.css.php dans le contexte authentifié (cookie session)
  const css = await page.evaluate(async (th) => {
    const r = await fetch(`/theme/${th}/style.css.php`, { credentials: 'same-origin' });
    return r.ok ? await r.text() : '';
  }, th);
  if (!css) { console.log(`[${th}] style.css.php illisible (non authentifié?)`); continue; }
  const re = /\.badge-status(\w+)\s*\{([^}]+)\}/g;
  let m;
  const rows = [];
  while ((m = re.exec(css))) {
    const body = m[2];
    const fg = parse((body.match(/color:\s*([^;!]+)/) || [])[1]);
    const bgc = (body.match(/background-color:\s*([^;!]+)/) || [])[1];
    let bg = parse(bgc) || { r: 255, g: 255, b: 255, a: 1 };
    if (bg.a === 0) bg = { r: 255, g: 255, b: 255, a: 1 }; // borderOnly -> fond page clair
    const cr = fg ? +ratio(lum(fg), lum(bg)).toFixed(2) : null;
    rows.push({ s: m[1], fg: fg && `rgb(${fg.r},${fg.g},${fg.b})`, bg: (bgc || '').trim(), cr });
  }
  rows.sort((a, b) => a.s.localeCompare(b.s, undefined, { numeric: true }));
  console.log(`\n[${th}] ${rows.length} variantes .badge-statusN (CSS générée)`);
  let bad = 0;
  for (const r of rows) { const flag = r.cr !== null && r.cr < 4.5 ? '  <4.5' : ''; if (flag) bad++; console.log(`  .badge-status${r.s.padEnd(3)} fg=${(r.fg || '?').padEnd(18)} bg=${(r.bg || 'transparent').padEnd(22)} ${r.cr}:1${flag}`); }
  console.log(`[${th}] ${bad} variante(s) < 4.5:1`);
}

// ---- (b) DOM réel : liste factures ----
await page.goto(`${base}/compta/facture/list.php`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#id-right', { timeout: 25000 });
await page.waitForTimeout(800);
const dom = await page.evaluate(() => [...document.querySelectorAll('.badge-status')].map(b => {
  const st = getComputedStyle(b);
  return { cls: [...b.classList].join(' '), txt: (b.innerText || '').trim().slice(0, 30), fg: st.color, bg: st.backgroundColor };
}));
console.log(`\n[DOM] ${dom.length} badge(s) sur la liste factures :`);
for (const b of dom) console.log(`  ${b.cls} "${b.txt}" fg=${b.fg} bg=${b.bg}`);
await browser.close();
