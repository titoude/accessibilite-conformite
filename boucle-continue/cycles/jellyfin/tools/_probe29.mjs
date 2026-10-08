import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/movies?tab=0', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const card = page.locator('.card:has(a:text-is("Alpha Squadron"))').first();
await card.locator('button.itemAction[data-action="menu"]').first().click();
await page.waitForSelector('.actionSheet', { timeout: 8000 });
await page.waitForTimeout(600);
const r = await page.evaluate(() => {
    const d = document.querySelector('.actionSheet');
    if (!d) return 'MISSING';
    return { labelledby: d.getAttribute('aria-labelledby'), label: d.getAttribute('aria-label'), role: d.getAttribute('role'), title: d.querySelector('.actionSheetTitle')?.outerHTML, h1: d.querySelector('h1')?.outerHTML, head: d.innerHTML.slice(0, 400) };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
