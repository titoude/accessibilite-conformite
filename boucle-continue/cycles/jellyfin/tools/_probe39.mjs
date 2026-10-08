import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/#/home', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.locator('button[aria-label="User Menu"]:visible').first().click();
await page.waitForTimeout(1200);
const m = await page.evaluate(() => {
    const menu = document.querySelector('#app-user-menu');
    let chain = [];
    let n = menu;
    for (let i = 0; i < 6 && n; i++) { chain.push(n.tagName + '.' + String(n.className).slice(0, 60) + ' role=' + n.getAttribute('role') + ' label=' + n.getAttribute('aria-label')); n = n.parentElement; }
    return { menuTag: menu?.tagName, chain, rects: menu?.getClientRects().length };
});
console.log(JSON.stringify(m, null, 1));
await browser.close();
