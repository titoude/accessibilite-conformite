import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const TOOLS = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const c = await b.newContext({ locale: 'en-US', storageState: join(TOOLS, 'auth.json') });
const p = await c.newPage();
for (const u of ['http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents','http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv/logs']) {
  await p.goto(u, { waitUntil:'load', timeout:90000 });
  await p.waitForSelector('main', {timeout:90000});
  await p.waitForTimeout(2500);
  const out = await p.evaluate(() => [...document.querySelectorAll('[role="combobox"], button.bg-transparent')].map(e => ({
    t: e.outerHTML.slice(0,300), name:(e.innerText||'').trim().slice(0,40), par: (e.closest('[data-testid]')?.getAttribute('data-testid')||e.parentElement?.className||'').slice(0,80),
  })));
  console.log('==',u, JSON.stringify(out,null,1));
}
await b.close();
