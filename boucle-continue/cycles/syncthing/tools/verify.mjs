#!/usr/bin/env node
// verify.mjs — assertions DURES sur le résultat final du cycle syncthing.
// Usage : node verify.mjs <baseUrl> --auth-file tools/auth.json --cycle-dir ..
// Sortie : PASS/FAIL par assertion ; exit 1 si au moins un FAIL.
// Une assertion "non applicable" doit être explicite (N-A avec raison) —
// jamais de PASS à vide : un élément requis absent = FAIL.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const BASE = (args[0] || 'http://127.0.0.1:8384').replace(/\/+$/, '');
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const DIR = dirname(fileURLToPath(import.meta.url));
const CYCLE = opt('--cycle-dir') || join(DIR, '..');
const AUTH = opt('--auth-file') || join(DIR, 'auth.json');
const FINAL_AUTH = join(CYCLE, 'reports/final-auth/report.json');
const FINAL_PUBLIC = join(CYCLE, 'reports/final-public/report.json');
const EXPECTED_STATES = JSON.parse(readFileSync(new URL('../states.json', import.meta.url), 'utf8')).auth.states.length;

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`PASS  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${detail ? ' — ' + detail : ''}`); }
};
const loadReport = p => {
  if (!existsSync(p)) return null;
  const d = JSON.parse(readFileSync(p, 'utf8'));
  return Array.isArray(d.pages) ? d : null;
};

const closeModal = async (page, sel) => {
  for (let i = 0; i < 3 && await page.locator(sel + '.in').count(); i++) {
    await page.keyboard.press('Escape');
    await page.waitForSelector(sel + '.in', { state: 'hidden', timeout: 3000 }).catch(() => {});
    if (await page.locator(sel + '.in').count())
      await page.locator(sel + ' .close, ' + sel + ' [data-dismiss="modal"]').first().click().catch(() => {});
  }
};

// ---------- 1. artefacts ----------
const pub = loadReport(FINAL_PUBLIC);
const auth = loadReport(FINAL_AUTH);
ok('final-public report.json présent', !!pub);
ok('final-auth report.json présent', !!auth);

if (pub) {
  ok('public : 0 violation', pub.pages.every(p => (p.violations || []).length === 0),
    pub.pages.filter(p => (p.violations || []).length).map(p => `${p.url}(${p.violations.map(v => v.id)})`).join('; '));
  ok('public : 0 erreur de scan', pub.pages.every(p => !p.error));
}
if (auth) {
  const statePages = auth.pages.filter(p => /state:/.test(p.url));
  ok(`auth : ${EXPECTED_STATES} états scannés`, statePages.length === EXPECTED_STATES,
    `trouvé ${statePages.length}`);
  const errPages = auth.pages.filter(p => p.error);
  ok('auth : 0 état en erreur (élément requis absent = FAIL)', errPages.length === 0,
    errPages.map(p => `${p.url} → ${p.error}`).join('; '));
  const violating = auth.pages.filter(p => (p.violations || []).length > 0);
  ok('auth : 0 violation sur toutes les pages/états', violating.length === 0,
    violating.flatMap(p => p.violations.map(v => `${p.url.split('state:')[1] || 'page'}:${v.id}(${v.nodes.length})`)).join('; '));
}

// ---------- 2. DOM live du produit patché ----------
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();
await page.goto(`${BASE}/`, { waitUntil: 'load' });
await page.waitForSelector('button.panel-heading[data-target^="#folder-"]', { timeout: 20000 });

// La modale de rapport d'usage (#ur : backdrop statique, clavier off) se montre
// quelques secondes après le chargement tant que urAccepted = 0 (poll système)
// et intercepte tous les clics. L'attendre puis la décliner — sur une instance
// déjà auditée (urAccepted=-1 persisté) elle n'arrive jamais.
await page.waitForSelector('#ur.in', { timeout: 15000 }).catch(() => {});
if (await page.locator('#ur.in').count()) {
  await page.locator('#ur button[ng-click="declineUR()"]').click();
  await page.waitForSelector('#ur.in', { state: 'hidden', timeout: 8000 });
  await page.waitForTimeout(300);
}

