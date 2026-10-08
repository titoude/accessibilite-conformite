# Audit accessibilité — 2026-10-08

**15 règle(s) violée(s), 1072 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 658 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `f81fa7d5c5cf`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.14/label?application=axeAPI

- http://localhost:9540/settings/profile
  - `#_r_7g_`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `#view-bar-main-filter-dropdown-id-companies-7b27dfab-c8b0-4a21-a6ac-6cbd6a60b4ee-options`
  - `.s1tp9jof[role="listbox"]:nth-child(3)`
  - `.s1tp9jof[role="listbox"]:nth-child(6)`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9540/objects/people
  - `.s1oavrdv`
  - `#base-ui-_r_14_`
  - `#base-ui-_r_18_`
  - `#base-ui-_r_1c_`
  - `#base-ui-_r_1g_`
  - `#base-ui-_r_1k_`
  - `#base-ui-_r_1o_`
  - `#base-ui-_r_1s_`
- http://localhost:9540/objects/opportunities
  - `.section-title-label`
  - `.s1oavrdv`
  - `#base-ui-_r_1l_`
  - `#base-ui-_r_1p_`
  - `#base-ui-_r_1t_`
  - `#base-ui-_r_21_`
  - `#base-ui-_r_25_`
  - `#base-ui-_r_29_`
  - `#tooltip-53e3040e-ef78-400d-8dd7-daa3b7473909-footer`
  - `#base-ui-_r_2of_`
- http://localhost:9540/objects/tasks
  - `.section-title-label`
  - `.s1oavrdv`
  - `#base-ui-_r_7b_`
  - `#base-ui-_r_7f_`
  - `#base-ui-_r_7j_`
  - `#base-ui-_r_7n_`
  - `#base-ui-_r_7r_`
  - `#base-ui-_r_7v_`
  - `#base-ui-_r_83_`
  - `#record-table-cell-tasks-b74a74b5-5330-458c-bc84-89cc924667c6-1-4 > .record-table-cell-display.s1efidhj[data-testid="editable-cell-display-mode"] > .sx4wx53 > ._tag_1vz7j_1[data-preventshrink=""][data-variant="soft"] > ._content_1vz7j_52`
  - … +2 autres
- http://localhost:9540/settings/profile
  - `.sj5kk0d:nth-child(1) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `.sj5kk0d:nth-child(2) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `.sj5kk0d:nth-child(3) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `a[data-linked="true"]`
  - `#_r_73_-helper`
  - `#base-ui-_r_79_`
  - `#base-ui-_r_7c_`
- http://localhost:9540/settings/general
  - `.sj5kk0d:nth-child(1) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `.sj5kk0d:nth-child(2) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `.sj5kk0d:nth-child(3) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `#_r_4b_-helper`
  - `#base-ui-_r_4h_`
- http://localhost:9540/settings/members
  - `.sj5kk0d:nth-child(1) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `.sj5kk0d:nth-child(2) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `.sj5kk0d:nth-child(3) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `a[data-linked="true"]`
  - `.s10fwq3v[data-table-header="true"]:nth-child(1)`
  - `.s10fwq3v[data-table-header="true"]:nth-child(2)`
- http://localhost:9540/settings/experience
  - `.sj5kk0d:nth-child(1) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `.sj5kk0d:nth-child(2) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `.sj5kk0d:nth-child(3) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `a[data-linked="true"]`
  - `.s1wn7cr7 > .svqft72 > .s15pm3r6`
  - `.s12oy9bx > .svqft72 > .s15pm3r6`
  - `#_r_7i_-0-description`
  - `#_r_7i_-1-description`
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:opportunities-kanban]
  - `.section-title-label`
  - `.s1oavrdv`
  - `#base-ui-_r_2f_`
  - `#base-ui-_r_2p_`
  - `#record-board-card-9fad7c80-ca5a-4ad6-a185-bdf33e074753-amount > .stnirlz > .s8fyxo > .s1u9v1rs > .s1vaiy3a`
  - `#record-board-card-9fad7c80-ca5a-4ad6-a185-bdf33e074753-closeDate > .stnirlz > .s8fyxo > .s1u9v1rs > .s1vaiy3a`
  - `#record-board-card-9fad7c80-ca5a-4ad6-a185-bdf33e074753-pointOfContact > .stnirlz > .s8fyxo > .s1u9v1rs > .s1vaiy3a`
  - `#record-board-card-a8a1fb86-c93c-4768-a41c-1b566e40bafe-amount > .stnirlz > .s8fyxo > .s1u9v1rs > .s1vaiy3a`
  - `#record-board-card-a8a1fb86-c93c-4768-a41c-1b566e40bafe-closeDate > .stnirlz > .s8fyxo > .s1u9v1rs > .s1vaiy3a`
- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `.section-title-label`
  - `.s1oavrdv`
  - `#base-ui-_r_1l_`
  - `#base-ui-_r_1p_`
  - `#base-ui-_r_1t_`
  - `#base-ui-_r_21_`
  - `#base-ui-_r_25_`
  - `#base-ui-_r_29_`
  - `#base-ui-_r_2d_`
  - `#tooltip-b4bab845-d6be-4f63-afcc-f648673802fe-footer`
  - … +4 autres
- http://localhost:9540/objects/companies [state:command-menu]
  - `.section-title-label`
  - `.s1oavrdv`
  - `#base-ui-_r_ab_`
  - `#base-ui-_r_af_`
  - `#base-ui-_r_aj_`
  - `#base-ui-_r_an_`
  - `#base-ui-_r_ar_`
  - `#tooltip-b4bab845-d6be-4f63-afcc-f648673802fe-footer`
  - `#base-ui-_r_42k_`
- http://localhost:9540/object/person/8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51 [state:record-show-person]
  - `.section-title-label`
  - `.s1wv6onj`
  - `.s1oujbzf`
  - `._root_ztxxm_1._fullWidth_ztxxm_20[data-align="left"]:nth-child(1) > header > .s1s8zdni`
  - `#base-ui-_r_1f_`
  - `#base-ui-_r_1j_`
  - `#fields-ce027ae7-bc2c-46d2-982c-16b8f69e629d-8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51-8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51-phones > .stnirlz > .s8fyxo > .s1u9v1rs > .s1vaiy3a`
  - `._root_ztxxm_1._fullWidth_ztxxm_20[data-align="left"]:nth-child(2) > header > .s1s8zdni`
  - `#base-ui-_r_1o_`
  - `#base-ui-_r_1s_`
  - … +19 autres
- http://localhost:9540/object/company/af3eb8ea-395f-48e6-a229-3dc3cdafd119 [state:record-show-company]
  - `.section-title-label`
  - `.s1wv6onj`
  - `.s1oujbzf`
  - `._root_ztxxm_1._fullWidth_ztxxm_20[data-align="left"]:nth-child(1) > header > .s1s8zdni`
  - `#base-ui-_r_1f_`
  - `#base-ui-_r_1j_`
  - `#fields-53dc6ffe-c3e8-43b6-b74b-516f552acc67-af3eb8ea-395f-48e6-a229-3dc3cdafd119-af3eb8ea-395f-48e6-a229-3dc3cdafd119-accountOwner > .stnirlz > .s8fyxo > .s1u9v1rs > .s1vaiy3a`
  - `._root_ztxxm_1._fullWidth_ztxxm_20[data-align="left"]:nth-child(2) > header > .s1s8zdni`
  - `#base-ui-_r_1o_`
  - `#fields-53dc6ffe-c3e8-43b6-b74b-516f552acc67-af3eb8ea-395f-48e6-a229-3dc3cdafd119-af3eb8ea-395f-48e6-a229-3dc3cdafd119-annualRevenue > .stnirlz > .s8fyxo > .s1u9v1rs > .s1vaiy3a`
  - … +22 autres
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `.s1oavrdv`
  - `#base-ui-_r_35_`
  - `#base-ui-_r_39_`
  - `#base-ui-_r_3d_`
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:kanban-dark]
  - `.s1oavrdv`
  - `#record-board-card-9fad7c80-ca5a-4ad6-a185-bdf33e074753-amount > .stnirlz > .s8fyxo > .s1u9v1rs > .s1vaiy3a`
  - `#record-board-card-9fad7c80-ca5a-4ad6-a185-bdf33e074753-closeDate > .stnirlz > .s8fyxo > .s1u9v1rs > .s1vaiy3a`
  - `#record-board-card-9fad7c80-ca5a-4ad6-a185-bdf33e074753-pointOfContact > .stnirlz > .s8fyxo > .s1u9v1rs > .s1vaiy3a`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.14/nested-interactive?application=axeAPI

- http://localhost:9540/objects/people
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-7 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-8 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - … +5 autres
- http://localhost:9540/objects/opportunities
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
- http://localhost:9540/objects/tasks
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-7 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:opportunities-kanban]
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
  - `.s5e6ds0:nth-child(2) > .sgp4clb > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(4) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(6) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(8) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(10) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(2)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(4)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(6)`
  - … +97 autres
- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-7 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-8 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - … +4 autres
- http://localhost:9540/objects/companies [state:command-menu]
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-7 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-8 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - … +4 autres
- http://localhost:9540/object/person/8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51 [state:record-show-person]
  - `.s1qrz9yb:nth-child(2) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s1qrz9yb:nth-child(3) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s1qrz9yb:nth-child(4) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[aria-haspopup="true"][width="auto"]`
- http://localhost:9540/object/company/af3eb8ea-395f-48e6-a229-3dc3cdafd119 [state:record-show-company]
  - `.s1qrz9yb:nth-child(2) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s1qrz9yb:nth-child(3) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[aria-haspopup="true"][width="auto"]`
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-7 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-8 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - … +4 autres
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:kanban-dark]
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
  - `.s5e6ds0:nth-child(2) > .sgp4clb > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(4) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(6) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(8) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(10) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(2)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(4)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(6)`
  - … +97 autres

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:9540/objects/people
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
- http://localhost:9540/objects/opportunities
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
- http://localhost:9540/objects/tasks
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:opportunities-kanban]
  - `.s5e6ds0:nth-child(2) > .sgp4clb > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(4) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(6) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(8) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(10) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
- http://localhost:9540/objects/companies [state:command-menu]
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:kanban-dark]
  - `.s5e6ds0:nth-child(2) > .sgp4clb > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(4) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:9540/objects/opportunities
  - `#row-virtual-index-0 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-1 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-2 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-3 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-4 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-5 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-6 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-7 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-8 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-9 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - … +9 autres
- http://localhost:9540/objects/tasks
  - `#row-virtual-index-0 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-1 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-2 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-3 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-4 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-5 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-6 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-7 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-8 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-9 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - … +9 autres
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:opportunities-kanban]
  - `#base-ui-_r_1f_`
  - `#record-board-column-aggregate-dropdown-7807ff0a-7eeb-4b8b-aca9-bb4fb97ee247`
  - `#base-ui-_r_1p_`
  - `#record-board-column-aggregate-dropdown-47dd00b0-4504-49ac-840c-20b561d4f175`
  - `#base-ui-_r_23_`
  - `#record-board-column-aggregate-dropdown-0efc7ecb-98af-491b-b679-4f511ca44aeb`
  - `#base-ui-_r_2d_`
  - `#record-board-column-aggregate-dropdown-427c0ba0-9402-4979-94c5-c03fdfe14e24`
  - `#base-ui-_r_2n_`
  - `#record-board-column-aggregate-dropdown-87137a85-4cb5-4510-a58d-f069f9dfa3b2`
  - … +30 autres
- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `#row-virtual-index-0 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-1 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-2 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-3 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-4 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-5 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-6 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-7 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-8 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-9 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - … +9 autres
- http://localhost:9540/objects/companies [state:command-menu]
  - `#row-virtual-index-0 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-1 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-2 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-3 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-4 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-5 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-6 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-7 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-8 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-9 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - … +9 autres
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:kanban-dark]
  - `#base-ui-_r_1m_`
  - `#record-board-column-aggregate-dropdown-7807ff0a-7eeb-4b8b-aca9-bb4fb97ee247`
  - `#base-ui-_r_20_`
  - `#record-board-column-aggregate-dropdown-47dd00b0-4504-49ac-840c-20b561d4f175`
  - `#record-board-card-0-0 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a`
  - `#record-board-card-9fad7c80-ca5a-4ad6-a185-bdf33e074753-company > .stnirlz > .s8fyxo > .s1u9v1rs > .l1ms3w10 > a`
  - `#record-board-card-50505050-0003-4e7c-8001-123456789abc-company > .stnirlz > .s8fyxo > .s1u9v1rs > .l1ms3w10 > a`
  - `#record-board-card-50505050-0003-4e7c-8001-123456789abc-pointOfContact > .stnirlz > .s8fyxo > .s1u9v1rs > .l1ms3w10 > a`
  - `#record-board-card-50505050-0007-4e7c-8001-123456789abc-company > .stnirlz > .s8fyxo > .s1u9v1rs > .l1ms3w10 > a`
  - `#record-board-card-50505050-0007-4e7c-8001-123456789abc-pointOfContact > .stnirlz > .s8fyxo > .s1u9v1rs > .l1ms3w10 > a`
  - … +7 autres

