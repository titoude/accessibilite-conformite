import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const TOOLS = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const c = await b.newContext({ locale:'en-US', storageState: join(TOOLS,'auth.json') });
const p = await c.newPage();
await p.goto('http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents',{waitUntil:'load',timeout:90000});
await p.waitForSelector('main',{timeout:90000});
await p.waitForTimeout(2000);
await p.locator('[data-testid="team-switcher-trigger"], button:has-text("Personal")').first().click().catch(()=>{});
await p.waitForTimeout(1500);
const menu = await p.evaluate(() => {
  const m = document.querySelector('[role="menu"]');
  if (!m) return 'no menu';
  const walk = (e,d) => {
    const r = e.getAttribute('role') || e.tagName.toLowerCase();
    let s = '  '.repeat(d)+r+(e.getAttribute('aria-label')?` [${e.getAttribute('aria-label')}]`:'')+(e.textContent?` "${e.textContent.trim().slice(0,30)}"`:'')+'\n';
    for (const ch of e.children) s += walk(ch,d+1);
    return s;
  };
  return walk(m,0);
});
console.log(menu);
await b.close();
