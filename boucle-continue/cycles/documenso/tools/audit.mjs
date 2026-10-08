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

// Résolution des deps ancrée sur ce dossier (tools/package.json committé),
// jamais sur le CWD — rejouable depuis n'importe quel répertoire.
const require = createRequire(new URL('./package.json', import.meta.url));
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

const RUNNER_VERSION = 'audit.mjs v11-documenso'; // documenso RR7 : états Radix ([role=dialog/menu]), cmdk, éditeur de champs, flow signature, dark mode

// ids des enregistrements seedés — produits par tools/seed.mjs (seed-info.json).
// En l'absence du fichier les états pointant un enregistrement échouent honnêtement.
let SEED = {};
try { SEED = JSON.parse(readFileSync(process.env.SEED_INFO ? resolve(process.cwd(), process.env.SEED_INFO) : new URL('./seed-info.json', import.meta.url), 'utf8')); } catch { /* non seedé */ }

/**
 * États dynamiques audités via --states all | nom1,nom2. Le scan axe tourne
 * APRÈS `setup`, sur le DOM résultant — c'est ce qui couvre les composants
 * invisibles au chargement (modale, drawer, toast, onglet, section dépliée),
 * angle mort d'un audit route-par-route. `url(b)` reçoit l'origine de base.
 *
 * documenso/RR7 : chaque état porte `auth: true|false` — le contexte
 * (storageState) dans lequel il peut s'exécuter. `--states all` exécute tous
 * les états du contexte courant ; demander un état dans le mauvais contexte
 * est une erreur de config (FAIL bruyant, leçon 45 — jamais de skip muet).
 * Chaque setup finit par une preuve d'état (waitForSelector sur un élément
 * exclusif du widget — leçons 32/34). Radix monte les overlays dans un portal
 * ([role=dialog/menu/listbox]) — jamais d'assertion sur un id radix généré.
 */
const TEAM = SEED?.team?.url || '';
const DRAFT_ID = SEED?.documents?.draft?.id || '';
const TOK1 = SEED?.documents?.pending?.recipients?.[0]?.token || '';

