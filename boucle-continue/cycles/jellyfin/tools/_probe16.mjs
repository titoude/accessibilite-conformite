import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(b+'/web/index.html#/home', {waitUntil:'load'});
await page.waitForSelector('.page:not(.hide)', {timeout:30000});
const srv = await page.evaluate(() => JSON.parse(localStorage.getItem('jellyfin_credentials'))?.Servers?.[0]);
const hdrs = { Authorization: `MediaBrowser Token="${srv.AccessToken}"`, 'Content-Type': 'application/json' };
const prefs = await (await page.request.get(`${b}/DisplayPreferences/usersettings?userId=${srv.UserId}&client=emby`, {headers: hdrs})).json();
console.log('CustomPrefs.appTheme =', prefs.CustomPrefs?.appTheme, '| dashboardTheme =', prefs.CustomPrefs?.dashboardTheme);
// localStorage appSettings ?
const ls = await page.evaluate(() => Object.keys(localStorage).filter(k => /theme|appSettings|display/i.test(k)).map(k => k+'='+localStorage.getItem(k)?.slice(0,120)));
console.log('LS:', ls);
// console errors sur mypreferencesdisplay
page.on('pageerror', e => console.log('[pageerror]', e.message.slice(0,160)));
page.on('console', m => { if(m.type()==='error') console.log('[con]', m.text().slice(0,160)); });
await page.goto('about:blank');
await page.goto(b+'/web/index.html#/mypreferencesdisplay', {waitUntil:'load'});
await page.waitForTimeout(5000);
console.log('body text:', (await page.evaluate(()=>document.body.textContent||'')).replace(/\s+/g,' ').trim().slice(0,150));
await browser.close();
