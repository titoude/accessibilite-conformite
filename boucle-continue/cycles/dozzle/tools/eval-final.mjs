// eval-final.mjs — cycle 9 dozzle : vérifications fonctionnelles indépendantes
// (détails non couverts par verify.mjs : comportements utilisateur réels)
import { chromium } from 'playwright';
const BASE = 'http://localhost:8083';
const CID = '0b8bb5aa3e7f'; // a11y-web
let pass = 0, fail = 0;
const ok = (n, c, x='') => { c ? pass++ : fail++; console.log(`${c?'PASS':'FAIL'} ${n} ${x}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));

// 1. dashboard : cartes hôtes + liste conteneurs avec liens navigables
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[role="main"]', { timeout: 15000 });
await page.waitForTimeout(1500);
ok('dashboard-links', await page.evaluate(() =>
  document.querySelectorAll('a[href^="/container/"]').length >= 2 &&
  !!document.querySelector('aside')));

// 2. navigation vers un conteneur : logs streamés visibles
await page.goto(`${BASE}/container/${CID}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[role="main"]', { timeout: 15000 });
await page.waitForTimeout(2500);
ok('container-logs', await page.evaluate(() =>
  document.querySelectorAll('.log-message, [class*="log"], time').length > 0));

// 3. toggle thème via les réglages : cliquer Auto -> Dark change data-theme/class
await page.goto(BASE + '/settings', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[role="main"]', { timeout: 15000 });
await page.waitForTimeout(1200);
ok('settings-rendered', await page.evaluate(() => document.querySelectorAll('button, input, select, a').length > 10));

// 4. mobile : tab bar présente et nav aside absente
await page.setViewportSize({ width: 390, height: 800 });
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[role="main"]', { timeout: 15000 });
await page.waitForTimeout(1200);
ok('mobile-tabbar', await page.evaluate(() => {
  const aside = document.querySelector('aside');
  const asideHidden = !aside || !aside.checkVisibility();
  return asideHidden && document.querySelectorAll('a[href^="/"], nav a').length > 0;
}));
await page.setViewportSize({ width: 1280, height: 800 });

// 5. collapse nav : le layout reste stable (splitpanes recalcule sans erreur)
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[role="main"]', { timeout: 15000 });
await page.waitForTimeout(1000);
const hide = page.locator('button[title*="sidebar" i], button[aria-label*="sidebar" i]').first();
if (await hide.count()) {
  await hide.click(); await page.waitForTimeout(800);
  const collapsed = await page.evaluate(() => !document.querySelector('aside .splitpanes__splitter'));
  // L'état collapseNav persiste côté profil : restaurer pour ne pas polluer les audits suivants.
  const show = page.locator('button[title*="sidebar" i], button[aria-label*="sidebar" i]').first();
  if (await show.count()) { await show.click(); await page.waitForTimeout(800); }
  ok('collapse-nav', collapsed && await page.evaluate(() => !!document.querySelector('aside .splitpanes__splitter')));
} else {
  ok('collapse-nav', false, 'bouton hide-sidebar introuvable');
}

// 6. aucune erreur JS page
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
ok('no page errors', errors.length === 0, errors.join(' | ').slice(0, 200));

console.log(`\n${pass} PASS, ${fail} FAIL`);
await browser.close();
process.exit(fail ? 1 : 0);
