import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/dashboard/activity', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const r = await page.evaluate(() => {
    const all = [...document.querySelectorAll('.MuiTableSortLabel-root')];
    return all.map(l => { const s = getComputedStyle(l); const b = l.getBoundingClientRect(); return { label: l.getAttribute('aria-label'), w: +b.width.toFixed(1), h: +b.height.toFixed(1), display: s.display, vis: s.visibility }; });
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
