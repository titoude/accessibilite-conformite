# Release readiness

Use this gate before publishing an accessibility claim or releasing a remediated application. Every decision refers to an exact commit, a declared scope and linked evidence. Never certify perfect accessibility for everyone.

| Gate | Required evidence |
| --- | --- |
| Repository | Correct owner/repo, base and candidate SHA; no unrelated changes |
| Build | Clean install from the lockfile, successful build and the project's own tests for the candidate |
| Automated scan | Baseline and final `report.json`/`scope.json` for the same declared scope, with matching scope identities; no execution errors |
| Decision safety | Contradictory or missing evidence cannot produce success; open incompletes have an owner |
| Keyboard tasks | Complete critical tasks, including errors and dialogs, replayed by someone other than the corrector |
| Human review | Actual critical tasks, tester and date, OS/browser/AT versions, observed results and open defects |
| Standards | [Complete criterion record](../templates/README.md), justified applicability, appropriate methods, full-page and complete-process requirements, and a separate jurisdictional assessment |

Missing evidence stays open. Automation cannot stand in for a human test that has not been done.

## Human review record

| Task / route / state | Candidate SHA | Browser / OS / AT versions | Tester / date | Expected | Observed | Status / evidence |
| --- | --- | --- | --- | --- | --- | --- |

Cover keyboard tasks, NVDA with a tested Windows browser, VoiceOver with Safari and mobile assistive technologies when relevant, plus real zoom, text spacing and forced colors. Choose environments from your users' needs rather than assuming one combination proves every configuration.

## Boundaries

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the web target, including its full-page and complete-process conformance requirements.
- [RGAA](https://accessibilite.numerique.gouv.fr/methode/) has its own method; an axe scan is not an RGAA audit.
- The European Accessibility Act, EN 301 549 and local laws require a separate applicability assessment based on current authoritative texts.
- Native software, documents and hardware need other evaluation methods and are outside the HTML scanner.

Record **ready for the declared scope**, **changes required** or **blocked by missing evidence**, with links to every gate. Keep previous evaluations and state limitations prominently.
