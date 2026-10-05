# Audit accessibilité — 2026-10-05

**0 règle(s) violée(s), 0 occurrence(s), 28/28 scénario(s) audité(s), 0 erreur(s), 23 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `0b56c7d1baf7`

## Résultats incomplets à revoir (23)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite
  - `table`
- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite [state:menu-mobile-ouvert]
  - `table`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&edit=books&where[id]=1
  - `.jush-sqlite_apo`
- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&sql=
  - `.jush-autocomplete`
- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite [state:menu-mobile-ouvert]
  - `h2`
  - `#content > .links > a:nth-child(1)`
  - `#content > .links > a:nth-child(2)`
  - `#tables-views`
  - `#label-search-data`
  - `#selected2`
  - `select[name="op"]`
  - `input[type="search"]`
  - `input[name="search"]`
  - `thead > tr > .sticky > a`
  - … +9 autres

