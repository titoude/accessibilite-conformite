# Audit accessibilité — 2026-10-04

**3 règle(s) violée(s), 5 occurrence(s), 1/1 scénario(s) audité(s), 0 erreur(s), 1 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `49e44f184b4e`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=axeAPI

- http://localhost:8083/login
  - `html`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:8083/login
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8083/login
  - `h1`
  - `input[type="text"]`
  - `input[type="password"]`

## Résultats incomplets à revoir (1)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8083/login
  - `button`

