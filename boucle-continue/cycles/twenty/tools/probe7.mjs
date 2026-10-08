import { createRequire } from 'node:module';
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');
const b = await chromium.launch();
const ctx = await b.newContext({ locale: 'en-US', storageState: './auth.json' });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERR: ' + e.message.slice(0,300)));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text().slice(0,300)); });
await p.goto('http://localhost:9540/objects/people', { waitUntil: 'load' });
await p.waitForTimeout(6000);
const r = await p.evaluate(() => ({
  url: location.pathname,
  rootChildren: document.getElementById('root')?.children.length,
  title: document.title,
  bodyText: document.body.innerText.slice(0,120),
}));
console.log(JSON.stringify(r));
console.log(errs.slice(0,6).join('\n') || 'no errors');
await b.close();
