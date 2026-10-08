# Audit accessibilité — 2026-10-08

**4 règle(s) violée(s), 21 occurrence(s), 11/11 scénario(s) audité(s), 0 erreur(s), 235 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `a0a880e905de`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-prohibited-attr?application=axeAPI

- http://localhost:8201/profile/1 [state:profile-tab-stats]
  - `#activity-level-0`
  - `#activity-level-1`
  - `#activity-level-2`
  - `#activity-level-3`
  - `#activity-level-4`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:8201/profile/1 [state:profile-tab-stats]
  - `.me-2.stats-title`
  - `.month-label[colspan="5"]:nth-child(2) > span[aria-hidden="true"]`
  - `.month-label[colspan="4"]:nth-child(3) > span[aria-hidden="true"]`
  - `.month-label[colspan="4"]:nth-child(4) > span[aria-hidden="true"]`
  - `.month-label[colspan="4"]:nth-child(5) > span[aria-hidden="true"]`
  - `.month-label[colspan="5"]:nth-child(6) > span[aria-hidden="true"]`
  - `.month-label[colspan="4"]:nth-child(7) > span[aria-hidden="true"]`
  - `.month-label[colspan="4"]:nth-child(8) > span[aria-hidden="true"]`
  - `.month-label[colspan="5"]:nth-child(9) > span[aria-hidden="true"]`
  - `.month-label[colspan="4"]:nth-child(10) > span[aria-hidden="true"]`
  - … +1 autres

## [SERIOUS] scrollable-region-focusable — Scrollable region must have keyboard access

Ensure elements that have scrollable content are accessible by keyboard in Safari
Référence : https://dequeuniversity.com/rules/axe/4.14/scrollable-region-focusable?application=axeAPI

- http://localhost:8201/profile/1 [state:profile-tab-stats]
  - `.graph-wrapper`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:8201/profile/1 [state:profile-tab-stats]
  - `.mb-0[_ngcontent-ng-c320901677=""]:nth-child(1)`
  - `app-string-breakdown[translationkey="genre-breakdown"] > .card.p-4[_ngcontent-ng-c3390504575=""] > h6`
  - `app-string-breakdown[translationkey="tag-breakdown"] > .card.p-4[_ngcontent-ng-c3390504575=""] > h6`
  - `app-favorite-authors > .card.p-4.stats-card > h6`

## Résultats incomplets à revoir (235)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8201/home
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - … +10 autres
- http://localhost:8201/home [state:nav-user-menu]
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - … +10 autres
- http://localhost:8201/home [state:search-typeahead]
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - … +10 autres
- http://localhost:8201/home [state:search-config]
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - … +10 autres
- http://localhost:8201/library/1 [state:card-actions]
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `.active > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/2"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/3"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - … +5 autres
- http://localhost:8201/library/1/series/1 [state:series-read-options]
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/1"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/2"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/3"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - … +14 autres
- http://localhost:8201/library/1/series/1 [state:series-edit-modal]
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/1"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/2"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/3"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - … +14 autres
- http://localhost:8201/library/1/series/1 [state:series-tab-chapters]
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/1"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/2"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/3"] > .side-nav-text > div[_ngcontent-ng-c3395926684=""]`
  - … +14 autres
- http://localhost:8201/lists/1 [state:rl-tab-details]
  - `.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - … +9 autres
- http://localhost:8201/profile/1 [state:profile-tab-stats]
  - `.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c3395926684=""] > div[_ngcontent-ng-c3395926684=""]`
  - … +31 autres
- http://localhost:8201/home [state:mobile-nav-390]
  - `app-carousel-reel:nth-child(3) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(1) > h2 > .section-title[href="javascript:void(0)"]`
  - `app-carousel-reel:nth-child(3) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(2) > swiper-container > .swiper-slide-active[aria-label="1 / 7"] > app-entity-card > .card-item-container.card[aria-label="Accessibility Field Manual"] > .card-title-container > .card-title[placement="top"] > .dark-exempt.btn-icon[href$="series/7"]`
  - `app-carousel-reel:nth-child(3) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(2) > swiper-container > .swiper-slide-next[aria-label="2 / 7"] > app-entity-card > .card-item-container.card[aria-label="The Testing Chronicles"] > .card-title-container > .card-title[placement="top"] > .dark-exempt.btn-icon[href$="series/6"]`
  - `app-carousel-reel:nth-child(4) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(1) > h2 > .section-title[href="javascript:void(0)"]`
  - `app-carousel-reel:nth-child(4) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(2) > swiper-container > .swiper-slide-active[aria-label="1 / 7"] > app-entity-card > .card-item-container.card[aria-label="Accessibility Field Manual"] > .card-title-container > .card-title[placement="top"] > .dark-exempt.btn-icon[href$="series/7"]`
  - `app-carousel-reel:nth-child(4) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(2) > swiper-container > .swiper-slide-next[aria-label="2 / 7"] > app-entity-card > .card-item-container.card[aria-label="The Testing Chronicles"] > .card-title-container > .card-title[placement="top"] > .dark-exempt.btn-icon[href$="series/6"]`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:8201/library/1 [state:card-actions]
  - `app-root`
- http://localhost:8201/library/1/series/1 [state:series-edit-modal]
  - `app-root`

