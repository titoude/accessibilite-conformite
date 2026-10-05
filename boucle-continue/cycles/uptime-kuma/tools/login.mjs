// login.mjs — login réel via le formulaire, produit auth.json (storageState).
// Le JWT d'uptime-kuma est stocké en localStorage par l'app elle-même
// (checkbox « Remember me » cochée par défaut → storage().token en localStorage).
// Usage : node login.mjs [baseUrl] [out]  (défauts http://localhost:3001, ./auth.json)
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:3001';
const out = process.argv[3] || new URL('./auth.json', import.meta.url).pathname;
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(`${base}/`, { waitUntil: 'load' });
// Le formulaire login apparaît dans le Layout quand non authentifié.
await page.waitForSelector('#floatingInput', { timeout: 20000 });
await page.fill('#floatingInput', 'admin');
await page.fill('#floatingPassword', 'Admin12345!');
await page.click('button[type="submit"]');
// Connecté => la liste des monitors ou le dashboard s'affiche.
await page.waitForSelector('.monitor-list, #monitor-list, .shadow-box', { timeout: 20000 });
await page.waitForTimeout(1500);
await ctx.storageState({ path: out });
const raw = await page.evaluate(() => localStorage.getItem('token'));
if (!raw || raw.length < 20) { console.error('FAIL: token localStorage absent'); process.exit(1); }
console.log(`PASS login -> ${out} (token localStorage ${raw.length} chars)`);
await browser.close();
