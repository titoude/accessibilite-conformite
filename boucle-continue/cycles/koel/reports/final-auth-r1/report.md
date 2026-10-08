# Audit accessibilité — 2026-10-08

**10 règle(s) violée(s), 103 occurrence(s), 23/23 scénario(s) audité(s), 0 erreur(s), 67 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `505f80723dfa`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:9049/#/profile
  - `button[aria-controls="profilePaneQr"]`
- http://localhost:9049/#/podcasts
  - `button[data-variant="highlight"]`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-prohibited-attr?application=axeAPI

- http://localhost:9049/#/home
  - `.album-thumb`
- http://localhost:9049/#/queue
  - `.album-thumb`
- http://localhost:9049/#/songs
  - `.album-thumb`
- http://localhost:9049/#/albums
  - `.album-thumb`
- http://localhost:9049/#/artists
  - `.album-thumb`
- http://localhost:9049/#/genres
  - `.album-thumb`
- http://localhost:9049/#/albums/01m4db5ex9dphwzek04j5z49r3
  - `.album-thumb`
- http://localhost:9049/#/artists/01m4db5ersmhdr87tf7g2mf34v
  - `.album-thumb`
- http://localhost:9049/#/playlists/01a11ab3-63eb-714e-8e60-27328c33148e
  - `.album-thumb`
- http://localhost:9049/#/favorites
  - `.album-thumb`
- http://localhost:9049/#/recently-played
  - `.album-thumb`
- http://localhost:9049/#/search
  - `.album-thumb`
- http://localhost:9049/#/settings
  - `.album-thumb`
- http://localhost:9049/#/users
  - `.album-thumb`
- http://localhost:9049/#/profile
  - `.album-thumb`
- http://localhost:9049/#/upload
  - `.album-thumb`
- http://localhost:9049/#/youtube
  - `.album-thumb`
- http://localhost:9049/#/radio/stations
  - `.album-thumb`
- http://localhost:9049/#/podcasts
  - `.album-thumb`
- http://localhost:9049/#/browse
  - `.album-thumb`
- http://localhost:9049/#/offline-songs
  - `.album-thumb`
- http://localhost:9049/#/visualizer
  - `.album-thumb`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/label-title-only?application=axeAPI

- http://localhost:9049/#/home
  - `.volume-slider`
- http://localhost:9049/#/queue
  - `.volume-slider`
- http://localhost:9049/#/songs
  - `.volume-slider`
- http://localhost:9049/#/albums
  - `.volume-slider`
- http://localhost:9049/#/artists
  - `.volume-slider`
- http://localhost:9049/#/genres
  - `.volume-slider`
- http://localhost:9049/#/albums/01m4db5ex9dphwzek04j5z49r3
  - `.volume-slider`
- http://localhost:9049/#/artists/01m4db5ersmhdr87tf7g2mf34v
  - `.volume-slider`
- http://localhost:9049/#/playlists/01a11ab3-63eb-714e-8e60-27328c33148e
  - `.volume-slider`
- http://localhost:9049/#/favorites
  - `.volume-slider`
- http://localhost:9049/#/recently-played
  - `.volume-slider`
- http://localhost:9049/#/search
  - `.volume-slider`
- http://localhost:9049/#/settings
  - `.volume-slider`
- http://localhost:9049/#/users
  - `.volume-slider`
- http://localhost:9049/#/profile
  - `.volume-slider`
- http://localhost:9049/#/upload
  - `.volume-slider`
- http://localhost:9049/#/youtube
  - `.volume-slider`
- http://localhost:9049/#/radio/stations
  - `.volume-slider`
- http://localhost:9049/#/podcasts
  - `.volume-slider`
- http://localhost:9049/#/browse
  - `.volume-slider`
- http://localhost:9049/#/offline-songs
  - `.volume-slider`
- http://localhost:9049/#/visualizer
  - `.volume-slider`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9049/#/home
  - `button[data-variant="highlight"]`
- http://localhost:9049/#/queue
  - `.btn-shuffle-all`
- http://localhost:9049/#/songs
  - `.btn-shuffle-all`
- http://localhost:9049/#/albums/01m4db5ex9dphwzek04j5z49r3
  - `.btn-shuffle-all`
- http://localhost:9049/#/artists/01m4db5ersmhdr87tf7g2mf34v
  - `.btn-shuffle-all`
- http://localhost:9049/#/playlists/01a11ab3-63eb-714e-8e60-27328c33148e
  - `.btn-shuffle-all`
- http://localhost:9049/#/recently-played
  - `.btn-shuffle-all`
- http://localhost:9049/#/users
  - `.inline-flex > .text-white.border-transparent[data-variant="highlight"]`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://localhost:9049/#/home
  - `.collapsed > main`
- http://localhost:9049/#/queue
  - `.expanded > main`
- http://localhost:9049/#/songs
  - `.expanded > main`
- http://localhost:9049/#/albums
  - `.collapsed > main`
- http://localhost:9049/#/artists
  - `.collapsed > main`
- http://localhost:9049/#/genres
  - `.collapsed > main`
- http://localhost:9049/#/albums/01m4db5ex9dphwzek04j5z49r3
  - `.expanded > main`
- http://localhost:9049/#/artists/01m4db5ersmhdr87tf7g2mf34v
  - `.expanded > main`
- http://localhost:9049/#/playlists/01a11ab3-63eb-714e-8e60-27328c33148e
  - `.expanded > main`
- http://localhost:9049/#/favorites
  - `.collapsed > main`
- http://localhost:9049/#/recently-played
  - `.expanded > main`
- http://localhost:9049/#/search
  - `.collapsed > main`
