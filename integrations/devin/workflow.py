# Devin workflow: bounded accessibility remediation (WCAG 2.2 A/AA)
#
# Bounded corrector -> independent verifier loop:
#   audit (agent A) -> fix on a branch (agent B) -> re-audit + checklist (agent C)
#   -> new round while findings remain (max 3) -> separate final evaluation -> PR.
# The corrector never grades its own work; the final status is computed from the
# verifier's counters (compute_status), not from an agent's verdict.
#
# Requires Devin's workflow runtime, which provides agent(), register_workflow() and
# log(). Set A11Y_REPO=owner/repo (and optionally A11Y_BASE=<branch>), then run it with
# the run_workflow tool and script_path=<this file>. Agent prompts are written in French.

import asyncio
import json
import os

REPO = os.environ.get("A11Y_REPO", "")          # e.g. "owner/repo"
BASE_BRANCH = os.environ.get("A11Y_BASE", "")   # empty = the repository's default branch
MAX_ROUNDS = 3

if not REPO:
    raise RuntimeError("A11Y_REPO is missing: export A11Y_REPO=owner/repo or edit the script")

# audit.mjs is embedded below because run_workflow copies this script alone into a
# temporary directory. Keep it in sync with `pnpm sync-runner` (checked by test:parity).
AUDIT_SCRIPT = r'''#!/usr/bin/env node
/**
 * audit.mjs — accessibility scan with axe-core and Playwright.
 *
 * Usage:
 *   node audit.mjs <base-url>               # same-origin crawl (depth 1, max 50 pages)
 *   node audit.mjs --urls a,b,c              # explicit list of URLs
 *   node audit.mjs <url> --out dir           # output directory (default: ./a11y-audit)
 *   node audit.mjs <url> --max 20            # maximum number of crawled pages
 *   node audit.mjs <url> --depth 2           # crawl depth (default 1)
 *   node audit.mjs <url> --wait 1500         # fixed wait (ms) after load
 *   node audit.mjs <url> --wait-for '#app'   # REQUIRED selector; missing => page error
 *   node audit.mjs <url> --states all        # dynamic states declared in STATES
 *   node audit.mjs <url> --states name1,name2 # explicit subset
 *   node audit.mjs <url> --states none       # explicitly declares that there are NO states
 *   node audit.mjs <url> --keep-hash         # keep every # fragment (hash-routed SPA)
 *   node audit.mjs <url> --storage-state f.json  # authenticated Playwright context
 *   node audit.mjs <url> --strict-incomplete # axe 'incomplete' results count as gate errors
 *
 * Dynamic states: declare them in the STATES map below. They are the views that
 * are invisible on load (dialogs, drawers, toasts, tabs) and that a route-by-route
 * scan never sees. The scan runs after each state's `setup`.
 * `--states all` with an empty map is an ERROR: declare the states or state
 * that there are none with `--states none`.
 *
 * Requirements: playwright and axe-core installed in the current directory's
 * project (pinned in this toolkit's lockfile), plus Chromium:
 *   pnpm install --frozen-lockfile --ignore-scripts && pnpm exec playwright install chromium
 *
 * Outputs: <out>/report.json (violations + incomplete + metadata),
 *          <out>/report.md (sorted by impact), <out>/scope.json (executed
 *          scope + hash, to compare between baseline and final).
 *
 * Exit code: 0 = complete scope without violations; 1 = violation(s);
 *            2 = incomplete scope or error (configuration, navigation, injection,
 *                precondition, HTTP >= 400, login redirect, unknown state).
 *            A pass only exists when the whole requested scope was scanned.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

// Resolve dependencies from the calling project (CWD), not from this script.
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
    configErrors.push(`unknown option: ${arg}`);
  } else if (options.has(name)) {
    configErrors.push(`repeated option: ${arg}`);
  } else if (FLAG_OPTIONS.has(name)) {
    options.set(name, true);
  } else if (args[i + 1] === undefined || args[i + 1].startsWith('--')) {
    configErrors.push(`missing value: ${arg}`);
  } else {
    options.set(name, args[++i]);
  }
}
const opt = (name, dflt) => options.get(name) ?? dflt;
const flag = (name) => options.get(name) === true;
if (positional.length > 1) configErrors.push('only one base URL is allowed');

const baseUrl = positional[0];
const urlsOpt = opt('urls', null);
// Relative paths (--urls /a,/b) are resolved against the base URL; without a
// resolvable base this is a configuration error, not a silent skip.
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
  configErrors.push('missing URL: node audit.mjs <url> | --urls u1,u2,...');
}
for (const [name, value, minimum] of [['max', maxPages, 1], ['wait', waitMs, 0], ['depth', depth, 0]]) {
  if (!Number.isSafeInteger(value) || value < minimum) configErrors.push(`--${name} must be an integer >= ${minimum}`);
}
if (!statesArg.length) configErrors.push('declare the states: --states all|name1,name2|none');
if (explicitUrls !== null && explicitUrls.length === 0) {
  configErrors.push('--urls is empty: a scan with no requested page cannot pass');
}
if (explicitUrls && explicitUrls.some(u => !/^https?:\/\//.test(u))) {
  configErrors.push('--urls contains relative paths without a resolvable base URL');
}
if (statesArg.includes('none') && statesArg.length > 1) {
  configErrors.push('--states none cannot be combined with other states');
}

// Axe rule tags: WCAG 2.2 A+AA + best practice. See https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
const RULE_TAGS = ['wcag2a', 'wcag2a-best-practice', 'wcag2aa', 'wcag2aa-best-practice', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const RUNNER_VERSION = 'audit.mjs v5';

/**
 * Dynamic states scanned with --states all | name1,name2. The axe scan runs
 * AFTER `setup`, on the resulting DOM: this covers components that are invisible
 * on load (dialog, drawer, toast, tab, expanded section), the blind spot of a
 * route-by-route scan. `url(b)` receives the base origin.
 * Adapt this map to the project (selectors + sequence). Example:
 *   'record-drawer': {
 *     url: b => `${b}/#/list`,
 *     setup: async page => {
 *       await page.locator('table tr[data-id]').first().click();
 *       await page.waitForSelector('#drawer:not(.hidden)', { timeout: 10000 });
 *     },
 *   },
 */
const STATES = {};

if (statesArg.includes('all') && Object.keys(STATES).length === 0) {
  configErrors.push("--states all requested but STATES is empty: declare the dynamic states, or state that there are none with '--states none'");
}
const unknownStates = statesArg.filter(s => s !== 'all' && s !== 'none' && !(s in STATES));
if (unknownStates.length) {
  configErrors.push(`unknown requested state(s): ${unknownStates.join(', ')} (declared: ${Object.keys(STATES).join(', ') || 'none'})`);
}

function sameOrigin(u, origin) {
  try { return new URL(u).origin === origin; } catch { return false; }
}

// A fragment is a removable ANCHOR only if it does not look like a hash-router
// route (#/x, #!/x, #$:/x, #x/y). #HelloThere (TiddlyWiki) looks like an anchor
// but is a route: use --keep-hash or --urls on such apps.
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

// Atomic write (tmp + rename): a reader never sees a partially written file,
// and every output carries the runId of the current run.
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

// Writes an atomic error result: a run with an invalid configuration (or whose
// browser did not start) still produces scope.json/report.json/report.md for the
// CURRENT run, so an old report is never left in place and reused by mistake.
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
  let md = `# Accessibility audit — ${now.slice(0, 10)}\n\n`;
  md += `**0 scenarios scanned — ${configErrors.length + crawlErrors.length} configuration/scope error(s). Exit code 2.**\n\n`;
  for (const e of configErrors) md += `- config: ${e}\n`;
  for (const e of crawlErrors) md += `- ${e}\n`;
  writeText('report.md', md);
}

async function run() {
  mkdirSync(outDir, { recursive: true });
  // The whole configuration is validated BEFORE anything runs; otherwise an
  // unknown state would crash after reports had started.
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

  // Track the main document's last NAVIGATION response: a click in a setup (or
  // a reload) triggers a real navigation whose response goto() does not return.
  // Without this, an HTTP 500 triggered during setup was invisible and the scan
  // ran on the error page (v4).
  let lastNavResponse = null;
  if (typeof page.on === 'function') {
    page.on('response', (r) => {
      try {
        if (r.request().isNavigationRequest() && r.frame() === page.mainFrame()) lastNavResponse = r;
      } catch { /* detached frame/request */ }
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
    if (urls.length === 0) crawlErrors.push('crawl: no page discovered');
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

  // Check shared by EVERY navigation: HTTP status of the main document's last
  // navigation + identity of the final URL (a login redirect means the
  // requested page was not scanned). A null response falls back to
  // lastNavResponse (navigations triggered by a setup or by JavaScript, whose
  // response goto() does not return).
  const checkNav = (response, requested) => {
    const httpStatus = response ? response.status()
      : (lastNavResponse && lastNavResponse.url() === page.url() ? lastNavResponse.status() : null);
    const finalUrl = page.url();
    let error = null;
    if (httpStatus !== null && httpStatus >= 400) {
      error = `HTTP ${httpStatus}`;
    } else if (LOGIN_PATH.test(finalUrl) && !LOGIN_PATH.test(requested)) {
      error = `redirected to a login page (${finalUrl}): the requested page was not scanned`;
    }
    return { httpStatus, finalUrl, error };
  };

  // Preconditions replayed on the current document: --wait-for applies to the
  // FINAL document, not only to the document before a reload.
  const applyPreconditions = async () => {
    if (waitFor) {
      await page.waitForSelector(waitFor, { timeout: 15000 }); // precondition: never swallowed
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
          // The setup may navigate again (dynamic state): its navigation and the
          // post-setup URL are checked too. The scanned document is what counts,
          // not the one from the first navigation.
          const nav2 = await extraSetup(page, checkNav);
          if (nav2) {
            entry.httpStatus = nav2.httpStatus ?? entry.httpStatus;
            entry.finalUrl = nav2.finalUrl;
            if (nav2.error) entry.error = nav2.error;
          }
        }
        // ALWAYS re-check the final document (pages and states): covers navigation
        // during setup and a delayed login redirect during --wait, and applies the
        // preconditions to the document actually scanned, not the one before a reload.
        if (!entry.error && extraSetup) await applyPreconditions();
        const post = checkNav(null, gotoUrl);
        entry.httpStatus = post.httpStatus ?? entry.httpStatus;
        entry.finalUrl = post.finalUrl;
        if (!entry.error && post.error) entry.error = post.error;
        if (!entry.error) {
          try {
            const req = new URL(gotoUrl), fin = new URL(post.finalUrl);
            if (fin.origin !== req.origin) {
              entry.error = `navigated to another origin before the scan (${post.finalUrl})`;
            } else if (fin.pathname !== req.pathname) {
              // A setup that changes PAGE (not just hash/query) would scan a
              // different document than the one requested. This covers server
              // errors triggered by a click whose HTTP status is not observable
              // (e.g. '.../server-error').
              entry.error = `the final document differs from the requested one (${post.finalUrl}): declare the state's real URL in STATES`;
            }
          } catch { /* unusual URL: already covered by the other checks */ }
        }
        if (!entry.error) {
          const res = await scanPage();
          if (!res || !Array.isArray(res.violations)) {
            entry.error = 'malformed axe result (no violations list): invalid scan, not a pass';
          } else {
            entry.violations = res.violations;
            entry.incomplete = res.incomplete || [];
            entry.testEngine = res.testEngine || null;
            if (strictIncomplete && entry.incomplete.length) {
              entry.error = `${entry.incomplete.length} axe 'incomplete' result(s) (--strict-incomplete)`;
            }
          }
        }
      }
      console.log(`[scan] ${label} — ${entry.error ? 'ERROR ' + entry.error : `${entry.violations.length} rule(s) violated` + (entry.incomplete.length ? `, ${entry.incomplete.length} incomplete` : '')}`);
    } catch (e) {
      entry.error = e.message;
      console.error(`[scan] ${label}: ${e.message}`);
    }
    recordPage(entry);
  };

  for (const url of urls) {
    await auditLocation(url, url, null);
  }

  // Dynamic states: each state starts from a fresh document. With hash routing
  // (SPA), a goto to the same document does not reload, so the previous state
  // (an open drawer, etc.) would persist.
  const wanted = statesArg.includes('all') ? Object.keys(STATES) : statesArg.filter(s => s !== 'none');
  if (wanted.length) {
    const origin = baseUrl ? new URL(baseUrl).origin : new URL(urls[0]).origin;
    for (const name of wanted) {
      const st = STATES[name];
      const label = `${st.url(origin)} [state:${name}]`;
      // The second navigation (fresh reload) is checked like the first:
      // HTTP >= 400 or a login redirect => error, and the scan does not run on
      // the wrong page. The post-setup check (status via lastNavResponse, URL
      // identity, replayed preconditions) is done by auditLocation itself on
      // the final document.
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

  // Executed scope: identifier = requested URL + status. scope.json makes it
  // possible to compare the EXACT set of scenarios between baseline and final;
  // an equal page count does not prove that the sets are identical.
  const scenarioId = (e) => e.url;
  const scopeEntries = results.map(e => ({
    id: scenarioId(e), status: e.error ? 'error' : 'audited',
    httpStatus: e.httpStatus ?? null, finalUrl: e.finalUrl ?? null,
  }));
  const scopeHash = createHash('sha256')
    .update(JSON.stringify(scopeEntries.map(e => e.id).sort()))
    .digest('hex');
  // statesHash covers the URL AND the setup code of each executed state. The
  // scopeHash alone only proves that the labels match, not the actions played
  // (otherwise a setup changed between baseline and final would go unnoticed).
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

  // Markdown report: grouped by rule, sorted by impact
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

  let md = `# Accessibility audit — ${new Date().toISOString().slice(0, 10)}\n\n`;
  const totalRules = rules.length;
  const totalNodes = rules.reduce((s, r) => s + [...r.pages.values()].reduce((a, t) => a + t.length, 0), 0);
  const totalIncomplete = [...incompleteByRule.values()].reduce((s, r) => s + [...r.pages.values()].reduce((a, t) => a + t.length, 0), 0);
  md += `**${totalRules} rule(s) violated, ${totalNodes} occurrence(s), ${scope.audited}/${scope.total} scenario(s) scanned, ${errorCount} error(s), ${totalIncomplete} incomplete result(s).**\n\n`;
  md += `Scope: scope.json — hash \`${scopeHash.slice(0, 12)}\`\n\n`;

  for (const r of rules) {
    md += `## [${r.impact?.toUpperCase()}] ${r.id} — ${r.help}\n\n${r.description}\nReference: ${r.helpUrl}\n\n`;
    for (const [page, targets] of r.pages) {
      md += `- ${page}\n`;
      for (const t of targets.slice(0, 10)) md += `  - \`${t}\`\n`;
      if (targets.length > 10) md += `  - … +${targets.length - 10} more\n`;
    }
    md += '\n';
  }

  if (incompleteByRule.size) {
    md += `## Incomplete results to review (${totalIncomplete})\n\n`;
    md += 'axe could not decide: these are neither passes nor automatic failures.\n\n';
    for (const r of incompleteByRule.values()) {
      md += `### ${r.id} — ${r.help || ''}\n\n`;
      for (const [page, targets] of r.pages) {
        md += `- ${page}\n`;
        for (const t of targets.slice(0, 10)) md += `  - \`${t}\`\n`;
        if (targets.length > 10) md += `  - … +${targets.length - 10} more\n`;
      }
      md += '\n';
    }
  }

  const errs = results.filter(p => p.error);
  if (errs.length || crawlErrors.length || configErrors.length) {
    md += `## Errors (${errs.length + crawlErrors.length + configErrors.length}) — exit code != 0\n\n`;
    md += 'These scenarios were not scanned. A partial scan is not a pass: the gate fails while any requested scenario is missing.\n\n';
    for (const e of errs) md += `- ${e.url} — ${e.error}\n`;
    for (const e of crawlErrors) md += `- ${e}\n`;
    for (const e of configErrors) md += `- config: ${e}\n`;
    md += '\n';
  }
  writeText('report.md', md);
  console.log(`\n${outDir}/report.md — ${totalRules} rule(s), ${totalNodes} occurrence(s), ${errorCount} error(s), ${totalIncomplete} incomplete`);

  if (configErrors.length) for (const e of configErrors) console.error(`[config] ${e}`);
  if (errorCount > 0) process.exit(2);
  process.exit(totalRules > 0 ? 1 : 0);
}

run().catch(e => {
  console.error(e);
  // Global failure (e.g. the browser cannot start): still write the error
  // reports of the CURRENT run, so a stale report.json is never taken for a
  // fresh result.
  try {
    writeErrorReports([`fatal run error: ${e.message}`], []);
  } catch (w) {
    console.error('could not write the error report:', w);
  }
  process.exit(2);
});
'''

