# Audit accessibilité — 2026-10-08

**9 règle(s) violée(s), 147 occurrence(s), 14/16 scénario(s) audité(s), 2 erreur(s), 360 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `90e3ef6401bc`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9540/objects/people
  - `.s1oavrdv`
- http://localhost:9540/objects/opportunities
  - `.s1oavrdv`
- http://localhost:9540/objects/tasks
  - `.s1oavrdv`
  - `#record-table-cell-tasks-67fd20cf-2b65-46db-96b9-5169944e5c6f-1-4 > .record-table-cell-display.s1efidhj[data-testid="editable-cell-display-mode"] > .sx4wx53 > ._tag_1vz7j_1[data-preventshrink=""][data-variant="soft"] > ._content_1vz7j_52`
  - `#record-table-cell-tasks-67fd20cf-2b65-46db-96b9-5169944e5c6f-1-12 > .record-table-cell-display.s1efidhj[data-testid="editable-cell-display-mode"] > .sx4wx53 > ._tag_1vz7j_1[data-preventshrink=""][data-variant="soft"] > ._content_1vz7j_52`
- http://localhost:9540/objects/opportunities?viewId=9f9c3f36-bb7c-447d-8d70-43cb7f4d8030 [state:opportunities-kanban]
  - `.s1oavrdv`
  - `#base-ui-_r_2f_`
  - `#base-ui-_r_2p_`
- http://localhost:9540/objects/companies [state:command-menu]
  - `.s1oavrdv`
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `.s1oavrdv`
- http://localhost:9540/objects/opportunities?viewId=9f9c3f36-bb7c-447d-8d70-43cb7f4d8030 [state:kanban-dark]
  - `.s1oavrdv`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:9540/objects/people
  - `#base-ui-_r_3ll_`
- http://localhost:9540/objects/opportunities
  - `#base-ui-_r_2og_`
  - `#base-ui-_r_2om_`
- http://localhost:9540/objects/tasks
  - `#base-ui-_r_343_`
- http://localhost:9540/objects/companies [state:command-menu]
  - `#base-ui-_r_43v_`
  - `#base-ui-_r_441_`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.14/nested-interactive?application=axeAPI

- http://localhost:9540/object/person/0d29f904-fd92-4ee4-90dc-262c52431c7b [state:record-show-person]
  - `.s1qrz9yb:nth-child(2) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[width="auto"] > .sbv3a8t[aria-haspopup="true"][role="button"]`
  - `.s1qrz9yb:nth-child(3) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[width="auto"] > .sbv3a8t[aria-haspopup="true"][role="button"]`
  - `.s1qrz9yb:nth-child(4) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[width="auto"] > .sbv3a8t[aria-haspopup="true"][role="button"]`
- http://localhost:9540/object/company/e52f6d91-7fe2-41aa-b98c-3ff59210d312 [state:record-show-company]
  - `.s1qrz9yb:nth-child(2) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[width="auto"] > .sbv3a8t[aria-haspopup="true"][role="button"]`
  - `.s1qrz9yb:nth-child(3) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[width="auto"] > .sbv3a8t[aria-haspopup="true"][role="button"]`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-prohibited-attr?application=axeAPI

- http://localhost:9540/objects/companies
  - `div[data-testid="row-id-0"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"]`
  - `div[data-testid="row-id-1"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"]`
  - `div[data-testid="row-id-2"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"]`
  - `div[data-testid="row-id-3"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"]`
  - `div[data-testid="row-id-4"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"]`
  - `div[data-testid="row-id-5"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"]`
  - `div[data-testid="row-id-6"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"]`
  - `div[data-testid="row-id-7"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"]`
  - `div[data-testid="row-id-8"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"]`
  - `div[data-testid="row-id-9"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"]`
  - … +70 autres

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-main-is-top-level?application=axeAPI

- http://localhost:9540/objects/companies
  - `.s9iz60d`
- http://localhost:9540/objects/people
  - `.s9iz60d`
- http://localhost:9540/objects/opportunities
  - `.s9iz60d`
- http://localhost:9540/objects/tasks
  - `.s9iz60d`
- http://localhost:9540/settings/profile
  - `.seo5orh`
- http://localhost:9540/settings/general
  - `.seo5orh`
- http://localhost:9540/settings/members
  - `.seo5orh`
- http://localhost:9540/settings/experience
  - `.seo5orh`
- http://localhost:9540/objects/opportunities?viewId=9f9c3f36-bb7c-447d-8d70-43cb7f4d8030 [state:opportunities-kanban]
  - `.s9iz60d`
- http://localhost:9540/objects/companies [state:command-menu]
  - `.s9iz60d`
- http://localhost:9540/object/person/0d29f904-fd92-4ee4-90dc-262c52431c7b [state:record-show-person]
  - `.s1n20cjt`
