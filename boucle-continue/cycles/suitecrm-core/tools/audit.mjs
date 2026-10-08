#!/usr/bin/env node
/**
 * audit.mjs — audit d'accessibilité axe-core + Playwright (cycle 58 : SuiteCRM-Core 8.9.3, SPA Angular hash-router).
 *
 * Usage :
 *   node audit.mjs <url-de-base>            # crawl same-origin (profondeur 1, max 50 pages)
 *   node audit.mjs --urls a,b,c              # liste explicite d'URLs
 *   node audit.mjs <url> --out dir           # dossier de sortie (défaut: ./a11y-audit)
 *   node audit.mjs <url> --max 20            # nb max de pages en crawl
 *   node audit.mjs <url> --depth 2           # profondeur de crawl (défaut 1)
 *   node audit.mjs <url> --wait 1500         # attente fixe (ms) après chargement
 *   node audit.mjs <url> --wait-for '#app'   # sélecteur REQUIS — absent => erreur de page
 *   node audit.mjs <url> --states all        # états dynamiques déclarés dans STATES
 *   node audit.mjs <url> --states nom1,nom2  # sous-ensemble explicite
 *   node audit.mjs <url> --states none       # déclare explicitement l'ABSENCE d'états
 *   node audit.mjs <url> --keep-hash         # conserve tous les fragments # (SPA hash-router)
 *   node audit.mjs <url> --storage-state f.json  # contexte authentifié Playwright
 *   node audit.mjs <url> --strict-incomplete # 'incomplete' axe compte comme erreur du gate
 *
 * SuiteCRM-Core : frontend Angular en hash-router (#/accounts/index…). Un goto
 * sur le même document avec un hash différent ne recharge PAS la page — le
 * router client navigue de façon asynchrone. v13 ajoute donc ROUTE_PROOFS :
 * chaque URL auditée doit rendre une preuve spécifique au DOM (sélecteur +
 * texte seedé) avant le scan, sinon ERREUR — un scénario dont la vue n'est
 * jamais montée est un scénario sauté, FAIL bruyant listé (leçons 32/45/47).
 * Les preuves ciblent du DOM vanilla-safe (aucun marqueur de patch).
 *
 * Sorties : <out>/report.json (violations + incomplete + métadonnées),
 *           <out>/report.md (trié par impact), <out>/scope.json (périmètre
 *           exécuté + hash — à comparer entre baseline et final).
 *
 * Exit code : 0 = périmètre complet sans violation ; 1 = violation(s) ;
 *             2 = périmètre incomplet ou erreur (config, navigation, injection,
 *                 précondition, HTTP >= 400, redirection login, état inconnu,
 *                 preuve de route absente).
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

// Résolution des deps depuis le projet appelant (CWD), pas depuis ce script.
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const VALUE_OPTIONS = new Set(['out', 'max', 'wait', 'wait-for', 'urls', 'depth', 'states', 'storage-state']);
const FLAG_OPTIONS = new Set(['keep-hash', 'strict-incomplete']);
const options = new Map();
const positional = [];
const configErrors = [];
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (!arg.startsWith('--')) { positional.push(arg); continue; }
  const name = arg.slice(2);
  if (!VALUE_OPTIONS.has(name) && !FLAG_OPTIONS.has(name)) {
    configErrors.push(`option inconnue : ${arg}`);
  } else if (options.has(name)) {
    configErrors.push(`option répétée : ${arg}`);
  } else if (FLAG_OPTIONS.has(name)) {
    options.set(name, true);
  } else if (args[i + 1] === undefined || args[i + 1].startsWith('--')) {
    configErrors.push(`valeur manquante : ${arg}`);
  } else {
    options.set(name, args[++i]);
  }
}
const opt = (name, dflt) => options.get(name) ?? dflt;
const flag = (name) => options.get(name) === true;
if (positional.length > 1) configErrors.push('une seule URL de base est permise');

const baseUrl = positional[0];
const urlsOpt = opt('urls', null);
// Les chemins relatifs (--urls /a,/b) sont résolus contre l'URL de base ;
// sans base résolvable c'est une erreur de config, pas un skip silencieux.
const explicitUrls = urlsOpt === null ? null : urlsOpt.split(',').map(s => s.trim()).filter(Boolean).map(u => {
  if (/^https?:\/\//i.test(u)) return u;
  if (baseUrl) { try { return new URL(u, baseUrl).href; } catch { return u; } }
  return u;
});
const outDir = resolve(opt('out', './a11y-audit'));
const maxPages = Number(opt('max', '50'));
const waitMs = Number(opt('wait', '0'));
const waitFor = opt('wait-for', null);
const depth = Number(opt('depth', '1'));
const statesOpt = opt('states', '');
const statesArg = statesOpt.split(',').map(s => s.trim()).filter(Boolean);
const keepHash = flag('keep-hash');
const strictIncomplete = flag('strict-incomplete');
const storageState = opt('storage-state', null);

if (!baseUrl && explicitUrls === null) {
  configErrors.push('URL manquante : node audit.mjs <url> | --urls u1,u2,...');
}
for (const [name, value, minimum] of [['max', maxPages, 1], ['wait', waitMs, 0], ['depth', depth, 0]]) {
  if (!Number.isSafeInteger(value) || value < minimum) configErrors.push(`--${name} doit être un entier >= ${minimum}`);
}
if (!statesArg.length) configErrors.push('déclarer les états : --states all|nom1,nom2|none');
if (explicitUrls !== null && explicitUrls.length === 0) {
  configErrors.push('--urls fourni mais vide : aucune page demandée ne peut produire un audit PASS');
}
if (explicitUrls && explicitUrls.some(u => !/^https?:\/\//.test(u))) {
  configErrors.push('--urls contient des chemins relatifs sans URL de base résolvable');
}
if (statesArg.includes('none') && statesArg.length > 1) {
  configErrors.push("--states none ne se combine pas avec d'autres états");
}

// Axe rule tags : WCAG 2.2 A+AA + best practice. Voir https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
const RULE_TAGS = ['wcag2a', 'wcag2a-best-practice', 'wcag2aa', 'wcag2aa-best-practice', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const RUNNER_VERSION = 'audit.mjs v13-c58-suitecrm'; // v13 : ROUTE_PROOFS pour SPA hash-router (goto inter-hash sans reload — leçons 32/45/47) ; socle v12-c50

// ids des enregistrements seedés — produits par tools/seed.mjs (seed-info.json).
// En l'absence du fichier les états/URLs pointant un enregistrement échouent honnêtement.
let SEED = {};
try { SEED = JSON.parse(readFileSync(new URL('./seed-info.json', import.meta.url), 'utf8')); } catch { /* non seedé */ }

