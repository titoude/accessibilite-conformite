import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const TOOLS = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const c = await b.newContext({ locale: 'en-US', storageState: join(TOOLS, 'auth.json') });
const p = await c.newPage();
await p.goto('http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents', { waitUntil: 'load', timeout: 90000 });
await p.waitForSelector('main', { timeout: 60000 });
// étape 1: emulateMedia comme le probe
await p.emulateMedia({ colorScheme: 'dark' });
await p.waitForTimeout(1500);
console.log('after emulate:', JSON.stringify(await p.evaluate(() => ({ cls: document.documentElement.className, bg: getComputedStyle(document.body).backgroundColor, cookie: document.cookie }))));
// étape 2: reload pour voir si dark persiste
await p.reload({ waitUntil: 'load' });
await p.waitForTimeout(2500);
console.log('after reload:', JSON.stringify(await p.evaluate(() => ({ cls: document.documentElement.className, bg: getComputedStyle(document.body).backgroundColor, cookie: document.cookie }))));
await b.close();
