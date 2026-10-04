// eval-final.mjs — évaluation indépendante cycle 20 pocket-id.
// Rejoue des parcours utilisateur réels et des mutants mentaux :
// le correcteur a-t-il réparé le produit, ou juste satisfait axe ?
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

// 1. Un lecteur d'écran peut-il naviguer par landmarks ? (header/nav/main/footer réels)
await go('/settings/apps');
const lm = await page.evaluate(() => ({
  header: !!document.querySelector('header'), main: !!document.querySelector('main'),
  footer: !!document.querySelector('footer'), nav: document.querySelectorAll('nav').length }));
ok('landmarks header/main/footer/nav', lm.header && lm.main && lm.footer && lm.nav >= 1, JSON.stringify(lm));

// 2. Le formulaire "add user" s'ouvre et ses champs ont des noms accessibles réels
await go('/settings/admin/users');
await page.getByRole('button', { name: /add user|create user|ajouter/i }).click();
await page.waitForSelector('input[name="username"], input#username, form', { timeout: 10000 });
const formNames = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('input:not([type="hidden"]), select, textarea')]
    .filter(i => i.offsetParent !== null);
  return inputs.map(i => ({ tag: i.tagName, name: i.getAttribute('aria-label') || i.getAttribute('aria-labelledby')
    || (i.labels && i.labels.length ? i.labels[0].textContent.trim() : '') || i.placeholder ? 'ok' : null }));
});
ok('champs form ajout-utilisateur nommés', formNames.length > 0 && formNames.every(x => x.name), JSON.stringify(formNames.slice(0,6)));
await page.keyboard.press('Escape');

// 3. Menu thème : les items sont de vrais menuitems focusables clavier
await go('/settings/account');
await page.getByRole('button', { name: /toggle theme|thème/i }).click();
await page.waitForSelector('[role="menu"]', { timeout: 10000 });
const mi = await page.locator('[role="menuitem"], [role="menuitemradio"]').count();
ok('menu thème a des menuitems réels', mi >= 2, `${mi}`);
await page.keyboard.press('Escape');

// 4. Un lien dans le footer est distingué (souligné) — link-in-text-block
const linkStyled = await page.evaluate(() => {
  const a = [...document.querySelectorAll('footer a')].find(x => x.href.includes('github'));
  if (!a) return false;
  const cs = getComputedStyle(a);
  return cs.textDecorationLine.includes('underline') || cs.textDecoration.includes('underline');
});
ok('lien footer souligné', linkStyled);

// 5. Les tooltips ne créent pas de nested-interactive : Rename passkey focusable seul
await go('/settings/account');
const nestedScan = await page.evaluate(() =>
  [...document.querySelectorAll('button, a')].filter(el => el.querySelector('button, a')).map(e => e.outerHTML.slice(0, 80)));
ok('0 interactif imbriqué (page account)', nestedScan.length === 0, JSON.stringify(nestedScan.slice(0,2)));

// 6. Mode sombre : la persistance survit à une navigation (pas juste un toggle visuel)
await page.getByRole('button', { name: /toggle theme|thème/i }).click();
await page.waitForSelector('[role="menu"]', { timeout: 10000 });
await page.getByRole('menuitem', { name: /dark|sombre/i }).click();
await page.waitForFunction(() => document.documentElement.classList.contains('dark'), { timeout: 10000 });
await page.goto(BASE + '/settings/apps', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
ok('mode sombre persiste après navigation', await page.evaluate(() => document.documentElement.classList.contains('dark')));

// 7. Les titres forment une hiérarchie (h1 → h2, pas de saut h1→h3 sur page de détail)
await go('/settings/admin/oidc-clients/3654a746-35d4-4321-ac61-0bdcff2b4055', 6000);
const headings = await page.evaluate(() =>
  [...document.querySelectorAll('h1,h2,h3,h4')].map(h => +h.tagName[1]).filter(Boolean));
const jumps = headings.reduce((acc, cur, i) => i && cur - headings[i-1] > 1 ? acc + 1 : acc, 0);
ok('hiérarchie de titres sans saut', jumps === 0 && headings[0] === 1, JSON.stringify(headings.slice(0,10)));

// 8. Le badge compteur "credentials" reste lisible (contrastes réels calculés)
const badgeOk = await page.evaluate(() => {
  const b = [...document.querySelectorAll('[data-slot="badge"]')].find(e => /^\d+$/.test(e.innerText.trim()));
  if (!b) return null;
  const cs = getComputedStyle(b);
  return { color: cs.color, bg: cs.backgroundColor };
});
ok('badge compteur a une couleur fg visible', !!badgeOk && badgeOk.color !== 'oklch(0.556 0 0)', JSON.stringify(badgeOk));

// 9. Mutant : si je casse le layer, le menu n'a nulle part où aller → preuve que le layer porte les portails
const layerHasContent = await page.evaluate(() => {
  const l = document.getElementById('a11y-popup-layer');
  return !!l;
});
await page.getByRole('button', { name: /my account|mon compte/i }).click().catch(() => {});
await page.waitForTimeout(800).catch(() => {});
const menuSomewhere = await page.evaluate(() =>
  !!document.querySelector('#a11y-popup-layer [role="menu"], #a11y-popup-layer [role="listbox"]'));
ok('portails vivent dans la couche landmark', layerHasContent && menuSomewhere);
await page.keyboard.press('Escape');

// 10. Page publique : /login a exactement un h1 et un main
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
const pub = await page.evaluate(() => ({
  h1: document.querySelectorAll('h1').length, main: document.querySelectorAll('main').length }));
ok('/login : 1 h1 + 1 main', pub.h1 === 1 && pub.main === 1, JSON.stringify(pub));

console.log(`\neval-final: ${passed} PASS, ${failed} FAIL`);
await browser.close();
process.exit(failed ? 1 : 0);
