# Audit accessibilité — 2026-10-07

**4 règle(s) violée(s), 22 occurrence(s), 3/3 scénario(s) audité(s), 0 erreur(s), 7 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `732fadb25260`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:3000/signin
  - `html`
- http://localhost:3000/signup
  - `html`
- http://localhost:3000/forgot-password
  - `html`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.14/meta-viewport?application=axeAPI

- http://localhost:3000/signin
  - `meta[name="viewport"]`
- http://localhost:3000/signup
  - `meta[name="viewport"]`
- http://localhost:3000/forgot-password
  - `meta[name="viewport"]`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:3000/signin
  - `html`
- http://localhost:3000/signup
  - `html`
- http://localhost:3000/forgot-password
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:3000/signin
  - `.flex-col`
  - `.space-y-2:nth-child(1)`
  - `.space-y-2:nth-child(2)`
  - `form > .text-center`
  - `.space-y-6 > .text-center`
- http://localhost:3000/signup
  - `.flex-col`
  - `.space-y-2:nth-child(1)`
  - `.space-y-2:nth-child(2)`
  - `.space-y-2:nth-child(3)`
  - `.space-y-2:nth-child(4)`
  - `.pt-0 > .text-center`
- http://localhost:3000/forgot-password
  - `.flex-col`
  - `.space-y-2`

## Résultats incomplets à revoir (7)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:3000/signin
  - `#_R_2daav5tjb_-form-item`
  - `#_R_3daav5tjb_-form-item`
- http://localhost:3000/signup
  - `#_R_4qav5tjb_-form-item`
  - `#_R_6qav5tjb_-form-item`
  - `#_R_8qav5tjb_-form-item`
  - `#_R_aqav5tjb_-form-item`
- http://localhost:3000/forgot-password
  - `#_R_4qav5tjb_-form-item`

