import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/details?id=a7cc2a4fb6f159ad3b5acbf3d0a690df', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
const r = await page.evaluate(() => {
    const a = document.querySelector('.defaultCardBackground4');
    if (!a) return 'MISSING';
    return { aria: a.getAttribute('aria-label'), inner: a.innerText, outer: a.outerHTML.slice(0, 600) };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
