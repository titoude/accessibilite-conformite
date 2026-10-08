import { createRequire } from 'node:module';
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');
const BASE = 'http://localhost:9540';
const b = await chromium.launch();
const ctx = await b.newContext({ locale: 'en-US', storageState: './auth.json' });
const p = await ctx.newPage();
await p.goto(`${BASE}/objects/companies`, { waitUntil: 'load' });
await p.waitForTimeout(5000);
console.log('landmarks:', await p.evaluate(() => [...document.querySelectorAll('main,nav,aside,header,footer,[role=main],[role=navigation],[role=banner],[role=contentinfo],[role=search],[role=form]')].map(e => `${e.tagName.toLowerCase()}${e.getAttribute('role') ? '[role=' + e.getAttribute('role') + ']' : ''}`).join(',')));
console.log('records-table:', await p.locator('[data-testid], [class*="RecordTable"], tr, [role=row]').count());
// Ctrl+K via keyboard on body
await p.locator('body').click({ position: { x: 400, y: 400 } }).catch(()=>{});
await p.keyboard.press('Control+k');
await p.waitForTimeout(2500);
const dialogs = await p.evaluate(() => [...document.querySelectorAll('[role=dialog],[role=listbox],[cmdk-root],[class*="command"],[class*="Command"],[data-testid*="command"],input[placeholder]')].map(e => e.outerHTML.slice(0,200)).join('\n---\n'));
console.log('post-CtrlK:', dialogs || 'rien');
await p.screenshot({ path: '/tmp/cmdk2.png' });
await b.close();
