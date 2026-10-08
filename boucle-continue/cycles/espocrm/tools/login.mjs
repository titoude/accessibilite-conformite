// Cycle 47 — login Playwright EspoCRM → auth.json (storageState).
// Formulaire #login-form : input#field-userName + input#field-password + button#btn-login.
// Vérification : chrome applicatif monté (.navbar) + contenu réel (#content non vide).
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.ESPO_BASE || process.argv[2] || 'http://localhost:7747';
const OUT = process.argv[3] || join(TOOLS, 'auth.json');
const user = process.env.ESPO_USER || 'admin';
const password = process.env.ESPO_PASS || 'AuditC47-Espo-Pass!';

const browser = await chromium.launch();
// locale:'en-US' sur TOUT contexte Playwright — leçon 38
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(`${BASE}/`, { waitUntil: 'load' });
await page.waitForSelector('input#field-userName', { timeout: 30000 });
await page.fill('input#field-userName', user);
await page.fill('input#field-password', password);
await page.click('#btn-login');
// L'app Backbone monte .navbar (chrome) puis le contenu — texte réel requis,
// sinon le storageState capturé pourrait précéder une session aboutie.
await page.waitForSelector('#navbar .navbar', { state: 'attached', timeout: 60000 });
await page.waitForFunction(
  () => (document.body.innerText || '').trim().length > 30
    && !document.querySelector('#login-form'),
  { timeout: 60000 },
);
await page.waitForSelector('#content, .list-container, .dashlet-body', { timeout: 30000 });
await page.waitForTimeout(1500);
console.log('[login] landed:', page.url());
if (page.url().includes('#login')) throw new Error('login non abouti — hash encore #login');
mkdirSync(dirname(OUT), { recursive: true });
await ctx.storageState({ path: OUT });
await browser.close();
console.log('[login] auth.json écrit ->', OUT);