## [SERIOUS] aria-command-name — ARIA commands must have an accessible name

Ensure every ARIA button, link and menuitem has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-command-name?application=axeAPI

- http://localhost:9540/objects/opportunities
  - `#base-ui-_r_2mh_`
  - `#base-ui-_r_2mj_`
  - `#base-ui-_r_2mn_`
  - `#base-ui-_r_2mp_`
- http://localhost:9540/objects/tasks
  - `#base-ui-_r_36q_`
  - `#base-ui-_r_36s_`
  - `#base-ui-_r_36u_`
  - `#base-ui-_r_370_`
  - `#base-ui-_r_372_`
  - `#base-ui-_r_374_`
  - `#base-ui-_r_376_`
- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `#base-ui-_r_3q9_`
  - `#base-ui-_r_3qb_`
  - `#base-ui-_r_3qd_`
  - `#base-ui-_r_3qh_`
  - `#base-ui-_r_3qj_`
  - `#base-ui-_r_3ql_`
  - `#base-ui-_r_3qn_`
  - `#base-ui-_r_3qp_`
  - `#base-ui-_r_3qr_`
  - `#base-ui-_r_3qt_`
- http://localhost:9540/objects/companies [state:command-menu]
  - `#base-ui-_r_41q_`
  - `#base-ui-_r_41s_`
  - `#base-ui-_r_41u_`
  - `#base-ui-_r_422_`
  - `#base-ui-_r_424_`
  - `#base-ui-_r_426_`
  - `#base-ui-_r_428_`
  - `#base-ui-_r_42a_`
  - `#base-ui-_r_42c_`
  - `#base-ui-_r_42e_`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-prohibited-attr?application=axeAPI

- http://localhost:9540/objects/people
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

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-input-field-name?application=axeAPI

- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `#view-bar-main-filter-dropdown-id-companies-7b27dfab-c8b0-4a21-a6ac-6cbd6a60b4ee-options`
  - `.s1tp9jof[role="listbox"]:nth-child(3)`
  - `.s1tp9jof[role="listbox"]:nth-child(6)`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `li`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9540/objects/companies
  - `html`
- http://localhost:9540/objects/people
  - `html`
- http://localhost:9540/objects/opportunities
  - `html`
- http://localhost:9540/objects/tasks
  - `html`
- http://localhost:9540/settings/profile
  - `html`
- http://localhost:9540/settings/general
  - `html`
- http://localhost:9540/settings/members
  - `html`
- http://localhost:9540/settings/experience
  - `html`
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:opportunities-kanban]
  - `html`
- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `html`
- http://localhost:9540/objects/companies [state:command-menu]
  - `html`
- http://localhost:9540/object/person/8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51 [state:record-show-person]
  - `html`
- http://localhost:9540/object/company/af3eb8ea-395f-48e6-a229-3dc3cdafd119 [state:record-show-company]
  - `html`
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `html`
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:kanban-dark]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9540/objects/companies
  - `.sdcwa6d`
  - `._area_y24an_1`
- http://localhost:9540/objects/people
  - `.sdcwa6d`
  - `._area_y24an_1`
- http://localhost:9540/objects/opportunities
  - `.sdcwa6d`
  - `.section-title-label`
  - `#nav-item-companies-objects-companies-viewid-7b27df > .s1eultq7 > .senc9ls`
  - `#nav-item-people-objects-people-viewid-4f0a2c91-215 > .s1eultq7 > .senc9ls`
  - `#nav-item-opportunities-objects-opportunities-viewi > .s1eultq7 > .senc9ls`
  - `#nav-item-tasks-objects-tasks-viewid-b74a74b5-5330- > .s1eultq7 > .senc9ls`
  - `#nav-item-notes-objects-notes-viewid-ec6c6731-d842- > .s1eultq7 > .senc9ls`
  - `#nav-item-dashboards-objects-dashboards-viewid-74ee > .s1eultq7 > .senc9ls`
  - `#nav-item-pets-objects-pets-viewid-3f66581a-eaaa-41 > .s1eultq7 > .senc9ls`
  - `#nav-item-survey-results-objects-surveyresults-view > .s1eultq7 > .senc9ls`
  - … +4 autres
