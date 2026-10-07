# Audit accessibilité — 2026-10-07

**8 règle(s) violée(s), 15 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 2 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `8bf040e7dca7`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://127.0.0.1:8038/login
  - `.active`
  - `label[for="password"]`
  - `span`
  - `.btn`
  - `a`
  - `form[action="/locale/de"] > .btn-link`
  - `form[action="/locale/en"] > .btn-link`
  - `form[action="/locale/fr"] > .btn-link`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.14/html-has-lang?application=axeAPI

- http://127.0.0.1:8038/share/0af38edc9ca4c9157176453
  - `html`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-main-is-top-level?application=axeAPI

- http://127.0.0.1:8038/login
  - `.valign-wrapper`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://127.0.0.1:8038/login
  - `#main > main`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://127.0.0.1:8038/login
  - `#main > main`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://127.0.0.1:8038/login
  - `html`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://127.0.0.1:8038/share/0af38edc9ca4c9157176453
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://127.0.0.1:8038/share/0af38edc9ca4c9157176453
  - `article`

## Résultats incomplets à revoir (2)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8038/login
  - `#username`
  - `#password`

