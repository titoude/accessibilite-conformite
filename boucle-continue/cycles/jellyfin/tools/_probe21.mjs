import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US', viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/home', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const burger = page.locator('button.mainDrawerButton, [aria-label*="menu" i]').first();
await burger.click().catch(e => console.log('burger', e.message));
await page.waitForTimeout(1200);
const q9 = await page.evaluate(() => {
    const el = document.querySelector('.css-q9gyaw');
    if (!el) return 'MISSING';
    const kids = [...el.children].map(c => `<${c.tagName.toLowerCase()} role="${c.getAttribute('role')}">${c.getAttribute('aria-label') || c.textContent.trim().slice(0, 30)}`);
    return { tag: el.tagName, aria: el.getAttribute('aria-labelledby'), role: el.getAttribute('role'), kids: kids.slice(0, 15), html: el.outerHTML.slice(0, 300) };
});
console.log('Q9:', JSON.stringify(q9, null, 1));
await browser.close();
