import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/home', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const r = await page.evaluate(() => {
    const a = document.querySelector('a[aria-label="Sample Series"]');
    if (!a) return 'MISSING';
    const ind = a.querySelector('.cardIndicators');
    const all = [...a.querySelectorAll('*')].filter(e => e.textContent.trim()).map(e => `${e.tagName}.${e.className.split(' ')[0]} aria=${e.getAttribute('aria-hidden')} text="${e.textContent.trim().slice(0,20)}"`);
    return { outer: a.outerHTML.slice(0, 500), indHidden: ind?.getAttribute('aria-hidden'), all };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
