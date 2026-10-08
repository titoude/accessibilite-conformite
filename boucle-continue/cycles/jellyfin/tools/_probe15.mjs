import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(b+'/web/index.html#/mypreferencesdisplay', {waitUntil:'load'});
await page.waitForTimeout(4000);
console.log('url', page.url());
const info = await page.evaluate(() => {
  const pages = [...document.querySelectorAll('.page')].map(p => p.className.slice(0,80)+' hide='+p.classList.contains('hide'));
  return pages.slice(-4);
});
console.log(info);
// test thème : POST + purge idb + reload
const srv = await page.evaluate(() => JSON.parse(localStorage.getItem('jellyfin_credentials'))?.Servers?.[0]);
const hdrs = { Authorization: `MediaBrowser Token="${srv.AccessToken}"`, 'Content-Type': 'application/json' };
const prefs = await (await page.request.get(`${b}/DisplayPreferences/usersettings?userId=${srv.UserId}&client=emby`, {headers: hdrs})).json();
prefs.CustomPrefs = {...(prefs.CustomPrefs||{}), appTheme: 'light', dashboardTheme: 'light'};
const r = await page.request.post(`${b}/DisplayPreferences/usersettings?userId=${srv.UserId}&client=emby`, {data: prefs, headers: hdrs});
console.log('POST prefs', r.status());
await page.evaluate(() => new Promise(res => {
  const dbs = indexedDB.databases ? indexedDB.databases() : Promise.resolve([{name:'keyval-store'}]);
  dbs.then(list => Promise.all(list.map(d => new Promise(r2 => {
    const rq = indexedDB.deleteDatabase(d.name); rq.onsuccess = rq.onerror = rq.onblocked = () => r2();
  })))).then(res);
}));
await page.reload({waitUntil:'load'});
await page.waitForTimeout(4000);
console.log('data-theme:', await page.evaluate(() => document.documentElement.getAttribute('data-theme')));
await browser.close();
