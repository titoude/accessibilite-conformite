// login.mjs — cookie-auth login phpMyAdmin, écrit auth.json (storageState) À CÔTÉ du script.
// Usage: node login.mjs <baseUrl> [out] [user] [pass] [server]
//   node login.mjs http://localhost:8080 auth.json pma pma-bench-2026 1
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const baseUrl = process.argv[2] ?? 'http://localhost:8080';
const out = resolve(here, process.argv[3] ?? 'auth.json');
const user = process.argv[4] ?? 'pma';
const pass = process.argv[5] ?? 'pma-bench-2026';
const server = process.argv[6] ?? '1';

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(`${baseUrl}/public/index.php?route=/`, { waitUntil: 'load' });
await page.waitForSelector('#input_username', { timeout: 30000 });
await page.fill('#input_username', user);
await page.fill('#input_password', pass);
const srv = await page.$('select[name="server"]');
if (srv) await srv.selectOption(server);
await page.click('#input_go');
// post-login : la page doit afficher le navtree (lien Log out ou arborescence)
await page.waitForSelector('#pma_navigation, a[href*="route=/logout"], #li_logout, .ic_s_loggoff', { timeout: 30000 });
// thème déterministe : force pmahomme/light (la pref persiste côté session)
try {
  const token = await page.inputValue('input[name="token"]').catch(() => null);
  if (token) {
    const status = await page.evaluate(async (token) => {
      const body = new URLSearchParams({ set_theme: 'pmahomme', themeColorMode: 'light', server: '1', token });
      const r = await fetch('index.php?route=/themes/set', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body, credentials: 'same-origin',
      });
      return r.status;
    }, token);
    if (status !== 200) console.warn('theme reset status', status);
  }
} catch (e) { console.warn('theme reset failed:', e.message); }
await ctx.storageState({ path: out });
await browser.close();
console.log(`OK auth -> ${out}`);
