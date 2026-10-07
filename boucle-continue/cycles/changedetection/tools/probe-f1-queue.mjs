#!/usr/bin/env node
// probe-f1-queue.mjs — sonde F1 v3 : mesure computed du <small> url des rows
// /queue JS-rendues (worker-busy / queued / is-completed) dans les DEUX thèmes.
// Déclenche de vrais rechecks via l'API (x-api-key lu du datastore), ouvre
// /queue authentifié et attend que updateFromSnapshot produise les rows.
// Usage : node probe-f1-queue.mjs <base> <apikey> --auth tools/auth.json \
//           --uuids uuid1,uuid2,uuid3,uuid4
// Sortie : JSON lines {theme, rowClass, fg, bg, ratio} ; exit 1 si un échantillon
// requis (busy/queued) < 4.5:1 — is-completed rapporté (row upstream à 0.45).
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(join(dirname(fileURLToPath(import.meta.url)), 'package.json'));
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:5005').replace(/\/+$/, '');
const API_KEY = process.argv[3];
const opt = n => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : null; };
const AUTH = opt('--auth') || join(dirname(fileURLToPath(import.meta.url)), 'auth.json');
const UUIDS = (opt('--uuids') || '').split(',').filter(Boolean);
if (!API_KEY || !UUIDS.length) {
  console.error('usage: probe-f1-queue.mjs <base> <apikey> --uuids u1,u2,... [--auth auth.json]');
  process.exit(2);
}

const parseRGB = s => { const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
const lum = c => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();

// Mesure toutes les rows visibles : classe tr, inline style du <small>,
// couleur computed, alpha propre (opacity small × opacity tr), fond effectif.
const snapshot = () => page.evaluate(() => {
  const out = [];
  for (const tr of document.querySelectorAll('#queue-page tbody tr')) {
    const small = tr.querySelector('.watch-cell small, td small');
    if (!small) continue;
    const cs = getComputedStyle(small);
    const trCs = getComputedStyle(tr);
    // fond effectif : plie les couches alpha top→down (td stripe > table > page)
    const chain = [];
    let n = small;
    while (n) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') chain.unshift(c);
      n = n.parentElement;
    }
    out.push({
      cls: tr.className || '(no-class)',
      inline: small.getAttribute('style') || '',
      fg: cs.color, opacity: parseFloat(cs.opacity) * parseFloat(trCs.opacity),
      bgChain: chain,
    });
  }
  return out;
});

const fold = (chain) => {
  let out = [255, 255, 255];
  for (const c of chain.map(parseRGB).filter(Boolean)) {
    out = [Math.round(c[0] * c[3] + out[0] * (1 - c[3])),
           Math.round(c[1] * c[3] + out[1] * (1 - c[3])),
           Math.round(c[2] * c[3] + out[2] * (1 - c[3]))];
  }
  return out;
};

let worst = Infinity, saw = { busy: 0, queued: 0, completed: 0 };
const measure = async (theme) => {
  // lance un recheck par watch : 4 workers → busy + queued ; completed en grâce
  for (const u of UUIDS) {
    await page.request.get(`${BASE}/api/v1/watch/${u}?recheck=true`, { headers: { 'x-api-key': API_KEY } }).catch(() => {});
  }
  // attend la 1re row JS re-rendue portant le <small> url (worker-busy ou queue)
  await page.waitForSelector('#queue-page tr.worker-busy .watch-cell small, #queue-page tbody tr:not(.worker-idle) .watch-cell small', { timeout: 45000 });
  // deux passes : tôt (busy/queued) puis ~25s plus tard (is-completed)
  for (const when of ['early', 'late']) {
    await page.waitForTimeout(when === 'early' ? 300 : 12000);
    const rows = await snapshot();
    for (const r of rows) {
      const fg = parseRGB(r.fg), bg = fold(r.bgChain);
      if (!fg) continue;
      const a = r.opacity;
      const eff = [Math.round(fg[0] * a + bg[0] * (1 - a)), Math.round(fg[1] * a + bg[1] * (1 - a)), Math.round(fg[2] * a + bg[2] * (1 - a))];
      const ratio = (Math.max(lum(eff), lum(bg)) + 0.05) / (Math.min(lum(eff), lum(bg)) + 0.05);
      const kind = /worker-busy/.test(r.cls) ? 'busy' : /is-completed/.test(r.cls) ? 'completed' : /worker-idle/.test(r.cls) ? 'idle' : 'queued';
      saw[kind] = (saw[kind] || 0) + 1;
      console.log(JSON.stringify({ theme, when, kind, cls: r.cls, inline: r.inline, fg: r.fg, opacity: a, bg, effFg: eff, ratio: +ratio.toFixed(2) }));
      if (kind !== 'completed' && kind !== 'idle' && ratio < worst) worst = ratio;
    }
  }
};

await page.goto(`${BASE}/queue`, { waitUntil: 'load' });
await page.waitForSelector('#queue-page', { timeout: 20000 });
await measure('clair');
await ctx.addCookies([{ name: 'css_dark_mode', value: 'true', url: BASE }]);
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('html[data-darkmode="true"]', { timeout: 10000 });
await page.waitForSelector('#queue-page', { timeout: 20000 });
await measure('sombre');
await browser.close();
console.log(JSON.stringify({ saw, worstNonCompletedRatio: worst === Infinity ? null : +worst.toFixed(2) }));
if (!saw.busy && !saw.queued) { console.error('AUCUNE row busy/queued capturée — preuve non produite'); process.exit(2); }
process.exit(worst >= 4.5 ? 0 : 1);
