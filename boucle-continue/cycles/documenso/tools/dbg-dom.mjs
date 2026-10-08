import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const TOOLS = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const c = await b.newContext({ locale: 'en-US', storageState: join(TOOLS, 'auth.json') });
const p = await c.newPage();
const base = 'http://localhost:9400';
const team = 'personal_ehonlsofkmxlrfxy';
await p.goto(`${base}/t/${team}/documents`, { waitUntil: 'load', timeout: 90000 });
await p.waitForSelector('main', { timeout: 60000 });
await p.waitForTimeout(2500);
// 1. le trigger avatar div[type=button]
const av = await p.evaluate(() => {
  const el = document.querySelector('div[data-state="closed"][type="button"]');
  return el ? el.outerHTML.slice(0, 700) : 'ABSENT';
});
console.log('--- avatar trigger:', av);
// 2. liens .md:inline et a[href$=inbox]
const links = await p.evaluate(() => [...document.querySelectorAll('a.md\\:inline, a[href$="inbox"], a.block')].map(a => a.outerHTML.slice(0, 500)));
console.log('--- links:', JSON.stringify(links, null, 1));
// 3. icon buttons sans nom
const btns = await p.evaluate(() => [...document.querySelectorAll('main button, header button, nav button')].filter(x => !(x.textContent||'').trim() && !x.getAttribute('aria-label')).map(x => x.outerHTML.slice(0, 400)));
console.log('--- unnamed btns:', JSON.stringify(btns.slice(0,6), null, 1));
// 4. structure header/nav landmarks
const land = await p.evaluate(() => [...document.querySelectorAll('main, nav, header, aside')].map(x => `<${x.tagName.toLowerCase()} class="${(x.className||'').toString().slice(0,80)}" id="${x.id}" aria-label="${x.getAttribute('aria-label')}">`));
console.log('--- landmarks:', JSON.stringify(land, null, 1));
await b.close();
