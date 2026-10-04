# Audit accessibilité — 2026-10-04

**2 règle(s) violée(s), 6 occurrence(s), 1/1 scénario(s) audité(s), 0 erreur(s), 0 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `09e8b3cfc5ff`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8082/login
  - `.button`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8082/login
  - `.sr-only`
  - `img`
  - `form > h1`
  - `input[autofocus=""]`
  - `input[type="password"]`

