// Task-pilot evaluator runner. Boots chromium against the served app,
// applies the local-only request policy, runs the three frozen task
// journeys + axe scans, writes report.json / scope.json.
// Usage: node audit.todo.mjs <appUrl> <outDir> <port> [fixtureDir]
// Exit codes: 0 ok, 1 execution/navigation failure, 2 usage.
import { chromium } from "@playwright/test";
import { createRequire } from "node:module";
import { readFileSync, mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { isLocalRequest } from "./net-policy.mjs";
import { runTask1, runTask2, runTask3, TASK_IDS } from "./task-checks.mjs";

const [appUrl, outDir, portArg, fixtureDir] = process.argv.slice(2);
if (!appUrl || !outDir || !portArg) {
  console.error("usage: node audit.todo.mjs <appUrl> <outDir> <port> [fixtureDir]");
  process.exit(2);
}
const PORT = Number(portArg);
const HERE = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
// Fresh output: never let a stale report/scope survive a failed run.
for (const f of ["report.json", "scope.json"]) {
  try { unlinkSync(join(outDir, f)); } catch {}
}

// Resolve axe-core from the PILOT repo's pinned root install — never from
// the target's cwd (evaluate.sh runs this file from the cloned todomvc dir).
const PILOT_ROOT = resolve(fileURLToPath(new URL("../../..", import.meta.url)));
const require = createRequire(join(PILOT_ROOT, "package.json"));
const axePath = require.resolve("axe-core/axe.min.js");
const axeSource = readFileSync(axePath, "utf8");
const AXE_VERSION = JSON.parse(readFileSync(require.resolve("axe-core/package.json"), "utf8")).version;
const PW_VERSION = JSON.parse(readFileSync(require.resolve("playwright/package.json"), "utf8")).version;

const browser = await chromium.launch();
const page = await browser.newPage();
const networkAttempts = [];
await page.route("**/*", async (route) => {
  const url = route.request().url();
  const allowed = isLocalRequest(url, PORT);
  networkAttempts.push({ url, allowed });
  if (!allowed) return route.abort();
  return route.continue();
});

const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e)));

// Frozen task definitions hash — covers the actual contract code, not
// just the task-id list.
const frozenHash = createHash("sha256")
  .update(readFileSync(join(HERE, "task-checks.mjs")))
  .update(readFileSync(join(HERE, "net-policy.mjs")))
  .digest("hex");

const report = {
  runId: createHash("sha256").update(`${Date.now()}-${Math.random()}`).digest("hex").slice(0, 16),
  target: "tastejs/todomvc examples/javascript-es5",
  pin: "ff43b02e59dfa604386bb382034b2cd07c2bcd8a",
  url: appUrl,
  versions: { axe: AXE_VERSION, playwright: PW_VERSION, chromium: browser.version(), node: process.version },
  tasks: [],
  axe: null,
  network_attempts: networkAttempts,
  page_errors: pageErrors,
};

let fatal = null;

// Verify the URL actually responds AND serves the expected application
// document — HTTP 200 on the wrong page must not be scanned.
const nav = await page.goto(appUrl, { waitUntil: "networkidle" }).catch((e) => {
  fatal = `goto failed: ${e.message}`;
  return null;
});
if (!fatal) {
  if (!nav || !nav.ok()) fatal = `app did not return HTTP 2xx (status ${nav?.status()})`;
  else {
    const isApp = await page.evaluate(() =>
      !!document.querySelector(".todoapp") && !!document.querySelector(".new-todo"));
    if (!isApp) fatal = "served document is not the expected todo application";
  }
}

async function runAxe() {
  // Re-inject after any navigation/reload — addScriptTag does not persist.
  if (!(await page.evaluate(() => typeof axe !== "undefined"))) {
    await page.addScriptTag({ content: axeSource });
  }
  return page.evaluate(async () => {
    const out = await axe.run(document, { resultTypes: ["violations", "incomplete"] });
    return {
      violations: out.violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
      incomplete: out.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })),
      raw_violations: out.violations,
      raw_incomplete: out.incomplete,
      testEngine: out.testEngine,
    };
  });
}

if (!fatal) {
  await page.waitForTimeout(400);
  try { report.axe = await runAxe(); }
  catch (e) { fatal = `initial axe failed: ${e}`; report.axe = { error: String(e) }; }
}

if (!fatal) {
  for (const [id, fn] of [["task1_add_complete_filter", runTask1], ["task2_keyboard_edit", runTask2], ["task3_toggle_clear", runTask3]]) {
    const r = await fn(page).catch((e) => ({ status: "ERROR", ev: { error: String(e) } }));
    report.tasks.push({ id, status: r.status, evidence: r.ev });
    if (r.status === "ERROR") fatal = `task ${id} execution error`;
  }
  // Task journeys reload the page — re-inject axe for the final scan.
  try { report.axe_final = await runAxe(); }
  catch (e) { fatal = `final axe failed: ${e}`; report.axe_final = { error: String(e) }; }
}

// Execution failures that make the measurement untrustworthy → nonzero.
const aborted = networkAttempts.filter((n) => !n.allowed);
if (!fatal && pageErrors.length) fatal = `page errors: ${pageErrors.length}`;
if (!fatal && aborted.length) fatal = `${aborted.length} aborted external request(s)`;
report.fatal = fatal;

const scope = {
  runId: report.runId,
  url: appUrl,
  pin: report.pin,
  tasks: TASK_IDS,
  contract: "benchmarks/task-pilot/manifest.json",
  statesHash: frozenHash,           // sha256(task-checks.mjs + net-policy.mjs)
  versions: report.versions,
};

writeFileSync(join(outDir, "report.json"), JSON.stringify(report, null, 2));
writeFileSync(join(outDir, "scope.json"), JSON.stringify(scope, null, 2));

const summary = Object.fromEntries(report.tasks.map((t) => [t.id, t.status]));
console.log(JSON.stringify({
  tasks: summary,
  axe_initial: report.axe?.violations,
  axe_final: report.axe_final && (report.axe_final.violations ?? report.axe_final),
  external_requests: aborted,
  page_errors: pageErrors,
  fatal,
}, null, 2));
await browser.close();
if (fatal) {
  console.error(`FATAL: ${fatal}`);
  process.exit(1);
}
