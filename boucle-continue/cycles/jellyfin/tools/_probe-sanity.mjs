import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 120)));
await page.goto('http://localhost:5961/web/index.html#/home', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const r = await page.evaluate(() => {
    const a = document.querySelector('.cardImageContainer[aria-label]');
    return { cards: document.querySelectorAll('.card').length, sample: a?.outerHTML?.slice(0, 300) };
});
console.log(JSON.stringify({ ...r, errors }));
await browser.close();
