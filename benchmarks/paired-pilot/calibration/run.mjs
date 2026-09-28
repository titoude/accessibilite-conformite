#!/usr/bin/env node
/**
 * run.mjs — calibration: replay the selected W3C ACT Rules test cases against
 * axe-core 4.13.0 (the scanner the benchmark uses) and compare observed
 * outcomes to the expected ACT outcomes.
 *
 * This measures the FIDELITY OF THE SELECTED SCANNER RULES only — it does NOT
 * measure the remediation skill (that is track 2, the paired pilot).
 *
 * Semantics per case:
 *   expected "failed"      -> >=1 mapped axe rule reports a violation  => agree_fail
 *   expected "passed"      -> no mapped axe rule violation             => agree_pass
 *   expected "inapplicable"-> no mapped axe rule violation             => agree_inapplicable
 * Any other combination = divergent (recorded, never hidden). All violations
 * (mapped AND unmapped rules) are recorded for context.
 *
 * The axe rule list per ACT rule is recomputed LIVE from axe._audit.rules[].actIds
 * of the loaded build — not trusted from cases.json (which records what was
 * declared at fetch time; a drift is reported as map_drift).
 *
 * Usage:  node calibration/run.mjs --out calibration/results
 * Deps resolved from the repo root package.json (pinned playwright/axe-core).
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, renameSync, createReadStream, existsSync } from 'node:fs';
import { resolve, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';

const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const outDir = resolve(opt('out', join(HERE, 'results')));
mkdirSync(outDir, { recursive: true });

const casesDoc = JSON.parse(readFileSync(join(HERE, 'cases.json'), 'utf8'));
const PORT = 8871;

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.json': 'application/json' };

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = join(HERE, path === '/' ? 'index.html' : path);
  if (!file.startsWith(HERE) || !existsSync(file)) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(PORT, '127.0.0.1', r));

const browser = await chromium.launch();
const axeSrc = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

// live actIds map from the loaded axe build
const probe = await browser.newPage();
await probe.goto('about:blank');
await probe.addScriptTag({ content: axeSrc });
const liveMap = await probe.evaluate(() => {
  const m = {};
  for (const r of axe._audit.rules) if (r.actIds && r.actIds.length) for (const a of r.actIds) (m[a] = m[a] || []).push(r.id);
  return m;
});
await probe.close();

const rows = [];
let agreeFail = 0, agreePass = 0, agreeInapp = 0, diverge = 0, errors = 0;

for (const c of casesDoc.cases) {
  const liveRules = liveMap[c.ruleId] || [];
  const declaredRules = c.axeRuleIds || [];
  const mapDrift = JSON.stringify([...liveRules].sort()) !== JSON.stringify([...declaredRules].sort());
  const ruleIds = liveRules.length ? liveRules : declaredRules;
  const url = `http://127.0.0.1:${PORT}/${c.localFile}`;
  const row = {
    ruleId: c.ruleId, ruleName: c.ruleName, testcaseId: c.testcaseId,
    expected: c.expected, url: c.url, localFile: c.localFile,
    sha256: c.sha256, axeRuleIds: ruleIds, map_drift: mapDrift,
    observed_rules: [], all_violation_rules: [], outcome: null, error: null,
  };
  try {
    const p = await browser.newPage();
    const resp = await p.goto(url, { waitUntil: 'load', timeout: 20000 });
    if (!resp || resp.status() !== 200) throw new Error(`HTTP ${resp && resp.status()}`);
    await p.addScriptTag({ content: axeSrc });
    const res = await p.evaluate(async (ruleIds) => {
      const out = await window.axe.run(document, {
        runOnly: { type: 'rule', values: ruleIds },
        resultTypes: ['violations'],
      });
      const all = await window.axe.run(document, { resultTypes: ['violations'] });
      return { mapped: out.violations.map(v => ({ id: v.id, nodes: v.nodes.length })), all: all.violations.map(v => v.id) };
    }, ruleIds);
    row.observed_rules = res.mapped;
    row.all_violation_rules = res.all;
    const anyMapped = res.mapped.length > 0;
    if (c.expected === 'failed') { row.outcome = anyMapped ? 'agree_fail' : 'diverge_false_negative'; }
    else if (c.expected === 'passed') { row.outcome = anyMapped ? 'diverge_false_positive' : 'agree_pass'; }
    else { row.outcome = anyMapped ? 'diverge_inapplicable_flagged' : 'agree_inapplicable'; }
    await p.close();
  } catch (e) {
    row.outcome = 'error'; row.error = e.message.split('\n')[0]; errors++;
  }
  if (row.outcome === 'agree_fail') agreeFail++;
  else if (row.outcome === 'agree_pass') agreePass++;
  else if (row.outcome === 'agree_inapplicable') agreeInapp++;
  else if (row.outcome !== 'error') diverge++;
  rows.push(row);
  console.log(`[${row.outcome}] ${c.ruleId}/${c.testcaseId.slice(0, 10)} expected=${c.expected} mapped=${row.observed_rules.map(r => r.id).join('|') || 'none'}`);
}

await browser.close();
server.close();

const summary = {
  generatedAt: new Date().toISOString(),
  source: { index: casesDoc.source_index, index_sha256: casesDoc.source_index_sha256, license: casesDoc.license, retrieved: casesDoc.retrieved },
  tool: { axe_core: '4.13.0', runner: 'calibration/run.mjs', playwright: '1.63.0' },
  counts: {
    total: rows.length, agree_fail: agreeFail, agree_pass: agreePass,
    agree_inapplicable: agreeInapp, divergent: diverge, errors,
  },
  note: 'Measures selected axe scanner rules against expected ACT outcomes. Does NOT measure the remediation skill. ACT rules and axe rules are not 1:1 — divergences are recorded, not hidden.',
  cases: rows,
};
const tmp = join(outDir, 'calibration-results.json.tmp');
writeFileSync(tmp, JSON.stringify(summary, null, 2));
renameSync(tmp, join(outDir, 'calibration-results.json'));
console.log(`\n${rows.length} cases: ${agreeFail} agree-fail, ${agreePass} agree-pass, ${agreeInapp} agree-inapplicable, ${diverge} divergent, ${errors} errors`);
process.exit(errors > 0 || diverge > 0 ? 1 : 0);
