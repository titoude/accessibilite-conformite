# Audit accessibilité — 2026-10-05

**0 règle(s) violée(s), 0 occurrence(s), 11/11 scénario(s) audité(s), 0 erreur(s), 5 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `4b4c5c23b10f`

## Résultats incomplets à revoir (5)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8080/ [state:tooltip-resultat]
  - `.endpoint.transition.hover\:shadow-lg:nth-child(1) > .endpoint-content.pb-3.sm\:pb-4 > .space-y-2 > div > .mt-1.justify-between.text-xs > span:nth-child(2)`
  - `.items-start.gap-1.flex:nth-child(1) > .text-green-700.dark\:text-green-400`
  - `.items-start.gap-1.flex:nth-child(2) > .text-green-700.dark\:text-green-400`
- http://127.0.0.1:8080/ [state:menu-refresh]
  - `.mb-6 > .text-lg.text-foreground`
  - `span[title="api-tests"]`

