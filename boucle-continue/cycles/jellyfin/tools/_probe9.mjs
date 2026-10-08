import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const authUrls = ['#/livetv','#/playlists','#/boxsets','#/homevideos','#/mixed','#/books','#/musicvideos','#/queue','#/dashboard/backups','#/dashboard/branding','#/dashboard/livetv','#/dashboard/playback/resume','#/dashboard/playback/streaming','#/dashboard/playback/transcoding','#/dashboard/playback/trickplay','#/dashboard/libraries/nfo'];
const pubUrls = ['#/forgotpassword','#/forgotpasswordpin','#/selectserver','#/addserver','#/login'];
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
for (const u of authUrls) {
  try {
    await page.goto(b + '/web/index.html' + u, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(3200);
    const info = await page.evaluate(() => {
      const pages = [...document.querySelectorAll('.mainAnimatedPage')];
      const p = pages[pages.length-1] || document.body;
      return { cls: (p.className||'').toString().slice(0,60), text: p.textContent.replace(/\s+/g,' ').trim().slice(0,130) };
    });
    console.log('A', u, '|', info.cls, '|', info.text);
  } catch(e) { console.log('A', u, 'ERR', e.message.slice(0,70)); }
}
const ctx2 = await browser.newContext({ locale: 'en-US' });
const p2 = await ctx2.newPage();
for (const u of pubUrls) {
  try {
    await p2.goto(b + '/web/index.html' + u, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await p2.waitForTimeout(3500);
    const info = await p2.evaluate(() => {
      const pages = [...document.querySelectorAll('.mainAnimatedPage')];
      const p = pages[pages.length-1] || document.body;
      return { text: (p.textContent||'').replace(/\s+/g,' ').trim().slice(0,130) };
    });
    console.log('P', u, '|', info.text);
  } catch(e) { console.log('P', u, 'ERR', e.message.slice(0,70)); }
}
await browser.close();