const ACC1 = () => (SEED.accounts || [])[0]?.id;
const CON1 = () => (SEED.contacts || [])[0]?.id;
const CON1_NAME = () => (SEED.contacts || [])[0]?.name;
const ACC1_NAME = () => (SEED.accounts || [])[0]?.name;

/**
 * ROUTE_PROOFS — preuve de rendu par route hash (leçons 32+47 : sélecteurs et
 * textes présents sur le DOM VANILLA ; textes = données seedées, pas de
 * marqueur de patch). Évaluée sur le document FINAL avant chaque scan d'URL
 * (les états STATES prouvent leur propre montage via setup).
 * Retourne {desc, check} où check s'exécute dans la page ; null = pas de
 * preuve spécifique (la garde d'hydratation générique suffit).
 */
function routeProof(url) {
  let hash;
  try { hash = new URL(url).hash || ''; } catch { return null; }
  if (/#\/login\b/i.test(hash)) {
    return { desc: "formulaire login rendu (input[name=username])",
      check: `!!document.querySelector('input[name="username"]')` };
  }
  const mList = hash.match(/#\/(accounts|contacts|leads|opportunities)\/index/i);
  if (mList) {
    const mod = mList[1].toLowerCase();
    return { desc: `liste ${mod} montée (scrm-table + lien record seedé)`,
      check: `!!document.querySelector('scrm-table') && [...document.querySelectorAll('a[href*="#/${mod}/record/"]')].length > 0` };
  }
  const mRec = hash.match(/#\/(accounts|contacts|leads|opportunities)\/record\/([0-9a-f-]{36})/i);
  if (mRec) {
    const mod = mRec[1].toLowerCase();
    const id = mRec[2];
    const rec = (SEED[mod] || []).find(r => r.id === id);
    const name = rec ? rec.name : null;
    if (!name) return { desc: `record ${mod}/${id} connu du seed`, check: 'false' };
    const nameJs = JSON.stringify(name);
    return { desc: `fiche ${mod} « ${name} » montée (scrm-record + titre)`,
      check: `!!document.querySelector('scrm-record') && (document.querySelector('scrm-record').innerText || '').includes(${nameJs})` };
  }
  const mEdit = hash.match(/#\/(accounts|contacts|leads|opportunities)\/edit/i);
  if (mEdit) {
    return { desc: `vue création ${mEdit[1]} montée (scrm-create-record + champs)`,
      check: `!!document.querySelector('scrm-create-record') && document.querySelectorAll('scrm-create-record input, scrm-create-record select, scrm-create-record .p-dropdown').length >= 3` };
  }
  if (/#\/home\b/i.test(hash) || hash === '' || hash === '#/') {
    return { desc: 'dashboard monté (scrm-classic-view-ui)',
      check: `!!document.querySelector('scrm-classic-view-ui')` };
  }
  if (/#\/users\/record\//i.test(hash)) {
    return { desc: 'fiche utilisateur montée (scrm-record + Administrator)',
      check: `!!document.querySelector('scrm-record') && (document.querySelector('scrm-record').innerText || '').match(/admin/i)` };
  }
  if (/#\/administration\b/i.test(hash)) {
    return { desc: 'administration montée (User Management visible)',
      check: `(document.body.innerText || '').includes('User Management')` };
  }
  return null;
}

/**
 * États dynamiques audités via --states all | nom1,nom2. Le scan axe tourne
 * APRÈS `setup`, sur le DOM résultant — composants invisibles au chargement.
 * Chaque setup finit par une preuve d'état (leçon 32) ; échec = scénario sauté
 * FAIL bruyant (leçon 45). Sélecteurs présents sur le DOM VANILLA (leçon 47).
 * États marqués « auth » à lancer avec --storage-state ; « public » sans.
 */
export const STATES = {
  // ==== AUTH ====
  // Sous-menu du module Accounts (navbar, survol) → .dropdown-menu.show
  'nav-module-submenu': {
    url: b => `${b}/#/home`,
    setup: async page => {
      const t = page.locator('a.top-nav-link.dropdown-toggle', { hasText: 'Accounts' }).first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.hover();
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.dropdown-menu')].some(e =>
          e.offsetParent !== null && /Create Account|View Accounts/i.test(e.innerText)),
      { timeout: 15000 });
    },
  },
  // Menu « More » (navbar, survol) → liens modules cachés (Campaigns…)
  'nav-more-menu': {
    url: b => `${b}/#/home`,
    setup: async page => {
      const t = page.locator('a.nav-link-nongrouped.dropdown-toggle', { hasText: 'More' }).first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.hover();
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.dropdown-menu')].some(e =>
          e.offsetParent !== null && /Campaigns|Security Groups|Home/i.test(e.innerText)),
      { timeout: 15000 });
    },
  },
  // Recherche globale : saisie 'SC58' → dropdown de suggestions ouvert
  'global-search': {
    url: b => `${b}/#/home`,
    setup: async page => {
      const inp = page.locator('input.search-bar-term');
      await inp.waitFor({ state: 'visible', timeout: 30000 });
      await inp.click();
      await inp.fill('SC58');
      await page.waitForFunction(() => {
        const m = document.querySelector('ul.global-search-dropdown, scrm-search-bar .dropdown-menu');
        return m && m.offsetParent !== null && /in everywhere/i.test(m.innerText);
      }, { timeout: 15000 });
    },
  },
  // Caret « global links » de la navbar (actions rapides / récents)
  'global-links-menu': {
    url: b => `${b}/#/accounts/record/${ACC1()}`,
    setup: async page => {
      const t = page.locator('a.dropdown-toggle.action-link.primary-global-link').first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.click();
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.dropdown-menu')].some(e =>
          e.offsetParent !== null && /Quick Actions|Create Account|Recently Viewed/i.test(e.innerText)),
      { timeout: 15000 });
    },
  },
  // Panneau de filtres de la liste accounts → scrm-list-filter visible
  'list-filter-open': {
    url: b => `${b}/#/accounts/index`,
    setup: async page => {
      const t = page.locator('button.filter-settings-button').first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.click();
      await page.waitForSelector('scrm-list-filter', { state: 'visible', timeout: 15000 });
      await page.waitForFunction(() =>
        [...document.querySelectorAll('scrm-list-filter input, scrm-list-filter .p-dropdown, scrm-list-filter select')].length >= 3,
      { timeout: 15000 });
    },
  },
  // Menu « Bulk Action » : cocher d'abord la case de sélection (le bouton
  // est disabled sans sélection — pattern vanilla), puis dropdown ouvert.
  'list-bulk-action-menu': {
    url: b => `${b}/#/accounts/index`,
    setup: async page => {
      await page.waitForSelector('scrm-table a[href*="#/accounts/record/"]', { timeout: 30000 });
      await page.locator('label.checkbox-container input[type="checkbox"]').first().evaluate(e => e.click());
      await page.waitForFunction(() => {
        const b = [...document.querySelectorAll('button.bulk-action-button')].find(x => x.offsetParent !== null && !x.disabled);
        return !!b;
      }, { timeout: 15000 });
      const t = page.locator('button.bulk-action-button:visible:not([disabled])').last();
      await t.waitFor({ state: 'visible', timeout: 15000 });
      await t.click();
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.dropdown-menu')].some(e =>
          e.offsetParent !== null && /Delete|Export|Merge|Mass Update/i.test(e.innerText)),
      { timeout: 15000 });
    },
  },
  // Choix des colonnes de la liste → modale ngb role=dialog
  'list-column-chooser': {
    url: b => `${b}/#/accounts/index`,
    setup: async page => {
      await page.waitForSelector('scrm-table a[href*="#/accounts/record/"]', { timeout: 30000 });
      const t = page.locator('button.table-action-button').first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.click();
      await page.waitForFunction(() => {
        const m = document.querySelector('ngb-modal-window.column-chooser-modal, ngb-modal-window[role="dialog"]');
        return m && (m.innerText || '').trim().length > 10;
      }, { timeout: 15000 });
    },
  },
  // Menu « Actions » d'une fiche → dropdown ouvert (Delete, Duplicate…)
  'record-actions-menu': {
    url: b => `${b}/#/accounts/record/${ACC1()}`,
    setup: async page => {
      await page.waitForSelector('scrm-record', { timeout: 30000 });
      const t = page.locator('button.dropdown-toggle', { hasText: 'Actions' }).first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.click();
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.dropdown-menu')].some(e =>
          e.classList.contains('show') && e.offsetParent !== null && /Delete|Duplicate|Print/i.test(e.innerText)),
      { timeout: 15000 });
    },
  },
  // Onglet « MORE INFORMATION » d'une fiche → pane active basculée
  'record-tab-more-info': {
    url: b => `${b}/#/accounts/record/${ACC1()}`,
    setup: async page => {
      await page.waitForSelector('scrm-record', { timeout: 30000 });
      const t = page.locator('a.nav-link.tab-link', { hasText: 'MORE INFORMATION' }).first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.click();
      await page.waitForFunction(() => {
        const act = [...document.querySelectorAll('a.nav-link.tab-link.active, .nav-link.tab-link.active')];
        return act.some(e => /MORE INFORMATION/i.test(e.innerText))
          || [...document.querySelectorAll('.tab-pane, [role=tabpanel]')].some(e2 => e2.offsetParent !== null && /DATE|ASSIGNED/i.test(e2.innerText));
      }, { timeout: 15000 });
    },
  },
  // Sous-panneau Contacts d'une fiche compte → ligne du contact seedé
  'subpanel-open': {
    url: b => `${b}/#/accounts/record/${ACC1()}`,
    setup: async page => {
      await page.waitForSelector('scrm-subpanel-container', { timeout: 30000 });
      const t = page.locator('td.sub-panel-banner-body-table-col', { hasText: 'CONTACTS' }).first();
      // L'accordéon subpanels démarre replié ou déplié selon les préférences
      // de l'instance : si le corps n'apparaît pas, on clique le header toggle.
      try {
        await t.waitFor({ state: 'visible', timeout: 8000 });
      } catch {
        const head = page.locator('.sub-panel-header-toggle a, .accordion-header a.position-relative').first();
        await head.waitFor({ state: 'visible', timeout: 15000 });
        await head.click();
        await t.waitFor({ state: 'visible', timeout: 30000 });
      }
      await t.click();
      const name = CON1_NAME() || 'Alice Martin';
      // scrm-subpanel ne se monte au DOM qu'à l'ouverture — présence + lien
      // record seedé = preuve (offsetParent est null sous position:fixed).
      await page.waitForFunction((n) => {
        const sp = document.querySelector('scrm-subpanel');
        return sp && (sp.innerText || '').includes(n)
          && !!sp.querySelector('a[href*="#/contacts/record/"]');
      }, name, { timeout: 25000 });
    },
  },
  // Dropdown PrimeNG (relate « Assigned to ») en édition → panneau options
  'edit-p-dropdown-open': {
    url: b => `${b}/#/contacts/edit?return_module=Contacts&return_action=DetailView`,
    setup: async page => {
      await page.waitForSelector('scrm-create-record', { timeout: 30000 });
      const t = page.locator('.field-name-assigned_user_name .p-dropdown-trigger, scrm-relate-edit .p-dropdown-trigger').first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.click();
      await page.waitForFunction(() => {
        const p = document.querySelector('.p-dropdown-panel, ul[role="listbox"], .p-dropdown-items-wrapper');
        return p && p.offsetParent !== null && (p.innerText || '').trim().length > 0;
      }, { timeout: 15000 });
    },
  },
  // Champ relate « Account Name » en édition contact → panneau options
  'edit-relate-field': {
    url: b => `${b}/#/contacts/edit?return_module=Contacts&return_action=DetailView`,
    setup: async page => {
      await page.waitForSelector('scrm-create-record', { timeout: 30000 });
      const t = page.locator('.field-name-account_name .p-dropdown-trigger, .field-name-account_name input, .field-name-account_name button').first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.click();
      await page.waitForFunction(() => {
        const p = document.querySelector('.p-dropdown-panel, ul[role="listbox"], .dropdown-menu.show, [class*=relate] [class*=dropdown]');
        return p && p.offsetParent !== null && (p.innerText || '').trim().length > 0;
      }, { timeout: 15000 });
    },
  },
  // Mobile 390 : bouton hamburger navbar → menu collapse ouvert
  'mobile-390': {
    url: b => `${b}/#/home`,
    setup: async page => {
      await page.setViewportSize({ width: 390, height: 800 });
      const t = page.locator('button.navbar-toggler').first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.click();
      // le menu mobile est une sidebar PrimeNG (.mobile-menu-container)
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.mobile-menu-container, .p-sidebar-content, .mobile-nav-link')].some(e =>
          e.offsetParent !== null && /Accounts|Contacts|Home/i.test(e.innerText)),
      { timeout: 15000 });
      await page.waitForTimeout(400);
    },
  },
  // ==== PUBLIC (sans storage-state) ====
  // Page login en mobile 390
  'login-mobile-390': {
    context: 'public',
    url: b => `${b}/#/Login`,
    setup: async page => {
      await page.setViewportSize({ width: 390, height: 800 });
      await page.waitForSelector('input[name="username"]', { state: 'visible', timeout: 30000 });
      await page.waitForFunction(() =>
        !!document.querySelector('button') && /Log In/i.test(document.body.innerText),
      { timeout: 15000 });
    },
  },
  // Soumission de mauvais identifiants → alerte d'erreur affichée
  'login-bad-creds': {
    context: 'public',
    url: b => `${b}/#/Login`,
    setup: async page => {
      await page.waitForSelector('input[name="username"]', { state: 'visible', timeout: 30000 });
      await page.fill('input[name="username"]', 'sc58-probe');
      await page.fill('input[name="password"]', 'sc58-wrong-pass');
      await page.click('button:has-text("Log In")');
      await page.waitForFunction(() =>
        [...document.querySelectorAll('[role="alert"], .alert')].some(e =>
          e.offsetParent !== null && /incorrect|invalid/i.test(e.innerText)),
      { timeout: 20000 });
    },
  },
};

