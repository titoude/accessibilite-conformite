#!/usr/bin/env node
/**
 * login.mjs — produit tools/auth.json (storageState Playwright) par un VRAI
 * login formulaire sur /login (jamais un jeton API injecté : le cookie
 * mealie.access_token est HttpOnly et posé par le serveur au login).
 *
 * Usage : node login.mjs <baseUrl> [email] [password] [out]
 * Exit 0 : auth.json écrit ; exit 1 : échec.
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const BASE = (process.argv[2] || 'http://localhost:7044').replace(/\/$/, '');
const EMAIL = process.argv[3] || 'changeme@example.com';
const PASS = process.argv[4] || 'MyPassword';
const OUT = process.argv[5] || new URL('./auth.json', import.meta.url).pathname;

const browser = await chromium.launch();
const context = await browser.newContext({ locale: 'en-US' });
const page = await context.newPage();

await page.goto(`${BASE}/login`, { waitUntil: 'load' });
// Garde hydratation : bouton submit visible ET activé avant saisie.
await page.waitForSelector('#username', { state: 'visible', timeout: 15000 });
await page.fill('#username', EMAIL);
await page.fill('#password', PASS);
await page.locator('button[type="submit"]').first().click();

// Le login redirige vers la page du groupe (/g/<slug>) — attendre une URL
// hors /login ET un marqueur de session réelle (bouton logout de l'app-bar).
await page.waitForURL(u => !u.pathname.endsWith('/login'), { timeout: 15000 });
await page.waitForSelector('.v-app-bar', { state: 'visible', timeout: 15000 });
await page.waitForSelector('button:has-text("Logout"), .v-navigation-drawer', { state: 'visible', timeout: 15000 });

const state = await context.storageState();
if (!state.cookies?.some(c => c.name === 'mealie.access_token')) {
  console.error('[login] FAIL : cookie mealie.access_token absent du storageState');
  process.exit(1);
}
writeFileSync(OUT, JSON.stringify(state, null, 2));
console.log(`[login] OK → ${OUT} (url=${page.url()})`);
await browser.close();
