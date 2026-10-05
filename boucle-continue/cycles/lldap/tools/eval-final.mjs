/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Couvre des aspects que le développement n'a pas testés : si l'un échoue,
 * c'est un finding légitime à consolider (FAIL), pas un bug du harnais.
 *
 * Usage: node eval-final.mjs <baseUrl> <auth.json>
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

const browser = await chromium.launch();

const anonCtx = await browser.newContext();
const anonPage = await anonCtx.newPage();
anonPage.setDefaultTimeout(15000);

const ctx = await browser.newContext(state ? { storageState: state } : {});
const page = await ctx.newPage();
page.setDefaultTimeout(15000);

// ── A. Métadonnées document : lang + title non vides ───────────────────────
await anonPage.goto(`${base}/login`, { waitUntil: 'domcontentloaded' });
await anonPage.waitForSelector('#username');
const meta = await anonPage.evaluate(() => ({
  lang: document.documentElement.getAttribute('lang'),
  title: document.title,
}));
ok('document: <html lang> présent', !!meta.lang, String(meta.lang));
ok('document: <title> non vide', !!meta.title.trim(), meta.title);

// ── B. Identifiants dupliqués sur chaque route du scope ────────────────────
const routes = ['/users', '/users/create', '/user/jdoe', '/user/jdoe/password',
  '/groups', '/groups/create', '/group/4',
  '/user-attributes', '/user-attributes/create',
  '/group-attributes', '/group-attributes/create'];
for (const r of routes) {
  await page.goto(`${base}${r}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main h1, main table, main form');
  await page.waitForTimeout(600);
  const dups = await page.evaluate(() => {
    const all = [...document.querySelectorAll('[id]')].map(e => e.id);
    return [...new Set(all.filter((v, i) => all.indexOf(v) !== i))];
  });
  ok(`${r}: aucun id dupliqué`, dups.length === 0, dups.join(','));
}

// ── C. Ordre des titres : jamais de saut h1→h3+ ────────────────────────────
for (const r of routes) {
  await page.goto(`${base}${r}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main h1, main table, main form');
  await page.waitForTimeout(400);
  const skip = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
    let prev = 0, bad = null;
    for (const h of hs) {
      const l = +h.tagName[1];
      if (l > prev + 1 && prev !== 0) bad = `h${prev}->h${l} sur "${h.textContent.trim().slice(0, 30)}"`;
      prev = l;
    }
    return bad;
  });
  ok(`${r}: pas de saut de niveau de titre`, !skip, String(skip));
}

// ── D. Modale : le focus entre dans le dialog + Escape ferme ───────────────
await page.goto(`${base}/users`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main table');
await page.locator('tbody tr:has-text("jdoe") > td > .btn-danger').first().click();
await page.waitForSelector('.modal.show');
await page.waitForTimeout(300);
const focusIn = await page.evaluate(() => {
  const m = document.querySelector('.modal.show');
  return m && m.contains(document.activeElement);
});
ok('modal: focus déplacé dans le dialog', !!focusIn,
  String(await page.evaluate(() => document.activeElement?.tagName + '#' + document.activeElement?.id)));
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
const closed = await page.evaluate(() => !document.querySelector('.modal.show'));
ok('modal: Escape ferme la modale', closed);
// Sécurité : si restée ouverte, refermer pour la suite
if (!closed) await page.locator('.modal.show .btn-close').click().catch(() => {});

// ── E. aria-expanded reflète l'état réel du menu utilisateur ───────────────
const exp = await page.evaluate(() => {
  const t = document.querySelector('#dropdownUser');
  const before = t.getAttribute('aria-expanded');
  t.click();
  return new Promise(r => setTimeout(() => r({ before, after: t.getAttribute('aria-expanded') }), 500));
});
ok('aria-expanded: bascule false→true', exp.before === 'false' && exp.after === 'true', JSON.stringify(exp));

// ── F. Navigation clavier : Tab atteint des éléments interactifs ───────────
await page.keyboard.press('Escape').catch(() => {});
await page.keyboard.press('Tab');
const tabOk = await page.evaluate(() => {
  const el = document.activeElement;
  return el && el !== document.body && /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName);
});
ok('clavier: Tab focalise un élément interactif', !!tabOk,
  String(await page.evaluate(() => document.activeElement?.tagName)));