META = {
    "name": "a11y-conformite",
    "description": "Audit axe-core → corrections → vérification indépendante (boucle ≤3) → éval finale séparée → CI gate",
    "product": REPO,
    "soft_time_limit_minutes": 45,
    "phases": [
        {"title": "audit", "detail": "Baseline axe-core sur toutes les pages atteignables", "count": 1},
        {"title": "fix", "detail": "Corrections par famille — chaque round part du commit corrigé précédent"},
        {"title": "verify", "detail": "Re-audit + checklist par un agent indépendant"},
        {"title": "final_eval", "detail": "Évaluation indépendante du candidat final (distincte du vérificateur et du rapporteur)", "count": 1},
        {"title": "report", "detail": "PR conforme OU brouillon partiel — jamais de PR de conformité sans preuve", "count": 1},
    ],
}

AUDIT_SCHEMA = {
    "type": "object",
    "properties": {
        "run_instructions": {"type": "string", "description": "Commandes exactes pour installer/démarrer l'app et le port d'écoute"},
        "pages_count": {"type": "integer"},
        "rules_violated": {"type": "integer"},
        "violations_md": {"type": "string", "description": "Contenu de report.md (règles triées par impact avec cibles CSS)"},
        "setup_branch": {"type": "string", "description": "Branche poussée contenant scripts/a11y/audit.mjs"},
    },
    "required": ["run_instructions", "pages_count", "rules_violated", "violations_md", "setup_branch"],
}

