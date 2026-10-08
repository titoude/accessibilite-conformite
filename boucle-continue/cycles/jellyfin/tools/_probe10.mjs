import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'public.json', locale: 'en-US' });
const page = await ctx.newPage();
for (const u of ['#/login','#/forgotpassword','#/forgotpasswordpin','#/selectserver','#/addserver']) {
  await page.goto(b + '/web/index.html' + u, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);
  const t = await page.evaluate(() => document.body.textContent.replace(/\s+/g,' ').trim().slice(0,110));
  console.log(u, '|', t);
}
await browser.close();
