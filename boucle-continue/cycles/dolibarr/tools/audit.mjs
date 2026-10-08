#!/usr/bin/env node
/**
 * audit.mjs — audit d'accessibilité axe-core + Playwright.
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
 * États dynamiques : déclarez-les dans la carte STATES ci-dessous — ce sont les
 * vues invisibles au chargement (modales, drawers, toasts, onglets) qu'un audit
 * route-par-route ne voit jamais. Le scan tourne après le `setup` de chaque état.
 * `--states all` sur une carte vide est une ERREUR : déclarez les états ou
 * affirmez leur absence avec `--states none`.
 *
 * Prérequis : npm i -D playwright axe-core && npx playwright install chromium
 *
 * Sorties : <out>/report.json (violations + incomplete + métadonnées),
 *           <out>/report.md (trié par impact), <out>/scope.json (périmètre
 *           exécuté + hash — à comparer entre baseline et final).
 *
 * Exit code : 0 = périmètre complet sans violation ; 1 = violation(s) ;
 *             2 = périmètre incomplet ou erreur (config, navigation, injection,
 *                 précondition, HTTP >= 400, redirection login, état inconnu).
 *             Un PASS n'existe que si tout le périmètre demandé a été audité.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Résolution des deps depuis ce script (tools/), indépendant du CWD appelant.
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(HERE, 'package.json'));
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

const RUNNER_VERSION = 'audit.mjs v12-c57'; // v12 fixer : états expectHttp réellement scannés (bypass garde hydratation sur pages d'erreur — route-404 F3) ; v11 : garde hydratation + session settle

// ids des enregistrements seedés — produits par tools/seed.mjs (seed-info.json).
// En l'absence du fichier les états pointant un enregistrement échouent honnêtement.
let SEED = {};
try { SEED = JSON.parse(readFileSync(new URL('./seed-info.json', import.meta.url), 'utf8')); } catch { /* non seedé */ }

/**
 * États dynamiques audités via --states all | nom1,nom2. Le scan axe tourne
 * APRÈS `setup`, sur le DOM résultant — c'est ce qui couvre les composants
 * invisibles au chargement (modale, drawer, toast, onglet, section dépliée),
 * angle mort d'un audit route-par-route. `url(b)` reçoit l'origine de base.
 * Adaptez cette carte au projet (sélecteurs + séquence). Exemple :
 *   'drawer-fiche': {
 *     url: b => `${b}/#/liste`,
 *     setup: async page => {
 *       await page.locator('table tr[data-id]').first().click();
 *       await page.waitForSelector('#drawer:not(.hidden)', { timeout: 10000 });
 *     },
 *   },
 */
const S1 = () => (SEED.societe_ids || [])[0];
// v2 : ids explicites du seed (facture_draft_id/facture_payee_id) — le repli
// « premier id ≠ validée » désignait une facture PAYÉE quand le seed en crée une.
const F_VALID = () => SEED.facture_validee_id;
const F_DRAFT = () => SEED.facture_draft_id
  || (SEED.facture_ids || []).find(id => id !== SEED.facture_validee_id && id !== SEED.facture_payee_id);