FIX_SCHEMA = {
    "type": "object",
    "properties": {
        "branch": {"type": "string"},
        "commit_sha": {"type": "string", "description": "`git rev-parse HEAD` du commit de corrections — identité vérifiable, pas une branche mutable"},
        "fixes_summary": {"type": "string"},
        "remaining_violations": {"type": "integer"},
    },
    "required": ["branch", "commit_sha", "fixes_summary", "remaining_violations"],
}

VERIFY_SCHEMA = {
    "type": "object",
    "properties": {
        "accepted": {"type": "boolean", "description": "true = 0 violation axe ET checklist automatable passée"},
        "remaining_violations": {"type": "integer"},
        "findings": {"type": "string", "description": "Violations restantes + écarts checklist, classés par sévérité"},
        "human_checks": {"type": "string", "description": "Points checklist nécessitant un humain (NVDA, etc.)"},
    },
    "required": ["accepted", "remaining_violations", "findings", "human_checks"],
}

EVAL_SCHEMA = {
    "type": "object",
    "properties": {
        "verdict": {"type": "string", "enum": ["PASS", "FAIL"],
                    "description": "PASS uniquement si vos propres tests (non ceux du correcteur) passent"},
        "new_findings": {"type": "integer", "minimum": 0},
        "evidence": {"type": "string", "description": "Ce que VOUS avez rejoué : tests écrits, scans, captures"},
    },
    "required": ["verdict", "new_findings", "evidence"],
}

