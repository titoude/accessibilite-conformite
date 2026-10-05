// login.mjs — login réel via le formulaire WASM, produit auth.json (storageState).
// Usage : node login.mjs [baseUrl] [out]  (défauts http://localhost:17170, auth.json)
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:17170';
const out = process.argv[3] || new URL('./auth.json', import.meta.url).pathname;
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(`${base}/login`, { waitUntil: 'load' });
await page.waitForSelector('#username', { timeout: 15000 });
await page.fill('#username', 'admin');
await page.fill('#password', 'admin123');
await page.click('button[type="submit"], button:has-text("Login")');
await page.waitForURL('**/users', { timeout: 15000 });
await page.waitForSelector('main table', { timeout: 15000 });
await ctx.storageState({ path: out });
const cookies = await ctx.cookies();
if (!cookies.some(c => c.name === 'token')) { console.error('FAIL: cookie token absent'); process.exit(1); }
console.log(`PASS login -> ${out} (${cookies.length} cookies)`);
await browser.close();
