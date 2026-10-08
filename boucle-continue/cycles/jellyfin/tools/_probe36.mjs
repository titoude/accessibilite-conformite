import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/login', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const r = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a.MuiButtonBase-root')].map(x => ({
        cls: x.className.slice(0, 80), href: x.getAttribute('href'), html: x.outerHTML.slice(0, 250),
        parent: x.parentElement?.className?.slice(0, 60)
    }));
    return a;
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
