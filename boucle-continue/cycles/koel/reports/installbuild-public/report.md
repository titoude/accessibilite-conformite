# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 5/5 scénario(s) audité(s), 0 erreur(s), 11 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `6dcc2de3e5ff`

## Résultats incomplets à revoir (11)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9048/#/home
  - `.py-3`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(5) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(5) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-added-albums"] > .mb-8.justify-between > h2`
- http://localhost:9048/#/404
  - `input[type="email"]`
  - `input[type="password"]`
  - `a`
- http://localhost:9048/#/reset-password/invalid-payload-seed49
  - `.py-3`
- http://localhost:9048/#/embed/01a11b8a-2fc5-7039-8086-526da3aebc04
  - `.py-3`

