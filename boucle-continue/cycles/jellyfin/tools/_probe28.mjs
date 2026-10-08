import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/dashboard/devices', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const r = await page.evaluate(() => {
    const th = document.querySelector('th.css-18ds54y');
    if (!th) return 'MISSING';
    let path = []; let n = th;
    while (n && n.tagName !== 'BODY') { path.push(`${n.tagName.toLowerCase()}.${(n.className||'').toString().split(' ').slice(0,3).join('.')}[id=${n.id||''}]`); n = n.parentElement; }
    // siblings count in thead row + THEAD structure
    const thead = th.closest('thead');
    return { path: path.slice(0, 8), theadHtml: thead ? thead.outerHTML.slice(0, 1200) : 'none', thAttrs: th.getAttributeNames().map(a => `${a}=${th.getAttribute(a)}`) };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
