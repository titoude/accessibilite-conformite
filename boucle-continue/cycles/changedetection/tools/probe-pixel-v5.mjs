#!/usr/bin/env node
// probe-pixel-v5.mjs — sonde PIXEL-VRAIE du fixer v5 : mesure médiane des
// pixels propres (méthode probe-f1 v4) sur TOUTES les surfaces traitées :
// .status-pill, .box/add-watch-ui, #diff-form, .toggle-ai-mode,
// #checkbox-operations, #stats_row, #realtime-conn-error,
// #bottom-horizontal-offscreen, #llm-diff-summary-area, messages
// notice/warning/error/message/success, .stab-shell, .watch-tag-list, onglets.
// 2 thèmes (cookie css_dark_mode), exit 1 si un ratio < 4,5.
// Usage : node probe-pixel-v5.mjs <base> --uuid <api-docs-uuid> [--auth auth.json]
import { appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(join(dirname(fileURLToPath(import.meta.url)), 'package.json'));
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:5005').replace(/\/+$/, '');
const opt = n => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : null; };
const AUTH = opt('--auth') || join(dirname(fileURLToPath(import.meta.url)), 'auth.json');
const UUID = opt('--uuid');
const OUT = opt('--out');

const parseRGB = s => { const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
const lum = c => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const over = (top, bot) => [Math.round(top[0] * top[3] + bot[0] * (1 - top[3])), Math.round(top[1] * top[3] + bot[1] * (1 - top[3])), Math.round(top[2] * top[3] + bot[2] * (1 - top[3]))];
const ratioOf = (fg, bg) => (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);

// ── plan de mesure : {page, force(page)->void avant collecte, sels:[{group,scope}]} ──
const PLAN = () => [
  {
    page: '/', name: 'topbar',
    sels: [
      ['.status-pill', 'status-pill'],
      ['.toggle-ai-mode', 'ai-toggle'],
      ['header .topbar-title, header h1, header a', 'topbar-text'],
      ['.watch-tag-list a, .watch-tag-list span, a.watch-tag-list', 'tag-chip'],
      ['.tabs li a', 'tabs'],
    ],
  },
  {
    page: '/', name: 'quick-add-box',
    sels: [
      ['#add-watch-ui', 'box'],
      ['#add-watch-ui label', 'box-label'],
      ['#add-watch-ui label strong', 'box-label-strong'],
      ['#add-watch-url-row', 'url-row'],
      ['#add-watch-ui input#url', 'url-input'],
      ['#add-watch-ui .add-watch-option-group', 'option-group'],
      ['#add-watch-ui .pure-form-message, #add-watch-ui .pure-form-message-inline', 'form-msg'],
      ['#add-watch-ui .muted', 'muted-in-box'],
      ['#add-watch-go', 'go-btn'],
    ],
  },
  {
    page: '/', name: 'watchlist-checked',
    force: async (page) => {
      await page.evaluate(() => {
        const cb = document.querySelector('#watch-list input[type=checkbox][name^="oid"], .watch-table input[type=checkbox]');
        if (cb && !cb.checked) cb.click();
      });
      await page.waitForSelector('#checkbox-operations', { state: 'visible', timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(300);
    },
    sels: [
      ['#checkbox-operations', 'ops-bar'],
      ['#checkbox-operations label, #checkbox-operations button, #checkbox-operations .select-wrap, #checkbox-operations .pure-checkbox', 'ops-item'],
      ['#stats_row', 'stats-row'],
      ['#stats_row .records-selected', 'records-chip'],
    ],
  },
  {
    page: '/', name: 'fixed-widgets',
    force: async (page) => {
      await page.evaluate(() => {
        const e = document.querySelector('#realtime-conn-error');
        if (e) e.style.display = 'block';
      });
      await page.waitForTimeout(200);
    },
    sels: [['#realtime-conn-error', 'conn-error']],
  },
  {
    page: '/', name: 'messages-injected',
    force: async (page) => {
      await page.evaluate(() => {
        document.querySelector('ul.messages.probe-v5')?.remove();
        const ul = document.createElement('ul');
        ul.className = 'messages probe-v5';
        ul.innerHTML = ['notice', 'warning', 'error', 'message', 'success', 'info']
          .map(c => `<li class="${c}">probe ${c} flash text</li>`).join('');
        document.querySelector('.content-main')?.prepend(ul);
      });
      // attendre la fin de l'animation slideDown/fade des toasts (~0.45 s)
      await page.waitForTimeout(900);
    },
    sels: [
      ['ul.messages.probe-v5 li.notice', 'msg-notice'],
      ['ul.messages.probe-v5 li.warning', 'msg-warning'],
      ['ul.messages.probe-v5 li.error', 'msg-error'],
      ['ul.messages.probe-v5 li.message', 'msg-message'],
      ['ul.messages.probe-v5 li.success', 'msg-success'],
    ],
    cleanup: async (page) => page.evaluate(() => document.querySelector('ul.messages.probe-v5')?.remove()),
  },
  {
    page: '/add-watch-ui/', name: 'add-watch-box',
    sels: [
      ['#add-watch-ui', 'box'],
      ['#add-watch-url-row label', 'url-label'],
      ['#add-watch-url-row', 'url-row'],
      ['#url', 'url-input'],
      ['#add-watch-selector-pane .pure-button', 'selector-btn'],
      ['#add-watch-options-pane .advanced-options', 'advanced-opts'],
      ['#add-watch-options-pane .tag-text', 'tag-text'],
      ['#add-watch-options-pane .pure-form-message, #add-watch-ui .pure-form-message-inline', 'form-msg'],
      ['#fetch-method-fieldset', 'fetch-fieldset'],
      ['#add-watch-submit-row', 'submit-wrap'],
      ['#add-watch-ui .muted', 'muted-in-box'],
    ],
  },

  {
    page: `/diff/${UUID}`, name: 'diff-form',
    sels: [
      ['#diff-form', 'diff-form'],
      ['#diff-form .diff-form-compared', 'compared-text'],
      ['#diff-form #diff-style span', 'style-chips'],
      ['#diff-form label.from-to-label', 'version-chips'],
      ['#diff-form a, #diff-form label:not(.from-to-label)', 'form-links'],
      ['.tabs li a', 'tabs'],
    ],
  },
  {
    page: `/diff/${UUID}`, name: 'diff-widgets',
    force: async (page) => {
      await page.evaluate(() => {
        const b = document.querySelector('#bottom-horizontal-offscreen');
        if (b) b.style.display = 'flex';
        const l = document.querySelector('#llm-diff-summary-area');
        if (l) {
          l.style.display = 'block';
          if (!l.querySelector('.llm-diff-summary-text')) {
            l.innerHTML = '<span class="llm-diff-summary-label">AI SUMMARY</span>' +
              '<p class="llm-diff-summary-text">Probe summary text on opaque banner.</p>';
          }
        }
      });
      await page.waitForTimeout(200);
    },
    sels: [
      ['#bottom-horizontal-offscreen', 'offscreen-bar'],
      ['#bottom-horizontal-offscreen button, #bottom-horizontal-offscreen label, #bottom-horizontal-offscreen .pure-button', 'offscreen-item'],
      ['#llm-diff-summary-area .llm-diff-summary-label', 'llm-label'],
      ['#llm-diff-summary-area .llm-diff-summary-text', 'llm-text'],
    ],
  },
  {
    page: '/settings', name: 'stab-shell',
    force: async (page) => {
      await page.evaluate(() => {
        const a = document.querySelector('.tabs a[href="#ai"]');
        if (a) a.click();
      });
      await page.waitForTimeout(500);
      await page.waitForSelector('.stab-shell', { timeout: 8000 }).catch(() => {});
    },
    sels: [
      ['.stab-shell .stab-btn', 'stab-btn'],
      ['.stab-shell .stab-pane, .stab-shell .stab-body', 'stab-body'],
      ['.stab-shell', 'stab-shell'],
    ],
  },
];

const collect = (sels) => pageEvaluateCollect(sels);
async function pageEvaluateCollect(sels) {
  return page.evaluate((sels) => {
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
    const LEAF = new Set(['small', 'strong', 'em', 'a', 'code', 'th', 'button', 'label', 'span', 'h2', 'h3', 'h4', 'i', 'b', 'li', 'p', 'legend', 'div']);
    const measure = (el, group) => {
      if (!el || seen.has(el)) return;
      seen.add(el);
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const tag = el.tagName.toLowerCase();
      const direct = [...el.childNodes].some(n => n.nodeType === 3 && /\S/.test(n.nodeValue));
      if (!direct && !LEAF.has(tag)) return;
      if (!(el.innerText || '').trim()) return;
      const par = el.parentElement;
      items.push({
        group,
        sel: tag + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
        text: (el.innerText || '').trim().slice(0, 60),
        fg: cs.color, ownBg: cs.backgroundColor, alpha: effOpacity(el),
        rect: box(r), ink: inkRects(el), ownDesc: descBoxes(el),
        parRect: par ? box(par.getBoundingClientRect()) : null,
        parInk: par ? inkRects(par) : [],
        parDesc: par ? descBoxes(par) : [],
      });
    };
    for (const [sel, group] of sels) {
      for (const el of document.querySelectorAll(sel)) measure(el, group);
    }
    return items;
  }, sels);
}

const sampleAll = (pngB64, items) => page.evaluate(async ({ pngB64, items }) => {
  const img = new Image();
  img.src = 'data:image/png;base64,' + pngB64;
  await img.decode();
  const cv = document.createElement('canvas');
  cv.width = img.naturalWidth; cv.height = img.naturalHeight;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0);
  const D = cx.getImageData(0, 0, cv.width, cv.height).data;
  const W = cv.width;
  const med = a => { a.sort((x, y) => x - y); const m = a.length >> 1; return a.length ? (a.length % 2 ? a[m] : Math.round((a[m - 1] + a[m]) / 2)) : null; };
  const inside = (x, y, rc, pad) => x >= rc[0] - pad && x <= rc[0] + rc[2] + pad && y >= rc[1] - pad && y <= rc[1] + rc[3] + pad;
  const sample = (rect, excludes, pad) => {
    const x0 = Math.max(0, Math.floor(rect[0] + 1.5)), y0 = Math.max(0, Math.floor(rect[1] + 1.5));
    const x1 = Math.min(W, Math.ceil(rect[0] + rect[2] - 1.5)), y1 = Math.min(cv.height, Math.ceil(rect[1] + rect[3] - 1.5));
    const rs = [], gs = [], bs = [];
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      if (excludes.some(rc => inside(x + 0.5, y + 0.5, rc, pad))) continue;
      const i = (y * W + x) * 4;
      if (D[i + 3] < 250) continue;
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
  if (it.selfPx && it.selfN >= MIN_PX) return { px: it.selfPx, src: 'self', n: it.selfN };
  const own = parseRGB(it.ownBg);
  if (own && own[3] > 0 && own[3] < 1 && it.parPx) return { px: over(own, it.parPx), src: 'folded-ownbg', n: it.parN };
  if (it.parPx && it.parN >= MIN_PX) return { px: it.parPx, src: 'parent', n: it.parN };
  if (it.selfPx) return { px: it.selfPx, src: 'self-thin', n: it.selfN };
  if (it.parPx) return { px: it.parPx, src: 'parent-thin', n: it.parN };
  return { px: null, src: 'none', n: 0 };
};

let worst = Infinity;
const recs = [];
const emit = rec => {
  const line = JSON.stringify(rec);
  console.log(line);
  if (OUT) appendFileSync(OUT, line + '\n');
  recs.push(rec);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH, viewport: { width: 1365, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

const runPlan = async (theme) => {
  for (const step of PLAN()) {
    if (!UUID && (step.page.startsWith('/diff/') || step.page.startsWith('/edit/'))) continue;
    await page.goto(BASE + step.page, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    // rail .action-sidebar : écarter la souris (occlusion amont au survol)
    await page.mouse.move(1200, 40);
    await page.waitForTimeout(300);
    if (step.force) await step.force(page);
    await page.mouse.move(1200, 40);
    const items = await collect(step.sels);
    if (!items.length) { emit({ theme, plan: step.name, error: 'no-items' }); continue; }
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
      if (!fg || !bg.px) { emit({ theme, plan: step.name, sel: it.sel, text: it.text, error: 'no-bg' }); continue; }
      const eff = [Math.round(fg[0] * it.alpha + bg.px[0] * (1 - it.alpha)),
                   Math.round(fg[1] * it.alpha + bg.px[1] * (1 - it.alpha)),
                   Math.round(fg[2] * it.alpha + bg.px[2] * (1 - it.alpha))];
      const ratio = ratioOf(eff, bg.px);
      emit({ theme, plan: step.name, sel: it.sel, text: it.text, fg: it.fg, alpha: +it.alpha.toFixed(2), ownBg: it.ownBg, bgPixel: bg.px, bgSrc: bg.src, bgN: bg.n, effFg: eff, ratio: +ratio.toFixed(2) });
      if (ratio < worst) worst = ratio;
    }
    if (step.cleanup) await step.cleanup(page);
  }
};

await page.goto(`${BASE}/`, { waitUntil: 'load' });
await page.waitForSelector('.status-pill, .toggle-ai-mode', { timeout: 20000 });
await runPlan('clair');
await ctx.addCookies([{ name: 'css_dark_mode', value: 'true', url: BASE }]);
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('html[data-darkmode="true"]', { timeout: 10000 });
await runPlan('sombre');
// restaure la préférence client (leçon 28)
await ctx.addCookies([{ name: 'css_dark_mode', value: 'false', url: BASE }]);
await page.reload({ waitUntil: 'load' }).catch(() => {});
await browser.close();
console.log(JSON.stringify({ measures: recs.length, worst: worst === Infinity ? null : +worst.toFixed(2), under45: recs.filter(r => r.ratio !== undefined && r.ratio < 4.5).length }));
if (!recs.length) { console.error('AUCUNE mesure produite'); process.exit(2); }
process.exit(worst >= 4.5 ? 0 : 1);
