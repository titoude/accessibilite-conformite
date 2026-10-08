import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/#/home', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
const btns = await page.evaluate(() => [...document.querySelectorAll('button[aria-label="User Menu"]')].map(b => ({ vis: b.offsetParent !== null, rect: !!b.getClientRects().length })));
console.log('buttons:', JSON.stringify(btns));
await page.waitForSelector('button[aria-label="User Menu"]', { state: 'visible' });
await page.locator('button[aria-label="User Menu"]:visible').first().click({ force: false });
await page.waitForTimeout(1200);
const m = await page.evaluate(() => {
    const menu = document.querySelector('#app-user-menu');
    const root = menu?.closest('.MuiPopover-root');
    const paper = menu?.closest('.MuiPaper-root');
    return {
        menuVis: menu ? menu.offsetParent !== null : null,
        openCls: root?.classList.contains('MuiPopover-root'),
        paperRole: paper?.getAttribute('role'),
        paperLabel: paper?.getAttribute('aria-label'),
        modalOpen: !!document.querySelector('.MuiModal-root:not([style*="display: none"]):not(.MuiModal-hidden)'),
    };
});
console.log(JSON.stringify(m, null, 1));
await browser.close();
