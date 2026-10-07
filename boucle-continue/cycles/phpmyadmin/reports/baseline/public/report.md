# Audit accessibilité — 2026-10-07

**2 règle(s) violée(s), 18 occurrence(s), 3/3 scénario(s) audité(s), 0 erreur(s), 3 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `c1663cbe500a`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:8090/public/index.php?route=/
  - `html`
- http://localhost:8090/public/index.php?route=/themes
  - `html`
- http://localhost:8090/public/index.php?route=/ [state:login-failed]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8090/public/index.php?route=/
  - `.logo`
  - `h1`
  - `.card-header`
  - `.mb-3`
  - `.row:nth-child(2)`
- http://localhost:8090/public/index.php?route=/themes
  - `.logo`
  - `h1`
  - `.card-header`
  - `.mb-3`
  - `.row:nth-child(2)`
- http://localhost:8090/public/index.php?route=/ [state:login-failed]
  - `.logo`
  - `h1`
  - `.card-header`
  - `.mb-3`
  - `.row:nth-child(2)`

## Résultats incomplets à revoir (3)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8090/public/index.php?route=/
  - `#input_go`
- http://localhost:8090/public/index.php?route=/themes
  - `#input_go`
- http://localhost:8090/public/index.php?route=/ [state:login-failed]
  - `#input_go`

