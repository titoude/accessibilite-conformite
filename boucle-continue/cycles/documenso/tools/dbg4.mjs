import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const TOOLS = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const c = await b.newContext({ locale: 'en-US', storageState: join(TOOLS, 'auth.json') });
const p = await c.newPage();
await p.goto('http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/document', { waitUntil:'load', timeout:90000 });
await p.waitForSelector('main', {timeout:60000});
await p.waitForTimeout(2000);
const out = await p.evaluate(() => [...document.querySelectorAll('[role="combobox"]')].map(e => ({
  t: e.outerHTML.slice(0,420),
  name: (e.innerText||'').trim().slice(0,60),
})).slice(0,8));
console.log(JSON.stringify(out, null, 1));
await b.close();
