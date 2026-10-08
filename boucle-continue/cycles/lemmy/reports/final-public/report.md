# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 17/17 scénario(s) audité(s), 0 erreur(s), 20 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `6990c539daba`

## Résultats incomplets à revoir (20)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9655/
  - `#sort-select-NcUPE3q5l8ccIxSW7XSO`
- http://localhost:9655/communities
  - `#sort-select-xHWlzo5akMZLaVQkGOVT`
- http://localhost:9655/c/a11ybench
  - `#sort-select-UMvXLYJmCWz4JVHAcFUr`
- http://localhost:9655/u/bench_user1
  - `#sort-select-wRinoTt9DYn8lAc47hlZ`
- http://localhost:9655/u/lemmy
  - `#sort-select-JiSPB5P1Qy3V8KLRzl43`
- http://localhost:9655/modlog
  - `select`
  - `#filter-user`
- http://localhost:9655/search
  - `select[aria-label="Type"]`
  - `#sort-select-vN0j9HbpQX6nFYbs2afo`
  - `#community-filter`
  - `#creator-filter`
- http://localhost:9655/signup
  - `#register-username`
  - `#register-email`
  - `#register-password`
  - `#register-verify-password`
  - `#markdown-textarea-ihAQiVLjlJv7yO7f2wXj`
- http://localhost:9655/ [state:mobile-390]
  - `#sort-select-Bkl0SrPCUEkOmFUDc7e3`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9655/modlog
  - `#filter-user`
- http://localhost:9655/search
  - `#community-filter`
  - `#creator-filter`

