# Audit accessibilité — 2026-10-04

**8 règle(s) violée(s), 157 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 151 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `240ca9863691`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:3001/
  - `.cursor-default.group\/day.select-none:nth-child(1) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(2) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(3) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(4) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.ps-2`
  - `.text-start.flex-1[data-sidebar-label="true"]`
- http://localhost:3001/explore
  - `.cursor-default.group\/day.select-none:nth-child(1) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(2) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(3) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(4) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.ps-2`
  - `.text-start.flex-1[data-sidebar-label="true"]`
- http://localhost:3001/archived
  - `.\@min-\[230px\]\:grid-cols-\[1fr\] > .overflow-hidden.min-w-0 > .text-\[12px\].leading-5[data-sidebar-label="true"]`
  - `.cursor-default.group\/day.select-none:nth-child(1) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(2) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(3) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(4) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.ps-2`
  - `.flex-1.text-start[data-sidebar-label="true"]`
- http://localhost:3001/attachments
  - `h2`
  - `.text-ui.group.gap-1:nth-child(2) > .flex-1.text-start[data-sidebar-label="true"]`
  - `.text-ui.group.gap-1:nth-child(3) > .flex-1.text-start[data-sidebar-label="true"]`
  - `.text-ui.group.gap-1:nth-child(4) > .flex-1.text-start[data-sidebar-label="true"]`
  - `.text-ui.group.gap-1:nth-child(5) > .flex-1.text-start[data-sidebar-label="true"]`
- http://localhost:3001/inbox
  - `.\@min-\[230px\]\:grid-cols-\[1fr\] > .overflow-hidden > .text-\[12px\].leading-5[data-sidebar-label="true"]`
  - `h2`
  - `.text-ui.group.gap-1:nth-child(2) > .flex-1.text-start[data-sidebar-label="true"]`
  - `.text-ui.group.gap-1:nth-child(3) > .flex-1.text-start[data-sidebar-label="true"]`
- http://localhost:3001/calendar/2026/10
  - `h2`
  - `.flex-1.truncate[data-sidebar-label="true"]`
  - `.ms-1\.5`
  - `.h-8.items-end.pb-1\.5:nth-child(1) > .tracking-\[0\.04em\].text-muted-foreground\/50.text-2xs`
  - `.h-8.items-end.pb-1\.5:nth-child(2) > .tracking-\[0\.04em\].text-muted-foreground\/50.text-2xs`
  - `.h-8.items-end.pb-1\.5:nth-child(3) > .tracking-\[0\.04em\].text-muted-foreground\/50.text-2xs`
  - `.h-8.items-end.pb-1\.5:nth-child(4) > .tracking-\[0\.04em\].text-muted-foreground\/50.text-2xs`
  - `.h-8.items-end.pb-1\.5:nth-child(5) > .tracking-\[0\.04em\].text-muted-foreground\/50.text-2xs`
  - `.h-8.items-end.pb-1\.5:nth-child(6) > .tracking-\[0\.04em\].text-muted-foreground\/50.text-2xs`
  - `.h-8.items-end.pb-1\.5:nth-child(7) > .tracking-\[0\.04em\].text-muted-foreground\/50.text-2xs`
  - … +27 autres
- http://localhost:3001/map
  - `.ps-2`
  - `.flex-1.text-start[data-sidebar-label="true"]`
- http://localhost:3001/views
  - `.\@min-\[230px\]\:grid-cols-\[1fr\] > .overflow-hidden.min-w-0 > .text-\[12px\].leading-5[data-sidebar-label="true"]`
  - `.ps-2`
  - `.text-ui.group.px-2:nth-child(1) > .flex-1.text-start[data-sidebar-label="true"]`
- http://localhost:3001/setting
  - `.\@min-\[230px\]\:grid-cols-\[1fr\] > .overflow-hidden > .text-\[12px\].leading-5[data-sidebar-label="true"]`
  - `section:nth-child(1) > .mb-0\.5.h-6.justify-between > h2`
  - `a[href$="setting#spaces"] > .truncate`
  - `a[href$="setting#access-token"] > .truncate`
  - `a[href$="setting#preference"] > .truncate`
  - `a[href$="setting#webhook"] > .truncate`
  - `a[href$="setting#tags"] > .truncate`
  - `a[href$="setting#memo-export"] > .truncate`
  - `section:nth-child(2) > .mb-0\.5.h-6.justify-between > h2`
  - `a[href$="setting#member"] > .truncate`
  - … +8 autres
- http://localhost:3001/about
  - `.\@min-\[230px\]\:grid-cols-\[1fr\] > .overflow-hidden.min-w-0.items-center > .text-\[12px\].leading-5[data-sidebar-label="true"]`
  - `.ps-2`
  - `.text-ui.gap-1[href$="docs"] > .flex-1.truncate.min-w-0`
  - `.text-ui.gap-1[href$="api"] > .flex-1.truncate.min-w-0`
  - `.text-ui.gap-1.px-2:nth-child(3) > .flex-1.truncate.min-w-0`
