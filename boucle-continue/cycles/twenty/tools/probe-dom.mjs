import { createRequire } from 'node:module';const require = createRequire(new URL('./package.json', import.meta.url));const { chromium } = require('playwright');
const BASE = 'http://localhost:9540';
const b = await chromium.launch();
const ctx = await b.newContext({ locale: 'en-US', storageState: '/home/ubuntu/repos/accessibilite-conformite/boucle-continue/cycles/twenty/tools/auth.json' });
const p = await ctx.newPage();
const dump = async (name, sel) => {
  const els = await p.locator(sel).all();
  console.log(`\n== ${name} (${els.length}) ==`);
  for (const e of els.slice(0, 4)) {
    const html = (await e.evaluate(el => el.outerHTML.slice(0, 300))).replace(/\s+/g, ' ');
    console.log(html);
  }
};
// companies index
await p.goto(`${BASE}/objects/companies`, { waitUntil: 'load' });
await p.waitForTimeout(4000);
await dump('main landmarks', 'main, [role=main], nav, [role=navigation], aside, [role=complementary]');
await dump('table', 'table, [role=table], [role=grid]');
await dump('header buttons', 'header button, [class*="Header"] button, button');
console.log('\nURL:', p.url());
// command menu
await p.keyboard.press('Control+k');
await p.waitForTimeout(1500);
await dump('command menu', '[role=dialog], [class*="CommandMenu"], [cmdk-root], [class*="command"], [role=listbox], [role=dialog] [role=option]');
await p.screenshot({ path: '/tmp/cmdk.png' });
await p.keyboard.press('Escape');
await b.close();
