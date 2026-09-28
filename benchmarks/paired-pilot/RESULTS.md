# Paired-pilot RESULTS

Measured results of the paired WITH/WITHOUT-skill remediation pilot on
`benbusby/whoogle-search` @ `0543f86528678ab60a20b3049483975add6b6e40`,
plus the offline calibration of the pinned scanner (axe-core 4.13.0) against
105 selected W3C ACT Rules test cases.

**Read this as measurements, not conclusions.** One pair of runs on one app at
one commit; no causal or statistical claim is made or supported. A zero-violation
audit is not WCAG/RGAA conformance; `NOT_TESTED` entries below are unchecked, not
passed. Self-reported worker numbers are labelled as such and never pooled with
evaluator measurements.

## Environment (evaluator box)

| pin | value |
|---|---|
| OS | Ubuntu 22.04 (devin-box, x86_64) |
| python | 3.10.12 (frozen venv, `harness/whoogle-frozen-requirements.txt` — 46 transitive pins) |
| node | v20.18.1 |
| playwright / @playwright/test | 1.63.0 |
| axe-core | 4.13.0 |
| target | benbusby/whoogle-search @ 0543f86528678ab60a20b3049483975add6b6e40 |
| env deviation | `WHOOGLE_CSP=0` (identical for baseline and both arms; production CSP behaviour NOT validated) |
| effective audit args | `--urls /,/search.html,/search?q=test,/window?location=https://example.com --states all --wait 500` |

`--wait 500` is an evaluator-v3 amendment (post-dispatch): the config-panel state
has a 0.2 s max-height transition and axe ran before it settled (94 vs 100 vs 108
nodes on identical commands). `scopeHash`/`statesHash` do not encode `--wait`, so
the effective args are recorded explicitly here and in `provenance.json`.
The frozen runner bytes are unchanged; `--wait` re-applies after state setup.

## Track 1 — calibration (offline, scanner-only)

105 official W3C ACT test cases fetched from the wcag-act-rules repo
(`calibration/cases.json`, per-case source URL + blob sha256 verified before
each scan; assets served at original `/WAI/content-assets/...` paths).
Mapping used the public API: `axe.getRules().filter(r => (r.actIds||[]).includes(actId))`.

| outcome | count |
|---|---|
| agree_fail (expected failed → mapped rule(s) flagged the fixture) | 39 |
| consistent_no_violation (expected passed/inapplicable → no mapped violation) | 62 |
| divergent | 0 |
| unscorable (non-HTML fixture: 2 SVG → `addScriptTag` fails, 1 XML → browser download) | 3 |
| unsupported_external_dependency (`c487ae/7b3b94c0` fetches `img src` from github.com — unresolvable offline) | 1 |
| execution error | 0 |

Reported as **105 attempted / 101 scored / 0 divergent** — NOT "105/105 agreement".
The runner enforces a local-only request policy (`calibration/net-policy.mjs`,
regression-tested by `calibration/test-net-policy.mjs`): every non-local
request is aborted AND recorded per case as `network_attempts`. Fetched
external refs (src=, link href=) make a case `unsupported_external_dependency`
rather than a partial replay; inert refs (`a href`, form action) are recorded
as `external_references_inert` and never fetched. The 3 unscorable cases are
kept visible; inapplicability is never inferred from absence of a violation.
The split was independently reproduced by the reviewer (105 fixture + 5 asset
hashes match). Mapped-rule results preserve the **verbatim** axe output
(`raw_axe_mapped`, incl. testEngine/passes/inapplicable); the all-rules context
run is summarized and labelled `raw_axe_all_rules_summary`. Cases whose axe rule
map is empty stay `unsupported_no_axe_mapping` — no fallback scan.

This track measures only the selected scanner rules. It says nothing about the
remediation skill.

## Track 2 — paired remediation pilot

Two isolated child sessions, each receiving its own frozen prompt verbatim
(`prompts/arm-with-skill.rendered.md` / `prompts/arm-control.rendered.md`,
assembled at commit `271ba8e` — the two prompts are NOT identical to each
other; they share the frozen runner, scope, tools and budgets). The WITH arm
additionally received the verbatim treatment files from PR #1 @ `b415cf39`;
the control prompt is neutral and contains no skill material, no expected
fixes, no held-out detail.

| | baseline | control | with-skill |
|---|---|---|---|
| worker session | — | devin-8f0c038c24ad4eb9b8376e85f73c56b1 | devin-e082328e303f4e0c90dca09d1e8b19e9 |
| patch sha256 | — | `37c64103…` | `278d30dd…` |
| rounds used (self-reported, unverified) | — | 3 (exhausted) | 2 |
| correction minutes (self-reported, unverified — never independently measured) | — | 14.0 | 18.0 |
| patch applies cleanly on pinned clone | — | yes | yes |
| install / pytest / boot | — | pass / 33-33 / pass | pass / 33-33 / pass |
| axe violation nodes (evaluator replay) | 108 | **1** | **1** |
| violation rules remaining | 10 rules | color-contrast | color-contrast |
| new violation rules | — | none | none |
| incomplete | 8 | 3 | 3 |
| audit_exit | 1 | 1 | 1 |
| heldout PASS/FAIL/NOT_TESTED (18 total = 13 product checks + 5 instrumentation controls) | 9 / 6 / 3 | 14 / 1 / 3 | 14 / 1 / 3 |
| heldout instrumentation controls (5 of the 18) | all PASS | all PASS | all PASS |
| comparison verdict (score.py v2) | — | OK | OK |

