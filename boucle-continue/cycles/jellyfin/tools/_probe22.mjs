import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/movies?topParentId=4df79bd2d5bbae21080a0524a2702d5a&collectionType=movies', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const res = await page.evaluate(() => {
    const el = document.querySelector('.css-1wduhak');
    if (!el) return { w1: 'MISSING' };
    const vis = getComputedStyle(el);
    const kids = [...el.children].slice(0, 12).map(c => `<${c.tagName.toLowerCase()} role="${c.getAttribute('role')}">${c.textContent.trim().slice(0, 25)}`);
    // find landmark ancestors
    let anc = el; let ancStr = '';
    while (anc) { if (anc.matches('[role],nav,main,header,footer,aside,dialog')) { ancStr += `${anc.tagName}#${anc.id||''}[role=${anc.getAttribute('role')}] `; } anc = anc.parentElement; }
    return { w1: { tag: el.tagName, role: el.getAttribute('role'), display: vis.display, kids, ancestors: ancStr.slice(0, 500), parentHtml: el.parentElement.outerHTML.slice(0, 300) } };
});
console.log('W1:', JSON.stringify(res, null, 1));
await browser.close();