// landmarks / titres
ok('<main> landmark présent', await page.locator('main.container.content, main').count() >= 1);
ok('exactement 1 <h1> hors modales', await page.evaluate(() =>
  [...document.querySelectorAll('h1')].filter(h => !h.closest('.modal')).length) === 1,
  'le h1 du haut de page ; les h1 des gabarits de modales (About) sont exclus');
ok('nav landmark (role=navigation)', await page.locator('nav[role="navigation"], nav.navbar').count() >= 1);

// modale générique → role=dialog + nommage (Settings : ouverture déterministe)
await page.locator('li.action-menu:has(.fa-cog) > a.dropdown-toggle').click();
await page.locator('li.action-menu:has(.fa-cog) ul.dropdown-menu a', { hasText: 'Settings' }).first().click();
await page.waitForSelector('#settings.in', { timeout: 10000 });
ok('modale #settings role="dialog"', (await page.locator('#settings').getAttribute('role')) === 'dialog');
ok('modale #settings aria-modal="true"', (await page.locator('#settings').getAttribute('aria-modal')) === 'true');
const stLb = await page.locator('#settings').getAttribute('aria-labelledby');
ok('modale #settings aria-labelledby → élément existant', !!stLb && await page.locator(`#${stLb}`).count() === 1, `aria-labelledby=${stLb}`);
ok('titre modale #settings non vide', (await page.locator('#settings .modal-title').innerText()).trim().length > 0);
await closeModal(page, '#settings');

// la fonction localChangedHeading doit exister (le bug upstream la rendait
// undefined → titre de modale vide). Assertion directe sur le scope Angular.
const lch = await page.evaluate(() => {
  const sc = angular.element(document.body).scope();
  return typeof sc.localChangedHeading === 'function' ? sc.localChangedHeading('sendreceive') : null;
});
ok('localChangedHeading existe et rend un titre', typeof lch === 'string' && lch.length > 0, `retour=${lch}`);

// N-A conditionnelle : si le dossier a des « local additions » réelles, la
// modale #localChanged doit porter les mêmes attributs dialog.
const hasLocalAdditions = await page.locator('a[ng-click*="showLocalChanged"]').count();
if (hasLocalAdditions > 0) {
  await page.locator('button.panel-heading:has-text("Archives")').first().click();
  await page.waitForSelector('.panel-collapse.in', { timeout: 10000 });
  await page.locator('a[ng-click*="showLocalChanged"]').first().click();
  ok('modale #localChanged ouverte', await page.locator('#localChanged.in').count() === 1);
  const title = await page.locator('#localChanged .modal-title').innerText().catch(() => '');
  ok('titre modale #localChanged non vide', title.trim().length > 0, `title="${title}"`);
  await closeModal(page, '#localChanged');
} else {
  console.log('N-A  modale #localChanged : aucune local addition disponible dans la seed courante');
}

// aria-expanded ne doit JAMAIS figurer sur un élément repliable (contrôle oui, cible non)
await page.waitForTimeout(500); // laisser finir les transitions collapse
const badExpanded = await page.locator('.panel-collapse[aria-expanded]').count();
ok('aucun .panel-collapse n porte aria-expanded', badExpanded === 0, `${badExpanded} trouvé(s)`);

// nom de groupe d'appareils : pas de h4 vide
const emptyH4 = await page.evaluate(() => [...document.querySelectorAll('h4')].filter(h => !h.textContent.trim()).length);
ok('aucun <h4> vide', emptyH4 === 0, `${emptyH4} h4 vide(s)`);

// advanced settings : pas de tablist/tab usurpé, liens doc nommés
await page.locator('li.action-menu:has(.fa-cog) > a.dropdown-toggle').click();
await page.locator('li.action-menu:has(.fa-cog) ul.dropdown-menu a', { hasText: 'Advanced' }).first().click();
await page.waitForSelector('#advanced.in', { timeout: 10000 });
ok('#advancedAccordion sans role="tablist"', await page.locator('#advancedAccordion[role="tablist"]').count() === 0);
ok('aucun role="tab" orphelin dans #advanced', await page.locator('#advanced [role="tab"]').count() === 0);
const unnamedLinks = await page.locator('#advanced a[target="_blank"]:not([aria-label]):has(> span.fas:only-child, > span.fas)').evaluateAll(
  els => els.filter(a => !a.textContent.trim()).length);
