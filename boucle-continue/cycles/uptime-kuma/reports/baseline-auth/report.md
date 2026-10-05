# Audit accessibilité — 2026-10-05

**13 règle(s) violée(s), 602 occurrence(s), 43/43 scénario(s) audité(s), 0 erreur(s), 127 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `69c37c1f49e8`

## [CRITICAL] aria-required-attr — Required ARIA attributes must be provided

Ensure elements with ARIA roles have all required ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-attr?application=axeAPI

- http://localhost:3001/add
  - `div[aria-owns="listbox-acceptedStatusCodes"]`
- http://localhost:3001/edit/2
  - `div[aria-owns="listbox-acceptedStatusCodes"]`
- http://localhost:3001/clone/2
  - `div[aria-owns="listbox-acceptedStatusCodes"]`
- http://localhost:3001/add-maintenance
  - `div[aria-owns="listbox-affected_monitors"]`
  - `div[aria-owns="listbox-selected_status_pages"]`
- http://localhost:3001/maintenance/edit/1
  - `div[aria-owns="listbox-affected_monitors"]`
  - `div[aria-owns="listbox-selected_status_pages"]`
- http://localhost:3001/settings/tags [state:tag-edit-dialog]
  - `.col-8 > .multiselect[role="combobox"][aria-owns="listbox-null"]`
  - `.mt-1`
- http://localhost:3001/add [state:monitor-type-keyword]
  - `div[aria-owns="listbox-acceptedStatusCodes"]`
- http://localhost:3001/status/demo [state:status-page-edit]
  - `.multiselect`
- http://localhost:3001/status/demo [state:incident-create]
  - `.multiselect`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:3001/add-maintenance
  - `#show-on-all-pages`
- http://localhost:3001/maintenance/edit/1
  - `#show-on-all-pages`
  - `.col:nth-child(1) > input[type="datetime-local"][max="9999-12-31T23:59"][required=""]`
  - `.col:nth-child(2) > input[type="datetime-local"][max="9999-12-31T23:59"][required=""]`
- http://localhost:3001/settings/general
  - `#steamAPIKey > input[type="password"][placeholder=""][maxlength="255"]`
  - `#globalpingApiToken > input[type="password"][placeholder=""][maxlength="255"]`
- http://localhost:3001/settings/notifications [state:notification-dialog]
  - `input[type="password"]`
  - `.mb-3[data-v-540b25d6=""]:nth-child(5) > .form-check.form-switch[data-v-540b25d6=""] > .form-check-input[type="checkbox"]`
  - `.mb-3[data-v-540b25d6=""]:nth-child(6) > .form-check.form-switch[data-v-540b25d6=""] > .form-check-input[type="checkbox"]`
  - `.mb-3[data-v-540b25d6=""]:nth-child(7) > .form-check.form-switch[data-v-540b25d6=""] > .form-check-input[type="checkbox"]`
  - `.form-check.form-switch:nth-child(2) > .form-check-input[type="checkbox"]`
  - `.form-check.form-switch:nth-child(5) > .form-check-input[type="checkbox"]`
- http://localhost:3001/settings/api-keys [state:api-key-dialog]
  - `.dp__pointer`
- http://localhost:3001/settings/tags [state:tag-edit-dialog]
  - `#tag-color-hex`
- http://localhost:3001/status/demo [state:status-page-edit]
  - `.prism-editor__textarea`
- http://localhost:3001/status/demo [state:incident-create]
  - `.prism-editor__textarea`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:3001/settings/tags
  - `.btn-rm-tag`
- http://localhost:3001/settings/tags [state:tag-edit-dialog]
  - `.btn-rm-tag`
  - `.btn-rm-monitor`
- http://localhost:3001/status/demo [state:status-page-edit]
  - `.small-reset-btn`
- http://localhost:3001/status/demo [state:incident-create]
  - `.small-reset-btn`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-attr?application=axeAPI

- http://localhost:3001/dashboard [state:user-menu-dropdown]
  - `div[data-bs-toggle="dropdown"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:3001/dashboard
  - `.nav-item.me-2:nth-child(2) > .router-link-exact-active[aria-current="page"][href$="dashboard"]`
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.btn-sm`
  - `tr:nth-child(1) > td:nth-child(3) > .bg-primary.rounded-pill[data-v-99b386eb=""]`
  - `td:nth-child(3) > .bg-danger.rounded-pill[data-v-99b386eb=""]`
  - `td:nth-child(3) > .bg-warning.rounded-pill[data-v-99b386eb=""]`
  - `tr:nth-child(4) > td:nth-child(3) > .bg-primary.rounded-pill[data-v-99b386eb=""]`
  - `td:nth-child(3) > .bg-maintenance.rounded-pill[data-v-99b386eb=""]`
- http://localhost:3001/dashboard/1
  - `.nav-link.active[href$="dashboard"]`
  - `a[href$="add"]`
  - `.bg-secondary.rounded-pill[title="24 hours"]`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
