# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 28/28 scénario(s) audité(s), 0 erreur(s), 151 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `bc22ec601320`

## Résultats incomplets à revoir (151)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9970/
  - `input`
- http://localhost:9970/#/home
  - `input`
- http://localhost:9970/#/accounts/index
  - `.form-control`
- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001
  - `input`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(1) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(2) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
- http://localhost:9970/#/accounts/edit?return_module=Accounts&return_action=DetailView
  - `.search-bar-term`
- http://localhost:9970/#/contacts/index
  - `.form-control`
- http://localhost:9970/#/contacts/record/58con001-0000-4000-8000-000000000001
  - `.form-control`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(1) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > .col-form-label-sm.mb-0`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(2) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > .col-form-label-sm.mb-0`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(3) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > .col-form-label-sm.mb-0`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > .col-form-label-sm.mb-0`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(6) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > .col-form-label-sm.mb-0`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(6) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > .col-form-label-sm.mb-0`
- http://localhost:9970/#/contacts/edit?return_module=Contacts&return_action=DetailView
  - `.search-bar-term`
  - `select`
- http://localhost:9970/#/leads/index
  - `.form-control`
- http://localhost:9970/#/leads/record/58lea001-0000-4000-8000-000000000001
  - `input`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(1) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(3) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(3) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(5) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(5) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
- http://localhost:9970/#/leads/edit?return_module=Leads&return_action=DetailView
  - `.search-bar-term`
  - `select`
- http://localhost:9970/#/opportunities/index
  - `.form-control`
