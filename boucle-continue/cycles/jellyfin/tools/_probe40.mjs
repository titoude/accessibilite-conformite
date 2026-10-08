import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/home', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const r = await page.evaluate(() => {
    const named = el => (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.innerText || '').trim().length > 0 || !!el.querySelector('img[alt]:not([alt=""])');
    const links = [...document.querySelectorAll('a[href]')].filter(a => a.getClientRects().length > 0);
    const bad = links.filter(a => !named(a)).map(a => ({
        cls: a.className.slice(0, 70),
        href: a.getAttribute('href'),
        html: a.outerHTML.slice(0, 200),
        vis: getComputedStyle(a).visibility,
        parent: a.parentElement?.className?.slice(0, 50),
    }));
    const hidden = [...document.querySelectorAll('[aria-hidden="true"]')];
    const badH = [];
    for (const h of hidden) {
        const inner = [...h.querySelectorAll('*')].filter(e => e.matches('a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])') && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden');
        if (inner.length) badH.push({ h: String(h.className).slice(0, 60), n: inner.length, t: inner[0].outerHTML.slice(0, 80) });
    }
    return { bad, badH };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
