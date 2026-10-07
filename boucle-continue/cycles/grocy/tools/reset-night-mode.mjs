// reset-night-mode.mjs — restaure night_mode=off (préférence serveur persistée).
// À exécuter AVANT chaque scan : sans reset les pages tournent sous le dernier
// thème utilisé par un état mutant.
// Usage: node reset-night-mode.mjs <baseUrl> <auth.json>
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const baseUrl = process.argv[2] ?? 'http://localhost:8080';
const authPath = resolve(here, process.argv[3] ?? 'auth.json');

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: authPath });
const page = await ctx.newPage();
await page.goto(baseUrl, { waitUntil: 'load', timeout: 30000 });
const put = await page.request.put(`${baseUrl}/api/user/settings/night_mode`, {
  data: { value: 'off' },
  headers: { 'Content-Type': 'application/json' },
});
if (put.status() !== 204 && !put.ok()) {
  console.error('PUT night_mode=off -> HTTP', put.status());
  process.exit(2);
}
const read = await page.request.get(`${baseUrl}/api/user/settings/night_mode`);
const v = (await read.json())?.value;
if (v !== 'off') {
  console.error(`night_mode lu "${v}" après écriture off`);
  process.exit(2);
}
await page.reload({ waitUntil: 'load' });
const isNight = await page.evaluate(() => document.body.classList.contains('night-mode'));
if (isNight) {
  console.error('body.night-mode encore présent après reset');
  process.exit(2);
}
await browser.close();
console.log('OK night_mode=off');
