#!/usr/bin/env node
/**
 * validateurs.mjs — suite de contre-exemples pour valider les ASSERTIONS
 * d'accessibilité (pas le produit — les tests eux-mêmes).
 *
 * Chaque cas compare une assertion FAIBLE (celle que la revue V2 a prouvée
 * permissive) à l'assertion DURCIE prescrite par SKILL.md règles 13-17,
 * implémentée dans assertions.mjs (module partagé réutilisable).
 * Pour chaque mutant, on attend : faible = passe à tort, durcie = échoue.
 * Pour chaque témoin correct : la durcie passe (pas de faux négatif).
 *
 * Usage : node tests-validateurs/validateurs.mjs
 * Prérequis : playwright installé dans le projet (npm i -D playwright).
 * Exit : 0 si chaque assertion durcie détecte son mutant et passe le témoin.
 */
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { accName, accNameMatches, isTrulyVisible, effectObserved } from './assertions.mjs';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const HTML = `<!doctype html><html><body>
  <ul><li id="item1" class="item unread">Item non lu</li></ul>
  <button id="btn" aria-labelledby="no-such-label-id">OK</button>
  <span id="lbl-rich"><img src="x" alt="OK"></span>
  <input id="field" />
  <div id="app"><main id="main-content"><p>Contenu réel</p></main></div>
  <select id="filter"><option value="">—</option><option value="a">A</option></select>
  <ul id="results"><li class="res">alpha</li><li class="res">beta</li></ul>
  <div id="error-page" hidden><p>Erreur : route introuvable</p></div>
</body></html>`;

// Mutants activés via evaluate (le "produit défectueux")
const MUTANTS = {
  clean: async () => {},
  // Étiquetage sous-chaîne : l'élément est "unread", une assertion 'read' faible passe
  state_unread: async () => {},
  // Nom accessible vide : aria-labelledby pointe vers un id inexistant
  empty_accname: async () => {},
  // Leurre : un AUTRE bouton porte le nom attendu — un test à l'échelle page passe
  decoy_button: async (p) => p.evaluate(() => {
    document.body.insertAdjacentHTML('beforeend', '<button id="decoy">OK</button>');
  }),
  // labelledby riche : la cible existe mais n'apporte AUCUN contenu accessible
  // (img sans alt, pas de texte) — la présence de l'attribut ne suffit pas
  labelledby_empty_target: async (p) => p.$eval('#btn', (e) => {
    const s = document.createElement('span');
    s.id = 'lbl-empty';
    s.innerHTML = '<img src="x">';
    document.body.appendChild(s);
    e.setAttribute('aria-labelledby', 'lbl-empty');
  }),
  // Contenu masqué : l'app entière est cachée mais le viewport a une taille
  hidden_app: async (p) => p.evaluate(() => { document.getElementById('app').style.display = 'none'; }),
  // Piège isVisible : opacity:0 reste "visible" pour Playwright
  opacity_app: async (p) => p.evaluate(() => { document.getElementById('app').style.opacity = '0'; }),
  // Élément requis absent : le filtre n'est pas dans le DOM
  missing_filter: async (p) => p.evaluate(() => { document.getElementById('filter').remove(); }),
  // Action sans effet métier : le select accepte l'option mais ne filtre rien
  filter_no_effect: async () => {},
  // Page d'erreur servie à la place de la page métier
  error_template: async (p) => p.evaluate(() => {
    document.getElementById('main-content').remove();
    document.getElementById('error-page').hidden = false;
  }),
};

const filterControlFix = (p) => p.$eval('#filter', (e) => {
  e.addEventListener('change', () => {
    const v = e.value;
    document.querySelectorAll('#results .res').forEach((li) => {
      li.style.display = li.textContent.startsWith(v) ? '' : 'none';
    });
  });
});

