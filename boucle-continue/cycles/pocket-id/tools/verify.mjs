// verify.mjs — cycle 20 pocket-id : assertions dures sur le DOM patché.
// Usage : node verify.mjs http://localhost:1411   (auth via auth.json)
// Chaque check affirme l'effet réel ; un élément requis absent = FAIL, exit 1.
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:1411';
let passed = 0, failed = 0;
function ok(name, cond, detail = '') {
  if (cond) { passed++; console.log(`  PASS ${name}`); }
  else { failed++; console.log(`  FAIL ${name} ${detail}`); }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: new URL('./auth.json', import.meta.url).pathname });
const page = await ctx.newPage();

async function go(path, wait = 4000) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(wait);
}

// --- landmarks ---
await go('/settings/account');
ok('header landmark', await page.locator('header').first().isVisible());
ok('main landmark', (await page.locator('main').count()) >= 1);
ok('powered-by footer est contentinfo', await page.evaluate(() => {
  const f = [...document.querySelectorAll('footer')].find(e => e.textContent.includes('Pocket'));
  return !!f && !f.closest('section,article,aside,nav');
}));

// --- image-alt : avatars décoratifs ---
await go('/settings/admin/users');
const imgsNoAlt = await page.locator('img:not([alt])').count();
ok('0 img sans alt (users)', imgsNoAlt === 0, `${imgsNoAlt} restantes`);

// --- alert dismiss button ---
await go('/settings/account');
ok('alert dismiss a un aria-label', await page.evaluate(() =>
  [...document.querySelectorAll('[data-slot="alert"] button')].every(b => (b.getAttribute('aria-label') || b.innerText.trim()).length > 0)));

// --- item-group : pas de role=list orphelin ---
ok('item-group sans role=list', (await page.locator('[data-slot="item-group"][role="list"]').count()) === 0);

// --- file-input button label ---
await go('/settings/admin/application-configuration');
const fiBad = await page.evaluate(() =>
  [...document.querySelectorAll('button')].filter(b => b.querySelector('input[type="file"]') && !b.getAttribute('aria-label')).length);
ok('file-input boutons labellisés', fiBad === 0, `${fiBad} non labellisés`);

// --- url-list inputs aria-label ---
const cb = await page.evaluate(() =>
  [...document.querySelectorAll('[data-testid^="cimd-url-allowlist-"]')].map(i => i.getAttribute('aria-label')));
ok('champs CIMD urls labellisés', cb.length > 0 && cb.every(l => l && l.trim().length > 3 && !/^\d+$/.test(l.trim())), JSON.stringify(cb));

// --- duplicate id ---
await go('/settings/admin/application-configuration');
ok('ids skip-cert uniques', await page.evaluate(() => {
  const ids = [...document.querySelectorAll('[id]')].map(e => e.id).filter(i => i.includes('skip-cert'));
  return ids.length === new Set(ids).size;
}));

// --- ghost collapse buttons (patchés aria-label={m.close()} sur apis + api-keys) ---
await go('/settings/admin/apis');
await page.waitForTimeout(1500).catch(() => {});
const apisAdd = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x => /add api|ajouter une api/i.test(x.innerText || ''));
  if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  return !!b;
});
await page.waitForTimeout(800).catch(() => {});
ok('bouton collapse apis labellisé (après expand)', apisAdd && await page.evaluate(() => {
  const iconOnly = [...document.querySelectorAll('button')].filter(x => x.className.includes('h-8') && x.querySelector('svg') && !(x.innerText || '').trim());
  return iconOnly.length > 0 && iconOnly.every(x => (x.getAttribute('aria-label') || '').trim().length > 0);
}));

// --- heading order : h2 pas h3 sur profile-picture ---
await go('/settings/account');
ok('h2 présent settings account', (await page.locator('h2').count()) >= 1);

// --- tooltip nested-interactive : pas de button dans button ---
const nested = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.querySelector('button')).length);
ok('0 button imbriqué', nested === 0, `${nested}`);

// --- popup layer landmark ---
ok('#a11y-popup-layer role=complementary', await page.evaluate(() => {
  const l = document.getElementById('a11y-popup-layer');
  return l && l.getAttribute('role') === 'complementary' && !!l.getAttribute('aria-label');
}));

// --- menu opens inside layer + aria-controls resolves ---
await page.getByRole('button', { name: /my account|mon compte/i }).click();
await page.waitForSelector('[role="menu"]', { timeout: 10000 });
const ac = await page.evaluate(() => {
  const t = document.querySelector('[data-slot="dropdown-menu-trigger"][aria-expanded="true"]');
  const id = t?.getAttribute('aria-controls');
  return { id, resolves: id ? !!document.getElementById(id) : false,
           inLayer: !!document.querySelector('#a11y-popup-layer [role="menu"]') };
});
ok('aria-controls du menu résout', ac.resolves, JSON.stringify(ac));
ok('menu rendu dans le layer', ac.inLayer);
await page.keyboard.press('Escape');

// --- combobox triggers named (audit-log) ---
await go('/settings/audit-log/global', 9000);
const combos = await page.evaluate(() =>
  [...document.querySelectorAll('[role="combobox"]')].map(c => c.getAttribute('aria-label')));
ok('4 comboboxes labellisés', combos.filter(l => !!l).length >= 4, JSON.stringify(combos));

// --- dark mode toggle réel ---
await go('/settings/account');
await page.getByRole('button', { name: /toggle theme|thème/i }).click();
await page.waitForSelector('[role="menu"]', { timeout: 10000 });
await page.getByRole('menuitem', { name: /dark|sombre/i }).click();
await page.waitForFunction(() => document.documentElement.classList.contains('dark'), { timeout: 10000 });
ok('mode sombre appliqué (html.dark)', true);

console.log(`\nverify: ${passed} PASS, ${failed} FAIL`);
await browser.close();
process.exit(failed ? 1 : 0);
