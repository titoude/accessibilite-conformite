# Audit accessibilité — 2026-10-04

**4 règle(s) violée(s), 7 occurrence(s), 1/1 scénario(s) audité(s), 0 erreur(s), 7 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `5be53f84eb7e`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://127.0.0.1:8089/app/#/login
  - `input[name="username"]`
  - `input[name="password"]`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://127.0.0.1:8089/app/#/login
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://127.0.0.1:8089/app/#/login
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://127.0.0.1:8089/app/#/login
  - `.jss3`
  - `.jss5`
  - `.jss7`

## Résultats incomplets à revoir (7)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### bypass — Page must have means to bypass repeated blocks

- http://127.0.0.1:8089/app/#/login
  - `html`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8089/app/#/login
  - `a`
  - `.MuiInputLabel-shrink`
  - `input[name="username"]`
  - `label[data-shrink="false"]`
  - `input[name="password"]`
  - `.MuiButton-label`