# Les règles du skill (SKILL.md) injectées à CHAQUE agent — une règle qui
# n'existe que dans le prompt d'un point d'entrée n'est pas une garantie.
RULES = """Règles impératives :
- Corriger le code source, jamais de surcouche/widget d'accessibilité ; HTML sémantique d'abord.
- alt=\"\" uniquement sur image prouvée décorative ou doublon de texte adjacent ; jamais de règle d'audit désactivée.
- Chaque correction est revérifiée en relançant l'audit ; mesurer, ne pas estimer.
- Assertions : effet observable exact (pas l'action, pas une sous-chaîne ambiguë) ; élément requis absent = FAIL, jamais de .catch() muet ; nom accessible = nom calculé sur le locator exact de la cible.
- Jamais modifier le produit pour satisfaire le harnais (timers, polling, contenu masqué).
- Zoom/reflow : la preuve porte sur le contenu préservé et utilisable, pas sur une taille de viewport.
- Ne pas réécrire ni toucher aux preuves, au runner, aux données de test.
- Les résultats axe 'incomplete' reçoivent une décision traçable ; rien n'est absorbé dans un PASS.
- Dans chaque commande, --states all suppose des états déclarés ; utiliser --states none uniquement si le manifeste figé confirme leur absence.
"""

BASE_LINE = f"Branche de base de travail : {BASE_BRANCH if BASE_BRANCH else 'la branche par défaut du dépôt'}."

