You are a benchmark worker session (arm: WITH-SKILL). You perform a bounded
accessibility remediation on a public open-source web app, using the
methodology and tooling provided inline below. Work only with what is provided
in this prompt.

## ISOLATION RULES (mandatory)

- Work ONLY on the target below. Do NOT visit, clone, or read
  github.com/titoude/accessibilite-conformite or any other benchmark
  repository. Do NOT search for existing accessibility patches, PRs, audit
  results, or prior benchmark data for the target — prior work exists and
  must not contaminate this measurement.
- Do NOT push to any remote, open pull requests, or change repository
  settings. Everything stays local and is returned via your structured
  output.
- Do NOT modify the audit runner, the URL/scope list, or test data. Never
  disable rules or delete functionality to make violations disappear.

## TARGET

- Repository: https://github.com/benbusby/whoogle-search
- Commit (pin exactly, not HEAD): 0543f86528678ab60a20b3049483975add6b6e40
- Stack: Python 3.10 + Flask + Jinja templates.

## ENVIRONMENT SETUP (pinned — do not substitute versions)

```bash
# Node.js v20.18.1 if absent:
curl -fsSLO https://nodejs.org/dist/v20.18.1/node-v20.18.1-linux-x64.tar.xz
tar -xf node-v20.18.1-linux-x64.tar.xz
export PATH="$PWD/node-v20.18.1-linux-x64/bin:$PATH"

git clone https://github.com/benbusby/whoogle-search
cd whoogle-search && git checkout 0543f86528678ab60a20b3049483975add6b6e40
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt

# Tooling goes OUTSIDE the clone so the source patch stays clean:
mkdir -p ~/a11y-tools && cd ~/a11y-tools
npm init -y && npm i -D playwright@1.63.0 @playwright/test@1.63.0 axe-core@4.13.0 --no-audit --no-fund
npx playwright install chromium
# write the audit runner provided below to ~/a11y-tools/audit.mjs
```

Boot the app (exactly this; WHOOGLE_CSP=0 is required so axe can be injected —
it is a benchmark deviation, record it in provenance):

```bash
cd whoogle-search
WHOOGLE_CSP=0 .venv/bin/python -um app --host 127.0.0.1 --port 5001 &
# wait until GET / returns 200
```

## FROZEN SCOPE (fixed — do not extend or shrink)

Routes (audit):
  / , /search.html , /search?q=test , /window?location=https://example.com
