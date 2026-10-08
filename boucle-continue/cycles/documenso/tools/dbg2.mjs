import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const TOOLS = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const c = await b.newContext({ locale: 'en-US', storageState: join(TOOLS, 'auth.json') });
const p = await c.newPage();
for (const u of ['http://localhost:9400/inbox','http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/folders','http://localhost:9400/t/personal_ehonlsofkmxlrfxy/analytics']) {
  await p.goto(u, { waitUntil: 'load', timeout: 90000 });
  await p.waitForTimeout(2500);
  const bad = await p.evaluate(() => [...document.querySelectorAll('a')].filter(a => !(a.textContent||'').trim() && !a.getAttribute('aria-label') && !a.getAttribute('aria-labelledby') && !a.title).map(a => a.outerHTML.slice(0,300)));
  console.log('==', u, JSON.stringify(bad, null, 1));
}
await b.close();
