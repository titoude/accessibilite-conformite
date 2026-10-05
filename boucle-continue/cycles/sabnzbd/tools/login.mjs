// login.mjs — authentification SABnzbd → storageState Playwright
// usage: node login.mjs <base-url> <auth.json> [user] [pass]
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://127.0.0.1:8080';
const out = process.argv[3] || 'auth.json';
const user = process.argv[4] || 'a11y';
const pass = process.argv[5] || 'a11y-pw-2026';
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(base + '/login', { waitUntil: 'load' });
await page.fill('input[name="username"]', user);
await page.fill('input[name="password"]', pass);
await page.click('.form-signin button');
// / redirige vers /wizard tant qu'aucun serveur n'est configuré : attendre
// n'importe quelle destination hors /login (la session est alors créée).
await page.waitForURL(u => !u.pathname.endsWith('/login'), { timeout: 15000 });
// preuve : la page servie n'est plus le formulaire de login
if (await page.locator('.form-signin').count()) throw new Error('login échoué, url=' + page.url());
await context.storageState({ path: out });
console.log('auth saved →', out);
await browser.close();
