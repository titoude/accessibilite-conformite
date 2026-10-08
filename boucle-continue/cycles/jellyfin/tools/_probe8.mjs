import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(b + '/web/index.html#/movies?tab=0', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(8000);
const t = await page.evaluate(() => [...document.querySelectorAll('button')].map(e => (e.textContent||'').trim()||e.title).filter(Boolean).slice(0,50));
console.log('BTNS tab0:', JSON.stringify(t));
// try filter
const f = page.locator('button:has-text("Filter")').first();
console.log('filter count', await f.count());
if (await f.count()) {
  await f.click(); await page.waitForTimeout(1500);
  const dlg = await page.evaluate(() => { const d=document.querySelector('[role=dialog],.MuiPopover-root'); return d ? {cls:d.className.slice(0,90), role:d.getAttribute('role'), text:d.textContent.replace(/\s+/g,' ').slice(0,280)} : null; });
  console.log('FILTER:', JSON.stringify(dlg));
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
}
// more menu
const mb = page.locator('button[title="More"]').first();
console.log('more count', await mb.count());
if (await mb.count()) {
  await mb.click(); await page.waitForTimeout(1200);
  const m = await page.evaluate(() => { const d=document.querySelector('[role=menu],[role=dialog],.MuiPopover-root'); return d ? {cls:d.className.slice(0,90), role:d.getAttribute('role'), text:d.textContent.replace(/\s+/g,' ').slice(0,280)} : null; });
  console.log('MORE:', JSON.stringify(m));
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
}
// user menu
const ub = page.locator('button[title="User Menu"]').first();
console.log('usermenu count', await ub.count());
if (await ub.count()) {
  await ub.click(); await page.waitForTimeout(1200);
  const um = await page.evaluate(() => { const d=document.querySelector('[role=menu],[role=dialog],.MuiDrawer-root,.MuiPopover-root'); return d ? {cls:d.className.slice(0,90), role:d.getAttribute('role'), text:d.textContent.replace(/\s+/g,' ').slice(0,280)} : null; });
  console.log('USERMENU:', JSON.stringify(um));
}
await browser.close();