- http://localhost:9970/#/opportunities/record/58opp001-0000-4000-8000-000000000001
  - `input`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(1) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.field-layout-field-label-wrapper.label-container > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(1) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.field-layout-field-label-wrapper.label-container > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(2) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.field-layout-field-label-wrapper.label-container > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(2) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.field-layout-field-label-wrapper.label-container > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(3) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.field-layout-field-label-wrapper.label-container > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.field-layout-field-label-wrapper.label-container > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.field-layout-field-label-wrapper.label-container > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(7) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.field-layout-field-label-wrapper.label-container > strong > label`
- http://localhost:9970/#/opportunities/edit?return_module=Opportunities&return_action=DetailView
  - `.search-bar-term`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(1) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(2) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `select[aria-label="Currency"]`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(2) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `select[aria-label="Sales Stage"]`
  - `select[aria-label="Type"]`
  - `select[aria-label="Lead Source"]`
- http://localhost:9970/#/administration/index
  - `input`
- http://localhost:9970/#/home [state:nav-module-submenu]
  - `input`
- http://localhost:9970/#/home [state:nav-more-menu]
  - `a[href$="#/project"] > span`
  - `a[href$="#/project-templates"] > span`
  - `a[href$="#/events"] > span`
  - `a[href$="#/event-locations"] > span`
  - `a[href$="#/products"] > span`
  - `input`
- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001 [state:global-links-menu]
  - `input`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(1) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(2) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
- http://localhost:9970/#/accounts/index [state:list-filter-open]
  - `.search-bar-term`
  - `select`
- http://localhost:9970/#/accounts/index [state:list-bulk-action-menu]
  - `.form-control`
  - `.table-header > .justify-content-between.align-items-center.d-flex > .d-flex > scrm-bulk-action-menu > .bulk-action.d-flex > .d-sm-block > .dropdown-button.bulk-action-group.float-left > .bulk-action-button.btn-sm[ngbdropdowntoggle=""] > scrm-label`
  - `.show.bulk-action-button[ngbdropdowntoggle=""] > scrm-label`
  - `select`
  - `.tick[transform="translate(2.1875,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(24.0625,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(45.9375,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(67.8125,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(89.6875,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(111.5625,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - … +10 autres
- http://localhost:9970/#/accounts/index [state:list-column-chooser]
  - `.form-control`
  - `select`
  - `.tick[transform="translate(2.1875,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(24.0625,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(45.9375,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(67.8125,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(89.6875,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(111.5625,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(133.4375,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - `.tick[transform="translate(155.3125,10)"] > text[font-size="12px"][transform="rotate(-90)"][text-anchor="end"]`
  - … +8 autres
- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001 [state:record-actions-menu]
  - `input`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(1) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(2) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-layout-col.pl-3.pb-2:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.widget-bar-entry.col-6.justify-content-start:nth-child(2) > .widget-bar-entry-value.pl-1.pr-1 > .field-mode-list.field-type-currency[mode="list"] > .dynamic-field-mode-list.dynamic-field-type-currency > .w-100.flex-grow-1.d-flex > scrm-currency-detail`
  - `.widget-bar-entry.col-6.justify-content-start:nth-child(2) > .widget-bar-entry-end-label.pl-1`
- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001 [state:record-tab-more-info]
  - `input`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(2) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.field-layout-field-label-wrapper.label-container > strong > label`
- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001 [state:subpanel-open]
  - `input`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(1) > .field-layout-col.pl-3.pr-3:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(2) > .field-layout-col.pl-3.pr-3:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-column-bordered.field-layout-col.pl-3 > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
  - `.field-layout-row.form-row.align-items-stretch:nth-child(4) > .field-layout-col.pl-3.pr-3:nth-child(2) > .field-layout-field-group-wrapper.row.form-group > .col-form-label.col-lg-3.field-layout-field-label-wrapper > strong > label`
- http://localhost:9970/#/contacts/edit?return_module=Contacts&return_action=DetailView [state:edit-p-dropdown-open]
  - `.search-bar-term`
  - `select`
  - `input[aria-label="Mobile"]`
- http://localhost:9970/#/contacts/edit?return_module=Contacts&return_action=DetailView [state:edit-relate-field]
  - `.search-bar-term`
  - `select`
  - `.p-dropdown-empty-message`
  - `.align-self-start.flex-fill.h-100:nth-child(2) > .field-group-label.pr-1 > label > scrm-label`
  - `.align-self-start.flex-fill.h-100:nth-child(3) > .field-group-label.pr-1 > label > scrm-label`
  - `.align-self-start.flex-fill.h-100:nth-child(4) > .field-group-label.pr-1 > label > scrm-label`
- http://localhost:9970/#/home [state:mobile-390]
  - `input[placeholder="Filter Modules..."]`

### frame-tested — Frames should be tested with axe-core

- http://localhost:9970/
  - `iframe`
- http://localhost:9970/#/home
  - `iframe`
- http://localhost:9970/#/home [state:nav-module-submenu]
  - `iframe`
- http://localhost:9970/#/home [state:nav-more-menu]
  - `iframe`
- http://localhost:9970/#/home [state:global-search]
  - `iframe`
- http://localhost:9970/#/home [state:mobile-390]
  - `iframe`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9970/#/accounts/index
  - `table`
- http://localhost:9970/#/contacts/index
  - `table`
- http://localhost:9970/#/leads/index
  - `table`
- http://localhost:9970/#/opportunities/index
  - `table`
- http://localhost:9970/#/accounts/index [state:list-filter-open]
  - `table`
- http://localhost:9970/#/accounts/index [state:list-bulk-action-menu]
  - `table`
- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001 [state:subpanel-open]
  - `.cdk-table`
- http://localhost:9970/#/contacts/edit?return_module=Contacts&return_action=DetailView [state:edit-p-dropdown-open]
  - `span[aria-controls="pn_id_1_list"]`
- http://localhost:9970/#/contacts/edit?return_module=Contacts&return_action=DetailView [state:edit-relate-field]
  - `.p-placeholder`

### aria-allowed-attr — Elements must only use supported ARIA attributes

- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001
  - `scrm-image[aria-controls="collapseShowSubPanels"]`
- http://localhost:9970/#/contacts/record/58con001-0000-4000-8000-000000000001
  - `scrm-image[aria-controls="collapseShowSubPanels"]`
- http://localhost:9970/#/leads/record/58lea001-0000-4000-8000-000000000001
  - `scrm-image[aria-controls="collapseShowSubPanels"]`
- http://localhost:9970/#/opportunities/record/58opp001-0000-4000-8000-000000000001
  - `scrm-image[aria-controls="collapseShowSubPanels"]`
- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001 [state:global-links-menu]
  - `scrm-image[aria-controls="collapseShowSubPanels"]`
- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001 [state:record-actions-menu]
  - `scrm-image[aria-controls="collapseShowSubPanels"]`
- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001 [state:record-tab-more-info]
  - `scrm-image[aria-controls="collapseShowSubPanels"]`
- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001 [state:subpanel-open]
  - `scrm-image[aria-controls="collapseShowSubPanels"]`

### label-content-name-mismatch — Elements must have their visible text as part of their accessible name

- http://localhost:9970/#/accounts/index [state:list-filter-open]
  - `.btn-outline-light`
- http://localhost:9970/#/accounts/index [state:list-column-chooser]
  - `.btn-outline-light`
- http://localhost:9970/#/accounts/record/58acc001-0000-4000-8000-000000000001 [state:subpanel-open]
  - `.close-button`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:9970/#/accounts/index [state:list-column-chooser]
  - `app-root`

