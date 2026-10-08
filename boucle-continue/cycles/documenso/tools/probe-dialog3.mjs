import { createRequire } from 'node:module';
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');
const b = await chromium.launch();
const ctx = await b.newContext({ locale: 'en-US' });
const p = await ctx.newPage();
await p.goto('http://localhost:9410/sign/o210aFfWrFqOP9lG8gNit', { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(5000);
const f = p.locator('button.absolute.inset-0, [role="button"].absolute').first();
await f.waitFor({ state: 'visible', timeout: 60000 });
await f.click();
await p.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 });
const d = await p.evaluate(() => {
  const x = document.querySelector('[role="dialog"]');
  return { lblby: x.getAttribute('aria-labelledby'), titleTxt: (x.querySelector('h2,[class*="sr-only"]') || {}).innerText, html: x.innerHTML.slice(0, 300) };
});
console.log(JSON.stringify(d));
await b.close();