- http://localhost:9540/object/company/e52f6d91-7fe2-41aa-b98c-3ff59210d312 [state:record-show-company]
  - `.s1n20cjt`
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `.s9iz60d`
- http://localhost:9540/objects/opportunities?viewId=9f9c3f36-bb7c-447d-8d70-43cb7f4d8030 [state:kanban-dark]
  - `.s9iz60d`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://localhost:9540/objects/companies
  - `.s82b0nt`
- http://localhost:9540/objects/people
  - `.s82b0nt`
- http://localhost:9540/objects/opportunities
  - `.s82b0nt`
- http://localhost:9540/objects/tasks
  - `.s82b0nt`
- http://localhost:9540/settings/profile
  - `.s9iz60d`
- http://localhost:9540/settings/general
  - `.s9iz60d`
- http://localhost:9540/settings/members
  - `.s9iz60d`
- http://localhost:9540/settings/experience
  - `.s9iz60d`
- http://localhost:9540/objects/opportunities?viewId=9f9c3f36-bb7c-447d-8d70-43cb7f4d8030 [state:opportunities-kanban]
  - `.s82b0nt`
- http://localhost:9540/objects/companies [state:command-menu]
  - `.s82b0nt`
- http://localhost:9540/object/person/0d29f904-fd92-4ee4-90dc-262c52431c7b [state:record-show-person]
  - `.s9iz60d`
- http://localhost:9540/object/company/e52f6d91-7fe2-41aa-b98c-3ff59210d312 [state:record-show-company]
  - `.s9iz60d`
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `.s82b0nt`
- http://localhost:9540/objects/opportunities?viewId=9f9c3f36-bb7c-447d-8d70-43cb7f4d8030 [state:kanban-dark]
  - `.s82b0nt`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:9540/objects/companies
  - `.s82b0nt`
- http://localhost:9540/objects/people
  - `.s82b0nt`
- http://localhost:9540/objects/opportunities
  - `.s82b0nt`
- http://localhost:9540/objects/tasks
  - `.s82b0nt`
- http://localhost:9540/settings/profile
  - `.s9iz60d`
- http://localhost:9540/settings/general
  - `.s9iz60d`
- http://localhost:9540/settings/members
  - `.s9iz60d`
- http://localhost:9540/settings/experience
  - `.s9iz60d`
- http://localhost:9540/objects/opportunities?viewId=9f9c3f36-bb7c-447d-8d70-43cb7f4d8030 [state:opportunities-kanban]
  - `.s82b0nt`
- http://localhost:9540/objects/companies [state:command-menu]
  - `.s82b0nt`
- http://localhost:9540/object/person/0d29f904-fd92-4ee4-90dc-262c52431c7b [state:record-show-person]
  - `.s9iz60d`
- http://localhost:9540/object/company/e52f6d91-7fe2-41aa-b98c-3ff59210d312 [state:record-show-company]
  - `.s9iz60d`
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `.s82b0nt`
- http://localhost:9540/objects/opportunities?viewId=9f9c3f36-bb7c-447d-8d70-43cb7f4d8030 [state:kanban-dark]
  - `.s82b0nt`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9540/object/person/0d29f904-fd92-4ee4-90dc-262c52431c7b [state:record-show-person]
  - `html`
- http://localhost:9540/object/company/e52f6d91-7fe2-41aa-b98c-3ff59210d312 [state:record-show-company]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9540/objects/companies [state:command-menu]
  - `div[data-edge="left"]`

## Résultats incomplets à revoir (360)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9540/objects/companies
  - `.sx5718n`
  - `.sjhfrei[aria-haspopup="true"]`
- http://localhost:9540/objects/people
  - `.sx5718n`
  - `.sjhfrei[aria-haspopup="true"]`
- http://localhost:9540/objects/opportunities
  - `.sx5718n`
  - `.sjhfrei[aria-haspopup="true"]`
- http://localhost:9540/objects/tasks
  - `.sx5718n`
  - `.sjhfrei[aria-haspopup="true"]`
- http://localhost:9540/objects/opportunities?viewId=9f9c3f36-bb7c-447d-8d70-43cb7f4d8030 [state:opportunities-kanban]
  - `.sx5718n`
  - `.sjhfrei[aria-haspopup="true"][role="button"]`
- http://localhost:9540/objects/companies [state:command-menu]
  - `.sx5718n`
  - `.sjhfrei[aria-haspopup="true"]`
- http://localhost:9540/object/person/0d29f904-fd92-4ee4-90dc-262c52431c7b [state:record-show-person]
  - `.s1qrz9yb:nth-child(2) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[width="auto"] > .sbv3a8t[aria-haspopup="true"][role="button"]`
  - `.s1qrz9yb:nth-child(3) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[width="auto"] > .sbv3a8t[aria-haspopup="true"][role="button"]`
  - `.s1qrz9yb:nth-child(4) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[width="auto"] > .sbv3a8t[aria-haspopup="true"][role="button"]`
