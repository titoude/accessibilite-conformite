# Audit accessibilité — 2026-10-08

**9 règle(s) violée(s), 234 occurrence(s), 19/19 scénario(s) audité(s), 0 erreur(s), 313 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d91cc8e30d68`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:7500/home
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-The\ Testing\ Chronicles`
  - `#actions-Accessibility\ Field\ Manual`
  - `#actions-Test\ Comics\ Alpha`
  - `#actions-Beta\ Men`
  - `#actions-Attack\ on\ Test`
  - … +2 autres
- http://localhost:7500/library/4
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-card`
  - `#actions-Attack\ on\ Test`
  - `#actions-One\ Punch\ Kavita`
  - `#actions-Solo\ Leveling`
- http://localhost:7500/library/5
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-card`
  - `#actions-Beta\ Men`
  - `#actions-Test\ Comics\ Alpha`
- http://localhost:7500/library/6
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-card`
  - `#actions-Accessibility\ Field\ Manual`
  - `#actions-The\ Testing\ Chronicles`
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
- http://localhost:7500/library/5/series/9
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `.dropdown-toggle-split`
  - `.ms-2.col-auto[_ngcontent-ng-c1396006662=""]:nth-child(2) > .btn-actions`
  - `#edit-btn--komf`
  - `#actions-Beta\ Men`
  - `app-download-button > .btn-actions`
  - … +1 autres
- http://localhost:7500/library/6/series/11
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `.dropdown-toggle-split`
  - `.ms-2.col-auto[_ngcontent-ng-c1396006662=""]:nth-child(2) > .btn-actions`
  - `#edit-btn--komf`
  - `app-card-actionables[iconclass="fa-ellipsis-h"] > button`
  - `app-download-button > .btn-actions`
  - … +1 autres
- http://localhost:7500/library/6/series/11/book/19
  - `.me-2`
  - `.btn-secondary.me-1.btn-icon:nth-child(2)`
  - `.btn-secondary.me-1.btn-icon:nth-child(3)`
  - `.btn-secondary.me-1.btn-icon:nth-child(4)`
  - `.btn-secondary.me-1.btn-icon:nth-child(5)`
- http://localhost:7500/lists
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-Must\ Read`
- http://localhost:7500/lists/1
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `.dropdown-toggle-split`
  - `.btn-actions.btn`
  - `#actions-Must\ Read`
  - `.btn-actions.col-auto.ms-2 > .btn-icon.btn`
- http://localhost:7500/collections
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#jumpbar-index--0 > app-entity-card > .card-item-container[role="article"][aria-label="Staff Picks"] > .card-title-container[_ngcontent-ng-c112150043=""] > .card-actions[_ngcontent-ng-c112150043=""] > app-card-actionables > button`
  - `#jumpbar-index--1 > app-entity-card > .card-item-container[role="article"][aria-label="Staff Picks"] > .card-title-container[_ngcontent-ng-c112150043=""] > .card-actions[_ngcontent-ng-c112150043=""] > app-card-actionables > button`
  - `#jumpbar-index--2 > app-entity-card > .card-item-container[role="article"][aria-label="Staff Picks"] > .card-title-container[_ngcontent-ng-c112150043=""] > .card-actions[_ngcontent-ng-c112150043=""] > app-card-actionables > button`
- http://localhost:7500/bookmarks
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
- http://localhost:7500/want-to-read
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
- http://localhost:7500/all-series
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-Accessibility\ Field\ Manual`
  - `#actions-Attack\ on\ Test`
  - `#actions-Beta\ Men`
  - `#actions-One\ Punch\ Kavita`
  - `#actions-Solo\ Leveling`
  - … +2 autres
- http://localhost:7500/browse
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
- http://localhost:7500/announcements
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
- http://localhost:7500/profile
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:7500/library/4/series/6
  - `.nav-tabs`
- http://localhost:7500/library/5/series/9
  - `.nav-tabs`
- http://localhost:7500/library/6/series/11
  - `.nav-tabs`
- http://localhost:7500/lists/1
  - `.nav-tabs`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:7500/library/4/series/6
  - `#ngb-nav-2`
  - `#ngb-nav-3`
  - `#ngb-nav-1`
  - `#ngb-nav-0`
- http://localhost:7500/library/5/series/9
  - `#ngb-nav-3`
  - `#ngb-nav-2`
  - `#ngb-nav-0`
- http://localhost:7500/library/6/series/11
  - `#ngb-nav-2`
  - `#ngb-nav-0`
  - `#ngb-nav-1`
- http://localhost:7500/lists/1
  - `#ngb-nav-0`
  - `#ngb-nav-1`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.14/list?application=axeAPI

- http://localhost:7500/home
  - `ul`
- http://localhost:7500/library/4
  - `ul`
- http://localhost:7500/library/5
  - `ul`
- http://localhost:7500/library/6
  - `ul`
