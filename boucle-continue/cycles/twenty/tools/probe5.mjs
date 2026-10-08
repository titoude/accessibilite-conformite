import { createRequire } from 'node:module';
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');
const BASE = 'http://localhost:9540';
const b = await chromium.launch();
const ctx = await b.newContext({ locale: 'en-US', storageState: './auth.json' });
const p = await ctx.newPage();
await p.goto(`${BASE}/objects/companies`, { waitUntil: 'load' });
await p.waitForTimeout(5000);
await p.getByRole('button', { name: /^Filter$/i }).first().click();
await p.waitForTimeout(2000);
console.log('post-filter:', await p.evaluate(() => {
  const sels = '[role=menu],[role=listbox],[data-testid*="filter"],[class*="Dropdown"],[class*="dropdown"],[class*="Filter"]';
  const els = [...document.querySelectorAll(sels)].filter(e => e.offsetParent !== null);
  return els.slice(0,3).map(e => e.outerHTML.slice(0,350)).join('\n---\n') || 'rien';
}));
await p.screenshot({ path: '/tmp/filter.png' });
// record show page
await p.goto(`${BASE}/object/person/8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51`, { waitUntil: 'load' });
await p.waitForTimeout(5000);
console.log('\nrecord url:', p.url());
console.log('record text:', (await p.evaluate(() => document.body.innerText)).slice(0, 400).replace(/\n+/g,' | '));
await p.screenshot({ path: '/tmp/record.png' });
await b.close();
