import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/#/home', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.locator('button[aria-label="User Menu"]').first().click();
await page.waitForTimeout(800);
const m = await page.evaluate(() => {
    const menu = document.querySelector('#app-user-menu');
    const root = menu?.closest('.MuiMenu-root, .MuiPopover-root, .MuiModal-root');
    const paper = menu?.closest('.MuiPaper-root');
    return {
        menuExists: !!menu,
        menuVis: menu ? menu.offsetParent !== null : null,
        menuVisCss: menu ? getComputedStyle(menu).visibility : null,
        rootCls: root?.className?.slice(0, 80),
        rootVis: root ? root.offsetParent !== null : null,
        paperRole: paper?.getAttribute('role'), paperLabel: paper?.getAttribute('aria-label'),
        allMenus: [...document.querySelectorAll('.MuiMenu-root')].map(x => ({ vis: x.offsetParent !== null, id: x.id }))
    };
});
console.log(JSON.stringify(m, null, 1));
// drawer badBtns
await page.goto('http://localhost:5961/web/#/dashboard', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const d = await page.evaluate(() => {
    const bad = [...document.querySelectorAll('ul > a, ul > .MuiButtonBase-root')].filter(el => el.offsetParent);
    return bad.map(el => el.outerHTML.slice(0, 120));
});
console.log(JSON.stringify(d, null, 1));
await browser.close();
