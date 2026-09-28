// CLI contract tests for audit.todo.mjs — spawn the actual runner process
// (not the exported functions) under the normal locked install and assert
// its exit code + report.fatal for each failure branch. Each branch is
// isolated: page-error-only and external-request-only fixtures prove the
// two fatal branches independently.
// Usage: node --test benchmarks/task-pilot/harness/test-cli.mjs
import { test } from "node:test";
import assert from "node:assert";
import { spawn } from "node:child_process";
import { mkdtempSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = 8512 + (process.pid % 40);
const FIXTURES = join(HERE, "fixtures");

let server;
test.before(async () => {
  server = spawn(process.execPath, [join(HERE, "serve.mjs"), FIXTURES, String(PORT)], { stdio: "pipe" });
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/cli-errors.html`); if (r.ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
});
test.after(() => server?.kill());

function runAudit(url) {
  const outdir = mkdtempSync(join(tmpdir(), "audit-cli-"));
  return new Promise((res) => {
    const p = spawn(process.execPath, [join(HERE, "audit.todo.mjs"), url, outdir, String(PORT)], { stdio: "pipe" });
    let out = "", err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("exit", (code) => res({ code, out, err, outdir }));
  });
}

function readReport(outdir) {
  return JSON.parse(readFileSync(join(outdir, "report.json"), "utf8"));
}

// --- HEALTHY POSITIVE: clean fixture => exit 0, zero page errors, zero blocked ---
test("CLI: healthy fixture => exit 0, no fatal, zero page errors/blocked", async () => {
  const r = await runAudit(`http://127.0.0.1:${PORT}/ctrl-complete.html`);
  assert.equal(r.code, 0, `expected exit 0:\n${r.out}\n${r.err}`);
  const report = readReport(r.outdir);
  assert.equal(report.fatal, null);
  assert.equal(report.page_errors.length, 0, JSON.stringify(report.page_errors));
  assert.equal(report.network_attempts.filter((n) => !n.allowed).length, 0);
  assert.ok(report.tasks.every((t) => t.status === "PASS"), JSON.stringify(report.tasks.map((t) => [t.id, t.status])));
});

// --- SEPARATED FATAL BRANCHES ---
test("CLI: page-error only => exit != 0, fatal names page errors", async () => {
  const r = await runAudit(`http://127.0.0.1:${PORT}/cli-pageerror.html`);
  assert.notEqual(r.code, 0, `expected nonzero:\n${r.out}`);
  const report = readReport(r.outdir);
  assert.match(report.fatal, /page errors/i, `fatal=${report.fatal}`);
  assert.ok(report.page_errors.length > 0);
});

test("CLI: external request only (no page error) => exit != 0, fatal names aborted requests", async () => {
  const r = await runAudit(`http://127.0.0.1:${PORT}/cli-external.html`);
  assert.notEqual(r.code, 0, `expected nonzero:\n${r.out}`);
  const report = readReport(r.outdir);
  assert.equal(report.page_errors.length, 0, "external-only fixture must not record page errors");
  assert.match(report.fatal, /aborted external/i, `fatal=${report.fatal}`);
  assert.ok(report.network_attempts.some((n) => !n.allowed));
});

// --- NAVIGATION FAILURE ---
test("CLI: 404 document => exit != 0, fatal names navigation", async () => {
  const r = await runAudit(`http://127.0.0.1:${PORT}/does-not-exist/`);
  assert.notEqual(r.code, 0, `expected nonzero, got ${r.code}`);
  const report = readReport(r.outdir);
  assert.ok(report.fatal, "report.fatal must be set");
});

// --- STALE OUTPUT REJECTION ---
test("CLI: preseeded stale report/scope are replaced by the fresh run", async () => {
  const outdir = mkdtempSync(join(tmpdir(), "audit-stale-"));
  writeFileSync(join(outdir, "report.json"), JSON.stringify({ sentinel: "STALE" }));
  writeFileSync(join(outdir, "scope.json"), JSON.stringify({ sentinel: "STALE" }));
  const code = await new Promise((res) => {
    const p = spawn(process.execPath,
      [join(HERE, "audit.todo.mjs"), `http://127.0.0.1:${PORT}/does-not-exist/`, outdir, String(PORT)],
      { stdio: "pipe" });
    p.on("exit", res);
  });
  assert.notEqual(code, 0);
  const report = readReport(outdir);
  const scope = JSON.parse(readFileSync(join(outdir, "scope.json"), "utf8"));
  assert.ok(!report.sentinel, "stale report.json must be overwritten");
  assert.ok(!scope.sentinel, "stale scope.json must be overwritten");
  assert.ok(report.runId && report.runId === scope.runId, "fresh runIds must match");
});
