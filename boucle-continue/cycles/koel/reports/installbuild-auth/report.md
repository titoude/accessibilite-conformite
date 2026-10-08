# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 20/23 scénario(s) audité(s), 3 erreur(s), 60 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `179d3e6d53b5`

## Résultats incomplets à revoir (60)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9048/#/home
  - `.py-3`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(5) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(5) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-added-albums"] > .mb-8.justify-between > h2`
- http://localhost:9048/#/queue
  - `.py-3`
- http://localhost:9048/#/songs
  - `.py-3`
- http://localhost:9048/#/albums
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
- http://localhost:9048/#/artists
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
- http://localhost:9048/#/genres
  - `.py-3`
  - `.font-normal`
  - `.text-lg.text-k-fg-70`
- http://localhost:9048/#/genres/Ambient
  - `.mt-2`
  - `button[name="ok"]`
- http://localhost:9048/#/albums/01m4drmc2j1hqwcqmp609ttwv2
  - `.py-3`
- http://localhost:9048/#/artists/01m4drmbx5r7a0qhsqeatevhc4
  - `.py-3`
- http://localhost:9048/#/playlists/01a11b8a-346c-7159-acab-489408f02087
  - `.py-3`
- http://localhost:9048/#/favorites
  - `.py-3`
- http://localhost:9048/#/recently-played
  - `.py-3`
- http://localhost:9048/#/search
  - `.py-3`
- http://localhost:9048/#/profile
  - `.text-white\/80`
- http://localhost:9048/#/youtube
  - `.py-3`
- http://localhost:9048/#/radio/stations
  - `.py-3`
- http://localhost:9048/#/podcasts
  - `.py-3`
- http://localhost:9048/#/browse
  - `.py-3`
- http://localhost:9048/#/offline-songs
  - `.py-3`
- http://localhost:9048/#/visualizer
  - `.py-3`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9048/#/songs
  - `.focus\:text-k-highlight`
- http://localhost:9048/#/albums
  - `.focus\:text-k-fg`
- http://localhost:9048/#/artists
  - `.focus\:text-k-fg`
- http://localhost:9048/#/genres
  - `.focus\:text-k-fg`
- http://localhost:9048/#/albums/01m4drmc2j1hqwcqmp609ttwv2
  - `.focus\:text-k-highlight`
- http://localhost:9048/#/artists/01m4drmbx5r7a0qhsqeatevhc4
  - `.focus\:text-k-highlight`
- http://localhost:9048/#/playlists/01a11b8a-346c-7159-acab-489408f02087
  - `.focus\:text-k-highlight`
- http://localhost:9048/#/recently-played
  - `.focus\:text-k-highlight`
- http://localhost:9048/#/radio/stations
  - `.focus\:text-k-fg`
- http://localhost:9048/#/podcasts
  - `.focus\:text-k-fg`

### aria-allowed-role — ARIA role should be appropriate for the element

- http://localhost:9048/#/genres/Ambient
  - `.skeleton`

## Erreurs (3) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:9048/#/settings — page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('#app nav') to be visible

- http://localhost:9048/#/users — page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('#app nav') to be visible

- http://localhost:9048/#/upload — page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('#app nav') to be visible


