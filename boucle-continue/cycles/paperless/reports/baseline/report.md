# Audit accessibilité — 2026-10-04

**13 règle(s) violée(s), 152 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 13 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `3887917f9201`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-attr?application=axeAPI

- http://127.0.0.1:8085/dashboard
  - `.bg-transparent`
- http://127.0.0.1:8085/documents
  - `input[name="query"]`
- http://127.0.0.1:8085/attributes/tags
  - `input[name="query"]`
- http://127.0.0.1:8085/attributes/correspondents
  - `input[name="query"]`
- http://127.0.0.1:8085/attributes/documenttypes
  - `input[name="query"]`
- http://127.0.0.1:8085/savedviews
  - `input`
- http://127.0.0.1:8085/workflows
  - `input`
- http://127.0.0.1:8085/mail
  - `input`
- http://127.0.0.1:8085/settings
  - `.bg-transparent`
- http://127.0.0.1:8085/usersgroups
  - `input`
- http://127.0.0.1:8085/tasks
  - `.bg-transparent`
- http://127.0.0.1:8085/logs
  - `.bg-transparent`
- http://127.0.0.1:8085/trash
  - `.bg-transparent`
- http://127.0.0.1:8085/config
  - `.bg-transparent`
- http://127.0.0.1:8085/share-links
  - `input`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://127.0.0.1:8085/dashboard
  - `.order-sm-3`
- http://127.0.0.1:8085/documents
  - `.order-sm-3`
- http://127.0.0.1:8085/attributes/tags
  - `.order-sm-3`
- http://127.0.0.1:8085/attributes/correspondents
  - `.order-sm-3`
- http://127.0.0.1:8085/attributes/documenttypes
  - `.order-sm-3`
- http://127.0.0.1:8085/savedviews
  - `.order-sm-3`
- http://127.0.0.1:8085/workflows
  - `.order-sm-3`
- http://127.0.0.1:8085/mail
  - `.order-sm-3`
- http://127.0.0.1:8085/settings
  - `.order-sm-3`
- http://127.0.0.1:8085/usersgroups
  - `.order-sm-3`
- http://127.0.0.1:8085/tasks
  - `.order-sm-3`
- http://127.0.0.1:8085/logs
  - `.order-sm-3`
  - `.nav-tabs`
- http://127.0.0.1:8085/trash
  - `.order-sm-3`
- http://127.0.0.1:8085/config
  - `.order-sm-3`
- http://127.0.0.1:8085/share-links
  - `.order-sm-3`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://127.0.0.1:8085/dashboard
  - `input[type="file"]`
- http://127.0.0.1:8085/documents
  - `#displayModeDetails`
  - `#displayModeSmall`
  - `#displayModeLarge`
  - `.form-control-sm[autocapitalize="off"][autocorrect="off"]`
- http://127.0.0.1:8085/attributes/tags
  - `#all-objects`
- http://127.0.0.1:8085/attributes/correspondents
  - `#all-objects`
- http://127.0.0.1:8085/attributes/documenttypes
  - `#all-objects`
- http://127.0.0.1:8085/settings
  - `#\34 90dbeb1-cdbc-45b2-aa18-1c311f756b51`
- http://127.0.0.1:8085/trash
  - `#all-objects`
- http://127.0.0.1:8085/config
  - `#e4e38356-68c8-479d-935e-ba42b2d225f5`
  - `#ea43ba95-2970-48fd-86a9-3ee4a3336579`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-valid-attr-value?application=axeAPI

- http://127.0.0.1:8085/attributes/tags
  - `#ngb-nav-0`
- http://127.0.0.1:8085/attributes/correspondents
  - `#ngb-nav-1`
- http://127.0.0.1:8085/attributes/documenttypes
  - `#ngb-nav-2`
- http://127.0.0.1:8085/logs
  - `#ngb-nav-0`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/select-name?application=axeAPI

- http://127.0.0.1:8085/settings
  - `select[formcontrolname="displayLanguage"]`
  - `select[formcontrolname="dateLocale"]`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://127.0.0.1:8085/dashboard
  - `.navbar-brand`
- http://127.0.0.1:8085/documents
  - `.navbar-brand`
