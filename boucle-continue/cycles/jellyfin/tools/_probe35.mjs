import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/login', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
const r = await page.evaluate(() => ({
    hash: location.hash,
    inputs: [...document.querySelectorAll('input')].map(i => ({ id: i.id, vis: i.offsetParent !== null })).slice(0, 10),
    btns: [...document.querySelectorAll('button')].filter(b => b.offsetParent).map(b => (b.textContent || '').trim().slice(0, 30)).slice(0, 10),
    body: document.body.innerText.slice(0, 300)
}));
console.log(JSON.stringify(r, null, 1));
await browser.close();
