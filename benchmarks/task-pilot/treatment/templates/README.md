# Criterion coverage record

Copy [wcag-2.2-aa.csv](wcag-2.2-aa.csv) into the evaluated project's evidence directory before the baseline. It inventories all **55 A/AA success criteria** in the [12 December 2024 WCAG 2.2 Recommendation](https://www.w3.org/TR/2024/REC-WCAG22-20241212/). The identifiers, levels and links were checked against that published version on 28 September 2026. Every initial status is `NOT_TESTED`.

This is a record template, not an audit result, normative interpretation or substitute for the linked requirements. It deliberately avoids giving a universal automated test to criteria that require contextual judgment. Use the [practical checklist](../checklist.md) to plan tasks.

## Fill the record

- Keep every criterion. Add rows when different pages, states or roles require separate evidence; do not remove an inconvenient criterion.
- `scope_and_tasks`: identify the relevant manifest scenarios and complete tasks.
- `method`: distinguish deterministic automation, agent judgment and actual human/assistive-technology evaluation. Multiple methods may be needed.
- `expected` and `observed`: describe the actual assertion or review decision, not just “tested”.
- `evidence`: link raw reports, focused tests, recordings or review notes. An assertion that only covers one component cannot justify the whole scope.
- `reviewer`, `date`, `commit` and `environment`: identify who evaluated what, including browser and assistive-technology versions when used.
- `applicability_reason`: justify exclusions with observed scope facts and the relevant requirement/exception. No detected axe rule does not mean the criterion is inapplicable.

Use the skill's statuses: `PASS`, `FAIL`, `NOT_APPLICABLE`, `NOT_TESTED`, or `NEEDS_HUMAN_REVIEW`. Mark `PASS` only after an appropriate evaluation covers the declared scope. Preserve a failed subcase; do not average it away. Unresolved coverage, incompletes or human checks remain open.

## Additional conformance checks

Criterion rows alone are insufficient. Record these [conformance requirements](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#conformance-reqs) in the release review as well:

| Review | Initial status | Evidence to collect |
| --- | --- | --- |
| Selected conformance level | NOT_TESTED | Evaluated criteria and justified applicability decisions |
| Full pages | NOT_TESTED | Complete page scope, including third-party content |
| Complete processes | NOT_TESTED | Every step, state and role of the declared user tasks |
| Accessibility-supported technology use | NOT_TESTED | Tested combinations and relevant support evidence |
| Non-interference | NOT_TESTED | Check excluded or non-relied-on content against the applicable requirements |

Criterion 4.1.1 was removed from WCAG 2.2, so it is absent here. This template is not a WCAG 2.0/2.1, RGAA or EN 301 549 audit. Those targets need their own versioned inventory, applicability decisions and methods. See [release readiness](../docs/RELEASE-READINESS.md) before making any conformance claim.
