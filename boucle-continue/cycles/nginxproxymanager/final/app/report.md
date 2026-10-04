# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 13/13 scénario(s) audité(s), 0 erreur(s), 182 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `9c0e5f65b4e5`

## Résultats incomplets à revoir (182)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:5173/logs
  - `select[aria-label="Source"]`
  - `select[aria-label="Level"]`
  - `select[aria-label="Lines"]`
  - `.text-danger._logLine_3w094_13:nth-child(1)`
  - `._logLine_3w094_13:nth-child(2)`
  - `.text-danger._logLine_3w094_13:nth-child(3)`
  - `._logLine_3w094_13:nth-child(4)`
  - `.text-danger._logLine_3w094_13:nth-child(5)`
  - `._logLine_3w094_13:nth-child(6)`
  - `.text-danger._logLine_3w094_13:nth-child(7)`
  - … +169 autres
- http://localhost:5173/nginx/proxy [state:add-host-modal]
  - `#react-select-3-placeholder`
  - `.mb-3:nth-child(3) > .react-select-container.css-b62m3t-container > .react-select__control.css-13cymwt-control > .react-select__value-container--has-value.react-select__value-container.css-hlgwow > .react-select__single-value.css-1dimb5e-singleValue`
- http://localhost:5173/ [state:user-menu]
  - `span[data-translation-id="dead-hosts.count"]`

