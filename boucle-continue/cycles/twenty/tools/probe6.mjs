import { createRequire } from 'node:module';
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');
const b = await chromium.launch();
const ctx = await b.newContext({ locale: 'en-US', storageState: './auth.json' });
const p = await ctx.newPage();
await p.goto('http://localhost:9540/objects/people', { waitUntil: 'load' });
await p.waitForTimeout(5000);
const r = await p.evaluate(() => {
  const cbs = [...document.querySelectorAll('[role="checkbox"]')];
  const noName = cbs.filter(e => !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby'));
  const sample = noName.slice(0,2).map(e => {
    let a=[],n=e; for(let i=0;i<6&&n;i++){a.push(`${n.tagName}.${(n.className||'').toString().split(' ').slice(0,2).join('.')}${n.getAttribute('role')?'[role='+n.getAttribute('role')+']':''}${n.getAttribute('aria-label')?'[aria-label]':''}`);n=n.parentElement}
    return a.join(' < ');
  });
  return {total: cbs.length, noName: noName.length, sample};
});
console.log(JSON.stringify(r, null, 1));
// drag handles without name
const r2 = await p.evaluate(() => {
  const hs = [...document.querySelectorAll('[aria-roledescription="draggable"], [data-dnd-sortable-handle]')];
  const noName = hs.filter(e => !e.getAttribute('aria-label'));
  return {total: hs.length, noName: noName.length, sample: noName[0]?.outerHTML?.slice(0,200)};
});
console.log('drag:', JSON.stringify(r2));
await b.close();
