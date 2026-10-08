# Audit accessibilité — 2026-10-08

**13 règle(s) violée(s), 195 occurrence(s), 29/29 scénario(s) audité(s), 0 erreur(s), 292 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `3d3ca458f3a7`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.14/image-alt?application=axeAPI

- http://localhost:8950/sites
  - `.rounded-full`
- http://localhost:8950/sites/new
  - `.size-6`
- http://localhost:8950/team/setup
  - `.size-6`
- http://localhost:8950/dummy.site
  - `.size-6`
- http://localhost:8950/dummy.site/installation
  - `.size-6`
- http://localhost:8950/dummy.site/change-domain
  - `.size-6`
- http://localhost:8950/dummy.site/settings/people
  - `.size-6`
  - `#membership-1 > .space-x-4.items-center[data-phx-loc="32"] > .shrink-0[data-phx-loc="33"] > .size-8.rounded-full[data-phx-loc="34"]`
  - `#membership-2 > .space-x-4.items-center[data-phx-loc="32"] > .shrink-0[data-phx-loc="33"] > .size-8.rounded-full[data-phx-loc="34"]`
  - `#membership-4 > .space-x-4.items-center[data-phx-loc="32"] > .shrink-0[data-phx-loc="33"] > .size-8.rounded-full[data-phx-loc="34"]`
- http://localhost:8950/dummy.site/settings/visibility
  - `.size-6`
- http://localhost:8950/dummy.site/settings/funnels
  - `.size-6`
- http://localhost:8950/dummy.site/settings/danger-zone
  - `.size-6`
- http://localhost:8950/dummy.site/settings/integrations
  - `.size-6`
- http://localhost:8950/dummy.site/settings/imports-exports
  - `.size-6`
- http://localhost:8950/settings/preferences
  - `.size-6`
- http://localhost:8950/settings/security
  - `.size-6`
- http://localhost:8950/settings/api-keys
  - `.size-6`
- http://localhost:8950/settings/api-keys/new
  - `.size-6`
- http://localhost:8950/settings/danger-zone
  - `.size-6`
- http://localhost:8950/dummy.site [state:site-switcher-menu]
  - `.size-6`
- http://localhost:8950/dummy.site [state:user-menu]
  - `.size-6`
- http://localhost:8950/dummy.site [state:filter-menu]
  - `.size-6`
- http://localhost:8950/dummy.site [state:period-menu]
  - `.size-6`
- http://localhost:8950/dummy.site [state:options-menu]
  - `.size-6`
- http://localhost:8950/dummy.site [state:breakdown-menu]
  - `.size-6`
- http://localhost:8950/dummy.site [state:funnel-menu]
  - `.size-6`
- http://localhost:8950/dummy.site?period=realtime [state:realtime-view]
  - `.size-6`
- http://localhost:8950/dummy.site [state:goal-report]
  - `.size-6`
- http://localhost:8950/dummy.site [state:mobile-dash-390]
  - `.size-6`
- http://localhost:8950/dummy.site [state:dark-dashboard]
  - `.size-6`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:8950/sites
  - `#site-dummy\.site-dropdown-trigger`
  - `#site-another\.site-dropdown-trigger`
- http://localhost:8950/dummy.site
  - `#headlessui-popover-button-\:r6\:`
  - `#headlessui-popover-button-\:rg\:`
- http://localhost:8950/dummy.site/settings/visibility
  - `.flex-shrink-0`
  - `.btn-text-primary`
  - `.btn-text-danger`
- http://localhost:8950/dummy.site/settings/funnels
  - `.flex-shrink-0`
  - `button[data-phx-id="m16-phx-GNyE9KphsTlC604D"]`
  - `#delete-funnel-3`
  - `button[data-phx-id="m23-phx-GNyE9KphsTlC604D"]`
  - `#delete-funnel-2`
  - `button[data-phx-id="m30-phx-GNyE9KphsTlC604D"]`
  - `#delete-funnel-1`
