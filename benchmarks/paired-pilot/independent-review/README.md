# Independent replay — 28 September 2026

The reviewer reproduced the coordinator's measurements on three fresh application
clones: the original Whoogle commit, the control patch, and the with-skill patch.
Every violation-node identity and every held-out status matched the coordinator's
published replay at [`a42141b`](https://github.com/titoude/accessibilite-conformite/commit/a42141ba96cdc35b8183a7a465354a8298560b2b).
This is replication of the same patches, **not another pair of agent trials**.

| Measurement | Baseline | Control | With skill |
|---|---:|---:|---:|
| Audited scenarios / execution errors | 5 / 0 | 5 / 0 | 5 / 0 |
| axe violation nodes | 108 | 1 | 1 |
| axe incomplete nodes | 8 | 3 | 3 |
| Application tests passed | 33 | 33 | 33 |
| Product checks: PASS / FAIL / NOT_TESTED | 4 / 6 / 3 | 9 / 1 / 3 | 9 / 1 / 3 |
| Instrumentation controls: PASS / total | 5 / 5 | 5 / 5 | 5 / 5 |

Both patches leave the same `color-contrast` violation on the open configuration
panel's `.info-text` and fail `focus_indicator_search_input`. The scorer accepts
the comparison, **not the accessibility of the product**. Both completed scans
exit with code 1 because violations remain. A single pair with the same measured
outcomes cannot establish a benefit from the skill or robustness across models.

The binary bypass check also hides a qualitative difference: the with-skill
patch provides a working skip link, while the control supplies a main landmark.
Matching check statuses do not make the two keyboard experiences equivalent.

## Environment and procedure

- Target: `benbusby/whoogle-search` at `0543f86528678ab60a20b3049483975add6b6e40`.
- Three fresh clones from verified local Git objects, without hardlinks. Both
  published patches passed `git apply --check` before application; patch hashes
  matched the workers' delivered files.
- Application: Ubuntu 24.04 on WSL2, Python 3.12.3. The same **existing frozen
  virtual environment** was reused read-only for all three clones. Dependencies
  were not independently reinstalled for each arm. See [pip-freeze.txt](pip-freeze.txt).
- Browser tools: Windows Node v24.15.0, Playwright 1.63.0, axe-core 4.13.0,
  Chromium 153.0.8010.12, invoked from WSL. These differ from the coordinator's
  OS, Python and Node versions; this is a cross-environment replay.
- Each clone passed its 33 application tests. Each server ran sequentially on
  loopback port 5001; its listening process was checked against the child PID
  before scanning and stopped afterwards.
- The exact published audit runner and held-out checker were used. Effective
  audit arguments: `--urls /,/search.html,/search?q=test,/window?location=https://example.com --states all --wait 500`.
- `WHOOGLE_CSP=0` was identical in all three runs. This does not validate
  production CSP. The live upstream returned no search results: the functional
  search and keyboard journey remain `NOT_TESTED`, as does real browser zoom.
  Assistive technology and dark theme were not tested.

## Inspect or rescore

[provenance.json](provenance.json) records input and artifact SHA-256 hashes.
The `report.json`, `scope.json`, `heldout.json`, status files and scores preserve
the measured bytes. Identity, listener and pytest logs replace the local
workspace path with `<review-workspace>` and normalize line endings.

[comparison-with-devin.json](comparison-with-devin.json) records the comparison
against the coordinator: scenario + rule ID + node selector for each violation,
and check ID + status for each held-out check. It does not assert byte equality
of reports, timestamps, encrypted synthetic search URLs or all evidence text.

From the repository root, with Python 3:

```bash
python -X utf8 benchmarks/paired-pilot/harness/score.py with-skill control \
  --eval-root benchmarks/paired-pilot/independent-review \
  --baseline baseline --out /tmp/independent-pilot-scores.json
```

Use a writable temporary path instead of `/tmp/...` on Windows. Compare that
JSON with [scores.json](scores.json). For a new application replay, follow the
[pilot reproduction instructions](../README.md); the commands above only
rescore existing evidence and do not rerun the browser or application tests.
