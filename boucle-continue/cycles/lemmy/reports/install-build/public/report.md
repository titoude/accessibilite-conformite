# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 17/17 scénario(s) audité(s), 0 erreur(s), 20 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `b23338568b80`

## Résultats incomplets à revoir (20)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9665/
  - `#sort-select-Zk1XGe43GC4EnheUJkWS`
- http://localhost:9665/communities
  - `#sort-select-hgW2oozzmfXjx8R8F1yq`
- http://localhost:9665/c/a11ybench
  - `#sort-select-P10FNm9J23ckCtOrZmER`
- http://localhost:9665/u/bench_user1
  - `#sort-select-S7iV7kCSY59YiPxAhw4p`
- http://localhost:9665/u/lemmy
  - `#sort-select-1QEfnPPR0yGa3e6Y13rV`
- http://localhost:9665/modlog
  - `select`
  - `#filter-user`
- http://localhost:9665/search
  - `select[aria-label="Type"]`
  - `#sort-select-dUb5VC1GjkDsKyUQ6TXQ`
  - `#community-filter`
  - `#creator-filter`
- http://localhost:9665/signup
  - `#register-username`
  - `#register-email`
  - `#register-password`
  - `#register-verify-password`
  - `#markdown-textarea-ufteqELNkz0RqAjJvzOv`
- http://localhost:9665/ [state:mobile-390]
  - `#sort-select-d4UI5pHpG93vRPtpX6qG`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9665/modlog
  - `#filter-user`
- http://localhost:9665/search
  - `#community-filter`
  - `#creator-filter`

