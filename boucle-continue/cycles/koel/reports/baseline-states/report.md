# Audit accessibilité — 2026-10-08

**13 règle(s) violée(s), 832 occurrence(s), 8/8 scénario(s) audité(s), 0 erreur(s), 197 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `b7927c934c30`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:9049/#/home
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
  - `button[data-title="Play previous in queue"]`
  - `.w-12\!`
  - `button[data-title="Play next in queue"]`
  - `button[data-testid="repeat-mode-switch"]`
  - `.queue-btn`
  - `.visualizer-btn`
  - `.active`
  - … +2 autres
- http://localhost:9049/#/home [state:profile-menu]
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
  - `button[data-title="Play previous in queue"]`
  - `.w-12\!`
  - `button[data-title="Play next in queue"]`
  - `button[data-testid="repeat-mode-switch"]`
  - `.queue-btn`
  - `.visualizer-btn`
  - `.active`
  - … +2 autres
- http://localhost:9049/#/songs [state:song-context-menu]
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
  - `button[data-title="Play previous in queue"]`
  - `.w-12\!`
  - `button[data-title="Play next in queue"]`
  - `button[data-testid="repeat-mode-switch"]`
  - `.queue-btn`
  - `.visualizer-btn`
  - `.equalizer`
  - … +2 autres
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
  - `button[data-title="Play previous in queue"]`
  - `.w-12\!`
  - `button[data-title="Play next in queue"]`
  - `button[data-testid="repeat-mode-switch"]`
  - `.queue-btn`
  - … +1 autres

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:9049/#/home
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
- http://localhost:9049/#/home [state:profile-menu]
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
- http://localhost:9049/#/songs [state:song-context-menu]
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `#extraTabLyrics`
  - `#extraTabArtist`
  - `#extraTabAlbum`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:9049/#/songs [state:song-context-menu]
  - `.shadow-sm`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/select-name?application=axeAPI

- http://localhost:9049/#/songs [state:equalizer-open]
  - `select`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9049/#/home
  - `div[data-testid="recently-played-songs"] > ol > .playing.py-4[data-testid="song-card"] > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
- http://localhost:9049/#/home [state:profile-menu]
  - `div[data-testid="recently-played-songs"] > ol > .playing.py-4[data-testid="song-card"] > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
- http://localhost:9049/#/songs [state:song-context-menu]
  - `button[data-variant="success"]`
  - `.playing > .title-artist.gap-1.flex-col > .flex\!.title.text-k-fg > .flex-1[data-v-c785c478=""]`
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

- http://localhost:9049/#/home
  - `a[href$="/#/home"]`
- http://localhost:9049/#/home [state:profile-menu]
  - `a[href$="/#/home"]`
- http://localhost:9049/#/songs [state:song-context-menu]
  - `a[href$="/#/home"]`
- http://localhost:9049/#/songs [state:player-playing]
  - `a[href$="/#/home"]`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `a[href$="/#/home"]`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/label-title-only?application=axeAPI

- http://localhost:9049/#/home
  - `.volume-slider`
- http://localhost:9049/#/home [state:profile-menu]
  - `.volume-slider`
- http://localhost:9049/#/songs [state:song-context-menu]
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

- http://localhost:9049/#/home
  - `.collapsed > main`
  - `.overflow-scroll`
- http://localhost:9049/#/home [state:profile-menu]
  - `.collapsed > main`
  - `.overflow-scroll`
- http://localhost:9049/#/songs [state:song-context-menu]
  - `.expanded > .gap-5`
  - `.b-16`
- http://localhost:9049/#/songs [state:player-playing]
  - `.expanded > main`
  - `.b-16`
- http://localhost:9049/#/songs [state:equalizer-open]
  - `.select-none.w-full[data-v-6303edcd=""] > main`
- http://localhost:9049/#/home [state:reorder-home-modal]
  - `.space-y-1`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `.collapsed > main`
  - `.overflow-scroll`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://localhost:9049/#/home
  - `.md\:h-screen`
- http://localhost:9049/#/home [state:profile-menu]
  - `.md\:h-screen`
- http://localhost:9049/#/songs [state:song-context-menu]
  - `.md\:h-screen`
- http://localhost:9049/#/songs [state:player-playing]
  - `.md\:h-screen`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `.md\:h-screen`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:9049/#/home
  - `.md\:h-screen`
- http://localhost:9049/#/home [state:profile-menu]
  - `.md\:h-screen`
- http://localhost:9049/#/songs [state:song-context-menu]
  - `.md\:h-screen`
- http://localhost:9049/#/songs [state:player-playing]
  - `.md\:h-screen`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `.md\:h-screen`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9049/#/home
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
  - … +201 autres
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
  - … +201 autres