- http://localhost:8950/dummy.site/settings/integrations
  - `#revoke-token-df8f7e9f-386d-4433-a4f0-94f93b54bca0`
- http://localhost:8950/dummy.site [state:site-switcher-menu]
  - `#headlessui-popover-button-\:r6\:`
  - `#headlessui-popover-button-\:rg\:`
- http://localhost:8950/dummy.site [state:user-menu]
  - `#headlessui-popover-button-\:r6\:`
  - `#headlessui-popover-button-\:rg\:`
- http://localhost:8950/dummy.site [state:filter-menu]
  - `#headlessui-popover-button-\:r6\:`
  - `#headlessui-popover-button-\:rg\:`
- http://localhost:8950/dummy.site [state:period-menu]
  - `#headlessui-popover-button-\:r6\:`
  - `#headlessui-popover-button-\:rg\:`
- http://localhost:8950/dummy.site [state:options-menu]
  - `#headlessui-popover-button-\:r6\:`
  - `#headlessui-popover-button-\:rg\:`
- http://localhost:8950/dummy.site [state:breakdown-menu]
  - `#headlessui-popover-button-\:r6\:`
  - `#headlessui-popover-button-\:rg\:`
- http://localhost:8950/dummy.site [state:funnel-menu]
  - `#headlessui-popover-button-\:r6\:`
  - `#headlessui-popover-button-\:rg\:`
- http://localhost:8950/dummy.site?period=realtime [state:realtime-view]
  - `#headlessui-popover-button-\:r6\:`
- http://localhost:8950/dummy.site [state:goal-report]
  - `#headlessui-popover-button-\:r6\:`
  - `#headlessui-popover-button-\:rg\:`
- http://localhost:8950/dummy.site [state:mobile-dash-390]
  - `#-button`
  - `#headlessui-popover-button-\:r6\:`
  - `#headlessui-popover-button-\:rg\:`
- http://localhost:8950/dummy.site [state:dark-dashboard]
  - `#-button`
  - `#headlessui-popover-button-\:r6\:`
  - `#headlessui-popover-button-\:rg\:`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.14/label?application=axeAPI

- http://localhost:8950/dummy.site/installation
  - `textarea`
- http://localhost:8950/dummy.site/settings/visibility
  - `#audit-c48-shared`
- http://localhost:8950/dummy.site/settings/integrations
  - `input`
- http://localhost:8950/settings/security
  - `input[type="text"]`