export const STATES = {
  // ================= contexte AUTHENTIFIÉ =================
  'search-command-menu': {
    auth: true,
    url: (b) => `${b}/t/${TEAM}/documents`,
    setup: async (page) => {
      const t = page.locator('button', { hasText: 'Search' }).first();
      await t.waitFor({ state: 'visible', timeout: 45000 });
      await t.click();
      // preuve : palette cmdk ouverte — input + entrées exclusives.
      await page.waitForSelector('[role="dialog"] input', { state: 'visible', timeout: 15000 });
      await page.waitForSelector('[role="dialog"] :text("All documents"), [role="dialog"] :text("Settings")', { state: 'visible', timeout: 15000 });
    },
  },
  'team-switcher-menu': {
    auth: true,
    url: (b) => `${b}/t/${TEAM}/documents`,
    setup: async (page) => {
      const t = page.locator('button[aria-haspopup="menu"]', { hasText: 'Personal Team' }).first();
      await t.waitFor({ state: 'visible', timeout: 45000 });
      await t.click();
      // preuve : menu Radix ouvert avec entrées exclusives (org/team/settings).
      await page.waitForSelector('[role="menu"] [role="menuitem"]', { state: 'visible', timeout: 15000 });
      await page.waitForSelector('[role="menu"] :text("Settings"), [role="menu"] :text("Inbox")', { state: 'visible', timeout: 15000 });
    },
  },
  'create-folder-dialog': {
    auth: true,
    url: (b) => `${b}/t/${TEAM}/documents`,
    setup: async (page) => {
      const t = page.locator('button', { hasText: 'Create Folder' }).first();
      await t.waitFor({ state: 'visible', timeout: 45000 });
      await t.click();
      // preuve : dialogue « Create New Folder » avec le champ exclusif.
      await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 });
      await page.waitForSelector('[role="dialog"] :text("Folder Name"), [role="dialog"] input', { state: 'visible', timeout: 15000 });
    },
  },
  'status-filter-popover': {
    auth: true,
    url: (b) => `${b}/t/${TEAM}/documents`,
    setup: async (page) => {
      const t = page.locator('button', { hasText: 'Status' }).first();
      await t.waitFor({ state: 'visible', timeout: 45000 });
      await t.click();
      // preuve : listbox de statuts — « Pending » exclusif.
      await page.waitForSelector('[role="listbox"]', { state: 'visible', timeout: 15000 });
      await page.waitForSelector('[role="listbox"] :text("Pending"), [role="listbox"] :text("Draft")', { state: 'visible', timeout: 15000 });
    },
  },
  'row-actions-menu': {
    auth: true,
    url: (b) => `${b}/t/${TEAM}/documents`,
    setup: async (page) => {
      // dernière ligne du tableau → bouton ⋯ (aria-haspopup=menu sans texte).
      const t = page.locator('table button[aria-haspopup="menu"]').last();
      await t.waitFor({ state: 'visible', timeout: 45000 });
      await t.click();
      // preuve : menu d'actions de ligne — « Edit » exclusif.
      await page.waitForSelector('[role="menu"] [role="menuitem"]', { state: 'visible', timeout: 15000 });
      await page.waitForSelector('[role="menu"] :text("Edit"), [role="menu"] :text("Delete")', { state: 'visible', timeout: 15000 });
    },
  },
  'editor-fields-step': {
    auth: true,
    url: (b) => `${b}/t/${TEAM}/documents/${DRAFT_ID}/edit`,
    setup: async (page) => {
      // étape 2 de l'assistant éditeur — la palette de champs (drag&drop).
      const t = page.locator('button', { hasText: 'Add Fields' }).first();
      await t.waitFor({ state: 'visible', timeout: 60000 });
      await t.click();
      // preuve : « Step 2/3 » + boutons de types de champ exclusifs.
      await page.waitForSelector(':text("Step 2/3")', { state: 'visible', timeout: 30000 });
      await page.waitForSelector('button:has-text("Signature"), button:has-text("Initials")', { state: 'visible', timeout: 15000 });
    },
  },
  'editor-settings-dialog': {
    auth: true,
    url: (b) => `${b}/t/${TEAM}/documents/${DRAFT_ID}/edit`,
    setup: async (page) => {
      const t = page.locator('button', { hasText: 'Document Settings' }).first();
      await t.waitFor({ state: 'visible', timeout: 60000 });
      await t.click();
      // preuve : dialogue paramètres — onglets « Reminders »/« Security ».
      await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 });
      await page.waitForSelector('[role="dialog"] :text("Reminders"), [role="dialog"] :text("Configure document settings")', { state: 'visible', timeout: 15000 });
    },
  },
  'mobile-documents-390': {
    auth: true,
    url: (b) => `${b}/t/${TEAM}/documents`,
    setup: async (page) => {
      await page.setViewportSize({ width: 390, height: 844 });
      // preuve déterministe : reflow réel (largeur appliquée) + contenu monté.
      await page.waitForFunction(() => window.innerWidth === 390, { timeout: 5000 });
      await page.waitForSelector('main, [role="main"]', { state: 'visible', timeout: 30000 });
      await page.waitForTimeout(700);
    },
  },
  'dark-documents': {
    auth: true,
    url: (b) => `${b}/t/${TEAM}/documents`,
    setup: async (page) => {
      // remix-themes calcule le thème au chargement (script inline), pas
      // réactivement : emulateMedia puis RELOAD, sinon html garde .light.
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.reload({ waitUntil: 'load', timeout: 60000 });
      await page.waitForSelector('main, [role="main"]', { state: 'visible', timeout: 45000 });
      await page.waitForFunction(() => {
        const el = document.documentElement;
        if (el.classList.contains('dark') || el.dataset.theme === 'dark') return true;
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g);
        return m && Number(m[0]) + Number(m[1]) + Number(m[2]) < 240;
      }, undefined, { timeout: 20000 });
      await page.waitForTimeout(400);
    },
  },

  // ================= contexte PUBLIC =================
  'sign-field-dialog': {
    auth: false,
    url: (b) => `${b}/sign/${TOK1}`,
    setup: async (page) => {
      // Le dialogue d'adoption de signature s'ouvre au clic sur le champ
      // (overlay absolu au-dessus du PDF), pas via « Next Field ».
      const f = page.locator('button.absolute.inset-0, [role="button"].absolute').first();
      await f.waitFor({ state: 'visible', timeout: 60000 });
      await f.click();
      // preuve : dialogue avec onglets Draw/Type/Upload exclusifs.
      await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 });
      await page.waitForSelector('[role="dialog"] [role="tab"]:has-text("Draw"), [role="dialog"] [role="tab"]:has-text("Type")', { state: 'visible', timeout: 15000 });
    },
  },
  'sign-reject-dialog': {
    auth: false,
    url: (b) => `${b}/sign/${TOK1}`,
    setup: async (page) => {
      const t = page.locator('button', { hasText: 'Reject Document' }).first();
      await t.waitFor({ state: 'visible', timeout: 60000 });
      await t.click();
      // preuve : dialogue de confirmation de rejet exclusif.
      await page.waitForSelector('[role="dialog"], [role="alertdialog"]', { state: 'visible', timeout: 15000 });
      await page.waitForSelector(':text("Are you sure you want to reject"), [role="dialog"] :text("Cancel")', { state: 'visible', timeout: 15000 });
    },
  },
  'mobile-signin-390': {
    auth: false,
    url: (b) => `${b}/signin`,
    setup: async (page) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() => window.innerWidth === 390, { timeout: 5000 });
      await page.waitForSelector('input[name="email"]', { state: 'visible', timeout: 30000 });
      await page.waitForTimeout(500);
    },
  },
  'dark-signin': {
    auth: false,
    url: (b) => `${b}/signin`,
    setup: async (page) => {
      // remix-themes calcule le thème au chargement : emulateMedia puis RELOAD.
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.reload({ waitUntil: 'load', timeout: 60000 });
      await page.waitForSelector('input[name="email"]', { state: 'visible', timeout: 45000 });
      await page.waitForFunction(() => {
        const el = document.documentElement;
        if (el.classList.contains('dark') || el.dataset.theme === 'dark') return true;
        const bg = getComputedStyle(document.body).backgroundColor;
        const m = bg.match(/\d+/g);
        return m && Number(m[0]) + Number(m[1]) + Number(m[2]) < 240;
      }, undefined, { timeout: 20000 });
      await page.waitForTimeout(400);
    },
  },
};

