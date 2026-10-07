# Audit accessibilité — 2026-10-07

**4 règle(s) violée(s), 13 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 2 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `9da0c44ce847`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.10/image-alt?application=axeAPI

- http://localhost:11334/auth
  - `img`
- http://localhost:11334/auth [state:login-failed]
  - `img`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=axeAPI

- http://localhost:11334/auth [state:login-failed]
  - `.inline-flex`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.10/landmark-one-main?application=axeAPI

- http://localhost:11334/auth
  - `html`
- http://localhost:11334/auth [state:login-failed]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.10/region?application=axeAPI

- http://localhost:11334/auth
  - `.px-2`
  - `.grid.gap-2.w-full:nth-child(1)`
  - `label[for="password"]`
  - `#password`
- http://localhost:11334/auth [state:login-failed]
  - `.px-2`
  - `.grid.gap-2.w-full:nth-child(1)`
  - `label[for="password"]`
  - `#password`

## Résultats incomplets à revoir (2)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:11334/auth
  - `h1`
- http://localhost:11334/auth [state:login-failed]
  - `h1`