- http://localhost:3001/memos/3sKybHLtPqRM8H4GfgFdJF
  - `.\@min-\[230px\]\:grid-cols-\[1fr\] > .overflow-hidden > .text-\[12px\].leading-5[data-sidebar-label="true"]`
  - `.ps-2`
  - `.px-2.group.gap-1:nth-child(1) > .flex-1.text-start[data-sidebar-label="true"]`
  - `.px-2.group.gap-1:nth-child(2) > .flex-1.text-start[data-sidebar-label="true"]`
  - `#base-ui-_r_2u_ > .flex-1.text-start.truncate`
- http://localhost:3001/?creator=admin
  - `.cursor-default.group\/day.select-none:nth-child(1) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(2) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(3) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(4) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.ps-2`
  - `.text-start.flex-1[data-sidebar-label="true"]`
- http://localhost:3001/ [state:memo-editor]
  - `.cursor-default.group\/day.select-none:nth-child(1) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(2) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(3) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(4) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.ps-2`
  - `.text-start.flex-1[data-sidebar-label="true"]`
  - `.gap-1\.5.has-\[\>svg\]\:px-2.px-2`
- http://localhost:3001/ [state:view-options]
  - `.ps-2`
  - `.text-start.flex-1[data-sidebar-label="true"]`
- http://localhost:3001/ [state:user-menu]
  - `.p-1.flex-col > .mb-0\.5.h-6.justify-between > .ps-2.tracking-wide.text-muted-foreground\/55`
  - `.mt-1 > .mb-0\.5.h-6.justify-between > .ps-2.tracking-wide.text-muted-foreground\/55`
  - `.bg-muted\/60`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-input-field-name?application=axeAPI

- http://localhost:3001/
  - `.cm-content`
- http://localhost:3001/explore
  - `.cm-content`
- http://localhost:3001/?creator=admin
  - `.cm-content`
- http://localhost:3001/ [state:memo-editor]
  - `.cm-focused > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="true"]`
- http://localhost:3001/ [state:view-options]
  - `.cm-content`
- http://localhost:3001/ [state:user-menu]
  - `.cm-content`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-prohibited-attr?application=axeAPI

- http://localhost:3001/ [state:memo-editor]
  - `.bg-overlay\/20`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-dialog-name?application=axeAPI

- http://localhost:3001/ [state:user-menu]
  - `#_r_2a_`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.13/meta-viewport?application=axeAPI

- http://localhost:3001/
  - `meta[name="viewport"]`
- http://localhost:3001/explore
  - `meta[name="viewport"]`
- http://localhost:3001/archived
  - `meta[name="viewport"]`
- http://localhost:3001/attachments
  - `meta[name="viewport"]`
- http://localhost:3001/inbox
  - `meta[name="viewport"]`
- http://localhost:3001/calendar/2026/10
  - `meta[name="viewport"]`
- http://localhost:3001/map
  - `meta[name="viewport"]`
- http://localhost:3001/views
  - `meta[name="viewport"]`
- http://localhost:3001/setting
  - `meta[name="viewport"]`
- http://localhost:3001/about
  - `meta[name="viewport"]`
- http://localhost:3001/memos/3sKybHLtPqRM8H4GfgFdJF
  - `meta[name="viewport"]`
- http://localhost:3001/?creator=admin
  - `meta[name="viewport"]`
- http://localhost:3001/ [state:memo-editor]
  - `meta[name="viewport"]`
- http://localhost:3001/ [state:view-options]
  - `meta[name="viewport"]`
- http://localhost:3001/ [state:user-menu]
  - `meta[name="viewport"]`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:3001/
  - `.z-10`
- http://localhost:3001/explore
  - `.z-10`
- http://localhost:3001/archived
  - `.z-10`
- http://localhost:3001/attachments
  - `.absolute`
- http://localhost:3001/inbox
  - `.absolute`
- http://localhost:3001/calendar/2026/10
  - `.absolute`
- http://localhost:3001/map
  - `.w-2`
- http://localhost:3001/views
  - `.absolute`
- http://localhost:3001/setting
  - `.absolute`
- http://localhost:3001/about
  - `.absolute`
- http://localhost:3001/memos/3sKybHLtPqRM8H4GfgFdJF
  - `.absolute`
- http://localhost:3001/?creator=admin
  - `.z-10`
- http://localhost:3001/ [state:view-options]
  - `.z-10`
- http://localhost:3001/ [state:user-menu]
  - `.z-10`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:3001/attachments
  - `html`
- http://localhost:3001/calendar/2026/10
  - `html`
- http://localhost:3001/setting
  - `html`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://localhost:3001/setting
  - `.w-px`

## Résultats incomplets à revoir (151)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:3001/
  - `#base-ui-_r_3f_`
- http://localhost:3001/explore
  - `#base-ui-_r_3f_`
