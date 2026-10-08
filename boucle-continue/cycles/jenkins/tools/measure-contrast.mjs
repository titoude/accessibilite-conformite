// Mesure de contraste WCAG réel pour une liste de sélecteurs.
// Usage: node measure-contrast.mjs <base> <storageState> <urlPath> <sel1,sel2,...>
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const [base, stateFile, urlPath, sels] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: stateFile });
const page = await ctx.newPage();
await page.goto(base + urlPath, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const out = await page.evaluate((sels) => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+))?/);
    if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
    const s = /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/.exec(c || '');
    if (s) return { r: +s[1] * 255, g: +s[2] * 255, b: +s[3] * 255, a: s[4] === undefined ? 1 : +s[4] };
    const o = /oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+))?\)/.exec(c || '');
    if (o) {
      const L = Number(o[1]) > 1 ? Number(o[1]) / 100 : Number(o[1]);
      const hr = Number(o[3]) * Math.PI / 180;
      const aa = Number(o[2]) * Math.cos(hr), bb = Number(o[2]) * Math.sin(hr);
      const l_ = Math.pow(L + 0.3963377774 * aa + 0.2158037573 * bb, 3);
      const m_ = Math.pow(L - 0.1055613458 * aa - 0.0638541728 * bb, 3);
      const s_ = Math.pow(L - 0.0894841775 * aa - 1.2914855480 * bb, 3);
      const lin = (v) => Math.max(0, Math.min(255, (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255));
      return {
        r: lin(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
        g: lin(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
        b: lin(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_),
        a: o[4] === undefined ? 1 : Number(o[4]),
      };
    }
    return null;
  };
  const composite = (fg, bg) => {
    const a = fg.a + bg.a * (1 - fg.a);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    // propager l'alpha : la couche composée doit rester opaque pour les plis suivants
    return {
      r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
      g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
      b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
      a,
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