ok('liens documentation advanced nommés (aria-label)', unnamedLinks === 0, `${unnamedLinks} sans nom`);

// accordéon #advanced : role=button doit être focusable ET opérable au clavier
// (finding auditeur : tabindex sur h4 sans handler — Enter/Espace n'ouvrait rien)
const accordionHeads = await page.locator('#advancedAccordion .panel-heading[role="button"][data-toggle="collapse"]').count();
ok('en-têtes accordéon présents', accordionHeads > 0, `${accordionHeads} en-têtes`);
const focusableHeads = await page.locator('#advancedAccordion .panel-heading[role="button"][tabindex="0"]').count();
ok('en-têtes accordéon focusables (tabindex=0 sur le role=button)', focusableHeads === accordionHeads, `${focusableHeads}/${accordionHeads}`);
const firstHead = page.locator('#advancedAccordion .panel-heading[role="button"]').first();
await firstHead.focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(600); // transition bootstrap collapse
const openedByEnter = await page.evaluate(() => {
  const h = document.querySelector('#advancedAccordion .panel-heading[role="button"]');
  const target = h && document.querySelector(h.getAttribute('href'));
  return !!(target && target.classList.contains('in'));
});
ok('Entrée ouvre le premier panneau accordéon', openedByEnter);
// refermer puis tester Espace sur le 2e en-tête
await firstHead.click();
await page.waitForTimeout(600);
const secondHead = page.locator('#advancedAccordion .panel-heading[role="button"]').nth(1);
await secondHead.focus();
await page.keyboard.press(' ');
await page.waitForTimeout(600);
const openedBySpace = await page.evaluate(() => {
  const hs = document.querySelectorAll('#advancedAccordion .panel-heading[role="button"]');
  const target = hs[1] && document.querySelector(hs[1].getAttribute('href'));
  return !!(target && target.classList.contains('in'));
});
ok('Espace ouvre le second panneau accordéon', openedBySpace);

// liens Help adjacents aux labels : soulignés (1.4.1 — pas couleur seule).
// Les liens documentation vivent dans les panneaux accordéon : en ouvrir un
// puis mesurer les liens VISIBLES de la modale — total>0 requis (jamais de
// PASS à vide).
await firstHead.click();
await page.waitForTimeout(400);
const helpCheck = await page.evaluate(() => {
  const links = [...document.querySelectorAll('.modal.in .modal-body a:not(.btn)')]
    .filter(a => a.offsetParent !== null);
  return { total: links.length,
           underlined: links.filter(a => getComputedStyle(a).textDecorationLine.includes('underline')).length };
});
ok('liens Help du panneau ouvert soulignés', helpCheck.total > 0 && helpCheck.underlined === helpCheck.total,
   `${helpCheck.underlined}/${helpCheck.total} visibles`);
await closeModal(page, '#advanced');

// ids dupliqués share-template (finding auditeur : 3× input#sharedwith- quand
// folder.id vide — rendu paresseux, mesuré dans #editDevice ouvert, onglet Sharing)
const devHead = page.locator('button.panel-heading[data-target^="#device-"]:not([data-target="#device-this"])').first();
const devTarget = await devHead.getAttribute('data-target');
await devHead.click();
await page.waitForSelector(`${devTarget}.in`, { timeout: 10000 });
await page.locator(`${devTarget} button[ng-click*="editDeviceExisting"]`).first().click();
await page.waitForSelector('#editDevice.in', { timeout: 10000 });
const sharingTab = page.locator('#editDevice a[data-toggle="tab"][href="#device-sharing"]');
if (await sharingTab.count()) { await sharingTab.click(); await page.waitForTimeout(400); }
const shareIds = await page.evaluate(() =>
  [...document.querySelectorAll('#editDevice input[id^="sharedwith-"]')].map(i => i.id));
if (shareIds.length === 0) {
  console.log('N-A  aucun input sharedwith-* rendu dans l onglet Sharing (pas de dossiers partagés)');
} else {
  const dups = shareIds.length - new Set(shareIds).size;
  ok('pas d id dupliqué sharedwith-*', dups === 0, `${shareIds.length} inputs, ${dups} doublon(s)`);
}
await closeModal(page, '#editDevice');

