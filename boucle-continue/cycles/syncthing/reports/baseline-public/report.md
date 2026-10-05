# Audit accessibilité — 2026-10-05

**3 règle(s) violée(s), 6 occurrence(s), 1/1 scénario(s) audité(s), 0 erreur(s), 2 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `1bbb359aae31`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://127.0.0.1:8384/
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://127.0.0.1:8384/
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://127.0.0.1:8384/
  - `h3`
  - `form[ng-submit="authenticatePassword()"] > .form-group:nth-child(1)`
  - `form[ng-submit="authenticatePassword()"] > .form-group:nth-child(2)`
  - `form[ng-submit="authenticatePassword()"] > .form-group:nth-child(3)`

## Résultats incomplets à revoir (2)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### duplicate-id-aria — IDs used in ARIA and labels must be unique

- http://127.0.0.1:8384/
  - `input[ng-model="login.username"]`
  - `input[ng-model="login.password"]`

