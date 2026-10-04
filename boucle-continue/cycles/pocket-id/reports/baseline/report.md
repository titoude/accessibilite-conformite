# Audit accessibilité — 2026-10-04

**10 règle(s) violée(s), 125 occurrence(s), 20/20 scénario(s) audité(s), 0 erreur(s), 4 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `5a4ed236642d`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.13/image-alt?application=axeAPI

- http://localhost:1411/settings/account
  - `#bits-c5`
  - `#bits-c7`
- http://localhost:1411/settings/apps
  - `#bits-c5`
- http://localhost:1411/settings/audit-log
  - `#bits-c5`
- http://localhost:1411/settings/audit-log/global
  - `#bits-c5`
- http://localhost:1411/settings/admin/users
  - `#bits-c5`
  - `#bits-c29`
  - `#bits-c32`
  - `#bits-c35`
- http://localhost:1411/settings/admin/users/f4b89dc2-62fb-46bf-9f5f-c34f4eafe93e
  - `#bits-c5`
  - `#bits-c28`
- http://localhost:1411/settings/admin/user-groups
  - `#bits-c5`
- http://localhost:1411/settings/admin/user-groups/c7ae7c01-28a3-4f3c-9572-1ee734ea8368
  - `#bits-c5`
- http://localhost:1411/settings/admin/apis
  - `#bits-c5`
- http://localhost:1411/settings/admin/apis/f6a8b3c1-2d4e-4a6b-8c9d-0e1f2a3b4c5d
  - `#bits-c5`
- http://localhost:1411/settings/admin/api-keys
  - `#bits-c5`
- http://localhost:1411/settings/admin/oidc-clients
  - `#bits-c5`
- http://localhost:1411/settings/admin/oidc-clients/3654a746-35d4-4321-ac61-0bdcff2b4055
  - `#bits-c5`
- http://localhost:1411/settings/admin/application-configuration
  - `#bits-c5`
- http://localhost:1411/settings/account [state:menu-compte]
  - `#bits-c5`
  - `#bits-c7`
- http://localhost:1411/settings/account [state:menu-theme]
  - `#bits-c5`
  - `#bits-c7`
- http://localhost:1411/settings/admin/users [state:form-ajout-utilisateur]
  - `#bits-c5`
  - `#bits-c29`
  - `#bits-c32`
  - `#bits-c35`
- http://localhost:1411/settings/admin/api-keys [state:form-cle-api]
  - `#bits-c5`
- http://localhost:1411/settings/account [state:mode-sombre]
  - `#bits-c5`
  - `#bits-c7`
- http://localhost:1411/settings/audit-log [state:nav-groupe-ouvert]
  - `#bits-c5`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:1411/settings/account
  - `.top-2\.5`
  - `.shrink-0 > button[type="button"]`
- http://localhost:1411/settings/audit-log/global
  - `#bits-c28`
  - `#bits-c10`
  - `#bits-c11`
  - `#bits-c30`
- http://localhost:1411/settings/admin/users/f4b89dc2-62fb-46bf-9f5f-c34f4eafe93e
  - `.shrink-0 > button[type="button"]`
- http://localhost:1411/settings/admin/application-configuration
  - `.md\:flex-row.md\:items-center.items-start:nth-child(5) > button`
- http://localhost:1411/settings/account [state:menu-compte]
  - `.top-2\.5`
  - `.shrink-0 > button[type="button"]`
- http://localhost:1411/settings/account [state:menu-theme]
  - `.top-2\.5`
  - `.shrink-0 > button[type="button"]`
- http://localhost:1411/settings/admin/users [state:form-ajout-utilisateur]
  - `.h-8.hover\:bg-muted[data-slot="button"]`
- http://localhost:1411/settings/admin/api-keys [state:form-cle-api]
  - `.h-8.has-data-\[icon\=inline-end\]\:pr-2\.5[data-slot="button"]`
- http://localhost:1411/settings/account [state:mode-sombre]
  - `.top-2\.5`
  - `.shrink-0 > button[type="button"]`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://localhost:1411/settings/account
  - `.p-5`
  - `.mt-3`
- http://localhost:1411/settings/account [state:menu-compte]
  - `.p-5`
  - `.mt-3`
- http://localhost:1411/settings/account [state:menu-theme]
  - `.p-5`
  - `.mt-3`
- http://localhost:1411/settings/account [state:mode-sombre]
  - `.p-5`
  - `.mt-3`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:1411/settings/admin/oidc-clients/3654a746-35d4-4321-ac61-0bdcff2b4055
  - `.w-full:nth-child(1) > .cn-field-orientation-vertical.\[\&\>\*\]\:w-full.\[\&\>\.sr-only\]\:w-auto > div:nth-child(2) > div > .gap-y-2.flex-col.flex > .gap-x-2.flex > .text-\[13px\].md\:text-\[13px\][data-testid="callback-url-1"]`
  - `.w-full:nth-child(2) > .cn-field-orientation-vertical.\[\&\>\*\]\:w-full.\[\&\>\.sr-only\]\:w-auto > div:nth-child(2) > div > .gap-y-2.flex-col.flex > .gap-x-2.flex > .text-\[13px\].md\:text-\[13px\][data-testid="callback-url-1"]`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.13/nested-interactive?application=axeAPI

- http://localhost:1411/settings/account
  - `#bits-c14`
  - `#bits-c15`
- http://localhost:1411/settings/admin/users/f4b89dc2-62fb-46bf-9f5f-c34f4eafe93e
  - `#bits-c16`
- http://localhost:1411/settings/admin/application-configuration
  - `.md\:flex-row.md\:items-center.items-start:nth-child(6) > button`
- http://localhost:1411/settings/account [state:menu-compte]
  - `#bits-c14`
  - `#bits-c15`
