# Audit accessibilité — 2026-10-08

**22 règle(s) violée(s), 269 occurrence(s), 24/24 scénario(s) audité(s), 0 erreur(s), 158 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `8f0a3e9291ff`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents
  - `#radix-_r_r_`
  - `#radix-_r_14_`
  - `.bg-transparent`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit
  - `.border-input.justify-center[aria-haspopup="dialog"]:nth-child(2)`
  - `.transition-shadow > .space-x-2.shrink-0.items-center > .justify-center.h-9.hover\:bg-accent:nth-child(1)`
  - `.transition-shadow > .space-x-2.shrink-0.items-center > .justify-center.h-9[aria-haspopup="dialog"]`
  - `.space-x-2.flex-row.items-center > .border-input.justify-center.h-9:nth-child(1)`
  - `fieldset[data-native-id="2224"] > .gap-x-2.flex-row.items-center > .mt-auto.px-2[data-testid="remove-signer-button"]`
  - `fieldset[data-native-id="2225"] > .gap-x-2.flex-row.items-center > .mt-auto.px-2[data-testid="remove-signer-button"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv
  - `#radix-_r_4_`
  - `li:nth-child(1) > .flex-row.items-center > div[data-state="closed"][type="button"] > .h-7.px-0\.5.ml-2`
  - `li:nth-child(2) > .flex-row.items-center > div[data-state="closed"][type="button"] > .h-7.px-0\.5.ml-2`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv/logs
  - `.bg-transparent`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates
  - `.flex-row.flex.items-center > button[data-state="closed"][type="button"]`
  - `#radix-_r_b_`
  - `.bg-transparent`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates/envelope_ibsedwbeerobkhul/edit
  - `.border-input[aria-haspopup="dialog"][data-state="closed"]:nth-child(2)`
  - `.transition-shadow > .space-x-2.shrink-0.items-center > .justify-center.h-9.hover\:bg-accent:nth-child(1)`
  - `.transition-shadow > .space-x-2.shrink-0.items-center > .justify-center[aria-haspopup="dialog"][data-state="closed"]`
  - `.space-x-2.flex-row.items-center > .border-input.justify-center[data-state="closed"]`
  - `button[data-testid="remove-signer-button"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/members
  - `#radix-_r_g_`
  - `.w-\[70px\]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/document
  - `button[data-testid="document-visibility-trigger"]`
  - `button[data-testid="document-language-trigger"]`
  - `button[data-testid="document-date-format-trigger"]`
  - `.my-2`
  - `button[data-testid="signature-types-trigger"]`
  - `div[data-testid="inheritable-default-recipients"] > .bg-transparent.placeholder\:text-muted-foreground.focus\:ring-2`
  - `.space-y-2.flex-1:nth-child(7) > .placeholder\:text-muted-foreground.focus\:ring-2.focus\:ring-ring`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/public-profile
  - `.peer`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/members
  - `#radix-_r_9_`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:status-filter-popover]
  - `#radix-_r_2b_`
  - `#radix-_r_2k_`
  - `.bg-transparent`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit [state:editor-fields-step]
  - `.border-input.hover\:bg-accent.hover\:text-accent-foreground:nth-child(2)`
  - `.hover\:text-foreground`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit [state:editor-settings-dialog]
  - `.space-y-2:nth-child(1) > .placeholder\:text-muted-foreground[aria-autocomplete="none"][dir="ltr"]`
  - `.justify-center[role="combobox"][aria-haspopup="dialog"]`
  - `.h-\[45rem\] > .space-y-2:nth-child(3) > .placeholder\:text-muted-foreground[aria-autocomplete="none"][dir="ltr"]`
  - `.my-2`
  - `.space-y-2:nth-child(7) > .placeholder\:text-muted-foreground[aria-autocomplete="none"][dir="ltr"]`
  - `button[data-testid="envelope-expiration-mode"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:mobile-documents-390]
  - `.space-x-4 > button:nth-child(1)`
  - `.space-x-4 > button:nth-child(2)`
  - `#radix-_r_1v_`
  - `#radix-_r_28_`
  - `.bg-transparent`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:dark-documents]
  - `.space-x-4 > button:nth-child(1)`
  - `.space-x-4 > button:nth-child(2)`
  - `#radix-_r_1d_`
  - `#radix-_r_1m_`
  - `.bg-transparent`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.14/label?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents
  - `.min-h-screen > input[multiple=""][accept="application/pdf,.pdf"][type="file"]`
  - `input[data-testid="document-upload-input"][multiple=""][accept="application/pdf,.pdf"]`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90 > .gap-2.items-center.flex > input[data-testid="document-upload-input"][accept="application/pdf,.pdf"][type="file"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit
  - `.mx-auto > input[accept="application/pdf,.pdf"][type="file"]`
  - `input[multiple=""]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates
  - `.min-h-screen > input[multiple=""][accept="application/pdf,.pdf"][type="file"]`
  - `input[data-testid="document-upload-input"][multiple=""][accept="application/pdf,.pdf"]`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90 > .gap-2.flex.items-center > input[data-testid="document-upload-input"][accept="application/pdf,.pdf"][type="file"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates/envelope_ibsedwbeerobkhul/edit
  - `.mx-auto > input[accept="application/pdf,.pdf"][type="file"]`
  - `input[multiple=""]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `input[accept="image/*,.png,.jpg,.jpeg"]`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `input[accept="image/*,.png,.jpg,.jpeg"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:status-filter-popover]
  - `.min-h-screen > input[multiple=""][accept="application/pdf,.pdf"][type="file"]`
  - `input[data-testid="document-upload-input"][multiple=""][accept="application/pdf,.pdf"]`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90 > .gap-2.items-center.flex > input[data-testid="document-upload-input"][accept="application/pdf,.pdf"][type="file"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:mobile-documents-390]
  - `.min-h-screen > input[multiple=""][accept="application/pdf,.pdf"][type="file"]`
  - `input[data-testid="document-upload-input"][multiple=""][accept="application/pdf,.pdf"]`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90 > .gap-2.items-center.flex > input[data-testid="document-upload-input"][accept="application/pdf,.pdf"][type="file"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:dark-documents]
  - `.min-h-screen > input[multiple=""][accept="application/pdf,.pdf"][type="file"]`
  - `input[data-testid="document-upload-input"][multiple=""][accept="application/pdf,.pdf"]`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90 > .gap-2.items-center.flex > input[data-testid="document-upload-input"][accept="application/pdf,.pdf"][type="file"]`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv
  - `ul[role="list"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:team-switcher-menu]
  - `#radix-_R_2aj5H1_`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/members
  - `#radix-_R_jdcj5_-trigger-members`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-attr?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit [state:editor-fields-step]
  - `.inset-0`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9400/inbox
  - `.px-1\.5`
  - `.h-60 > p`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents
  - `.px-1\.5`
  - `.mt-1`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/folders
  - `.px-1\.5`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv
  - `.px-1\.5`
  - `.text-documenso-700`
  - `.mt-2`
  - `.last\:border-b:nth-child(1) > span:nth-child(1)`
  - `.last\:border-b:nth-child(2) > span:nth-child(1)`
  - `.last\:border-b:nth-child(3) > span:nth-child(1)`
  - `.last\:border-b:nth-child(4) > span:nth-child(1)`
  - `li:nth-child(1) > .max-w-xs.gap-2.w-full > .text-left.font-normal.flex-col > .truncate.text-foreground > p`
  - `li:nth-child(1) > .max-w-xs.gap-2.w-full > .text-left.font-normal.flex-col > .truncate.text-xs > .text-muted-foreground\/70`
  - `li:nth-child(2) > .max-w-xs.gap-2.w-full > .text-left.font-normal.flex-col > .truncate.text-foreground > p`
  - … +2 autres
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv/logs
  - `.px-1\.5`
  - `.text-documenso-700`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates
  - `.px-1\.5`
  - `.mt-1`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `.py-0\.5`
  - `.w-16 > .text-gray-400.bg-muted.h-full`
  - `.text-foreground\/50`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/members
  - `.py-0\.5`
  - `.w-12 > .text-gray-400.h-full.bg-muted`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/document
  - `.tracking-wider`
  - `span[data-testid="document-visibility-status"]`
  - `span[data-testid="document-language-status"]`
  - `span[data-testid="document-date-format-status"]`
  - `span[data-testid="document-timezone-status"]`
  - `span[data-testid="signature-types-status"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/public-profile
  - `.py-0\.5`
  - `span:nth-child(3)`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/analytics
  - `.px-1\.5`
  - `.w-9 > .h-full.bg-muted.text-xs`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `.py-0\.5`
  - `.w-16 > .text-gray-400.bg-muted.h-full`
  - `.text-foreground\/50`
  - `.bg-destructive`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/members
  - `.py-0\.5`
  - `#radix-_R_jdcj5_-trigger-invites`
  - `.w-12 > .text-gray-400.h-full.bg-muted`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:search-command-menu]
  - `.tracking-wider`
  - `.mt-1`
  - `#radix-_r_a_ > a > .tracking-widest.text-xs.text-muted-foreground`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:team-switcher-menu]
  - `.px-1\.5`
  - `.mt-1`
  - `a[href$="org_dhhifibmrwznuxbr"] > .min-w-0.flex-1.truncate`
  - `.min-w-0.font-semibold.flex-1`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:create-folder-dialog]
  - `.px-1\.5`
  - `.mt-1`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:status-filter-popover]
  - `.px-1\.5`
  - `.mt-1`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:row-actions-menu]
  - `.px-1\.5`
  - `.mt-1`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:mobile-documents-390]
  - `.mt-1`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:9400/inbox
  - `.md\:inline`
  - `.block`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents
  - `.md\:inline`
  - `a[href$="inbox"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/folders
  - `.md\:inline`
  - `.block`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit
  - `a[href="/"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv
  - `.md\:inline`
  - `a[href$="inbox"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv/logs
  - `.md\:inline`
  - `a[href$="inbox"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates
  - `.md\:inline`
  - `a[href$="inbox"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates/envelope_ibsedwbeerobkhul/edit
  - `a[href="/"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `.md\:inline`
  - `a[href$="inbox"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/members
  - `.md\:inline`
  - `a[href$="inbox"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/document
  - `.md\:inline`
  - `a[href$="inbox"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/public-profile
  - `.md\:inline`
  - `a[href$="inbox"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/analytics
  - `.md\:inline`
  - `.block`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `.md\:inline`
  - `a[href$="inbox"]`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/members
  - `.md\:inline`
  - `a[href$="inbox"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:team-switcher-menu]
  - `.md\:opacity-0`
  - `.opacity-0`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:status-filter-popover]
  - `.md\:inline`
  - `a[href$="inbox"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit [state:editor-fields-step]
  - `a[href="/"]`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.14/nested-interactive?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `.bg-secondary`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `.bg-secondary`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:search-command-menu]
  - `#radix-_r_a_`
  - `#radix-_r_b_`
  - `#radix-_r_c_`
  - `#radix-_r_d_`
  - `#radix-_r_e_`
  - `#radix-_r_h_`
  - `#radix-_r_k_`
  - `#radix-_r_l_`
  - `#radix-_r_m_`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:status-filter-popover]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:mobile-documents-390]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:dark-documents]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`

## [SERIOUS] aria-command-name — ARIA commands must have an accessible name

Ensure every ARIA button, link and menuitem has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-command-name?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit
  - `.cursor-grab`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates/envelope_ibsedwbeerobkhul/edit
  - `.cursor-grab`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-dialog-name?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:search-command-menu]
  - `#radix-_R_eqj5_`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:status-filter-popover]
  - `#radix-_R_38qsj5_`

## [SERIOUS] aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

Ensure aria-hidden elements are not focusable nor contain focusable elements
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-hidden-focus?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:team-switcher-menu]
  - `div[data-aria-hidden="true"][aria-hidden="true"]:nth-child(2)`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:row-actions-menu]
  - `div[data-aria-hidden="true"][aria-hidden="true"]:nth-child(2)`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.14/list?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `ul`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:search-command-menu]
  - `.absolute`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates/envelope_ibsedwbeerobkhul/edit
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/members
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/document
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/public-profile
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/analytics
  - `html`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `html`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/members
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:team-switcher-menu]
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:row-actions-menu]
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit [state:editor-fields-step]
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:mobile-documents-390]
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:dark-documents]
  - `html`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-main-is-top-level?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `.md\:px-12`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/members
  - `.md\:px-12`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/document
  - `.md\:px-12`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/public-profile
  - `.md\:px-12`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `.md\:px-12`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/members
  - `.md\:px-12`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `.md\:h-dvh > main`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/members
  - `.md\:h-dvh > main`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/document
  - `.md\:h-dvh > main`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/public-profile
  - `.md\:h-dvh > main`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `.md\:h-dvh > main`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/members
  - `.md\:h-dvh > main`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `.md\:h-dvh > main`
  - `.p-4:nth-child(1) > div[data-testid="unified-settings-sidebar-group"] > nav`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/members
  - `.md\:h-dvh > main`
  - `.p-4:nth-child(1) > div[data-testid="unified-settings-sidebar-group"] > nav`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/document
  - `.md\:h-dvh > main`
  - `.p-4:nth-child(1) > div[data-testid="unified-settings-sidebar-group"] > nav`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/public-profile
  - `.md\:h-dvh > main`
  - `.p-4:nth-child(1) > div[data-testid="unified-settings-sidebar-group"] > nav`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `.md\:h-dvh > main`
  - `.p-4:nth-child(1) > div[data-testid="unified-settings-sidebar-group"] > nav`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/members
  - `.md\:h-dvh > main`
  - `.p-4:nth-child(1) > div[data-testid="unified-settings-sidebar-group"] > nav`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv
  - `h3`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv/logs
  - `.text-foreground.text-sm:nth-child(1) > h3`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `.\[\&\>svg\]\:absolute.\[\&\>svg\]\:text-foreground.\[\&\>svg\]\:left-4:nth-child(1) > .sm\:mb-0.mb-4 > h5`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/members
  - `h5`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `h5`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:team-switcher-menu]
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:row-actions-menu]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:team-switcher-menu]
  - `div[data-radix-popper-content-wrapper=""]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:row-actions-menu]
  - `div[data-radix-popper-content-wrapper=""]`

## [MINOR] aria-allowed-role — ARIA role should be appropriate for the element

Ensure role attribute has an appropriate value for the element
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-role?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `.bg-secondary`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `.bg-secondary`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:status-filter-popover]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:mobile-documents-390]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:dark-documents]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`

