# Audit accessibilité — 2026-10-08

**7 règle(s) violée(s), 26 occurrence(s), 14/14 scénario(s) audité(s), 0 erreur(s), 57 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `3d953a706d0d`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:9400/signup
  - `.inset-0`
- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ
  - `.inset-0`
- http://localhost:9400/sign/y84UN64ySoZsv5fXc_tMw
  - `.inset-0`
- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-field-dialog]
  - `.placeholder\:text-muted-foreground`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9400/signin
  - `.rounded-xl > .mt-2`
  - `a[href$="forgot-password"]`
  - `.mt-6`
  - `.text-documenso-700`
- http://localhost:9400/signup
  - `.mt-2`
  - `fieldset > .mt-4`
  - `a`
- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-reject-dialog]
  - `.bg-destructive`
- http://localhost:9400/signin [state:mobile-signin-390]
  - `.rounded-xl > .mt-2`
  - `a[href$="forgot-password"]`
  - `.mt-6`
  - `.text-documenso-700`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.14/link-in-text-block?application=axeAPI

- http://localhost:9400/signin
  - `.text-documenso-700`
- http://localhost:9400/signup
  - `a`
- http://localhost:9400/signin [state:mobile-signin-390]
  - `.text-documenso-700`
- http://localhost:9400/signin [state:dark-signin]
  - `.text-documenso-700`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ
  - `.md\:w-auto > a`
- http://localhost:9400/sign/y84UN64ySoZsv5fXc_tMw
  - `.md\:w-auto > a`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-dialog-name?application=axeAPI

- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-field-dialog]
  - `#radix-_R_1qpj9kj5_`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/label-title-only?application=axeAPI

- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-reject-dialog]
  - `#_r_0_-form-item`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ
  - `h3`
- http://localhost:9400/sign/y84UN64ySoZsv5fXc_tMw
  - `h3`

## Résultats incomplets à revoir (57)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9400/signin
  - `#_R_9dij5_-form-item`
  - `#_R_hdij5_-form-item`
- http://localhost:9400/signup
  - `#_R_15eij5_-form-item`
  - `#_R_25eij5_-form-item`
  - `#_R_35eij5_-form-item`
- http://localhost:9400/forgot-password
  - `#_R_bij5_-form-item`
- http://localhost:9400/unverified-account
  - `#_R_1iij5_-form-item`
- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-reject-dialog]
  - `#_r_0_-form-item`
- http://localhost:9400/signin [state:mobile-signin-390]
  - `#_R_9dij5_-form-item`
  - `#_R_hdij5_-form-item`
- http://localhost:9400/signin [state:dark-signin]
  - `#_R_9dij5_-form-item`
  - `#_R_hdij5_-form-item`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9400/forgot-password
  - `h1`
  - `.mt-2`
  - `label`
  - `.mt-6`
  - `a`
- http://localhost:9400/reset-password
  - `h1`
  - `p`
- http://localhost:9400/check-email
  - `h1`
  - `p`
- http://localhost:9400/unverified-account
  - `h2`
  - `p:nth-child(2)`
  - `p:nth-child(3)`
  - `label`
- http://localhost:9400/verify-email
  - `h2`
  - `p`
- http://localhost:9400/articles/signature-disclosure
  - `p:nth-child(5)`
  - `h2:nth-child(6)`
  - `p:nth-child(7)`
  - `h2:nth-child(8)`
  - `p:nth-child(9)`
  - `li:nth-child(1)`
  - `li:nth-child(2)`
  - `li:nth-child(3)`
  - `li:nth-child(4)`
  - `h2:nth-child(11)`
  - … +10 autres
- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-field-dialog]
  - `.text-\[0\.688rem\].text-muted-foreground.items-center`
  - `.hover\:text-muted-foreground`

### link-in-text-block — Links must be distinguishable without relying on color

- http://localhost:9400/forgot-password
  - `a`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-field-dialog]
  - `span[data-radix-focus-guard=""]:nth-child(1)`
  - `.min-h-screen[data-aria-hidden="true"][aria-hidden="true"]`
  - `span[data-radix-focus-guard=""]:nth-child(11)`
- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-reject-dialog]
  - `span[data-radix-focus-guard=""]:nth-child(1)`
  - `.min-h-screen[data-aria-hidden="true"][aria-hidden="true"]`
  - `span[data-radix-focus-guard=""]:nth-child(11)`

### bypass — Page must have means to bypass repeated blocks

- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-field-dialog]
  - `html`

