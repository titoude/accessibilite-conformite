// Signup admin sur un conteneur FRAIS puis storage-state.
// Usage: node signup-install.mjs <baseUrl> <email> <password> <out.json>
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const [BASE, EMAIL, PASS, OUT] = process.argv.slice(2);
const b = await chromium.launch();
const page = await b.newPage();
await page.goto(`${BASE}/signup`, { waitUntil: 'load' });
await page.waitForSelector('#form_item_email', { timeout: 30000 });
await page.fill('#form_item_email', EMAIL);
await page.fill('#form_item_password', PASS);
await page.click('button[type=submit]');
await page.waitForTimeout(9000);
console.log('URL après signup:', page.url());
const state = await page.context().storageState();
writeFileSync(OUT, JSON.stringify(state, null, 2));
console.log(`${OUT} écrit — cookies:`, state.cookies.map(c => c.name).join(', '));
await b.close();