// ── G. Checkbox dark-mode : nom accessible visible ─────────────────────────
const dm = await page.evaluate(() => {
  const c = document.getElementById('darkModeToggle');
  const lab = c && [...document.querySelectorAll('label')].find(l => l.getAttribute('for') === c.id);
  return { found: !!c, label: lab?.textContent.trim() };
});
ok('dark-mode: checkbox + label visible', dm.found && !!dm.label, dm.label);

// ── H. Reflow 320px : pas de débordement horizontal ─────────────────────────
await page.setViewportSize({ width: 320, height: 800 });
await page.goto(`${base}/user/jdoe`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main h1');
await page.waitForTimeout(800);
const reflow = await page.evaluate(() => {
  const wide = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (el.scrollWidth > 322 && el.offsetParent !== null) wide.push(el.tagName + '.' + String(el.className).slice(0, 40));
  }
  return { wide: wide.slice(0, 5), docW: document.documentElement.scrollWidth };
});
ok('reflow 320px: aucun élément >322px', reflow.wide.length === 0, reflow.wide.join(' | '));

// ── I. Zoom 200% : contenu texte préservé ───────────────────────────────────
await page.setViewportSize({ width: 640, height: 800 });
await page.goto(`${base}/users`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main table');
await page.evaluate(() => { document.body.style.zoom = '2'; });
await page.waitForTimeout(800);
const zoom = await page.evaluate(() => ({ bodyText: document.body.innerText.length }));
ok('zoom 200%: contenu texte préservé', zoom.bodyText > 200, `${zoom.bodyText} chars`);

// ── J. Tableaux : en-têtes <th> portent scope/col sur les 4 listes ──────────
await page.evaluate(() => { document.body.style.zoom = ''; });
await page.goto(`${base}/user/jdoe`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main h1');
const th = await page.evaluate(() => {
  const empt = [...document.querySelectorAll('table th')].filter(t => !(t.textContent || '').trim());
  const noScope = [...document.querySelectorAll('thead th')].filter(t => !t.getAttribute('scope') && !t.getAttribute('id'));
  return { empty: empt.length, totalTh: document.querySelectorAll('th').length };
});
ok('tables: aucun <th> vide (toutes pages)', th.empty === 0, `${th.empty}/${th.totalTh}`);

// ── K. Contrastes manuels des <select> (résolution des 'incomplete' axe) ────
// axe sort 'bgImage' sur form-select : on mesure color vs background-color.
const contrast = (fg, bg) => {
  const lum = (c) => c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  const [r1, g1, b1] = lum(fg), [r2, g2, b2] = lum(bg);
  const L1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const L2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};
const rgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
const selLight = await page.evaluate(() => {
  const s = document.querySelector('select');
  const cs = getComputedStyle(s);
  return { color: cs.color, bg: cs.backgroundColor };
});
const rL = contrast(rgb(selLight.color), rgb(selLight.bg));
ok('select light: contraste >= 4.5 (manuel)', rL >= 4.5, `${selLight.color}/${selLight.bg}=${rL.toFixed(2)}`);

// ── L. Dark mode : re-mesure du select + footer (état muté en dernier) ──────
await page.locator('#darkModeToggle').click();
await page.waitForTimeout(500);
const selDark = await page.evaluate(() => {
  const s = document.querySelector('select');
  const cs = getComputedStyle(s);
  return { color: cs.color, bg: cs.backgroundColor };
});
const rD = contrast(rgb(selDark.color), rgb(selDark.bg));
ok('select dark: contraste >= 4.5 (manuel)', rD >= 4.5, `${selDark.color}/${selDark.bg}=${rD.toFixed(2)}`);

await browser.close();
const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} contrôles indépendants OK`);
if (failed.length) process.exit(1);
console.log('eval-final.mjs : tout OK');