// États vs contexte : chaque état déclare `auth` — le demander sans
// storageState (ou l'inverse) est une erreur de config BRUYANTE, jamais un skip.
for (const name of statesArg.filter((s) => s !== 'all' && s !== 'none' && s in STATES)) {
  const needsAuth = STATES[name].auth === true;
  if (needsAuth && !storageState) configErrors.push(`état '${name}' exige le contexte authentifié (--storage-state)`);
  if (STATES[name].auth === false && storageState) configErrors.push(`état '${name}' exige le contexte public (pas de --storage-state)`);
}
// ids seed manquants : les états qui en dépendent échouent honnêtement au setup.
if (!TEAM && statesArg.some((s) => s === 'all' || (s in STATES && STATES[s].auth))) {
  configErrors.push('seed-info.json absent/incomplet : team.url requis pour les états authentifiés');
}

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
      await page.goto(url, { waitUntil: "load", timeout: 60000 });
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

  // Garde d'hydratation (leçon 34, adaptée à documenso/React Router 7) : les
  // routes montent React après un SSR — un scan avant montage mesurerait un
  // document vide → fausses violations ou PASS vacuus. Marqueurs : contenu
  // réel monté (main/nav/heading/form/boutons, canvas PDF pour le viewer) +
  // texte visible > 20 caractères.
  // Sur timeout : reloadRetry (autorisé pré-setup / page simple — aucun
  // état interactif à perdre) recharge une fois ; un stall survivant part
  // en ERREUR — un résultat sur body vide n'est pas un PASS.
  const waitHydrated = async (reloadRetry) => {
    const attempt = () =>
      page
        .waitForFunction(
          () => {
            if (!document.querySelector('main > *, main, [role="main"], form input, nav a, h1, h2, h3, button, canvas, [role="dialog"]')) return false;
            const t = (document.body.innerText || '').trim();
            return t.length > 20;
          },
          { timeout: 45000, polling: 100 },
        )
        .then(() => true, () => false);
    if (await attempt()) return true;
    if (!reloadRetry) return false;
    try {
      await page.reload({ waitUntil: "load", timeout: 60000 });
    } catch {
      /* reload échoué : l'attente qui suit tranche */
    }
    return attempt();
  };

  // documenso : après goto, la session storageState est posée côté serveur
  // (cookie) — un utilisateur non authentifié rebondit sur /signin. On attend
  // le montage React puis la stabilité d'URL avant de juger la navigation.
  const settleEspoSession = async () => {
    try {
      await page.waitForFunction(
        () => document.querySelector('main, form input[name="email"], h1, nav, [role="main"]') !== null,
        { timeout: 30000, polling: 150 },
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

  // En contexte authentifié, documenso redirige vers /signin si la session
  // n'est pas reconnue : sans ce garde, le formulaire de connexion serait
  // scanné à la place de la page demandée — un faux PASS.
  const assertAuthed = async () => {
    if (!storageState) return;
    const onSignin = await page.evaluate(() =>
      /^\/(signin|signup)/.test(location.pathname) && !!document.querySelector('input[name="password"], input[name="email"]'),
    );
    if (onSignin) {
      throw new Error('formulaire de connexion rendu en contexte authentifié — storageState invalide/expiré, scan refusé');
    }
  };

  // Préconditions métier rejouées sur le document courant : --wait-for sur
  // le document FINAL, pas seulement sur le document avant rechargement.
  const applyPreconditions = async ({ hydrationRetry = true } = {}) => {
    if (!(await waitHydrated(hydrationRetry))) {
      throw new Error(
        'contenu non monté (ni #navbar .navbar ni #login ni #content rendu, ou body sans texte) — scan refusé',
      );
    }
    if (storageState) { await settleEspoSession(); await assertAuthed(); }
    if (waitFor) {
      await page.waitForSelector(waitFor, { state: 'attached', timeout: 15000 }); // précondition : non avalée
    }
    if (waitMs) await page.waitForTimeout(waitMs);
  };

  const auditLocation = async (label, gotoUrl, extraSetup, expectHttp) => {
    const entry = { url: label, requestedUrl: gotoUrl, violations: [], incomplete: [] };
    lastNavResponse = null;
    try {
      const resp = await page.goto(gotoUrl, { waitUntil: "load", timeout: 90000 });
      // En contexte authentifié : la reprise Meteor peut rebondir sur /sign-in
      // puis revenir via prevPath — le jugement de navigation attend la fin de
      // la stabilisation (hydratation + userId + path stable).
      if (storageState) {
        if (!(await waitHydrated(true))) {
          throw new Error(
            'contenu non monté (ni #navbar .navbar ni #login ni #content rendu, ou body sans texte) — scan refusé',
          );
        }
        await settleEspoSession();
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

  // États dynamiques : chaque état repart d'un document neuf. `--states all`
  // = tous les états du CONTEXTE courant (auth si storageState, sinon public) —
  // la carte est partitionnée par `auth`, un état hors contexte demandé en
  // liste explicite était déjà rejeté en erreur de config plus haut.
  const wanted = statesArg.includes('all')
    ? Object.keys(STATES).filter((s) => (STATES[s].auth === true) === Boolean(storageState))
    : statesArg.filter(s => s !== 'none');
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
        const resp2 = await p.goto(st.url(origin), { waitUntil: "load", timeout: 90000 });
        // Même race Meteor que pour les pages : rebond sign-in réversible —
        // stabiliser la session avant le setup et avant de juger la nav.
        if (storageState) {
          await waitHydrated(true);
          await settleEspoSession();
          await assertAuthed();
        }
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
