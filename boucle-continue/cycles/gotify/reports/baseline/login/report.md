# Audit accessibilité — 2026-10-04

**4 règle(s) violée(s), 4 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 9 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `a560a4719efe`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-main-is-top-level?application=axeAPI

- http://127.0.0.1:8095/#/login
  - `.css-1dyj36-content > main`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-no-duplicate-main?application=axeAPI

- http://127.0.0.1:8095/#/login
  - `.css-1dyj36-content`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://127.0.0.1:8095/#/login
  - `.css-1dyj36-content`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://127.0.0.1:8095/#/login
  - `html`

## Résultats incomplets à revoir (9)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8095/#/login
  - `#username`
  - `#password`
- http://127.0.0.1:8095/#/login [state:register-dialog]
  - `#register`
  - `#username`
  - `#password`
  - `#register-username`
  - `#register-password`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://127.0.0.1:8095/#/login [state:register-dialog]
  - `#root`

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://127.0.0.1:8095/#/login [state:register-dialog]
  - `div[aria-label="username is required"]`