COMMON = f"""Contexte : mise en conformité accessibilité WCAG 2.2 AA / RGAA du dépôt {REPO}.
{BASE_LINE}
{RULES}"""

INSTALL_SNIPPET = (
    "Écris ce fichier exact à `scripts/a11y/audit.mjs` (il devient partie du projet) :\n\n"
    "```javascript\n" + AUDIT_SCRIPT + "\n```\n\n"
    "Outillage verrouillé : playwright@1.63.0, axe-core@4.13.0, @playwright/test@1.63.0. "
    "Respecter le gestionnaire du projet, figer le lockfile, installer sans scripts implicites "
    "puis installer Chromium explicitement. Pas d'installation non épinglée.\n"
)


async def audit():
    return await agent(
        COMMON + INSTALL_SNIPPET + """
Tâche :
1. Clone/checke le dépôt, lis le README, découvre comment installer et démarrer l'app en local.
2. Démarre l'app et fige le manifeste des routes, rôles, données et états attendus.
3. AVANT la baseline, identifie les composants invisibles au chargement (modales, drawers, toasts, onglets,
   sections dépliées) : déclare-les dans la carte `STATES` de `scripts/a11y/audit.mjs`
   (sélecteurs + séquence d'ouverture Playwright), prévois les données de seed nécessaires,
   puis lance `node scripts/a11y/audit.mjs <url-de-base> --states all --out a11y-audit/baseline`.
   Utilise --states none si aucun état dynamique ; --urls pour les routes non crawlables.
4. Pousse `scripts/a11y/audit.mjs` (et tout setup nécessaire, ex. script npm "audit:a11y", script de seed) sur une nouvelle branche `devin/a11y-setup-<timestamp>` — rapporte le nom.
5. Rapporte : instructions de lancement exactes, nb de pages, nb de règles violées, le report.md complet.
""",
        phase="audit",
        schema=AUDIT_SCHEMA,
        label="audit-baseline",
        repos=[REPO],
    )