// settings : labels/selects
await page.locator('li.action-menu:has(.fa-cog) > a.dropdown-toggle').click();
await page.locator('li.action-menu:has(.fa-cog) ul.dropdown-menu a', { hasText: 'Settings' }).first().click();
await page.waitForSelector('#settings.in', { timeout: 10000 }).catch(async () => {
  // un menu déroulant peut pousser le contenu — recliquer si nécessaire
  await page.locator('li.action-menu:has(.fa-cog) > a.dropdown-toggle').click();
  await page.locator('li.action-menu:has(.fa-cog) ul.dropdown-menu a', { hasText: 'Settings' }).first().click();
  await page.waitForSelector('#settings.in', { timeout: 10000 });
});
ok('select unité minHomeDiskFree nommé', await page.locator('#settings select[ng-model="tmpOptions.minHomeDiskFree.unit"][aria-label]').count() === 1);
ok('select upgrades labellisé', await page.locator('#settings select[ng-model="tmpOptions.upgrades"][id]').count() === 1);
const apiLbl = await page.evaluate(() => {
  const inp = document.querySelector('#settings input#apiKey');
  return inp ? document.querySelector(`label[for="${inp.id}"]`) !== null : false;
});
ok('input API Key labellisé', apiLbl);
await closeModal(page, '#settings');

// theme.css light (URL thème-indépendante) : contraste patché côté source
const lightCss = await page.evaluate(async () => {
  const r = await fetch('theme-assets/light/assets/css/theme.css');
  return r.ok ? r.text() : '';
});
ok('light/theme.css contient les correctifs contraste', /#1d6fa5/.test(lightCss) && /#1d7a35/.test(lightCss));

// —— mesure LIVE des contrastes en thème sombre (finding v3 : les modales
// n'étaient auditées qu'en clair). Arme dark via REST + restart, ouvre
// #settings, mesure les paires réelles, restaure light.
const ratio_ = p => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; const l = c => 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); return (Math.max(l(p.fg), l(p.bg)) + 0.05) / (Math.min(l(p.fg), l(p.bg)) + 0.05); };
const putTheme = async name => page.evaluate(async n => {
  const m = document.cookie.match(/CSRF-Token-([A-Z0-9]+)=([^;]+)/);
  const h = { 'Content-Type': 'application/json' };
  if (m) h[`X-CSRF-Token-${m[1]}`] = m[2];
  const g = await (await fetch('/rest/config/gui', { headers: h })).json();
  g.theme = n;
  const w = await fetch('/rest/config/gui', { method: 'PUT', headers: h, body: JSON.stringify(g) });
  await fetch('/rest/system/restart', { method: 'POST', headers: h }).catch(() => {});
  return w.ok;
}, name);
ok('PUT theme=dark accepté', await putTheme('dark'));
for (let i = 0; i < 40; i++) {
  await page.waitForTimeout(1000);
  await page.goto(`${BASE}/`, { waitUntil: 'load' }).catch(() => {});
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor).catch(() => '');
  if (bg === 'rgb(39, 39, 39)') break;
  if (i === 39) ok('thème sombre appliqué', false, 'body jamais rgb(39,39,39)');
}
await page.waitForSelector('button.panel-heading[data-target^="#folder-"]', { timeout: 20000 });
await page.locator('li.action-menu:has(.fa-cog) > a.dropdown-toggle').click();
await page.locator('li.action-menu:has(.fa-cog) ul.dropdown-menu a', { hasText: 'Settings' }).first().click();
await page.waitForSelector('#settings.in', { timeout: 10000 });
const darkPairs = await page.evaluate(() => {
  const rgb = s => { const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/); return m ? [+m[1], +m[2], +m[3]] : null; };
  const lum = c => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const effBg = el => { // fond opaque le plus proche
    let n = el;
    while (n && n !== document.body) {
      const c = rgb(getComputedStyle(n).backgroundColor);
      if (c && getComputedStyle(n).backgroundColor !== 'rgba(0, 0, 0, 0)') return c;
      n = n.parentElement;
    }
    return rgb(getComputedStyle(document.body).backgroundColor);
  };
  const pick = sel => { const el = document.querySelector(sel); return el ? { fg: rgb(getComputedStyle(el).color), bg: effBg(el) } : null; };
  return {
    navTab: pick('#settings .nav-tabs > li.active > a'),
    btnPrimary: pick('#settings .btn-primary') || pick('.modal.in .btn-primary'),
  };
});
ok('dark : onglet actif nav-tabs ≥4.5:1', darkPairs.navTab && ratio_(darkPairs.navTab) >= 4.5,
   darkPairs.navTab ? `${ratio_(darkPairs.navTab).toFixed(2)}:1` : 'sélecteur absent');
