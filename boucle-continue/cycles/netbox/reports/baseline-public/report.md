# Audit accessibilité — 2026-10-08

**4 règle(s) violée(s), 8 occurrence(s), 1/1 scénario(s) audité(s), 0 erreur(s), 0 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `ffc903112e52`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9300/login/
  - `button`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:9300/login/
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9300/login/
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9300/login/
  - `.hide-theme-dark`
  - `.netbox-edition`
  - `h2`
  - `.mb-3`
  - `.form-group:nth-child(3)`

