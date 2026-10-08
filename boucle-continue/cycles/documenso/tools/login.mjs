// Cycle 53 — login Playwright documenso → auth.json (storageState).
// Formulaire /signin : input[name=email] + input[name=password] + button[type=submit].
// Vérification : redirection hors /signin + contenu réel, jamais sur un check cookie.
// RR7 = SSR + hydratation React : un fill avant hydratation est effacé au commit
// → attendre networkidle puis remplir avec vérification de persistance.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.A11Y_BASE || process.argv[2] || 'http://localhost:9400';
const OUT = process.argv[3] || join(TOOLS, 'auth.json');
const SEED = JSON.parse(readFileSync(join(TOOLS, 'seed-info.json'), 'utf8'));
const email = process.env.A11Y_USER || SEED.user.email;
const password = process.env.A11Y_PASS || SEED.user.password;

export const fillStable = async (page, sel, val) => {
  for (let i = 0; i < 40; i++) {
    await page.fill(sel, val);
    await page.waitForTimeout(300);
    if ((await page.inputValue(sel)) === val) {
      await page.waitForTimeout(300);
      if ((await page.inputValue(sel)) === val) return;
    }
  }
  throw new Error(`champ instable (hydratation?) : ${sel}`);
};

const browser = await chromium.launch();
// locale:'en-US' sur TOUT contexte Playwright — leçon 38
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(`${BASE}/signin`, { waitUntil: 'load' });
await page.waitForSelector('input[name="email"]', { timeout: 120000 });
await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
await fillStable(page, 'input[name="email"]', email);
await fillStable(page, 'input[name="password"]', password);
await page.click('button[type="submit"]');
// Documenso redirige vers / ou le dashboard de la team — attendre d'être
// sorti de /signin + contenu réel, sinon le storageState capturé pourrait
// précéder une session aboutie.
await page.waitForURL((url) => !url.pathname.startsWith('/signin'), { timeout: 120000 });
await page.waitForFunction(
  () => (document.body.innerText || '').trim().length > 30,
  { timeout: 60000 },
);
await page.waitForTimeout(1500);
console.log('[login] landed:', page.url());
if (page.url().includes('/signin')) throw new Error('login non abouti — encore sur /signin');
mkdirSync(dirname(OUT), { recursive: true });
await ctx.storageState({ path: OUT });
await browser.close();
console.log('[login] auth.json écrit ->', OUT);
