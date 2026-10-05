# Audit accessibilité — 2026-10-05

**1 règle(s) violée(s), 1 occurrence(s), 27/28 scénario(s) audité(s), 1 erreur(s), 23 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `0b56c7d1baf7`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-input-field-name?application=axeAPI

- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&check=books
  - `pre`

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

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&sql= [state:sql-resultat] — page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('p.message') to be visible


