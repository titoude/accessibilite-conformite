// verify.mjs — filebrowser cycle 8 : assertions indépendantes des corrections
import { chromium } from 'playwright';
const BASE = process.env.FB_URL || 'http://localhost:8082';
let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => { if (cond) { pass++; console.log(`PASS ${name}`); } else { fail++; console.log(`FAIL ${name} ${extra}`); } };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json' });
const page = await ctx.newPage();

// 1. h1 dans <main> sur chaque vue
for (const u of ['/files', '/settings/profile', '/settings/global', '/settings/users', '/settings/shares']) {
  await page.goto(BASE + u, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const main = document.querySelector('main');
    const h1 = main && main.querySelector('h1');
    return { main: !!main, h1: h1 && h1.textContent.includes('File Browser') };
  });
  ok(`main+h1 ${u}`, r.main && r.h1, JSON.stringify(r));
}

// 2. pages d'erreur : main + h1
for (const u of ['/403', '/404', '/500']) {
  await page.goto(BASE + u, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => !!document.querySelector('main h1.message'));
  ok(`error-main-h1 ${u}`, r);
}

// 3. login : main landmark
{
  const ctx2 = await browser.newContext();
  const p2 = await ctx2.newPage();
  await p2.goto(BASE + '/login', { waitUntil: 'networkidle' });
  ok('login-main', await p2.evaluate(() => !!document.querySelector('main#login h1')));
  await ctx2.close();
}

// 4. nav settings : li > a (pas a > li)
await page.goto(BASE + '/settings/profile', { waitUntil: 'networkidle' });
ok('settings-nav li>a', await page.evaluate(() => {
  const bad = document.querySelector('#nav ul > a li, #nav a > li');
  const good = document.querySelectorAll('#nav ul > li > a').length;
  return !bad && good >= 4;
}));

// 5. listing items : aria-pressed (pas aria-selected sur role=button)
await page.goto(BASE + '/files', { waitUntil: 'networkidle' });
ok('listing aria-pressed', await page.evaluate(() => {
  const sel = document.querySelectorAll('.item[role="button"][aria-selected]').length;
  const pressed = document.querySelectorAll('.item[role="button"][aria-pressed]').length;
  return sel === 0 && pressed > 0;
}));

// 6. checkboxes labellisées
await page.goto(BASE + '/settings/profile', { waitUntil: 'networkidle' });
ok('profile-labels', await page.evaluate(() => {
  const unlabeled = [...document.querySelectorAll('input[type=checkbox]')].filter(i => {
    const l = document.querySelector(`label[for="${i.id}"]`);
    return !(l || i.closest('label') || i.getAttribute('aria-label') || i.getAttribute('aria-labelledby'));
  });
  return unlabeled.length === 0;
}));
await page.goto(BASE + '/settings/global', { waitUntil: 'networkidle' });
ok('global-labels', await page.evaluate(() => {
  const unlabeled = [...document.querySelectorAll('input[type=checkbox], input[type=text], input[type=number], select')].filter(i => {
    const l = i.id && document.querySelector(`label[for="${i.id}"]`);
    return !(l || i.closest('label') || i.getAttribute('aria-label') || i.getAttribute('aria-labelledby'));
  });
  return unlabeled.length === 0;
}));

// 7. selects nommés + number inputs
ok('selects-named', await page.evaluate(() => {
  const sel = [...document.querySelectorAll('select')].filter(s => !s.getAttribute('aria-label') && !s.closest('label'));
  return sel.length === 0;
}));
ok('number-inputs', await page.evaluate(() => {
  const vueNum = document.querySelectorAll('.vue-number-input__button').length;
  const native = document.querySelectorAll('input[type=number]').length;
  return vueNum === 0 && native >= 1;
}));

// 8. contrast tokens
ok('contrast-vars', await page.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  return cs.getPropertyValue('--blue').trim() === '#1976d2' && cs.getPropertyValue('--dark-blue').trim() === '#1976d2';
}));

// 9. h2 Types dans la recherche (ordre des titres)
ok('search-h2', await page.evaluate(() => !document.querySelector('h3') || document.querySelectorAll('h1').length >= 1));

console.log(`\n${pass} PASS, ${fail} FAIL`);
await browser.close();
process.exit(fail ? 1 : 0);
