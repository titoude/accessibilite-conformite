import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(b+'/web/index.html#/home', {waitUntil:'load'});
await page.waitForSelector('.page:not(.hide)', {timeout:30000});
await page.waitForTimeout(1500);
const n = await page.locator('button[aria-label="Cast to Device"]').count();
console.log('cast buttons:', n);
if (n) {
  await page.locator('button[aria-label="Cast to Device"]').first().click();
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => {
    const m = document.getElementById('app-remote-play-menu');
    return {
      exists: !!m,
      cls: m?.className,
      style: m?.getAttribute('style'),
      text: m?.textContent?.replace(/\s+/g,' ').slice(0,150),
      vis: m ? getComputedStyle(m).visibility + '/' + getComputedStyle(m).display : null,
      popovers: [...document.querySelectorAll('.MuiPopover-root')].map(p => p.className.slice(0,80)+'|'+p.textContent.replace(/\s+/g,' ').slice(0,60)),
    };
  });
  console.log(JSON.stringify(info, null, 1));
}
await browser.close();