- http://localhost:8950/billing/choose-plan
  - `#slider`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:8950/team/setup
  - `a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8950/dummy.site/settings/people
  - `a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8950/dummy.site/settings/visibility
  - `.shadow-sm.mb-6[data-test-id="settings-tile"]:nth-child(1) > header > .leading-7[data-phx-loc="1132"] > .top-4.z-1.right-4 > .w-max.relative[data-phx-loc="706"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
  - `div[data-phx-id="m8-phx-GNyE9IOSmjLSzkyD"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
  - `.shadow-sm.mb-6[data-test-id="settings-tile"]:nth-child(3) > header > .leading-7[data-phx-loc="1132"] > .top-4.z-1.right-4 > .w-max.relative[data-phx-loc="706"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
  - `.hover\:underline`
- http://localhost:8950/dummy.site/settings/funnels
  - `a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8950/dummy.site/settings/danger-zone
  - `div[data-phx-id="m8-phx-GNyE9M-Bo3lcaYYC"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
  - `.text-gray-900.dark\:text-gray-100[data-phx-loc="13"] > .shadow-sm.mb-6[data-test-id="settings-tile"]:nth-child(2) > header > .leading-7[data-phx-loc="1132"] > .top-4.right-4.z-1 > .w-max.relative[data-phx-loc="706"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
  - `.shadow-sm.mb-6[data-test-id="settings-tile"]:nth-child(3) > header > .leading-7[data-phx-loc="1132"] > .top-4.right-4.z-1 > .w-max.relative[data-phx-loc="706"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8950/dummy.site/settings/integrations
  - `.shadow-sm.mb-6[data-test-id="settings-tile"]:nth-child(1) > header > .leading-7[data-phx-loc="1132"] > .top-4.right-4.z-1 > .w-max.relative[data-phx-loc="706"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
  - `.shadow-sm.mb-6[data-test-id="settings-tile"]:nth-child(2) > header > .leading-7[data-phx-loc="1132"] > .top-4.right-4.z-1 > .w-max.relative[data-phx-loc="706"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8950/dummy.site/settings/imports-exports
  - `div[data-phx-id="m4-phx-GNyE9Rzk_52H1Ili"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
  - `.btn-icon`
  - `.text-gray-900.dark\:text-gray-100[data-phx-loc="13"] > .shadow-sm.mb-6[data-test-id="settings-tile"] > header > .leading-7[data-phx-loc="1132"] > .top-4.right-4.z-1 > .w-max.relative[data-phx-loc="706"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8950/settings/preferences
  - `a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8950/settings/security
  - `.leading-5.text-gray-900[data-phx-loc="13"] > .shadow-sm.mb-6[data-test-id="settings-tile"]:nth-child(1) > header > .leading-7[data-phx-loc="1132"] > .top-4.right-4.z-1 > .w-max.relative[data-phx-loc="706"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
  - `.shadow-sm.mb-6[data-test-id="settings-tile"]:nth-child(2) > header > .leading-7[data-phx-loc="1132"] > .top-4.right-4.z-1 > .w-max.relative[data-phx-loc="706"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
  - `a[href$="2fa"][data-phx-loc="197"][rel="noopener noreferrer"]`
  - `.shadow-sm.mb-6[data-test-id="settings-tile"]:nth-child(4) > header > .leading-7[data-phx-loc="1132"] > .top-4.right-4.z-1 > .w-max.relative[data-phx-loc="706"] > div[data-phx-loc="728"] > a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8950/settings/api-keys
  - `a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8950/settings/danger-zone
  - `a[data-phx-loc="197"][rel="noopener noreferrer"][target="_blank"]`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.14/link-in-text-block?application=axeAPI

- http://localhost:8950/dummy.site/settings/people
  - `.text-indigo-600.hover\:text-indigo-700[href$="setup"]`
- http://localhost:8950/settings/api-keys
  - `.mt-1 > .text-indigo-600.hover\:text-indigo-700.dark\:text-indigo-500`
- http://localhost:8950/settings/api-keys/new
  - `label[for="api_key_type_0"] > .font-normal.text-pretty[data-phx-loc="150"] > .hover\:text-indigo-700.dark\:text-indigo-500.dark\:hover\:text-indigo-400`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:8950/dummy.site/settings/danger-zone
  - `.text-gray-500\/60.dark\:text-gray-400\/60[data-phx-loc="116"]`
  - `p[data-phx-loc="169"]`
- http://localhost:8950/billing/choose-plan
  - `#starter-checkout`
  - `#growth-checkout`
  - `.text-indigo-500`
- http://localhost:8950/dummy.site [state:dark-dashboard]
  - `a[href$="site/1"]`
  - `.plausible-event-name\=Weekly\+Email\+Note\+Click`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:8950/dummy.site/settings/visibility
  - `a[data-phx-loc="250"]`
- http://localhost:8950/settings/api-keys/new
  - `.no-underline`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-prohibited-attr?application=axeAPI

- http://localhost:8950/sites/new
  - `.h-2`
  - `.size-2`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-dialog-name?application=axeAPI

- http://localhost:8950/dummy.site/settings/visibility
  - `#shared-links-form-modal`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:8950/sites
  - `.z-20`
  - `aside[data-phx-loc="65"]`
- http://localhost:8950/sites/new
  - `.z-20`
- http://localhost:8950/team/setup
  - `.z-20`
- http://localhost:8950/dummy.site
  - `.py-5`
- http://localhost:8950/dummy.site/installation
  - `.z-20`
- http://localhost:8950/dummy.site/change-domain
  - `.z-20`
- http://localhost:8950/dummy.site/settings/people
  - `.z-20`
- http://localhost:8950/dummy.site/settings/visibility
  - `.z-20`
- http://localhost:8950/dummy.site/settings/funnels
  - `.z-20`
- http://localhost:8950/dummy.site/settings/danger-zone
  - `.z-20`
- http://localhost:8950/dummy.site/settings/integrations
  - `.z-20`
- http://localhost:8950/dummy.site/settings/imports-exports
  - `.z-20`
- http://localhost:8950/settings/preferences
  - `.z-20`
- http://localhost:8950/settings/security
  - `.z-20`
- http://localhost:8950/settings/api-keys
  - `.z-20`
- http://localhost:8950/settings/api-keys/new
  - `.z-20`
- http://localhost:8950/settings/danger-zone
  - `.z-20`
- http://localhost:8950/dummy.site [state:site-switcher-menu]
  - `.py-5`
- http://localhost:8950/dummy.site [state:user-menu]
  - `.py-5`
- http://localhost:8950/dummy.site [state:filter-menu]
  - `.py-5`
- http://localhost:8950/dummy.site [state:period-menu]
  - `.py-5`
- http://localhost:8950/dummy.site [state:options-menu]
  - `.py-5`
- http://localhost:8950/dummy.site [state:breakdown-menu]
  - `.py-5`
- http://localhost:8950/dummy.site [state:funnel-menu]
  - `.py-5`
- http://localhost:8950/dummy.site?period=realtime [state:realtime-view]
  - `.py-5`
- http://localhost:8950/dummy.site [state:goal-report]
  - `.py-5`
- http://localhost:8950/dummy.site [state:mobile-dash-390]
  - `.py-5`
- http://localhost:8950/dummy.site [state:dark-dashboard]
  - `.py-5`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:8950/sites
  - `html`
- http://localhost:8950/team/setup
  - `html`
- http://localhost:8950/dummy.site
  - `html`
- http://localhost:8950/dummy.site/change-domain
  - `html`
- http://localhost:8950/dummy.site/settings/people
  - `html`
- http://localhost:8950/dummy.site/settings/funnels
  - `html`
- http://localhost:8950/dummy.site/settings/danger-zone
  - `html`
- http://localhost:8950/dummy.site/settings/integrations
  - `html`
- http://localhost:8950/dummy.site/settings/imports-exports
  - `html`
- http://localhost:8950/settings/preferences
  - `html`
- http://localhost:8950/settings/security
  - `html`
- http://localhost:8950/settings/api-keys
  - `html`
- http://localhost:8950/settings/api-keys/new
  - `html`
- http://localhost:8950/settings/danger-zone
  - `html`
- http://localhost:8950/dummy.site [state:site-switcher-menu]
  - `html`
- http://localhost:8950/dummy.site [state:user-menu]
  - `html`
- http://localhost:8950/dummy.site [state:period-menu]
  - `html`
- http://localhost:8950/dummy.site [state:options-menu]
  - `html`
- http://localhost:8950/dummy.site [state:breakdown-menu]
  - `html`
- http://localhost:8950/dummy.site [state:funnel-menu]
  - `html`
- http://localhost:8950/dummy.site?period=realtime [state:realtime-view]
  - `html`
- http://localhost:8950/dummy.site [state:goal-report]
  - `html`
- http://localhost:8950/dummy.site [state:mobile-dash-390]
  - `html`
- http://localhost:8950/dummy.site [state:dark-dashboard]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:8950/sites
  - `.mt-24`
  - `canvas`
- http://localhost:8950/team/setup
  - `.mt-24`
  - `canvas`
- http://localhost:8950/dummy.site/installation
  - `canvas`
- http://localhost:8950/dummy.site/change-domain
  - `.mt-24`
  - `canvas`
- http://localhost:8950/dummy.site/settings/people
  - `.mt-24`
- http://localhost:8950/dummy.site/settings/visibility
  - `.mt-24`
- http://localhost:8950/dummy.site/settings/funnels
  - `.mt-24`
- http://localhost:8950/dummy.site/settings/danger-zone
  - `.mt-24`
- http://localhost:8950/dummy.site/settings/integrations
  - `.mt-24`
- http://localhost:8950/dummy.site/settings/imports-exports
  - `.mt-24`
- http://localhost:8950/settings/preferences
  - `.mt-24`
- http://localhost:8950/settings/security
  - `.mt-24`
- http://localhost:8950/settings/api-keys
  - `.mt-24`
- http://localhost:8950/settings/api-keys/new
  - `.mt-24`
- http://localhost:8950/settings/danger-zone
  - `.mt-24`
- http://localhost:8950/billing/choose-plan
  - `.mt-24`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:8950/team/setup
  - `h4[data-phx-loc="5"]`
- http://localhost:8950/dummy.site/change-domain
  - `h4[data-phx-loc="5"]`
- http://localhost:8950/dummy.site/settings/people
  - `h4[data-phx-loc="5"]`
- http://localhost:8950/dummy.site/settings/visibility
  - `h4[data-phx-loc="5"]`
- http://localhost:8950/dummy.site/settings/funnels
  - `h4[data-phx-loc="5"]`
- http://localhost:8950/dummy.site/settings/danger-zone
  - `h4[data-phx-loc="5"]`
- http://localhost:8950/dummy.site/settings/integrations
  - `h4[data-phx-loc="5"]`
- http://localhost:8950/settings/preferences
  - `h4[data-phx-loc="5"]`
- http://localhost:8950/settings/security
  - `h4[data-phx-loc="5"]`
- http://localhost:8950/settings/api-keys/new
  - `h4[data-phx-loc="5"]`
- http://localhost:8950/settings/danger-zone
  - `h4[data-phx-loc="5"]`
- http://localhost:8950/billing/choose-plan
  - `#starter-plan-box > .gap-x-4.justify-between[data-phx-loc="34"] > .leading-8[data-phx-loc="35"]`

## Résultats incomplets à revoir (292)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:8950/sites
  - `#sort-dropdown-trigger`
  - `#site-dummy\.site-dropdown-trigger`
  - `#site-another\.site-dropdown-trigger`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8950/sites
  - `span[data-phx-loc="34"]`
  - `.text-indigo-600`
- http://localhost:8950/team/setup
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
- http://localhost:8950/dummy.site
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,96.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,16.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(24.5,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(215.6111111111111,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(406.7222222222222,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - … +3 autres
- http://localhost:8950/dummy.site/installation
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
- http://localhost:8950/dummy.site/change-domain
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
- http://localhost:8950/dummy.site/settings/people
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `.dark\:hover\:bg-gray-850.focus\:text-gray-900.focus\:bg-gray-50:nth-child(11)`
  - `.dark\:hover\:bg-gray-850.focus\:text-gray-900.focus\:bg-gray-50:nth-child(12)`
- http://localhost:8950/dummy.site/settings/visibility
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `.dark\:hover\:bg-gray-850.focus\:text-gray-900.focus\:bg-gray-50:nth-child(11)`
  - `.dark\:hover\:bg-gray-850.focus\:text-gray-900.focus\:bg-gray-50:nth-child(12)`
  - `#theme`
- http://localhost:8950/dummy.site/settings/funnels
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `.dark\:hover\:bg-gray-850.focus\:text-gray-900.focus\:bg-gray-50:nth-child(11)`
  - `.dark\:hover\:bg-gray-850.focus\:text-gray-900.focus\:bg-gray-50:nth-child(12)`
- http://localhost:8950/dummy.site/settings/danger-zone
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `.dark\:hover\:bg-gray-850.focus\:text-gray-900.focus\:bg-gray-50:nth-child(11)`
- http://localhost:8950/dummy.site/settings/integrations
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `.dark\:hover\:bg-gray-850.focus\:text-gray-900.focus\:bg-gray-50:nth-child(11)`
  - `.dark\:hover\:bg-gray-850.focus\:text-gray-900.focus\:bg-gray-50:nth-child(12)`
- http://localhost:8950/dummy.site/settings/imports-exports
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `.dark\:hover\:bg-gray-850.focus\:text-gray-900.focus\:bg-gray-50:nth-child(11)`
  - `.dark\:hover\:bg-gray-850.focus\:text-gray-900.focus\:bg-gray-50:nth-child(12)`
- http://localhost:8950/settings/preferences
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `#user_theme`
- http://localhost:8950/settings/security
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
- http://localhost:8950/settings/api-keys
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
- http://localhost:8950/settings/api-keys/new
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
- http://localhost:8950/settings/danger-zone
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
- http://localhost:8950/billing/choose-plan
  - `span[data-phx-loc="147"]`
  - `div[x-data="{ open: true}"] > dt > .items-start.text-left[data-phx-loc="758"] > .font-semibold[data-phx-loc="763"]`
  - `p[data-phx-loc="221"]`
  - `span[data-phx-loc="247"]`
  - `b`
  - `a[data-phx-loc="256"]`
  - `div[x-data="{ open: false}"] > dt > .items-start.text-left[data-phx-loc="758"] > .font-semibold[data-phx-loc="763"]`
  - `.mt-16`
  - `.dark\:hover\:text-indigo-400[data-phx-loc="360"][href$="contact"]`
  - `a[data-phx-loc="367"]`
- http://localhost:8950/dummy.site [state:site-switcher-menu]
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `a[data-selected="false"] > kbd`
  - `a[data-selected="true"] > kbd`
  - `.w-fit.font-bold.tracking-\[-\.01em\]`
  - `#visitors`
  - `.bg-gray-100\/70 > div:nth-child(2) > .items-baseline.whitespace-nowrap > .ml-2.font-medium[data-testid="change-arrow"]`
  - `.lg\:border-l.lg\:flex-1.w-1\/2:nth-child(2) > div > .gap-y-1.p-2.-mx-2 > .group-hover\:text-gray-900.dark\:group-hover\:text-gray-100.w-fit`
  - `#visits`
  - `.lg\:border-l.lg\:flex-1.w-1\/2:nth-child(2) > div > .gap-y-1.p-2.-mx-2 > div:nth-child(2) > .items-baseline.whitespace-nowrap > .ml-2.font-medium[data-testid="change-arrow"]`
  - … +11 autres
- http://localhost:8950/dummy.site [state:user-menu]
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `#headlessui-popover-button-\:r2\: > .block.truncate`
  - `span[data-testid="current-query-period"]`
  - `.lg\:border-l.lg\:flex-1.px-4:nth-child(6) > div > .gap-y-1.p-2.-mx-2 > .group-hover\:text-gray-900.dark\:group-hover\:text-gray-100.w-fit`
  - `#visit_duration`
  - `.lg\:border-l.lg\:flex-1.px-4:nth-child(6) > div > .gap-y-1.p-2.-mx-2 > div:nth-child(2) > .items-baseline.whitespace-nowrap > .ml-2.font-medium[data-testid="change-arrow"]`
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - … +8 autres
- http://localhost:8950/dummy.site [state:filter-menu]
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `.border-r.lg\:border-r-0.lg\:border-l:nth-child(5) > div > .gap-y-1.p-2.-mx-2 > .group-hover\:text-gray-900.dark\:group-hover\:text-gray-100.w-fit`
  - `#bounce_rate`
  - `.border-r.lg\:border-r-0.lg\:border-l:nth-child(5) > div > .gap-y-1.p-2.-mx-2 > div:nth-child(2) > .items-baseline.whitespace-nowrap > .ml-2.font-medium[data-testid="change-arrow"]`
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,96.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,16.5)"] > text[x="-3"][dy="0.32em"]`
  - … +6 autres
- http://localhost:8950/dummy.site [state:period-menu]
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `.py-2\.5.data-\[selected\=true\]\:bg-gray-100[data-selected="false"]:nth-child(1) > kbd`
  - `.py-2\.5.data-\[selected\=true\]\:bg-gray-100[data-selected="false"]:nth-child(2) > kbd`
  - `.py-2\.5.data-\[selected\=true\]\:bg-gray-100[data-selected="false"]:nth-child(3) > kbd`
  - `.py-2\.5.data-\[selected\=true\]\:bg-gray-100[data-selected="false"]:nth-child(5) > kbd`
  - `.py-2\.5.data-\[selected\=true\]\:bg-gray-100[data-selected="false"]:nth-child(6) > kbd`
  - `a[data-selected="true"] > kbd`
  - `.py-2\.5.data-\[selected\=true\]\:bg-gray-100[data-selected="false"]:nth-child(8) > kbd`
  - `.py-2\.5.data-\[selected\=true\]\:bg-gray-100[data-selected="false"]:nth-child(10) > kbd`
  - … +20 autres
- http://localhost:8950/dummy.site [state:options-menu]
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,96.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,16.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(24.5,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(215.6111111111111,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(406.7222222222222,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - … +3 autres
- http://localhost:8950/dummy.site [state:breakdown-menu]
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `.sm\:mr-1`
  - `.inline-block.text-gray-500.dark\:text-gray-400`
  - `.lg\:inline`
  - `#headlessui-popover-button-\:r2\: > .truncate.block`
  - `span[data-testid="current-query-period"]`
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - … +30 autres
- http://localhost:8950/dummy.site [state:funnel-menu]
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `.sm\:mr-1`
  - `.inline-block.dark\:text-gray-400.text-gray-500`
  - `.lg\:inline`
  - `#headlessui-popover-button-\:r2\: > .truncate.block`
  - `span[data-testid="current-query-period"]`
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - … +15 autres
- http://localhost:8950/dummy.site?period=realtime [state:realtime-view]
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,96.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,16.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(16.5,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `.tick.group[opacity="1"]:nth-child(2) > .translate-y-2[y="7"][dy="0.71em"]`
  - `.tick.group[opacity="1"]:nth-child(3) > .translate-y-2[y="7"][dy="0.71em"]`
  - … +3 autres
- http://localhost:8950/dummy.site [state:goal-report]
  - `span[data-phx-loc="34"]`
  - `.plausible-event-name\=Trial\+Notification\+Upgrade\+Click`
  - `.sm\:mr-1`
  - `.inline-block.dark\:text-gray-400.text-gray-500`
  - `.lg\:inline`
  - `#headlessui-popover-button-\:r2\: > .truncate.block`
  - `span[data-testid="current-query-period"]`
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - … +14 autres
- http://localhost:8950/dummy.site [state:mobile-dash-390]
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,96.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,16.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(24.5,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(80.42592592592592,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `.tick[opacity="1"]:nth-child(3) > .translate-y-2[y="7"][dy="0.71em"]`
  - `.tick[opacity="1"]:nth-child(4) > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(248.2037037037037,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - … +1 autres
- http://localhost:8950/dummy.site [state:dark-dashboard]
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,96.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,16.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(24.5,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(80.42592592592592,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `.tick[opacity="1"]:nth-child(3) > .translate-y-2[y="7"][dy="0.71em"]`
  - `.tick[opacity="1"]:nth-child(4) > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(248.2037037037037,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - … +1 autres

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:8950/sites/new
  - `#flow-progress`

