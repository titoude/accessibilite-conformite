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
    console.log('theme already pmahomme/light');
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
await ctx.storageState({ path: state });
await browser.close();