if (statesArg.includes('all') && Object.keys(STATES).length === 0) {
  configErrors.push("--states all demandé mais STATES est vide : déclarez les états dynamiques, ou affirmez leur absence avec '--states none'");
}
const unknownStates = statesArg.filter(s => s !== 'all' && s !== 'none' && !(s in STATES));
if (unknownStates.length) {
  configErrors.push(`état(s) demandé(s) inconnu(s) : ${unknownStates.join(', ')} (déclarés : ${Object.keys(STATES).join(', ') || 'aucun'})`);
}

function sameOrigin(u, origin) {
  try { return new URL(u).origin === origin; } catch { return false; }
}

// Un fragment n'est une ANCRE effaçable que s'il ne ressemble pas à une route
// de hash-router (#/x, #!/x, #$:/x, #x/y). SuiteCRM = hash-router : les URLs
// auditées passent par --urls explicites, jamais par crawl de liens.
function normalizeForDedup(u) {
  try {
    const url = new URL(u);
    if (keepHash) return url.href;
    const h = url.hash;
    if (!h) return url.href;
    return /[\/!:$]/.test(h) ? url.href : url.href.split('#')[0];
  } catch { return u; }
}

async function collectUrls(page, startUrl, origin, maxDepth, limit, crawlErrors) {
  const seen = new Set([normalizeForDedup(startUrl)]);
  const queue = [{ url: startUrl, d: 0 }];
  while (queue.length && seen.size < limit) {
    const { url, d } = queue.shift();
    if (d >= maxDepth) continue;
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      const links = await page.$$eval('a[href]', els => els.map(e => e.href));
      for (const l of links) {
        const clean = normalizeForDedup(l);
        if (sameOrigin(clean.split('#')[0], origin) && !seen.has(clean) && seen.size < limit
            && !/\.(png|jpe?g|gif|svg|webp|pdf|zip|css|js|ico|woff2?|mp[34]|xml|json)(\?|#|$)/i.test(clean)) {
          seen.add(clean);
          queue.push({ url: clean, d: d + 1 });
        }
      }
    } catch (e) {
      crawlErrors.push(`[crawl] ${url}: ${e.message}`);
      console.error(`[crawl] ${url}: ${e.message}`);
    }
  }
  return [...seen];
}

