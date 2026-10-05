// Signup admin puis storage-state — variante verbeuse de signup-install.mjs.
// Usage: node signup.mjs <baseUrl> <email> <password> <out.json>
//   (défauts historiques : http://localhost:8080, a11y-worker@example.com, auth.json)
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const [BASE, EMAIL, PASS, OUT] = process.argv.slice(2);
const base = BASE || 'http://localhost:8080';
const email = EMAIL || 'a11y-worker@example.com';
const pass = PASS || 'Worker-Pass-30!';
const out = OUT || 'auth.json';

const b = await chromium.launch();
const page = await b.newPage();
await page.goto(`${base}/signup`, { waitUntil: 'load' });
await page.waitForSelector('#form_item_email', { timeout: 30000 });
await page.fill('#form_item_email', email);
await page.fill('#form_item_password', pass);
await page.click('button[type=submit]');
await page.waitForTimeout(8000);
console.log('URL après signup:', page.url());
console.log((await page.evaluate(() => document.body.innerText.slice(0, 800))));
// storage state
const state = await page.context().storageState();
writeFileSync(out, JSON.stringify(state, null, 2));
console.log(`${out} écrit — cookies:`, state.cookies.map(c => c.name).join(', '), '| localStorage origins:', state.origins.length);
await b.close();