// Assertions FAIBLES (anti-patrons prouvés par la revue) vs DURCIES
const CHECKS = [
  {
    name: 'etat-read-vs-unread',
    mutant: 'state_unread',
    // Témoin = item réellement lu ; mutant = item "unread" (la sous-chaîne 'read' y figure)
    controlFix: async (p) => p.$eval('#item1', e => e.classList.replace('unread', 'read')),
    weak: async (p) => (await p.$eval('#item1', e => e.className)).includes('read'),
    hard: async (p) => await p.$eval('#item1', e => e.classList.contains('read')),
  },
  {
    name: 'nom-accessible-vide',
    mutant: 'empty_accname',
    // Témoin = bouton dont le nom accessible est réellement "OK" (texte du bouton)
    controlFix: async (p) => p.$eval('#btn', e => e.removeAttribute('aria-labelledby')),
    weak: async (p) => (await p.$eval('#btn', e => e.getAttribute('aria-labelledby'))) !== null,
    hard: async (p) => accNameMatches(p.locator('#btn'), 'OK'),
  },
  {
    name: 'leurre-meme-nom',
    mutant: 'decoy_button',
    // Le nom "OK" existe ailleurs dans la page : un test non scopé ne peut pas
    // attribuer le nom au bon élément.
    controlFix: async (p) => p.$eval('#btn', e => e.removeAttribute('aria-labelledby')),
    weak: async (p) => (await p.getByRole('button', { name: 'OK', exact: true }).count()) >= 1,
    hard: async (p) => accNameMatches(p.locator('#btn'), 'OK'),
  },
  {
    name: 'labelledby-cible-vide',
    mutant: 'labelledby_empty_target',
    // Témoin = labelledby riche : la cible contient un img alt="OK" — le nom
    // calculé est correct et la cible apporte du contenu accessible.
    controlFix: async (p) => p.$eval('#btn', e => e.setAttribute('aria-labelledby', 'lbl-rich')),
    weak: async (p) => {
      const ref = await p.$eval('#btn', e => e.getAttribute('aria-labelledby'));
      return ref !== null && await p.evaluate((id) => document.getElementById(id) !== null, ref);
    },
    hard: async (p) => accNameMatches(p.locator('#btn'), 'OK'),
  },
  {
    name: 'app-masquee-zoom',
    mutant: 'hidden_app',
    weak: async (p) => (await p.evaluate(() => document.documentElement.clientWidth)) > 0,
    hard: async (p) => isTrulyVisible(p.locator('#main-content')),
  },
  {
    name: 'app-opacity-0',
    mutant: 'opacity_app',
    // isVisible() ignore opacity — l'assertion faible "visible" passe à tort.
    weak: async (p) => p.locator('#main-content').isVisible(),
    hard: async (p) => isTrulyVisible(p.locator('#main-content')),
  },
  {
    name: 'element-requis-absent',
    mutant: 'missing_filter',
    // Témoin = select fonctionnel avec effet mesurable sur #results.
    controlFix: filterControlFix,
    weak: async (p) => {
      try { await p.selectOption('#filter', 'a'); return true; }
      catch { return true; } // catch muet — la faille
    },
    hard: async (p) => effectObserved(p,
      (pg) => pg.selectOption('#filter', 'a'),
      async (pg) => {
        if (!await pg.$eval('#filter', e => e.value === 'a')) return false;
        // Effet métier : un conteneur #results déclarant data-filter doit
        // refléter la valeur ; sinon la liste visible doit avoir changé.
        const df = await pg.evaluate(() =>
          document.getElementById('results')?.getAttribute('data-filter'));
        if (df !== null && df !== undefined) return df === 'a';
        return await pg.$$eval('#results .res',
          els => els.filter(e => e.offsetParent !== null).length === 1);
      }),
  },
  {
    name: 'filtre-sans-effet-metier',
    mutant: 'filter_no_effect',
    // Témoin = le select filtre réellement la liste (handler attaché).
    controlFix: filterControlFix,
    weak: async (p) => {
      await p.selectOption('#filter', 'a');
      return await p.$eval('#filter', e => e.value === 'a'); // l'action a réussi, l'effet non vérifié
    },
    hard: async (p) => effectObserved(p,
      (pg) => pg.selectOption('#filter', 'a'),
      (pg) => pg.$$eval('#results .res',
        els => els.filter(e => e.offsetParent !== null).length === 1)),
  },
  {
    name: 'page-erreur-vs-metier',
    mutant: 'error_template',
    weak: async (p) => (await p.evaluate(() => document.title !== null)),
    // Présence du nœud ≠ écran métier visible : main caché (hidden/opacity)
    // = FAIL, même si le conteneur d'erreur reste dissimulé.
    hard: async (p) => await p.locator('#main-content').count() === 1
      && await isTrulyVisible(p.locator('#main-content'))
      && await p.locator('#error-page').isHidden(),
  },
];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(1500);
  let detected = 0, total = 0, falseNeg = 0;
  for (const c of CHECKS) {
    // Témoin correct : les deux assertions doivent passer
    await page.setContent(HTML);
    if (c.controlFix) await c.controlFix(page);
    const weakOk = await c.weak(page).catch(() => false);
    const hardOk = await c.hard(page).catch(() => false);
    console.log(`[témoin] ${c.name}: weak=${weakOk} hard=${hardOk}`);
    if (!hardOk) { falseNeg++; console.log(`  FAUX NÉGATIF : l'assertion durcie rate le cas correct`); }
    // Mutant : l'assertion durcie doit échouer (détecter le défaut)
    await page.setContent(HTML);
    await MUTANTS[c.mutant](page);
    const weakMut = await c.weak(page).catch(() => 'err');
    const hardMut = await c.hard(page).catch(() => false);
    total++;
    const caught = hardMut === false;
    if (caught) detected++;
    console.log(`[mutant] ${c.name}: weak=${weakMut} hard=${hardMut} → ${caught ? 'DÉTECTÉ' : 'MANQUÉ'}`);
  }
  await browser.close();
  console.log(`\n${detected}/${total} mutants détectés par les assertions durcies, ${falseNeg} faux négatifs`);
  process.exit(detected === total && falseNeg === 0 ? 0 : 1);
}
main().catch(e => { console.error(e); process.exit(2); });
