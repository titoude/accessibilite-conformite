# paired-pilot — reproducible accessibility benchmark pilot

Bounded evidence experiment on a frozen target. Two tracks:

1. **Calibration** (`calibration/`) — how well the scanner rules used by the
   audit runner agree with official W3C ACT Rules test cases. Measures the
   *scanner*, not the remediation skill.
2. **Paired remediation pilot** (`arms/`, `evaluation/`) — two isolated worker
   sessions remediate the same app commit under identical scope/tools/budget;
   the only difference is that one arm receives the SKILL.md protocol.
   A separate coordinator replays both patches on clean clones and scores them
   with held-out functional/keyboard checks.

## Frozen inputs (see `manifest.json` + `provenance.json`)

| What | Value |
|---|---|
| Target | `benbusby/whoogle-search` @ `0543f86528678ab60a20b3049483975add6b6e40` |
| Scope | routes `/`, `/search.html`, `/search?q=test`, `/window?location=https://example.com` + state `config-panel` |
| Boot | `WHOOGLE_CSP=0 .venv/bin/python -um app --host 127.0.0.1 --port 5001` (CSP deviation is required for axe injection; production CSP NOT validated) |
| Scanner | `harness/audit.whoogle.mjs` = audit.mjs v5 @ `b415cf39` + frozen `STATES` |
| Treatment | `treatment/` = SKILL.md + assertions.mjs + checklist.md @ `b415cf39` (PR #1) |
| Tools | node v20.18.1, npm 10.8.2, playwright + @playwright/test 1.63.0, axe-core 4.13.0, python 3.10 |
| Budget | max 3 correction rounds, 20 min correction per arm; 60 min was a progress checkpoint, not a total cap |

## Reproduce

All commands run from the repo root (no `cd` into the pilot dir — run.mjs
resolves deps via `createRequire(process.cwd()/package.json)`, so cwd must
be the repo root). Node deps: `pnpm install --frozen-lockfile --ignore-scripts`
at root (playwright 1.63.0, axe-core 4.13.0); python deps from
`benchmarks/paired-pilot/harness/whoogle-frozen-requirements.txt`. The audit
invocation includes the evaluator-v3 `--wait 500` settled-state fix.

```bash
# baseline / final audit of the frozen scope (v3 args)
node benchmarks/paired-pilot/harness/audit.whoogle.mjs http://127.0.0.1:5001 \
  --urls /,/search.html,/search?q=test,/window?location=https://example.com \
  --states all --wait 500 --out <out-dir>

# held-out functional/keyboard checks (coordinator-only during the run)
node benchmarks/paired-pilot/harness/heldout-checks.mjs \
  http://127.0.0.1:5001 --out <out-dir>

# replay one arm's patch on a clean clone end-to-end
# (clone-dir must not exist; port must be free; frozen pip + npm ci)
bash benchmarks/paired-pilot/harness/evaluate.sh \
  <new-clone-dir> benchmarks/paired-pilot/arms/<arm>/worker-patch.diff \
  <out-dir> <patch-sha256>

# score arm evaluations against the frozen baseline
python3 benchmarks/paired-pilot/harness/score.py with-skill control \
  --eval-root benchmarks/paired-pilot/evaluation \
  --baseline baseline --out benchmarks/paired-pilot/evaluation/scores.json
python3 benchmarks/paired-pilot/harness/test_score.py   # 30 tests

# calibration track — reproduces from the COMMITTED frozen corpus
# (cases.json + testcases/ + test-assets/ are sha256-pinned; do NOT run
# fetch-cases.py for reproduction — it re-downloads mutable upstream and
# exists only to refresh the corpus)
node benchmarks/paired-pilot/calibration/run.mjs
node --test benchmarks/paired-pilot/calibration/test-net-policy.mjs   # 9 tests
```

## Rules of the experiment

- Harness + manifest + prompts were frozen (sha256 in `provenance.json`)
  **before** either worker session was created.
- Workers are isolated child sessions: no access to this repository, no prior
  patches/results, no sibling-arm knowledge. Control gets a neutral task with
  identical tools/scope/budget and NO skill material.
- Held-out checks use Playwright `toHaveAccessibleName` on exact locators plus
  explicit declared-label checks — never the old `accName` extractor
  (reproduced false positives/negatives).
- A live search-engine error/empty-results page is `NOT_TESTED`, never `PASS`.
- `benchmark-v3.py` CONFIRMED verdicts are not ground truth.
- No causal/statistical generalization from a single pair; worker model
  identifiers and ACU budgets are recorded as unavailable if not observable.

See `RESULTS.md` for measured outcomes vs `NOT_TESTED` items.
