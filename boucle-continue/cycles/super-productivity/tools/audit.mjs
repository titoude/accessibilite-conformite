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
import { resolve } from 'node:path';

// Résolution des deps depuis le projet appelant (CWD), pas depuis ce script.
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const VALUE_OPTIONS = new Set(['out', 'max', 'wait', 'wait-for', 'urls', 'depth', 'states', 'storage-state', 'profile']);
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
// --profile <dir> : contexte Playwright PERSISTANT (IndexedDB incluse) —
// indispensable pour super-productivity (offline-first, données = op-log IDB).
const profileDir = opt('profile', null);

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

const RUNNER_VERSION = 'audit.mjs v10-sup'; // v10-espo → super-productivity 19.1.0 : SPA Angular hash-router (#/…), offline-first IndexedDB (SUP_OPS), profil Playwright persistant, états SP

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
export const STATES = {
  // super-productivity 19.1.0 — SPA Angular, hash-router (#/…), offline-first.
  // Chaque setup finit par une preuve d'état (leçons 32/34). Ids seedés lus
  // dans seed-info.json (seed.projects['audit-alpha'], seed.tags['audit-urgent']…).

  // ---------- tâches ----------
  'task-detail-panel': {
    url: b => `${b}/#/tag/TODAY/tasks`,
    setup: async page => {
      const t = page.locator('task').first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.scrollIntoViewIfNeeded();
      await t.hover();
      const d = t.locator('.show-additional-info-btn').first();
      await d.waitFor({ state: 'visible', timeout: 10000 });
      await d.click();
      // preuve : panneau de détail monté (drawer droit ou inline)
      await page.waitForSelector('task-detail-panel, .right-panel, mat-drawer-container mat-drawer.mat-drawer-opened', { state: 'visible', timeout: 15000 });
    },
  },
  'task-context-menu': {
    url: b => `${b}/#/tag/TODAY/tasks`,
    setup: async page => {
      const t = page.locator('task').first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.scrollIntoViewIfNeeded();
      await t.click({ button: 'right' });
      await page.waitForSelector('.mat-mdc-menu-panel', { state: 'visible', timeout: 15000 });
      await page.waitForSelector('.mat-mdc-menu-item', { state: 'attached', timeout: 15000 });
      await page.waitForTimeout(500); // animation d'entrée du menu (faux visible→invisible sinon)
    },
  },
  'task-done-toggle': {
    url: b => `${b}/#/project/${SEED.projects?.['audit-alpha'] || 'missing-seed'}/tasks`,
    setup: async page => {
      const t = page.locator('task').first();
      await t.waitFor({ state: 'visible', timeout: 30000 });
      await t.scrollIntoViewIfNeeded();
      const wasDone = await t.evaluate(el => el.classList.contains('isDone'));
      await t.hover({ position: { x: 20, y: 20 } });
      const btn = t.locator('done-toggle').first();
      await btn.waitFor({ state: 'visible', timeout: 10000 });
      await btn.click();
      // preuve : la tâche a basculé (état fait OU défait — rejeu idempotent)
      await page.waitForFunction(was =>
        [...document.querySelectorAll('task')].some(el => el.classList.contains('isDone') !== was),
      wasDone, { timeout: 15000 });
    },
  },

  // ---------- navigation ----------
  'nav-item-kebab-menu': {
    url: b => `${b}/#/tag/TODAY/tasks`,
    setup: async page => {
      const item = page.locator('magic-side-nav nav-item').filter({ hasText: 'Today' }).first();
      await item.hover();
      const k = item.locator('button.additional-btn').first();
      await k.waitFor({ state: 'visible', timeout: 15000 });
      await k.click();
      await page.waitForSelector('.mat-mdc-menu-panel .mat-mdc-menu-item', { state: 'visible', timeout: 15000 });
    },
  },
  'create-project-dialog': {
    url: b => `${b}/#/tag/TODAY/tasks`,
    setup: async page => {
      const hdr = page.locator('.g-multi-btn-wrapper').filter({ hasText: 'Projects' }).first();
      await hdr.hover();
      const btn = hdr.locator('button.additional-btn').last();
      await btn.waitFor({ state: 'visible', timeout: 15000 });
      await btn.click();
      await page.waitForSelector('mat-dialog-container input', { state: 'visible', timeout: 15000 });
    },
  },
  'add-task-bar-open': {
    url: b => `${b}/#/tag/TODAY/tasks`,
    setup: async page => {
      const btn = page.locator('.tour-addBtn').first();
      await btn.waitFor({ state: 'visible', timeout: 30000 });
      await btn.click();
      await page.waitForSelector('add-task-bar.global .main-input', { state: 'visible', timeout: 15000 });
    },
  },

  // ---------- panneaux ----------
  'notes-panel': {
    url: b => `${b}/#/project/${SEED.projects?.['audit-alpha'] || 'missing-seed'}/tasks`,
    setup: async page => {
      const btn = page.locator('.e2e-toggle-notes-btn, mobile-bottom-nav .e2e-toggle-notes-btn').first();
      await btn.waitFor({ state: 'visible', timeout: 30000 });
      await btn.click();
      await page.waitForSelector('notes, .notes-panel, mat-drawer-container .mat-drawer-opened, .right-panel', { state: 'visible', timeout: 15000 });
    },
  },

  // ---------- mobile 390 ----------
  'mobile-nav-390': {
    url: b => `${b}/#/tag/TODAY/tasks`,
    setup: async page => {
      await page.setViewportSize({ width: 390, height: 800 });
      await page.waitForTimeout(800);
      // preuve : la bottom-nav mobile est montée (chrome mobile)
      await page.waitForSelector('mobile-bottom-nav', { state: 'visible', timeout: 15000 });
    },
  },
  'mobile-menu-open-390': {
    url: b => `${b}/#/tag/TODAY/tasks`,
    setup: async page => {
      await page.setViewportSize({ width: 390, height: 800 });
      await page.waitForTimeout(800);
      // « Side Panel Menu » de la bottom-nav mobile → mat-menu (déterministe)
      const btn = page.locator('mobile-bottom-nav button[aria-label="Side Panel Menu"]');
      await btn.waitFor({ state: 'visible', timeout: 15000 });
      await btn.click();
      await page.waitForSelector('.mat-mdc-menu-panel', { state: 'visible', timeout: 15000 });
      await page.waitForSelector('.mat-mdc-menu-item', { state: 'attached', timeout: 15000 });
    },
  },
  'mobile-add-task-390': {
    url: b => `${b}/#/tag/TODAY/tasks`,
    setup: async page => {
      await page.setViewportSize({ width: 390, height: 800 });
      await page.waitForTimeout(800);
      // FAB « Add new task » de la bottom-nav mobile → barre d'ajout plein écran
      const btn = page.locator('mobile-bottom-nav button[aria-label="Add new task"]');
      await btn.waitFor({ state: 'visible', timeout: 15000 });
      await btn.click();
      await page.waitForSelector('add-task-bar .main-input', { state: 'visible', timeout: 15000 });
    },
  },

  // ---------- config ----------
  'config-section-open': {
    url: b => `${b}/#/config`,
    setup: async page => {
      // ouvre une section repliable de la page settings (mat-expansion-panel)
      // ouvre une section repliable : <collapsible> → header .collapsible-header
      const hdr = page.locator('config-section collapsible .collapsible-header').first();
      await hdr.waitFor({ state: 'visible', timeout: 30000 });
      await hdr.click();
      await page.waitForSelector('config-section collapsible .collapsible-panel', { state: 'visible', timeout: 15000 });
      // preuve de contenu : un champ de formulaire rendu dans le panneau ouvert
      await page.waitForSelector('config-section collapsible .collapsible-panel .formly-field, config-section collapsible .collapsible-panel input, config-section collapsible .collapsible-panel mat-form-field', { state: 'attached', timeout: 15000 });
    },
  },

  // ---------- recherche ----------
  'search-results': {
    url: b => `${b}/#/search`,
    setup: async page => {
      const inp = page.locator('.search-page input, .search-field input, input[matinput]').first();
      await inp.waitFor({ state: 'visible', timeout: 30000 });
      await inp.fill('spec');
      await inp.dispatchEvent('input');
      // preuve : un résultat ou l'état « aucun résultat » rendu dans .search-results
      await page.waitForFunction(() => {
        const w = document.querySelector('.search-results');
        return w && (w.querySelector('mat-list-item') || w.querySelector('.no-results, .search-prompt'))
      }, { timeout: 15000 });
    },
  },

  // ---------- état d'erreur ----------
  'route-404': {
    url: b => `${b}/#/no/such/route`,
    setup: async page => {
      // catchall → TagTaskPageComponent : la page se monte (fallback deterministic)
      await page.waitForSelector('.route-wrapper', { timeout: 30000 });
      await page.waitForFunction(() => (document.body.innerText || '').trim().length > 20, { timeout: 30000 });
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

  let browser = null;
  let context;
  if (profileDir) {
    // Profil persistant : la donnée de l'app vit en IndexedDB (SUP_OPS) —
    // un storageState (localStorage/cookies) n'y suffit pas.
    context = await chromium.launchPersistentContext(profileDir, { locale: 'en-US' });
    browser = context.browser();
  } else {
    browser = await chromium.launch();
    context = await browser.newContext({ locale: 'en-US', ...(storageState ? { storageState } : {}) });
  }
  const page = await context.newPage();
  // drapeaux d'onboarding : l'app saute le tour/preset au premier démarrage
  await context.addInitScript(() => {
    try {
      for (const k of ['SUP_ONBOARDING_PRESET_DONE', 'SUP_ONBOARDING_HINTS_DONE', 'SUP_IS_SHOW_TOUR', 'SUP_EXAMPLE_TASKS_CREATED']) {
        localStorage.setItem(k, 'true');
      }
    } catch {}
  });

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

  // Garde d'hydratation (leçon 34, adaptée à SP/Angular) : la SPA sert un
  // index minimal puis monte les routes côté client. Un scan avant montage
  // mesurerait un document vide → PASS vacuus. Marqueurs : `.route-wrapper`
  // (conteneur de route monté) + side-nav rendue + du texte réel dans le body.
  // Sur timeout : reloadRetry recharge une fois ; un stall survivant part
  // en ERREUR — un résultat sur body vide n'est pas un PASS.
  const waitHydrated = async (reloadRetry) => {
    const attempt = () =>
      page
        .waitForFunction(
          () => {
            if (!document.querySelector('.route-wrapper')) return false;
            if (!document.querySelector('magic-side-nav, .main-content, .header-wrapper')) return false;
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

  // SP : pas d'auth — la session est le profil persistant. Le hash (route)
  // peut se stabiliser après 'load' (guardes Angular : DefaultStartPageGuard
  // redirige '/' → '#/tag/TODAY/tasks'). On attend que l'URL soit stable.
  const settleRoute = async () => {
    try {
      await page.waitForFunction(() => document.querySelector('.route-wrapper') !== null, { timeout: 20000, polling: 150 });
    } catch { /* app non montée : checkNav/waitHydrated trancheront */ }
    let last = page.url();
    for (let i = 0; i < 40; i++) {
      await page.waitForTimeout(150);
      const cur = page.url();
      if (cur === last) return;
      last = cur;
    }
  };

  // Préconditions métier rejouées sur le document courant : --wait-for sur
  // le document FINAL, pas seulement sur le document avant rechargement.
  const applyPreconditions = async ({ hydrationRetry = true } = {}) => {
    if (!(await waitHydrated(hydrationRetry))) {
      throw new Error(
        'contenu non monté (.route-wrapper absent, side-nav absente, ou body sans texte) — scan refusé',
      );
    }
    await settleRoute();
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
      // Hash-router : la route se stabilise après 'load' (guards Angular) —
      // on attend la fin de la stabilisation avant de juger la navigation.
      if (!(await waitHydrated(true))) {
        throw new Error(
          'contenu non monté (.route-wrapper absent, side-nav absente, ou body sans texte) — scan refusé',
        );
      }
      await settleRoute();
      const nav = checkNav(resp, gotoUrl);
      entry.httpStatus = nav.httpStatus;
      entry.finalUrl = nav.finalUrl;
      entry.error = nav.error;
      // État d'erreur déclaré (expectHttp) : le statut attendu n'est pas un
      // échec — le scan court sur la vraie page d'erreur.
      if (expectHttp && entry.error === `HTTP ${expectHttp}`) entry.error = null;
      if (!entry.error) {
        await applyPreconditions();
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
            await applyPreconditions({ hydrationRetry: false });
          } catch (e1) {
            if (!/contenu non monté/.test(e1.message)) throw e1;
            const nav3 = await extraSetup(page, checkNav);
            if (nav3) {
              entry.httpStatus = nav3.httpStatus ?? entry.httpStatus;
              entry.finalUrl = nav3.finalUrl;
              if (nav3.error) entry.error = nav3.error;
              if (expectHttp && entry.error === `HTTP ${expectHttp}`) entry.error = null;
            }
            if (!entry.error) await applyPreconditions({ hydrationRetry: false });
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
        // hash-router : stabiliser la route avant le setup et avant le jugement
        await waitHydrated(true);
        await settleRoute();
        const nav2 = check(resp2, st.url(origin));
        // Le statut attendu (expectHttp, ex. page 404) n'interrompt pas le setup.
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
