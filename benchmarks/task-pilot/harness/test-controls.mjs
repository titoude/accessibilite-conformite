// Control regression: runs the SAME task checks the evaluator uses against
// the synthetic fixtures, asserting the expected verdicts. Guards against
// degenerate always-PASS checks and accidental evaluator regressions.
// Usage: node --test harness/test-controls.mjs   (from repo root, after
// `pnpm install --frozen-lockfile --ignore-scripts`)
import { test } from "node:test";
import assert from "node:assert";
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isLocalRequest } from "./net-policy.mjs";
import { runTask1, runTask2, runTask3 } from "./task-checks.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = 8412 + (process.pid % 50);
const FIXTURES = join(HERE, "fixtures");

let server;
async function startServer() {
  server = spawn(process.execPath, [join(HERE, "serve.mjs"), FIXTURES, String(PORT)], { stdio: "pipe" });
  for (let i = 0; i < 50; i++) {
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
  const t1 = await runTask1(page);
  const t2 = await runTask2(page);
  const t3 = await runTask3(page);
  await browser.close();
  return { t1: t1.status, t2: t2.status, t3: t3.status, external: attempts.filter((a) => !a.allowed) };
}

test.before(async () => { await startServer(); });
test.after(() => { server?.kill(); });

test("positive control: fully-working todo passes all three tasks", async () => {
  const r = await runAll("ctrl-complete.html");
  assert.equal(r.t1, "PASS", JSON.stringify(r.t1));
  assert.equal(r.t2, "PASS");
  assert.equal(r.t3, "PASS");
});

test("negative control: dblclick-only editing fails task2", async () => {
  const r = await runAll("ctrl-dblclick-only.html");
  assert.equal(r.t2, "FAIL", "task2 must FAIL when no keyboard edit affordance exists");
  assert.equal(r.t1, "PASS");
});
