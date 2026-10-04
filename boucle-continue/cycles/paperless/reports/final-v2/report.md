# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 17/17 scénario(s) audité(s), 0 erreur(s), 205 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `95f9c7ad194a`

## Résultats incomplets à revoir (205)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8085/dashboard
  - `.alert-heading`
  - `.bg-secondary`
- http://127.0.0.1:8085/attributes/tags
  - `#managementPageSize`
- http://127.0.0.1:8085/attributes/correspondents
  - `#managementPageSize`
- http://127.0.0.1:8085/attributes/documenttypes
  - `#managementPageSize`
- http://127.0.0.1:8085/settings
  - `#displayLanguage`
  - `#dateLocale`
  - `#searchLink`
- http://127.0.0.1:8085/logs
  - `.log-entry-20.m-0:nth-child(1)`
  - `.log-entry-20.m-0:nth-child(2)`
  - `.log-entry-40.m-0:nth-child(3)`
  - `.log-entry-20.m-0:nth-child(4)`
  - `.log-entry-20.m-0:nth-child(5)`
  - `.log-entry-20.m-0:nth-child(6)`
  - `.log-entry-20.m-0:nth-child(8)`
  - `.log-entry-20.m-0:nth-child(9)`
  - `.log-entry-20.m-0:nth-child(11)`
  - `.log-entry-20.m-0:nth-child(12)`
  - … +178 autres
- http://127.0.0.1:8085/dashboard [state:userMenu]
  - `.alert-heading`
  - `.text-primary[_ngcontent-ng-c3622680002=""]:nth-child(2)`
  - `.smaller`
  - `.bg-secondary`
- http://127.0.0.1:8085/documents [state:tagsDropdown]
  - `.align-items-center.d-flex[_ngcontent-ng-c3172252159=""] > span`

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://127.0.0.1:8085/attributes/tags
  - `table`
- http://127.0.0.1:8085/attributes/correspondents
  - `table`
- http://127.0.0.1:8085/attributes/documenttypes
  - `table`
- http://127.0.0.1:8085/trash
  - `table`

