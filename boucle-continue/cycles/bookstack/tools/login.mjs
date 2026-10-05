// Login BookStack (admin@admin.com/password) → auth.json (storage state Playwright).
// BookStack auth = formulaire classique POST /login (_token CSRF lié à la session).
import { chromium } from 'playwright';

const BASE = process.env.A11Y_BASE || 'http://localhost:8080';

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

await page.goto(`${BASE}/login`);
await page.locator('#email').fill('admin@admin.com');
await page.locator('#password').fill('password');
await page.locator('#login-form button.button').click();
await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 15000 });
await page.waitForLoadState('load');
// Preuve de session : le menu profil n'existe que connecté.
const ok = await page.locator('button[aria-label="Profile Menu"]').count();
if (ok === 0) {
  console.error('échec login : pas de menu profil après /login');
  process.exit(1);
}
await context.storageState({ path: 'auth.json' });
console.log('auth.json écrit — connecté en admin@admin.com');
await browser.close();