const LOGIN_PATH = /\/(login|signin|sign-in|sign_in|auth|connexion)\b/i;

const runId = randomUUID();

// Écriture atomique : tmp + rename — un reader ne voit jamais un fichier
// partiellement écrit, et les preuves portent le runId du run courant.
function writeJson(file, obj) {
  const tmp = resolve(outDir, file + '.tmp');
  writeFileSync(tmp, JSON.stringify(obj, null, 2));
  renameSync(tmp, resolve(outDir, file));
}
function writeText(file, text) {
  const tmp = resolve(outDir, file + '.tmp');
  writeFileSync(tmp, text);
  renameSync(tmp, resolve(outDir, file));
}

// Écrit un résultat d'erreur atomique : un audit dont la config est invalide
// (ou dont le navigateur n'a pas démarré) produit quand même scope.json/
// report.json/report.md du RUN COURANT — jamais un rapport ancien laissé
// en place et réutilisé par erreur.
function writeErrorReports(configErrors, crawlErrors) {
  mkdirSync(outDir, { recursive: true });
  const scopeHash = createHash('sha256').update('[]').digest('hex');
  const now = new Date().toISOString();
  writeJson('scope.json', {
    runId, runnerVersion: RUNNER_VERSION, generatedAt: now,
    baseUrl: baseUrl ?? null, depth, maxPages,
    statesRequested: statesArg, wait: waitMs, waitFor,
    storageState: !!storageState,
    total: 0, audited: 0, errored: 0, crawlErrors, configErrors,
    scopeHash, scenarios: [],
  });
  writeJson('report.json', {
    runId, runnerVersion: RUNNER_VERSION, generatedAt: now,
    baseUrl: baseUrl ?? null,
    pages: [], configErrors, crawlErrors, scopeHash,
  });
  let md = `# Audit accessibilité — ${now.slice(0, 10)}\n\n`;
  md += `**0 scénario audité — ${configErrors.length + crawlErrors.length} erreur(s) de configuration/périmètre. Exit code 2.**\n\n`;
  for (const e of configErrors) md += `- config : ${e}\n`;
  for (const e of crawlErrors) md += `- ${e}\n`;
  writeText('report.md', md);
}