- http://127.0.0.1:8085/attributes/tags
  - `.navbar-brand`
- http://127.0.0.1:8085/attributes/correspondents
  - `.navbar-brand`
- http://127.0.0.1:8085/attributes/documenttypes
  - `.navbar-brand`
- http://127.0.0.1:8085/savedviews
  - `.navbar-brand`
- http://127.0.0.1:8085/workflows
  - `.navbar-brand`
- http://127.0.0.1:8085/mail
  - `.navbar-brand`
- http://127.0.0.1:8085/settings
  - `.navbar-brand`
- http://127.0.0.1:8085/usersgroups
  - `.navbar-brand`
- http://127.0.0.1:8085/tasks
  - `.navbar-brand`
- http://127.0.0.1:8085/logs
  - `.navbar-brand`
- http://127.0.0.1:8085/trash
  - `.navbar-brand`
- http://127.0.0.1:8085/config
  - `.navbar-brand`
- http://127.0.0.1:8085/share-links
  - `.navbar-brand`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.13/listitem?application=axeAPI

- http://127.0.0.1:8085/dashboard
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown[ngbdropdown=""]`
- http://127.0.0.1:8085/documents
  - `.position-relative[_ngcontent-ng-c3673903401=""]`
  - `.order-sm-3 > li`
- http://127.0.0.1:8085/attributes/tags
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown.nav-item[ngbdropdown=""]`
- http://127.0.0.1:8085/attributes/correspondents
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown.nav-item[ngbdropdown=""]`
- http://127.0.0.1:8085/attributes/documenttypes
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown.nav-item[ngbdropdown=""]`
- http://127.0.0.1:8085/savedviews
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown.nav-item[ngbdropdown=""]`
- http://127.0.0.1:8085/workflows
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown.nav-item[ngbdropdown=""]`
- http://127.0.0.1:8085/mail
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown.nav-item[ngbdropdown=""]`
- http://127.0.0.1:8085/settings
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown[ngbdropdown=""]`
- http://127.0.0.1:8085/usersgroups
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown[ngbdropdown=""]`
- http://127.0.0.1:8085/tasks
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown.nav-item[ngbdropdown=""]`
- http://127.0.0.1:8085/logs
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown[ngbdropdown=""]`
- http://127.0.0.1:8085/trash
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown[ngbdropdown=""]`
- http://127.0.0.1:8085/config
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown[ngbdropdown=""]`
- http://127.0.0.1:8085/share-links
  - `.dropdown.position-relative[ngbdropdown=""]`
  - `.order-sm-3 > .dropdown[ngbdropdown=""]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:8085/dashboard
  - `.m-0 > em`
- http://127.0.0.1:8085/documents
  - `a[routerlink="dashboard"] > .nav-link-label`
  - `a[routerlink="documents"] > .nav-link-label`
- http://127.0.0.1:8085/savedviews
  - `.btn-outline-secondary.mb-2[type="button"]`
- http://127.0.0.1:8085/share-links
  - `a[routerlink="dashboard"] > .nav-link-label`
  - `a[routerlink="documents"] > .nav-link-label`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://127.0.0.1:8085/dashboard
  - `.navbar`
- http://127.0.0.1:8085/documents
  - `.navbar`
- http://127.0.0.1:8085/attributes/tags
  - `.navbar`
- http://127.0.0.1:8085/attributes/correspondents
  - `.navbar`
- http://127.0.0.1:8085/attributes/documenttypes
  - `.navbar`
- http://127.0.0.1:8085/savedviews
  - `.navbar`
- http://127.0.0.1:8085/workflows
  - `.navbar`
- http://127.0.0.1:8085/mail
  - `.navbar`
- http://127.0.0.1:8085/settings
  - `.navbar`
- http://127.0.0.1:8085/usersgroups
  - `.navbar`
- http://127.0.0.1:8085/tasks
  - `.navbar`
- http://127.0.0.1:8085/logs
  - `.navbar`
- http://127.0.0.1:8085/trash
  - `.navbar`
- http://127.0.0.1:8085/config
  - `.navbar`
