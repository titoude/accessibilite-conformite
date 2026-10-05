# Audit accessibilité — 2026-10-05

**0 règle(s) violée(s), 0 occurrence(s), 22/22 scénario(s) audité(s), 0 erreur(s), 7 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d806ce2b9dd8`

## Résultats incomplets à revoir (7)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://localhost:8081/wr23v8q3/pkfhnj2zuc1fhle?settings=members
  - `.nc-table-header-table`
- http://localhost:8081/admin/?tab=workspaces
  - `.nc-table-header-table`
- http://localhost:8081/admin/?tab=users-list
  - `.nc-table-header-table`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8081/wr23v8q3/pkfhnj2zuc1fhle [state:create-new-menu]
  - `span[data-testid="nc-tbl-title-Items"]`
- http://localhost:8081/wr23v8q3/pkfhnj2zuc1fhle/m48exzsl6itizh8/vwaeblf44ozgxrgt/items-items [state:user-menu]
  - `.prose-sm`
  - `.py-1 > span`
  - `ul > a[href$="profile"] > .ant-dropdown-menu-title-content > .nc-menu-item-inner[data-v-3ae7bfa1=""] > .flex-col.flex-1[data-v-3ae7bfa1=""] > .text-bodySm.max-w-68.truncate`

