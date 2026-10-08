import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/movies?tab=0', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const r = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.css-g99rn3')];
    return els.map(e => ({ tag: e.tagName, aria: e.getAttribute('aria-controls'), label: e.getAttribute('aria-label'), role: e.getAttribute('role'), html: e.outerHTML.slice(0, 150) }));
});
console.log(JSON.stringify(r.slice(0, 8), null, 1));
await browser.close();
