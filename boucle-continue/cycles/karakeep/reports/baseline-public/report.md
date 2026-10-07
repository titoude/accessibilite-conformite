# Audit accessibilité — 2026-10-07

**6 règle(s) violée(s), 38 occurrence(s), 7/7 scénario(s) audité(s), 0 erreur(s), 12 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `dace901723bc`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:3301/verify-email
  - `.\[\&_p\]\:leading-relaxed`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:3301/public/lists/u3vj1bynb1l958g65bkc6ka0
  - `.whitespace-nowrap`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.14/meta-viewport?application=axeAPI

- http://localhost:3301/signin
  - `meta[name="viewport"]`
- http://localhost:3301/signup
  - `meta[name="viewport"]`
- http://localhost:3301/forgot-password
  - `meta[name="viewport"]`
- http://localhost:3301/check-email?email=audit.c35%40example.com
  - `meta[name="viewport"]`
- http://localhost:3301/verify-email
  - `meta[name="viewport"]`
- http://localhost:3301/invite/token-inexistant-c35
  - `meta[name="viewport"]`
- http://localhost:3301/public/lists/u3vj1bynb1l958g65bkc6ka0
  - `meta[name="viewport"]`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:3301/signin
  - `html`
- http://localhost:3301/signup
  - `html`
- http://localhost:3301/forgot-password
  - `html`
- http://localhost:3301/check-email?email=audit.c35%40example.com
  - `html`
- http://localhost:3301/verify-email
  - `html`
- http://localhost:3301/invite/token-inexistant-c35
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:3301/signin
  - `html`
- http://localhost:3301/signup
  - `html`
- http://localhost:3301/forgot-password
  - `html`
- http://localhost:3301/check-email?email=audit.c35%40example.com
  - `html`
- http://localhost:3301/verify-email
  - `html`
- http://localhost:3301/invite/token-inexistant-c35
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:3301/signin
  - `.flex-col`
  - `.space-y-2:nth-child(1)`
  - `.space-y-2:nth-child(2)`
  - `form > .text-center`
  - `.space-y-6 > .text-center`
- http://localhost:3301/signup
  - `.flex-col`
  - `.space-y-2:nth-child(1)`
  - `.space-y-2:nth-child(2)`
  - `.space-y-2:nth-child(3)`
  - `.space-y-2:nth-child(4)`
  - `.pt-0 > .text-center`
- http://localhost:3301/forgot-password
  - `.flex-col`
  - `.space-y-2`
- http://localhost:3301/check-email?email=audit.c35%40example.com
  - `.flex-col`
  - `.space-y-2.text-center`
- http://localhost:3301/verify-email
  - `.flex-col`
- http://localhost:3301/invite/token-inexistant-c35
  - `.flex-col`

## Résultats incomplets à revoir (12)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:3301/signin
  - `#_R_2daav5tjb_-form-item`
  - `#_R_3daav5tjb_-form-item`
- http://localhost:3301/signup
  - `#_R_4qav5tjb_-form-item`
  - `#_R_6qav5tjb_-form-item`
  - `#_R_8qav5tjb_-form-item`
  - `#_R_aqav5tjb_-form-item`
- http://localhost:3301/forgot-password
  - `#_R_4qav5tjb_-form-item`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3301/public/lists/u3vj1bynb1l958g65bkc6ka0
  - `h1`
  - `.leading-relaxed`
  - `.text-sm.text-muted-foreground`
  - `.gap-3.md\:justify-end.flex > div:nth-child(2) > .text-foreground`
  - `.uppercase > span`