- http://localhost:9049/#/songs [state:song-context-menu]
  - `.shadow-sm > ul > .focus\:bg-k-highlight.focus\:text-k-highlight-fg.focus\:outline-hidden:nth-child(1)`
  - `.has-sub.focus\:bg-k-highlight.focus\:text-k-highlight-fg:nth-child(3) > .label.min-w-0.max-w-40`
  - `.has-sub.focus\:bg-k-highlight.focus\:text-k-highlight-fg:nth-child(4) > .label.min-w-0.max-w-40`
  - `.px-4.py-2.focus\:outline-hidden`
  - `.has-sub.focus\:bg-k-highlight.focus\:text-k-highlight-fg:nth-child(8) > .label.min-w-0.max-w-40`
  - `.shadow-sm > ul > .focus\:bg-k-highlight.focus\:text-k-highlight-fg.focus\:outline-hidden:nth-child(9)`
  - `.focus\:bg-k-highlight.focus\:text-k-highlight-fg.focus\:outline-hidden:nth-child(10)`
  - `.focus\:bg-k-highlight.focus\:text-k-highlight-fg.focus\:outline-hidden:nth-child(11)`
  - `.focus\:bg-k-highlight.focus\:text-k-highlight-fg.focus\:outline-hidden:nth-child(13)`
  - `.tooltip:nth-child(26)`
  - … +36 autres
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
  - … +201 autres

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:9049/#/home
  - `div[data-testid="recently-played-songs"] > .mb-8 > .font-thin.text-2xl`
- http://localhost:9049/#/home [state:profile-menu]
  - `div[data-testid="recently-played-songs"] > .mb-8 > .font-thin.text-2xl`
- http://localhost:9049/#/songs [state:song-context-menu]
  - `.md\:block > h3`
- http://localhost:9049/#/home [state:mobile-nav-390]
  - `div[data-testid="recently-played-songs"] > .mb-8 > .font-thin.text-2xl`

## Résultats incomplets à revoir (197)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9049/#/home
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
- http://localhost:9049/#/songs [state:song-context-menu]
  - `.bg-k-bg-input`
  - `.space-y-4:nth-child(1) > .uppercase.tracking-widest.mb-3`
  - `a[href$="/#/songs"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .align-bottom.inline-block.whitespace-nowrap`
  - `a[href$="/#/albums"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .align-bottom.inline-block.whitespace-nowrap`
  - `a[href$="/#/artists"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .align-bottom.inline-block.whitespace-nowrap`
  - `a[href$="/#/genres"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .align-bottom.inline-block.whitespace-nowrap`
  - `a[href$="/#/podcasts"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .align-bottom.inline-block.whitespace-nowrap`
  - `a[href$="/#/radio/stations"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .align-bottom.inline-block.whitespace-nowrap`
  - `.flex-1[data-v-0975177a=""]`
  - `a[href$="/#/favorites"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full[data-v-dde0e37b=""] > .align-bottom.inline-block.whitespace-nowrap`
  - … +39 autres
- http://localhost:9049/#/songs [state:player-playing]
  - `.bg-k-bg-input`
  - `.space-y-4:nth-child(1) > .uppercase.tracking-widest.mb-3`
  - `a[href$="/#/songs"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full.overflow-hidden > .inline-block.whitespace-nowrap.truncate`
  - `a[href$="/#/albums"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full.overflow-hidden > .inline-block.whitespace-nowrap.truncate`
  - `a[href$="/#/artists"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full.overflow-hidden > .inline-block.whitespace-nowrap.truncate`
  - `a[href$="/#/genres"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full.overflow-hidden > .inline-block.whitespace-nowrap.truncate`
  - `a[href$="/#/podcasts"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full.overflow-hidden > .inline-block.whitespace-nowrap.truncate`
  - `a[href$="/#/radio/stations"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full.overflow-hidden > .inline-block.whitespace-nowrap.truncate`
  - `.flex-1[data-v-0975177a=""]`
  - `a[href$="/#/favorites"] > .flex-1.overflow-hidden[data-v-dde0e37b=""] > .block.max-w-full.overflow-hidden > .inline-block.whitespace-nowrap.truncate`
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
  - `.block.max-w-full[data-v-26168f00=""] > .inline-block.align-bottom.whitespace-nowrap`
  - `div[data-testid="recently-played-songs"] > .mb-8 > .font-thin.text-2xl`
  - `div[data-testid="recently-played-songs"] > ol > .playing.py-4[data-testid="song-card"] > .min-w-0.gap-1.flex-1 > .block.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .playing.py-4[data-testid="song-card"] > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(2) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(2) > .min-w-0.gap-1.flex-1 > .block.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(2) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .min-w-0.gap-1.flex-1 > .title.gap-2.truncate > .truncate[data-v-69ac0165=""]`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .min-w-0.gap-1.flex-1 > .block.text-\[0\.9rem\].text-k-fg-50`
  - `div[data-testid="recently-played-songs"] > ol > .py-4[data-testid="song-card"][data-v-4fe5099c=""]:nth-child(3) > .items-end.gap-1.flex-col > .tabular-nums.text-\[0\.9rem\].text-k-fg-50`
  - … +7 autres

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9049/#/songs [state:song-context-menu]
  - `button[data-variant="success"]`
  - `.focus\:text-k-highlight`
- http://localhost:9049/#/songs [state:player-playing]
  - `button[data-variant="success"]`
  - `.focus\:text-k-highlight`

