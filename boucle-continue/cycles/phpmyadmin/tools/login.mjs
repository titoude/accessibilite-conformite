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
// thème déterministe : force pmahomme/light (la pref persiste côté session).
// v4 : même verrou qu'audit.mjs/reset-theme.mjs — mutation via
// page.request.post + ajax_request=true (le fetch page-side sans
// ajax_request répondait 302 et suivait la redirection à cookie périmé →
// le middleware re-sauvait l'ancien thème) + quiescence/abort des XHR
// ambiantes pendant la fenêtre.
try {
  const pendingIndexReqs = new Map();
  let navEpoch = 0;
  let prefMutationLock = 0;
  const abortedInLock = new WeakSet();
  page.on('request', r => {
    if (r.url().includes('index.php') && !abortedInLock.has(r)) pendingIndexReqs.set(r, { epoch: navEpoch, killedAt: 0 });
  });
  page.on('response', r => { if (r.url().includes('index.php')) pendingIndexReqs.delete(r.request()); });
  page.on('requestfinished', r => pendingIndexReqs.delete(r));
  page.on('requestfailed', r => pendingIndexReqs.delete(r));
  page.on('framenavigated', f => {
    if (f === page.mainFrame()) {
      navEpoch++;
      const now = Date.now();
      for (const e of pendingIndexReqs.values()) {
        if (e.epoch !== navEpoch && !e.killedAt) e.killedAt = now;
      }
    }
  });
  await page.route('**/index.php**', route =>
    prefMutationLock > 0
      ? (abortedInLock.add(route.request()), pendingIndexReqs.delete(route.request()), route.abort())
      : route.continue());
  const token = await page.inputValue('input[name="token"]').catch(() => null);
  if (token) {
    prefMutationLock++;
    try {
      await new Promise(r => setTimeout(r, 300));
      const inFlightAtLock = new Set(pendingIndexReqs.keys());
      const deadline = Date.now() + 15000;
      while ([...inFlightAtLock].some(r => {
        const e = pendingIndexReqs.get(r);
        return e && !(e.killedAt && Date.now() - e.killedAt > 2000);
      })) {
        if (Date.now() > deadline) throw new Error('requêtes index.php pré-verrou encore en vol');
        await new Promise(r => setTimeout(r, 100));
      }
      const res = await page.request.post(new URL('index.php?route=/themes/set', page.url()).href, {
        form: { ajax_request: 'true', set_theme: 'pmahomme', themeColorMode: 'light', server: '1', token },
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        maxRedirects: 0,
      });
      if (res.status() !== 200) console.warn('theme reset status', res.status());
    } finally {
      prefMutationLock--;
    }
  }
} catch (e) { console.warn('theme reset failed:', e.message); }
await ctx.storageState({ path: out });
await browser.close();
console.log(`OK auth -> ${out}`);