- http://localhost:9049/#/settings
  - `.expanded > main`
- http://localhost:9049/#/users
  - `.collapsed > main`
- http://localhost:9049/#/profile
  - `.expanded > main`
- http://localhost:9049/#/upload
  - `.collapsed > main`
- http://localhost:9049/#/radio/stations
  - `.collapsed > main`
- http://localhost:9049/#/podcasts
  - `.collapsed > main`
- http://localhost:9049/#/offline-songs
  - `.collapsed > main`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:9049/#/home
  - `.collapsed > main`
- http://localhost:9049/#/queue
  - `.expanded > main`
- http://localhost:9049/#/songs
  - `.expanded > main`
- http://localhost:9049/#/albums
  - `.collapsed > main`
- http://localhost:9049/#/artists
  - `.collapsed > main`
- http://localhost:9049/#/genres
  - `.collapsed > main`
- http://localhost:9049/#/albums/01m4db5ex9dphwzek04j5z49r3
  - `.expanded > main`
- http://localhost:9049/#/artists/01m4db5ersmhdr87tf7g2mf34v
  - `.expanded > main`
- http://localhost:9049/#/playlists/01a11ab3-63eb-714e-8e60-27328c33148e
  - `.expanded > main`
- http://localhost:9049/#/favorites
  - `.collapsed > main`
- http://localhost:9049/#/recently-played
  - `.expanded > main`
- http://localhost:9049/#/search
  - `.collapsed > main`
- http://localhost:9049/#/settings
  - `.expanded > main`
- http://localhost:9049/#/users
  - `.collapsed > main`
- http://localhost:9049/#/profile
  - `.expanded > main`
- http://localhost:9049/#/upload
  - `.collapsed > main`
- http://localhost:9049/#/radio/stations
  - `.collapsed > main`
- http://localhost:9049/#/podcasts
  - `.collapsed > main`
- http://localhost:9049/#/offline-songs
  - `.collapsed > main`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:9049/#/youtube
  - `html`
- http://localhost:9049/#/browse
  - `html`
- http://localhost:9049/#/visualizer
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9049/#/youtube
  - `html`
- http://localhost:9049/#/browse
  - `html`
- http://localhost:9049/#/visualizer
  - `html`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-main-is-top-level?application=axeAPI

- http://localhost:9049/#/albums/01m4db5ex9dphwzek04j5z49r3
  - `main[data-v-365f2bec=""]`
- http://localhost:9049/#/artists/01m4db5ersmhdr87tf7g2mf34v
  - `main[data-v-365f2bec=""]`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9049/#/visualizer
  - `.left-8`
  - `select`
  - `.viz`

## Résultats incomplets à revoir (67)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9049/#/home
  - `.py-3`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(5) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(5) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-added-albums"] > .mb-8 > h2`
- http://localhost:9049/#/queue
  - `.py-3`
- http://localhost:9049/#/songs
  - `.py-3`
- http://localhost:9049/#/albums
  - `.py-3`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(1) > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2.whitespace-nowrap > .gap-2.items-center.flex > .font-medium.flex-1[data-testid="name"]`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(1) > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2.whitespace-nowrap > .space-x-2 > a`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(1) > .full.p-5.rounded-\[inherit\] > footer > .opacity-70 > a[role="button"]:nth-child(1)`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(1) > .full.p-5.rounded-\[inherit\] > footer > .opacity-70 > a[role="button"]:nth-child(3)`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(2) > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2.whitespace-nowrap > .gap-2.items-center.flex > .font-medium.flex-1[data-testid="name"]`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(2) > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2.whitespace-nowrap > .space-x-2 > a`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(2) > .full.p-5.rounded-\[inherit\] > footer > .opacity-70 > a[role="button"]:nth-child(1)`
  - `.gradient-border.rounded-lg.md\:max-w-\[256px\]:nth-child(2) > .full.p-5.rounded-\[inherit\] > footer > .opacity-70 > a[role="button"]:nth-child(3)`
  - `div[title="Evenings Deep by Koel Rivers"] > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2.whitespace-nowrap > .gap-2.items-center.flex > .font-medium.flex-1[data-testid="name"]`
  - … +3 autres
- http://localhost:9049/#/artists
  - `.py-3`
  - `div[title="Blue Transistors"] > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2[data-v-2c4978d0=""] > .font-medium[data-testid="name"]`
  - `div[title="Blue Transistors"] > .full.p-5.rounded-\[inherit\] > footer > .opacity-70 > a[role="button"]:nth-child(1)`
  - `div[title="Blue Transistors"] > .full.p-5.rounded-\[inherit\] > footer > .opacity-70 > a[role="button"]:nth-child(3)`
  - `div[title="Koel Rivers"] > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2[data-v-2c4978d0=""] > .font-medium[data-testid="name"]`
  - `div[title="Koel Rivers"] > .full.p-5.rounded-\[inherit\] > footer > .opacity-70 > a[role="button"]:nth-child(1)`
  - `div[title="Koel Rivers"] > .full.p-5.rounded-\[inherit\] > footer > .opacity-70 > a[role="button"]:nth-child(3)`
  - `div[title="Velvet Meridian"] > .full.p-5.rounded-\[inherit\] > footer > .name.gap-2[data-v-2c4978d0=""] > .font-medium[data-testid="name"]`
  - `div[title="Velvet Meridian"] > .full.p-5.rounded-\[inherit\] > footer > .opacity-70 > a[role="button"]:nth-child(1)`
  - `div[title="Velvet Meridian"] > .full.p-5.rounded-\[inherit\] > footer > .opacity-70 > a[role="button"]:nth-child(3)`
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

