# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 14/14 scénario(s) audité(s), 0 erreur(s), 43 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `3d953a706d0d`

## Résultats incomplets à revoir (43)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

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
- http://localhost:9400/check-email
  - `h1`
  - `p`
- http://localhost:9400/forgot-password
  - `h1`
  - `.mt-2`
  - `label`
  - `.mt-6`
  - `a`
- http://localhost:9400/reset-password
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
- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-field-dialog]
  - `.text-\[0\.688rem\].text-muted-foreground.items-center`
  - `.hover\:text-muted-foreground`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-field-dialog]
  - `span[data-radix-focus-guard=""]:nth-child(1)`
  - `.min-h-screen[data-aria-hidden="true"][aria-hidden="true"]`
  - `span[data-radix-focus-guard=""]:nth-child(11)`
- http://localhost:9400/sign/zAIfwzfZQjF364bEggEiZ [state:sign-reject-dialog]
  - `span[data-radix-focus-guard=""]:nth-child(1)`
  - `.min-h-screen[data-aria-hidden="true"][aria-hidden="true"]`
  - `span[data-radix-focus-guard=""]:nth-child(11)`