ok('dark : .btn-primary ≥4.5:1', darkPairs.btnPrimary && ratio_(darkPairs.btnPrimary) >= 4.5,
   darkPairs.btnPrimary ? `${ratio_(darkPairs.btnPrimary).toFixed(2)}:1` : 'sélecteur absent');
await closeModal(page, '#settings');

// --- Paires qu'axe « passe » à tort : entête alert-info (#9b59b6 — axe ne
// remonte pas sa couleur de fond) + h1 small (.text-muted #777 hérité). Une
// modale status=info réelle est ouverte (Help > About) pour les mesurer en
// dark — un scan axe ici rapporterait 0 violation même si les fix étaient
// absents ; les mesures computed ne peuvent pas être trompées ainsi.
await page.locator('li.action-menu:has(.fa-question-circle) > a.dropdown-toggle').click();
await page.locator('li.action-menu:has(.fa-question-circle) ul.dropdown-menu a', { hasText: 'About' }).first().click();
await page.waitForSelector('#about.in', { timeout: 10000 });
await page.waitForTimeout(400);
const infoPairs = await page.evaluate(() => {
  const rgb = s => { const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/); return m ? [+m[1], +m[2], +m[3]] : null; };
  const effBg = el => { let n = el; while (n && n !== document.body) { const c = getComputedStyle(n).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)') return rgb(c); n = n.parentElement; } return rgb(getComputedStyle(document.body).backgroundColor); };
  const pick = sel => { const el = document.querySelector(sel); return el ? { fg: rgb(getComputedStyle(el).color), bg: effBg(el) } : null; };
  return {
    alertTitle: pick('#about .modal-header.alert-info .modal-title, #about .modal-header.alert-info, #about .modal-title'),
    aboutSmall: pick('#about h1 small'),
    textPrimary: pick('#about .text-primary') || (() => { const d = document.createElement('span'); d.className = 'text-primary'; document.querySelector('#about .modal-body').appendChild(d); const r = { fg: rgb(getComputedStyle(d).color), bg: effBg(d) }; d.remove(); return r; })(),
  };
});
ok('dark : titre modale alert-info ≥4.5:1 (axe passe ce nœud à tort)', infoPairs.alertTitle && ratio_(infoPairs.alertTitle) >= 4.5,
   infoPairs.alertTitle ? `${ratio_(infoPairs.alertTitle).toFixed(2)}:1` : 'sélecteur absent');
ok('dark : h1 small (version/codename About) ≥4.5:1', infoPairs.aboutSmall && ratio_(infoPairs.aboutSmall) >= 4.5,
   infoPairs.aboutSmall ? `${ratio_(infoPairs.aboutSmall).toFixed(2)}:1` : 'sélecteur absent');
ok('dark : .text-primary ≥4.5:1', infoPairs.textPrimary && ratio_(infoPairs.textPrimary) >= 4.5,
   infoPairs.textPrimary ? `${ratio_(infoPairs.textPrimary).toFixed(2)}:1` : 'sélecteur absent');
await closeModal(page, '#about');

ok('restauration theme=light acceptée', await putTheme('light'));
let lightBack = false;
for (let i = 0; i < 40; i++) {
  await page.waitForTimeout(1000);
  await page.goto(`${BASE}/`, { waitUntil: 'load' }).catch(() => {});
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor).catch(() => '');
  if (bg === 'rgb(255, 255, 255)') { lightBack = true; break; }
}
ok('thème clair restauré (symétrie du check dark)', lightBack);

// login page : titre présent
const page2 = await (await browser.newContext()).newPage();
await page2.goto(`${BASE}/`, { waitUntil: 'load' });
ok('login : formulaire #user présent', await page2.locator('.center-block #user').count() === 1);
ok('login : un heading visible', await page2.locator('.center-block h2, .center-block h3, .center-block h1').count() >= 1);

await browser.close();
console.log(`\nverify: ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
