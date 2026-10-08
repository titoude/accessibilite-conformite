# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 8/8 scénario(s) audité(s), 0 erreur(s), 22 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `7ebeab5bbac9`

## Résultats incomplets à revoir (22)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9049/#/songs
  - `.focus\:text-k-highlight`
- http://localhost:9049/#/songs [state:song-context-menu]
  - `button[data-variant="success"]`
  - `.focus\:text-k-highlight`
- http://localhost:9049/#/songs [state:player-playing]
  - `button[data-variant="success"]`
  - `.focus\:text-k-highlight`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9049/#/songs
  - `.py-3`
- http://localhost:9049/#/home [state:profile-menu]
  - `.py-3`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(5) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(5) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-added-albums"] > .mb-8.justify-between > h2`
- http://localhost:9049/#/songs [state:song-context-menu]
  - `.py-3`
- http://localhost:9049/#/songs [state:player-playing]
  - `.py-3`
- http://localhost:9049/#/songs [state:equalizer-open]
  - `#eq-band-v-3-3-1`
  - `#eq-band-v-3-3-2`
  - `#eq-band-v-3-3-3`
  - `#eq-band-v-3-3-4`
  - `#eq-band-v-3-3-5`
  - `#eq-band-v-3-3-6`
  - `#eq-band-v-3-3-7`
  - `#eq-band-v-3-3-8`

