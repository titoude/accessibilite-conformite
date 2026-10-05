# Audit accessibilité — 2026-10-05

**3 règle(s) violée(s), 27 occurrence(s), 27/28 scénario(s) audité(s), 1 erreur(s), 37 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `0b56c7d1baf7`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-prohibited-attr?application=axeAPI

- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&sql=
  - `pre`
- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&event=
  - `pre`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&sql= [state:sql-erreur]
  - `.error`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&user=
  - `b:nth-child(2)`
  - `b:nth-child(3)`
  - `b:nth-child(4)`
  - `b:nth-child(7)`
  - `b:nth-child(8)`
  - `b:nth-child(9)`
  - `b:nth-child(12)`
  - `b:nth-child(13)`
  - `b:nth-child(14)`
  - `b:nth-child(17)`
  - … +14 autres

## Résultats incomplets à revoir (37)

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
- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&user=
  - `b:nth-child(2)`
  - `b:nth-child(3)`
  - `b:nth-child(7)`
  - `b:nth-child(12)`
  - `b:nth-child(17)`
  - `b:nth-child(22)`
  - `b:nth-child(27)`
  - `b:nth-child(32)`
  - `b:nth-child(37)`
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

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&trigger=
  - `pre`
- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&trigger=books&name=books_price_check
  - `pre`
- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&view=expensive_books
  - `pre`
- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&type=
  - `pre`
- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&sql= [state:sql-erreur]
  - `pre[contenteditable="true"]`

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:8080/adminer/?sqlite=&username=admin&db=/data/test.sqlite&sql= [state:sql-resultat] — page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('p.message') to be visible


