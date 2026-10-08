// login.mjs — cycle 52 netbox. Auth form : /login/ (username/password), CSRF Django.
// Émet auth.json (storageState). Échoue si l'auth n'est pas prouvée.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const DIR = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL || 'http://localhost:9300';
const USER = process.env.AUDIT_USER || 'bench-admin';
const PASS = process.env.AUDIT_PASS || 'AuditC52-Pass-Seed!';

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
try {
  await page.goto(`${BASE}/login/`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[name="username"]', USER);
  await page.fill('input[name="password"]', PASS);
  await Promise.all([
    page.waitForURL(u => !u.pathname.startsWith('/login'), { timeout: 15000 }),
    page.click('button[type="submit"]'),
  ]);
  // preuve d'auth : page authentifiée avec menu user
  await page.waitForSelector('a[href="/user/profile/"]', { state: 'attached', timeout: 15000 });
  const uname = await page.evaluate(() => {
    const u = document.querySelector('a[href="/user/profile/"] .nav-link-title, .nav-item .nav-link');
    return document.body.innerText.includes('bench-admin') ? 'ok' : 'missing';
  });
  if (uname !== 'ok') throw new Error('login réussi mais username non visible dans le DOM');
  await ctx.storageState({ path: join(DIR, 'auth.json') });
  console.log(`[login] OK → tools/auth.json (user=${USER})`);
} catch (e) {
  console.error(`[login] FAIL : ${e.message}`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
