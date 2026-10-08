import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const page = await (await browser.newContext({ locale: 'en-US' })).newPage();
await page.goto(b + '/web/index.html#/login', { waitUntil: 'domcontentloaded', timeout: 45000 });
await page.waitForTimeout(6000);
console.log('URL:', page.url());
// list interactive elements
const els = await page.evaluate(() => [...document.querySelectorAll('input,button,select,a[href]')].slice(0,60).map(e => `${e.tagName}#${e.id}.${[...e.classList].join('.')} type=${e.type||''} name=${e.name||''} aria=${e.getAttribute('aria-label')||''} text=${(e.textContent||'').trim().slice(0,40)} href=${e.getAttribute('href')||''}`));
console.log(els.join('\n'));
await browser.close();
