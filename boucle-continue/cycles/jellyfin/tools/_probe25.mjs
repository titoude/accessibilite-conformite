import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/dashboard/devices', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const r = await page.evaluate(() => {
    const th = [...document.querySelectorAll('th')].find(t => t.className.includes('18ds54y'));
    if (!th) return 'MISSING';
    const idx = th.cellIndex;
    const bodyCells = [...document.querySelectorAll('tbody tr')].slice(0, 2).map(tr => tr.children[idx] ? `${tr.children[idx].outerHTML.slice(0, 200)}` : 'NONE');
    // also check column pin buttons in header
    return { colId: th.getAttribute('id'), dataIndex: th.getAttribute('data-index'), bodyCells, pinBtns: th.querySelectorAll('button').length };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
