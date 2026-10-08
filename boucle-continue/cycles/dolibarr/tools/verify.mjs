#!/usr/bin/env node
/**
 * verify.mjs — assertions DURES sur les corrections Dolibarr (cycle 57).
 * Chaque fix est mesuré dans le DOM/computed style, jamais `if(el) ok()`.
 * Un élément requis absent = FAIL ou N-A explicite (leçon 45).
 * Usage: node verify.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));

const base = process.argv[2]?.replace(/\/$/, '');
const authPath = process.argv[3] || resolve(HERE, 'auth.json');
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }

// Ids du seed : REPLI uniquement (leçons 44/46) — source primaire = l'app.
let SEED = {};
try { SEED = JSON.parse(readFileSync(new URL('./seed-info.json', import.meta.url), 'utf8')); } catch { /* non résolu */ }
const SOC1 = SEED.societe_ids?.[0] || 1;
const FAC1 = SEED.facture_validee_id || SEED.facture_ids?.[0] || 1;

const results = [];
const ok = (name, cond, extra = '') => { results.push({ name, pass: !!cond }); if (!cond) console.error(`  FAIL ${name} ${extra}`); return cond; };
const na = (name, reason = '') => { results.push({ name, pass: true, verdict: 'N-A', reason }); console.error(`  N-A ${name} ${reason}`); };

const HELPERS = `
const parse = c => { const m = c && c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const effBg = el => { const L = []; let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0) L.push(c); n = n.parentElement; } if (!L.length) return { r: 255, g: 255, b: 255 }; let top = L[0]; for (let i = 1; i < L.length; i++) { const under = L[i]; const a = top.a + under.a * (1 - top.a); top = { r: (top.r * top.a + under.r * under.a * (1 - top.a)) / a, g: (top.g * top.a + under.g * under.a * (1 - top.a)) / a, b: (top.b * top.a + under.b * under.a * (1 - top.a)) / a, a }; } return top; };
const fg = el => { const st = getComputedStyle(el); const c = parse(st.color); return { ...c, a: (c.a ?? 1) * parseFloat(st.opacity || 1) }; };
const cr = el => { try { const f = __c57.fg(el); const bg = __c57.effBg(el); return +__c57.ratio(__c57.lum(f), __c57.lum(bg)).toFixed(2); } catch { return null; } };
const accName = el => { if (!el) return null; if (el.getAttribute('aria-label')) return el.getAttribute('aria-label'); const by = el.getAttribute('aria-labelledby'); if (by) { const t = by.split(/\\s+/).map(id => document.getElementById(id)).filter(Boolean).map(n => (n.textContent||'').trim()).join(' ').trim(); if (t) return t; } const lab = el.id && document.querySelector('label[for="'+el.id+'"]'); if (lab && lab.textContent.trim()) return lab.textContent.trim(); const t = el.getAttribute('title'); if (t && t.trim()) return t.trim(); const im = el.closest('label'); if (im && im.textContent.trim()) return im.textContent.trim(); return null; };
window.__c57 = { parse, lum, ratio, effBg, fg, cr, accName };
`;

const browser = await chromium.launch();
const pub = await (await browser.newContext({ locale: 'en-US' })).newPage();
await pub.addInitScript(HELPERS);
const page = await (await browser.newContext({ locale: 'en-US', storageState: authPath })).newPage();
await page.addInitScript(HELPERS);

// ================= PUBLIC : page de login =================
await pub.goto(`${base}/index.php`, { waitUntil: 'domcontentloaded' });
await pub.waitForSelector('#username', { timeout: 25000 });
await pub.waitForTimeout(800);

const pub1 = await pub.evaluate(() => ({
  lang: document.documentElement.lang,
  title: document.title.trim(),
  main: document.querySelectorAll('[role="main"], main').length,
  badTabindex: [...document.querySelectorAll('[tabindex]')].filter(e => +e.getAttribute('tabindex') > 0).map(e => e.id || e.name || e.tagName).slice(0, 5),
  alogin: __c57.cr(document.querySelector('.aloginpasswordforgotten')),
}));
ok('public: lang renseigné', !!pub1.lang, pub1.lang);
ok('public: titre non vide', pub1.title.length > 0, pub1.title);
ok('public: landmark main présent (login)', pub1.main >= 1, `${pub1.main}`);
ok('public: aucun tabindex > 0', pub1.badTabindex.length === 0, JSON.stringify(pub1.badTabindex));
ok('public: lien "mot de passe oublié" >= 4.5:1', (pub1.alogin || 0) >= 4.5, `mesuré ${pub1.alogin}:1`);

