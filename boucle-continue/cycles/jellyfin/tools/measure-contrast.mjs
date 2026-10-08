// Mesure de contraste WCAG réel pour une liste de sélecteurs.
// Usage: node measure-contrast.mjs <base> <storageState> <urlPath> <sel1,sel2,...>
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(dirname(fileURLToPath(import.meta.url)), 'package.json'));
const { chromium } = require('playwright');

const [base, stateFile, urlPath, sels] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: stateFile, locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(base + urlPath, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const out = await page.evaluate((sels) => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+))?/);
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
  };
  const composite = (fg, bg) => {
    const a = fg.a + bg.a * (1 - fg.a);
    if (a === 0) return { r: 0, g: 0, b: 0 };
    return {
      r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
      g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
      b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
    };
  };
  const lum = (c) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  return sels.map((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { sel, error: 'not found' };
    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    // walk up to first opaque bg
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    let chain = [];
    let e = el;
    let layers = [];
    while (e && e !== document.documentElement) {
      const b = parse(getComputedStyle(e).backgroundColor);
      if (b && b.a > 0) { layers.push(b); chain.push(e.tagName + '.' + String(e.className).split(' ')[0]); }
      e = e.parentElement;
    }
    // composite all translucent layers onto opaque base
    let eff = layers.length && layers[layers.length - 1].a === 1 ? layers.pop() : { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) eff = composite(layers[i], eff);
    const L1 = lum(fg), L2 = lum(eff);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const rect = el.getBoundingClientRect();
    return { sel, text: (el.textContent || '').trim().slice(0, 40), fg: cs.color, effBg: `rgb(${eff.r | 0},${eff.g | 0},${eff.b | 0})`, bgChain: chain.join(' < '), ratio: +ratio.toFixed(2), fontSize: cs.fontSize, w: Math.round(rect.width), h: Math.round(rect.height) };
  });
}, sels.split(','));
console.log(JSON.stringify(out, null, 1));
await browser.close();
