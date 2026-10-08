import { createRequire } from 'node:module';
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');
const b = await chromium.launch();
const ctx = await b.newContext({ storageState: 'auth-ib.json', locale: 'en-US' });
const p = await ctx.newPage();
await p.goto('http://localhost:9410/t/personal_cuoynezlombdudsk/documents', { waitUntil: 'load' });
await p.waitForSelector('table button[aria-haspopup="menu"]', { timeout: 20000 });
await p.waitForTimeout(3000);
for (let run = 1; run <= 3; run++) {
  const triggers = p.locator('table button[aria-haspopup="menu"]');
  const n = await triggers.count();
  const t = triggers.nth(run === 1 ? n - 1 : run - 1);
  await t.click({ timeout: 10000 });
  await p.waitForSelector('[role="menu"] [role="menuitem"]', { state: 'visible', timeout: 10000 });
  await p.keyboard.press('Escape');
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => ({ menu: !!document.querySelector('[role="menu"]'), tag: document.activeElement?.tagName, hp: document.activeElement?.hasAttribute('aria-haspopup'), txt: (document.activeElement?.innerText || '').slice(0, 30) }));
  console.log(`run${run} idx=${run === 1 ? n - 1 : run - 1}:`, JSON.stringify(r));
}
await b.close();
