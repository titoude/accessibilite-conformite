# Audit accessibilité — 2026-10-08

**4 règle(s) violée(s), 5 occurrence(s), 7/7 scénario(s) audité(s), 0 erreur(s), 140 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d6f27110b586`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:7500/home [state:search-typeahead]
  - `#id-89e90ecf-3267-41db-97c0-06f23c790c96-listbox`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:7500/home [state:mobile-nav-390]
  - `.btn-outline-secondary`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-dialog-name?application=axeAPI

- http://localhost:7500/library/4/series/6 [state:series-edit-modal]
  - `ngb-modal-window`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:7500/library/4/series/6 [state:series-edit-modal]
  - `#ngb-nav-4`
  - `.btn-primary`

## Résultats incomplets à revoir (140)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7500/home
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/4"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/5"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/6"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - … +11 autres
- http://localhost:7500/home [state:nav-user-menu]
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/4"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/5"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/6"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - … +11 autres
- http://localhost:7500/home [state:search-typeahead]
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/4"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/5"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/6"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - … +11 autres
- http://localhost:7500/home [state:search-config]
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/4"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/5"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/6"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - … +11 autres
- http://localhost:7500/library/4/series/6 [state:series-read-options]
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/4"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/5"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/6"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - … +14 autres
- http://localhost:7500/library/4/series/6 [state:series-edit-modal]
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/4"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/5"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/6"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - … +14 autres
- http://localhost:7500/home [state:mobile-nav-390]
  - `app-carousel-reel:nth-child(3) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(1) > h2 > .section-title[href="javascript:void(0)"]`
  - `#entity-0 > .dark-exempt.btn-icon[href="/library/6/series/12"]`
  - `#entity-1 > .dark-exempt.btn-icon[href="/library/6/series/11"]`
  - `app-carousel-reel:nth-child(4) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(1) > h2 > .section-title[href="javascript:void(0)"]`
  - `#entity-12 > .dark-exempt.btn-icon[href="/library/6/series/12"]`
  - `#entity-11 > .dark-exempt.btn-icon[href="/library/6/series/11"]`

### aria-required-children — Certain ARIA roles must contain particular children

- http://localhost:7500/home [state:search-config]
  - `#id-460c1d40-42cc-4c9c-8fa2-117423d7f006-listbox`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:7500/library/4/series/6 [state:series-edit-modal]
  - `app-root`

