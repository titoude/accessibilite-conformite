import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CALIBRATION = join(ROOT, 'benchmarks/paired-pilot/calibration');
const sha256 = text => createHash('sha256').update(text).digest('hex');

test('calibration CLI excludes blocked resources and refuses altered asset bytes', { timeout: 40000 }, async t => {
  // Run the real CLI against a temporary corpus; never rewrite W3C fixtures.
  const dir = mkdtempSync(join(tmpdir(), 'a11y-calibration-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const name of ['run.mjs', 'net-policy.mjs']) {
    copyFileSync(join(CALIBRATION, name), join(dir, name));
  }
  mkdirSync(join(dir, 'test-assets'));
  const asset = 'frozen asset';
  writeFileSync(join(dir, 'test-assets/asset.txt'), asset);
  writeFileSync(join(dir, 'test-assets/provenance.json'), JSON.stringify({
    files: { 'asset.txt': { sha256: sha256(asset) } },
  }));

  let externalHits = 0;
  const external = createServer((req, res) => { externalHits++; res.end('unexpected external bytes'); });
  await new Promise(resolve => external.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => external.close(resolve)));
  const url = `http://127.0.0.1:${external.address().port}/image.png`;
  const html = content => `<!doctype html><html lang="en"><title>Control</title><body><main><button>Save</button>${content}</main></body></html>`;
  const fixtures = {
    local: html(''),
    inert: html(`<a href="${url}">An unvisited destination</a>`),
    blocked: html(`<style>body { background-image: url(${url}); }</style>`),
  };
  const cases = Object.entries(fixtures).map(([id, source]) => {
    writeFileSync(join(dir, `${id}.html`), source);
    return { ruleId: '97a4e1', testcaseId: id, expected: 'passed',
      localFile: `${id}.html`, sha256: sha256(source), axeRuleIds: ['button-name'] };
  });
  writeFileSync(join(dir, 'cases.json'), JSON.stringify({ cases }));

  const out = join(dir, 'results');
  await exec(process.execPath, [join(dir, 'run.mjs'), '--out', out], {
    cwd: ROOT, timeout: 25000,
  });
  const result = JSON.parse(readFileSync(join(out, 'calibration-results.json'), 'utf8'));
  const rows = Object.fromEntries(result.cases.map(row => [row.testcaseId, row]));
  assert.equal(rows.local.outcome, 'consistent_no_violation');
  assert.equal(rows.inert.outcome, 'consistent_no_violation');
  assert.equal(rows.blocked.outcome, 'unsupported_external_dependency');
  assert.deepEqual(rows.blocked.aborted_requests, [url]);
  assert.ok(rows.blocked.raw_axe_mapped, 'keep the scan evidence without counting it as a faithful replay');
  assert.equal(result.counts.consistent_no_violation, 2);
  assert.equal(result.counts.unsupported, 1);
  assert.equal(result.counts.errors, 0);
  assert.equal(externalHits, 0, 'no request may reach the external resource server');

  writeFileSync(join(dir, 'test-assets/asset.txt'), 'altered asset');
  const failedOut = join(dir, 'altered-results');
  await assert.rejects(exec(process.execPath, [join(dir, 'run.mjs'), '--out', failedOut], {
    cwd: ROOT, timeout: 5000,
  }), error => error.code === 2 && /test-asset asset\.txt sha256 mismatch/.test(error.stderr));
  assert.equal(existsSync(join(failedOut, 'calibration-results.json')), false);
});
