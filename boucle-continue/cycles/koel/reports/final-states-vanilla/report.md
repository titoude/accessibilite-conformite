# Audit accessibilité — 2026-10-08

**12 règle(s) violée(s), 591 occurrence(s), 7/8 scénario(s) audité(s), 1 erreur(s), 161 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `7ebeab5bbac9`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:9049/#/songs
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
  - `#extraTabYouTube`
  - `button[data-title="Play previous in queue"]`
  - `.w-12\!`
  - `button[data-title="Play next in queue"]`
  - `button[data-testid="repeat-mode-switch"]`
  - `.queue-btn`
  - `.visualizer-btn`
  - … +3 autres
- http://localhost:9049/#/home [state:profile-menu]
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
  - `#extraTabYouTube`
  - `button[data-title="Play previous in queue"]`
  - `.w-12\!`
  - `button[data-title="Play next in queue"]`
  - `button[data-testid="repeat-mode-switch"]`
  - `.queue-btn`
  - `.visualizer-btn`
  - … +3 autres
- http://localhost:9049/#/songs [state:player-playing]
  - `button[data-v-b95c4cfb=""][type="button"]:nth-child(1)`
  - `button[data-title="Play previous in queue"]`
  - `.w-12\!`
  - `button[data-title="Play next in queue"]`
  - `button[data-testid="repeat-mode-switch"]`
  - `.queue-btn`
  - `.visualizer-btn`
  - `.equalizer`
  - `button[data-title="Mute"]`
  - `button[data-title="Enter fullscreen mode"]`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `.bg-k-fg-5.rounded-full[data-v-baadc75e=""] > .h-\[42px\].bg-none.md\:bg-k-fg-10`
  - `.md\:hidden.h-\[42px\].bg-none`
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
  - `#extraTabYouTube`
  - `button[data-title="Play previous in queue"]`
  - `.w-12\!`
  - `button[data-title="Play next in queue"]`
  - `button[data-testid="repeat-mode-switch"]`
  - … +2 autres

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:9049/#/songs
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
  - `#extraTabYouTube`
- http://localhost:9049/#/home [state:profile-menu]
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
  - `#extraTabYouTube`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
  - `#extraTabYouTube`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/select-name?application=axeAPI

- http://localhost:9049/#/songs [state:equalizer-open]
  - `select`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9049/#/songs
  - `.playing > .title-artist.gap-1.flex-col > .flex\!.title.text-k-fg > .flex-1[data-v-c785c478=""]`
- http://localhost:9049/#/home [state:profile-menu]
  - `div[data-testid="recently-played-songs"] > ol > .playing.py-4[data-testid="song-card"] > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
- http://localhost:9049/#/songs [state:player-playing]
  - `button[data-variant="success"]`
- http://localhost:9049/#/songs [state:equalizer-open]
  - `.border-t-k-fg-5 > .text-white.border-transparent.bg-k-primary`
- http://localhost:9049/#/home [state:reorder-home-modal]
  - `.reorder-blocks-modal > footer > .text-white.border-transparent.bg-k-primary`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `div[data-testid="recently-played-songs"] > ol > .playing.py-4[data-testid="song-card"] > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:9049/#/songs
  - `a[href$="/#/home"]`
- http://localhost:9049/#/home [state:profile-menu]
  - `a[href$="/#/home"]`
- http://localhost:9049/#/songs [state:player-playing]
  - `a[href$="/#/home"]`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `a[href$="/#/home"]`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/label-title-only?application=axeAPI

- http://localhost:9049/#/songs
  - `.volume-slider`
- http://localhost:9049/#/home [state:profile-menu]
  - `.volume-slider`
- http://localhost:9049/#/songs [state:player-playing]
  - `.volume-slider`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-input-field-name?application=axeAPI

