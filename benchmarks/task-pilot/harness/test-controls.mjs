// Control regression: runs the SAME exported task checks the evaluator
// uses against synthetic fixtures, asserting expected verdicts. Guards
// against degenerate always-PASS checks and evaluator regressions.
// Usage: node --test benchmarks/task-pilot/harness/test-controls.mjs
// (repo root, after `pnpm install --frozen-lockfile --ignore-scripts`)
import { test } from "node:test";
import assert from "node:assert";
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isLocalRequest } from "./net-policy.mjs";
import { runTask1, runTask2, runTask3 } from "./task-checks.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = 8412 + (process.pid % 50);
const FIXTURES = join(HERE, "fixtures");

let server;
async function startServer() {
  server = spawn(process.execPath, [join(HERE, "serve.mjs"), FIXTURES, String(PORT)], { stdio: "pipe" });
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/ctrl-complete.html`); if (r.ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("fixture server did not start");
}

async function runAll(fixture) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const attempts = [];
  await page.route("**/*", (route) => {
    const u = route.request().url();
    const ok = isLocalRequest(u, PORT);
    attempts.push({ url: u, allowed: ok });
    return ok ? route.continue() : route.abort();
  });
  await page.goto(`http://127.0.0.1:${PORT}/${fixture}`, { waitUntil: "networkidle" });
  const results = {};
  for (const [id, fn] of [["task1", runTask1], ["task2", runTask2], ["task3", runTask3]]) {
    results[id] = await fn(page);
  }
  await browser.close();
  return { results, external: attempts.filter((a) => !a.allowed) };
}

test.before(async () => { await startServer(); });
test.after(() => { server?.kill(); });

// --- POSITIVE controls ---
test("ctrl-complete: all tasks PASS", async () => {
  const { results } = await runAll("ctrl-complete.html");
  for (const k of ["task1", "task2", "task3"]) {
    assert.equal(results[k].status, "PASS",
      `${k} failed on positive control: ${JSON.stringify(results[k].ev?.steps?.filter(s => s.ok === false))}`);
  }
});

test("ctrl-labelledby: edit via aria-labelledby name PASSes", async () => {
  const { results } = await runAll("ctrl-labelledby.html");
  assert.equal(results.task2.status, "PASS", `task2: ${JSON.stringify(results.task2.ev?.steps?.filter(s => s.ok === false))}`);
});

test("ctrl-label-enter: focusable label + Enter opens edit, all PASS", async () => {
  const { results } = await runAll("ctrl-label-enter.html");
  assert.equal(results.task2.status, "PASS", `task2: ${JSON.stringify(results.task2.ev?.steps?.filter(s => s.ok === false))}`);
});

// --- NEGATIVE controls (each mutant must FAIL its target check) ---
test("ctrl-no-all: preventDefault on All link fails task1", async () => {
  const { results } = await runAll("ctrl-no-all.html");
  assert.equal(results.task1.status, "FAIL");
});

test("ctrl-invisible-list: opacity:0 list fails task1", async () => {
  const { results } = await runAll("ctrl-invisible-list.html");
  assert.equal(results.task1.status, "FAIL");
});

test("ctrl-inconsistent: checked/class contradiction fails task1", async () => {
  const { results } = await runAll("ctrl-inconsistent.html");
  assert.equal(results.task1.status, "FAIL");
});

test("ctrl-toggle-noop: self-checking toggle-all fails task3", async () => {
  const { results } = await runAll("ctrl-toggle-noop.html");
  assert.equal(results.task3.status, "FAIL");
});

test("ctrl-focus-sink: focus-to-body commit fails task2", async () => {
  const { results } = await runAll("ctrl-focus-sink.html");
  assert.equal(results.task2.status, "FAIL");
});

test("ctrl-noop-commit: edit that never commits fails task2", async () => {
  const { results } = await runAll("ctrl-noop-commit.html");
  assert.equal(results.task2.status, "FAIL");
});

test("ctrl-dblclick-only: no keyboard affordance fails task2", async () => {
  const { results } = await runAll("ctrl-dblclick-only.html");
  assert.equal(results.task2.status, "FAIL");
});
