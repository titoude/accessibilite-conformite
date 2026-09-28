---
name: accessibilite-conformite
description: Audit and remediate website and web-application accessibility in source code, using a frozen scope, independent verification and explicit human-review gaps. Use for WCAG or RGAA web work; automated scans alone do not establish conformance.
---

# Accessibility remediation with evidence

Improve the requested application's accessibility while preserving its content and functions. Target WCAG 2.2 A/AA for web content unless the user specifies otherwise. RGAA, jurisdictional obligations, native software and documents require their own applicable methods.

Use [audit.mjs](audit.mjs) for scans and [checklist.md](checklist.md) for checks beyond automation. Do not infer universal accessibility, legal compliance or screen-reader compatibility from a score or agent verdict.

## Freeze the scope first

- Verify the exact repository, branch and commit. Preserve concurrent work. This skill does not grant permission for deployments, production mutations, messages or unrelated changes.
- Identify complete user tasks, including error paths.
- Freeze a manifest of routes, states, roles, data, language, theme, viewport, expected outcomes and tool versions.
- For WCAG 2.2 A/AA, start a [complete criterion record](templates/README.md). Keep all 55 criteria; justify inapplicability and leave unperformed checks open. Other standards require their own inventory.
- Configure dynamic `STATES` before the baseline, or use `--states none` explicitly when there are none in scope. Crawling does not discover every screen.
- Keep credentials and browser authentication state out of Git and public artifacts.
- Use locked tools and the project's approved installation procedure. The toolkit uses `pnpm install --frozen-lockfile --ignore-scripts` followed by an explicit Chromium installation. Do not migrate a target project's package manager merely to audit it.

## Baseline

From this toolkit directory, with the authorized application running:

```sh
node audit.mjs http://localhost:3000 --states none --out a11y-audit/baseline
```

For dynamic states, use an application-specific runner copy with the function-based `STATES` example in [README.md](README.md), freeze it, and use `--states all`. Add explicit routes with `--urls`, authorized authentication with `--storage-state`, and hash routing with `--keep-hash` when needed.

Preserve baseline reports, manifest and application commit. Missing controls, wrong documents, timeouts and failed preconditions are coverage failures, never clean results.

## Correction rules

1. **Change source, preserve functionality.** No overlays, hidden content, removed features, disabled audit rules or altered test data to improve the score.
2. **Prefer native HTML.** Use semantic controls before adding ARIA.
3. **Separate mechanical and semantic changes.** Connecting an existing label differs from inventing a meaningful alternative; record context and uncertainty for the latter.
4. **Empty image alternatives need evidence.** Use `alt=""` only for decorative or redundant information with a documented reason.
5. **Fix shared causes.** Repair the responsible component or token and check affected uses while preserving product intent.
6. **Test observable effects.** A click, attribute or nonzero viewport is not a completed user task. Assert the exact state, name, focus and business outcome.
7. **Required actions fail visibly.** Never swallow missing-element errors or return success from an exception.
8. **Verify the exact accessible name.** Use `accNameMatches` from [assertions.mjs](tests-validateurs/assertions.mjs), backed by Playwright's matcher. The legacy `accName` snapshot extractor is diagnostic only.
9. **Exercise complete keyboard tasks.** Check order, visible focus, errors and transitions. Roving `tabindex="-1"` is legitimate inside correctly implemented composites.
10. **Check dialog behavior precisely.** Initial focus, inert background, closure and focus return matter. Escaping focus and an inescapable keyboard trap are different defects.
11. **Dragging needs a single-pointer alternative** when WCAG 2.5.7 applies; keyboard access alone is insufficient.
12. **Reflow preserves content.** Check 320 CSS-pixel equivalent width, text resizing and real browser zoom. Respect legitimate two-dimensional content exceptions. Resizing a viewport does not prove browser zoom.
13. **Adapt the test harness, not product timing.** Do not change polling, networking or animations just to satisfy a wait.
14. **Re-scan the delivered build.** Browser-only DOM edits are not fixes. Compare scenario identities and state-definition hashes, not counts alone.
15. **Bound the loop.** Default to three correction/verification rounds. Stop on no progress and preserve partial work. Repairs after final evaluation count as additional rounds.
16. **Keep uncertainty visible.** Group axe incompletes by rule and scenario with a documented decision and evidence; unreviewed items stay open.
17. **Separate correction from acceptance.** A distinct reviewer replays the work. Reconcile its verdict with measured counters, patch identity, build and scope; reject contradictions.

## Independent verification

Check out the exact candidate commit, install from its lockfile, build and replay the frozen manifest. Verify that expected content and interactions remain present.

Use the supplied helpers instead of rewriting permissive assertions. They require the toolkit's pinned `@playwright/test`. `isTrulyVisible` checks CSS visibility and opacity; inspect occlusion, clipping and context separately.

Record deterministic tests, agent semantic judgments and actual human assistive-technology tests separately using [checklist.md](checklist.md). A browser automation run is not an NVDA or VoiceOver test.

The final evaluator must be separate from the operational verifier and exercise held-out tasks or tests. Do not expose expected fixes to the corrector. If independent execution is unavailable, record `NOT_TESTED`.

## Evidence and delivery

For every relevant criterion or task record the standard/version, page/state/role, method, expected and observed behavior, evidence path, commit/environment and outcome:

- `PASS`: demonstrated by an appropriate method.
- `FAIL`: a demonstrated unmet requirement.
- `NOT_APPLICABLE`: a documented applicability decision.
- `NOT_TESTED`: no completed evaluation.
- `NEEDS_HUMAN_REVIEW`: judgment or assistive-technology testing still required.

Keep sanitized patch files, baseline/final reports and scopes, manifest/state definitions, versions, runnable test commands, build results and the human-review ledger together.

An automated pass means no detected violations or execution errors within the declared scope. Complete conformance additionally requires all applicable criteria and conformance requirements to be evaluated with appropriate methods. Never infer coverage from a count.

Add a regression gate appropriate to the project. The local pre-push hook checks a running URL; it cannot prove which commit the server serves. Use CI that builds the candidate when that identity is required.

Deliver a scoped PR and explicit unresolved items. Use [release readiness](docs/RELEASE-READINESS.md) before any conformance claim or release. Check the applicable authority before writing an accessibility declaration.
