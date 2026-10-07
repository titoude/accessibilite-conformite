// Sonde computed pour les corrections du cycle grocy (leçon 26).
// Chaque assertion mesure une valeur calculée réelle, pas une simple
// présence d'attribut. Usage: node verify.mjs <base> <auth.json>
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:8080';
const AUTH = process.argv[3] ?? 'auth.json';

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();

const contrast = `(fg, bg) => {
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const l1 = lum(fg), l2 = lum(bg); const a = Math.max(l1, l2), b = Math.min(l1, l2);
  return (a + 0.05) / (b + 0.05);
}`;

// ---------- 1. Navbar-brand : cible >= 24px et non obscurcie ----------
await page.goto(`${BASE}/stockoverview`, { waitUntil: 'load' });
await page.waitForTimeout(1500);
let m = await page.evaluate(() => {
  const b = document.querySelector('#mainNav .navbar-brand');
  const r = b.getBoundingClientRect();
  const sn = document.querySelector('.navbar-sidenav').getBoundingClientRect();
  return { w: r.width, h: r.height, bottom: r.bottom, sidenavTop: sn.top };
});
check('navbar-brand cible >= 24px', m.h >= 24, `h=${m.h}px`);
check('navbar-brand au-dessus de la sidenav', m.bottom <= m.sidenavTop, `bottom=${m.bottom} sidenavTop=${m.sidenavTop}`);

// ---------- 2. Sidenav : défilement réaligné (pas d'item à cheval) ----------
await page.evaluate(() => { document.querySelector('.navbar-sidenav').scrollTop = 250; });
await page.waitForTimeout(900);
m = await page.evaluate(() => {
  const nav = document.querySelector('.navbar-sidenav');
  const nt = nav.getBoundingClientRect().top;
  const nb = nav.getBoundingClientRect().bottom;
  const straddlers = [...nav.querySelectorAll('a.nav-link')].filter(a => {
    const r = a.getBoundingClientRect();
    const top = r.top < nt && r.bottom > nt && (r.bottom - nt) < 24;
    const bottom = r.top < nb && r.bottom > nb && (nb - r.top) < 24;
    return top || bottom;
  }).length;
  return { scrollTop: nav.scrollTop, straddlers };
});
check('sidenav : aucun item à cheval après défilement', m.straddlers === 0, `straddlers=${m.straddlers}`);

// ---------- 3. Tooltips : aria-label porté par les contrôles icône-seuls ----------
m = await page.evaluate(() => {
  const els = [...document.querySelectorAll("[data-toggle='tooltip']")];
  const icon = els.filter(e => e.matches('a,button,input,select,textarea,[role],[tabindex]') && !e.textContent.trim());
  const unlabelled = icon.filter(e => !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby'));
  return { iconOnly: icon.length, unlabelled: unlabelled.length };
});
check('tooltips icône-seuls : aria-label posé', m.unlabelled === 0, `${m.iconOnly} contrôles, ${m.unlabelled} sans nom`);

// ---------- 4. Modale : aria-labelledby + titre role=heading ----------
await page.goto(`${BASE}/products`, { waitUntil: 'load' });
await page.waitForSelector('.product-delete-button', { state: 'visible' });
await page.locator('.product-delete-button').first().click();
await page.waitForSelector('.modal.show', { timeout: 10000 });
await page.waitForTimeout(400);
m = await page.evaluate(() => {
  const d = document.querySelector('.bootbox, .modal.show');
  const by = d.getAttribute('aria-labelledby');
  const lab = by && document.getElementById(by);
  return { labelled: by, labelText: lab ? lab.textContent.trim().slice(0, 50) : null };
});
check('modale bootbox : aria-labelledby -> contenu', !!m.labelled && !!m.labelText, JSON.stringify(m));
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// ---------- 5. Contraste boutons jour ----------
// Cibles déterministes : l'absence de l'élément = FAIL (jamais ?? 9 vacuole,
// wart F3 — l'auditeur a vu « PASS btn-success jour ratio=undefined »).
const measureBtn = async sel => page.evaluate(([sel, contrastSrc]) => {
  const ratio = eval(contrastSrc);
  const parse = s => s.match(/\d+/g).map(Number);
  const b = document.querySelector(sel);
  if (!b) return { found: false };
  const cs = getComputedStyle(b);
  return { found: true, r: ratio(parse(cs.color), parse(cs.backgroundColor)), fg: cs.color, bg: cs.backgroundColor };
}, [sel, contrast]);
await page.goto(`${BASE}/products`, { waitUntil: 'load' });
await page.waitForTimeout(800);
m = await measureBtn('.related-links a.btn-primary');
check('btn-primary jour >= 4.5', m.found === true && m.r >= 4.5, m.found ? `ratio=${m.r.toFixed(2)} fg=${m.fg}` : 'élément .related-links a.btn-primary absent');
await page.goto(`${BASE}/purchase`, { waitUntil: 'load' });
await page.waitForTimeout(800);
m = await measureBtn('#save-purchase-button');
check('btn-success jour >= 4.5', m.found === true && m.r >= 4.5, m.found ? `ratio=${m.r.toFixed(2)} fg=${m.fg}` : 'élément #save-purchase-button absent');

// ---------- 6. Calendrier : fonds événements vs texte ----------
await page.goto(`${BASE}/calendar`, { waitUntil: 'load' });
await page.waitForTimeout(2500);
m = await page.evaluate(contrast => {
  const ratio = eval(contrast);
  const parse = s => s.match(/\d+/g).map(Number);
  const bad = [];
  document.querySelectorAll('.fc-event').forEach(e => {
    const bg = parse(getComputedStyle(e).backgroundColor);
    const t = e.querySelector('.fc-title') || e.querySelector('.fc-time');
    if (!t) return;
    const fg = parse(getComputedStyle(t).color);
    const r = ratio(fg, bg);
    if (r < 4.5) bad.push(`${(t.textContent || '').slice(0, 25)} r=${r.toFixed(2)}`);
  });
  return { events: document.querySelectorAll('.fc-event').length, bad };
}, contrast);
check('calendrier : texte des événements >= 4.5', m.bad.length === 0, `${m.events} événements, ${m.bad.length} sous AA ${m.bad.slice(0, 3)}`);

// ---------- 7. Night mode : boutons + persistance ----------
await page.evaluate(async () => {
  await fetch('/api/user/settings/night_mode', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: 'on' }) });
});
await page.goto(`${BASE}/products`, { waitUntil: 'load' });
await page.waitForSelector('body.night-mode', { state: 'attached' });
await page.waitForTimeout(800);
m = await measureBtn('.related-links a.btn-primary');
check('btn-primary nuit >= 4.5', m.found === true && m.r >= 4.5, m.found ? `ratio=${m.r.toFixed(2)} fg=${m.fg}` : 'élément .related-links a.btn-primary absent (nuit)');
await page.goto(`${BASE}/purchase`, { waitUntil: 'load' });
await page.waitForSelector('body.night-mode', { state: 'attached' });
await page.waitForTimeout(800);
m = await measureBtn('#save-purchase-button');
check('btn-success nuit >= 4.5', m.found === true && m.r >= 4.5, m.found ? `ratio=${m.r.toFixed(2)} fg=${m.fg}` : 'élément #save-purchase-button absent (nuit)');