- http://localhost:9540/objects/tasks
  - `.sdcwa6d`
  - `.section-title-label`
  - `#nav-item-companies-objects-companies-viewid-7b27df > .s1eultq7 > .senc9ls`
  - `#nav-item-people-objects-people-viewid-4f0a2c91-215 > .s1eultq7 > .senc9ls`
  - `#nav-item-opportunities-objects-opportunities-viewi > .s1eultq7 > .senc9ls`
  - `#nav-item-tasks-objects-tasks-viewid-b74a74b5-5330- > .s1eultq7 > .senc9ls`
  - `#nav-item-notes-objects-notes-viewid-ec6c6731-d842- > .s1eultq7 > .senc9ls`
  - `#nav-item-dashboards-objects-dashboards-viewid-74ee > .s1eultq7 > .senc9ls`
  - `#nav-item-pets-objects-pets-viewid-3f66581a-eaaa-41 > .s1eultq7 > .senc9ls`
  - `#nav-item-survey-results-objects-surveyresults-view > .s1eultq7 > .senc9ls`
  - … +4 autres
- http://localhost:9540/settings/profile
  - `.sdcwa6d`
  - `.sj5kk0d:nth-child(1) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `#nav-item-profile-settings-profile > .s1eultq7 > .senc9ls`
  - `#nav-item-experience-settings-experience > .s1eultq7 > .senc9ls`
  - `#nav-item-accounts-settings-accounts > .s1eultq7 > .senc9ls`
  - `#nav-item-emails-settings-accounts-emails > .s1eultq7 > .senc9ls`
  - `#nav-item-calendars-settings-accounts-calendars > .s1eultq7 > .senc9ls`
  - `.sj5kk0d:nth-child(2) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `#nav-item-general-settings-general > .s1eultq7 > .senc9ls`
  - `#nav-item-data-model-settings-objects > .s1eultq7 > .senc9ls`
  - … +13 autres
- http://localhost:9540/settings/general
  - `.sdcwa6d`
  - `.sj5kk0d:nth-child(1) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `#nav-item-profile-settings-profile > .s1eultq7 > .senc9ls`
  - `#nav-item-experience-settings-experience > .s1eultq7 > .senc9ls`
  - `#nav-item-accounts-settings-accounts > .s1eultq7 > .senc9ls`
  - `#nav-item-emails-settings-accounts-emails > .s1eultq7 > .senc9ls`
  - `#nav-item-calendars-settings-accounts-calendars > .s1eultq7 > .senc9ls`
  - `.sj5kk0d:nth-child(2) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `#nav-item-general-settings-general > .s1eultq7 > .senc9ls`
  - `#nav-item-data-model-settings-objects > .s1eultq7 > .senc9ls`
  - … +16 autres
- http://localhost:9540/settings/members
  - `.sdcwa6d`
  - `.sj5kk0d:nth-child(1) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `#nav-item-profile-settings-profile > .s1eultq7 > .senc9ls`
  - `#nav-item-experience-settings-experience > .s1eultq7 > .senc9ls`
  - `#nav-item-accounts-settings-accounts > .s1eultq7 > .senc9ls`
  - `#nav-item-emails-settings-accounts-emails > .s1eultq7 > .senc9ls`
  - `#nav-item-calendars-settings-accounts-calendars > .s1eultq7 > .senc9ls`
  - `.sj5kk0d:nth-child(2) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `#nav-item-general-settings-general > .s1eultq7 > .senc9ls`
  - `#nav-item-data-model-settings-objects > .s1eultq7 > .senc9ls`
  - … +16 autres
- http://localhost:9540/settings/experience
  - `.sdcwa6d`
  - `.sj5kk0d:nth-child(1) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `#nav-item-profile-settings-profile > .s1eultq7 > .senc9ls`
  - `#nav-item-experience-settings-experience > .s1eultq7 > .senc9ls`
  - `#nav-item-accounts-settings-accounts > .s1eultq7 > .senc9ls`
  - `#nav-item-emails-settings-accounts-emails > .s1eultq7 > .senc9ls`
  - `#nav-item-calendars-settings-accounts-calendars > .s1eultq7 > .senc9ls`
  - `.sj5kk0d:nth-child(2) > .s1i3kk9u > .section-title-container.s121o0g0 > .s1ii6tsv > .section-title-label.sjvfeol`
  - `#nav-item-general-settings-general > .s1eultq7 > .senc9ls`
  - `#nav-item-data-model-settings-objects > .s1eultq7 > .senc9ls`
  - … +13 autres
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:opportunities-kanban]
  - `.sdcwa6d`
  - `.section-title-label`
  - `#nav-item-companies-objects-companies-viewid-7b27df > .s1eultq7 > .senc9ls`
  - `#nav-item-people-objects-people-viewid-4f0a2c91-215 > .s1eultq7 > .senc9ls`
  - `#nav-item-opportunities-objects-opportunities-viewi > .s1eultq7 > .senc9ls`
  - `#nav-item-tasks-objects-tasks-viewid-b74a74b5-5330- > .s1eultq7 > .senc9ls`
  - `#nav-item-notes-objects-notes-viewid-ec6c6731-d842- > .s1eultq7 > .senc9ls`
  - `#nav-item-dashboards-objects-dashboards-viewid-74ee > .s1eultq7 > .senc9ls`
  - `#nav-item-pets-objects-pets-viewid-3f66581a-eaaa-41 > .s1eultq7 > .senc9ls`
  - `#nav-item-survey-results-objects-surveyresults-view > .s1eultq7 > .senc9ls`
  - … +4 autres
- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `.sdcwa6d`
  - `.section-title-label`
  - `#nav-item-companies-objects-companies-viewid-7b27df > .s1eultq7 > .senc9ls`
  - `#nav-item-people-objects-people-viewid-4f0a2c91-215 > .s1eultq7 > .senc9ls`
  - `#nav-item-opportunities-objects-opportunities-viewi > .s1eultq7 > .senc9ls`
  - `#nav-item-tasks-objects-tasks-viewid-b74a74b5-5330- > .s1eultq7 > .senc9ls`
  - `#nav-item-notes-objects-notes-viewid-ec6c6731-d842- > .s1eultq7 > .senc9ls`
  - `#nav-item-dashboards-objects-dashboards-viewid-74ee > .s1eultq7 > .senc9ls`
  - `#nav-item-pets-objects-pets-viewid-3f66581a-eaaa-41 > .s1eultq7 > .senc9ls`
  - `#nav-item-survey-results-objects-surveyresults-view > .s1eultq7 > .senc9ls`
  - … +26 autres
- http://localhost:9540/objects/companies [state:command-menu]
  - `.sdcwa6d`
  - `.section-title-label`
  - `#nav-item-companies-objects-companies-viewid-7b27df > .s1eultq7 > .senc9ls`
  - `#nav-item-people-objects-people-viewid-4f0a2c91-215 > .s1eultq7 > .senc9ls`
  - `#nav-item-opportunities-objects-opportunities-viewi > .s1eultq7 > .senc9ls`
  - `#nav-item-tasks-objects-tasks-viewid-b74a74b5-5330- > .s1eultq7 > .senc9ls`
  - `#nav-item-notes-objects-notes-viewid-ec6c6731-d842- > .s1eultq7 > .senc9ls`
  - `#nav-item-dashboards-objects-dashboards-viewid-74ee > .s1eultq7 > .senc9ls`
  - `#nav-item-pets-objects-pets-viewid-3f66581a-eaaa-41 > .s1eultq7 > .senc9ls`
  - `#nav-item-survey-results-objects-surveyresults-view > .s1eultq7 > .senc9ls`
  - … +5 autres
- http://localhost:9540/object/person/8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51 [state:record-show-person]
  - `.sdcwa6d`
  - `.section-title-label`
  - `#nav-item-companies-objects-companies-viewid-7b27df > .s1eultq7 > .senc9ls`
  - `#nav-item-people-objects-people-viewid-4f0a2c91-215 > .s1eultq7 > .senc9ls`
  - `#nav-item-opportunities-objects-opportunities-viewi > .s1eultq7 > .senc9ls`
  - `#nav-item-tasks-objects-tasks-viewid-b74a74b5-5330- > .s1eultq7 > .senc9ls`
  - `#nav-item-notes-objects-notes-viewid-ec6c6731-d842- > .s1eultq7 > .senc9ls`
  - `#nav-item-dashboards-objects-dashboards-viewid-74ee > .s1eultq7 > .senc9ls`
  - `#nav-item-pets-objects-pets-viewid-3f66581a-eaaa-41 > .s1eultq7 > .senc9ls`
  - `#nav-item-survey-results-objects-surveyresults-view > .s1eultq7 > .senc9ls`
  - … +48 autres
