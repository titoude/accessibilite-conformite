#!/usr/bin/env node
// probe-f1-queue.mjs — sonde F1 v4 : mesure PIXEL-VRAIE (leçon auditeur v3).
// La v3 pliait la chaîne backgroundColor des ancêtres DOM et ratait la couche
// fixe `body::after` (z-index -1, opacity .91) → fond rapporté ~#262626 alors
// que le pixel réel peint était le dégradé (2,8:1 mesuré). Ici le fond sous le
// texte est MESURÉ : screenshot Playwright du document, puis pour chaque texte
// médiane des pixels propres de la surface qui le porte —
//   · strip « soi »    : rect(élément) moins l'encre de ses textes moins les
//                        boîtes de ses descendants (td, th, .inline-tag, code…)
//   · strip « parent » : rect du parent moins son encre et les boîtes de tous
//                        ses descendants (inlines text-tight : small, strong…)
//   · repli « plié »   : si les deux strips < 40 px et que l'élément peint un
//                        fond rgba uniforme, bg = son backgroundColor composité
//                        sur le pixel parent (exact pour un voile uniforme).
// fg = couleur computed × opacité effective (élément × ancêtres) ; le ratio est
// calculé sur le fond pixel-vrai. Déclenche de vrais rechecks via l'API
// (x-api-key lu du datastore), /queue authentifié dans les DEUX thèmes
// (cookie css_dark_mode), deux passes (tôt : busy/queued, tard : is-completed).
// Usage : node probe-f1-queue.mjs <base> <apikey> --uuids u1,u2,… [--auth auth.json]
// Sortie : JSON lines {theme, when, kind, text, fg, alpha, bgPixel, ratio} ;
// exit 1 si un échantillon hors is-completed < 4,5:1 ; exit 2 si aucune row
// busy/queued capturée.
import { appendFileSync } from 'node:fs';
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
const OUT = opt('--out');
if (!API_KEY || !UUIDS.length) {
  console.error('usage: probe-f1-queue.mjs <base> <apikey> --uuids u1,u2,... [--auth auth.json] [--out report.jsonl]');
  process.exit(2);
}

const parseRGB = s => { const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
const lum = c => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const over = (top, bot) => [Math.round(top[0] * top[3] + bot[0] * (1 - top[3])), Math.round(top[1] * top[3] + bot[1] * (1 - top[3])), Math.round(top[2] * top[3] + bot[2] * (1 - top[3]))];
const ratioOf = (fg, bg) => (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH, viewport: { width: 1280, height: 1600 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

// Collecte dans la page : pour chaque élément porteur de texte dans
// #queue-page → rect, encre (Range sur nœuds texte), rect parent + boîtes des
// descendants du parent (à exclure du strip), couleur computed et opacité
// effective (élément × ancêtres).
const collect = () => page.evaluate(() => {
  const seen = new Set();
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

  const LEAF = new Set(['small', 'strong', 'em', 'a', 'code', 'th', 'button', 'label', 'span', 'h2', 'h3', 'h4', 'i', 'b']);
  const measure = (el, group, rowCls) => {
    if (!el || seen.has(el)) return;
    seen.add(el);
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const direct = [...el.childNodes].some(n => n.nodeType === 3 && /\S/.test(n.nodeValue));
    const tag = el.tagName.toLowerCase();
    if (!direct && !LEAF.has(tag)) return;
    if (!(el.innerText || '').trim()) return;
    const par = el.parentElement;
    items.push({
      group, rowCls,
      sel: tag + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
      text: (el.innerText || '').trim().slice(0, 48),
      fg: cs.color, ownBg: cs.backgroundColor, alpha: effOpacity(el),
      rect: box(r), ink: inkRects(el), ownDesc: descBoxes(el),
      parRect: par ? box(par.getBoundingClientRect()) : null,
      parInk: par ? inkRects(par) : [],
      parDesc: par ? descBoxes(par) : [],
    });
  };

  for (const tr of document.querySelectorAll('#queue-page tbody tr')) {
    const cls = tr.className || '';
    for (const cell of tr.querySelectorAll('td, th')) {
      measure(cell, 'row', cls); // texte direct (n° de position, —, etc.)
      for (const e of cell.querySelectorAll('small, strong, em, a, code, span, div, button')) measure(e, 'row', cls);
    }
  }
  for (const th of document.querySelectorAll('#queue-page thead th')) measure(th, 'thead', '');
  for (const e of document.querySelectorAll(
    '#queue-page .queue-panel h2, #queue-page .queue-panel h3, #queue-page .queue-stat .label, ' +
    '#queue-page .queue-stat .value, #queue-page .queue-waiting span, ' +
    '#queue-page .queue-panel > div, #queue-page .queue-panel p, #queue-page .queue-panel a, #queue-page .queue-panel button')) {
    measure(e, 'panel', '');
  }
  return items;
});

// Décode le screenshot en page (canvas) et échantillonne la médiane des pixels
// propres pour chaque item.
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
      if (D[i + 3] < 250) continue; // jamais arrivé en viewport opaque
      rs.push(D[i]); gs.push(D[i + 1]); bs.push(D[i + 2]);
    }
    return rs.length ? { px: [med(rs), med(gs), med(bs)], n: rs.length } : { px: null, n: 0 };
  };
  const out = [];
  for (const it of items) {
    const self = sample(it.rect, [...it.ink, ...it.ownDesc], 1.5);
    const par = it.parRect ? sample(it.parRect, [...it.parInk, ...it.parDesc], 1.5) : { px: null, n: 0 };
    out.push({ ...it, selfPx: self.px, selfN: self.n, parPx: par.px, parN: par.n });
  }
  return out;
}, { pngB64, items });