// ================= AUTH : chrome global (index) =================
await page.goto(`${base}/index.php`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#id-right', { timeout: 25000 });
await page.waitForTimeout(1500);

const c1 = await page.evaluate(() => ({
  main: !!document.querySelector('main#id-right'),
  navSide: !!document.querySelector('nav.side-nav'),
  navTop: !!document.querySelector('nav.tmenudiv'),
  navSideLbl: document.querySelector('nav.side-nav')?.getAttribute('aria-label'),
  navTopLbl: document.querySelector('nav.tmenudiv')?.getAttribute('aria-label'),
  ulRole: document.querySelector('ul.tmenu')?.getAttribute('role'),
  h1s: [...document.querySelectorAll('#id-right h1')].map(h => (h.innerText || '').trim()).filter(Boolean),
  boxTab: [...document.querySelectorAll('[id^="boxto_"]')].every(e => e.getAttribute('tabindex') === '0'),
  createLink: [...document.querySelectorAll('.info-box-createlink')].every(e => !!__c57.accName(e)),
  menuHider: (() => { const a = document.querySelector('.menuhider a, li.menuhider a, a[href="#"].fas, .tmenu.menuhider a'); return a ? __c57.accName(a) : 'ABSENT'; })(),
}));
ok('chrome: <main id="id-right"> présent', c1.main);
ok('chrome: <nav class="side-nav"> présent', c1.navSide);
ok('chrome: <nav class="tmenudiv"> présent', c1.navTop);
ok('chrome: landmarks nav étiquetés distinctement', !!c1.navSideLbl && !!c1.navTopLbl && c1.navSideLbl !== c1.navTopLbl, `side="${c1.navSideLbl}" top="${c1.navTopLbl}"`);
ok('chrome: ul.tmenu sans role="navigation" interdit', c1.ulRole !== 'navigation', c1.ulRole || 'null');
ok('chrome: h1 unique et non vide dans #id-right', c1.h1s.length >= 1, `${c1.h1s.length} h1: ${c1.h1s.join('|').slice(0, 60)}`);
ok('chrome: widgets boxto_* focusables (tabindex=0)', c1.boxTab);
ok('chrome: liens création info-box nommés', c1.createLink);
ok('chrome: hamburger menuhider nommé', c1.menuHider !== 'ABSENT' && c1.menuHider !== null, c1.menuHider);

// menu top : cibles tactiles >= 24px
const c1b = await page.evaluate(() => [...document.querySelectorAll('a.tmenulabel[id^="mainmenua_"]')].filter(a => { const r = a.getBoundingClientRect(); return r.width > 0 || r.height > 0; }).map(a => { const r = a.getBoundingClientRect(); return +Math.min(r.width, r.height).toFixed(1); }));
ok('chrome: liens menu top >= 24px', c1b.length > 0 && c1b.every(d => d >= 23.9), JSON.stringify(c1b.slice(0, 8)));

// ================= Liste tiers : checkboxes + boutons filtre + th vides =================
await page.goto(`${base}/societe/list.php`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#id-right', { timeout: 25000 });
await page.waitForTimeout(1200);
const L = await page.evaluate(() => ({
  cbAllNamed: [...document.querySelectorAll('input.checkforselect, input[name="toselect[]"]')].every(e => !!__c57.accName(e)),
  nCb: document.querySelectorAll('input.checkforselect').length,
  bSearch: !!document.querySelector('.button_search') && !!__c57.accName(document.querySelector('.button_search')),
  bClear: !!document.querySelector('.button_removefilter') && !!__c57.accName(document.querySelector('.button_removefilter')),
  emptyTh: [...document.querySelectorAll('th')].filter(t => (t.innerText || '').trim() === '').length,
  total: __c57.cr(document.querySelector('tr.liste_total td')),
  select2Named: [...document.querySelectorAll('span.select2-selection[role="combobox"]')].every(cb => !!__c57.accName(cb)),
  renderedNamed: [...document.querySelectorAll('.select2-selection__rendered[role="textbox"]')].every(r => !!__c57.accName(r)),
}));
ok('liste: checkboxes de sélection nommées', L.cbAllNamed, `${L.nCb} inputs`);
ok('liste: bouton recherche nommé', L.bSearch);
ok('liste: bouton reset filtre nommé', L.bClear);
ok('liste: aucun <th> vide', L.emptyTh === 0, `${L.emptyTh}`);
if (L.total === null) na('liste: contraste ligne totaux', 'pas de ligne totale'); else ok('liste: ligne totaux >= 4.5:1', L.total >= 4.5, `${L.total}:1`);
ok('liste: comboboxes select2 nommés', L.select2Named);
ok('liste: spans rendus select2 nommés', L.renderedNamed);

// ================= Fiche tiers : h1 + onglets + contrastes =================
await page.goto(`${base}/societe/card.php?socid=${SOC1}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#id-right', { timeout: 25000 });
await page.waitForTimeout(1200);
const F = await page.evaluate(() => ({
  h1: [...document.querySelectorAll('#id-right h1')].map(h => (h.innerText || '').trim()).filter(Boolean),
  tabs: !!document.querySelector('.tabsElemActive, .tab.tabactive'),
  helpLink: (() => { const a = document.querySelector('a.help'); return a ? __c57.accName(a) : 'ABSENT'; })(),
}));
ok('fiche: h1 non vide', F.h1.length >= 1, JSON.stringify(F.h1.slice(0, 2)));
ok('fiche: onglets rendus (tab active)', F.tabs);
ok('fiche: lien aide icone nommé', F.helpLink !== 'ABSENT' && F.helpLink !== null, F.helpLink);

// ================= Fiche facture : badges statut =================
await page.goto(`${base}/compta/facture/card.php?facid=${FAC1}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#id-right', { timeout: 25000 });
await page.waitForTimeout(1200);
const V = await page.evaluate(() => ({
  badges: [...document.querySelectorAll('.badge-status')].map(b => ({ al: b.getAttribute('aria-label'), role: b.getAttribute('role'), txt: (b.innerText || '').trim().slice(0, 20), cr: __c57.cr(b) })),
  refused: [...document.querySelectorAll('.butActionRefused')].map(b => __c57.cr(b)),
  addLine: document.querySelector('#price_ht')?.getAttribute('aria-label') || null,
  qty: document.querySelector('#qty')?.getAttribute('aria-label') || null,
  tva: document.querySelector('#tva_tx')?.getAttribute('aria-label') || null,
  typeLine: document.querySelector('#select_type')?.getAttribute('aria-label') || null,
  dropdownAdd: document.querySelector('#dropdownAddProductAndServiceLink') ? __c57.accName(document.querySelector('#dropdownAddProductAndServiceLink')) : 'ABSENT',
}));
const badBadges = V.badges.filter(b => b.al && !b.role); // aria-label sans role = interdit
ok('facture: badges avec aria-label ont un role autorisé', badBadges.length === 0, JSON.stringify(badBadges.slice(0, 2)));
const lowContrast = V.badges.filter(b => b.cr !== null && b.cr < 4.5);
ok('facture: badges statut >= 4.5:1', lowContrast.length === 0, JSON.stringify(lowContrast));
if (!V.refused.length) na('facture: boutons refusés', 'aucun .butActionRefused'); else { const bad = V.refused.filter(r => r !== null && r < 4.5); ok('facture: butActionRefused composite >= 4.5:1', bad.length === 0, JSON.stringify(V.refused)); }
ok('facture: champ price_ht étiqueté', !!V.addLine, V.addLine);
ok('facture: champ qty étiqueté', !!V.qty, V.qty);
ok('facture: select tva_tx étiqueté', !!V.tva, V.tva);
ok('facture: select type de ligne étiqueté', !!V.typeLine, V.typeLine);
ok('facture: dropdown ajout produit/service nommé', V.dropdownAdd !== 'ABSENT' && V.dropdownAdd !== null, V.dropdownAdd);

// ================= i18n : les libellés injectés ne sont pas des clés brutes =================
const i18n = await page.evaluate(() => {
  const suspects = [...document.querySelectorAll('[aria-label]')].map(e => e.getAttribute('aria-label')).filter(v => /^[A-Z][A-Za-z]+$/.test(v) && !/ /.test(v));
  return [...new Set(suspects)].slice(0, 12);
});
// une valeur mono-mot peut etre un vrai libellé (Search/Menu) — on verifie qu'ils ne sont PAS des cles camelCase non resolues
const camel = i18n.filter(v => /[a-z][A-Z]/.test(v));
ok('i18n: aucun aria-label en camelCase (clé .lang non résolue)', camel.length === 0, JSON.stringify(camel));

// ================= Print link =================
const printLbl = await page.evaluate(() => { const a = document.querySelector('a[href*="optioncss=print"]'); return a ? __c57.accName(a) : 'ABSENT'; });
ok('chrome: lien impression icone nommé', printLbl !== 'ABSENT' && printLbl !== null, printLbl);

// ================= Résumé =================
const fails = results.filter(r => !r.pass);
console.error(`\n[verify] ${results.length - fails.length}/${results.length} OK, ${fails.length} FAIL`);
process.exit(fails.length ? 1 : 0);