- http://localhost:7500/library/4/series/6
  - `.navbar-nav`
- http://localhost:7500/library/5/series/9
  - `.navbar-nav`
- http://localhost:7500/library/6/series/11
  - `.navbar-nav`
- http://localhost:7500/lists
  - `ul`
- http://localhost:7500/lists/1
  - `.navbar-nav`
- http://localhost:7500/collections
  - `ul`
- http://localhost:7500/bookmarks
  - `ul`
- http://localhost:7500/want-to-read
  - `ul`
- http://localhost:7500/all-series
  - `ul`
- http://localhost:7500/browse
  - `ul`
- http://localhost:7500/announcements
  - `ul`
- http://localhost:7500/settings
  - `ul`
- http://localhost:7500/profile
  - `ul`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:7500/home
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/library/4
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/library/5
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/library/6
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/library/4/series/6
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/library/5/series/9
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/library/6/series/11
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/lists
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/lists/1
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/collections
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/bookmarks
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/want-to-read
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/all-series
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/browse
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/announcements
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/profile
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:7500/library/4/series/6
  - `li:nth-child(1)`
  - `li:nth-child(2)`
  - `li:nth-child(3)`
  - `li:nth-child(4)`
- http://localhost:7500/library/5/series/9
  - `li:nth-child(1)`
  - `li:nth-child(2)`
  - `li:nth-child(3)`
- http://localhost:7500/library/6/series/11
  - `li:nth-child(1)`
  - `li:nth-child(2)`
  - `#details-tab`
- http://localhost:7500/lists/1
  - `li:nth-child(1)`
  - `#details-tab`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:7500/home
  - `html`
- http://localhost:7500/library/4
  - `html`
- http://localhost:7500/library/5
  - `html`
- http://localhost:7500/library/6
  - `html`
- http://localhost:7500/library/4/series/6
  - `html`
- http://localhost:7500/library/5/series/9
  - `html`
- http://localhost:7500/library/6/series/11
  - `html`
- http://localhost:7500/library/4/series/6/manga/10
  - `html`
- http://localhost:7500/lists
  - `html`
- http://localhost:7500/lists/1
  - `html`
- http://localhost:7500/collections
  - `html`
- http://localhost:7500/bookmarks
  - `html`
- http://localhost:7500/want-to-read
  - `html`
- http://localhost:7500/all-series
  - `html`
- http://localhost:7500/browse
  - `html`
- http://localhost:7500/announcements
  - `html`
- http://localhost:7500/settings
  - `html`
- http://localhost:7500/profile
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:7500/settings
  - `app-change-username > app-setting-item > div[_ngcontent-ng-c3103186822=""] > .settings-row.g-0.row > .edit.setting-title.col-auto > h6`

## [MINOR] aria-allowed-role — ARIA role should be appropriate for the element

Ensure role attribute has an appropriate value for the element
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-role?application=axeAPI

- http://localhost:7500/home
  - `html`
- http://localhost:7500/library/4
  - `html`
- http://localhost:7500/library/5
  - `html`
- http://localhost:7500/library/6
  - `html`
- http://localhost:7500/library/4/series/6
  - `html`
- http://localhost:7500/library/5/series/9
  - `html`
- http://localhost:7500/library/6/series/11
  - `html`
- http://localhost:7500/library/4/series/6/manga/10
  - `html`
- http://localhost:7500/library/6/series/11/book/19
  - `html`
- http://localhost:7500/lists
  - `html`
- http://localhost:7500/lists/1
  - `html`
- http://localhost:7500/collections
  - `html`
- http://localhost:7500/bookmarks
  - `html`
- http://localhost:7500/want-to-read
  - `html`
- http://localhost:7500/all-series
  - `html`
- http://localhost:7500/browse
  - `html`
- http://localhost:7500/announcements
  - `html`
- http://localhost:7500/settings
  - `html`
- http://localhost:7500/profile
  - `html`

## Résultats incomplets à revoir (313)

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
- http://localhost:7500/library/4
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `.active > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/5"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/6"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - … +5 autres
- http://localhost:7500/library/5
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/4"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `.active > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/6"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - … +4 autres
- http://localhost:7500/library/6
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/4"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/5"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `.active > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - … +4 autres
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
- http://localhost:7500/library/5/series/9
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
  - … +13 autres
- http://localhost:7500/library/6/series/11
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
- http://localhost:7500/library/4/series/6/manga/10
  - `.toast-message`
- http://localhost:7500/library/6/series/11/book/19
  - `h1`
- http://localhost:7500/lists
  - `.side-nav-item[href$="home"] > .side-nav-text > div`
  - `a[href$="want-to-read"] > .side-nav-text > div`
  - `a[href$="collections"] > .side-nav-text > div`
  - `.active > .side-nav-text > div`
  - `a[href$="bookmarks"] > .side-nav-text > div`
  - `a[href$="all-series"] > .side-nav-text > div`
  - `a[href$="people"] > .side-nav-text > div`
  - `a[href$="library/4"] > .side-nav-text > div`
  - `a[href$="library/5"] > .side-nav-text > div`
  - `a[href$="library/6"] > .side-nav-text > div`
  - … +4 autres
- http://localhost:7500/lists/1
  - `.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/4"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/5"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/6"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - … +17 autres