- http://localhost:9049/#/songs [state:equalizer-open]
  - `.t-4 > .min-w-\[24px\][data-v-fddd17ea=""] > .slider.noUi-target.noUi-rtl > .noUi-base > .noUi-origin > .noUi-handle.noUi-handle-lower[data-handle="0"]`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(2) > .slider.noUi-target.noUi-rtl > .noUi-base > .noUi-origin > .noUi-handle.noUi-handle-lower[data-handle="0"]`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(3) > .slider.noUi-target.noUi-rtl > .noUi-base > .noUi-origin > .noUi-handle.noUi-handle-lower[data-handle="0"]`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(4) > .slider.noUi-target.noUi-rtl > .noUi-base > .noUi-origin > .noUi-handle.noUi-handle-lower[data-handle="0"]`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(5) > .slider.noUi-target.noUi-rtl > .noUi-base > .noUi-origin > .noUi-handle.noUi-handle-lower[data-handle="0"]`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(6) > .slider.noUi-target.noUi-rtl > .noUi-base > .noUi-origin > .noUi-handle.noUi-handle-lower[data-handle="0"]`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(7) > .slider.noUi-target.noUi-rtl > .noUi-base > .noUi-origin > .noUi-handle.noUi-handle-lower[data-handle="0"]`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(8) > .slider.noUi-target.noUi-rtl > .noUi-base > .noUi-origin > .noUi-handle.noUi-handle-lower[data-handle="0"]`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(9) > .slider.noUi-target.noUi-rtl > .noUi-base > .noUi-origin > .noUi-handle.noUi-handle-lower[data-handle="0"]`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(10) > .slider.noUi-target.noUi-rtl > .noUi-base > .noUi-origin > .noUi-handle.noUi-handle-lower[data-handle="0"]`
  - … +1 autres

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-main-is-top-level?application=axeAPI

- http://localhost:9049/#/songs
  - `.expanded > .gap-5`
  - `.max-h-full.min-h-full.transform-gpu:nth-child(2) > .b-16.md\:b-6.place-content-start`
- http://localhost:9049/#/home [state:profile-menu]
  - `#homeWrapper > .collapsed.screen-header.min-h-0 > main`
  - `#homeWrapper > .overflow-scroll.b-16.md\:b-6`
- http://localhost:9049/#/songs [state:player-playing]
  - `.expanded > .gap-5`
  - `.max-h-full.min-h-full.transform-gpu:nth-child(1) > .b-16.md\:b-6.place-content-start`
- http://localhost:9049/#/songs [state:equalizer-open]
  - `.select-none.w-full[data-v-6303edcd=""] > main`
- http://localhost:9049/#/home [state:reorder-home-modal]
  - `.space-y-1`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `#homeWrapper > .collapsed.screen-header.min-h-0 > main`
  - `#homeWrapper > .overflow-scroll.b-16.md\:b-6`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://localhost:9049/#/songs
  - `.md\:h-screen`
- http://localhost:9049/#/home [state:profile-menu]
  - `.md\:h-screen`
- http://localhost:9049/#/songs [state:player-playing]
  - `.md\:h-screen`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `.md\:h-screen`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:9049/#/songs
  - `.md\:h-screen`
- http://localhost:9049/#/home [state:profile-menu]
  - `.md\:h-screen`
- http://localhost:9049/#/songs [state:player-playing]
  - `.md\:h-screen`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `.md\:h-screen`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9049/#/songs
  - `.tooltip:nth-child(26)`
  - `.tooltip:nth-child(27)`
  - `.tooltip:nth-child(28)`
  - `.tooltip:nth-child(29)`
  - `.tooltip:nth-child(30)`
  - `.tooltip:nth-child(31)`
  - `.tooltip:nth-child(32)`
  - `.tooltip:nth-child(33)`
  - `.tooltip:nth-child(34)`
  - `.tooltip:nth-child(35)`
  - … +23 autres
- http://localhost:9049/#/home [state:profile-menu]
  - `.tooltip:nth-child(26)`
  - `.tooltip:nth-child(27)`
  - `.tooltip:nth-child(28)`
  - `.tooltip:nth-child(29)`
  - `.tooltip:nth-child(30)`
  - `.tooltip:nth-child(31)`
  - `.tooltip:nth-child(32)`
  - `.tooltip:nth-child(33)`
  - `.tooltip:nth-child(34)`
  - `.tooltip:nth-child(35)`
  - … +202 autres
- http://localhost:9049/#/songs [state:player-playing]
  - `.tooltip:nth-child(26)`
  - `.tooltip:nth-child(27)`
  - `.tooltip:nth-child(28)`
  - `.tooltip:nth-child(29)`
  - `.tooltip:nth-child(30)`
  - `.tooltip:nth-child(31)`
  - `.tooltip:nth-child(32)`
  - `.tooltip:nth-child(33)`
  - `.tooltip:nth-child(34)`
  - `.tooltip:nth-child(35)`
  - … +18 autres
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `.tooltip:nth-child(26)`
  - `.tooltip:nth-child(27)`
  - `.tooltip:nth-child(28)`
  - `.tooltip:nth-child(29)`
  - `.tooltip:nth-child(30)`
  - `.tooltip:nth-child(31)`
  - `.tooltip:nth-child(32)`
  - `.tooltip:nth-child(33)`
  - `.tooltip:nth-child(34)`
  - `.tooltip:nth-child(35)`
  - … +202 autres

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:9049/#/songs
  - `.md\:block > h3`
