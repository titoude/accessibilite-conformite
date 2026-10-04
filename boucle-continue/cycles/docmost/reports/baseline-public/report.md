# Audit accessibilité — 2026-10-04

**2 règle(s) violée(s), 3 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 2 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `2e80fc256765`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://127.0.0.1:5175/login
  - `._logo_1hztj_1`
- http://127.0.0.1:5175/forgot-password
  - `._logo_1hztj_1`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://127.0.0.1:5175/forgot-password
  - `html`

## Résultats incomplets à revoir (2)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:5175/login
  - `p`
- http://127.0.0.1:5175/forgot-password
  - `p`

