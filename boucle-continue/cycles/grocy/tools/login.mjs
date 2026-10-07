// login.mjs — login formulaire Grocy (username/password → password_base64 par
// le JS du formulaire), écrit auth.json (storageState) À CÔTÉ du script.
// Usage: node login.mjs <baseUrl> [out] [user] [pass]
//   node login.mjs http://localhost:8080 auth.json admin admin
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const baseUrl = process.argv[2] ?? 'http://localhost:8080';
const out = resolve(here, process.argv[3] ?? 'auth.json');
const user = process.argv[4] ?? 'admin';
const pass = process.argv[5] ?? 'admin';

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(`${baseUrl}/login`, { waitUntil: 'load' });
await page.waitForSelector('#username', { timeout: 30000 });
await page.fill('#username', user);
await page.fill('#password_input', pass);
await page.click('#login-button');
// post-login : la navbar authentifiée (dropdown utilisateur) ou /stockoverview
await page.waitForSelector('.nav-item.dropdown, #sidebarResponsive', { timeout: 30000 });
await page.waitForLoadState('load');
// Preuve d'auth : le cookie de session grocy suffit, mais on vérifie qu'une
// page auth répond 200 (pas de retour /login).
const resp = await page.goto(`${baseUrl}/usersettings`, { waitUntil: 'load' });
if (!resp || resp.status() !== 200) {
  console.error('login KO : /usersettings status', resp && resp.status());
  process.exit(2);
}
await ctx.storageState({ path: out });
await browser.close();
console.log(`OK auth -> ${out}`);