- http://localhost:9049/#/home [state:profile-menu]
  - `div[data-testid="recently-played-songs"] > .mb-8.justify-between > .text-2xl.font-thin`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `div[data-testid="recently-played-songs"] > .mb-8.justify-between > .text-2xl.font-thin`

## Résultats incomplets à revoir (161)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9049/#/songs
  - `.focus\:text-k-highlight`
- http://localhost:9049/#/songs [state:player-playing]
  - `button[data-variant="success"]`
  - `.focus\:text-k-highlight`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9049/#/songs
  - `.bg-k-bg-input`
  - `.space-y-4:nth-child(1) > .uppercase.tracking-widest.mb-3`
  - `a[href$="/#/songs"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.truncate.align-bottom`
  - `a[href$="/#/albums"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.truncate.align-bottom`
  - `a[href$="/#/artists"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.truncate.align-bottom`
  - `a[href$="/#/genres"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.truncate.align-bottom`
  - `a[href$="/#/podcasts"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.truncate.align-bottom`
  - `a[href$="/#/radio/stations"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.truncate.align-bottom`
  - `.flex-1[data-v-0975177a=""]`
  - `a[href$="/#/favorites"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.truncate.align-bottom`
  - … +39 autres
- http://localhost:9049/#/home [state:profile-menu]
  - `.bg-k-bg-input`
  - `.space-y-4:nth-child(1) > .uppercase.tracking-widest.mb-3`
  - `a[href$="/#/songs"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.align-bottom.whitespace-nowrap`
  - `a[href$="/#/albums"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.align-bottom.whitespace-nowrap`
  - `a[href$="/#/artists"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.align-bottom.whitespace-nowrap`
  - `a[href$="/#/genres"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.align-bottom.whitespace-nowrap`
  - `a[href$="/#/podcasts"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.align-bottom.whitespace-nowrap`
  - `a[href$="/#/radio/stations"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.align-bottom.whitespace-nowrap`
  - `.flex-1[data-v-0975177a=""]`
  - `a[href$="/#/favorites"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.align-bottom.whitespace-nowrap`
  - … +25 autres
- http://localhost:9049/#/songs [state:player-playing]
  - `.bg-k-bg-input`
  - `.space-y-4:nth-child(1) > .uppercase.tracking-widest.mb-3`
  - `a[href$="/#/songs"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.whitespace-nowrap.truncate`
  - `a[href$="/#/albums"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.whitespace-nowrap.truncate`
  - `a[href$="/#/artists"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.whitespace-nowrap.truncate`
  - `a[href$="/#/genres"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.whitespace-nowrap.truncate`
  - `a[href$="/#/podcasts"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.whitespace-nowrap.truncate`
  - `a[href$="/#/radio/stations"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.whitespace-nowrap.truncate`
  - `.flex-1[data-v-0975177a=""]`
  - `a[href$="/#/favorites"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .inline-block.whitespace-nowrap.truncate`
  - … +38 autres
- http://localhost:9049/#/songs [state:equalizer-open]
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(2) > .mt-2.mb-0.text-sm`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(3) > .mt-2.mb-0.text-sm`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(4) > .mt-2.mb-0.text-sm`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(5) > .mt-2.mb-0.text-sm`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(6) > .mt-2.mb-0.text-sm`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(7) > .mt-2.mb-0.text-sm`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(8) > .mt-2.mb-0.text-sm`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(9) > .mt-2.mb-0.text-sm`
  - `.min-w-\[24px\][data-v-fddd17ea=""]:nth-child(10) > .mt-2.mb-0.text-sm`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `#homeWrapper > .collapsed.screen-header.min-h-0 > main > .flex-1.w-full[data-v-26168f00=""] > h1 > .block.max-w-full[data-v-26168f00=""] > .inline-block.align-bottom.whitespace-nowrap`
  - `div[data-testid="recently-played-songs"] > .mb-8.justify-between > .text-2xl.font-thin`
  - `div[data-testid="recently-played-songs"] > ol > .playing.py-4[data-testid="song-card"] > .min-w-0.gap-1.flex-1 > .block.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .playing.py-4[data-testid="song-card"] > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(2) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(2) > .min-w-0.gap-1.flex-1 > .block.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(2) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .min-w-0.gap-1.flex-1 > .block.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - … +7 autres

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:9049/#/songs [state:song-context-menu] — stateProof échoué (song-context-menu) : page.waitForSelector: Timeout 8000ms exceeded.
Call log:
  - waiting for locator('.menu.context-menu ul[role="menu"]') to be visible