async def fix(audit_res, findings, round_index, from_ref):
    # Chaque round part du COMMIT CORRIGÉ PRÉCÉDENT (from_ref = sha du dernier
    # fix, ou branche de setup au round 0) : les corrections s'accumulent au
    # lieu d'être perdues — un nom de branche mutable n'est pas une preuve.
    return await agent(
        COMMON + f"""
Tâche (round {round_index + 1}/{MAX_ROUNDS}) :
1. Checkout du dépôt puis `git checkout {from_ref}` et crée `devin/a11y-fix-<timestamp>` à partir de ce point (les corrections précédentes doivent être présentes — vérifier avec git log).
2. Lance l'app ({audit_res['run_instructions']}) et l'audit baseline si besoin.
3. Corrige les violations PAR FAMILLE (la correction doit être générale — corriger le composant partagé, pas chaque occurrence) :
   {findings}
   Priorité : déterministes (lang, title, labels, landmarks, duplicate-id, button-name, link-name, list)
   puis contextuelles (contrastes, alt pertinents, focus visible, ordre de tabulation, pièges clavier,
   cibles ≥24px, live regions, prefers-reduced-motion).
4. Relance `node scripts/a11y/audit.mjs <url> --states all --out a11y-audit/round{round_index + 1}` — itère jusqu'à 0 violation automatisable (routes + états).
5. Ajoute le gate CI (job qui run l'audit, exit≠0 = échec) et une ébauche de déclaration d'accessibilité si absente.
6. Commit + push. Rapporte branche, `git rev-parse HEAD` exact (commit_sha), résumé des familles corrigées, violations restantes.
""",
        phase="fix",
        schema=FIX_SCHEMA,
        label=f"fix-round{round_index + 1}",
        repos=[REPO],
    )


