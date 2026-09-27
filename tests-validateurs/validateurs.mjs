#!/usr/bin/env node
/**
 * validateurs.mjs — suite de contre-exemples pour valider les ASSERTIONS
 * d'accessibilité (pas le produit — les tests eux-mêmes).
 *
 * Chaque cas compare une assertion FAIBLE (celle que la revue V2 a prouvée
 * permissive) à l'assertion DURCIE prescrite par SKILL.md règles 13-17.
 * Pour chaque mutant, on attend : faible = passe à tort, durcie = échoue.
 * Pour chaque témoin correct : les deux passent.
 *
 * Usage : node tests-validateurs/validateurs.mjs
 * Prérequis : playwright installé dans le projet (npm i -D playwright).
 * Exit : 0 si chaque assertion durcie détecte son mutant et passe le témoin.
 */
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const HTML = `<!doctype html><html><body>
  <ul><li id="item1" class="item unread">Item non lu</li></ul>
  <button id="btn" aria-labelledby="no-such-label-id">OK</button>
  <input id="field" />
  <div id="app"><main id="main-content"><p>Contenu réel</p></main></div>
  <select id="filter"><option value="a">A</option></select>
  <div id="error-page" hidden><p>Erreur : route introuvable</p></div>
</body></html>`;

// Mutants activés via evaluate (le "produit défectueux")
const MUTANTS = {
  clean: async () => {},
  // Étiquetage sous-chaîne : l'élément est "unread", une assertion 'read' faible passe
  state_unread: async () => {},
  // Nom accessible vide : aria-labelledby pointe vers un id inexistant
  empty_accname: async () => {},
  // Contenu masqué : l'app entière est cachée mais le viewport a une taille
  hidden_app: async (p) => p.evaluate(() => { document.getElementById('app').style.display = 'none'; }),
  // Élément requis absent : le filtre n'est pas dans le DOM
  missing_filter: async (p) => p.evaluate(() => { document.getElementById('filter').remove(); }),
  // Page d'erreur servie à la place de la page métier
  error_template: async (p) => p.evaluate(() => {
    document.getElementById('main-content').remove();
    document.getElementById('error-page').hidden = false;
  }),
};

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
    hard: async (p) => {
      // Nom calculé == attendu ET, si labelledby est présent, sa cible existe et contient le nom
      const okName = await p.getByRole('button', { name: 'OK', exact: true }).count() === 1;
      if (!okName) return false;
      return await p.$eval('#btn', (e) => {
        const ref = e.getAttribute('aria-labelledby');
        if (!ref) return true;
        return ref.trim().split(/\s+/).every(id => {
          const t = document.getElementById(id);
          return t !== null && (t.textContent || '').trim() === 'OK';
        });
      });
    },
  },
  {
    name: 'app-masquee-zoom',
    mutant: 'hidden_app',
    weak: async (p) => (await p.evaluate(() => document.documentElement.clientWidth)) > 0,
    hard: async (p) => await p.locator('#main-content').isVisible(),
  },
  {
    name: 'element-requis-absent',
    mutant: 'missing_filter',
    weak: async (p) => {
      try { await p.selectOption('#filter', 'a'); return true; }
      catch { return true; } // catch muet — la faille
    },
    hard: async (p) => {
      // Élément requis absent = FAIL, jamais true
      const count = await p.locator('#filter').count();
      if (count === 0) return false;
      await p.selectOption('#filter', 'a');
      return await p.$eval('#filter', e => e.value === 'a');
    },
  },
  {
    name: 'page-erreur-vs-metier',
    mutant: 'error_template',
    weak: async (p) => (await p.evaluate(() => document.title !== null)),
    hard: async (p) => await p.locator('#main-content').count() === 1
      && await p.locator('#error-page').isHidden(),
  },
];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
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