export const STATES = {
  // dolibarr 24.0.2 @7e92776 — PHP SSR + jQuery + Bootstrap, thème eldy.
  // Chaque setup finit par une preuve d'état (leçon 32) ; échec = scénario
  // sauté FAIL bruyant (leçon 45). Sélecteurs présents sur le DOM VANILLA
  // (leçon 47) — aucun marqueur de patch dans les setups.
  // ci-dessous : états AUTH (contexte --storage-state) sauf mention « public ».

  // Menu utilisateur (auth) : a.login-dropdown-a du top-right → .dropdown-menu visible
  'dropdown-user': {
    url: b => `${b}/index.php`,
    setup: async page => {
      const t = page.locator('a.login-dropdown-a, #topmenu-login-dropdown a.dropdown-toggle').first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.click();
      await page.waitForSelector('#topmenu-login-dropdown .dropdown-menu', { state: 'visible', timeout: 15000 });
      await page.waitForFunction(() =>
        /logout|profil|profile/i.test((document.querySelector('#topmenu-login-dropdown .dropdown-menu') || {}).innerText || ''),
      { timeout: 10000 });
    },
  },
  // Onglet « Contacts » de la fiche tiers : la barre .tabs est rendue et
  // l'onglet actif est bien l'onglet Contact/Adresses (les onglets Dolibarr
  // sont des liens pleine page — l'état = la page de l'onglet elle-même).
  'fiche-tab-contacts': {
    url: b => `${b}/societe/contact.php?socid=${S1() || '1'}`,
    setup: async page => {
      await page.waitForSelector('.tabs .tabsElemActive, .tab.tabactive', { state: 'visible', timeout: 15000 });
      await page.waitForFunction(() => {
        const a = document.querySelector('.tabsElemActive a.tab, .tab.tabactive a.tab');
        return a && /contact|address|adresses/i.test(a.innerText);
      }, { timeout: 10000 });
    },
  },
  // Fiche facture VALIDÉE (fixer cycle 57) : surface jamais exercée en v1
  // (le seed laissait la facture en brouillon — « Permission denied »).
  // Preuve : le badge .badge-status1 « Not paid » (DOM vanilla aussi — sélecteur
  // d'état, pas marqueur de patch). Le badge-paid de la facture payée est
  // exercé par la page liste (urls-auth).
  'facture-validee': {
    url: b => `${b}/compta/facture/card.php?facid=${F_VALID() || '1'}`,
    setup: async page => {
      await page.waitForSelector('.badge-status', { state: 'visible', timeout: 15000 });
      await page.waitForFunction(() => {
        const b = document.querySelector('.badge-status1');
        return b && /not paid|unpaid|impay|valid/i.test((b.innerText || '') + ' ' + (b.getAttribute('aria-label') || ''));
      }, { timeout: 10000 });
    },
  },
  // Modale ajax jQuery UI « Validate » sur facture brouillon :
  // bouton .butAction Validate → .ui-dialog + #dialog-confirm visible.
  'modal-validate-facture': {
    url: b => `${b}/compta/facture/card.php?facid=${F_DRAFT() || '2'}`, 
    setup: async page => {
      const t = page.locator('.butAction').filter({ hasText: /valid/i }).first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.click();
      await page.waitForSelector('.ui-dialog', { state: 'visible', timeout: 15000 });
      await page.waitForFunction(() => {
        const d = document.querySelector('#dialog-confirm');
        return d && d.offsetParent !== null && /are you sure/i.test(d.innerText);
      }, { timeout: 10000 });
    },
  },
  // Combobox select2 sur formulaire de création tiers :
  // clic 1er .select2-container → dropdown ouvert (.select2-dropdown visible
  // ou conteneur --open).
  'select2-combo': {
    url: b => `${b}/societe/card.php?action=create`,
    setup: async page => {
      const t = page.locator('.select2-container').first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.click();
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.select2-container--open, .select2-dropdown')]
          .some(e => e.offsetParent !== null || e.classList.contains('select2-container--open')),
      { timeout: 15000 });
    },
  },
  // Mobile 390 : viewport 390x844 — le chrome applicatif (#id-container +
  // .tmenu) reste rendu ; preuve = innerWidth 390 + conteneur présent.
  'mobile-390': {
    url: b => `${b}/index.php`,
    setup: async page => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() =>
        window.innerWidth === 390 && !!document.querySelector('#id-container') && document.querySelectorAll('.tmenu').length > 0,
      { timeout: 15000 });
      await page.waitForTimeout(400);
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
// de hash-router (#/x, #!/x, #$:/x, #x/y). #HelloThere (TiddlyWiki) ressemble à
// une ancre mais est une route : utiliser --keep-hash ou --urls sur ces apps.
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

