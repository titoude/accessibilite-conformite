import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json' });
const page = await ctx.newPage();
await page.goto(b + '/web/index.html#/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2500);
const nav = await page.evaluate(() => ({ lang: navigator.language, langs: navigator.languages }));
console.log(JSON.stringify(nav));
// check where en-us@posix appears in app state
const gl = await page.evaluate(() => window.getComputedStyle(document.documentElement).direction + ' | ' + document.documentElement.lang);
console.log(gl);
// try locale override context
const ctx2 = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const p2 = await ctx2.newPage();
await p2.goto(b + '/web/index.html#/movies', { waitUntil: 'domcontentloaded', timeout: 30000 });
await p2.waitForTimeout(4000);
const t = await p2.evaluate(() => document.body.textContent.replace(/\s+/g,' ').slice(0, 300));
console.log('LOCALE-CTX:', t);
await browser.close();
