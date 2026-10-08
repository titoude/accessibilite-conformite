import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/dashboard/activity', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const r = await page.evaluate(() => {
    const lab = document.querySelector('[aria-label="Sort by Level ascending"]');
    const act = document.querySelector('[aria-label="Column Actions"]');
    const lb = lab.getBoundingClientRect(), ab = act.getBoundingClientRect();
    const actWrap = act.closest('.Mui-TableHeadCell-Content-Actions');
    const s = getComputedStyle(actWrap), as = getComputedStyle(act);
    return { lab: { x: lb.x, w: lb.width }, act: { x: ab.x, w: ab.width }, wrap: { pos: s.position, right: s.right, opac: s.opacity }, actPos: as.position };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
