import { createRequire } from 'node:module';
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');
const b = await chromium.launch();
const ctx = await b.newContext({ locale: 'en-US', storageState: './auth.json' });
const p = await ctx.newPage();
await p.goto('http://localhost:9540/objects/people', { waitUntil: 'load' });
await p.waitForTimeout(6000);
const r = await p.evaluate(() => {
  const els = [...document.querySelectorAll('[data-dnd-sortable-handle]')];
  return els.slice(0,4).map(e => ({
    aria: e.getAttribute('aria-label'),
    cls: e.className.slice(0,30),
    id: e.id,
    html: e.outerHTML.slice(0,260),
    parent: e.parentElement?.className?.toString().slice(0,60),
  }));
});
console.log(JSON.stringify(r,null,1));
await b.close();
