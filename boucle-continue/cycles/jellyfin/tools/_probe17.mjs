import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(b+'/web/index.html#/home', {waitUntil:'load'});
await page.waitForSelector('.page:not(.hide)', {timeout:30000});
const srv = await page.evaluate(() => JSON.parse(localStorage.getItem('jellyfin_credentials'))?.Servers?.[0]);
// thème : localStorage appTheme + POST dashboardTheme
await page.evaluate(uid => localStorage.setItem(uid+'-appTheme', 'light'), srv.UserId);
const hdrs = { Authorization: `MediaBrowser Token="${srv.AccessToken}"`, 'Content-Type': 'application/json' };
const prefs = await (await page.request.get(`${b}/DisplayPreferences/usersettings?userId=${srv.UserId}&client=emby`, {headers: hdrs})).json();
prefs.CustomPrefs = {...(prefs.CustomPrefs||{}), dashboardTheme: 'light', appTheme: 'light'};
await page.request.post(`${b}/DisplayPreferences/usersettings?userId=${srv.UserId}&client=emby`, {data: prefs, headers: hdrs});
await page.reload({waitUntil:'load'});
await page.waitForTimeout(4000);
console.log('data-theme:', await page.evaluate(() => document.documentElement.getAttribute('data-theme')));
// mypreferencesdisplay long wait
await page.goto('about:blank');
await page.goto(b+'/web/index.html#/mypreferencesdisplay', {waitUntil:'load'});
for (let i=0;i<6;i++) {
  await page.waitForTimeout(3000);
  const n = await page.locator('.page:not(.hide)').count();
  const t = (await page.locator('.page:not(.hide)').first().textContent().catch(()=>'')) || '';
  console.log(`t+${(i+1)*3}s pages=${n} text=${t.replace(/\s+/g,' ').trim().slice(0,80)}`);
  if (n) break;
}
await browser.close();
