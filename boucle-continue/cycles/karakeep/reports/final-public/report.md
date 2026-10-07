# Audit accessibilité — 2026-10-07

**0 règle(s) violée(s), 0 occurrence(s), 7/7 scénario(s) audité(s), 0 erreur(s), 12 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `e0a5ebaa4919`

## Résultats incomplets à revoir (12)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:3300/signin
  - `#_R_2dbav5tjb_-form-item`
  - `#_R_3dbav5tjb_-form-item`
- http://localhost:3300/signup
  - `#_R_4rav5tjb_-form-item`
  - `#_R_6rav5tjb_-form-item`
  - `#_R_8rav5tjb_-form-item`
  - `#_R_arav5tjb_-form-item`
- http://localhost:3300/forgot-password
  - `#_R_4rav5tjb_-form-item`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3300/public/lists/kuz9xs5ixnvcio1zv43f9d1d
  - `h1`
  - `.leading-relaxed`
  - `.text-sm.text-muted-foreground`
  - `.gap-3.md\:justify-end.flex > div:nth-child(2) > .text-foreground`
  - `.uppercase > span`

