import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(b + '/web/index.html#/movies', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(4000);

// 1) Filter dialog
await page.locator('button:has-text("Filter")').first().click();
await page.waitForTimeout(1500);
const dlg = await page.evaluate(() => { const d=document.querySelector('[role=dialog],.MuiDialog-root,.MuiModal-root'); return d ? {cls:d.className.slice(0,80), role:d.getAttribute('role'), text:d.textContent.replace(/\s+/g,' ').slice(0,250)} : null; });
console.log('FILTER DIALOG:', JSON.stringify(dlg));
await page.screenshot({ path: '/tmp/filter.png' });
await page.keyboard.press('Escape'); await page.waitForTimeout(800);

// 2) More menu on a card
const moreBtn = page.locator('button[title="More"]').first();
await moreBtn.click();
await page.waitForTimeout(1500);
const menu = await page.evaluate(() => { const d=document.querySelector('[role=menu],[role=dialog],.MuiMenu-root,.MuiPopover-root'); return d ? {cls:d.className.slice(0,80), role:d.getAttribute('role'), text:d.textContent.replace(/\s+/g,' ').slice(0,250)} : null; });
console.log('MORE MENU:', JSON.stringify(menu));
await page.screenshot({ path: '/tmp/more.png' });
await page.keyboard.press('Escape'); await page.waitForTimeout(800);

// 3) User menu
const ub = page.locator('button[title="User Menu"], button[aria-label="User Menu"]').first();
console.log('userbtn count', await ub.count());
if (await ub.count()) {
  await ub.click(); await page.waitForTimeout(1200);
  const um = await page.evaluate(() => { const d=document.querySelector('[role=menu],[role=dialog],.MuiDrawer-root,.MuiPopover-root,nav.MuiDrawer-paper'); return d ? {cls:d.className.slice(0,80), role:d.getAttribute('role'), text:d.textContent.replace(/\s+/g,' ').slice(0,300)} : null; });
  console.log('USER MENU:', JSON.stringify(um));
}
await page.screenshot({ path: '/tmp/usermenu.png' });
await browser.close();
