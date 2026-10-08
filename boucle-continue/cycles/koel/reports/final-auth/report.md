# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 23/23 scénario(s) audité(s), 0 erreur(s), 68 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `505f80723dfa`

## Résultats incomplets à revoir (68)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9049/#/home
  - `.py-3`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(5) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(5) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-added-albums"] > .mb-8.justify-between > h2`
- http://localhost:9049/#/queue
  - `.py-3`
- http://localhost:9049/#/songs
  - `.py-3`
- http://localhost:9049/#/albums
  - `.py-3`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(1) > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2.whitespace-nowrap > .gap-2.items-center.flex > .font-medium[data-testid="name"]`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(1) > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2.whitespace-nowrap > .space-x-2 > a`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(1) > .full.p-5.rounded-\[inherit\] > footer > p > a[role="button"]:nth-child(1)`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(1) > .full.p-5.rounded-\[inherit\] > footer > p > a[role="button"]:nth-child(3)`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(2) > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2.whitespace-nowrap > .gap-2.items-center.flex > .font-medium[data-testid="name"]`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(2) > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2.whitespace-nowrap > .space-x-2 > a`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(2) > .full.p-5.rounded-\[inherit\] > footer > p > a[role="button"]:nth-child(1)`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(2) > .full.p-5.rounded-\[inherit\] > footer > p > a[role="button"]:nth-child(3)`
  - `div[title="Evenings Deep by Koel Rivers"] > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2.whitespace-nowrap > .gap-2.items-center.flex > .font-medium[data-testid="name"]`
  - … +3 autres
- http://localhost:9049/#/artists
  - `.py-3`
  - `div[title="Blue Transistors"] > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2[data-v-2c4978d0=""] > .font-medium[data-testid="name"]`
  - `div[title="Blue Transistors"] > .full.p-5.rounded-\[inherit\] > footer > p > a[role="button"]:nth-child(1)`
  - `div[title="Blue Transistors"] > .full.p-5.rounded-\[inherit\] > footer > p > a[role="button"]:nth-child(3)`
  - `div[title="Koel Rivers"] > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2[data-v-2c4978d0=""] > .font-medium[data-testid="name"]`
  - `div[title="Koel Rivers"] > .full.p-5.rounded-\[inherit\] > footer > p > a[role="button"]:nth-child(1)`
  - `div[title="Koel Rivers"] > .full.p-5.rounded-\[inherit\] > footer > p > a[role="button"]:nth-child(3)`
  - `div[title="Velvet Meridian"] > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2[data-v-2c4978d0=""] > .font-medium[data-testid="name"]`
  - `div[title="Velvet Meridian"] > .full.p-5.rounded-\[inherit\] > footer > p > a[role="button"]:nth-child(1)`
  - `div[title="Velvet Meridian"] > .full.p-5.rounded-\[inherit\] > footer > p > a[role="button"]:nth-child(3)`
- http://localhost:9049/#/genres
  - `.py-3`
  - `.font-normal`
  - `.text-lg.text-k-fg-70`
- http://localhost:9049/#/genres/Ambient
  - `.mt-2`
  - `button[name="ok"]`
- http://localhost:9049/#/albums/01m4db5ex9dphwzek04j5z49r3
  - `.py-3`
- http://localhost:9049/#/artists/01m4db5ersmhdr87tf7g2mf34v
  - `.py-3`
- http://localhost:9049/#/playlists/01a11ab3-63eb-714e-8e60-27328c33148e
  - `.py-3`
- http://localhost:9049/#/favorites
  - `.py-3`
- http://localhost:9049/#/recently-played
  - `.py-3`
- http://localhost:9049/#/search
  - `.py-3`
- http://localhost:9049/#/settings
  - `.text-white\/80`
- http://localhost:9049/#/users
  - `.py-3`
  - `h2 > .name`
  - `.gap-1.justify-between.flex-col > p`
  - `a[data-size="small"]`
- http://localhost:9049/#/profile
  - `.text-white\/80`
- http://localhost:9049/#/upload
  - `.py-3`
- http://localhost:9049/#/youtube
  - `.py-3`
- http://localhost:9049/#/radio/stations
  - `.py-3`
- http://localhost:9049/#/podcasts
  - `.py-3`
- http://localhost:9049/#/browse
  - `.py-3`
- http://localhost:9049/#/offline-songs
  - `.py-3`
- http://localhost:9049/#/visualizer
  - `.py-3`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9049/#/queue
  - `.focus\:text-k-highlight`
- http://localhost:9049/#/songs
  - `.focus\:text-k-highlight`
- http://localhost:9049/#/albums
  - `.focus\:text-k-fg`
- http://localhost:9049/#/artists
  - `.focus\:text-k-fg`
- http://localhost:9049/#/genres
  - `.focus\:text-k-fg`
- http://localhost:9049/#/albums/01m4db5ex9dphwzek04j5z49r3
  - `.focus\:text-k-highlight`
- http://localhost:9049/#/artists/01m4db5ersmhdr87tf7g2mf34v
  - `.focus\:text-k-highlight`
- http://localhost:9049/#/playlists/01a11ab3-63eb-714e-8e60-27328c33148e
  - `.focus\:text-k-highlight`
- http://localhost:9049/#/recently-played
  - `.focus\:text-k-highlight`
- http://localhost:9049/#/radio/stations
  - `.focus\:text-k-fg`
- http://localhost:9049/#/podcasts
  - `.focus\:text-k-fg`

### aria-allowed-role — ARIA role should be appropriate for the element

- http://localhost:9049/#/genres/Ambient
  - `.skeleton`

### link-in-text-block — Links must be distinguishable without relying on color

- http://localhost:9049/#/albums/01m4db5ex9dphwzek04j5z49r3
  - `.leading-loose > .artist`