- http://localhost:9540/object/company/e52f6d91-7fe2-41aa-b98c-3ff59210d312 [state:record-show-company]
  - `.s1qrz9yb:nth-child(2) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[width="auto"] > .sbv3a8t[aria-haspopup="true"][role="button"]`
  - `.s1qrz9yb:nth-child(3) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[width="auto"] > .sbv3a8t[aria-haspopup="true"][role="button"]`
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `.sx5718n`
  - `.sjhfrei[aria-haspopup="true"]`
- http://localhost:9540/objects/opportunities?viewId=9f9c3f36-bb7c-447d-8d70-43cb7f4d8030 [state:kanban-dark]
  - `.sx5718n`
  - `.sjhfrei[aria-haspopup="true"][role="button"]`

### aria-allowed-attr — Elements must only use supported ARIA attributes

- http://localhost:9540/objects/people
  - `#row-virtual-index-0 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-1 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-2 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-3 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-4 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-5 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-6 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-7 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-8 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-9 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - … +50 autres
- http://localhost:9540/objects/opportunities
  - `#row-virtual-index-0 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-1 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-2 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-3 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-4 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-5 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-6 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-7 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-8 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-9 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - … +50 autres
- http://localhost:9540/objects/tasks
  - `#row-virtual-index-0 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-1 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-2 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-3 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-4 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-5 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-6 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-7 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-8 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-9 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - … +50 autres
- http://localhost:9540/objects/companies [state:command-menu]
  - `#row-virtual-index-0 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-1 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-2 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-3 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-4 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-5 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-6 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-7 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-8 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-9 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - … +50 autres
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `#row-virtual-index-0 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-1 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-2 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-3 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-4 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-5 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-6 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-7 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-8 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - `#row-virtual-index-9 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-roledescription="draggable"]`
  - … +50 autres

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9540/objects/people
  - `#base-ui-_r_25s_`
  - `#base-ui-_r_26h_`
  - `#base-ui-_r_2ac_`
  - `#base-ui-_r_2at_`
  - `#base-ui-_r_2be_`
  - `#base-ui-_r_2bv_`
  - `#base-ui-_r_2cg_`
  - `#base-ui-_r_2e3_`
- http://localhost:9540/settings/general
  - `a[data-testid="tab-general"] > ._content_vtbjg_181 > ._label_vtbjg_190 > ._content_ub2oy_89 > ._label_ub2oy_108`
  - `a[data-testid="tab-security"] > ._content_vtbjg_181 > ._label_vtbjg_190 > ._content_ub2oy_89 > ._label_ub2oy_108`
  - `a[data-testid="tab-logs"] > ._content_vtbjg_181 > ._label_vtbjg_190 > ._content_ub2oy_89 > ._label_ub2oy_108`
- http://localhost:9540/settings/members
  - `a[data-testid="tab-team"] > ._content_vtbjg_181 > ._label_vtbjg_190 > ._content_ub2oy_89 > ._label_ub2oy_108`
  - `a[data-testid="tab-invite"] > ._content_vtbjg_181 > ._label_vtbjg_190 > ._content_ub2oy_89 > ._label_ub2oy_108`
  - `a[data-testid="tab-roles"] > ._content_vtbjg_181 > ._label_vtbjg_190 > ._content_ub2oy_89 > ._label_ub2oy_108`
- http://localhost:9540/objects/companies [state:command-menu]
  - `.spyay0b`
  - `#base-ui-_r_10_`
  - `#base-ui-_r_12_`
  - `#base-ui-_r_14_`
  - `#base-ui-_r_16_`
  - `#base-ui-_r_18_`
  - `#base-ui-_r_1a_`
  - `#base-ui-_r_1c_`
  - `#base-ui-_r_1e_`
  - `#base-ui-_r_1g_`
  - … +9 autres

### aria-toggle-field-name — ARIA toggle fields must have an accessible name

- http://localhost:9540/settings/experience
  - `#base-ui-_r_74_`
  - `#base-ui-_r_77_`

### label-content-name-mismatch — Elements must have their visible text as part of their accessible name

- http://localhost:9540/settings/experience
  - `#base-ui-_r_69_`
  - `#base-ui-_r_6d_`
  - `#base-ui-_r_6h_`
- http://localhost:9540/object/person/0d29f904-fd92-4ee4-90dc-262c52431c7b [state:record-show-person]
  - `button[aria-label="A11y C54 Person"]`

## Erreurs (2) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:9540/#%20Cycle%2054%20%E2%80%94%20routes%20authentifi%C3%A9es%20twenty%20(index%20objets%20+%20settings%20workspace) — le document final diffère du document demandé (http://localhost:9540/objects/companies?viewId=2d3f1c4d-0d45-453b-80f4-475b057eede7) — déclarer l'URL réelle de l'état dans STATES
- http://localhost:9540/objects/companies [state:companies-filters-open] — page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('[role="listbox"]') to be visible