async def verify(fix_res, audit_res, round_index):
    return await agent(
        COMMON + f"""
Tu es le VÉRIFICATEUR INDÉPENDANT — tu n'as fait aucune correction, ne te fie à aucune affirmation.
Tâche (round {round_index + 1}/{MAX_ROUNDS}) :
1. Checkout du dépôt puis `git checkout {fix_res.get('commit_sha') or fix_res['branch']}` — la SHA prouvée, pas une branche mutable.
2. Démarre l'app ({audit_res['run_instructions']}), relance `node scripts/a11y/audit.mjs <url> --states all --out a11y-audit/verify{round_index + 1}`.
   Refuse si `STATES` est vide alors que l'app a des vues dynamiques (modales, drawers, toasts).
3. Critère d'acceptation : 0 violation axe sur toutes les pages ET tous les états.
4. En plus, vérifie par toi-même (Playwright/driver) : Tab traverse tout sans piège, focus visible,
   la modal piège/relâche le focus, liens d'évitement, zoom 200 % utilisable, prefers-reduced-motion.
5. Liste dans `human_checks` ce qui exige un humain (test NVDA complet, etc.).
Rapporte accepted (0 violation ET checks automatisables OK), violations restantes, findings par sévérité.
""",
        phase="verify",
        schema=VERIFY_SCHEMA,
        label=f"verify-round{round_index + 1}",
        repos=[REPO],
    )


async def report_success(last_fix, audit_res, verify_res):
    """PR de conformité — uniquement appelée quand les invariants sont vrais."""
    return await agent(
        COMMON + f"""
Tâche finale (candidat VALIDÉ par vérification + évaluation indépendantes) :
1. Checkout `{last_fix.get('commit_sha') or last_fix['branch']}`, vérifie que l'audit passe (0 violation).
2. Ouvre la PR : titre "feat(a11y): remédiation accessibilité WCAG 2.2 AA (automatisable)",
   corps = baseline ({audit_res['rules_violated']} règles violées) → final, résumé par famille,
   statut checklist, points humains restants explicitement listés : {verify_res['human_checks']}
   Ne pas écrire « conforme » ou « certifié » : décrire le périmètre audité et les revues ouvertes.
3. Rapporte l'URL de la PR.
""",
        phase="report",
        schema={"type": "object", "properties": {
            "pr_url": {"type": "string"},
            "summary": {"type": "string"}}, "required": ["pr_url", "summary"]},
        label="open-pr",
        repos=[REPO],
    )


async def report_partial(last_fix, audit_res, verify_res, rejections):
    """PR en BROUILLON partielle — le refus du vérificateur ne peut pas
    produire une sortie validée ; la remédiation partielle reste livrable
    avec ses preuves et ses refus joints, en brouillon explicite."""
    return await agent(
        COMMON + f"""
Tâche finale — REMÉDIATION PARTIELLE (le vérificateur n'a jamais accepté) :
1. Checkout `{last_fix.get('commit_sha') or last_fix['branch']}` (la meilleure branche de corrections).
2. Ouvre une PR EN BROUILLON (draft) : titre "WIP: remédiation accessibilité partielle — non validée",
   corps = baseline ({audit_res['rules_violated']} règles violées) → violations restantes,
   résumé des familles corrigées, la liste COMPLÈTE des refus/défauts du vérificateur :
   {rejections}
   Points humains restants : {verify_res['human_checks']}
3. Rapporte l'URL de la PR brouillon.
""",
        phase="report",
        schema={"type": "object", "properties": {
            "pr_url": {"type": "string"},
            "summary": {"type": "string"}}, "required": ["pr_url", "summary"]},
        label="open-draft-pr",
        repos=[REPO],
    )


