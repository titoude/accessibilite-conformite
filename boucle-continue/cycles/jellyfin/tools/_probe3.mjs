import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const urls = [
  '#/home', '#/movies', '#/tv', '#/music', '#/search', '#/quickconnect',
  '#/mypreferencesmenu', '#/mypreferencesdisplay', '#/mypreferenceshome',
  '#/mypreferencesplayback', '#/mypreferencescontrols', '#/mypreferencessubtitles',
  '#/userprofile', '#/details?id=4df79bd2d5bbae21080a0524a2702d5a',
  '#/list?parentId=ba9c5cad4ccd875366bf54fd50e04928&type=movies',
  '#/dashboard', '#/dashboard/settings', '#/dashboard/libraries',
  '#/dashboard/users', '#/dashboard/users/add', '#/dashboard/tasks',
  '#/dashboard/plugins', '#/dashboard/logs', '#/dashboard/activity',
  '#/dashboard/networking', '#/dashboard/devices', '#/dashboard/keys',
  '#/dashboard/libraries/display', '#/dashboard/libraries/metadata',
  '#/metadata?id=4df79bd2d5bbae21080a0524a2702d5a', '#/queue'
];
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
for (const u of urls) {
  try {
    await page.goto(b + '/web/index.html' + u, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3500);
    const info = await page.evaluate(() => {
      const main = document.querySelector('.mainAnimatedPage, main, [role=main], .libraryPage, .dashboardPage, .interiorPage, #reactRoot > div:last-child');
      const h = document.querySelector('h1,h2.pageTitle,.pageTitle');
      return {
        url: location.hash, h: (h?.textContent||'').trim().slice(0,50),
        text: (main?.textContent||'').replace(/\s+/g,' ').trim().slice(0,140),
        btns: document.querySelectorAll('button').length,
        links: document.querySelectorAll('a[href]').length,
        inputs: document.querySelectorAll('input,select,textarea').length
      };
    });
    console.log('###', u, '|', info.h, '| btns', info.btns, 'links', info.links, 'inputs', info.inputs, '|', info.text.slice(0,110));
  } catch(e) { console.log('###', u, 'ERR', e.message.slice(0,80)); }
}
await browser.close();