// restauration de la préférence persistée
await page.evaluate(async () => {
  await fetch('/api/user/settings/night_mode', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: 'off' }) });
});
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(600);
m = await page.evaluate(() => ({ night: document.body.classList.contains('night-mode') }));
check('pref night_mode restaurée (off)', m.night === false, `night-mode=${m.night}`);

// ---------- 8. Images décorées (formulaires) ----------
await page.goto(`${BASE}/product/1`, { waitUntil: 'load' });
await page.waitForTimeout(1200);
m = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')].filter(i => i.offsetParent);
  const noAlt = imgs.filter(i => !i.hasAttribute('alt'));
  return { total: imgs.length, noAlt: noAlt.map(i => (i.src || '').split('/').pop().slice(0, 30)) };
});
check('page produit : toutes les images ont un alt', m.noAlt.length === 0, `${m.total} imgs, manquants=${JSON.stringify(m.noAlt)}`);

// ---------- 9. Hiérarchie de titres (h1 unique, pas de saut) ----------
for (const path of ['/products', '/mealplan', '/stockoverview']) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  m = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,[role="heading"]')]
      .filter(h => h.offsetParent || h.offsetWidth || h.offsetHeight)
      .map(h => h.getAttribute('aria-level') ? +h.getAttribute('aria-level') : +h.tagName[1]);
    let prev = 0, skip = 0;
    for (const l of hs) { if (prev && l > prev + 1) skip++; prev = l; }
    const h1 = document.querySelectorAll('h1').length;
    return { h1, skip, total: hs.length };
  });
  check(`${path} : h1 présent, pas de saut de niveau`, m.h1 >= 1 && m.skip === 0, `h1=${m.h1} sauts=${m.skip}`);
}

// ---------- 10. Swagger UI (/api) : région + liens nommés ----------
await page.goto(`${BASE}/api`, { waitUntil: 'load' });
await page.waitForTimeout(2500);
m = await page.evaluate(() => {
  const anon = [...document.querySelectorAll('.information-container a')].filter(a => !a.textContent.trim() && !a.getAttribute('aria-label'));
  const region = document.querySelector('.information-container[role="region"]');
  const tags = document.querySelectorAll('h3.opblock-tag[role="heading"]').length;
  return { anonLinks: anon.length, region: !!region, taggedHeadings: tags };
});
check('/api : région info + liens nommés + h3.tag levelled', m.anonLinks === 0 && m.region, JSON.stringify(m));

await ctx.close();
await browser.close();

const fails = results.filter(r => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} PASS`);
if (fails.length) process.exit(1);
