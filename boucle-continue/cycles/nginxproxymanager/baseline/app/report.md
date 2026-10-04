# Audit accessibilité — 2026-10-04

**13 règle(s) violée(s), 113 occurrence(s), 13/13 scénario(s) audité(s), 0 erreur(s), 16 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `9c0e5f65b4e5`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:5173/
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
- http://localhost:5173/nginx/proxy
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
- http://localhost:5173/nginx/redirection
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
- http://localhost:5173/nginx/404
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
- http://localhost:5173/nginx/stream
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
- http://localhost:5173/certificates
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
- http://localhost:5173/access
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
- http://localhost:5173/users
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
- http://localhost:5173/audit-log
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
- http://localhost:5173/logs
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
- http://localhost:5173/settings
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`
  - `.flex-wrap > .btn-sm.btn[type="button"]`
- http://localhost:5173/ [state:user-menu]
  - `.nav-item:nth-child(1) > .dropdown > ._btn_1un1a_1.dropdown-toggle.btn-ghost-light`
  - `.nav-item:nth-child(2) > .d-inline-block.d-print-none > .btn-ghost-dark.hide-theme-dark._lightBtn_lses4_9`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-parent?application=axeAPI

- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `a[href$="#tab-details"]`
  - `a[href$="#tab-locations"]`
  - `a[href$="#tab-ssl"]`
  - `a[href$="#tab-advanced"]`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `#react-select-3-input`
  - `#react-select-5-input`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `.btn-lime > span[data-translation-id="object.add"]`
  - `span[data-translation-id="save"]`
- http://localhost:5173/ [state:user-menu]
  - `.d-xl-block > .mt-1.small.text-secondary > span[data-translation-id="role.admin"]`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-dialog-name?application=axeAPI

- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `.modal`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/label-title-only?application=axeAPI

- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `#react-select-3-input`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.13/list?application=axeAPI

- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `.nav`

## [MODERATE] landmark-no-duplicate-banner — Document should not have more than one banner landmark

Ensure the document has at most one banner landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-no-duplicate-banner?application=axeAPI

- http://localhost:5173/
  - `header:nth-child(1)`
- http://localhost:5173/nginx/proxy
  - `header:nth-child(1)`
- http://localhost:5173/nginx/redirection
  - `header:nth-child(1)`
- http://localhost:5173/nginx/404
  - `header:nth-child(1)`
- http://localhost:5173/nginx/stream
  - `header:nth-child(1)`
- http://localhost:5173/certificates
  - `header:nth-child(1)`
- http://localhost:5173/access
  - `header:nth-child(1)`
- http://localhost:5173/users
  - `header:nth-child(1)`
- http://localhost:5173/audit-log
  - `header:nth-child(1)`
- http://localhost:5173/logs
  - `header:nth-child(1)`
- http://localhost:5173/settings
  - `header:nth-child(1)`
- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `header:nth-child(1)`
- http://localhost:5173/ [state:user-menu]
  - `header:nth-child(1)`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://localhost:5173/
  - `header:nth-child(1)`
- http://localhost:5173/nginx/proxy
  - `header:nth-child(1)`
- http://localhost:5173/nginx/redirection
  - `header:nth-child(1)`
- http://localhost:5173/nginx/404
  - `header:nth-child(1)`
- http://localhost:5173/nginx/stream
  - `header:nth-child(1)`
- http://localhost:5173/certificates
  - `header:nth-child(1)`
- http://localhost:5173/access
  - `header:nth-child(1)`
- http://localhost:5173/users
  - `header:nth-child(1)`
- http://localhost:5173/audit-log
  - `header:nth-child(1)`
- http://localhost:5173/logs
  - `header:nth-child(1)`
- http://localhost:5173/settings
  - `header:nth-child(1)`
- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `header:nth-child(1)`
- http://localhost:5173/ [state:user-menu]
  - `header:nth-child(1)`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:5173/
  - `h2`
  - `.card.card-sm[href$="proxy"] > .card-body > .row.align-items-center > .col`
  - `.card.card-sm[href$="redirection"] > .card-body > .row.align-items-center > .col`
  - `.card.card-sm[href$="stream"] > .card-body > .row.align-items-center > .col`
  - `.card.card-sm[href="/nginx/404"] > .card-body > .row.align-items-center > .col`
- http://localhost:5173/nginx/proxy
  - `.min-w-0`
- http://localhost:5173/nginx/redirection
  - `.min-w-0`
- http://localhost:5173/nginx/404
  - `.min-w-0`
- http://localhost:5173/nginx/stream
  - `.min-w-0`
- http://localhost:5173/certificates
  - `.min-w-0`
- http://localhost:5173/access
  - `.min-w-0`
- http://localhost:5173/users
  - `.min-w-0`
- http://localhost:5173/audit-log
  - `.min-w-0`
- http://localhost:5173/logs
  - `.min-w-0`
- http://localhost:5173/settings
  - `.min-w-0`
- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `.w-full > .col`
  - `.my-4 > h2`
  - `p`
- http://localhost:5173/ [state:user-menu]
  - `h2`
  - `.card.card-sm[href$="proxy"] > .card-body > .row.align-items-center > .col`
  - `.card.card-sm[href$="redirection"] > .card-body > .row.align-items-center > .col`
  - `.card.card-sm[href$="stream"] > .card-body > .row.align-items-center > .col`
  - `.card.card-sm[href="/nginx/404"] > .card-body > .row.align-items-center > .col`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:5173/
  - `html`
- http://localhost:5173/nginx/proxy
  - `html`
- http://localhost:5173/nginx/redirection
  - `html`
- http://localhost:5173/nginx/404
  - `html`
- http://localhost:5173/nginx/stream
  - `html`
- http://localhost:5173/certificates
  - `html`
- http://localhost:5173/access
  - `html`
- http://localhost:5173/users
  - `html`
- http://localhost:5173/audit-log
  - `html`
- http://localhost:5173/logs
  - `html`
- http://localhost:5173/settings
  - `html`
- http://localhost:5173/ [state:user-menu]
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:5173/
  - `html`
- http://localhost:5173/nginx/proxy
  - `html`
- http://localhost:5173/nginx/redirection
  - `html`
- http://localhost:5173/nginx/404
  - `html`
- http://localhost:5173/nginx/stream
  - `html`
- http://localhost:5173/certificates
  - `html`
- http://localhost:5173/access
  - `html`
- http://localhost:5173/users
  - `html`
- http://localhost:5173/audit-log
  - `html`
- http://localhost:5173/logs
  - `html`
- http://localhost:5173/settings
  - `html`
- http://localhost:5173/ [state:user-menu]
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `h4`

## Résultats incomplets à revoir (16)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### bypass — Page must have means to bypass repeated blocks

- http://localhost:5173/nginx/proxy
  - `html`
- http://localhost:5173/nginx/redirection
  - `html`
- http://localhost:5173/nginx/404
  - `html`
- http://localhost:5173/nginx/stream
  - `html`
- http://localhost:5173/certificates
  - `html`
- http://localhost:5173/access
  - `html`
- http://localhost:5173/users
  - `html`
- http://localhost:5173/audit-log
  - `html`
- http://localhost:5173/logs
  - `html`
- http://localhost:5173/settings
  - `html`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `#react-select-3-placeholder`
  - `.mb-3:nth-child(3) > .react-select-container.css-b62m3t-container > .react-select__control.css-13cymwt-control > .react-select__value-container--has-value.react-select__value-container.css-hlgwow > .react-select__single-value.css-1dimb5e-singleValue`
- http://localhost:5173/ [state:user-menu]
  - `span[data-translation-id="dead-hosts.count"]`

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `#cachingEnabled`
  - `#blockExploits`
  - `#allowWebsocketUpgrade`