- http://localhost:3001/dashboard/2
  - `.nav-link.active[href$="dashboard"]`
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.item.disabled[href$="dashboard/1"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `a[href$="dashboard/3"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .me-1[data-v-cb177f7c=""] > .bg-primary.rounded-pill[title="24 hours"]`
  - `a[href$="dashboard/3"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.router-link-exact-active > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .me-1[data-v-cb177f7c=""] > .bg-primary.rounded-pill[title="24 hours"]`
  - `.router-link-exact-active > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.tag-wrapper.rounded[title="prod"] > .tag-text[data-v-3eebab42=""]`
  - `.tags[data-v-fe0f35a5=""] > .tag-scrollable.tag-constrained.tag-wrapper > .tag-text[data-v-3eebab42=""]`
  - … +17 autres
- http://localhost:3001/dashboard/3
  - `.nav-link.active[href$="dashboard"]`
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.item.disabled[href$="dashboard/1"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.router-link-exact-active > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .me-1[data-v-cb177f7c=""] > .bg-primary.rounded-pill[title="24 hours"]`
  - `.router-link-exact-active > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `a[href$="dashboard/2"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .me-1[data-v-cb177f7c=""] > .bg-primary.rounded-pill[title="24 hours"]`
  - `a[href$="dashboard/2"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.gap-1 > .tag-wrapper.rounded.d-inline-flex > .tag-text[data-v-3eebab42=""]`
- http://localhost:3001/add
  - `.active`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `label[for="type"]`
  - `label[for="name"]`
  - `#name`
  - `label[for="url"]`
  - `#url`
  - `label[for="interval"]`
  - `#interval`
  - … +55 autres
- http://localhost:3001/edit/2
  - `.active.nav-link[href$="dashboard"]`
  - `a[href$="add"]`
  - `.bg-secondary`
  - `a[href$="dashboard/1"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `a[href$="dashboard/3"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .me-1[data-v-cb177f7c=""] > .bg-primary.rounded-pill[title="24 hours"]`
  - `a[href$="dashboard/3"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `a[href$="dashboard/2"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .me-1[data-v-cb177f7c=""] > .bg-primary.rounded-pill[title="24 hours"]`
  - `a[href$="dashboard/2"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.tags > .py-0.tag-wrapper.px-2 > .tag-text[data-v-3eebab42=""]`
- http://localhost:3001/clone/2
  - `.active`
  - `.bg-secondary`
  - `a[href$="dashboard/1"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `a[href$="dashboard/3"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .me-1[data-v-cb177f7c=""] > .bg-primary.rounded-pill[title="24 hours"]`
  - `a[href$="dashboard/3"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `a[href$="dashboard/2"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .me-1[data-v-cb177f7c=""] > .bg-primary.rounded-pill[title="24 hours"]`
  - `a[href$="dashboard/2"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.tags > .py-0.tag-wrapper.px-2 > .tag-text[data-v-3eebab42=""]`
- http://localhost:3001/list
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `h1`
  - `.col[data-v-92abad2d=""]:nth-child(1) > h3`
  - `.col[data-v-92abad2d=""]:nth-child(2) > h3`
  - `.col[data-v-92abad2d=""]:nth-child(3) > h3`
  - `.col[data-v-92abad2d=""]:nth-child(4) > h3`
  - `.col[data-v-92abad2d=""]:nth-child(5) > h3`
  - `.btn-sm`
  - … +30 autres
- http://localhost:3001/manage-status-page
  - `.active`
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `a[href$="add-status-page"]`
- http://localhost:3001/add-status-page
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
- http://localhost:3001/maintenance
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `a[href$="add-maintenance"]`
  - `.btn-group > .btn-primary.btn`
  - `a[href$="clone/1"]`
  - `a[href$="edit/1"]`
  - `.text-danger`
- http://localhost:3001/add-maintenance
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
- http://localhost:3001/maintenance/edit/1
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.my-3:nth-child(2) > .form-text`
  - `.mb-2.justify-content-between.align-items-center > .form-text`
  - `div[aria-owns="listbox-affected_monitors"] > .multiselect__tags > .multiselect__placeholder`
  - `div[aria-owns="listbox-selected_status_pages"] > .multiselect__tags > .multiselect__placeholder`
  - `.btn-outline-primary.btn-sm.btn:nth-child(1)`
  - `.btn-outline-primary.btn-sm.btn:nth-child(2)`
  - `.btn-outline-primary.btn-sm.btn:nth-child(4)`
  - … +6 autres
- http://localhost:3001/settings/general
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.mb-4:nth-child(5) > .input-group.mb-3 > .btn-outline-primary.btn[type="button"]`
  - `.mb-4:nth-child(6) > .form-text`
  - `.mb-4:nth-child(7) > .form-text`
  - `.mb-4:nth-child(8) > .input-group.mb-3 > .btn-outline-primary.btn[type="button"]`
  - `.mb-4:nth-child(8) > .form-text`
  - `button[type="submit"]`
- http://localhost:3001/settings/appearance
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `label[for="btncheck1"]`
  - `label[for="btncheck2"]`
  - `label[for="btncheck3"]`
  - `label[for="btncheck4"]`
  - `label[for="btncheck5"]`
  - `label[for="btncheck6"]`
  - `label[for="styleElapsedTimeShowNoLine"]`
  - … +2 autres
- http://localhost:3001/settings/notifications
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
- http://localhost:3001/settings/reverse-proxy
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.mt-4:nth-child(1)`
  - `.my-3[data-v-4e5028ed=""]:nth-child(2) > div[data-v-4e5028ed=""]:nth-child(1)`
  - `div[data-v-4e5028ed=""]:nth-child(1) > .text-danger`
  - `.my-3[data-v-4e5028ed=""]:nth-child(2) > div[data-v-4e5028ed=""]:nth-child(2)`
  - `div[data-v-4e5028ed=""]:nth-child(2) > .text-danger`
  - `p`
  - `p > a[target="_blank"]`
  - … +9 autres
- http://localhost:3001/settings/tags
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
- http://localhost:3001/settings/monitor-history
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
- http://localhost:3001/settings/docker-hosts
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `p`
  - `.btn-primary.me-2.btn`
- http://localhost:3001/settings/remote-browsers
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
- http://localhost:3001/settings/security
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `#logout-btn`
  - `button[type="submit"]`
  - `.mt-5 > .mb-4 > .btn-primary.me-2.btn`
  - `#disableAuth-btn`
- http://localhost:3001/settings/api-keys
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.me-2.btn-primary[data-v-6920dde8=""]`
  - `.justify-content-center.my-3[data-v-6920dde8=""]`
  - `a[target="_blank"][data-v-6920dde8=""]`
- http://localhost:3001/settings/proxies
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.btn-primary.me-2[data-v-4bb1dd25=""]`
- http://localhost:3001/settings/about
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.frontend-version`
- http://localhost:3001/dashboard [state:user-menu-dropdown]
  - `.nav-item.me-2:nth-child(2) > .router-link-exact-active[aria-current="page"][href$="dashboard"]`
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `tr:nth-child(1) > td:nth-child(3) > .bg-primary.rounded-pill[data-v-99b386eb=""]`
  - `td:nth-child(3) > .bg-warning.rounded-pill[data-v-99b386eb=""]`
  - `tr:nth-child(4) > td:nth-child(3) > .bg-primary.rounded-pill[data-v-99b386eb=""]`
- http://localhost:3001/dashboard [state:monitor-list-filter-status]
  - `.nav-item.me-2:nth-child(2) > .router-link-exact-active[aria-current="page"][href$="dashboard"]`
  - `a[href$="add"]`
  - `.justify-content-between.align-items-center.d-flex > .bg-primary.rounded-pill[data-v-99b386eb=""]`
  - `.justify-content-between.align-items-center.d-flex > .bg-warning.rounded-pill[data-v-99b386eb=""]`
  - `tr:nth-child(1) > td:nth-child(3) > .bg-primary.rounded-pill[data-v-99b386eb=""]`
  - `td:nth-child(3) > .bg-warning.rounded-pill[data-v-99b386eb=""]`
  - `tr:nth-child(4) > td:nth-child(3) > .bg-primary.rounded-pill[data-v-99b386eb=""]`
- http://localhost:3001/dashboard [state:monitor-list-filter-tags]
  - `.nav-item.me-2:nth-child(2) > .router-link-exact-active[aria-current="page"][href$="dashboard"]`
  - `a[href$="add"]`
  - `.tag-text`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `tr:nth-child(1) > td:nth-child(3) > .bg-primary.rounded-pill[data-v-99b386eb=""]`
  - `td:nth-child(3) > .bg-warning.rounded-pill[data-v-99b386eb=""]`
  - `tr:nth-child(4) > td:nth-child(3) > .bg-primary.rounded-pill[data-v-99b386eb=""]`
- http://localhost:3001/dashboard/2 [state:delete-monitor-confirm]
  - `.nav-link.active[href$="dashboard"]`
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.item.disabled[href$="dashboard/1"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `a[href$="dashboard/3"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .me-1[data-v-cb177f7c=""] > .bg-primary.rounded-pill[title="24 hours"]`
  - `a[href$="dashboard/3"] > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.router-link-exact-active > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .me-1[data-v-cb177f7c=""] > .bg-primary.rounded-pill[title="24 hours"]`
  - `.router-link-exact-active > .row[data-v-cb177f7c=""] > .small-padding.col-9.gap-2 > .gap-2.flex-fill.align-items-center > .flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.tag-wrapper.rounded[title="prod"] > .tag-text[data-v-3eebab42=""]`
  - `.tags[data-v-fe0f35a5=""] > .tag-scrollable.tag-constrained.tag-wrapper > .tag-text[data-v-3eebab42=""]`
  - … +14 autres
- http://localhost:3001/dashboard [state:clear-events-confirm]
  - `.nav-item.me-2:nth-child(2) > .router-link-exact-active[aria-current="page"][href$="dashboard"]`
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `tr:nth-child(1) > td:nth-child(3) > .bg-primary.rounded-pill[data-v-99b386eb=""]`
  - `td:nth-child(3) > .bg-warning.rounded-pill[data-v-99b386eb=""]`
  - `tr:nth-child(4) > td:nth-child(3) > .bg-primary.rounded-pill[data-v-99b386eb=""]`
- http://localhost:3001/settings/notifications [state:notification-dialog]
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.me-2.btn-primary.btn`
  - `.pt-4.my-4[data-v-d7c41cfa=""]:nth-child(3) > div[data-v-d7c41cfa=""]:nth-child(6) > .btn-primary.btn[type="button"]`
  - `.pt-4.my-4[data-v-d7c41cfa=""]:nth-child(4) > div[data-v-d7c41cfa=""]:nth-child(6) > .btn-primary.btn[type="button"]`
- http://localhost:3001/settings/proxies [state:proxy-dialog]
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.btn-primary.me-2[data-v-4bb1dd25=""]`
  - `button[type="submit"]`
- http://localhost:3001/settings/docker-hosts [state:docker-host-dialog]
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.btn-primary.me-2.btn`
  - `.btn-warning`
  - `button[type="submit"]`
- http://localhost:3001/settings/remote-browsers [state:remote-browser-dialog]
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.btn-primary.me-2.btn`
  - `.btn-warning`
  - `button[type="submit"]`
- http://localhost:3001/settings/api-keys [state:api-key-dialog]
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.me-2.btn-primary[data-v-6920dde8=""]`
  - `#monitor-submit-btn`
- http://localhost:3001/settings/tags [state:tag-edit-dialog]
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.btn-primary.btn[data-v-21a97631=""]`
  - `.m-2 > .tag-text[data-v-3eebab42=""]`
  - `.multiselect__placeholder`
  - `button[type="submit"]`
- http://localhost:3001/settings/security [state:twofa-dialog]
  - `a[href$="add"]`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `button[type="submit"]`
  - `.mt-5 > .mb-4 > .btn-primary.me-2.btn`
  - `#disableAuth-btn`
  - `.bg-primary.badge[data-v-c015e868=""]`
  - `.btn-primary.btn[data-v-c015e868=""]`
- http://localhost:3001/add [state:monitor-type-docker]
  - `.active`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.me-2.btn-primary.btn`
  - `#monitor-submit-btn`
- http://localhost:3001/add [state:monitor-type-keyword]
  - `.active`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
  - `.multiselect__tag > span`
  - `.col-md-6[data-v-4f075921=""]:nth-child(2) > .me-2.btn-primary.btn`
  - `div[data-v-4f075921=""]:nth-child(4) > .me-2.btn-primary.btn`
  - `#monitor-submit-btn`
- http://localhost:3001/status/demo [state:status-page-edit]
  - `.btn-success`
  - `button[data-testid="create-incident-button"]`
  - `button[data-testid="add-group-button"]`
  - `.multiselect__placeholder`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(1) > .row[data-v-d323db95=""] > .col-9.small-padding.col-xl-6 > .info[data-v-d323db95=""] > .badge.rounded-pill.bg-primary`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(1) > .row[data-v-d323db95=""] > .col-3.col-xl-6[data-v-d323db95=""] > .wrap[data-v-add91a45=""][data-v-d323db95=""] > .justify-content-between.align-items-center.word > div[data-v-add91a45=""]:nth-child(1)`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(1) > .row[data-v-d323db95=""] > .col-3.col-xl-6[data-v-d323db95=""] > .wrap[data-v-add91a45=""][data-v-d323db95=""] > .justify-content-between.align-items-center.word > div[data-v-add91a45=""]:nth-child(2)`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(2) > .row[data-v-d323db95=""] > .col-9.small-padding.col-xl-6 > .info[data-v-d323db95=""] > .badge.rounded-pill.bg-primary`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(2) > .row[data-v-d323db95=""] > .col-3.col-xl-6[data-v-d323db95=""] > .wrap[data-v-add91a45=""][data-v-d323db95=""] > .justify-content-between.align-items-center.word > div[data-v-add91a45=""]:nth-child(1)`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(2) > .row[data-v-d323db95=""] > .col-3.col-xl-6[data-v-d323db95=""] > .wrap[data-v-add91a45=""][data-v-d323db95=""] > .justify-content-between.align-items-center.word > div[data-v-add91a45=""]:nth-child(2)`
- http://localhost:3001/status/demo [state:incident-create]
  - `.btn-success`
  - `button[data-testid="create-incident-button"]`
  - `.form-text[data-v-b5983611=""]`
  - `button[data-testid="add-group-button"]`
  - `.multiselect__placeholder`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(1) > .row[data-v-d323db95=""] > .col-9.small-padding.col-xl-6 > .info[data-v-d323db95=""] > .badge.rounded-pill[title="24 hours"]`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(1) > .row[data-v-d323db95=""] > .col-3.col-xl-6[data-v-d323db95=""] > .wrap[data-v-add91a45=""][data-v-d323db95=""] > .justify-content-between.align-items-center.word > div[data-v-add91a45=""]:nth-child(1)`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(1) > .row[data-v-d323db95=""] > .col-3.col-xl-6[data-v-d323db95=""] > .wrap[data-v-add91a45=""][data-v-d323db95=""] > .justify-content-between.align-items-center.word > div[data-v-add91a45=""]:nth-child(2)`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(2) > .row[data-v-d323db95=""] > .col-9.small-padding.col-xl-6 > .info[data-v-d323db95=""] > .badge.rounded-pill[title="24 hours"]`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(2) > .row[data-v-d323db95=""] > .col-3.col-xl-6[data-v-d323db95=""] > .wrap[data-v-add91a45=""][data-v-d323db95=""] > .justify-content-between.align-items-center.word > div[data-v-add91a45=""]:nth-child(1)`
  - … +1 autres
- http://localhost:3001/settings/appearance [state:dark-mode]
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
- http://localhost:3001/dashboard [state:mobile-dashboard]
  - `.btn-sm`
  - `.bg-warning`

## [SERIOUS] object-alt — <object> elements must have alternative text

Ensure <object> elements have alternative text
Référence : https://dequeuniversity.com/rules/axe/4.13/object-alt?application=axeAPI

- http://localhost:3001/dashboard
  - `object`
- http://localhost:3001/dashboard/1
  - `object`
- http://localhost:3001/dashboard/2
  - `object`
- http://localhost:3001/dashboard/3
  - `object`
- http://localhost:3001/add
  - `object`
- http://localhost:3001/edit/2
  - `object`
- http://localhost:3001/clone/2
  - `object`
- http://localhost:3001/list
  - `object`
- http://localhost:3001/manage-status-page
  - `object`
- http://localhost:3001/add-status-page
  - `object`
- http://localhost:3001/maintenance
  - `object`
- http://localhost:3001/add-maintenance
  - `object`
- http://localhost:3001/maintenance/edit/1
  - `object`
- http://localhost:3001/settings/general
  - `object`
- http://localhost:3001/settings/appearance
  - `object`
- http://localhost:3001/settings/notifications
  - `object`
- http://localhost:3001/settings/reverse-proxy
  - `object`
- http://localhost:3001/settings/tags
  - `object`
- http://localhost:3001/settings/monitor-history
  - `object`
- http://localhost:3001/settings/docker-hosts
  - `object`
- http://localhost:3001/settings/remote-browsers
  - `object`
- http://localhost:3001/settings/security
  - `object`
- http://localhost:3001/settings/api-keys
  - `object`
- http://localhost:3001/settings/proxies
  - `object`
- http://localhost:3001/settings/about
  - `.bi`
  - `.my-4`
- http://localhost:3001/dashboard [state:user-menu-dropdown]
  - `object`
- http://localhost:3001/dashboard [state:monitor-list-filter-status]
  - `object`
- http://localhost:3001/dashboard [state:monitor-list-filter-tags]
  - `object`
- http://localhost:3001/dashboard/2 [state:delete-monitor-confirm]
  - `object`
- http://localhost:3001/dashboard [state:clear-events-confirm]
  - `object`
- http://localhost:3001/settings/notifications [state:notification-dialog]
  - `object`
- http://localhost:3001/settings/proxies [state:proxy-dialog]
  - `object`
- http://localhost:3001/settings/docker-hosts [state:docker-host-dialog]
  - `object`
- http://localhost:3001/settings/remote-browsers [state:remote-browser-dialog]
  - `object`
- http://localhost:3001/settings/api-keys [state:api-key-dialog]
  - `object`
- http://localhost:3001/settings/tags [state:tag-edit-dialog]
  - `object`
- http://localhost:3001/settings/security [state:twofa-dialog]
  - `object`
- http://localhost:3001/add [state:monitor-type-docker]
  - `object`
- http://localhost:3001/add [state:monitor-type-keyword]
  - `object`
- http://localhost:3001/settings/appearance [state:dark-mode]
  - `object`
- http://localhost:3001/dashboard [state:mobile-dashboard]
  - `object`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-dialog-name?application=axeAPI

- http://localhost:3001/dashboard/2 [state:delete-monitor-confirm]
  - `div[aria-modal="true"]`
- http://localhost:3001/dashboard [state:clear-events-confirm]
  - `div[aria-modal="true"]`
- http://localhost:3001/settings/notifications [state:notification-dialog]
  - `div[data-bs-backdrop="static"]`
- http://localhost:3001/settings/proxies [state:proxy-dialog]
  - `div[data-bs-backdrop="static"]`
- http://localhost:3001/settings/docker-hosts [state:docker-host-dialog]
  - `div[data-bs-backdrop="static"]`
- http://localhost:3001/settings/remote-browsers [state:remote-browser-dialog]
  - `div[data-bs-backdrop="static"]`
- http://localhost:3001/settings/api-keys [state:api-key-dialog]
  - `div[aria-modal="true"]`
- http://localhost:3001/settings/tags [state:tag-edit-dialog]
  - `div[data-bs-backdrop="static"]`
- http://localhost:3001/settings/security [state:twofa-dialog]
  - `div[data-bs-backdrop="static"]`

## [SERIOUS] tabindex — Elements should not have tabindex greater than zero

Ensure tabindex attribute values are not greater than 0
Référence : https://dequeuniversity.com/rules/axe/4.13/tabindex?application=axeAPI

- http://localhost:3001/add
  - `i`
- http://localhost:3001/edit/2
  - `i`
- http://localhost:3001/clone/2
  - `i`
- http://localhost:3001/add [state:monitor-type-keyword]
  - `i`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://localhost:3001/dashboard
  - `.col[data-v-92abad2d=""]:nth-child(1) > h3`
- http://localhost:3001/dashboard/1
  - `.col-sm.d-sm-block.col:nth-child(1) > h4`
- http://localhost:3001/dashboard/2
  - `.col-sm.d-sm-block.col:nth-child(1) > h4`
- http://localhost:3001/dashboard/3
  - `.col-sm.d-sm-block.col:nth-child(1) > h4`
- http://localhost:3001/add
  - `div[data-v-53b6402c=""][data-v-4f075921=""] > h4`
  - `.col-md-6[data-v-4f075921=""]:nth-child(2) > h4`
- http://localhost:3001/edit/2
  - `div[data-v-53b6402c=""][data-v-4f075921=""] > h4`
  - `.col-md-6[data-v-4f075921=""]:nth-child(2) > h4`
- http://localhost:3001/clone/2
  - `div[data-v-53b6402c=""][data-v-4f075921=""] > h4`
  - `.col-md-6[data-v-4f075921=""]:nth-child(2) > h4`
- http://localhost:3001/list
  - `.col[data-v-92abad2d=""]:nth-child(1) > h3`
- http://localhost:3001/settings/notifications
  - `.pt-4.my-4[data-v-d7c41cfa=""]:nth-child(2) > .settings-subheading`
- http://localhost:3001/settings/reverse-proxy
  - `.mt-4:nth-child(1)`
- http://localhost:3001/settings/remote-browsers
  - `.settings-subheading`
- http://localhost:3001/settings/security
  - `div[data-v-d87a4c7d=""] > .my-4 > .settings-subheading.my-4`
- http://localhost:3001/dashboard [state:user-menu-dropdown]
  - `.col[data-v-92abad2d=""]:nth-child(1) > h3`
- http://localhost:3001/dashboard [state:monitor-list-filter-status]
  - `.col[data-v-92abad2d=""]:nth-child(1) > h3`
- http://localhost:3001/dashboard [state:monitor-list-filter-tags]
  - `.col[data-v-92abad2d=""]:nth-child(1) > h3`
- http://localhost:3001/dashboard/2 [state:delete-monitor-confirm]
  - `.col-sm.d-sm-block.col:nth-child(1) > h4`
- http://localhost:3001/dashboard [state:clear-events-confirm]
  - `.col[data-v-92abad2d=""]:nth-child(1) > h3`
  - `div[aria-modal="true"] > .modal-dialog > .modal-content > .modal-header > h5`
- http://localhost:3001/settings/notifications [state:notification-dialog]
  - `.pt-4.my-4[data-v-d7c41cfa=""]:nth-child(2) > .settings-subheading`
- http://localhost:3001/settings/proxies [state:proxy-dialog]
  - `.modal-header[data-v-2595ec14=""] > h5`
- http://localhost:3001/settings/docker-hosts [state:docker-host-dialog]
  - `.modal-header[data-v-5e678e61=""] > h5`
- http://localhost:3001/settings/remote-browsers [state:remote-browser-dialog]
  - `.settings-subheading`
- http://localhost:3001/settings/api-keys [state:api-key-dialog]
  - `div[aria-modal="true"] > .modal-dialog[data-v-91b989a6=""] > .modal-content[data-v-91b989a6=""] > .modal-header[data-v-91b989a6=""] > h5`
- http://localhost:3001/settings/tags [state:tag-edit-dialog]
  - `.modal-header[data-v-93b67aa4=""] > h5`
- http://localhost:3001/settings/security [state:twofa-dialog]
  - `div[data-v-d87a4c7d=""] > .my-4 > .settings-subheading.my-4`
- http://localhost:3001/add [state:monitor-type-docker]
  - `h4`
- http://localhost:3001/add [state:monitor-type-keyword]
  - `div[data-v-53b6402c=""][data-v-4f075921=""] > h4`
  - `.col-md-6[data-v-4f075921=""]:nth-child(2) > h4`
- http://localhost:3001/status/demo [state:incident-create]
  - `h4`
- http://localhost:3001/dashboard [state:mobile-dashboard]
  - `.col:nth-child(1) > h3`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:3001/status/demo [state:status-page-edit]
  - `html`
- http://localhost:3001/status/demo [state:incident-create]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:3001/status/demo [state:status-page-edit]
  - `.my-3[data-v-f7f7a66a=""]:nth-child(1)`
  - `.my-3[data-v-f7f7a66a=""]:nth-child(2)`
  - `.my-3[data-v-f7f7a66a=""]:nth-child(3)`
  - `.my-3[data-v-f7f7a66a=""]:nth-child(4)`
  - `.my-3[data-v-f7f7a66a=""]:nth-child(5)`
  - `.my-3[data-v-f7f7a66a=""]:nth-child(6)`
  - `.form-switch.form-check.my-3:nth-child(7)`
  - `.form-switch.form-check.my-3:nth-child(8)`
  - `.form-switch.form-check.my-3:nth-child(9)`
  - `.form-switch.form-check.my-3:nth-child(10)`
  - … +19 autres
- http://localhost:3001/status/demo [state:incident-create]
  - `.my-3[data-v-f7f7a66a=""]:nth-child(1)`
  - `.my-3[data-v-f7f7a66a=""]:nth-child(2)`
  - `.my-3[data-v-f7f7a66a=""]:nth-child(3)`
  - `.my-3[data-v-f7f7a66a=""]:nth-child(4)`
  - `.my-3[data-v-f7f7a66a=""]:nth-child(5)`
  - `.my-3[data-v-f7f7a66a=""]:nth-child(6)`
  - `.form-switch.form-check.my-3:nth-child(7)`
  - `.form-switch.form-check.my-3:nth-child(8)`
  - `.form-switch.form-check.my-3:nth-child(9)`
  - `.form-switch.form-check.my-3:nth-child(10)`
  - … +19 autres

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://localhost:3001/dashboard [state:mobile-dashboard]
  - `.VuePagination > nav`

## [MINOR] empty-heading — Headings should not be empty

Ensure headings have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-heading?application=axeAPI

- http://localhost:3001/status/demo [state:incident-create]
  - `h4`

## Résultats incomplets à revoir (127)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3001/dashboard
  - `.profile-pic`
  - `.col[data-v-92abad2d=""]:nth-child(1) > .num.text-secondary`
  - `.col[data-v-92abad2d=""]:nth-child(2) > .num.text-secondary`
  - `.col[data-v-92abad2d=""]:nth-child(3) > .num.text-secondary`
  - `.col[data-v-92abad2d=""]:nth-child(4) > .num.text-secondary`
  - `.col[data-v-92abad2d=""]:nth-child(5) > .num.text-secondary`
- http://localhost:3001/dashboard/1
  - `.profile-pic`
- http://localhost:3001/dashboard/2
  - `.profile-pic`
  - `.monitor-id > div[data-v-fe0f35a5=""]:nth-child(2)`
  - `.btn-light`
- http://localhost:3001/dashboard/3
  - `.profile-pic`
- http://localhost:3001/add
  - `.profile-pic`
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `.my-3[data-v-4f075921=""]:nth-child(6) > select`
  - `#httpBodyEncoding`
  - `.my-3[data-v-4f075921=""]:nth-child(11) > select`
- http://localhost:3001/edit/2
  - `.profile-pic`
- http://localhost:3001/clone/2
  - `.profile-pic`
- http://localhost:3001/list
  - `.profile-pic`
  - `.col[data-v-92abad2d=""]:nth-child(1) > .num.text-secondary`
  - `.col[data-v-92abad2d=""]:nth-child(2) > .num.text-secondary`
  - `.col[data-v-92abad2d=""]:nth-child(3) > .num.text-secondary`
  - `.col[data-v-92abad2d=""]:nth-child(4) > .num.text-secondary`
  - `.col[data-v-92abad2d=""]:nth-child(5) > .num.text-secondary`
- http://localhost:3001/manage-status-page
  - `.profile-pic`
- http://localhost:3001/add-status-page
  - `.profile-pic`
- http://localhost:3001/maintenance
  - `.profile-pic`
- http://localhost:3001/add-maintenance
  - `.profile-pic`
- http://localhost:3001/maintenance/edit/1
  - `.profile-pic`
  - `#affected_monitors`
  - `#selected_status_pages`
  - `#strategy`
  - `#timezone`
- http://localhost:3001/settings/general
  - `.profile-pic`
  - `.mb-4:nth-child(1) > select`
  - `.mb-4:nth-child(2) > select`
- http://localhost:3001/settings/appearance
  - `.profile-pic`
  - `#language`
- http://localhost:3001/settings/notifications
  - `.profile-pic`
- http://localhost:3001/settings/reverse-proxy
  - `.profile-pic`
- http://localhost:3001/settings/tags
  - `.profile-pic`
- http://localhost:3001/settings/monitor-history
  - `.profile-pic`
- http://localhost:3001/settings/docker-hosts
  - `.profile-pic`
- http://localhost:3001/settings/remote-browsers
  - `.profile-pic`
- http://localhost:3001/settings/security
  - `.profile-pic`
- http://localhost:3001/settings/api-keys
  - `.profile-pic`
- http://localhost:3001/settings/proxies
  - `.profile-pic`
- http://localhost:3001/settings/about
  - `.profile-pic`
- http://localhost:3001/dashboard [state:user-menu-dropdown]
  - `.profile-pic`
  - `.col[data-v-92abad2d=""]:nth-child(5) > h3`
  - `.col[data-v-92abad2d=""]:nth-child(5) > .num.text-secondary`
- http://localhost:3001/dashboard [state:monitor-list-filter-status]
  - `.profile-pic`
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
- http://localhost:3001/dashboard [state:monitor-list-filter-tags]
  - `.profile-pic`
- http://localhost:3001/dashboard/2 [state:delete-monitor-confirm]
  - `.profile-pic`
  - `.monitor-id > div[data-v-fe0f35a5=""]:nth-child(2)`
  - `.btn-light`
- http://localhost:3001/dashboard [state:clear-events-confirm]
  - `.profile-pic`
  - `div[aria-modal="true"] > .modal-dialog > .modal-content > .modal-body`
- http://localhost:3001/settings/notifications [state:notification-dialog]
  - `.profile-pic`
  - `#notification-type`
- http://localhost:3001/settings/proxies [state:proxy-dialog]
  - `.profile-pic`
  - `#proxy-protocol`
  - `.form-text[data-v-2595ec14=""]:nth-child(6)`
- http://localhost:3001/settings/docker-hosts [state:docker-host-dialog]
  - `.profile-pic`
  - `#docker-type`
- http://localhost:3001/settings/remote-browsers [state:remote-browser-dialog]
  - `.profile-pic`
  - `code`
- http://localhost:3001/settings/api-keys [state:api-key-dialog]
  - `.profile-pic`
- http://localhost:3001/settings/tags [state:tag-edit-dialog]
  - `.profile-pic`
  - `input[placeholder="Color"]`
  - `input[placeholder="Add a monitor"]`
- http://localhost:3001/settings/security [state:twofa-dialog]
  - `.profile-pic`
- http://localhost:3001/add [state:monitor-type-docker]
  - `.profile-pic`
  - `#type`
  - `#monitorGroupSelector`
- http://localhost:3001/add [state:monitor-type-keyword]
  - `.profile-pic`
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `.my-3[data-v-4f075921=""]:nth-child(6) > select`
  - `#httpBodyEncoding`
  - `.my-3[data-v-4f075921=""]:nth-child(11) > select`
- http://localhost:3001/status/demo [state:status-page-edit]
  - `#switch-theme`
  - `.multiselect__input`
- http://localhost:3001/status/demo [state:incident-create]
  - `#switch-theme`
  - `.multiselect__input`
- http://localhost:3001/settings/appearance [state:dark-mode]
  - `.profile-pic`
  - `#language`

### duplicate-id-aria — IDs used in ARIA and labels must be unique

- http://localhost:3001/add
  - `.modal-body[data-v-53b6402c=""] > .multiselect[aria-owns="listbox-null"][role="combobox"] > .multiselect__content-wrapper > .multiselect__content[role="listbox"]`
  - `.my-3[data-v-4f075921=""]:nth-child(6) > select`
- http://localhost:3001/edit/2
  - `.modal-body[data-v-53b6402c=""] > .multiselect[aria-owns="listbox-null"][role="combobox"] > .multiselect__content-wrapper > .multiselect__content[role="listbox"]`
  - `.my-3[data-v-4f075921=""]:nth-child(6) > select`
- http://localhost:3001/clone/2
  - `.modal-body[data-v-53b6402c=""] > .multiselect[aria-owns="listbox-null"][role="combobox"] > .multiselect__content-wrapper > .multiselect__content[role="listbox"]`
  - `.my-3[data-v-4f075921=""]:nth-child(6) > select`
- http://localhost:3001/settings/general
  - `.mb-4:nth-child(1) > select`
  - `input[placeholder="https://"]`
- http://localhost:3001/settings/tags
  - `.col-8 > .multiselect[role="combobox"][aria-owns="listbox-null"] > .multiselect__content-wrapper > .multiselect__content[role="listbox"]`
- http://localhost:3001/settings/security
  - `form > .mb-3:nth-child(1) > input[autocomplete="current-password"][type="password"][required=""]`
- http://localhost:3001/settings/tags [state:tag-edit-dialog]
  - `.col-8 > .multiselect[role="combobox"][aria-owns="listbox-null"] > .multiselect__content-wrapper > .multiselect__content[role="listbox"]`
- http://localhost:3001/settings/security [state:twofa-dialog]
  - `form > .mb-3:nth-child(1) > input[autocomplete="current-password"][type="password"][required=""]`
- http://localhost:3001/add [state:monitor-type-docker]
  - `.modal-body[data-v-53b6402c=""] > .multiselect[role="combobox"][aria-owns="listbox-null"] > .multiselect__content-wrapper > .multiselect__content[role="listbox"]`
- http://localhost:3001/add [state:monitor-type-keyword]
  - `.modal-body[data-v-53b6402c=""] > .multiselect[aria-owns="listbox-null"][role="combobox"] > .multiselect__content-wrapper > .multiselect__content[role="listbox"]`
  - `.my-3[data-v-4f075921=""]:nth-child(6) > select`

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:3001/add
  - `#cache-bust`
  - `.my-3[data-v-4f075921=""]:nth-child(6) > select`
  - `.my-3[data-v-4f075921=""]:nth-child(11) > select`
- http://localhost:3001/edit/2
  - `#cache-bust`
  - `.my-3[data-v-4f075921=""]:nth-child(6) > select`
  - `.my-3[data-v-4f075921=""]:nth-child(11) > select`
- http://localhost:3001/clone/2
  - `#cache-bust`
  - `.my-3[data-v-4f075921=""]:nth-child(6) > select`
  - `.my-3[data-v-4f075921=""]:nth-child(11) > select`
- http://localhost:3001/settings/general
  - `.mb-4:nth-child(1) > select`
  - `.mb-4:nth-child(2) > select`
  - `input[placeholder="https://"]`
  - `input[placeholder="Auto Detect"]`
- http://localhost:3001/settings/security [state:twofa-dialog]
  - `form > .mb-3:nth-child(1) > input[autocomplete="current-password"][type="password"][required=""]`
  - `.mb-3[data-v-c015e868=""] > input[autocomplete="current-password"][type="password"][required=""]`
- http://localhost:3001/add [state:monitor-type-keyword]
  - `#cache-bust`
  - `.my-3[data-v-4f075921=""]:nth-child(6) > select`
  - `.my-3[data-v-4f075921=""]:nth-child(11) > select`

