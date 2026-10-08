import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(b + '/web/index.html#/movies', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(4000);
// toolbar buttons on the library page
const els = await page.evaluate(() => [...document.querySelectorAll('button')].map(e => `${e.className?.split(' ').slice(0,4).join('.')} | title=${e.title||e.getAttribute('aria-label')||''} | ${(e.textContent||'').trim().slice(0,30)}`).filter(s=>!s.startsWith('hide')));
console.log('== MOVIES BUTTONS ==\n'+els.join('\n'));
// open main drawer
await page.locator('button.mainDrawerButton').first().click();
await page.waitForTimeout(1200);
const drawer = await page.evaluate(() => { const d=document.querySelector('.mainDrawer'); return {cls:d.className, left:getComputedStyle(d).left, text:d.textContent.replace(/\s+/g,' ').slice(0,300)} });
console.log('== DRAWER ==', JSON.stringify(drawer));
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
await browser.close();
