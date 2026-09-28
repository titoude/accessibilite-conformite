// Task-pilot evaluator runner. Boots chromium against the served app,
// applies the local-only request policy, runs the three frozen task
// journeys + an axe scan, writes report.json / scope.json.
// Usage: node audit.todo.mjs <appUrl> <outDir> <port> [fixtureDir]
import { chromium } from "@playwright/test";
import { createRequire } from "node:module";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { isLocalRequest } from "./net-policy.mjs";
import { runTask1, runTask2, runTask3, TASK_IDS } from "./task-checks.mjs";

const [appUrl, outDir, portArg, fixtureDir] = process.argv.slice(2);
if (!appUrl || !outDir || !portArg) {
  console.error("usage: node audit.todo.mjs <appUrl> <outDir> <port> [fixtureDir]");
  process.exit(2);
}
const PORT = Number(portArg);
mkdirSync(outDir, { recursive: true });

// Resolve axe-core from the PILOT repo's pinned root install — never from
// the target's cwd (evaluate.sh runs this file from the cloned todomvc dir).
const PILOT_ROOT = resolve(new URL("../../..", import.meta.url).pathname);
const require = createRequire(join(PILOT_ROOT, "package.json"));
const axePath = require.resolve("axe-core/axe.min.js");
const axeSource = readFileSync(axePath, "utf8");
const AXE_VERSION = JSON.parse(readFileSync(require.resolve("axe-core/package.json"), "utf8")).version;

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

const report = {
  runId: createHash("sha256").update(`${Date.now()}-${Math.random()}`).digest("hex").slice(0, 16),
  target: "tastejs/todomvc examples/javascript-es5",
  pin: "ff43b02e59dfa604386bb382034b2cd07c2bcd8a",
  url: appUrl,
  axeVersion: AXE_VERSION,
  tasks: [],
  axe: null,
  network_attempts: networkAttempts,
  page_errors: pageErrors,
};

await page.goto(appUrl, { waitUntil: "networkidle" }).catch((e) => {
  pageErrors.push(`goto: ${e.message}`);
});
await page.waitForTimeout(400);

// axe scan at initial state (mapped rules + full summary)
try {
  await page.addScriptTag({ content: axeSource });
  const res = await page.evaluate(async () => {
    const out = await axe.run(document, {
      resultTypes: ["violations", "incomplete"],
    });
    return {
      violations: out.violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
      incomplete: out.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })),
      raw_violations: out.violations,
      raw_incomplete: out.incomplete,
      testEngine: out.testEngine,
    };
  });
  report.axe = res;
} catch (e) {
  report.axe = { error: String(e) };
}

// frozen task order
for (const [id, fn] of [["task1_add_complete_filter", runTask1], ["task2_keyboard_edit", runTask2], ["task3_toggle_clear", runTask3]]) {
  const r = await fn(page).catch((e) => ({ status: "ERROR", ev: { error: String(e) } }));
  report.tasks.push({ id, status: r.status, evidence: r.ev });
}

// post-task axe at final state
try {
  const res2 = await page.evaluate(async () => {
    const out = await axe.run(document, { resultTypes: ["violations"] });
    return out.violations.map((v) => ({ id: v.id, nodes: v.nodes.length }));
  });
  report.axe_final = res2;
} catch (e) { report.axe_final = { error: String(e) }; }

const scope = {
  runId: report.runId,
  url: appUrl,
  pin: report.pin,
  tasks: TASK_IDS,
  contract: "benchmarks/task-pilot/manifest.json",
  statesHash: createHash("sha256").update(JSON.stringify(TASK_IDS)).digest("hex"),
};

writeFileSync(join(outDir, "report.json"), JSON.stringify(report, null, 2));
writeFileSync(join(outDir, "scope.json"), JSON.stringify(scope, null, 2));

const summary = Object.fromEntries(report.tasks.map((t) => [t.id, t.status]));
const aborted = networkAttempts.filter((n) => !n.allowed);
console.log(JSON.stringify({
  tasks: summary,
  axe_initial: report.axe?.violations,
  axe_final: report.axe_final,
  external_requests: aborted,
  page_errors: pageErrors,
}, null, 2));
await browser.close();
