import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/home', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const r = await page.evaluate(() => {
    const a = document.querySelector('a[aria-label="Sample Series"]');
    if (!a) return 'MISSING';
    const texts = [...a.querySelectorAll('*')].map(c => `${c.tagName.toLowerCase()}.${(c.getAttribute('class')||'').split(' ')[0]}="${c.textContent.trim().slice(0,40)}"`).filter(s => !s.endsWith('=""'));
    return { aria: a.getAttribute('aria-label'), inner: a.innerText, texts: texts.slice(0, 20), outer: a.outerHTML.slice(0, 600) };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