- http://localhost:9540/object/company/af3eb8ea-395f-48e6-a229-3dc3cdafd119 [state:record-show-company]
  - `.sdcwa6d`
  - `.section-title-label`
  - `#nav-item-companies-objects-companies-viewid-7b27df > .s1eultq7 > .senc9ls`
  - `#nav-item-people-objects-people-viewid-4f0a2c91-215 > .s1eultq7 > .senc9ls`
  - `#nav-item-opportunities-objects-opportunities-viewi > .s1eultq7 > .senc9ls`
  - `#nav-item-tasks-objects-tasks-viewid-b74a74b5-5330- > .s1eultq7 > .senc9ls`
  - `#nav-item-notes-objects-notes-viewid-ec6c6731-d842- > .s1eultq7 > .senc9ls`
  - `#nav-item-dashboards-objects-dashboards-viewid-74ee > .s1eultq7 > .senc9ls`
  - `#nav-item-pets-objects-pets-viewid-3f66581a-eaaa-41 > .s1eultq7 > .senc9ls`
  - `#nav-item-survey-results-objects-surveyresults-view > .s1eultq7 > .senc9ls`
  - … +50 autres

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:9540/objects/companies
  - `html`
- http://localhost:9540/object/person/8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51 [state:record-show-person]
  - `html`
- http://localhost:9540/object/company/af3eb8ea-395f-48e6-a229-3dc3cdafd119 [state:record-show-company]
  - `html`

## [MODERATE] landmark-no-duplicate-banner — Document should not have more than one banner landmark

Ensure the document has at most one banner landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-banner?application=axeAPI

- http://localhost:9540/object/person/8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51 [state:record-show-person]
  - `._root_ztxxm_1._fullWidth_ztxxm_20[data-align="left"]:nth-child(1) > header`
- http://localhost:9540/object/company/af3eb8ea-395f-48e6-a229-3dc3cdafd119 [state:record-show-company]
  - `._root_ztxxm_1._fullWidth_ztxxm_20[data-align="left"]:nth-child(1) > header`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:9540/object/person/8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51 [state:record-show-person]
  - `._root_ztxxm_1._fullWidth_ztxxm_20[data-align="left"]:nth-child(1) > header`
- http://localhost:9540/object/company/af3eb8ea-395f-48e6-a229-3dc3cdafd119 [state:record-show-company]
  - `._root_ztxxm_1._fullWidth_ztxxm_20[data-align="left"]:nth-child(1) > header`

## Résultats incomplets à revoir (658)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-allowed-attr — Elements must only use supported ARIA attributes

- http://localhost:9540/objects/people
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-7 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-8 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-9 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-10 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - … +3 autres
- http://localhost:9540/objects/opportunities
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `#row-virtual-index-0 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-1 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-2 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-3 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-4 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - … +55 autres
- http://localhost:9540/objects/tasks
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-7 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `#row-virtual-index-0 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-1 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - `#row-virtual-index-2 > .slojy2m[data-active="false"][data-focused="false"] > .record-table-column-drag-and-drop.table-cell[data-select-disable="true"] > .s1f5mhhy[aria-label="SRbwTf"][aria-describedby="dnd-kit-description-3"]`
  - … +57 autres
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:opportunities-kanban]
  - `.s5e6ds0:nth-child(2) > .sgp4clb > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(4) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(6) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(8) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(10) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(2)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(4)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(6)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(8)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(10)`
  - … +95 autres
- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-7 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-8 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-9 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-10 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - … +62 autres
- http://localhost:9540/objects/companies [state:command-menu]
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-7 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-8 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-9 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-10 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - … +62 autres
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `.s1jglerr.header-cell.record-table-column-field-1 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-2 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-3 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-4 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-5 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-6 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-7 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-8 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-9 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s1jglerr.header-cell.record-table-column-field-10 > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - … +62 autres
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:kanban-dark]
  - `.s5e6ds0:nth-child(2) > .sgp4clb > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(4) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(6) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(8) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.s5e6ds0:nth-child(10) > .sgp4clb[data-has-left-border="true"] > .s15hjodz[data-dnd-sortable-handle="true"][aria-label="KGi3u9"]`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(2)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(4)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(6)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(8)`
  - `.sgbo4hz:nth-child(1) > .s1m3lf5l[data-replay-ignore-mutations="true"] > .s5e6ds0[aria-describedby="dnd-kit-description-2"][aria-roledescription="draggable"]:nth-child(10)`
  - … +95 autres

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9540/objects/people
  - `.ss5bjoo > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
- http://localhost:9540/objects/opportunities
  - `.ss5bjoo > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
- http://localhost:9540/objects/tasks
  - `.ss5bjoo > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:opportunities-kanban]
  - `.ss5bjoo > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
