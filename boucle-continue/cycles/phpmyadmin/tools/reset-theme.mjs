// Deterministic theme reset: submit the native pmahomme form on /themes
// (the plain POST is ignored when theme is persisted in the session).
// Usage: node reset-theme.mjs <base-url> [storageState]
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:8080';
const state = process.argv[3] ?? 'auth.json';
const PMA = '/public';

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: state });
const page = await ctx.newPage();
await page.goto(base + PMA + '/index.php?route=/themes', { waitUntil: 'load' });
// reset Console prefs d'abord (DarkTheme/Mode persistés serveur par
// console-dark-pmahomme) — doit courir même si le thème est déjà pmahomme/light.
const darkReset = await page.evaluate(async () => {
  const t = document.querySelector('input[name=token]')?.value ?? '';
  if (!t) return 'no-token';
  const h = { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' };
  const post = body => fetch('index.php?route=/console/update-config', {
    method: 'POST', headers: h, body: 'ajax_request=true&server=1&token=' + t + '&' + body,
  });
  const r1 = await post('key=DarkTheme&value=false');
  if (r1.status !== 200) return 'DarkTheme ' + r1.status;
  const r2 = await post('key=Mode&value=collapse');
  return r2.status;
});
if (darkReset !== 200) throw new Error('console prefs reset -> ' + darkReset);
const has = await page.evaluate(() => {
  const current = [...document.styleSheets].map(s => s.href).find(h => h.includes('/themes/'));
  if (current && current.includes('/pmahomme/')) return 'already';
  const btn = document.querySelector('button[name="set_theme"][value="pmahomme"], input[name="set_theme"][value="pmahomme"]');
  if (btn) { btn.click(); return true; }
  return false;
});
if (has === false) throw new Error('pmahomme theme button not found');
if (has === 'already') {
  const mode0 = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'));
  if (mode0 === 'light') {
    console.log('theme already pmahomme/light (DarkTheme=false)');
    await ctx.storageState({ path: state });
    await browser.close();
    process.exit(0);
  }
}
await page.waitForLoadState('load');
await page.waitForTimeout(600);
// ensure light color mode too
const lightForm = await page.evaluate(() => {
  const f = [...document.querySelectorAll('form')].find(f => f.querySelector('[name=themeColorMode]')?.value === 'light');
  if (f) { f.submit(); return true; }
  return false;
});
if (lightForm) { await page.waitForLoadState('load'); await page.waitForTimeout(400); }
const href = await page.evaluate(() => [...document.styleSheets].map(s => s.href).find(h => h.includes('/themes/')));
const mode = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'));
if (!href || !href.includes('/pmahomme/') || mode !== 'light') {
  throw new Error('theme not reset: ' + href + ' mode=' + mode);
}
console.log('theme reset OK: ' + href + ' mode=' + mode);
// reset Console/DarkTheme (persisted server-side by console-dark-pmahomme)
const darkReset = await page.evaluate(async () => {
  const t = document.querySelector('input[name=token]')?.value ?? '';
  const res = await fetch('index.php?route=/console/update-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
    body: 'ajax_request=true&server=1&key=DarkTheme&value=false&token=' + t,
  });
  return res.status;
});
if (darkReset !== 200) throw new Error('DarkTheme reset -> HTTP ' + darkReset);
console.log('console DarkTheme reset OK');
await ctx.storageState({ path: state });
await browser.close();
