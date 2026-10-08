import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/dashboard/devices', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const r = await page.evaluate(() => {
    return [...document.querySelectorAll('th')].map(th => `${th.cellIndex}:${th.className.split(' ').pop()} w=${th.getBoundingClientRect().width.toFixed(0)} ah=${th.getAttribute('aria-hidden')} txt="${th.textContent.trim().slice(0,15)}" di=${th.getAttribute('data-index')}`);
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
