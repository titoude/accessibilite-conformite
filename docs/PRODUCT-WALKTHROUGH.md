# A three-minute walkthrough

**Accessibility fixes that can be challenged, reproduced and reviewed.**

The product is a portable coding-agent skill with an executable scanner,
assertion helpers and a review protocol. Its value is a reviewable source
change and a clear account of what remains unchecked.

## 0:00 — Show the barrier

After the [quickstart installation](../README.md#quickstart), run `pnpm demo`.
Open the [local broken form](http://127.0.0.1:4173/before.html) and try to reach
the reservation control using Tab. It is mouse-only. The fields also lack
programmatic labels and the help text has insufficient contrast.

## 0:30 — Complete the task with the keyboard

Open the [corrected form](http://127.0.0.1:4173/after.html). Submit an empty name,
observe focus move to the field and its associated error, enter Alex, choose
In person, reserve, and dismiss the dialog with Escape. Focus returns to the
button; the confirmation keeps the selected value. No real booking is made.

This example is hand-authored. It demonstrates the workflow and testable
behaviors; it is not the output of an AI agent.

## 1:15 — Scan both versions

In a second terminal, run:

```sh
node audit.mjs http://127.0.0.1:4173 --urls /before.html,/after.html --states none --out a11y-audit/demo
```

The scanner exits with code `1`. Open `a11y-audit/demo/report.md`: three rules
fail on the broken page and none on the corrected one. `scope.json` records
exactly which pages were scanned, so a smaller scope cannot pass for an improvement.

## 1:45 — Challenge the evidence

Run `pnpm test:demo`. Open the generated `test-results/demo/` reports and
screenshots. The test checks the complete keyboard task, four corrected states,
320 CSS-pixel reflow and forced-colors operation. Browser zoom and real
assistive-technology testing remain separate checks.

Show the [toolkit test suite](../README.md#what-the-tests-check): it rejects
stale reports, undeclared states, HTTP errors, redirects and misleading
assertions. A passing suite demonstrates those specific checks; it is not an
accessibility certificate.

## 2:30 — Close with what remains open

The [55-criterion record](../templates/README.md) starts with every criterion
untested. Maintainers must evaluate applicability, complete user tasks and
record actual human review with the [checklist](../checklist.md).

Human assistive-technology validation is still required. See
[release readiness](RELEASE-READINESS.md): conformance claims need evidence
for the declared tasks, scope and environments.

If you record this walkthrough as a video, provide accurate captions and keep the
on-screen commands and limitations readable.
