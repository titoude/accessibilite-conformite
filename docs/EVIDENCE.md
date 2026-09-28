# Evidence ledger

Toolkit reliability, scanner results, agent effectiveness and human usability are separate claims.

## Current toolkit checks

Run `pnpm test` after the locked installation.

| Check | Evidence | Scope |
| --- | --- | --- |
| Embedded scanner parity | `tests/test_runner_parity.py` | Three orchestration copies equal the source |
| Decision regressions | `tests/test_decisions.py` | 15 tests with subcases: contradictory/missing replay data, base commit, counters, digest, scope transfer, budget and findings |
| Assertion mutants | `tests-validateurs/validateurs.mjs` | 9 deliberately broken cases plus valid controls |
| Real Chromium integration | `tests/browser.test.mjs` | 7 tests with subcases: clean/broken pages, redirects, HTTP, CLI validation, stale evidence and accessible names |
| Teaching demonstration | `tests/demo.test.mjs` | Complete keyboard reservation; 4 corrected states scanned; 320 CSS-pixel reflow and forced-colors operation |

Local verification: Windows, Node 24.15.0, Python 3.12.7, Playwright 1.63.0, axe-core 4.13.0, Chromium 153.0.8010.12. CI repeats the tests on Windows and Linux; inspect the actual checks for the reviewed commit. A workflow file alone is not a successful CI run.

These synthetic regressions demonstrate specific failure rejection, not the absence of every defect.

The [demo](../demo/README.md) preserves its full local reports in `test-results/demo/`. It has three rule violations in the deliberately broken initial state and zero violations/incompletes in four corrected states in the recorded local run. The source was hand-authored with AI assistance. It is not evidence that an isolated coding agent improved over a control.

## Historical corpus

The [V2 report](../RAPPORT-BENCHMARK-V2.md) and [artifacts](../benchmark-v2/) cover Miniflux, Whoogle, FreshRSS, it-tools, RaspAP and Excalidraw.

- Historical reports describe reproducible zero-violation axe results on six scoped projects.
- Three stayed within three rounds; three exceeded the budget.
- Final evaluation found further issues on RaspAP and Excalidraw.
- Installation/patch defects needed [requalification](../RAPPORT-REQUALIFICATION-V2.md).
- Some state definitions were missing and reconstructed for replay.
- V1 artifacts were lost; its larger counts are not reproducible current evidence.

There was no paired control without the skill. These results cannot isolate the skill's contribution from the model, tools or effort. They were not re-run in the current regression suite.

## Open evidence

The [paired pilot](../benchmarks/paired-pilot/RESULTS.md) evaluated one isolated
control agent and one agent receiving the skill at `b415cf39`. Both reduce 108
axe violation nodes to one under the same amended evaluator. Both retain a
focus-indicator failure. Each completes 9 of 13 product checks, with one failing
and three untested; five additional instrumentation controls pass in every run.

A [reviewer replay](../benchmarks/paired-pilot/independent-review/README.md)
matches violation-node identities and held-out statuses on three fresh Whoogle
clones using the same existing frozen Python environment. Its OS/Python/Node
versions differ from the coordinator's. It is replication of the same patches,
not another pair of model trials.

The with-skill worker reported zero violations; both independent replays found
one. Neither an agent's conclusion nor a successful comparison verdict changes
the measured residual failures into a pass. The experiment retains the original
baseline, post-dispatch evaluator amendments and self-report discrepancies.

The current skill now explicitly addresses settled dynamic states and checks
keyboard focus even when axe is clean. These refinements follow the pilot;
**their effect has not been measured in a new controlled trial**. The original
[treatment files](../benchmarks/paired-pilot/treatment/) remain unchanged.

| Question | Status |
| --- | --- |
| Improvement over an otherwise identical agent? | One pair, no separation on measured outcomes; no general benefit established |
| Robustness with weaker models? | NOT_TESTED |
| Scanner behavior on recognized reference cases? | Selected W3C ACT cases; see per-case outcomes and limits in the [calibration report](../benchmarks/paired-pilot/RESULTS.md) |
| Actual assistive-technology user tasks? | NEEDS_HUMAN_REVIEW |
| Full corpus WCAG/RGAA conformance? | NOT_ESTABLISHED |
| Opethon eligibility of earlier work? | Organizer ruling required |

[ACT Rules](https://www.w3.org/WAI/standards-guidelines/act/rules/) provide reference cases. A selected subset is not a full WCAG audit, and scanner calibration is not an agent-remediation benchmark.

## Accepting a new result

Freeze commits, tools, manifest, evaluator and prompts before either arm. Isolate workers, give them identical tools/budgets, and prevent the control from seeing the skill or sibling outputs. Replay source patches on fresh clones. Preserve failures, incompletes, timeouts and regressions.

Require raw reports and an executable harness. Hashes prove identity, not truth. The metadata validator rejects contradictions but cannot replace an independent replay of actual files.

The optional V3 adapter requires the configured runner, frozen manifest and replay commands in the delivered patch. Its independent evaluator receives the declared final scope, preserves the configured states and returns `NOT_TESTED` when replay inputs are missing. Prompt regression tests verify scope transfer; they do not establish that every agent follows these instructions.

Publish per-project results before totals. Mark unavailable model/cost data honestly. One pair is a pilot, not statistical evidence of general effectiveness.
