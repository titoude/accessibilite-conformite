#!/usr/bin/env node
// probe-f2-proxy.mjs — sonde F2 v4 (wart W-hunt auditeur v3) : mesure
// PIXEL-VRAIE du statut transitoire injecté par recheck-proxy.js
// (.proxy-check-err « X » / .proxy-check-ok « OK » / détails / timing) sur la
// carte `.box-wrap.inner` de /edit/<uuid>#request, dans les DEUX thèmes.
// Même méthode que probe-f1-queue v4 : screenshot Playwright puis médiane des
// pixels propres de la surface (strip « soi » ou « parent »), jamais un pliage
// d'ancêtres DOM seul.
// Déclenche « Check/Scan all » ; le proxy seedé (http://127.0.0.1:3128, port
// mort) force un statut ERROR/ERROR OTHER → X mesurable. Un proxy sain
// produirait OK — les deux sont mesurés et doivent passer.
// Usage : node probe-f2-proxy.mjs <base> --edit-uuid <uuid> [--auth auth.json]
//         [--out report.jsonl]
// Exit 1 si un échantillon < 4,5:1 ; exit 2 si aucun statut terminal capturé.
import { appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(join(dirname(fileURLToPath(import.meta.url)), 'package.json'));
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:5005').replace(/\/+$/, '');
const opt = n => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : null; };
const AUTH = opt('--auth') || join(dirname(fileURLToPath(import.meta.url)), 'auth.json');
const EDIT_UUID = opt('--edit-uuid');
const OUT = opt('--out');
if (!EDIT_UUID) {
  console.error('usage: probe-f2-proxy.mjs <base> --edit-uuid <uuid> [--auth auth.json] [--out report.jsonl]');
  process.exit(2);
}

const parseRGB = s => { const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
const lum = c => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const over = (top, bot) => [Math.round(top[0] * top[3] + bot[0] * (1 - top[3])), Math.round(top[1] * top[3] + bot[1] * (1 - top[3])), Math.round(top[2] * top[3] + bot[2] * (1 - top[3]))];
const ratioOf = (fg, bg) => (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH, viewport: { width: 1280, height: 1600 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

const collect = () => page.evaluate(() => {
  const items = [];
  const box = r => [r.left, r.top, r.width, r.height];
  const inkRects = el => {
    const rs = [];
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      if (!/\S/.test(n.nodeValue)) continue;
      const rg = document.createRange();
      rg.selectNodeContents(n);
      for (const rc of rg.getClientRects()) if (rc.width > 0 && rc.height > 0) rs.push(box(rc));
    }
    return rs;
  };
  const effOpacity = el => { let a = 1; for (let n = el; n && n !== document.documentElement; n = n.parentElement) a *= parseFloat(getComputedStyle(n).opacity); return a; };
  const descBoxes = el => [...el.querySelectorAll('*')].map(d => box(d.getBoundingClientRect()));
  const measure = (el, kind) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || !(el.innerText || '').trim()) return;
    const par = el.parentElement;
    const gp = par && par.parentElement;
    items.push({
      kind,
      sel: el.tagName.toLowerCase() + '.' + (el.className || '').trim().split(/\s+/).join('.'),
      text: (el.innerText || '').trim().slice(0, 48),
      fg: cs.color, ownBg: cs.backgroundColor, alpha: effOpacity(el),
      rect: box(r), ink: inkRects(el), ownDesc: descBoxes(el),
      parRect: par ? box(par.getBoundingClientRect()) : null,
      parInk: par ? inkRects(par) : [],
      parDesc: par ? descBoxes(par) : [],
      gpRect: gp ? box(gp.getBoundingClientRect()) : null,
      gpInk: gp ? inkRects(gp) : [],
      gpDesc: gp ? descBoxes(gp) : [],
    });
  };
  for (const s of document.querySelectorAll('#request .proxy-status .proxy-check-ok')) measure(s, 'status-ok');
  for (const s of document.querySelectorAll('#request .proxy-status .proxy-check-err')) measure(s, 'status-err');
  for (const s of document.querySelectorAll('#request .proxy-check-details')) measure(s, 'details');
  for (const s of document.querySelectorAll('#request .proxy-timing')) measure(s, 'timing');
  return items;
});

