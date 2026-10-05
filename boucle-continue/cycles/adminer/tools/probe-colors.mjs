import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json' });
const page = await ctx.newPage();
const urls = [
  'http://localhost:8080/adminer/',
  'http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite',
  'http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&select=books',
];
for (const u of urls) {
  await page.goto(u, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  console.log('===', u.slice(60));
  const data = await page.evaluate(() => {
    const sels = ['#h1', '#version', '.version', '.jush-op', 'a.jush-custom', '#links a', '#menu a', '.links a', '#breadcrumb a', 'a.edit', 'a.jush-help', '#logout', 'input[type=checkbox]', 'th a', 'td a'];
    const out = {};
    for (const s of sels) {
      const el = document.querySelector(s);
      if (!el) continue;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      out[s] = { color: cs.color, bg: cs.backgroundColor, fs: cs.fontSize, lh: cs.lineHeight, w: Math.round(r.width), h: Math.round(r.height), pad: cs.padding, text: el.textContent.trim().slice(0,30) };
    }
    return out;
  });
  for (const [k,v] of Object.entries(data)) console.log(k.padEnd(20), JSON.stringify(v));
}
await browser.close();
