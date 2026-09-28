#!/usr/bin/env node
/**
 * run.mjs — calibration: replay the selected W3C ACT Rules test cases against
 * axe-core 4.13.0 (the scanner the benchmark uses) and compare observed
 * outcomes to the expected ACT outcomes.
 *
 * This measures the FIDELITY OF THE SELECTED SCANNER RULES only — it does NOT
 * measure the remediation skill (that is track 2, the paired pilot).
 *
 * Semantics per case (hardened after review):
 *   expected "failed" + mapped violation      => agree_fail
 *   expected "failed" + no mapped violation   => diverge_false_negative
 *   expected "passed" + mapped violation      => diverge_false_positive
 *   expected "passed" + no mapped violation   => consistent_no_violation
 *     (NOT called "agree_pass": a scanner that simply cannot see the construct
 *     would produce the same byte pattern — "no violation" never PROVES pass)
 *   expected "inapplicable" + mapped violation => diverge_inapplicable_flagged
 *   expected "inapplicable" + no violation     => consistent_no_violation
 *     (never asserted as inapplicable — absence of a violation cannot prove
 *     inapplicability; recorded as consistent-with, not agreement)
 *   any mapped axe INCOMPLETE result           => unscorable_incomplete
 *     (incompletes mean axe could not decide — never folded into pass/fail)
 *   fixture sha256 mismatch / HTTP / crash     => error (never scored)
 * All violations AND incompletes (mapped and unmapped rules) are recorded.
 *
 * The axe rule list per ACT rule is recomputed LIVE via the PUBLIC API
 * axe.getRules() (ruleId + actIds) of the loaded build — not trusted from
 * cases.json (a drift vs fetch-time declarations is reported as map_drift),
 * and never from axe internals. The raw map is persisted as axe-act-map.json.
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
const { createHash } = require('crypto');
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

// live actIds map from the loaded axe build — PUBLIC API only, per
// coordinator review: axe.getRules().filter(r => (r.actIds||[]).includes(actId))
const probe = await browser.newPage();
await probe.goto('about:blank');
await probe.addScriptTag({ content: axeSrc });
const liveMap = await probe.evaluate(() => {
  const rules = window.axe.getRules();
  const perRule = rules.map(r => ({ ruleId: r.ruleId, actIds: r.actIds || [] }));
  const m = {};
  for (const r of perRule) for (const a of r.actIds) (m[a] = m[a] || []).push(r.ruleId);
  return { map: m, perRule };
});
const liveRulesByAct = liveMap.map;
// Persist the raw public-API mapping for auditability
writeFileSync(join(outDir, 'axe-act-map.json'), JSON.stringify({
  axe_version: '4.13.0',
  extracted_via: 'axe.getRules()',
  rules_with_actIds: liveMap.perRule.filter(r => r.actIds.length),
  by_actId: liveRulesByAct,
}, null, 2));
await probe.close();

const rows = [];
let agreeFail = 0, consistent = 0, unscorable = 0, diverge = 0, errors = 0;

for (const c of casesDoc.cases) {
  const liveRules = liveRulesByAct[c.ruleId] || [];
  const declaredRules = c.axeRuleIds || [];
  const mapDrift = JSON.stringify([...liveRules].sort()) !== JSON.stringify([...declaredRules].sort());
  const ruleIds = liveRules.length ? liveRules : declaredRules;
  const url = `http://127.0.0.1:${PORT}/${c.localFile}`;
  const row = {
    ruleId: c.ruleId, ruleName: c.ruleName, testcaseId: c.testcaseId,
    expected: c.expected, url: c.url, localFile: c.localFile,
    sha256: c.sha256, sha256_verified: null, axeRuleIds: ruleIds, map_drift: mapDrift,
    observed_rules: [], incomplete_rules: [], all_violation_rules: [],
    outcome: null, error: null,
  };
  try {
    // Verify fixture integrity BEFORE scanning — scanning wrong bytes would
    // silently corrupt the calibration row.
    const actualSha = createHash('sha256').update(readFileSync(join(HERE, c.localFile))).digest('hex');
    row.sha256_verified = actualSha === c.sha256;
    if (!row.sha256_verified) throw new Error(`fixture sha256 mismatch: file=${actualSha.slice(0, 16)} declared=${c.sha256.slice(0, 16)}`);
    const p = await browser.newPage();
    const resp = await p.goto(url, { waitUntil: 'load', timeout: 20000 });
    if (!resp || resp.status() !== 200) throw new Error(`HTTP ${resp && resp.status()}`);
    await p.addScriptTag({ content: axeSrc });
    const res = await p.evaluate(async (ruleIds) => {
      const out = await window.axe.run(document, {
        runOnly: { type: 'rule', values: ruleIds },
        resultTypes: ['violations', 'incomplete'],
      });
      const all = await window.axe.run(document, { resultTypes: ['violations', 'incomplete'] });
      return {
        mapped: out.violations.map(v => ({ id: v.id, nodes: v.nodes.length })),
        incompleteMapped: out.incomplete.map(v => ({ id: v.id, nodes: v.nodes.length })),
        all: all.violations.map(v => v.id),
        allIncomplete: all.incomplete.map(v => v.id),
      };
    }, ruleIds);
    row.observed_rules = res.mapped;
    row.incomplete_rules = res.incompleteMapped;
    row.all_violation_rules = res.all;
    row.all_incomplete_rules = res.allIncomplete;
    const anyMapped = res.mapped.length > 0;
    const anyIncomplete = res.incompleteMapped.length > 0;
    if (anyIncomplete) {
      row.outcome = 'unscorable_incomplete';   // axe could not decide — not evidence
    } else if (c.expected === 'failed') {
      row.outcome = anyMapped ? 'agree_fail' : 'diverge_false_negative';
    } else if (c.expected === 'passed') {
      row.outcome = anyMapped ? 'diverge_false_positive' : 'consistent_no_violation';
    } else {
      row.outcome = anyMapped ? 'diverge_inapplicable_flagged' : 'consistent_no_violation';
    }
    await p.close();
  } catch (e) {
    row.outcome = 'error'; row.error = e.message.split('\n')[0]; errors++;
  }
  if (row.outcome === 'agree_fail') agreeFail++;
  else if (row.outcome === 'consistent_no_violation') consistent++;
  else if (row.outcome === 'unscorable_incomplete') unscorable++;
  else if (row.outcome !== 'error') diverge++;
  rows.push(row);
  console.log(`[${row.outcome}] ${c.ruleId}/${c.testcaseId.slice(0, 10)} expected=${c.expected} mapped=${row.observed_rules.map(r => r.id).join('|') || 'none'} inc=${row.incomplete_rules.map(r => r.id).join('|') || '-'}`);
}

await browser.close();
server.close();

const summary = {
  generatedAt: new Date().toISOString(),
  source: { index: casesDoc.source_index, index_sha256: casesDoc.source_index_sha256, license: casesDoc.license, retrieved: casesDoc.retrieved },
  tool: { axe_core: '4.13.0', runner: 'calibration/run.mjs', playwright: '1.63.0', actMapVia: 'axe.getRules()' },
  counts: {
    total: rows.length, agree_fail: agreeFail,
    consistent_no_violation: consistent,
    unscorable_incomplete: unscorable,
    divergent: diverge, errors,
  },
  note: 'Measures selected axe scanner rules against expected ACT outcomes. Does NOT measure the remediation skill. "consistent_no_violation" is not asserted agreement: absence of a violation cannot prove pass/inapplicable. ACT rules and axe rules are not 1:1 — divergences are recorded, not hidden.',
  cases: rows,
};
const tmp = join(outDir, 'calibration-results.json.tmp');
writeFileSync(tmp, JSON.stringify(summary, null, 2));
renameSync(tmp, join(outDir, 'calibration-results.json'));
console.log(`\n${rows.length} cases: ${agreeFail} agree-fail, ${consistent} consistent-no-violation, ${unscorable} unscorable-incomplete, ${diverge} divergent, ${errors} errors`);
process.exit(errors > 0 || diverge > 0 ? 1 : 0);
