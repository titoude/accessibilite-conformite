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
| Budget | max 3 correction rounds, 20 min correction per arm, 60 min pilot |

## Reproduce

```bash
# baseline / final audit of the frozen scope
node harness/audit.whoogle.mjs http://127.0.0.1:5001 \
  --urls /,/search.html,/search?q=test,/window?location=https://example.com \
  --states all --out <out-dir>

# held-out functional/keyboard checks (coordinator-only during the run)
node harness/heldout-checks.mjs http://127.0.0.1:5001 --out <out-dir>

# replay one arm's patch on a clean clone end-to-end
harness/evaluate.sh <workdir> <arm.patch> <out-dir> [expected patch sha256]

# score arm evaluations against the frozen baseline
# argv: score.py [arm ...] --eval-root <dir> --baseline <name> --out <file>
python3 harness/score.py with-skill control \
  --eval-root evaluation --baseline baseline --out evaluation/scores.json

# calibration track
python3 calibration/fetch-cases.py   # downloads + sha256-freezes W3C ACT cases
node calibration/run.mjs             # serves testcases, runs axe per case
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
