import { createRequire } from 'node:module';
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');
const b = await chromium.launch();
const ctx = await b.newContext({ locale: 'en-US' });
const p = await ctx.newPage();
await p.goto('http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ', { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(5000);
const f = p.locator('button.absolute.inset-0, [role="button"].absolute').first();
await f.waitFor({ state: 'visible', timeout: 60000 });
await f.click();
await p.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 });
await p.waitForTimeout(1000);
const d = await p.evaluate(() => {
  const x = document.querySelector('[role="dialog"]');
  return {
    lblby: x.getAttribute('aria-labelledby'),
    ids: [...x.querySelectorAll('[id]')].map(e => e.id).slice(0, 10),
    text: x.innerText.slice(0, 200),
    html: x.innerHTML.slice(0, 800)
  };
});
console.log(JSON.stringify(d, null, 1));
await b.close();