const LOGIN_PATH = /\/(login|signin|sign-in|sign_in|auth|connexion)\b|\/index\.php(\?|$)/i;

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

  // Garde d'hydratation (leçon 34, adaptée à Dolibarr PHP SSR) : Dolibarr sert des
  // documents server-rendered complets — la garde vérifie que
  // le DOM applicatif est présent (.page/#page-content) et non vide :
  // un scan sur fragment mesurerait un document vide → PASS vacuus.
  // Marqueurs : .page/#page-content (chrome applicatif) ou form (login
  // publique) + du texte réel dans le body.
  // Sur timeout : reloadRetry (autorisé pré-setup / page simple — aucun
  // état interactif à perdre) recharge une fois ; un stall survivant part
  // en ERREUR — un résultat sur body vide n'est pas un PASS.
  const waitHydrated = async (reloadRetry) => {
    const attempt = () =>
      page
        .waitForFunction(
          () => {
            if (!document.querySelector('#id-container, #id-right, form, main, #login-submit-wrapper')) return false;
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

  // Dolibarr PHP : pages pleines — on attend juste que l'URL
  // se stabilise après les éventuelles redirections post-login.
  // Une session expirée est détectée par le rendu du formulaire de login lemmy
  // de connexion en contexte authentifié.
  
  
  const settleSession = async () => {
    try {
      await page.waitForFunction(
        () => document.querySelector('#id-container, #id-right, form, main') !== null,
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

  // En contexte authentifié, la SPA rend le formulaire de login lemmy si la session storageState
  // n'est pas reconnue : sans ce garde, le formulaire de connexion serait scanné
  // à la place de la page demandée — un faux PASS silencieux.
  const assertAuthed = async () => {
    if (!storageState) return;
    if (storageState && await page.evaluate(() => !!document.querySelector('form #username, form input[name="username"]'))) {
      throw new Error('formulaire de connexion Dolibarr (#username) rendu en contexte authentifié — storageState invalide/expiré, scan refusé');
    }
  };

  // Préconditions métier rejouées sur le document courant : --wait-for sur
  // le document FINAL, pas seulement sur le document avant rechargement.
  // skipHydration : pages d'erreur déclarées (expectHttp) — une 404 réelle est
  // une page sans chrome applicatif, le setup de l'état fait foi de montage.
  const applyPreconditions = async ({ hydrationRetry = true, skipHydration = false } = {}) => {
    if (!skipHydration && !(await waitHydrated(hydrationRetry))) {
      throw new Error(
        'contenu non monté (ni .page ni #page-content rendu, ou body sans texte) — scan refusé',
      );
    }
    if (storageState) { if (!skipHydration) await settleSession(); await assertAuthed(); }
    if (waitFor) {
      await page.waitForSelector(waitFor, { state: 'attached', timeout: 15000 }); // précondition : non avalée
    }
    if (waitMs) await page.waitForTimeout(waitMs);
  };

  const auditLocation = async (label, gotoUrl, extraSetup, expectHttp, stateName) => {
    const entry = { url: label, requestedUrl: gotoUrl, violations: [], incomplete: [] };
    if (stateName) entry.state = stateName; // v2 : les sondes lisaient page.state inexistant
    lastNavResponse = null;
    try {
      const resp = await page.goto(gotoUrl, { waitUntil: 'load', timeout: 30000 });
      // En contexte authentifié : la reprise Inferno peut rebondir sur /login
      // puis revenir via prevPath — le jugement de navigation attend la fin de
      // la stabilisation (hydratation + userId + path stable).
      if (storageState) {
        if (!expectHttp) {
          if (!(await waitHydrated(true))) {
            throw new Error(
              'contenu non monté (ni .page ni #page-content rendu, ou body sans texte) — scan refusé',
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
              // scanne un autre document que celui demandé — couvre les
              // erreurs serveur déclenchées par un clic dont le statut
              // HTTP n'est pas observable (ex. '.../server-error').
              entry.error = `le document final diffère du document demandé (${post.finalUrl}) — déclarer l'URL réelle de l'état dans STATES`;
            }
          } catch { /* URL exotique : déjà couvert par les autres contrôles */ }
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
  const wanted = statesArg.includes('all') ? Object.keys(STATES) : statesArg.filter(s => s !== 'none');
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
        // Même race Meteor que pour les pages : rebond sign-in réversible —
        // stabiliser la session avant le setup et avant de juger la nav.
        // État expectHttp (page d'erreur) : pas de chrome à hydrater ni de
        // session SPA à stabiliser — le setup de l'état fait foi.
        if (storageState) {
          if (!st.expectHttp) {
            await waitHydrated(true);
            await settleSession();
          }
          await assertAuthed();
        }
        const nav2 = check(resp2, st.url(origin));
        // Le statut attendu (expectHttp, ex. page 404) n'interrompt pas le setup.
        if (nav2.error && nav2.error !== `HTTP ${st.expectHttp}`) return nav2;
        await st.setup(p);
        const nav3 = check(null, st.url(origin));
        return nav3.error ? nav3 : nav2;
      }, st.expectHttp, name);
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
