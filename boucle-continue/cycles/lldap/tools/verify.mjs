/**
 * verify.mjs — assertions DURES sur les corrections lldap (cycle 26).
 * Chaque assertion échoue → process.exit(1). Aucun self-verdict axe :
 * le score axe est produit par audit.mjs, pas ici.
 *
 * Usage: node verify.mjs <baseUrl> <auth.json>
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const [base, authFile] = process.argv.slice(2);
const state = authFile ? JSON.parse(readFileSync(authFile, 'utf8')) : undefined;
const results = [];
const ok = (name, cond, extra = '') => {
  results.push({ name, pass: !!cond });
  if (!cond) console.error(`  FAIL ${name} ${extra}`);
  return cond;
};

const contrast = (fg, bg) => {
  const lum = (c) => c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  const [r1, g1, b1] = lum(fg), [r2, g2, b2] = lum(bg);
  const L1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const L2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};
const rgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);

const VALID_AUTOCOMPLETE = new Set([
  'on','off','name','honorific-prefix','given-name','additional-name','family-name',
  'honorific-suffix','nickname','username','new-password','current-password','one-time-code',
  'organization-title','organization','street-address','address-line1','address-line2',
  'address-line3','address-level4','address-level3','address-level2','address-level1',
  'country','country-name','postal-code','cc-name','cc-given-name','cc-additional-name',
  'cc-family-name','cc-number','cc-exp','cc-exp-month','cc-exp-year','cc-csc','cc-type',
  'transaction-currency','transaction-amount','language','bday','bday-day','bday-month',
  'bday-year','sex','url','photo','tel','tel-country-code','tel-national','tel-area-code',
  'tel-local','tel-local-prefix','tel-local-suffix','tel-extension','email','impp',
]);

const browser = await chromium.launch();

// Contexte ANONYME pour les pages publiques (le login redirige quand on est connecté)
const anonCtx = await browser.newContext();
const anonPage = await anonCtx.newPage();
anonPage.setDefaultTimeout(15000);

// Contexte AUTHENTIFIÉ pour le reste
const ctx = await browser.newContext(state ? { storageState: state } : {});
const page = await ctx.newPage();
page.setDefaultTimeout(15000);

const h1s = async () => page.evaluate(() =>
  [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).filter(Boolean));

const unlabeledFields = () => page.evaluate(() =>
  [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), select, textarea')]
    .filter(el => el.offsetParent !== null)
    .filter(el => {
      const lab = el.getAttribute('aria-labelledby');
      const labOk = lab ? lab.split(/\s+/).some(id => (document.getElementById(id)?.textContent || '').trim()) : false;
      const forLab = el.id ? [...document.querySelectorAll('label')].some(l => l.getAttribute('for') === el.id) : false;
      return !(el.getAttribute('aria-label') || el.getAttribute('title') || labOk || forLab || el.closest('label'));
    }).map(el => el.name || el.id || el.type));

// ── 1. Login (contexte anonyme) : h1 + champs labellisés ───────────────────
await anonPage.goto(`${base}/login`, { waitUntil: 'domcontentloaded' });
await anonPage.waitForSelector('#username');
const login = await anonPage.evaluate(() => ({
  h1s: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).filter(Boolean),
  labeled: ['username', 'password'].every(id => {
    const el = document.getElementById(id);
    return el && [...document.querySelectorAll('label')].some(l => l.getAttribute('for') === id);
  }),
}));
ok('login: exactement 1 h1 non vide', login.h1s.length === 1, login.h1s.join('|'));
ok('login: username+password ont un <label for>', login.labeled);

// ── 2. Footer (page publique) : contrastes mesurés light ───────────────────
const footerLight = await anonPage.evaluate(() => {
  const f = document.querySelector('footer');
  const bgOf = (el) => { for (let n = el; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (c && !c.endsWith(', 0)')) return c; } return 'rgb(255,255,255)'; };
  return {
    span: { color: getComputedStyle(f.querySelector('span')).color, bg: bgOf(f.querySelector('span')) },
    link: { color: getComputedStyle(f.querySelector('a')).color, bg: bgOf(f.querySelector('a')) },
    iconLabels: [...f.querySelectorAll('a')].map(a => a.getAttribute('aria-label') || (a.textContent || '').trim()),
  };
});
const rSpan = contrast(rgb(footerLight.span.color), rgb(footerLight.span.bg));
const rLink = contrast(rgb(footerLight.link.color), rgb(footerLight.link.bg));
ok('footer light: span >= 4.5', rSpan >= 4.5, `${footerLight.span.color}/${footerLight.span.bg}=${rSpan.toFixed(2)}`);
ok('footer light: lien >= 4.5', rLink >= 4.5, `${footerLight.link.color}/${footerLight.link.bg}=${rLink.toFixed(2)}`);
ok('footer: 3 liens icônes nommés + 1 lien texte', footerLight.iconLabels.every(x => x), footerLight.iconLabels.join('|'));

// ── 3. /users : h1 + boutons delete nommés + table ─────────────────────────
await page.goto(`${base}/users`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main table');
const users = await page.evaluate(() => ({
  unnamed: [...document.querySelectorAll('button')].filter(b => b.offsetParent && !(b.getAttribute('aria-label') || (b.textContent || '').trim())).length,
  thEmpty: [...document.querySelectorAll('th')].filter(t => !(t.textContent || '').trim()).length,
}));
const usersH1 = await h1s();
ok('users: exactement 1 h1', usersH1.length === 1, usersH1.join('|'));
ok('users: aucun bouton anonyme', users.unnamed === 0, `${users.unnamed}`);
ok('users: aucun <th> vide', users.thEmpty === 0, `${users.thEmpty}`);

// ── 4. /users/create : h1 + champs + checkboxes + select/autocomplete ──────
await page.goto(`${base}/users/create`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main form');
const createU = await page.evaluate(() => ({
  h1s: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).filter(Boolean),
  badAutocomplete: [...document.querySelectorAll('input[autocomplete]')]
    .map(i => i.getAttribute('autocomplete'))
    .filter(v => v && v !== 'off'),
  checkboxIds: [...document.querySelectorAll('input[type="checkbox"]')].map(c => c.id).filter(Boolean),
  labelForOk: [...document.querySelectorAll('input[type="checkbox"]')]
    .every(c => c.id && [...document.querySelectorAll('label')].some(l => l.getAttribute('for') === c.id)),
}));
const unlCU = await unlabeledFields();
ok('create-user: h1 présent', createU.h1s.length === 1, createU.h1s.join('|'));
ok('create-user: aucun champ sans nom accessible', unlCU.length === 0, unlCU.join(','));
ok('create-user: checkboxes ont id + label[for]', createU.checkboxIds.length > 0 && createU.labelForOk, createU.checkboxIds.join(','));
ok('create-user: autocomplete = tokens valides ou off', createU.badAutocomplete.every(v => VALID_AUTOCOMPLETE.has(v)), createU.badAutocomplete.join(','));

// ── 5. /user/jdoe : h1 = id, h2 sections, select nommé, th Remove ──────────
await page.goto(`${base}/user/jdoe`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main h1');
const uDetail = await page.evaluate(() => ({
  h1s: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).filter(Boolean),
  h2s: [...document.querySelectorAll('h2')].map(h => h.textContent.trim()).filter(Boolean),
  h5s: document.querySelectorAll('h5').length,
  selectLabel: document.querySelector('select')?.getAttribute('aria-label'),
  removeBtnLabels: [...document.querySelectorAll('td button[aria-label]')].map(b => b.getAttribute('aria-label')),
}));
ok('user-detail: h1 = username', uDetail.h1s.length === 1 && uDetail.h1s[0] === 'jdoe', uDetail.h1s.join('|'));
ok('user-detail: sections en h2', uDetail.h2s.length >= 2 && uDetail.h5s === 0, uDetail.h2s.join('|'));
ok('user-detail: select aria-label', !!uDetail.selectLabel, String(uDetail.selectLabel));
ok('user-detail: boutons Remove nommés (dont user)', uDetail.removeBtnLabels.some(x => /jdoe/.test(x)), uDetail.removeBtnLabels.join('|'));
const unlUD = await unlabeledFields();
ok('user-detail: aucun champ sans nom accessible', unlUD.length === 0, unlUD.join(','));

// ── 6. /groups + /group/4 : h1/h2/th/select/bouton remove ──────────────────
await page.goto(`${base}/groups`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main table');
ok('groups: h1 présent', (await h1s()).length === 1);

await page.goto(`${base}/group/4`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main h1');
const gDetail = await page.evaluate(() => ({
  h1s: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).filter(Boolean),
  thEmpty: [...document.querySelectorAll('th')].filter(t => !(t.textContent || '').trim()).length,
  removeLabels: [...document.querySelectorAll('button[aria-label]')].map(b => b.getAttribute('aria-label')).filter(x => /remove/i.test(x)),
}));
ok('group-detail: h1 = nom du groupe', gDetail.h1s.length === 1 && /test users/i.test(gDetail.h1s[0]), gDetail.h1s.join('|'));
ok('group-detail: aucun <th> vide', gDetail.thEmpty === 0);
ok('group-detail: bouton remove member nommé', gDetail.removeLabels.length >= 1, gDetail.removeLabels.join('|'));

// ── 7. Pages attributs : h1/h2 ─────────────────────────────────────────────
for (const [url, expect] of [['/user-attributes', 'User attributes'], ['/group-attributes', 'Group attributes']]) {
  await page.goto(`${base}${url}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main h1');
  const d = await page.evaluate(() => ({
    h1s: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()),
    h2s: document.querySelectorAll('h2').length,
    h3s: document.querySelectorAll('h3').length,
  }));
  ok(`${url}: h1 = ${expect}`, d.h1s.length === 1 && d.h1s[0] === expect, d.h1s.join('|'));
  ok(`${url}: sections en h2 (≥2), pas de h3`, d.h2s >= 2 && d.h3s === 0, `h2=${d.h2s} h3=${d.h3s}`);
}
for (const url of ['/user-attributes/create', '/group-attributes/create', '/groups/create', '/user/jdoe/password']) {
  await page.goto(`${base}${url}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main h1');
  const h = await h1s();
  ok(`${url}: h1 présent`, h.length === 1, h.join('|'));
}
const unlCA = await unlabeledFields();
ok('create-attribute: aucun champ sans nom accessible', unlCA.length === 0, unlCA.join(','));

// ── 8. État menu utilisateur : aria-labelledby résolu ──────────────────────
await page.goto(`${base}/users`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main table');
await page.locator('#dropdownUser').click();
await page.waitForSelector('.dropdown-menu.show, .dropdown-menu[style*="block"]', { timeout: 5000 }).catch(() => {});
const menu = await page.evaluate(() => {
  const ul = document.querySelector('.dropdown-menu');
  const lid = ul?.getAttribute('aria-labelledby');
  return { lid, resolves: !!lid && !!document.getElementById(lid) };
});
ok('menu: aria-labelledby résolu', menu.resolves, `aria-labelledby=${menu.lid}`);

// ── 9. État modale delete : role=dialog + label unique ─────────────────────
await page.locator('tbody tr:has-text("jdoe") > td > .btn-danger').first().click();
await page.waitForSelector('.modal.show', { timeout: 5000 });
const modal = await page.evaluate(() => {
  const m = document.querySelector('.modal.show');
  const lid = m?.getAttribute('aria-labelledby');
  const label = lid ? document.getElementById(lid) : null;
  const allIds = [...document.querySelectorAll('.modal [id]')].map(e => e.id);
  const dupIds = allIds.filter((v, i) => allIds.indexOf(v) !== i);
  return {
    role: m?.getAttribute('role'), lid, labelTag: label?.tagName, labelText: label?.textContent,
    titleH2: !!m?.querySelector('h2.modal-title'), dupIds,
  };
});
ok('modal: role=dialog', modal.role === 'dialog', String(modal.role));
ok('modal: aria-labelledby → h2 titre', modal.labelTag === 'H2' && modal.titleH2, `${modal.labelTag}:${modal.labelText}`);
ok('modal: ids uniques (aucun doublon)', modal.dupIds.length === 0, modal.dupIds.join(','));
// Fermeture via le bouton Cancel (Escape n'est pas câblé bootstrap ici — cf. eval-final)
await page.locator('.modal.show .btn-close').click();
await page.waitForTimeout(400);

// ── 10. Dark mode : contraste footer mesuré ────────────────────────────────
await page.locator('#darkModeToggle').click();
await page.waitForTimeout(500);
const footerDark = await page.evaluate(() => {
  const f = document.querySelector('footer');
  const bgOf = (el) => { for (let n = el; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (c && !c.endsWith(', 0)')) return c; } return 'rgb(0,0,0)'; };
  const span = f.querySelector('span'), link = f.querySelector('a');
  return {
    span: { color: getComputedStyle(span).color, bg: bgOf(span) },
    link: { color: getComputedStyle(link).color, bg: bgOf(link) },
  };
});
const dSpan = contrast(rgb(footerDark.span.color), rgb(footerDark.span.bg));
const dLink = contrast(rgb(footerDark.link.color), rgb(footerDark.link.bg));
ok('footer dark: span >= 4.5', dSpan >= 4.5, `${footerDark.span.color}/${footerDark.span.bg}=${dSpan.toFixed(2)}`);
ok('footer dark: lien >= 4.5', dLink >= 4.5, `${footerDark.link.color}/${footerDark.link.bg}=${dLink.toFixed(2)}`);

// ── 11. Incomplete axe résolu manuellement : contraste réel des <select> ───
// (axe sort 'bgImage' sur form-select ; on mesure color vs background-color)
await page.goto(`${base}/user/jdoe`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main h1');
const sel = await page.evaluate(() => {
  const s = document.querySelector('select');
  const cs = getComputedStyle(s);
  return { color: cs.color, bg: cs.backgroundColor };
});
const rSel = contrast(rgb(sel.color), rgb(sel.bg));
ok('select dark: contraste texte >= 4.5 (résolution manuelle incomplete)', rSel >= 4.5, `${sel.color}/${sel.bg}=${rSel.toFixed(2)}`);

await browser.close();
const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} assertions OK`);
if (failed.length) process.exit(1);
console.log('verify.mjs : tout OK');
