# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 17/17 scénario(s) audité(s), 0 erreur(s), 17 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `95f9c7ad194a`

## Résultats incomplets à revoir (17)

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

### aria-required-children — Certain ARIA roles must contain particular children

- http://127.0.0.1:8085/logs
  - `.nav-tabs`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://127.0.0.1:8085/logs
  - `#ngb-nav-0-panel`