async function run() {
  mkdirSync(outDir, { recursive: true });
  // Toute la config est validée AVANT d'exécuter quoi que ce soit —
  // sinon un état inconnu planterait après le début des rapports.
  if (configErrors.length) {
    writeErrorReports(configErrors, []);
    for (const e of configErrors) console.error(`[config] ${e}`);
    process.exit(2);
  }
  const results = [];
  const crawlErrors = [];

  const browser = await chromium.launch();
  // locale:'en-US' sur TOUT contexte Playwright — leçon 38
  const context = await browser.newContext({ locale: 'en-US', ...(storageState ? { storageState } : {}) });
  const page = await context.newPage();

  // Suivi de la dernière réponse de NAVIGATION du document principal : un clic
  // dans un setup (ou un reload) déclenche une vraie navigation dont goto() ne
  // rend pas la réponse — sans ce suivi, un HTTP 500 déclenché pendant setup
  // était invisible et le scan partait sur la page d'erreur (v4).
  let lastNavResponse = null;
  if (typeof page.on === 'function') {
    page.on('response', (r) => {
      try {
        if (r.request().isNavigationRequest() && r.frame() === page.mainFrame()) lastNavResponse = r;
      } catch { /* frame/request détachés */ }
    });
  }

  let urls;
  if (explicitUrls !== null) {
    urls = explicitUrls;
  } else {
    const origin = new URL(baseUrl).origin;
    console.log(`[crawl] ${baseUrl} (depth=${depth}, max=${maxPages})`);
    urls = await collectUrls(page, baseUrl, origin, depth, maxPages, crawlErrors);
    console.log(`[crawl] ${urls.length} page(s)`);
    if (urls.length === 0) crawlErrors.push('crawl : aucune page découverte');
  }

  const axePath = require.resolve('axe-core/axe.min.js');
  const axeSource = readFileSync(axePath, 'utf8');

  // Injection d'axe : addScriptTag crée un élément <script> soumis à la CSP
  // de la page ; une CSP stricte (script-src 'self') le bloque. Repli :
  // évaluer la source axe directement dans le contexte de la page (CDP,
  // non soumis à la CSP), puis prouver que l'injection a marché — sinon
  // axe.run() est indéfini et le « 0 violation » serait un faux PASS.
  const injectAxe = async () => {
    try {
      await page.addScriptTag({ content: axeSource });
    } catch {
      await page.evaluate(axeSource);
    }
    if (typeof (await page.evaluate(() => window.axe && window.axe.version)) !== 'string') {
      throw new Error("injection axe impossible (CSP ?) — scan invalide, pas un PASS");
    }
  };

  // axe mesure les couleurs calculées — une transition en cours (fondu
  // d'entrée, élévation d'un élément animé…) produit des violations
  // color-contrast fantômes qui disparaissent au re-scan. On attend la fin
  // des animations/transitions FINIES ; les animations infinies (spinner)
  // ne bloquent pas le scan. Attente best-effort : un dépassement n'est
  // pas une erreur, le scan reste valide.
  const settleAnimations = async () => {
    try {
      await page.waitForFunction(
        () => document.getAnimations().every((a) => {
          if (a.playState !== 'running') return true;
          const t = a.effect.getComputedTiming();
          return a.transitionProperty == null && t.iterations === Infinity;
        }),
        { timeout: 4000, polling: 100 },
      );
    } catch { /* animations longues/infinies : le scan part quand même */ }
  };

  const scanPage = async () => {
    await settleAnimations();
    await injectAxe();
    return await page.evaluate(async (tags) => {
      return await window.axe.run(document, {
        runOnly: { type: 'tag', values: tags },
        resultTypes: ['violations', 'incomplete'],
      });
    }, RULE_TAGS);
  };

  const recordPage = (entry) => results.push(entry);

  // Contrôle commun à TOUTE navigation : statut HTTP de la dernière
  // navigation du document principal + identité de l'URL finale
  // (redirection login = la page demandée n'a pas été auditée).
  // response null → on retombe sur lastNavResponse (navigations déclenchées
  // par un setup ou un JS, dont goto() ne rend pas la réponse).
  const checkNav = (response, requested) => {
    const httpStatus = response ? response.status()
      : (lastNavResponse && lastNavResponse.url() === page.url() ? lastNavResponse.status() : null);
    const finalUrl = page.url();
    let error = null;
    if (httpStatus !== null && httpStatus >= 400) {
      error = `HTTP ${httpStatus}`;
    } else if (LOGIN_PATH.test(finalUrl) && !LOGIN_PATH.test(requested)) {
      error = `redirection vers une page de connexion (${finalUrl}) — la page demandée n'a pas été auditée`;
    }
    return { httpStatus, finalUrl, error };
  };

  // Garde d'hydratation (SuiteCRM 8 = SPA Angular) : le shell index.html est
  // servi vide (<app-root></app-root>) — sans garde, un scan peut partir sur
  // un shell non encore monté (PASS vacuus). On exige un marqueur de vue
  // montée (chrome applicatif scrm-*, formulaire login) ET du texte réel.
  // Sur timeout : reloadRetry (autorisé pré-setup / page simple — aucun
  // état interactif à perdre) recharge une fois ; un stall survivant part
  // en ERREUR — un résultat sur body vide n'est pas un PASS.
  const waitHydrated = async (reloadRetry) => {
    const attempt = () =>
      page
        .waitForFunction(
          () => {
            if (!document.querySelector('scrm-navbar-ui, scrm-classic-view-ui, scrm-list, scrm-record, scrm-create-record, scrm-login, input[name="username"], form, app-root > *')) return false;
            const t = (document.body.innerText || '').trim();
            return t.length > 20;
          },
          { timeout: 30000, polling: 100 },
        )
        .then(() => true, () => false);
    if (await attempt()) return true;
    if (!reloadRetry) return false;
    try {
      await page.reload({ waitUntil: 'load', timeout: 30000 });
    } catch {
      /* reload échoué : l'attente qui suit tranche */
    }
    return attempt();
  };

  // SPA hash-router : le pathname ne change jamais ('/') — la stabilité se
  // juge sur l'URL complète (hash inclus) après les redirections d'auth.
  const settleSession = async () => {
    try {
      await page.waitForFunction(
        () => document.querySelector('scrm-navbar-ui, input[name="username"]') !== null,
        { timeout: 20000, polling: 150 },
      );
    } catch { /* app non montée : checkNav/waitHydrated trancheront */ }
    let last = page.url();
    for (let i = 0; i < 40; i++) {
      await page.waitForTimeout(150);
      const cur = page.url();
      if (cur === last) return;
      last = cur;
    }
  };

  // En contexte authentifié, la SPA rend le formulaire de login si la session
  // storageState n'est pas reconnue : sans ce garde, le formulaire serait
  // scanné à la place de la page demandée — un faux PASS silencieux.
  const assertAuthed = async () => {
    if (!storageState) return;
    if (storageState && await page.evaluate(() => !!document.querySelector('input[name="username"]'))) {
      throw new Error('formulaire de connexion rendu en contexte authentifié — storageState invalide/expiré, scan refusé');
    }
  };

  // Préconditions métier rejouées sur le document courant : --wait-for sur
  // le document FINAL, pas seulement sur le document avant rechargement.
  // skipHydration : pages d'erreur déclarées (expectHttp) — une 404 réelle est
  // une page sans chrome applicatif, le setup de l'état fait foi de montage.
  const applyPreconditions = async ({ hydrationRetry = true, skipHydration = false } = {}) => {
    if (!skipHydration && !(await waitHydrated(hydrationRetry))) {
      throw new Error(
        'contenu non monté (ni navbar ni login rendu, ou body sans texte) — scan refusé',
      );
    }
    if (storageState) { if (!skipHydration) await settleSession(); await assertAuthed(); }
    if (waitFor) {
      await page.waitForSelector(waitFor, { state: 'attached', timeout: 15000 }); // précondition : non avalée
    }
    if (waitMs) await page.waitForTimeout(waitMs);
  };

  const auditLocation = async (label, gotoUrl, extraSetup, expectHttp) => {
    const entry = { url: label, requestedUrl: gotoUrl, violations: [], incomplete: [] };
    lastNavResponse = null;
    try {
      const resp = await page.goto(gotoUrl, { waitUntil: 'load', timeout: 30000 });
      // SPA : un goto inter-hash ne recharge pas — la garde d'hydratation
      // confirme seulement qu'UNE vue est montée ; la preuve de route
      // (assertRouteProof) confirme que c'est la BONNE vue.
      if (storageState) {
        if (!expectHttp) {
          if (!(await waitHydrated(true))) {
            throw new Error(
              'contenu non monté (ni navbar ni login rendu, ou body sans texte) — scan refusé',
            );
          }
          await settleSession();
        }
        await assertAuthed();
      }
      const nav = checkNav(resp, gotoUrl);
      entry.httpStatus = nav.httpStatus;
      entry.finalUrl = nav.finalUrl;
      entry.error = nav.error;
      // État d'erreur déclaré (expectHttp) : le statut attendu n'est pas un
      // échec — le scan court sur la vraie page d'erreur.
      if (expectHttp && entry.error === `HTTP ${expectHttp}`) entry.error = null;
      if (!entry.error) {
        await applyPreconditions({ skipHydration: !!expectHttp });
        if (extraSetup) {
          // Le setup peut re-naviguer (état dynamique) : sa navigation est
          // re-contrôlée, et l'URL post-setup aussi — le document scanné
          // est celui qui compte, pas celui de la première navigation.
          const nav2 = await extraSetup(page, checkNav);
          if (nav2) {
            entry.httpStatus = nav2.httpStatus ?? entry.httpStatus;
            entry.finalUrl = nav2.finalUrl;
            if (nav2.error) entry.error = nav2.error;
            if (expectHttp && entry.error === `HTTP ${expectHttp}`) entry.error = null;
          }
        }
        // Re-vérification SYSTÉMATIQUE du document final (pages comme états) :
        // couvre la nav pendant setup, la redirection login différée pendant
        // --wait, et applique les préconditions sur le document réellement
        // scanné — pas celui d'avant rechargement.
        if (!entry.error && extraSetup) {
          try {
            // Post-setup : PAS de retry reload — un reload détruirait l'état
            // monté (modale ouverte…). Sur stall d'hydratation on REJOUÈE le
            // setup complet une seule fois (il re-navigue about:blank → url
            // → interactions), puis on revérifie sans retry.
            await applyPreconditions({ hydrationRetry: false, skipHydration: !!expectHttp });
          } catch (e1) {
            if (!/contenu non monté/.test(e1.message)) throw e1;
            const nav3 = await extraSetup(page, checkNav);
            if (nav3) {
              entry.httpStatus = nav3.httpStatus ?? entry.httpStatus;
              entry.finalUrl = nav3.finalUrl;
              if (nav3.error) entry.error = nav3.error;
              if (expectHttp && entry.error === `HTTP ${expectHttp}`) entry.error = null;
            }
            if (!entry.error) await applyPreconditions({ hydrationRetry: false, skipHydration: !!expectHttp });
          }
        }
        const post = checkNav(null, gotoUrl);
        entry.httpStatus = post.httpStatus ?? entry.httpStatus;
        entry.finalUrl = post.finalUrl;
        if (!entry.error && post.error) entry.error = post.error;
        if (expectHttp && entry.error === `HTTP ${expectHttp}`) entry.error = null;
        if (!entry.error) {
          try {
            const req = new URL(gotoUrl), fin = new URL(post.finalUrl);
            if (fin.origin !== req.origin) {
              entry.error = `navigation hors origine avant le scan (${post.finalUrl})`;
            } else if (fin.pathname !== req.pathname) {
              // Un setup qui change de PAGE (pas seulement de hash/query)
              // scanne un autre document que celui demandé.
              entry.error = `le document final diffère du document demandé (${post.finalUrl}) — déclarer l'URL réelle de l'état dans STATES`;
            }
          } catch { /* URL exotique : déjà couvert par les autres contrôles */ }
        }
        // Preuve de route par URL simple (les états prouvent leur propre
        // montage dans setup). La preuve cible l'URL DEMANDÉE ; si le hash
        // final diffère (normalisation Angular ex. /administration/index →
        // /administration), on retombe sur la preuve de l'URL finale, sinon
        // on garde celle de la demande — jamais de scan sur vue non prouvée.
        if (!entry.error && !extraSetup) {
          const target = post.finalUrl || gotoUrl;
          const proof = routeProof(target) ?? routeProof(gotoUrl);
          if (proof) {
            try {
              await page.waitForFunction(proof.check, null, { timeout: 30000, polling: 150 });
            } catch {
              entry.error = `preuve de route absente : ${proof.desc} — vue non montée, scénario sauté interdit`;
            }
          }
        }
        if (!entry.error) {
          const res = await scanPage();
          if (!res || !Array.isArray(res.violations)) {
            entry.error = 'résultat axe mal formé (pas de liste violations) — scan invalide, pas un PASS';
          } else {
            entry.violations = res.violations;
            entry.incomplete = res.incomplete || [];
            entry.testEngine = res.testEngine || null;
            if (strictIncomplete && entry.incomplete.length) {
              entry.error = `${entry.incomplete.length} résultat(s) axe 'incomplete' (--strict-incomplete)`;
            }
          }
        }
      }
      console.log(`[scan] ${label} — ${entry.error ? 'ERREUR ' + entry.error : `${entry.violations.length} règle(s) violée(s)` + (entry.incomplete.length ? `, ${entry.incomplete.length} incomplete` : '')}`);
    } catch (e) {
      entry.error = e.message;
      console.error(`[scan] ${label}: ${e.message}`);
    }
    recordPage(entry);
  };

  for (const url of urls) {
    await auditLocation(url, url, null);
  }

  // États dynamiques : chaque état repart d'un document neuf — en navigation
  // par hash (SPA), un goto sur le même document ne recharge pas et l'état
  // précédent (drawer ouvert…) persisterait.
  // Chaque état appartient à un contexte : 'auth' (défaut) requiert
  // --storage-state, 'public' refuse la session. '--states all' ne lance que
  // les états du contexte courant ; nommer un état du mauvais contexte = erreur.
  const runContext = storageState ? 'auth' : 'public';
  const wanted = statesArg.includes('all')
    ? Object.keys(STATES).filter(n => (STATES[n].context ?? 'auth') === runContext)
    : statesArg.filter(s => s !== 'none');
  for (const n of wanted) {
    const ctx = STATES[n].context ?? 'auth';
    if (ctx !== runContext) {
      throw new Error(`état '${n}' déclaré contexte '${ctx}' — impossible sous '${runContext}' (storageState=${!!storageState})`);
    }
  }
  if (wanted.length) {
    const origin = baseUrl ? new URL(baseUrl).origin : new URL(urls[0]).origin;
    for (const name of wanted) {
      const st = STATES[name];
      const label = `${st.url(origin)} [state:${name}]`;
      // La 2e navigation (rechargement à neuf) est contrôlée comme la 1re :
      // HTTP >= 400 ou redirection login => erreur, le scan ne tourne pas
      // sur la mauvaise page. Le contrôle post-setup (statut via
      // lastNavResponse, identité d'URL, préconditions re-jouées) est fait
      // par auditLocation lui-même sur le document final.
      await auditLocation(label, st.url(origin), async (p, check) => {
        await p.goto('about:blank');
        const resp2 = await p.goto(st.url(origin), { waitUntil: 'load', timeout: 30000 });
        // SPA : stabiliser la session/montage avant le setup et avant de
        // juger la nav. État expectHttp : pas de chrome à hydrater.
        if (storageState) {
          if (!st.expectHttp) {
            await waitHydrated(true);
            await settleSession();
          }
          await assertAuthed();
        } else if (!st.expectHttp) {
          await waitHydrated(true);
        }
        const nav2 = check(resp2, st.url(origin));
        // Le statut attendu (expectHttp) n'interrompt pas le setup.
        if (nav2.error && nav2.error !== `HTTP ${st.expectHttp}`) return nav2;
        await st.setup(p);
        const nav3 = check(null, st.url(origin));
        return nav3.error ? nav3 : nav2;
      }, st.expectHttp);
    }
  }

  await browser.close();

  // Périmètre exécuté : identifiant = url demandée + statut. scope.json permet
  // de comparer l'ensemble EXACT des scénarios entre baseline et final — une
  // somme égale de pages ne prouve pas l'identité des ensembles.
  const scenarioId = (e) => e.url;
  const scopeEntries = results.map(e => ({
    id: scenarioId(e), status: e.error ? 'error' : 'audited',
    httpStatus: e.httpStatus ?? null, finalUrl: e.finalUrl ?? null,
  }));
  const scopeHash = createHash('sha256')
    .update(JSON.stringify(scopeEntries.map(e => e.id).sort()))
    .digest('hex');
  // statesHash couvre l'URL ET le code de setup de chaque état exécuté —
  // le scopeHash seul ne prouve que l'identité des labels, pas celle des
  // actions jouées (un setup modifié entre baseline et final passerait sinon).
  let statesHash = null;
  if (wanted.length) {
    const stOrigin = baseUrl ? new URL(baseUrl).origin : new URL(urls[0]).origin;
    const statesDigest = {};
    for (const name of wanted) {
      statesDigest[name] = { url: STATES[name].url(stOrigin), setup: STATES[name].setup.toString() };
    }
    statesHash = createHash('sha256').update(JSON.stringify(statesDigest)).digest('hex');
  }
  const scope = {
    runId, runnerVersion: RUNNER_VERSION, generatedAt: new Date().toISOString(),
    baseUrl: baseUrl ?? null, depth, maxPages, statesRequested: statesArg,
    wait: waitMs, waitFor,
    storageState: !!storageState,
    total: scopeEntries.length,
    audited: scopeEntries.filter(e => e.status === 'audited').length,
    errored: scopeEntries.filter(e => e.status === 'error').length,
    crawlErrors,
    scopeHash,
    statesHash,
    scenarios: scopeEntries,
  };
  writeJson('scope.json', scope);

  const errorCount = scope.errored + crawlErrors.length + configErrors.length;
  writeJson('report.json', {
    runId, runnerVersion: RUNNER_VERSION,
    generatedAt: new Date().toISOString(), baseUrl: baseUrl ?? null,
    pages: results, configErrors, crawlErrors, scopeHash,
  });

  // Rapport markdown : regroupé par règle, trié par impact
  const impactRank = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  const byRule = new Map();
  const incompleteByRule = new Map();
  for (const p of results) {
    for (const v of p.violations || []) {
      if (!byRule.has(v.id)) byRule.set(v.id, { ...v, pages: new Map() });
      byRule.get(v.id).pages.set(p.url, (v.nodes || []).map(n => n.target.join(' ')));
    }
    for (const v of p.incomplete || []) {
      if (!incompleteByRule.has(v.id)) incompleteByRule.set(v.id, { ...v, pages: new Map() });
      incompleteByRule.get(v.id).pages.set(p.url, (v.nodes || []).map(n => (n.target || []).join(' ')));
    }
  }
  const rules = [...byRule.values()].sort((a, b) =>
    (impactRank[a.impact] ?? 9) - (impactRank[b.impact] ?? 9) || b.pages.size - a.pages.size);

  let md = `# Audit accessibilité — ${new Date().toISOString().slice(0, 10)}\n\n`;
  const totalRules = rules.length;
  const totalNodes = rules.reduce((s, r) => s + [...r.pages.values()].reduce((a, t) => a + t.length, 0), 0);
  const totalIncomplete = [...incompleteByRule.values()].reduce((s, r) => s + [...r.pages.values()].reduce((a, t) => a + t.length, 0), 0);
  md += `**${totalRules} règle(s) violée(s), ${totalNodes} occurrence(s), ${scope.audited}/${scope.total} scénario(s) audité(s), ${errorCount} erreur(s), ${totalIncomplete} résultat(s) incomplet(s).**\n\n`;
  md += `Périmètre : scope.json — hash \`${scopeHash.slice(0, 12)}\`\n\n`;

  for (const r of rules) {
    md += `## [${r.impact?.toUpperCase()}] ${r.id} — ${r.help}\n\n${r.description}\nRéférence : ${r.helpUrl}\n\n`;
    for (const [page, targets] of r.pages) {
      md += `- ${page}\n`;
      for (const t of targets.slice(0, 10)) md += `  - \`${t}\`\n`;
      if (targets.length > 10) md += `  - … +${targets.length - 10} autres\n`;
    }
    md += '\n';
  }

  if (incompleteByRule.size) {
    md += `## Résultats incomplets à revoir (${totalIncomplete})\n\n`;
    md += 'axe n\'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :\n\n';
    for (const r of incompleteByRule.values()) {
      md += `### ${r.id} — ${r.help || ''}\n\n`;
      for (const [page, targets] of r.pages) {
        md += `- ${page}\n`;
        for (const t of targets.slice(0, 10)) md += `  - \`${t}\`\n`;
        if (targets.length > 10) md += `  - … +${targets.length - 10} autres\n`;
      }
      md += '\n';
    }
  }

  const errs = results.filter(p => p.error);
  if (errs.length || crawlErrors.length || configErrors.length) {
    md += `## Erreurs (${errs.length + crawlErrors.length + configErrors.length}) — exit code != 0\n\n`;
    md += 'Ces scénarios n\'ont pas été audités. Un audit partiel n\'est pas un PASS : le gate CI échoue tant qu\'un scénario demandé manque.\n\n';
    for (const e of errs) md += `- ${e.url} — ${e.error}\n`;
    for (const e of crawlErrors) md += `- ${e}\n`;
    for (const e of configErrors) md += `- config : ${e}\n`;
    md += '\n';
  }
  writeText('report.md', md);
  console.log(`\n${outDir}/report.md — ${totalRules} règle(s), ${totalNodes} occurrence(s), ${errorCount} erreur(s), ${totalIncomplete} incomplet(s)`);

  if (configErrors.length) for (const e of configErrors) console.error(`[config] ${e}`);
  if (errorCount > 0) process.exit(2);
  process.exit(totalRules > 0 ? 1 : 0);
}

const isMain = process.argv[1] && import.meta.url === 'file://' + resolve(process.argv[1]);
if (isMain) run().catch(e => {
  console.error(e);
  // Échec global (ex. navigateur non lançable) : on écrit quand même les
  // rapports d'erreur du RUN COURANT — jamais un report.json périmé pris
  // pour une preuve récente.
  try {
    writeErrorReports([`erreur fatale du run : ${e.message}`], []);
  } catch (w) {
    console.error('impossible d\'écrire le rapport d\'erreur :', w);
  }
  process.exit(2);
});
