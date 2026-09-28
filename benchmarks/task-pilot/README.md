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
- `treatment/` — dependency-complete bundle verbatim from `f7fb27e` at
  original relative paths: `SKILL.md`, `checklist.md`, `audit.mjs`,
  `README.md`, `templates/{README.md,wcag-2.2-aa.csv}`,
  `docs/RELEASE-READINESS.md`, `tests-validateurs/assertions.mjs`
  (8 files, sha256 in `provenance.json`).
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
BASELINE_OUT="$(mktemp -d /tmp/taskpilot-baseline.XXXXXX)"
bash benchmarks/task-pilot/harness/evaluate.sh - "$BASELINE_OUT"

# evaluate a worker patch — the patch path must be ABSOLUTE (the script
# clones into mktemp and relatives resolve inside the clone, not your cwd);
# use a fresh, unique output directory per run and run evaluations SERIALLY
# (a second concurrent run trips the server's port-ownership check)
CONTROL_OUT="$(mktemp -d /tmp/taskpilot-control.XXXXXX)"
bash benchmarks/task-pilot/harness/evaluate.sh "$PWD/benchmarks/task-pilot/arms/control/worker-patch.diff" "$CONTROL_OUT"
```

The wrapper requires Linux or WSL with Git, npm, Bash, curl, `ss` and
`sha256sum`, plus the installed Chromium dependencies. The Node evaluator
and its tests also run on Windows. Do not reuse an output directory or run
two evaluations on the same port; inspect the exit status and raw logs.

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
timeout. Workers ran the **inherited preset** (`devin_mode` omitted); the
platform returned effective mode `swe-2-max` for both. A prior Lite request
was rejected at platform preflight (HTTP 400, zero sessions created —
recorded in `manifest.json` → `worker_config.lite_rejection`); the
substitution was a supervising-reviewer decision under the user's
delegation, not a weaker-model claim.

## Trial results (Phase B, frozen evaluator eb71eb5 — see `arms/EVALUATION.md`)

| arm | rounds | task1 | task2 | task3 |
|-----|--------|-------|-------|-------|
| control | 1 | PASS | PASS | PASS |
| treatment | 2 | PASS | PASS (r2) | PASS |

Final task outcomes are equal; initial outcomes differed (control 3/3 on
round 1, treatment 2/3 then corrected after identical step-status feedback).
Residual axe findings are identical across both arms and **reported
separately** from the task checks — initial `heading-order`×1,
`landmark-one-main`×1, `region`×1; final `heading-order`×1, `label`×2,
`region`×3 — they are contextual axe output, not the custom task contract,
and AT/zoom remain `NOT_TESTED`.

An [independent Windows replay](independent-review/README.md) reproduces
the baseline and all three submitted patches, including the failed first
treatment submission. Its raw reports and executable comparison are public.
