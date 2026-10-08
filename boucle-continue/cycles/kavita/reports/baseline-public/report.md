# Audit accessibilité — 2026-10-08

**2 règle(s) violée(s), 4 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 12 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `9a91866ba46e`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:7500/login
  - `html`
- http://localhost:7500/registration
  - `html`

## [MINOR] aria-allowed-role — ARIA role should be appropriate for the element

Ensure role attribute has an appropriate value for the element
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-role?application=axeAPI

- http://localhost:7500/login
  - `html`
- http://localhost:7500/registration
  - `html`

## Résultats incomplets à revoir (12)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7500/login
  - `.justify-content-center[_ngcontent-ng-c1737091490=""] > h2`
  - `.card-title > h2`
  - `#username`
  - `#password`
  - `a[routerlink="/registration/reset-password"]`
  - `button`
- http://localhost:7500/registration
  - `.justify-content-center[_ngcontent-ng-c1737091490=""] > h2`
  - `.card-title > h2`
  - `#username`
  - `#password`
  - `a[routerlink="/registration/reset-password"]`
  - `button`

