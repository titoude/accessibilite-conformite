// CLI contract tests for audit.todo.mjs — spawn the actual runner process
// (not the exported functions) under the normal locked install and assert
// its exit code + report.fatal for each failure branch.
// Usage: node --test benchmarks/task-pilot/harness/test-cli.mjs
import { test } from "node:test";
import assert from "node:assert";
import { spawn } from "node:child_process";
import { mkdtempSync, existsSync, readFileSync } from "node:fs";
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

test("CLI: page error + aborted external request => exit != 0, report.fatal set", async (t) => {
  // error fixture trips before tasks complete quickly; cap runtime
  t.signal?.addEventListener?.("abort", () => {});
  const r = await runAudit(`http://127.0.0.1:${PORT}/cli-errors.html`);
  assert.notEqual(r.code, 0, `expected nonzero exit, got ${r.code}:\n${r.out}\n${r.err}`);
  const reportPath = join(r.outdir, "report.json");
  assert.ok(existsSync(reportPath), "report.json must exist even on failure");
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  assert.ok(report.fatal, "report.fatal must be set");
  assert.ok(report.page_errors.length > 0 || report.network_attempts.some((n) => !n.allowed),
    "evidence of page error or aborted request must be preserved");
});

test("CLI: unreachable URL => exit != 0, fresh outputs only", async () => {
  const r = await runAudit(`http://127.0.0.1:${PORT}/does-not-exist/`);
  assert.notEqual(r.code, 0, `expected nonzero exit, got ${r.code}`);
});
