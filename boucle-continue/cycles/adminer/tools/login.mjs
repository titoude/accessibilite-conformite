// Login adminer cycle 21 : driver SQLite + Adminer\Password (adminer-plugins.php).
// Produit auth.json (storage state Playwright) pour audit.mjs --storage-state.
// Le formulaire porte le token CSRF ; rempli tel quel il suffit.
import { chromium } from 'playwright';

const BASE = process.env.A11Y_BASE || 'http://localhost:8080';
const PASSWORD = process.env.A11Y_ADMINER_PW || 'a11y-sqlite-pw';

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

await page.goto(`${BASE}/adminer/?sqlite=`);
// auth[server] est masqué+désactivé pour le driver sqlite (loginDriver()).
await page.locator('input[name="auth[username]"]').fill('admin');
await page.locator('input[name="auth[password]"]').fill(PASSWORD);
await page.locator('input[name="auth[db]"]').fill('/data/test.sqlite');
await Promise.all([
  page.waitForNavigation({ waitUntil: 'load', timeout: 15000 }),
  page.locator('input[type="submit"][value="Login"]').click(),
]);
// Preuve dure : la page tables liste notre base, sinon le login a échoué.
await page.waitForSelector('#content', { timeout: 15000 });
const bodyText = await page.evaluate(() => document.body.innerText);
if (!bodyText.includes('/data/test.sqlite') || !bodyText.includes('books')) {
  console.error('LOGIN ÉCHOUÉ — page inattendue :', bodyText.slice(0, 300));
  await browser.close();
  process.exit(1);
}
await context.storageState({ path: new URL('./auth.json', import.meta.url).pathname });
console.log('auth.json écrit — session sqlite /data/test.sqlite');
await browser.close();