## [MINOR] presentation-role-conflict — Elements marked as presentational should be consistently ignored

Ensure elements marked as presentational do not have global ARIA or tabindex so that all screen readers ignore them
Référence : https://dequeuniversity.com/rules/axe/4.14/presentation-role-conflict?application=axeAPI

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `.bg-secondary`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `.bg-secondary`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:status-filter-popover]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:mobile-documents-390]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:dark-documents]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`

## Résultats incomplets à revoir (158)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9400/inbox
  - `.h-full`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents
  - `.text-gray-400`
  - `.mr-3 > .bg-muted.text-xs.h-full`
  - `.z-50.overflow-hidden.w-10 > .bg-yellow-200.text-yellow-700.h-full`
  - `.z-40.-ml-3.overflow-hidden > .bg-yellow-200.text-yellow-700.h-full`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/folders
  - `.h-full`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit
  - `.mt-6`
  - `.mt-1`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv
  - `#radix-_R_2aj5_ > .max-w-xs.gap-2.w-full > .shrink-0.border-white.border-solid > .text-gray-400.h-full.rounded-full`
  - `li:nth-child(1) > .max-w-xs.gap-2.w-full > .shrink-0.border-white.border-solid > .text-gray-400.h-full.rounded-full`
  - `li:nth-child(2) > .max-w-xs.gap-2.w-full > .shrink-0.border-white.border-solid > .text-gray-400.h-full.rounded-full`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_oiuyeoawyurxfklv/logs
  - `.h-full`
  - `.text-foreground.text-sm:nth-child(1) > h3`
  - `.text-foreground.text-sm:nth-child(1) > p`
  - `.text-foreground.text-sm:nth-child(2) > h3`
  - `.text-foreground.text-sm:nth-child(2) > p`
  - `.text-foreground.text-sm:nth-child(3) > h3`
  - `.text-foreground.text-sm:nth-child(3) > p`
  - `.text-foreground.text-sm:nth-child(4) > h3`
  - `.text-foreground.text-sm:nth-child(4) > p`
  - `.text-foreground.text-sm:nth-child(5) > h3`
  - … +8 autres
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates
  - `.text-gray-400`
  - `.mr-3 > .h-full.bg-muted.rounded-full`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates/envelope_ibsedwbeerobkhul/edit
  - `.mt-6`
  - `.mt-1`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `.w-10.border-white.dark\:border-border > .text-gray-400.bg-muted.h-full`
  - `.mb-2:nth-child(2) > .h-auto.py-1[data-testid="settings-org-switcher-trigger"] > .max-w-none.gap-2.w-full > .w-8.border-white.dark\:border-border > .text-gray-400.bg-muted.h-full`
  - `.mb-2:nth-child(2) > .h-auto.py-1[data-testid="settings-team-switcher-trigger"] > .max-w-none.gap-2.w-full > .w-8.border-white.dark\:border-border > .text-gray-400.bg-muted.h-full`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/members
  - `.w-10.overflow-hidden.border-2 > .text-gray-400.h-full.bg-muted`
  - `.mb-2:nth-child(2) > .h-auto.py-1[data-testid="settings-org-switcher-trigger"] > .max-w-none.gap-2.w-full > .overflow-hidden.border-2.border-white > .text-gray-400.h-full.bg-muted`
  - `.mb-2:nth-child(2) > .h-auto.py-1[data-testid="settings-team-switcher-trigger"] > .max-w-none.gap-2.w-full > .overflow-hidden.border-2.border-white > .text-gray-400.h-full.bg-muted`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/document
  - `.w-10.overflow-hidden.border-2 > .text-gray-400.h-full.justify-center`
  - `.mb-2:nth-child(2) > .h-auto.py-1[data-testid="settings-org-switcher-trigger"] > .max-w-none.gap-2.w-full > .w-8.overflow-hidden.border-2 > .text-gray-400.h-full.justify-center`
  - `.mb-2:nth-child(2) > .h-auto.py-1[data-testid="settings-team-switcher-trigger"] > .max-w-none.gap-2.w-full > .w-8.overflow-hidden.border-2 > .text-gray-400.h-full.justify-center`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/public-profile
  - `.w-10.border-white.border-solid > .text-gray-400.h-full.bg-muted`
  - `.mb-2:nth-child(2) > .h-auto.py-1[data-testid="settings-org-switcher-trigger"] > .max-w-none.gap-2.w-full > .w-8.border-white.border-solid > .text-gray-400.h-full.bg-muted`
  - `.mb-2:nth-child(2) > .h-auto.py-1[data-testid="settings-team-switcher-trigger"] > .max-w-none.gap-2.w-full > .w-8.border-white.border-solid > .text-gray-400.h-full.bg-muted`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/analytics
  - `.text-gray-400`
  - `.mr-3 > .h-full.bg-muted.text-xs`
  - `tspan[x="47.95"][dy="0.71em"]`
  - `tspan[x="167.45"][dy="0.71em"]`
  - `tspan[x="286.95"][dy="0.71em"]`
  - `tspan[x="406.45"][dy="0.71em"]`
  - `tspan[x="525.95"][dy="0.71em"]`
  - `tspan[x="645.45"][dy="0.71em"]`
  - `text[y="210"] > tspan[dy="0.355em"][x="28"]`
  - `text[y="142.66666666666669"] > tspan[dy="0.355em"][x="28"]`
  - … +2 autres
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `.w-10.border-white.dark\:border-border > .text-gray-400.bg-muted.h-full`
  - `.mb-2:nth-child(2) > .h-auto.py-1[data-testid="settings-org-switcher-trigger"] > .max-w-none.gap-2.w-full > .w-8.border-white.dark\:border-border > .text-gray-400.bg-muted.h-full`
  - `button[data-testid="settings-team-switcher-trigger"] > .max-w-none.gap-2.w-full > .w-8.border-white.dark\:border-border > .text-gray-400.bg-muted.h-full`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/members
  - `.w-10.overflow-hidden.border-2 > .text-gray-400.h-full.bg-muted`
  - `.mb-2:nth-child(2) > .h-auto.py-1[data-testid="settings-org-switcher-trigger"] > .max-w-none.gap-2.w-full > .w-8.overflow-hidden.border-2 > .text-gray-400.h-full.bg-muted`
  - `button[data-testid="settings-team-switcher-trigger"] > .max-w-none.gap-2.w-full > .w-8.overflow-hidden.border-2 > .text-gray-400.h-full.bg-muted`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:search-command-menu]
  - `.text-gray-400`
  - `.mr-3 > .bg-muted.h-full.text-xs`
  - `.z-50.w-10.border-2 > .bg-yellow-200.text-yellow-700.h-full`
  - `.z-40.-ml-3.w-10 > .bg-yellow-200.text-yellow-700.h-full`
  - `.h-7.text-\[13px\].whitespace-nowrap:nth-child(2) > .opacity-60.font-normal`
  - `.gap-1\.5.inline-flex:nth-child(1) > .h-\[18px\].min-w-\[18px\].px-1:nth-child(1)`
  - `.h-\[18px\].min-w-\[18px\].px-1:nth-child(2)`
  - `.gap-1\.5.inline-flex:nth-child(2) > .h-\[18px\].min-w-\[18px\].px-1`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:team-switcher-menu]
  - `.text-gray-400`
  - `.mr-3 > .bg-muted.text-xs.h-full`
  - `.z-50.w-10.border-2 > .bg-yellow-200.text-yellow-700.h-full`
  - `.z-40.-ml-3.w-10 > .bg-yellow-200.text-yellow-700.h-full`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:create-folder-dialog]
  - `.text-gray-400`
  - `.mr-3 > .bg-muted.text-xs.h-full`
  - `.z-50.overflow-hidden.w-10 > .bg-yellow-200.text-yellow-700.h-full`
  - `.z-40.-ml-3.overflow-hidden > .bg-yellow-200.text-yellow-700.h-full`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:status-filter-popover]
  - `.text-gray-400`
  - `.mr-3 > .bg-muted.h-full.rounded-full`
  - `.z-50.w-10.border-2 > .bg-yellow-200.text-yellow-700.h-full`
  - `.z-40.-ml-3.w-10 > .bg-yellow-200.text-yellow-700.h-full`
  - `#radix-_r_a_ > .pl-4.ml-auto.text-xs`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:row-actions-menu]
  - `.text-gray-400`
  - `.mr-3 > .bg-muted.text-xs.h-full`
  - `.z-50.w-10.border-2 > .bg-yellow-200.text-yellow-700.h-full`
  - `.z-40.-ml-3.w-10 > .bg-yellow-200.text-yellow-700.h-full`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit [state:editor-fields-step]
  - `.bg-green-100`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit [state:editor-settings-dialog]
  - `.mt-6`
  - `.mt-1`
  - `label[for="_r_3h_-form-item"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:mobile-documents-390]
  - `.text-gray-400`
  - `.mr-3 > .bg-muted.text-xs.h-full`
  - `th:nth-child(4)`
  - `th:nth-child(5)`
  - `th:nth-child(6)`
  - `th:nth-child(7)`
  - `tr[data-state="false"]:nth-child(1) > td:nth-child(4)`
  - `.z-50.overflow-hidden.w-10 > .bg-yellow-200.text-yellow-700.h-full`
  - `.z-40.-ml-3.overflow-hidden > .bg-yellow-200.text-yellow-700.h-full`
  - `tr[data-state="false"]:nth-child(1) > td:nth-child(6) > span`
  - … +2 autres
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:dark-documents]
  - `.text-gray-400`
  - `th:nth-child(4)`
  - `th:nth-child(5)`
  - `th:nth-child(6)`
  - `th:nth-child(7)`
  - `tr[data-state="false"]:nth-child(1) > td:nth-child(4)`
  - `.z-50.overflow-hidden.w-10 > .bg-yellow-200.text-yellow-700.h-full`
  - `.z-40.-ml-3.overflow-hidden > .bg-yellow-200.text-yellow-700.h-full`
  - `tr[data-state="false"]:nth-child(1) > td:nth-child(6) > span`
  - `tr[data-state="false"]:nth-child(2) > td:nth-child(4)`
  - … +1 autres

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit
  - `#signingOrder`
  - `#_r_14_-form-item`
  - `#_r_19_-form-item`
  - `#_r_1i_-form-item`
  - `#_r_1n_-form-item`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/templates/envelope_ibsedwbeerobkhul/edit
  - `#signingOrder`
  - `#_r_11_-form-item`
  - `#_r_16_-form-item`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/general
  - `#_R_lcj5_-form-item`
  - `#_R_2tcj5_-form-item`
  - `#_R_4tcj5_-form-item`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/settings/public-profile
  - `#_R_1lcj5_-form-item`
  - `#_R_2lcj5_-form-item`