- http://localhost:1411/settings/account [state:menu-theme]
  - `#bits-c14`
  - `#bits-c15`
- http://localhost:1411/settings/admin/users [state:form-ajout-utilisateur]
  - `#bits-c42`
- http://localhost:1411/settings/account [state:mode-sombre]
  - `#bits-c14`
  - `#bits-c15`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:1411/settings/account
  - `.text-balance`
- http://localhost:1411/settings/admin/api-keys
  - `.text-orange-300`
- http://localhost:1411/settings/account [state:menu-compte]
  - `.text-balance`
- http://localhost:1411/settings/account [state:menu-theme]
  - `.text-balance`
- http://localhost:1411/settings/admin/api-keys [state:form-cle-api]
  - `.text-orange-300`
- http://localhost:1411/settings/account [state:mode-sombre]
  - `.text-balance`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.13/link-in-text-block?application=axeAPI

- http://localhost:1411/settings/account [state:mode-sombre]
  - `.text-foreground`
- http://localhost:1411/settings/audit-log [state:nav-groupe-ouvert]
  - `.hover\:underline`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:1411/settings/account
  - `h1`
  - `.animate-fade-in.flex-col.items-center`
- http://localhost:1411/settings/apps
  - `.font-gloock`
  - `.animate-fade-in.flex-col.items-center`
- http://localhost:1411/settings/audit-log
  - `h1`
  - `.animate-fade-in.flex-col`
- http://localhost:1411/settings/audit-log/global
  - `h1`
  - `.animate-fade-in.flex-col`
- http://localhost:1411/settings/admin/users
  - `h1`
  - `.animate-fade-in.flex-col`
- http://localhost:1411/settings/admin/users/f4b89dc2-62fb-46bf-9f5f-c34f4eafe93e
  - `h1`
  - `.animate-fade-in.flex-col.items-center`
- http://localhost:1411/settings/admin/user-groups
  - `h1`
  - `.animate-fade-in.flex-col.flex`
- http://localhost:1411/settings/admin/user-groups/c7ae7c01-28a3-4f3c-9572-1ee734ea8368
  - `h1`
  - `.animate-fade-in.flex-col.flex`
- http://localhost:1411/settings/admin/apis
  - `h1`
  - `.animate-fade-in.flex-col.flex`
- http://localhost:1411/settings/admin/apis/f6a8b3c1-2d4e-4a6b-8c9d-0e1f2a3b4c5d
  - `h1`
  - `.animate-fade-in.flex-col.items-center`
- http://localhost:1411/settings/admin/api-keys
  - `h1`
  - `.animate-fade-in.flex-col`
- http://localhost:1411/settings/admin/oidc-clients
  - `h1`
  - `.animate-fade-in.flex-col`
- http://localhost:1411/settings/admin/oidc-clients/3654a746-35d4-4321-ac61-0bdcff2b4055
  - `h1`
  - `.animate-fade-in.flex-col.items-center`
- http://localhost:1411/settings/admin/application-configuration
  - `h1`
  - `.animate-fade-in.flex-col.items-center`
- http://localhost:1411/settings/account [state:menu-compte]
  - `h1`
  - `.animate-fade-in.flex-col.items-center`
  - `#bits-1`
- http://localhost:1411/settings/account [state:menu-theme]
  - `h1`
  - `.animate-fade-in.flex-col.items-center`
  - `#bits-1`
- http://localhost:1411/settings/admin/users [state:form-ajout-utilisateur]
  - `h1`
  - `.animate-fade-in.flex-col`
- http://localhost:1411/settings/admin/api-keys [state:form-cle-api]
  - `h1`
  - `.animate-fade-in.flex-col.flex`
- http://localhost:1411/settings/account [state:mode-sombre]
  - `h1`
  - `.animate-fade-in.flex-col.items-center`
- http://localhost:1411/settings/audit-log [state:nav-groupe-ouvert]
  - `h1`
  - `.flex-col.animate-fade-in`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://localhost:1411/settings/account
  - `h3`
- http://localhost:1411/settings/apps
  - `div[aria-label="Nextcloud"] > .group-data-\[size\=sm\]\/card\:px-4.p-0[data-slot="card-content"] > .gap-3.flex > .gap-3.justify-between.w-full > .h-20 > .mb-1.items-start.gap-2 > h3`
- http://localhost:1411/settings/admin/users/f4b89dc2-62fb-46bf-9f5f-c34f4eafe93e
  - `h3`
- http://localhost:1411/settings/account [state:menu-compte]
  - `h3`
- http://localhost:1411/settings/account [state:menu-theme]
  - `h3`
- http://localhost:1411/settings/account [state:mode-sombre]
  - `h3`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://localhost:1411/settings/admin/apis/f6a8b3c1-2d4e-4a6b-8c9d-0e1f2a3b4c5d
  - `th:nth-child(4)`

## Résultats incomplets à revoir (4)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:1411/settings/admin/oidc-clients/3654a746-35d4-4321-ac61-0bdcff2b4055
  - `.py-0\.5`

### duplicate-id-aria — IDs used in ARIA and labels must be unique

- http://localhost:1411/settings/admin/application-configuration
  - `#application-configuration-email > .bg-card.text-card-foreground.border-foreground\/5 > .px-6.group-data-\[size\=sm\]\/card\:px-4[data-slot="card-content"] > div > fieldset > .grid-cols-1.md\:grid-cols-2.mt-4 > .items-top.space-x-2.flex > .data-unchecked\:bg-input\/90.data-checked\:border-primary.group\/switch`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:1411/settings/account [state:menu-compte]
  - `#bits-c3`
- http://localhost:1411/settings/account [state:menu-theme]
  - `#bits-c2`

