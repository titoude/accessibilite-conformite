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
await secondHead.click();
await page.waitForTimeout(400);

// liens Help adjacents aux labels : soulignés (1.4.1 — pas couleur seule)
const helpUnderlined = await page.evaluate(() => {
  const links = [...document.querySelectorAll('#advanced a[target="_blank"], .modal.in a[href*="syncthing.net"], .modal.in a[target="_blank"]')]
    .filter(a => a.textContent.trim().length > 0);
  if (!links.length) return -1;
  return links.filter(a => getComputedStyle(a).textDecorationLine.includes('underline')).length;
});
ok('liens d aide des modales soulignés', helpUnderlined > 0, `${helpUnderlined} souligné(s)`);
await closeModal(page, '#advanced');

// ids dupliqués share-template (finding auditeur : 3× input#sharedwith- quand
// folder.id vide — rendu paresseux, mesuré dans #editDevice ouvert, onglet Sharing)
await page.locator('button.panel-heading[data-target^="#device-"]').first().click();
await page.locator('button[ng-click*="editDeviceExisting"]').first().click();
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

// login page : titre présent
const page2 = await (await browser.newContext()).newPage();
await page2.goto(`${BASE}/`, { waitUntil: 'load' });
ok('login : formulaire #user présent', await page2.locator('.center-block #user').count() === 1);
ok('login : un heading visible', await page2.locator('.center-block h2, .center-block h3, .center-block h1').count() >= 1);

await browser.close();
console.log(`\nverify: ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
