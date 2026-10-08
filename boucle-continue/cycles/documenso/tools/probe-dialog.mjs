import { createRequire } from 'node:module';
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');
const b = await chromium.launch();
const ctx = await b.newContext({ locale: 'en-US' });
const p = await ctx.newPage();
p.on('pageerror', e => console.log('PAGEERR:', String(e).slice(0, 160)));
await p.goto('http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ', { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(5000);
const f = p.locator('button.absolute.inset-0, [role="button"].absolute').first();
await f.waitFor({ state: 'visible', timeout: 60000 });
await f.click();
await p.waitForTimeout(2000);
const d = await p.evaluate(() => [...document.querySelectorAll('[role="dialog"],[role="alertdialog"]')].map(x => ({
  vis: !!x.offsetParent, id: x.id, ariaLabel: x.getAttribute('aria-label'), lblby: x.getAttribute('aria-labelledby'),
  title: (x.querySelector('h1,h2,h3,h4,[id]') || {}).innerText?.slice(0, 80),
  outer: x.outerHTML.slice(0, 300)
})));
console.log(JSON.stringify(d, null, 1));
await b.close();