- http://127.0.0.1:8085/share-links
  - `.navbar`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://127.0.0.1:8085/dashboard
  - `html`
- http://127.0.0.1:8085/documents
  - `html`
- http://127.0.0.1:8085/attributes/tags
  - `html`
- http://127.0.0.1:8085/attributes/correspondents
  - `html`
- http://127.0.0.1:8085/attributes/documenttypes
  - `html`
- http://127.0.0.1:8085/savedviews
  - `html`
- http://127.0.0.1:8085/workflows
  - `html`
- http://127.0.0.1:8085/mail
  - `html`
- http://127.0.0.1:8085/settings
  - `html`
- http://127.0.0.1:8085/usersgroups
  - `html`
- http://127.0.0.1:8085/tasks
  - `html`
- http://127.0.0.1:8085/logs
  - `html`
- http://127.0.0.1:8085/trash
  - `html`
- http://127.0.0.1:8085/config
  - `html`
- http://127.0.0.1:8085/share-links
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://127.0.0.1:8085/dashboard
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/documents
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/attributes/tags
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/attributes/correspondents
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/attributes/documenttypes
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/savedviews
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/workflows
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/mail
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/settings
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/usersgroups
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/tasks
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/logs
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/trash
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/config
  - `.global-dropzone-overlay`
- http://127.0.0.1:8085/share-links
  - `.global-dropzone-overlay`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://127.0.0.1:8085/dashboard
  - `.card-title`
- http://127.0.0.1:8085/settings
  - `.pe-xl-5 > h5`
- http://127.0.0.1:8085/config
  - `.col:nth-child(1) > .card.bg-light > .card-body > .card-title.flex-wrap.align-items-center > .mb-0`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://127.0.0.1:8085/attributes/tags
  - `th:nth-child(1)`
- http://127.0.0.1:8085/attributes/correspondents
  - `th:nth-child(1)`
- http://127.0.0.1:8085/attributes/documenttypes
  - `th:nth-child(1)`
- http://127.0.0.1:8085/trash
  - `th:nth-child(1)`

## Résultats incomplets à revoir (13)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8085/dashboard
  - `h4`
- http://127.0.0.1:8085/attributes/tags
  - `#managementPageSize`
- http://127.0.0.1:8085/attributes/correspondents
  - `#managementPageSize`
- http://127.0.0.1:8085/attributes/documenttypes
  - `#managementPageSize`
- http://127.0.0.1:8085/settings
  - `select[formcontrolname="displayLanguage"]`
  - `select[formcontrolname="dateLocale"]`
  - `#searchLink`

### duplicate-id-aria — IDs used in ARIA and labels must be unique

- http://127.0.0.1:8085/documents
  - `.gap-2.flex-wrap[_ngcontent-ng-c3064137851=""] > pngx-filterable-dropdown[title="Tags"][icon="tag-fill"][filterplaceholder="Filter tags"] > .w-100.dropdown[role="group"] > .dropdown-toggle[aria-label="Tags"][ngbdropdowntoggle=""]`
  - `.gap-2.flex-wrap[_ngcontent-ng-c3064137851=""] > pngx-filterable-dropdown[title="Correspondent"][icon="person-fill"][filterplaceholder="Filter correspondents"] > .w-100.dropdown[role="group"] > .dropdown-toggle[aria-label="Correspondent"][ngbdropdowntoggle=""]`
  - `.gap-2.flex-wrap[_ngcontent-ng-c3064137851=""] > pngx-filterable-dropdown[title="Document type"][icon="file-earmark-fill"][filterplaceholder="Filter document types"] > .w-100.dropdown[role="group"] > .dropdown-toggle[aria-label="Document type"][ngbdropdowntoggle=""]`
  - `.gap-2.flex-wrap[_ngcontent-ng-c3064137851=""] > pngx-filterable-dropdown[title="Storage path"][icon="folder-fill"][filterplaceholder="Filter storage paths"] > .w-100.dropdown[role="group"] > .dropdown-toggle[aria-label="Storage path"][ngbdropdowntoggle=""]`

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://127.0.0.1:8085/attributes/tags
  - `table`
- http://127.0.0.1:8085/attributes/correspondents
  - `table`

