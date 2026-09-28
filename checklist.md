# Accessibility review checklist

Use a reviewer separate from the corrector. This is a practical task checklist, not a substitute for evaluating every applicable criterion in the chosen standard.

Start the [55-criterion WCAG 2.2 A/AA record](templates/README.md) before applying this task checklist. Its default `NOT_TESTED` statuses make omissions visible; a filled table without appropriate evidence is not an audit.

For each check, record `PASS`, `FAIL`, `NOT_APPLICABLE` with justification, `NOT_TESTED`, or `NEEDS_HUMAN_REVIEW`. Attach the candidate commit, route/state/role, expected/observed behavior and evidence.

Keep three methods separate: reproducible deterministic assertions; agent semantic judgment with uncertainty; actual human testing with tester, date and OS/browser/assistive-technology versions. An agent cannot mark a human check complete by reading the markup.

## Keyboard and interaction

- [ ] Complete each critical task using only the keyboard, including validation errors and authentication.
- [ ] Focus order is understandable and focus remains visible and not entirely obscured (2.4.11, AA).
- [ ] Keyboard users can enter, operate and leave every widget. Test arrow-key composites as well as Tab/Shift+Tab.
- [ ] A working mechanism bypasses repeated navigation.
- [ ] Dialogs receive appropriate initial focus, prevent background interaction and restore focus on closure. Distinguish a focus leak from an inescapable keyboard trap.
- [ ] Menus, tabs, accordions and autocomplete follow their applicable interaction pattern.
- [ ] Hover/focus content is dismissible, hoverable and persistent where 1.4.13 applies.
- [ ] Pointer targets meet 2.5.8 or a documented exception; 44 CSS pixels is an enhanced target, not the universal AA minimum.
- [ ] Dragging has a single-pointer alternative without dragging where required (2.5.7), plus keyboard access.
- [ ] Page/state transitions preserve a meaningful focus location.

## Screen readers and semantic content

Run actual relevant combinations, such as NVDA with a tested Windows browser or VoiceOver with Safari. Mark untested combinations explicitly.

- [ ] Page title and language describe the current page correctly.
- [ ] Landmarks, reading order and heading structure communicate the actual organization.
- [ ] Informative images have contextually useful alternatives; decorative/redundant images have justified empty alternatives.
- [ ] Controls announce their name, role, state and value. Labels and instructions are understandable.
- [ ] Form errors, completion and loading messages are announced at the appropriate time.
- [ ] Data tables expose correct header relationships.
- [ ] Charts and complex imagery have equivalent information and functionality.
- [ ] Dynamic components remain understandable through complete user tasks.
- [ ] Accessible names were checked on the exact control, not another element with the same name.

## Vision, zoom and layout

- [ ] Real browser zoom and text resizing preserve content and functionality at the required levels.
- [ ] Reflow works at the equivalent of 320 CSS pixels, with documented exceptions for content requiring two dimensions.
- [ ] Text-spacing overrides preserve all information and functions.
- [ ] Information does not depend on color alone.
- [ ] Text and non-text contrast meet their applicable thresholds and exceptions.
- [ ] Focus, custom controls and content remain understandable in forced-colors/high-contrast modes.
- [ ] Check clipping, overlap and occlusion visually; an opacity or bounding-box assertion is insufficient by itself.

## Motion, timing and understanding

- [ ] No hazardous flashing; apply the actual threshold criteria rather than judging frequency alone.
- [ ] Moving or updating content can be paused/stopped/hidden when required.
- [ ] Time limits allow the applicable warning and extension mechanisms.
- [ ] Instructions and error messages explain what to do and how to recover.
- [ ] Previously supplied information need not be redundantly re-entered when 3.3.7 applies.
- [ ] Authentication supports applicable alternatives, password managers and paste (3.3.8).
- [ ] Personal-data inputs identify their purpose where 1.3.5 applies.
- [ ] Reduced-motion preferences are respected as an additional usability check; distinguish AAA requirements from AA.

## Media and devices

- [ ] Prerecorded/live media has the applicable captions, transcripts and other alternatives.
- [ ] Audiodescription meets 1.2.5 AA where required; a text alternative alone does not satisfy that criterion.
- [ ] Essential audio information has an appropriate alternative.
- [ ] Mobile critical tasks have actual VoiceOver/iOS and TalkBack/Android evidence when in scope.
- [ ] Orientation, text resizing and touch interaction support the selected devices.

## Incomplete results and documentation

- [ ] Every axe incomplete group (`rule × scenario`) has a traceable resolution, justified inapplicability or an explicit human-review owner.
- [ ] Missing scenarios remain coverage failures. Best-practice findings are distinguished from normative failures.
- [ ] All applicable criteria in the chosen standard have a status, even if this checklist does not name them.
- [ ] Accessibility declarations and any jurisdiction-specific documentation use an appropriate audit and applicability assessment.
- [ ] Users have an accessible way to report barriers.
- [ ] The release record includes limitations, unresolved defects and the exact evaluated commit.

Use the record template and final gates in [release readiness](docs/RELEASE-READINESS.md). Unperformed checks remain open.