- http://localhost:7500/collections
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `.active > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/4"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/5"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/6"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - … +8 autres
- http://localhost:7500/bookmarks
  - `.side-nav-item[href$="home"] > .side-nav-text > div`
  - `a[href$="want-to-read"] > .side-nav-text > div`
  - `a[href$="collections"] > .side-nav-text > div`
  - `a[href$="lists"] > .side-nav-text > div`
  - `.active > .side-nav-text > div`
  - `a[href$="all-series"] > .side-nav-text > div`
  - `a[href$="people"] > .side-nav-text > div`
  - `a[href$="library/4"] > .side-nav-text > div`
  - `a[href$="library/5"] > .side-nav-text > div`
  - `a[href$="library/6"] > .side-nav-text > div`
  - … +4 autres
- http://localhost:7500/want-to-read
  - `.side-nav-item[href$="home"] > .side-nav-text > div`
  - `.active > .side-nav-text > div`
  - `a[href$="collections"] > .side-nav-text > div`
  - `a[href$="lists"] > .side-nav-text > div`
  - `a[href$="bookmarks"] > .side-nav-text > div`
  - `a[href$="all-series"] > .side-nav-text > div`
  - `a[href$="people"] > .side-nav-text > div`
  - `a[href$="library/4"] > .side-nav-text > div`
  - `a[href$="library/5"] > .side-nav-text > div`
  - `a[href$="library/6"] > .side-nav-text > div`
  - … +3 autres
- http://localhost:7500/all-series
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `.active > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/4"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/5"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/6"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - … +17 autres
- http://localhost:7500/browse
  - `.side-nav-item[href$="home"] > .side-nav-text > div`
  - `a[href$="want-to-read"] > .side-nav-text > div`
  - `a[href$="collections"] > .side-nav-text > div`
  - `a[href$="lists"] > .side-nav-text > div`
  - `a[href$="bookmarks"] > .side-nav-text > div`
  - `a[href$="all-series"] > .side-nav-text > div`
  - `a[href$="people"] > .side-nav-text > div`
  - `a[href$="library/4"] > .side-nav-text > div`
  - `a[href$="library/5"] > .side-nav-text > div`
  - `a[href$="library/6"] > .side-nav-text > div`
- http://localhost:7500/announcements
  - `.side-nav-item[href$="home"] > .side-nav-text > div`
  - `a[href$="want-to-read"] > .side-nav-text > div`
  - `a[href$="collections"] > .side-nav-text > div`
  - `a[href$="lists"] > .side-nav-text > div`
  - `a[href$="bookmarks"] > .side-nav-text > div`
  - `a[href$="all-series"] > .side-nav-text > div`
  - `a[href$="people"] > .side-nav-text > div`
  - `a[href$="library/4"] > .side-nav-text > div`
  - `a[href$="library/5"] > .side-nav-text > div`
  - `a[href$="library/6"] > .side-nav-text > div`
  - … +2 autres
- http://localhost:7500/settings
  - `h5:nth-child(1)`
  - `#nav-item-account > .side-nav-text > div`
  - `#nav-item-preferences > .side-nav-text > div`
  - `#nav-item-custom-key-binds > .side-nav-text > div`
  - `#nav-item-reading-profiles > .side-nav-text > div`
  - `#nav-item-customize > .side-nav-text > div`
  - `#nav-item-clients > .side-nav-text > div`
  - `#nav-item-theme > .side-nav-text > div`
  - `#nav-item-font > .side-nav-text > div`
  - `#nav-item-devices > .side-nav-text > div`
  - … +20 autres
- http://localhost:7500/profile
  - `.side-nav-item[href$="home"] > .side-nav-text > div`
  - `a[href$="want-to-read"] > .side-nav-text > div`
  - `a[href$="collections"] > .side-nav-text > div`
  - `a[href$="lists"] > .side-nav-text > div`
  - `a[href$="bookmarks"] > .side-nav-text > div`
  - `a[href$="all-series"] > .side-nav-text > div`
  - `a[href$="people"] > .side-nav-text > div`
  - `a[href$="library/4"] > .side-nav-text > div`
  - `a[href$="library/5"] > .side-nav-text > div`
  - `a[href$="library/6"] > .side-nav-text > div`

### link-in-text-block — Links must be distinguishable without relying on color

- http://localhost:7500/bookmarks
  - `a[rel="noopener noreferrer"][target="_blank"][_ngcontent-ng-c2081018458=""]`

