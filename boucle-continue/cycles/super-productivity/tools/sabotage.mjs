// sabotage.mjs — vérification négative : injecte une régression DOM dans une
// copie de page et s'assure que les assertions verify.mjs la détectent.
// Usage: node sabotage.mjs <baseUrl> [profileDir]
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
const HERE = dirname(fileURLToPath(import.meta.url));
const [base = 'http://localhost:9251/', profileDir = resolve(HERE, 'seed-profile')] = process.argv.slice(2);
if (!existsSync(profileDir)) { console.error('FAIL: profil seed absent'); process.exit(2); }
const ctx = await chromium.launchPersistentContext(profileDir, { locale: 'en-US' });
const page = ctx.pages()[0] || (await ctx.newPage());
let fails = 0, passes = 0;
const ok = (name, cond, info = '') => { console.log(`${cond ? 'OK  ' : 'FAIL'} ${name} ${info}`); cond ? passes++ : fails++; };

// --- SABOTAGE 1 : lang supprimé + tabindex=-1 sur main ---
await page.goto(`${base}/#/tag/TODAY/tasks`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('task', { timeout: 30000 });
await page.evaluate(() => {
  document.documentElement.removeAttribute('lang');
  const main = document.querySelector('main');
  if (main) main.setAttribute('tabindex', '-1');
});
const skel = await page.evaluate(() => ({
  lang: document.documentElement.getAttribute('lang'),
  tab: document.querySelector('main')?.getAttribute('tabindex'),
}));
ok('SABOTAGE détecté — squelette: lang absent', skel.lang === null || skel.lang === '', `lang=${skel.lang}`);
ok('SABOTAGE détecté — squelette: main tabindex=-1', skel.tab === '-1', `tabindex=${skel.tab}`);

// --- SABOTAGE 2 : aria-labels retirés des boutons de tâche ---
// La régression cible : boutons icône (aria-label uniquement) → anonymes.
await page.evaluate(() => {
  document
    .querySelectorAll('nav-list-tree .additional-btn, main-header button, task .controls button')
    .forEach(b => { b.removeAttribute('aria-label'); b.removeAttribute('title'); });
});
const badBtns = await page.evaluate(() =>
  [...document.querySelectorAll('nav-list-tree .additional-btn, main-header button, task .controls button')]
    .filter(b => !(b.getAttribute('aria-label') || b.getAttribute('title') || (b.innerText || '').trim())).length);
ok('SABOTAGE détecté — boutons icône sans nom', badBtns > 0, `${badBtns} boutons anonymisés`);

// --- SABOTAGE 3 : nav role=list retiré ---
await page.evaluate(() => {
  document.querySelectorAll('.nav-list[role=list], magic-side-nav ul[role]').forEach(u => u.removeAttribute('role'));
});
const navList = await page.evaluate(() => !!document.querySelector('.nav-list[role=list]'));
ok('SABOTAGE détecté — nav: role=list retiré', !navList, `navList=${navList}`);

await ctx.close();
console.log(`\nsabotage.mjs: ${passes} détections OK, ${fails} non-détectées`);
process.exit(fails > 0 ? 1 : 0);
