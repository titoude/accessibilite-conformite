import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/dashboard/livetv/recordings', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const r = await page.evaluate(() => {
    const h2 = document.querySelector('h2:nth-child(9)');
    const preview = document.querySelector('.subtitleappearance-preview-text');
    const bg = el => { let n = el, acc = []; while (n && n !== document.documentElement) { const c = getComputedStyle(n).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)') acc.push(n.tagName + '.' + String(n.className).split(' ')[0] + '=' + c); n = n.parentElement; } return acc; };
    return {
        bodyBg: getComputedStyle(document.body).backgroundColor,
        htmlBg: getComputedStyle(document.documentElement).backgroundColor,
        h2: h2 ? { text: h2.innerText.slice(0, 40), vis: h2.getClientRects().length, display: getComputedStyle(h2.closest('.page,div,section') || h2).display, chain: bg(h2) } : null,
    };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