const sampleAll = (pngB64, items) => page.evaluate(async ({ pngB64, items }) => {
  const img = new Image();
  img.src = 'data:image/png;base64,' + pngB64;
  await img.decode();
  const cv = document.createElement('canvas');
  cv.width = img.naturalWidth; cv.height = img.naturalHeight;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0);
  const D = cx.getImageData(0, 0, cv.width, cv.height).data;
  const W = cv.width, H = cv.height;
  const med = a => { a.sort((x, y) => x - y); const m = a.length >> 1; return a.length ? (a.length % 2 ? a[m] : Math.round((a[m - 1] + a[m]) / 2)) : null; };
  const inside = (x, y, rc, pad) => x >= rc[0] - pad && x <= rc[0] + rc[2] + pad && y >= rc[1] - pad && y <= rc[1] + rc[3] + pad;
  const sample = (rect, excludes, pad) => {
    const x0 = Math.max(0, Math.floor(rect[0] + 1.5)), y0 = Math.max(0, Math.floor(rect[1] + 1.5));
    const x1 = Math.min(W, Math.ceil(rect[0] + rect[2] - 1.5)), y1 = Math.min(H, Math.ceil(rect[1] + rect[3] - 1.5));
    const rs = [], gs = [], bs = [];
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      if (excludes.some(rc => inside(x + 0.5, y + 0.5, rc, pad))) continue;
      const i = (y * W + x) * 4;
      if (D[i + 3] < 250) continue;
      rs.push(D[i]); gs.push(D[i + 1]); bs.push(D[i + 2]);
    }
    return rs.length ? { px: [med(rs), med(gs), med(bs)], n: rs.length } : { px: null, n: 0 };
  };
  return items.map(it => {
    const self = sample(it.rect, [...it.ink, ...it.ownDesc], 1.5);
    const par = it.parRect ? sample(it.parRect, [...it.parInk, ...it.parDesc], 1.5) : { px: null, n: 0 };
    const gp = it.gpRect ? sample(it.gpRect, [...it.gpInk, ...it.gpDesc], 1.5) : { px: null, n: 0 };
    return { ...it, selfPx: self.px, selfN: self.n, parPx: par.px, parN: par.n, gpPx: gp.px, gpN: gp.n };
  });
}, { pngB64, items });

const MIN_PX = 40;
const resolveBg = it => {
  if (it.selfPx && it.selfN >= MIN_PX) return { px: it.selfPx, src: 'self', n: it.selfN };
  const own = parseRGB(it.ownBg);
  const anchor = it.parPx || it.gpPx;
  if (own && own[3] > 0 && own[3] < 1 && anchor) return { px: over(own, anchor), src: 'folded-ownbg', n: it.parN };
  if (it.parPx && it.parN >= MIN_PX) return { px: it.parPx, src: 'parent', n: it.parN };
  if (it.gpPx && it.gpN >= MIN_PX) return { px: it.gpPx, src: 'grandparent', n: it.gpN };
  if (it.selfPx) return { px: it.selfPx, src: 'self-thin', n: it.selfN };
  if (it.parPx) return { px: it.parPx, src: 'parent-thin', n: it.parN };
  if (it.gpPx) return { px: it.gpPx, src: 'grandparent-thin', n: it.gpN };
  return { px: null, src: 'none', n: 0 };
};

let worst = Infinity, terminal = 0;
const emit = rec => { const line = JSON.stringify(rec); console.log(line); if (OUT) appendFileSync(OUT, line + '\n'); };

