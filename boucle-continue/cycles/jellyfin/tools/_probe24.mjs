import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/dashboard/devices', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const r = await page.evaluate(() => {
    const th = document.querySelector('th.css-18ds54y') || [...document.querySelectorAll('th')].find(t => t.className.includes('18ds54y'));
    if (!th) return 'MISSING ' + [...document.querySelectorAll('th')].map(t => t.className.slice(0, 30) + '|' + t.textContent.trim().slice(0, 20)).join(' ;; ');
    return { text: th.textContent.trim(), html: th.outerHTML.slice(0, 700), colIdx: th.cellIndex, headers: [...th.closest('tr').children].map(c => `${c.tagName}.${c.className.split(' ').filter(x => x.startsWith('css'))[0]}="${c.textContent.trim().slice(0,15)}"`) };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
