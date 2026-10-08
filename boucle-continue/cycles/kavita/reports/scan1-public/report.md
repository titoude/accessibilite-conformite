# Audit accessibilité — 2026-10-08

**2 règle(s) violée(s), 18 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 12 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `9a91866ba46e`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:7500/login
  - `html`
- http://localhost:7500/registration
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:7500/login
  - `h1`
  - `.justify-content-center[_ngcontent-ng-c1737091490=""] > h2`
  - `span`
  - `label[for="username"]`
  - `#username`
  - `label[for="password"]`
  - `#password`
  - `.forgot-password`
- http://localhost:7500/registration
  - `h1`
  - `.justify-content-center[_ngcontent-ng-c1737091490=""] > h2`
  - `span`
  - `label[for="username"]`
  - `#username`
  - `label[for="password"]`
  - `#password`
  - `.forgot-password`

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

