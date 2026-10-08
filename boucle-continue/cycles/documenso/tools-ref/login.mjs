// Cycle 48 — login Playwright plausible/analytics → auth.json (storageState).
// Formulaire POST /login : input#email[name=email] + input#current-password + submit.
// Vérification : redirection /sites (dashboard) + contenu réel, jamais sur un check cookie.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.PLAUSIBLE_BASE || process.argv[2] || 'http://localhost:8950';
const OUT = process.argv[3] || join(TOOLS, 'auth.json');
const email = process.env.PLAUSIBLE_USER || 'user@plausible.test';
const password = process.env.PLAUSIBLE_PASS || 'plausible';

const browser = await chromium.launch();
// locale:'en-US' sur TOUT contexte Playwright — leçon 38
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(`${BASE}/login`, { waitUntil: 'load' });
await page.waitForSelector('input#email[name="email"]', { timeout: 30000 });
await page.fill('input#email[name="email"]', email);
await page.fill('input#current-password[name="password"]', password);
await page.click('form[action="/login"] button[type="submit"]');
// L'app redirige vers /sites (LiveView) — attendre contenu réel, sinon le
// storageState capturé pourrait précéder une session aboutie.
await page.waitForURL(/\/sites/, { timeout: 30000 });
await page.waitForFunction(
  () => (document.body.innerText || '').trim().length > 30,
  { timeout: 30000 },
);
await page.waitForSelector('a[href*="dummy.site"], [data-test-id], #app, main, .sites', { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(1200);
console.log('[login] landed:', page.url());
if (page.url().includes('/login')) throw new Error('login non abouti — encore sur /login');
mkdirSync(dirname(OUT), { recursive: true });
await ctx.storageState({ path: OUT });
await browser.close();
console.log('[login] auth.json écrit ->', OUT);