const measure = async (theme, reload) => {
  if (reload) {
    // reload (pas goto : le cache navigateur resservirait la page de l'autre thème)
    await page.reload({ waitUntil: 'load' });
    await page.waitForSelector(`html[data-darkmode="${theme === 'sombre'}"]`, { timeout: 10000 });
  } else {
    await page.goto(`${BASE}/edit/${EDIT_UUID}#request`, { waitUntil: 'load' });
  }
  await page.waitForSelector('.tabs li.active a[href="#request"]', { timeout: 10000 });
  await page.waitForSelector('#request', { state: 'visible', timeout: 10000 });
  await page.click('#check-all-proxies');
  // Gate v5 (wart W-sonde-F2) : attendre que CHAQUE slot .proxy-status porte un
  // glyphe terminal, pas seulement le premier — le X du proxy mort peut
  // arriver ~30 s après le 1er OK et le gate exit 0 mentait alors.
  await page.waitForFunction(() => {
    const sts = [...document.querySelectorAll('#request .proxy-status')];
    return sts.length > 0 && sts.every(s => s.querySelector('.proxy-check-err, .proxy-check-ok'));
  }, null, { timeout: 120000 });
  await page.waitForTimeout(500); // laisse les détails/timing s'écrire
  const errSeen = await page.evaluate(() =>
    document.querySelectorAll('#request .proxy-status .proxy-check-err').length);
  if (!errSeen) {
    console.error(JSON.stringify({ theme, fatal: 'statuts terminaux capturés mais aucun .proxy-check-err — le proxy mort seedé (127.0.0.1:3128) n\'a pas produit le X requis' }));
    process.exit(2);
  }
  const items = await collect();
  const shot = await page.screenshot({ type: 'png', fullPage: true });
  const scrollY = await page.evaluate(() => window.scrollY);
  const itemsDoc = items.map(it => ({
    ...it,
    rect: [it.rect[0], it.rect[1] + scrollY, it.rect[2], it.rect[3]],
    ink: it.ink.map(r => [r[0], r[1] + scrollY, r[2], r[3]]),
    ownDesc: it.ownDesc.map(r => [r[0], r[1] + scrollY, r[2], r[3]]),
    parRect: it.parRect ? [it.parRect[0], it.parRect[1] + scrollY, it.parRect[2], it.parRect[3]] : null,
    parInk: it.parInk.map(r => [r[0], r[1] + scrollY, r[2], r[3]]),
    parDesc: it.parDesc.map(r => [r[0], r[1] + scrollY, r[2], r[3]]),
  }));
  const sampled = await sampleAll(shot.toString('base64'), itemsDoc);
  for (const it of sampled) {
    const fg = parseRGB(it.fg);
    const bg = resolveBg(it);
    if (!fg || !bg.px) continue;
    const eff = [Math.round(fg[0] * it.alpha + bg.px[0] * (1 - it.alpha)),
                 Math.round(fg[1] * it.alpha + bg.px[1] * (1 - it.alpha)),
                 Math.round(fg[2] * it.alpha + bg.px[2] * (1 - it.alpha))];
    const ratio = ratioOf(eff, bg.px);
    if (/^status-/.test(it.kind)) terminal++;
    emit({ theme, kind: it.kind, sel: it.sel, text: it.text, fg: it.fg, alpha: +it.alpha.toFixed(2), ownBg: it.ownBg, bgPixel: bg.px, bgSrc: bg.src, bgN: bg.n, effFg: eff, ratio: +ratio.toFixed(2) });
    if (ratio < worst) worst = ratio;
  }
};

await measure('clair');
await ctx.addCookies([{ name: 'css_dark_mode', value: 'true', url: BASE }]);
await measure('sombre', true);
await ctx.addCookies([{ name: 'css_dark_mode', value: 'false', url: BASE }]); // restauration (leçon 28)
await browser.close();
console.log(JSON.stringify({ terminalSpans: terminal, worstRatio: worst === Infinity ? null : +worst.toFixed(2) }));
if (!terminal) { console.error('AUCUN statut terminal capturé — preuve non produite'); process.exit(2); }
process.exit(worst >= 4.5 ? 0 : 1);