- http://localhost:9400/o/org_dhhifibmrwznuxbr/settings/general
  - `#_R_1lcj5_-form-item`
  - `#_R_6lcj5_-form-item`
  - `#_R_alcj5_-form-item`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:create-folder-dialog]
  - `#_r_1c_-form-item`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:status-filter-popover]
  - `button[data-testid="documents-table-status-filter"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit [state:editor-settings-dialog]
  - `#_r_3d_-form-item`
  - `#_r_3f_-form-item`

### aria-allowed-role — ARIA role should be appropriate for the element

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:search-command-menu]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:team-switcher-menu]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:create-folder-dialog]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground[role="presentation"]`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground[role="presentation"]`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:row-actions-menu]
  - `.relative:nth-child(1) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`
  - `.relative:nth-child(2) > div[data-state="closed"][type="button"] > .bg-primary.text-primary-foreground.hover\:bg-primary\/90`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:search-command-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `div[data-aria-hidden="true"][aria-hidden="true"]:nth-child(2)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(9)`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:team-switcher-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(9)`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:create-folder-dialog]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `div[data-aria-hidden="true"][aria-hidden="true"]:nth-child(2)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(9)`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:row-actions-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(9)`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents/envelope_eznfzetwcsxxsmia/edit [state:editor-settings-dialog]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `div[data-aria-hidden="true"][aria-hidden="true"]:nth-child(2)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(13)`

### bypass — Page must have means to bypass repeated blocks

- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:search-command-menu]
  - `html`
- http://localhost:9400/t/personal_ehonlsofkmxlrfxy/documents [state:row-actions-menu]
  - `html`

