import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/dashboard/activity', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const r = await page.evaluate(() => {
    const l = document.querySelector('.MuiTableSortLabel-root');
    if (!l) return 'none';
    const s = getComputedStyle(l); const b = l.getBoundingClientRect();
    return { w: b.width, h: b.height, minW: s.minWidth, minH: s.minHeight };
});
console.log(JSON.stringify(r));
await browser.close();