async def final_eval(last_fix, audit_res, verify_res):
    """Évaluation finale INDÉPENDANTE du candidat : autre agent que le
    vérificateur, écrivant ses propres tests — la boucle ne se note pas
    elle-même jusque dans sa sortie."""
    return await agent(
        COMMON + f"""
Tu es l'ÉVALUATEUR FINAL — tu n'as ni corrigé ni vérifié ce travail.
Tâche :
1. Checkout `{last_fix.get('commit_sha') or last_fix['branch']}` depuis {BASE_BRANCH or 'la branche de base'}, démarre l'app ({audit_res['run_instructions']}).
2. Écris TES PROPRES vérifications (ne réutilise pas les tests du correcteur) :
   parcours métier clavier complet, nom accessible de composants critiques
   (locator exact, pas une recherche globale), focus modal, zoom 200 %,
   `node scripts/a11y/audit.mjs <url> --states all` relancé par toi.
3. Cherche aussi ce que la boucle a pu manquer : pages hors périmètre,
   régressions fonctionnelles, assertions trop faibles.
Rapporte verdict PASS/FAIL, nombre de nouveaux findings, tes preuves.
""",
        phase="final_eval",
        schema=EVAL_SCHEMA,
        label="final-eval",
        repos=[REPO],
    )


def compute_status(verify_res):
    """Décision calculée depuis les preuves — la déclaration d'un agent ne
    fait pas foi. accepted=true avec des violations restantes est une
    sortie contradictoire : ERROR, pas PASS."""
    if not isinstance(verify_res, dict):
        return "ERROR"
    if (type(verify_res.get("accepted")) is not bool
            or type(verify_res.get("remaining_violations")) is not int
            or verify_res["remaining_violations"] < 0):
        return "ERROR"
    if verify_res["accepted"] and verify_res["remaining_violations"] > 0:
        return "ERROR"
    return "PASS" if verify_res["accepted"] else "PARTIAL"


async def main():
    await register_workflow(META)

    audit_res = await audit()
    log(f"Baseline : {audit_res['rules_violated']} règles violées sur {audit_res['pages_count']} pages")

    findings = audit_res["violations_md"]
    prev_findings = None
    last_fix = None
    verify_res = None
    rejections = []
    current_ref = audit_res["setup_branch"]

    for i in range(MAX_ROUNDS):
        if findings == prev_findings:
            log("Aucun progrès entre deux rounds — arrêt, statut PARTIAL")
            break
        prev_findings = findings

        last_fix = await fix(audit_res, findings, i, current_ref)
        current_ref = last_fix.get("commit_sha") or last_fix["branch"]
        verify_res = await verify(last_fix, audit_res, i)
        log(f"Round {i + 1} : {verify_res['remaining_violations']} violations restantes, accepted={verify_res['accepted']}")

        if verify_res["accepted"] and verify_res["remaining_violations"] == 0:
            break
        rejections.append(f"round {i + 1}: accepted={verify_res['accepted']}, "
                          f"remaining={verify_res['remaining_violations']}, "
                          f"findings={verify_res['findings']}")
        findings = verify_res["findings"]
    else:
        log("Limite de rounds atteinte — livrable partiel, vérif humaine requise")

    status = compute_status(verify_res)
    log(f"Décision calculée : {status}")

    if status == "ERROR":
        log("Sortie contradictoire du vérificateur (accepted=true avec violations restantes) "
            "ou vérification jamais exécutée — aucune PR ouverte. Intervention humaine requise.")
        return

    if status == "PASS":
        eval_res = await final_eval(last_fix, audit_res, verify_res)
        log(f"Éval finale : verdict={eval_res.get('verdict')}, nouveaux findings={eval_res.get('new_findings')}")
        if (eval_res.get("verdict") != "PASS"
                or type(eval_res.get("new_findings")) is not int
                or eval_res["new_findings"] != 0
                or not isinstance(eval_res.get("evidence"), str)
                or not eval_res["evidence"].strip()):
            status = "PARTIAL"
            rejections.append(f"final_eval: verdict={eval_res.get('verdict')}, "
                              f"new_findings={eval_res.get('new_findings')}, "
                              f"evidence={eval_res.get('evidence')}")

    if status == "PASS":
        final = await report_success(last_fix, audit_res, verify_res)
    else:
        final = await report_partial(last_fix, audit_res, verify_res, "\n".join(rejections))
    log(f"PR : {final['pr_url']} (statut {status})")
    if verify_res:
        log(f"Checks humains à faire : {verify_res['human_checks']}")


asyncio.run(main())
