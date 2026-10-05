// Sonde manuelle color-contrast pour les résultats "incomplets" d'axe.
// axe ne conclut pas quand le fond effectif est indéterminable (images,
// gradients, composants natifs). On recalcule le ratio WCAG 2.x à la main :
// fg = getComputedStyle(el).color ; bg = premier fond non-transparent en
// remontant les ancêtres (avec alpha compositing sur les couches rgba).
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://localhost:8080';

function parse(c) {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(',').map(x => parseFloat(x.trim()));
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
}
const lum = c => {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

const SCENARIOS = [
  { name: 'home', url: `${base}/`, setup: null, sel: ['#pasteExpiration', '#pasteFormatter', '#aboutbox', '#aboutbox i'] },
  { name: 'home-dark', url: `${base}/`, setup: async p => { await p.locator('label[for=bd-theme]').click(); await p.waitForFunction(() => document.documentElement.getAttribute('data-bs-theme') === 'dark', null, { timeout: 10000 }); }, sel: ['#pasteExpiration', '#pasteFormatter', '#aboutbox', '#aboutbox i'] },
  { name: 'home-mobile', url: `${base}/`, setup: async p => { await p.setViewportSize({ width: 390, height: 844 }); await p.locator('.navbar-toggler').click(); await p.waitForSelector('#navbar.show', { timeout: 10000 }); }, sel: ['#pasteExpiration', '#pasteFormatter'] },
  { name: 'burn-modal', url: `${base}/?09d52e8dde9aaba1#-7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2F`, setup: async p => { await p.waitForSelector('#loadconfirmmodal.show, #loadconfirmmodal[style*="display: block"]', { timeout: 15000 }); }, sel: ['#loadconfirmmodal .modal-title'] },
  { name: 'email-modal', url: `${base}/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C`, setup: async p => { await p.waitForSelector('#prettymessage:not(.hidden), #plaintext:not(.hidden)', { timeout: 15000 }); await p.locator('#emaillink').click({ timeout: 30000 }); await p.waitForSelector('#emailconfirmmodal.show', { timeout: 10000 }); }, sel: ['#emailconfirmmodal .modal-title', '#emailconfirm-timezone-current'] },
  { name: 'comment-reply', url: `${base}/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C`, setup: async p => { await p.waitForSelector('#commentcontainer .comment', { timeout: 15000 }); }, sel: ['#commentcontainer .comment .commentdata', '#commentcontainer .comment .commentmeta .nickname', '#commentcontainer .comment .commentmeta span[title]'] },
  { name: 'paste-links', url: `${base}/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C`, setup: async p => { await p.waitForSelector('#prettymessage:not(.hidden), #plaintext:not(.hidden)', { timeout: 15000 }); }, sel: ['#plaintext a', '#prettyprint a', '.commentdata a'] },
];

const b = await chromium.launch();
const out = [];
for (const s of SCENARIOS) {
  const ctx = await b.newContext();
  const page = await ctx.newPage();
  await page.goto(s.url, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3500);
  if (s.setup) await s.setup(page);
  for (const sel of s.sel) {
    const els = await page.$$(sel);
    if (!els.length) { out.push({ scenario: s.name, sel, verdict: 'ABSENT' }); continue; }
    for (let i = 0; i < els.length; i++) {
      const m = await els[i].evaluate(el => {
        const cs = getComputedStyle(el);
        // effective background: walk ancestors, compositing alpha layers
        let node = el;
        const layers = [];
        while (node && node !== document.documentElement) {
          const bcs = getComputedStyle(node);
          if (bcs.backgroundImage !== 'none') layers.push({ img: bcs.backgroundImage });
          const bg = bcs.backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') layers.push({ bg });
          node = node.parentElement;
        }
        // fallback body/html bg
        for (const root of [document.body, document.documentElement]) {
          const bcs = getComputedStyle(root).backgroundColor;
          if (bcs && bcs !== 'rgba(0, 0, 0, 0)') layers.push({ bg: bcs });
        }
        const r = el.getBoundingClientRect();
        return { fg: cs.color, fontSize: cs.fontSize, fontWeight: cs.fontWeight, layers, text: el.textContent.trim().slice(0, 40), w: r.width, h: r.height, opacity: cs.opacity };
      });
      // composite : fond effectif = couche opaque la plus profonde, puis les
      // couches semi-transparentes vers le haut — on itère de la racine vers
      // l'élément (les layers sont collectés élément→racine, donc inversés).
      const imgs = m.layers.filter(L => L.img).map(L => L.img.slice(0, 60));
      let bg = null;
      for (const L of [...m.layers].reverse()) {
        if (!L.bg) continue;
        const c = parse(L.bg);
        if (!c) continue;
        bg = bg === null ? { r: c.r, g: c.g, b: c.b }
          : { r: c.a * c.r + (1 - c.a) * bg.r, g: c.a * c.g + (1 - c.a) * bg.g, b: c.a * c.b + (1 - c.a) * bg.b };
      }
      if (bg === null) bg = { r: 255, g: 255, b: 255 }; // fallback page blanche
      const fg = parse(m.fg);
      const R = ratio(lum(fg), lum(bg));
      const large = parseFloat(m.fontSize) >= 24 || (parseFloat(m.fontSize) >= 18.66 && parseInt(m.fontWeight) >= 700);
      const req = large ? 3 : 4.5;
      out.push({ scenario: s.name, sel, idx: i, text: m.text, fg: m.fg, bgLayers: m.layers.length, bgImg: imgs.length ? imgs : undefined, ratio: +R.toFixed(2), large, verdict: R >= req ? 'PASS' : 'FAIL' });
    }
  }
  await ctx.close();
}
await b.close();
console.log(JSON.stringify({ generatedAt: new Date().toISOString(), probes: out }, null, 1));
const fails = out.filter(o => o.verdict === 'FAIL').length;
console.error(`probes: ${out.length} (${fails} FAIL)`);