Dynamic state (already declared in the runner's STATES map):
  config-panel on /  (click #config-collapsible, wait for .content.open)
Data: search query "test"; window location https://example.com. No auth.
Default theme. Anonymous role only.

Audit command (run from ~/a11y-tools):
```bash
node audit.mjs http://127.0.0.1:5001 \
  --urls /,/search.html,/search?q=test,/window?location=https://example.com \
  --states all --out <outdir>
```

## BUDGET

- Max 3 correction -> re-audit rounds. Correction budget: 20 minutes of
  fix work (excluding setup/boot). Stop honestly at budget: report partial
  status instead of forcing "done".

## OUTPUT CONTRACT (structured output — everything as text, no attachments)

- commit_sha (string): the commit you actually checked out
- booted (boolean)
- patch_diff (string): COMPLETE `git -C whoogle-search diff` output of tracked
  source changes only. If npm/pip touched package.json/lockfiles inside the
  clone, exclude them: `git diff -- ':!package.json' ':!package-lock.json'`.
- patch_sha256 (string): sha256 hex of that patch text
- files_changed (string[]): repo-relative paths changed
- baseline_summary_json (string): compact JSON {pageUrl: {ruleId: nodeCount}}
  computed from YOUR baseline report.json
- final_summary_json (string): same shape from YOUR final report.json
- final_scope_json (string): verbatim content of your final scope.json
- provenance_json (string): {node, npm, playwright, axe_core, python, browser,
  boot_env, timestamps{start,end}}
- rounds (integer): correction->verification rounds actually used
- correction_minutes (number): minutes of fix work (exclude setup/boot)
- install_build (string): "pass" | "fail:<reason>" | "skipped:<reason>" — fresh
  venv install + pytest suite result
- coverage_gaps (string[]): routes/states expected but not audited
- failure (string or null): null, or
  "unrunnable|rounds_exhausted|verifier_loop|partial|blocked|review_required"
- notes (string): honest caveats — anything you could not verify

## YOUR METHODOLOGY AND TOOLING (verbatim)

Follow the protocol in SKILL.md exactly. The audit runner is provided as
file content — write it verbatim to ~/a11y-tools/audit.mjs (do not edit it).
assertions.mjs and checklist.md are provided for your own verification scripts
and manual checklist.

===BEGIN FILE SKILL.md===
---
name: accessibilite-conformite
description: Audit and remediate website and web-application accessibility in source code, using a frozen scope, independent verification and explicit human-review gaps. Use for WCAG or RGAA web work; automated scans alone do not establish conformance.
---

# Accessibility remediation with evidence

Improve the requested application's accessibility while preserving its content and functions. Target WCAG 2.2 A/AA for web content unless the user specifies otherwise. RGAA, jurisdictional obligations, native software and documents require their own applicable methods.

Use [audit.mjs](audit.mjs) for scans and [checklist.md](checklist.md) for checks beyond automation. Do not infer universal accessibility, legal compliance or screen-reader compatibility from a score or agent verdict.

## Freeze the scope first

- Verify the exact repository, branch and commit. Preserve concurrent work. This skill does not grant permission for deployments, production mutations, messages or unrelated changes.
- Identify complete user tasks, including error paths.
- Freeze a manifest of routes, states, roles, data, language, theme, viewport, expected outcomes and tool versions.
- Configure dynamic `STATES` before the baseline, or use `--states none` explicitly when there are none in scope. Crawling does not discover every screen.
- Keep credentials and browser authentication state out of Git and public artifacts.
- Use locked tools and the project's approved installation procedure. The toolkit uses `pnpm install --frozen-lockfile --ignore-scripts` followed by an explicit Chromium installation. Do not migrate a target project's package manager merely to audit it.

## Baseline

From this toolkit directory, with the authorized application running:

```sh
node audit.mjs http://localhost:3000 --states none --out a11y-audit/baseline
```

For dynamic states, use an application-specific runner copy with the function-based `STATES` example in [README.md](README.md), freeze it, and use `--states all`. Add explicit routes with `--urls`, authorized authentication with `--storage-state`, and hash routing with `--keep-hash` when needed.

Preserve baseline reports, manifest and application commit. Missing controls, wrong documents, timeouts and failed preconditions are coverage failures, never clean results.

## Correction rules

1. **Change source, preserve functionality.** No overlays, hidden content, removed features, disabled audit rules or altered test data to improve the score.
2. **Prefer native HTML.** Use semantic controls before adding ARIA.
3. **Separate mechanical and semantic changes.** Connecting an existing label differs from inventing a meaningful alternative; record context and uncertainty for the latter.
4. **Empty image alternatives need evidence.** Use `alt=""` only for decorative or redundant information with a documented reason.
5. **Fix shared causes.** Repair the responsible component or token and check affected uses while preserving product intent.
6. **Test observable effects.** A click, attribute or nonzero viewport is not a completed user task. Assert the exact state, name, focus and business outcome.
7. **Required actions fail visibly.** Never swallow missing-element errors or return success from an exception.
8. **Verify the exact accessible name.** Use `accNameMatches` from [assertions.mjs](tests-validateurs/assertions.mjs), backed by Playwright's matcher. The legacy `accName` snapshot extractor is diagnostic only.
9. **Exercise complete keyboard tasks.** Check order, visible focus, errors and transitions. Roving `tabindex="-1"` is legitimate inside correctly implemented composites.
10. **Check dialog behavior precisely.** Initial focus, inert background, closure and focus return matter. Escaping focus and an inescapable keyboard trap are different defects.
11. **Dragging needs a single-pointer alternative** when WCAG 2.5.7 applies; keyboard access alone is insufficient.
12. **Reflow preserves content.** Check 320 CSS-pixel equivalent width, text resizing and real browser zoom. Respect legitimate two-dimensional content exceptions. Resizing a viewport does not prove browser zoom.
13. **Adapt the test harness, not product timing.** Do not change polling, networking or animations just to satisfy a wait.
14. **Re-scan the delivered build.** Browser-only DOM edits are not fixes. Compare scenario identities and state-definition hashes, not counts alone.
15. **Bound the loop.** Default to three correction/verification rounds. Stop on no progress and preserve partial work. Repairs after final evaluation count as additional rounds.
16. **Keep uncertainty visible.** Group axe incompletes by rule and scenario with a documented decision and evidence; unreviewed items stay open.
17. **Separate correction from acceptance.** A distinct reviewer replays the work. Reconcile its verdict with measured counters, patch identity, build and scope; reject contradictions.

## Independent verification

Check out the exact candidate commit, install from its lockfile, build and replay the frozen manifest. Verify that expected content and interactions remain present.

Use the supplied helpers instead of rewriting permissive assertions. They require the toolkit's pinned `@playwright/test`. `isTrulyVisible` checks CSS visibility and opacity; inspect occlusion, clipping and context separately.

Record deterministic tests, agent semantic judgments and actual human assistive-technology tests separately using [checklist.md](checklist.md). A browser automation run is not an NVDA or VoiceOver test.

The final evaluator must be separate from the operational verifier and exercise held-out tasks or tests. Do not expose expected fixes to the corrector. If independent execution is unavailable, record `NOT_TESTED`.

## Evidence and delivery

For every relevant criterion or task record the standard/version, page/state/role, method, expected and observed behavior, evidence path, commit/environment and outcome:

- `PASS`: demonstrated by an appropriate method.
- `FAIL`: a demonstrated unmet requirement.
- `NOT_APPLICABLE`: a documented applicability decision.
- `NOT_TESTED`: no completed evaluation.
- `NEEDS_HUMAN_REVIEW`: judgment or assistive-technology testing still required.

Keep sanitized patch files, baseline/final reports and scopes, manifest/state definitions, versions, runnable test commands, build results and the human-review ledger together.

An automated pass means no detected violations or execution errors within the declared scope. Complete conformance additionally requires all applicable criteria and conformance requirements to be evaluated with appropriate methods. Never infer coverage from a count.

Add a regression gate appropriate to the project. The local pre-push hook checks a running URL; it cannot prove which commit the server serves. Use CI that builds the candidate when that identity is required.

Deliver a scoped PR and explicit unresolved items. Use [release readiness](docs/RELEASE-READINESS.md) before any conformance claim or release. Check the applicable authority before writing an accessibility declaration.

===END FILE===

===BEGIN FILE audit.mjs (write verbatim to ~/a11y-tools/audit.mjs)===
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

const RUNNER_VERSION = 'audit.mjs v5';

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
const STATES = {
  // FROZEN for the paired pilot — config panel opened on the home page.
  // Do not add, rename, or remove states: the manifest pins this map.
  'config-panel': {
    url: (b) => `${b}/`,
    setup: async (page) => {
      await page.locator('#config-collapsible').click();
      await page.waitForSelector('.content.open', { timeout: 10000 });
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
    statesRequested: statesArg, storageState: !!storageState,
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
  const context = await browser.newContext(storageState ? { storageState } : {});
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

  const scanPage = async () => {
    await page.addScriptTag({ content: axeSource });
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

  // Préconditions métier rejouées sur le document courant : --wait-for sur
  // le document FINAL, pas seulement sur le document avant rechargement.
  const applyPreconditions = async () => {
    if (waitFor) {
      await page.waitForSelector(waitFor, { timeout: 15000 }); // précondition : non avalée
    }
    if (waitMs) await page.waitForTimeout(waitMs);
  };

  const auditLocation = async (label, gotoUrl, extraSetup) => {
    const entry = { url: label, requestedUrl: gotoUrl, violations: [], incomplete: [] };
    lastNavResponse = null;
    try {
      const nav = checkNav(await page.goto(gotoUrl, { waitUntil: 'load', timeout: 30000 }), gotoUrl);
      entry.httpStatus = nav.httpStatus;
      entry.finalUrl = nav.finalUrl;
      if (nav.error) {
        entry.error = nav.error;
      } else {
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
          }
        }
        // Re-vérification SYSTÉMATIQUE du document final (pages comme états) :
        // couvre la nav pendant setup, la redirection login différée pendant
        // --wait, et applique les préconditions sur le document réellement
        // scanné — pas celui d'avant rechargement.
        if (!entry.error && extraSetup) await applyPreconditions();
        const post = checkNav(null, gotoUrl);
        entry.httpStatus = post.httpStatus ?? entry.httpStatus;
        entry.finalUrl = post.finalUrl;
        if (!entry.error && post.error) entry.error = post.error;
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
        const nav2 = check(await p.goto(st.url(origin), { waitUntil: 'load', timeout: 30000 }), st.url(origin));
        if (nav2.error) return nav2;
        await st.setup(p);
        const nav3 = check(null, st.url(origin));
        return nav3.error ? nav3 : nav2;
      });
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

run().catch(e => {
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

===END FILE===

===BEGIN FILE assertions.mjs (write verbatim to ~/a11y-tools/assertions.mjs)===
import { expect } from '@playwright/test';

/**
 * assertions.mjs — helpers d'assertions d'accessibilité DURCIES.
 *
 * Partagés par les scripts de vérification (verify.mjs, eval-final.mjs,
 * tests-validateurs/validateurs.mjs). Chaque helper applique les règles
 * SKILL.md 13-17 : effet observable (pas action), nom accessible CALCULÉ,
 * visibilité réelle (opacity incluse), élément requis absent = échec.
 */

/**
 * Extrait diagnostique du premier nœud ariaSnapshot, conservé pour compatibilité.
 * Ne pas utiliser comme preuve : un conteneur générique peut être omis du
 * snapshot. Utiliser accNameMatches pour vérifier le nom du locator exact.
 */
export async function accName(locator) {
  if (await locator.count() !== 1) return '';
  const snap = await locator.ariaSnapshot().catch(() => '');
  // Format "role \"name\"" ou "- role \"name\"" ; les guillemets échappés sont
  // décodés. Un élément sans nom produit juste "role" → ''.
  const m = snap.split('\n')[0].match(/"((?:[^"\\]|\\.)*)"/);
  return m ? m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\') : '';
}

/**
 * Nom accessible == attendu, sur LE locator fourni (pas la page entière —
 * un leurre portant le même nom ailleurs ne doit pas faire passer le test).
 * Le moteur de Playwright calcule le nom du locator, pas celui d'un enfant.
 * En complément, ce contrat strict refuse les références aria-labelledby
 * mortes ou sans contenu textuel/alternatif, même si le navigateur retombe
 * sur le contenu du contrôle. Ce garde-fou n'est pas une règle WCAG autonome.
 */
export async function accNameMatches(locator, expected) {
  if (await locator.count() !== 1) return false;
  const el = locator;
  try {
    await expect(el).toHaveAccessibleName(expected, { timeout: 1000 });
  } catch {
    return false;
  }
  return el.evaluate((e) => {
    const ref = e.getAttribute('aria-labelledby');
    if (!ref) return true;
    return ref.trim().split(/\s+/).every((id) => {
      const t = document.getElementById(id);
      if (!t) return false;
      return Boolean((t.getAttribute('aria-label') || '').trim()
        || (t.getAttribute('alt') || '').trim()
        || (t.textContent || '').trim()
        || Array.from(t.querySelectorAll('img')).some(i => (i.alt || '').trim()));
    });
  }).catch(() => false);
}

/**
 * Visibilité réelle : Playwright isVisible() ignore opacity:0 — une appli
 * rendue transparente passerait. On vérifie display/visibility/opacity
 * calculés + boîte englobante non vide.
 */
export async function isTrulyVisible(locator) {
  const el = locator.first();
  if (await el.count() === 0) return false;
  const visible = await el.isVisible().catch(() => false);
  if (!visible) return false;
  return el.evaluate((e) => {
    // opacity/visibility peuvent être posés sur un ancêtre — la computed style
    // de l'enfant ne les reflète pas (opacity n'est pas héritée). On remonte
    // toute la chaîne.
    for (let n = e; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.visibility === 'hidden' || cs.visibility === 'collapse') return false;
      if (parseFloat(cs.opacity) === 0) return false;
    }
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }).catch(() => false);
}

/**
 * Effet métier : une action a été exécutée ET a produit l'effet attendu.
 * `act` effectue l'action (click, selectOption…) ; `probe` mesure l'état
 * observable APRÈS coup. Jamais de catch muet : une exception = échec.
 *
 *   await effectObserved(page,
 *     (p) => p.selectOption('#filter', 'a'),
 *     (p) => p.$$eval('.res', els => els.filter(e => e.offsetParent).length === 1));
 */
export async function effectObserved(page, act, probe) {
  await act(page);            // lève si l'élément requis est absent
  return !!(await probe(page));
}

===END FILE===

===BEGIN FILE checklist.md===
# Accessibility review checklist

Use a reviewer separate from the corrector. This is a practical task checklist, not a substitute for evaluating every applicable criterion in the chosen standard.

For each check, record `PASS`, `FAIL`, `NOT_APPLICABLE` with justification, `NOT_TESTED`, or `NEEDS_HUMAN_REVIEW`. Attach the candidate commit, route/state/role, expected/observed behavior and evidence.

Keep three methods separate: reproducible deterministic assertions; agent semantic judgment with uncertainty; actual human testing with tester, date and OS/browser/assistive-technology versions. An agent cannot mark a human check complete by reading the markup.

## Keyboard and interaction

- [ ] Complete each critical task using only the keyboard, including validation errors and authentication.
- [ ] Focus order is understandable and focus remains visible and not entirely obscured (2.4.11, AA).
- [ ] Keyboard users can enter, operate and leave every widget. Test arrow-key composites as well as Tab/Shift+Tab.
- [ ] A working mechanism bypasses repeated navigation.
- [ ] Dialogs receive appropriate initial focus, prevent background interaction and restore focus on closure. Distinguish a focus leak from an inescapable keyboard trap.
- [ ] Menus, tabs, accordions and autocomplete follow their applicable interaction pattern.
- [ ] Hover/focus content is dismissible, hoverable and persistent where 1.4.13 applies.
- [ ] Pointer targets meet 2.5.8 or a documented exception; 44 CSS pixels is an enhanced target, not the universal AA minimum.
- [ ] Dragging has a single-pointer alternative without dragging where required (2.5.7), plus keyboard access.
- [ ] Page/state transitions preserve a meaningful focus location.

## Screen readers and semantic content

Run actual relevant combinations, such as NVDA with a tested Windows browser or VoiceOver with Safari. Mark untested combinations explicitly.

- [ ] Page title and language describe the current page correctly.
- [ ] Landmarks, reading order and heading structure communicate the actual organization.
- [ ] Informative images have contextually useful alternatives; decorative/redundant images have justified empty alternatives.
- [ ] Controls announce their name, role, state and value. Labels and instructions are understandable.
- [ ] Form errors, completion and loading messages are announced at the appropriate time.
- [ ] Data tables expose correct header relationships.
- [ ] Charts and complex imagery have equivalent information and functionality.
- [ ] Dynamic components remain understandable through complete user tasks.
- [ ] Accessible names were checked on the exact control, not another element with the same name.

## Vision, zoom and layout

- [ ] Real browser zoom and text resizing preserve content and functionality at the required levels.
- [ ] Reflow works at the equivalent of 320 CSS pixels, with documented exceptions for content requiring two dimensions.
- [ ] Text-spacing overrides preserve all information and functions.
- [ ] Information does not depend on color alone.
- [ ] Text and non-text contrast meet their applicable thresholds and exceptions.
- [ ] Focus, custom controls and content remain understandable in forced-colors/high-contrast modes.
- [ ] Check clipping, overlap and occlusion visually; an opacity or bounding-box assertion is insufficient by itself.

## Motion, timing and understanding

- [ ] No hazardous flashing; apply the actual threshold criteria rather than judging frequency alone.
- [ ] Moving or updating content can be paused/stopped/hidden when required.
- [ ] Time limits allow the applicable warning and extension mechanisms.
- [ ] Instructions and error messages explain what to do and how to recover.
- [ ] Previously supplied information need not be redundantly re-entered when 3.3.7 applies.
- [ ] Authentication supports applicable alternatives, password managers and paste (3.3.8).
- [ ] Personal-data inputs identify their purpose where 1.3.5 applies.
- [ ] Reduced-motion preferences are respected as an additional usability check; distinguish AAA requirements from AA.

## Media and devices

- [ ] Prerecorded/live media has the applicable captions, transcripts and other alternatives.
- [ ] Audiodescription meets 1.2.5 AA where required; a text alternative alone does not satisfy that criterion.
- [ ] Essential audio information has an appropriate alternative.
- [ ] Mobile critical tasks have actual VoiceOver/iOS and TalkBack/Android evidence when in scope.
- [ ] Orientation, text resizing and touch interaction support the selected devices.

## Incomplete results and documentation

- [ ] Every axe incomplete group (`rule × scenario`) has a traceable resolution, justified inapplicability or an explicit human-review owner.
- [ ] Missing scenarios remain coverage failures. Best-practice findings are distinguished from normative failures.
- [ ] All applicable criteria in the chosen standard have a status, even if this checklist does not name them.
- [ ] Accessibility declarations and any jurisdiction-specific documentation use an appropriate audit and applicability assessment.
- [ ] Users have an accessible way to report barriers.
- [ ] The release record includes limitations, unresolved defects and the exact evaluated commit.

Use the record template and final gates in [release readiness](docs/RELEASE-READINESS.md). Unperformed checks remain open.

===END FILE===
