# Audit accessibilité — 2026-10-08

**11 règle(s) violée(s), 48 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 49 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `2382f45e50e5`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:7500/library/4/series/6
  - `.nav-tabs`
- http://localhost:7500/library/4/series/6 [state:series-edit-modal]
  - `.nav-pills`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:7500/library/4/series/6
  - `#ngb-nav-1`
  - `#ngb-nav-2`
  - `#ngb-nav-3`
  - `#ngb-nav-0`
- http://localhost:7500/library/4/series/6 [state:series-edit-modal]
  - `#ngb-nav-4`
  - `#ngb-nav-9`
  - `#ngb-nav-10`
  - `#ngb-nav-11`
  - `#ngb-nav-12`
  - `#ngb-nav-5`
  - `#ngb-nav-6`
  - `#ngb-nav-7`
  - `#ngb-nav-8`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:7500/library/4/series/6
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `.dropdown-toggle-split`
  - `.ms-2.col-auto[_ngcontent-ng-c1396006662=""]:nth-child(2) > .btn-actions`
  - `#edit-btn--komf`
  - `#actions-Solo\ Leveling`
  - `app-download-button > .btn-actions`
  - … +1 autres

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:7500/library/4/series/6
  - `li:nth-child(1)`
  - `li:nth-child(2)`
  - `li:nth-child(3)`
  - `li:nth-child(4)`
- http://localhost:7500/library/4/series/6 [state:series-edit-modal]
  - `.nav-pills > li:nth-child(1)`
  - `.nav-pills > li:nth-child(2)`
  - `.nav-pills > li:nth-child(3)`
  - `.nav-pills > li:nth-child(4)`
  - `li:nth-child(5)`
  - `li:nth-child(6)`
  - `li:nth-child(7)`
  - `li:nth-child(8)`
  - `li:nth-child(9)`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:7500/library/4/series/6
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.14/list?application=axeAPI

- http://localhost:7500/library/4/series/6
  - `.navbar-nav`

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

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:7500/library/4/series/6
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:7500/library/4/series/6 [state:series-edit-modal]
  - `.row[_ngcontent-ng-c825986750=""]:nth-child(1) > .mb-3[_ngcontent-ng-c825986750=""] > app-setting-item > div[_ngcontent-ng-c3103186822=""] > .settings-row.g-0.row > .edit.setting-title.col-auto > h6`

## [MINOR] aria-allowed-role — ARIA role should be appropriate for the element

Ensure role attribute has an appropriate value for the element
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-role?application=axeAPI

- http://localhost:7500/library/4/series/6
  - `html`
- http://localhost:7500/library/4/series/6 [state:series-edit-modal]
  - `html`

## Résultats incomplets à revoir (49)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7500/library/4/series/6
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

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:7500/library/4/series/6 [state:series-edit-modal]
  - `app-root`

