# task-pilot — paired keyboard-task benchmark on offline TodoMVC

Exploratory follow-up to `benchmarks/paired-pilot` (whoogle). That pilot left
key tasks untested (live Google) and its single pair showed no arm separation;
this pilot measures **complete user-task outcomes** on a fully-offline real
application instead of an axe-only score.

This is an **exploratory probe, not ACT calibration** — the three journeys are
documented keyboard interaction patterns, not ACT rules, and the fixture pages
under `harness/fixtures/` are evaluator-owned **synthetic** controls, not app
code. One pair; no causal claims.

## Layout

- `manifest.json` — the frozen protocol: target pin, arms, worker config,
  evaluation contract, controls, baseline result, limits.
- `prompts/arm-task-skill.md`, `prompts/arm-task-control.md` — per-arm prompts;
  the task-requirement text is identical, only the skill preamble differs.
- `treatment/` — verbatim `SKILL.md`, `checklist.md`,
  `tests-validateurs/assertions.mjs` from `f7fb27e` (+ `provenance.json` sha256).
- `harness/` — `evaluate.sh` (fresh clone → pin → `npm ci --omit=dev
  --ignore-scripts` → serve repo root → audit), `serve.mjs` (zero-dep static
  server), `net-policy.mjs` (only `http://127.0.0.1:<port>` + `about:/data:/
  blob:`), `audit.todo.mjs` (runner), `task-checks.mjs` (three journeys),
  `test-controls.mjs` + `test-cli.mjs` (the gate).
- `harness/fixtures/` — synthetic controls: 4 positive variants (incl. a
  700ms delayed-render one) and 10 negative mutants covering every
  reviewed false-accept (broken filters, invisible list, checked/class
  contradiction, self-checking toggle-all, focus sink, no-commit edit,
  dblclick-only, survivor relabel, data-id replacement on filter/clear),
  plus isolated `cli-*` fixtures for the CLI fatal gate.
- `baseline/run-3-node22/` — raw measured baseline at committed head `eb71eb5` on Node v22.23.3 (report.json, scope.json, eval-status.env, logs).

## Reproduce (from repo root, pinned deps via `pnpm install --frozen-lockfile --ignore-scripts`)

```sh
# run the control + CLI gates
pnpm test:task-pilot

# re-run the baseline (fresh clone of tastejs/todomvc @ ff43b02e)
bash benchmarks/task-pilot/harness/evaluate.sh - /tmp/taskpilot-baseline

# evaluate a worker patch
bash benchmarks/task-pilot/harness/evaluate.sh path/to/worker-patch.diff /tmp/taskpilot-eval
```

`audit.todo.mjs` exits nonzero on any execution-level failure (navigation,
axe, page errors, aborted external requests, task ERROR) and always writes a
fresh `report.json` + `scope.json` (`statesHash` = sha256 of the frozen
task-checks + net-policy sources).

## Evaluation contract (summary — see manifest.json for the frozen text)

- Only real `page.keyboard` events count; DOM `focus()`/programmatic
  `click()`/seeded outcomes are not keyboard success.
- Edit affordance is discovered by trying a named `/edit/i` control → `F2` →
  `Enter`/`Space` on a non-checkbox descendant of the item. Any of these
  satisfies the contract — it is a **custom benchmark contract, not a
  normative WCAG requirement**.
- Items are tracked by `data-id` + label text; checkbox `checked` and
  `completed` class must agree; visibility is ancestor-aware
  (`checkVisibility` including `opacity`); filter steps assert exact visible
  identities; task3 survivors must keep id+text through toggle-all and the
  Completed filter.
- Focus after commit/cancel must land on a visible semantic control in the
  same item — never `BODY`.
- `MemoryStorage` reload reset is recorded as **baseline behavior**
  (`reloadReset`, unscored) — persistence is not required.
- Live-region DOM metadata is a semantic signal only; AT announcements and
  zoom are `NOT_TESTED`.

## Budgets (for approved trials)

Max 3 correction rounds, 20-minute session wall-time per arm **including
setup**, measured from platform event timestamps; partial patch preserved on
timeout. Workers run the inherited preset (`devin_mode` omitted — parent
SWE-2); a Lite request was rejected at platform preflight (HTTP 400, zero
sessions — recorded in `manifest.json` → `worker_config.lite_rejection`).
Requested vs. returned/effective mode is still recorded separately per arm,
and dispatch stops if the presets differ.
