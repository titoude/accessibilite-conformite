# Independent replay of the TodoMVC pair

Codex replayed the baseline and every submitted patch on Windows on
28 September 2026. The coordinator's published task/step statuses, axe rule
counts, violation-node targets and HTML, incomplete counts and execution gates
match. This replays the same patches; it is not another pair of agent trials.

| Candidate | Add / complete / filter | Keyboard edit | Toggle / clear |
| --- | --- | --- | --- |
| Unmodified baseline | PASS | FAIL | FAIL |
| Control, round 1 | PASS | PASS | PASS |
| Treatment, round 1 | PASS | FAIL | PASS |
| Treatment, round 2 | PASS | PASS | PASS |

The treatment initially lost visible focus after committing and cancelling
an edit. Its second patch corrected this. The control passed on its first
submission. Final task outcomes are equal; this pair does not establish a
skill advantage.

## What was replayed

- Target: `tastejs/todomvc`, commit
  `ff43b02e59dfa604386bb382034b2cd07c2bcd8a`, `examples/javascript-es5`.
- Trial dispatch freeze: `dee0f5a8c6be8b01ced6d7fcc6011a1728440d12`.
  Its harness, fixtures, prompts and treatment files remained unchanged
  through the reviewed publication at `e581a58893c5d56b8310c0397275ff9c48cf6f96`.
- Worker artifact checkpoint:
  `085954c12dcc9ca6bcbded343e2fb9869ef92fdb`.
- The reviewer used a raw Git archive of `bdef03d69e7f8a49044debdaa15725f4a9bce011`
  for patch replays. Baseline replay used `820e05e5cafadf1f2f5924daeaef034a1e00cb1e`;
  the task and network-policy bytes have the same frozen hash.
- Combined task/network-policy SHA-256:
  `b275169de410868e5740537e63333ad18923ddb1386974a295eb679a7c91f056`.

| Patch | SHA-256 |
| --- | --- |
| Control round 1 | `b599a61a87171d4fc83bc0d59608d9ac3e6326312417649b0f43dd94ab836787` |
| Treatment round 1 | `d235b1b26301c999d8cd63d1c88cb95f99483132e44da361f3211a4e59470848` |
| Treatment round 2 | `73a980a248dcbb273731216c0d2733bb0e695d52b616ed18db33d05eb8b3fbb4` |

Each patch applied cleanly to a separate fresh upstream clone at the pin.
Only the target's two locked production dependencies were installed using
`npm ci --omit=dev --ignore-scripts --no-audit --no-fund`. Baseline replay
used a clean pinned checkout with its previously installed locked dependencies.
The actual server process owned each loopback port before measurement.
Temporary servers were stopped after replay.

Reviewer: Windows, Node 24.15.0. Coordinator: Linux, Node 22.23.3.
Both used Playwright 1.63.0, Chromium 153.0.8010.12 and axe-core 4.13.0.
This runtime difference is explicit, not a claim of identical environments.
Every accepted replay exited 0 with no page errors, blocked external requests
or fatal execution errors.

## Residual findings and limits

Both final patches still have three initial axe violation nodes
(`heading-order`, `landmark-one-main`, `region`) and six final-state nodes
(`heading-order` × 1, `label` × 2, `region` × 3). Contrast incompletes
remain in the raw reports. The initial and final states contain different
content; these counts are not a percentage-improvement metric.

Passing these three custom keyboard journeys is not WCAG conformance.
Actual assistive technology, browser zoom and other browser engines remain
untested. Both workers had effective preset `swe-2-max`; underlying model
identity was unavailable. This is not evidence about weaker models.

The coordinator's mixed first control attempt is retained in
[`eval-attempt1-diagnostic`](../arms/control/eval-attempt1-diagnostic/);
only the serial rerun is compared here. Treatment round 2 was observed in
the child session at approximately 13:31 Paris, before its 13:41:32 deadline.
The parent retrieved it late. No extra worker repair was authorized after
the deadline.

## Verify the comparison

From the repository root:

```sh
node benchmarks/task-pilot/independent-review/compare.cjs
```

This checks the committed raw reports against the coordinator's reports,
not a new browser execution. [comparison.json](comparison.json) records the
result. Dynamic item IDs inside step details, timestamps and run IDs differ
between executions; step statuses and violation-node targets/HTML are compared.
Every local scope must identify its own report and the frozen source hash.
For a fresh browser replay, follow the [harness instructions](../README.md).