Scope integrity: `scopeHash` and `statesHash` identical across baseline and both
replays; scenario sets 1:1; `errored=0`; replay evidence (patch identity, apply,
install, boot) verified by `eval-status.env`.

Residual in **both** arms: 1 `color-contrast` node on
`<span class="info-text">` (config-panel "Replaces Twitter/YouTube…" text) —
identical remaining defect, independently measured.

Held-out improvements (both arms, identical set): `bypass_mechanism`,
`config_fields_named`, `document_title_search_page`, `html_lang_home`,
`search_input_accessible_name`.
Held-out still failing (both arms): `focus_indicator_search_input` — no
computed-style focus change on the search input; a real residual defect neither
arm fixed.
Held-out regressions: none in either arm.

### Measured vs self-reported

- Control self-reported 100→1 nodes with the residual on `/window` footer link;
  the evaluator replay found 1 node but on the config-panel `.info-text` span.
  Counts agree; the failing node identity does not — treated as a self-report
  discrepancy, not silently merged.
- With-skill self-reported 100→**0** nodes; replay measured **1** (same
  `.info-text` span). Discrepancy recorded; the self-report is kept under
  `arms/with-skill/worker-reported/`, the replay under `evaluation/with-skill/`.
- Workers' baseline counts (100 nodes) differ from evaluator baseline (108) —
  the known config-panel timing instability; all comparisons use evaluator
  replays only.

## NOT_TESTED / not measured

- `keyboard_search_journey`, `search_results_functional`: whoogle proxies live
  Google; upstream returned 0 `.result` elements → NOT_TESTED (never PASS).
- `zoom_200`: CDP page-scale ≠ real browser zoom → NOT_TESTED.
- Assistive-technology behaviour (screen readers): not tested anywhere.
- Dark-theme contrast pair, pages outside the frozen scope: not audited.
- Exact model identifiers of the child sessions: unobservable → recorded
  unavailable. Child-session wall-clock UI showed ~26 min each (setup included);
  correction budgets measured separately (14.0 / 18.0 min, both < 20 cap).

## Deviations disclosed

1. Child `devin-a427d9b21d394285b5e2f15576e08d62` was created then terminated
   pre-work (0 ACU) — scheduling artifact, no experiment output. Arms are the
   two sessions above.
2. Evaluator amendment v3 **after** worker dispatch (prompts unchanged):
   `--wait 500` settled-state fix, `--wait` timing recorded; baseline + both arms
   replayed identically under v3. The v1-protocol baseline (94 nodes) is
   preserved unmodified in `evaluation/baseline-v1-protocol/`.
3. `score.py`/`test_score.py` evaluator revision: cherry-picked reviewer-tested
   commit `796add9eb302e522d7c6339d4c883cbae40f03d8` (30 tests pass here;
   accepts exit-1 partial scans, validates baseline page set/counters/heldout
   evidence on both sides, gates deltas on integrity + coverage loss). Its
   predecessor scored both arms NOT_COMPARABLE solely on `audit_exit=1`.
4. `WHOOGLE_CSP=0` environment deviation (identical everywhere).
5. Worker prompts frozen at `271ba8e`; evaluation runs used the committed
   harness only — no worker output was trusted as evidence.

## Independent verification

Reviewer replay (separate OS/toolchain — WSL Python 3.12.3, Node 24.15,
Chromium 153) reproduced every measurement: same counts, same violation-node
identities, same held-out statuses; published under
`independent-review/` (commit `8925c3c` on branch `codex/pilot-independent-review`,
cherry-picked into this PR; artifacts byte-preserved, unmodified).

## Reproduce

```bash
# scoring
python3 harness/score.py with-skill control \
  --eval-root evaluation --baseline baseline --out evaluation/scores.json
python3 harness/test_score.py            # 30 tests

# evaluator replay of one arm
bash harness/evaluate.sh <new-clone-dir> arms/<arm>/worker-patch.diff \
  evaluation/<arm>-rerun <patch-sha256>

# calibration
python3 calibration/fetch-cases.py && node calibration/run.mjs
```

## Limitations

- n=1 pair on one app/commit → no causal claim about the skill; identical
  residual + identical heldout deltas mean this pilot cannot separate the arms.
- Held-out checks are computed-style/functional signals, not assistive-tech
  proof; `focus_indicator` asserts a perceivable computed delta only.
- Timing instability around `.content.open` (0.2 s transition) is mitigated by
  `--wait 500`, not proven eliminated — a single `--wait` value, no sweep.
- Self-reported worker data is preserved but unverified beyond the listed
  patch-sha/scope checks.