- http://localhost:9540/objects/companies [state:companies-filters-open]
  - `.ss5bjoo > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
- http://localhost:9540/objects/companies [state:command-menu]
  - `.ss5bjoo > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
- http://localhost:9540/object/person/8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51 [state:record-show-person]
  - `.s1qrz9yb:nth-child(2) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s1qrz9yb:nth-child(3) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s1qrz9yb:nth-child(4) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[aria-haspopup="true"][width="auto"]`
- http://localhost:9540/object/company/af3eb8ea-395f-48e6-a229-3dc3cdafd119 [state:record-show-company]
  - `.s1qrz9yb:nth-child(2) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s1qrz9yb:nth-child(3) > .s5e6ds0 > .widget.s1d9zfop[data-secondary-background="false"] > .widget-card-header.stirurp > .s7cviji > .sdwv33o > .s1cjc50x[aria-haspopup="true"][width="auto"]`
- http://localhost:9540/objects/companies [state:mobile-companies-390]
  - `.ss5bjoo > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:kanban-dark]
  - `.ss5bjoo > .s1cjc50x[aria-haspopup="true"][width="auto"]`
  - `.s3ydzcz > .s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(1)`
  - `.s1cjc50x[aria-haspopup="true"][width="auto"]:nth-child(3)`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

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
  - `#base-ui-_r_16_`
  - `#base-ui-_r_18_`
  - `#base-ui-_r_1a_`
  - `#base-ui-_r_1c_`
  - `#base-ui-_r_1e_`
  - `#base-ui-_r_1g_`
  - `#base-ui-_r_1i_`
  - `#base-ui-_r_1k_`
  - `#base-ui-_r_1m_`
  - … +9 autres

### aria-toggle-field-name — ARIA toggle fields must have an accessible name

- http://localhost:9540/settings/experience
  - `#base-ui-_r_7k_`
  - `#base-ui-_r_7n_`

### label-content-name-mismatch — Elements must have their visible text as part of their accessible name

- http://localhost:9540/settings/experience
  - `#base-ui-_r_6p_`
  - `#base-ui-_r_6t_`
  - `#base-ui-_r_71_`
- http://localhost:9540/object/person/8f5fdab3-4ba8-4394-aea8-f9ba0e0ddb51 [state:record-show-person]
  - `button[aria-label="A11y C54 Person"]`

### target-size — All touch targets must be 24px large, or leave sufficient space

- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:opportunities-kanban]
  - `#record-board-card-0-1 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a[data-click-outside-id="link-chip-click-outside-id"]`
  - `#record-board-card-0-2 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a[data-click-outside-id="link-chip-click-outside-id"]`
  - `#record-board-card-0-3 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a[data-click-outside-id="link-chip-click-outside-id"]`
  - `#record-board-card-1-0 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a[data-click-outside-id="link-chip-click-outside-id"]`
  - `#record-board-card-1-1 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a[data-click-outside-id="link-chip-click-outside-id"]`
  - `#record-board-card-1-2 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a[data-click-outside-id="link-chip-click-outside-id"]`
  - `#record-board-card-1-3 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a[data-click-outside-id="link-chip-click-outside-id"]`
  - `#record-board-card-a8a1fb86-c93c-4768-a41c-1b566e40bafe-company > .stnirlz > .s8fyxo > .s1u9v1rs > .l1ms3w10 > a[data-click-outside-id="link-chip-click-outside-id"]`
  - `#record-board-card-2-1 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a[data-click-outside-id="link-chip-click-outside-id"]`
  - `#record-board-card-2-2 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a[data-click-outside-id="link-chip-click-outside-id"]`
  - … +9 autres
- http://localhost:9540/objects/opportunities?viewId=1cc5367c-7446-4ee8-8dae-3d609092b57a [state:kanban-dark]
  - `#record-board-card-0-1 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a`
  - `#record-board-card-0-2 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a`
  - `#record-board-card-0-3 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a`
  - `#record-board-card-1-0 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a`
  - `#record-board-card-1-1 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a`
  - `#record-board-card-1-2 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a`
  - `#record-board-card-1-3 > .s13bjsrd[data-click-outside-id="record-board-card"] > .s1ks5m2x > .sdyi49k[data-selected="false"][data-focused="false"] > .snhx4bo > .s1g5le2x > .s1m0689v > .l1ms3w10 > a`
  - `#record-board-card-50505050-0018-4e7c-8001-123456789abc-company > .stnirlz > .s8fyxo > .s1u9v1rs > .l1ms3w10 > a`

