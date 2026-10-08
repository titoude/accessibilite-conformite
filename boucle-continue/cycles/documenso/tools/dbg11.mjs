import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const TOOLS = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const c = await b.newContext({ locale:'en-US', storageState: join(TOOLS,'auth.json') });
const p = await c.newPage();
await p.goto('http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates',{waitUntil:'load',timeout:90000});
await p.waitForSelector('main',{timeout:90000}); await p.waitForTimeout(2500);
// unnamed buttons
const r1 = await p.evaluate(() => [...document.querySelectorAll('button[data-state]')]
  .filter(b=>!(b.getAttribute('aria-label')||b.innerText.trim()))
  .map(b=>({html:b.outerHTML.slice(0,200), par:b.parentElement?.outerHTML.slice(0,200)})));
console.log('UNNAMED:',JSON.stringify(r1,null,1));
// open switcher, dump menu children roles
await p.locator('button:has-text("Personal Team"), [data-testid="team-switcher-trigger"]').first().click().catch(()=>{});
await p.waitForTimeout(1500);
const menu = await p.evaluate(() => {
  const m=document.querySelector('[role="menu"]'); if(!m) return 'no menu';
  return [...m.querySelectorAll('*')].filter(e=>e.getAttribute('role')||e.tagName==='A'||e.tagName==='H2'||e.tagName==='H3').map(e=>e.tagName+' role='+(e.getAttribute('role')||'-')+' '+(e.innerText||'').slice(0,30)).join('\n');
});
console.log('MENU:\n'+menu);
await b.close();
