import { createRequire } from 'node:module';
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');
const BASE = 'http://localhost:9540';
const b = await chromium.launch();
const ctx = await b.newContext({ locale: 'en-US', storageState: './auth.json' });
const p = await ctx.newPage();
// KANBAN
await p.goto(`${BASE}/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a`, { waitUntil: 'load' });
await p.waitForTimeout(5000);
console.log('KANBAN url:', p.url());
console.log(await p.evaluate(() => {
  const board = document.querySelector('[class*="board"],[class*="Board"],[data-testid*="board"],[role="list"],[class*="kanban"],[class*="Kanban"]');
  const cols = [...document.querySelectorAll('h2,h3,[role="heading"]')].slice(0,8).map(e=>e.textContent.trim());
  const texts = (document.body.innerText||'').slice(0,600);
  return `board: ${board ? board.tagName+'.'+board.className.toString().slice(0,80) : 'absent'}\nheadings: ${JSON.stringify(cols)}\ntext: ${texts}`;
}));
await p.screenshot({ path: '/tmp/kanban.png' });
// FILTER button on companies
await p.goto(`${BASE}/objects/companies`, { waitUntil: 'load' });
await p.waitForTimeout(5000);
const btn = await p.evaluate(() => {
  const btns = [...document.querySelectorAll('button')].filter(e => /filter|sort/i.test(e.textContent + (e.getAttribute('aria-label')||'')));
  return btns.map(e => `${e.textContent.trim().slice(0,40)}[aria-label=${e.getAttribute('aria-label')}]`).join(' | ');
});
console.log('filter/sort btns:', btn);
await p.screenshot({ path: '/tmp/companies.png' });
await b.close();
