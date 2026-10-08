import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'public.json', locale: 'en-US' });
const page = await ctx.newPage();
// navigation propre : depuis login, cliquer Forgot Password
await page.goto(b + '/web/index.html#/login', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const fp = page.locator('a:has-text("Forgot Password"), button:has-text("Forgot Password")');
console.log('forgot btn count', await fp.count());
if (await fp.count()) {
  await fp.first().click();
  await page.waitForTimeout(3000);
  console.log('URL after click:', page.url());
  console.log('BODY:', (await page.evaluate(()=>document.body.textContent||'')).replace(/\s+/g,' ').trim().slice(0,160));
  await page.screenshot({ path: '_probe_fp.png' });
}
await browser.close();