const MIN_PX = 40;
const resolveBg = (it) => {
  // strip « soi » = pixels de la surface de l'élément (couvre son propre fond
  // peint : .inline-tag, code, stripes td) — prioritaire dès qu'il a assez de
  // pixels propres.
  if (it.selfPx && it.selfN >= MIN_PX) return { px: it.selfPx, src: 'self', n: it.selfN };
  // élément à fond rgba propre mais strip trop serré → composite exact du voile
  // sur le pixel parent.
  const own = parseRGB(it.ownBg);
  if (own && own[3] > 0 && own[3] < 1 && it.parPx) {
    return { px: over(own, it.parPx), src: 'folded-ownbg', n: it.parN };
  }
  // élément sans fond propre (small, strong, texte direct td) : le pixel peint
  // derrière son texte = la surface du parent.
  if (it.parPx && it.parN >= MIN_PX) return { px: it.parPx, src: 'parent', n: it.parN };
  if (it.selfPx) return { px: it.selfPx, src: 'self-thin', n: it.selfN };
  if (it.parPx) return { px: it.parPx, src: 'parent-thin', n: it.parN };
  return { px: null, src: 'none', n: 0 };
};

let worst = Infinity;
const saw = { busy: 0, queued: 0, completed: 0, idle: 0, static: 0 };
const thin = [];
const emit = (rec) => {
  const line = JSON.stringify(rec);
  console.log(line);
  if (OUT) appendFileSync(OUT, line + '\n');
};

const measure = async (theme) => {
  for (const u of UUIDS) {
    await page.request.get(`${BASE}/api/v1/watch/${u}?recheck=true`, { headers: { 'x-api-key': API_KEY } }).catch(() => {});
  }
  await page.waitForSelector('#queue-page tr.worker-busy .watch-cell small, #queue-page tbody tr:not(.worker-idle) .watch-cell small', { timeout: 45000 });

  for (const when of ['early', 'late']) {
    await page.waitForTimeout(when === 'early' ? 400 : 12000);
    // Le rail .action-sidebar s'étend au :hover (souris Playwright figée à
    // 0,0 → survol permanent) et recouvre la colonne '#' : occlusion amont,
    // pas un contraste. Écarter la souris et laisser le rail se refermer
    // (transition .22s) avant de photographier la page au repos.
    await page.mouse.move(1200, 40);
    await page.waitForTimeout(400);
    const items = await collect();
    if (!items.length) continue;
    const shot = await page.screenshot({ type: 'png', fullPage: true });
    const scrollY = await page.evaluate(() => window.scrollY);
    // fullPage : coordonnées document = rect viewport + scrollY
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
      const kind = it.group !== 'row' ? 'static'
        : /worker-busy/.test(it.rowCls) ? 'busy'
        : /is-completed/.test(it.rowCls) ? 'completed'
        : /worker-idle/.test(it.rowCls) ? 'idle' : 'queued';
      saw[kind] = (saw[kind] || 0) + 1;
      if (bg.src.endsWith('thin')) thin.push({ theme, sel: it.sel, text: it.text, n: bg.n });
      emit({ theme, when, kind, cls: it.rowCls, sel: it.sel, text: it.text, fg: it.fg, alpha: +it.alpha.toFixed(2), ownBg: it.ownBg, bgPixel: bg.px, bgSrc: bg.src, bgN: bg.n, effFg: eff, ratio: +ratio.toFixed(2) });
      if (kind !== 'completed' && ratio < worst) worst = ratio;
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
// restaure la préférence client (leçon 28)
await ctx.addCookies([{ name: 'css_dark_mode', value: 'false', url: BASE }]);
await page.reload({ waitUntil: 'load' }).catch(() => {});
await browser.close();
const summary = { saw, worstNonCompletedRatio: worst === Infinity ? null : +worst.toFixed(2), thinStrips: thin.length };
console.log(JSON.stringify(summary));
if (!saw.busy && !saw.queued) { console.error('AUCUNE row busy/queued capturée — preuve non produite'); process.exit(2); }
if (thin.length) console.error('ATTENTION strips minces : ' + JSON.stringify(thin.slice(0, 5)));
process.exit(worst >= 4.5 ? 0 : 1);
