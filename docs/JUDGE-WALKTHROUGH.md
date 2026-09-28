# A three-minute walkthrough

**Accessibility fixes that can be challenged, reproduced and reviewed.**

The product is a portable coding-agent skill with an executable audit runner,
assertion helpers and an evidence protocol. Its value is a reviewable source
change and a clear account of what remains unchecked.

## 0:00 — Show the barrier

After the [locked installation](../README.md#start-locally), run `pnpm demo`.
Open the [local broken form](http://127.0.0.1:4173/before.html) and try to reach
the reservation control using Tab. It is mouse-only. The fields also lack
programmatic labels and the help text has insufficient contrast.

## 0:30 — Complete the task with the keyboard

Open the [corrected form](http://127.0.0.1:4173/after.html). Submit an empty name,
observe focus move to the field and its associated error, enter Alex, choose
In person, reserve, and dismiss the dialog with Escape. Focus returns to the
button; the confirmation retains the selected value. No real booking is made.

This example is hand-authored. It demonstrates the workflow and testable
behaviors; it is not evidence that an isolated AI agent produced the fix.

## 1:15 — Challenge the evidence

Run `pnpm test:demo`. Open the generated `test-results/demo/` reports and
screenshots. The test checks the complete keyboard task, four corrected states,
320 CSS-pixel reflow and forced-colors operation. Explain that browser zoom and
real assistive-technology testing are separate checks.

Show the [toolkit regression suite](EVIDENCE.md#current-toolkit-checks): it
rejects contradictory reports, lost scenarios, wrong commit identities and
misleading assertions. A passing test suite demonstrates those specific checks;
it is not a universal accessibility certificate.

## 2:00 — Present the controlled result, including the failure

Open the [paired pilot results](../benchmarks/paired-pilot/RESULTS.md) and the
[independent replay](../benchmarks/paired-pilot/independent-review/README.md).
Both isolated agents reduce 108 detected violation nodes to one. Both leave a
focus-indicator failure. The skill arm's self-reported zero did not survive
replay. One pair with matching outcomes does not establish skill superiority.

The separate W3C ACT calibration tests selected scanner rules against public
reference fixtures. Its scope, unsupported cases and raw outcomes are published;
it does not measure the skill's effect.

## 2:40 — Close with the next evidence gate

The [55-criterion record](../templates/README.md) starts with every criterion
untested. Maintainers must evaluate applicability, complete user tasks and
record actual human review. More isolated trials and model families are needed
before making a general effectiveness claim.

Human assistive-technology validation and an organizer ruling on Opethon's
pre-existing-work policy remain open. See [release readiness](RELEASE-READINESS.md).
Do not describe the product as universally conformant or eligible until those
claims have the necessary evidence.

This page is the presentation transcript. If recording a video, provide accurate
captions and keep the on-screen commands and limitations readable.
