# Audit accessibilité — 2026-10-05

**0 règle(s) violée(s), 0 occurrence(s), 10/10 scénario(s) audité(s), 0 erreur(s), 5 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `0c6375f2204c`

## Résultats incomplets à revoir (5)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8081/signin/
  - `.scaling-btn > .gap-2.items-center`
- http://localhost:8081/signup
  - `.scaling-btn > .gap-2`
- http://localhost:8081/forgot-password/
  - `.scaling-btn > .gap-2`
- http://localhost:8081/signin/ [state:signin-error]
  - `.scaling-btn > .gap-2`
- http://localhost:8081/signup [state:signup-error]
  - `.scaling-btn > .gap-2`