- http://localhost:3001/?creator=admin
  - `#base-ui-_r_3f_`
- http://localhost:3001/ [state:memo-editor]
  - `#base-ui-_r_4j_`
- http://localhost:3001/ [state:view-options]
  - `#base-ui-_r_3f_`
- http://localhost:3001/ [state:user-menu]
  - `#base-ui-_r_3f_`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3001/
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(1)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(2)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(3)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(4)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(5)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(6)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(7)`
- http://localhost:3001/explore
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(1)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(2)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(3)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(4)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(5)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(6)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(7)`
  - `.text-muted-foreground\/40`
- http://localhost:3001/archived
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(1)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(2)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(3)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(4)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(5)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(6)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(7)`
- http://localhost:3001/calendar/2026/10
  - `a[data-calendar-date="2026-10-01"] > .h-6.shrink-0.items-center > .leading-none.tabular-nums.text-muted-foreground\/70`
  - `a[data-calendar-date="2026-10-02"] > .h-6.shrink-0.items-center > .leading-none.tabular-nums.text-muted-foreground\/70`
  - `.rounded-se-lg > .h-6.shrink-0.items-center > .leading-none.tabular-nums.text-muted-foreground\/70`
  - `a[data-calendar-date="2026-10-05"] > .h-6.shrink-0.items-center > .leading-none.tabular-nums.text-muted-foreground\/70`
  - `a[data-calendar-date="2026-10-06"] > .h-6.shrink-0.items-center > .leading-none.tabular-nums.text-muted-foreground\/70`
  - `a[data-calendar-date="2026-10-07"] > .h-6.shrink-0.items-center > .leading-none.tabular-nums.text-muted-foreground\/70`
  - `a[data-calendar-date="2026-10-08"] > .h-6.shrink-0.items-center > .leading-none.tabular-nums.text-muted-foreground\/70`
  - `a[data-calendar-date="2026-10-09"] > .h-6.shrink-0.items-center > .leading-none.tabular-nums.text-muted-foreground\/70`
- http://localhost:3001/map
  - `a[href$="openmaptiles.org/"]`
  - `.leaflet-control-attribution > a:nth-child(2)`
  - `.pointer-events-auto > h2`
  - `p`
- http://localhost:3001/memos/3sKybHLtPqRM8H4GfgFdJF
  - `.text-muted-foreground\/40`
- http://localhost:3001/?creator=admin
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(1)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(2)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(3)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(4)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(5)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(6)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(7)`
- http://localhost:3001/ [state:memo-editor]
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(1)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(2)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(3)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(4)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(5)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(6)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(7)`
- http://localhost:3001/ [state:view-options]
  - `.tracking-\[-0\.015em\]`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(1)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(2)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(3)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(4)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(5)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(6)`
  - `.h-5.tracking-\[0\.04em\].text-muted-foreground\/50:nth-child(7)`
  - `.cursor-default.group\/day.select-none:nth-child(1) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(2) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - … +20 autres
- http://localhost:3001/ [state:user-menu]
  - `.\@min-\[230px\]\:grid-cols-\[1fr\] > .overflow-hidden.min-w-0 > .text-\[12px\].leading-5[data-sidebar-label="true"]`
  - `.tracking-\[-0\.015em\]`
  - `.tracking-\[0\.04em\].text-muted-foreground\/50.h-5:nth-child(1)`
  - `.tracking-\[0\.04em\].text-muted-foreground\/50.h-5:nth-child(2)`
  - `.tracking-\[0\.04em\].text-muted-foreground\/50.h-5:nth-child(3)`
  - `.tracking-\[0\.04em\].text-muted-foreground\/50.h-5:nth-child(4)`
  - `.tracking-\[0\.04em\].text-muted-foreground\/50.h-5:nth-child(5)`
  - `.tracking-\[0\.04em\].text-muted-foreground\/50.h-5:nth-child(6)`
  - `.tracking-\[0\.04em\].text-muted-foreground\/50.h-5:nth-child(7)`
  - `.cursor-default.group\/day.select-none:nth-child(1) > .text-muted-foreground\/25.aspect-square.max-w-\[30px\]`
  - … +36 autres

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:3001/ [state:memo-editor]
  - `.start-0`
  - `.duration-300.ease-in-out.bg-card > .flex-col.gap-2[aria-hidden="true"]`
  - `article`
  - `.tsqd-parent-container`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][data-base-ui-inert=""]:nth-child(3)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][data-base-ui-inert=""]:nth-child(5)`
- http://localhost:3001/ [state:view-options]
  - `span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(2)`
  - `span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(4)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(5)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(7)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`
- http://localhost:3001/ [state:user-menu]
  - `.h-13 > span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `.h-13 > span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(4)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(6)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:3001/ [state:view-options]
  - `#base-ui-_r_2j_`
- http://localhost:3001/ [state:user-menu]
  - `#base-ui-_r_2b_`

