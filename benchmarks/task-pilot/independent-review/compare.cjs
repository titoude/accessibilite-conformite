const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const work = __dirname;
const published = path.resolve(work, '..');
const frozen = path.join(published, 'harness');
const sourceHash = crypto.createHash('sha256')
  .update(fs.readFileSync(path.join(frozen, 'task-checks.mjs')))
  .update(fs.readFileSync(path.join(frozen, 'net-policy.mjs'))).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const pairs = [
  ['baseline', 'baseline/run-3-node22', 'baseline'],
  ['control-round1', 'arms/control/eval', 'control-round1'],
  ['treatment-round1', 'arms/treatment/eval', 'treatment-round1'],
  ['treatment-round2', 'arms/treatment/eval-round2', 'treatment-round2'],
];
function evidence(report) {
  return {
    pin: report.pin,
    tasks: report.tasks.map(task => ({ id: task.id, status: task.status,
      steps: task.evidence.steps.map(step => ({ s: step.s, ok: step.ok })) })),
    axe: Object.fromEntries([['initial', report.axe], ['final', report.axe_final]].map(([state, scan]) => [state, {
      violations: scan.violations,
      incomplete: scan.incomplete,
      nodes: scan.raw_violations.map(rule => ({ id: rule.id,
        nodes: rule.nodes.map(node => ({ target: node.target, html: node.html })) })),
    }])),
    page_errors: report.page_errors,
    external: report.network_attempts.filter(request => !request.allowed),
    fatal: report.fatal ?? null,
  };
}
const results = pairs.map(([name, remote, local]) => {
  const actual = read(path.join(work, local, 'report.json'));
  const expected = read(path.join(published, remote, 'report.json'));
  const scope = read(path.join(work, local, 'scope.json'));
  const expectedScope = read(path.join(published, remote, 'scope.json'));
  assert.equal(scope.runId, actual.runId);
  assert.equal(scope.statesHash, sourceHash);
  assert.equal(expectedScope.statesHash, sourceHash);
  assert.deepEqual(evidence(actual), evidence(expected));
  return { name, match: true, runId: actual.runId,
    tasks: actual.tasks.map(task => ({id: task.id, status: task.status})),
    versions: actual.versions, coordinatorVersions: expected.versions,
    axe: Object.fromEntries([['initial', actual.axe], ['final', actual.axe_final]].map(([state, scan]) => [state, {
      violations: scan.violations, incomplete: scan.incomplete,
    }])),
    pageErrors: actual.page_errors.length, externalRequests: 0, fatal: actual.fatal ?? null,
  };
});
console.log(JSON.stringify({ sourceHash, comparison: 'Task and step statuses, axe rule counts, violation-node targets and HTML, incomplete rule counts, execution gates; dynamic item IDs in step detail and runtime timestamps are not compared.', results }, null, 2));
