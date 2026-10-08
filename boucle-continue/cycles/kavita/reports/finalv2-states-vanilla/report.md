# Audit accessibilité — 2026-10-08

**13 règle(s) violée(s), 218 occurrence(s), 11/11 scénario(s) audité(s), 0 erreur(s), 236 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `7afd89de60d1`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:8200/home
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-Accessibility\ Field\ Manual`
  - `#actions-The\ Testing\ Chronicles`
  - `#actions-Beta\ Men`
  - `#actions-Test\ Comics\ Alpha`
  - `#actions-Solo\ Leveling`
  - … +2 autres
- http://localhost:8200/home [state:nav-user-menu]
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-Accessibility\ Field\ Manual`
  - `#actions-The\ Testing\ Chronicles`
  - `#actions-Beta\ Men`
  - `#actions-Test\ Comics\ Alpha`
  - `#actions-Solo\ Leveling`
  - … +2 autres
- http://localhost:8200/home [state:search-typeahead]
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-Accessibility\ Field\ Manual`
  - `#actions-The\ Testing\ Chronicles`
  - `#actions-Beta\ Men`
  - `#actions-Test\ Comics\ Alpha`
  - `#actions-Solo\ Leveling`
  - … +2 autres
- http://localhost:8200/home [state:search-config]
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-Accessibility\ Field\ Manual`
  - `#actions-The\ Testing\ Chronicles`
  - `#actions-Beta\ Men`
  - `#actions-Test\ Comics\ Alpha`
  - `#actions-Solo\ Leveling`
  - … +2 autres
- http://localhost:8200/library/1/series/2 [state:series-read-options]
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `.dropdown-toggle-split`
  - `.ms-2.col-auto[_ngcontent-ng-c1396006662=""]:nth-child(2) > .btn-actions`
  - `#edit-btn--komf`
  - `#actions-Attack\ on\ Test`
  - `app-download-button > .btn-actions`
  - … +2 autres
- http://localhost:8200/library/1/series/2 [state:series-tab-chapters]
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `.dropdown-toggle-split`
  - `.ms-2.col-auto[_ngcontent-ng-c1396006662=""]:nth-child(2) > .btn-actions`
  - `#edit-btn--komf`
  - `#actions-Attack\ on\ Test`
  - `app-download-button > .btn-actions`
  - … +2 autres
- http://localhost:8200/lists/1 [state:rl-tab-details]
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `.dropdown-toggle-split`
  - `.btn-actions.btn`
  - `#actions-Must\ Read`
  - `.btn-actions.col-auto.ms-2 > .btn-icon.btn`
- http://localhost:8200/profile/1 [state:profile-tab-stats]
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
- http://localhost:8200/home [state:mobile-nav-390]
  - `.btn-outline-secondary`
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-Accessibility\ Field\ Manual`
  - `#actions-The\ Testing\ Chronicles`
  - `#actions-Beta\ Men`
  - `#actions-Test\ Comics\ Alpha`
  - … +3 autres

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:8200/home [state:search-typeahead]
  - `#id-c4edb956-0231-4f03-8d4a-ba9ba6ed31e7-listbox`
- http://localhost:8200/library/1/series/2 [state:series-read-options]
  - `.nav-tabs`
- http://localhost:8200/library/1/series/2 [state:series-edit-modal]
  - `.nav-pills`
- http://localhost:8200/library/1/series/2 [state:series-tab-chapters]
  - `.nav-tabs`
- http://localhost:8200/lists/1 [state:rl-tab-details]
  - `.nav-tabs`
- http://localhost:8200/profile/1 [state:profile-tab-stats]
  - `.nav-tabs`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:8200/library/1/series/2 [state:series-read-options]
  - `#ngb-nav-2`
  - `#ngb-nav-3`
  - `#ngb-nav-1`
  - `#ngb-nav-0`
- http://localhost:8200/library/1/series/2 [state:series-edit-modal]
  - `#ngb-nav-4`
  - `#ngb-nav-9`
  - `#ngb-nav-10`
  - `#ngb-nav-11`
  - `#ngb-nav-12`
  - `#ngb-nav-5`
  - `#ngb-nav-6`
  - `#ngb-nav-7`
  - `#ngb-nav-8`
- http://localhost:8200/library/1/series/2 [state:series-tab-chapters]
  - `#ngb-nav-2`
  - `#ngb-nav-3`
  - `#ngb-nav-1`
  - `#ngb-nav-0`
- http://localhost:8200/lists/1 [state:rl-tab-details]
  - `#ngb-nav-0`
  - `#ngb-nav-1`
- http://localhost:8200/profile/1 [state:profile-tab-stats]
  - `#ngb-nav-0`
  - `#ngb-nav-1`
  - `#ngb-nav-2`
  - `#ngb-nav-3`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:8200/home
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8200/home [state:nav-user-menu]
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8200/home [state:search-typeahead]
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8200/home [state:search-config]
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8200/library/1/series/2 [state:series-read-options]
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8200/library/1/series/2 [state:series-tab-chapters]
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8200/lists/1 [state:rl-tab-details]
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8200/profile/1 [state:profile-tab-stats]
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:8200/home [state:mobile-nav-390]
  - `.navbar-brand`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.14/list?application=axeAPI

- http://localhost:8200/home
  - `ul`
- http://localhost:8200/home [state:nav-user-menu]
  - `ul`
- http://localhost:8200/home [state:search-typeahead]
  - `.navbar-nav`
- http://localhost:8200/home [state:search-config]
  - `.navbar-nav`
- http://localhost:8200/library/1/series/2 [state:series-read-options]
  - `.navbar-nav`
- http://localhost:8200/library/1/series/2 [state:series-tab-chapters]
  - `.navbar-nav`
- http://localhost:8200/lists/1 [state:rl-tab-details]
  - `.navbar-nav`
- http://localhost:8200/profile/1 [state:profile-tab-stats]
  - `.navbar-nav`
- http://localhost:8200/home [state:mobile-nav-390]
  - `ul`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:8200/library/1/series/2 [state:series-read-options]
  - `li:nth-child(1)`
  - `li:nth-child(2)`
  - `li:nth-child(3)`
  - `li:nth-child(4)`
- http://localhost:8200/library/1/series/2 [state:series-edit-modal]
  - `.nav-pills > li:nth-child(1)`
  - `.nav-pills > li:nth-child(2)`
  - `.nav-pills > li:nth-child(3)`
  - `.nav-pills > li:nth-child(4)`
  - `li:nth-child(5)`
  - `li:nth-child(6)`
  - `li:nth-child(7)`
  - `li:nth-child(8)`
  - `li:nth-child(9)`
- http://localhost:8200/library/1/series/2 [state:series-tab-chapters]
  - `li:nth-child(1)`
  - `li:nth-child(2)`
  - `li:nth-child(3)`
  - `li:nth-child(4)`
- http://localhost:8200/lists/1 [state:rl-tab-details]
  - `li:nth-child(1)`
  - `#details-tab`
- http://localhost:8200/profile/1 [state:profile-tab-stats]
  - `li:nth-child(1)`
  - `li:nth-child(2)`
  - `li:nth-child(3)`
  - `li:nth-child(4)`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:8200/home [state:search-typeahead]
  - `#id-c4edb956-0231-4f03-8d4a-ba9ba6ed31e7-series-group`
  - `#id-c4edb956-0231-4f03-8d4a-ba9ba6ed31e7-row-1 > .result-row.clickable.gap-2 > .body[_ngcontent-ng-c2929606411=""] > .subtitle.gap-1.d-flex > .text-truncate[_ngcontent-ng-c2929606411=""]`
  - `#id-c4edb956-0231-4f03-8d4a-ba9ba6ed31e7-row-1 > .result-row.clickable.gap-2 > .meta.ms-auto.flex-shrink-0`
  - `#id-c4edb956-0231-4f03-8d4a-ba9ba6ed31e7-row-2 > .result-row.clickable.gap-2 > .body[_ngcontent-ng-c2929606411=""] > .subtitle.gap-1.d-flex > .text-truncate[_ngcontent-ng-c2929606411=""]`
  - `#id-c4edb956-0231-4f03-8d4a-ba9ba6ed31e7-row-2 > .result-row.clickable.gap-2 > .meta.ms-auto.flex-shrink-0`
  - `#id-c4edb956-0231-4f03-8d4a-ba9ba6ed31e7-row-3 > .result-row.clickable.gap-2 > .body[_ngcontent-ng-c2929606411=""] > .subtitle.gap-1.d-flex > .text-truncate[_ngcontent-ng-c2929606411=""]`
  - `#id-c4edb956-0231-4f03-8d4a-ba9ba6ed31e7-row-3 > .result-row.clickable.gap-2 > .meta.ms-auto.flex-shrink-0`
- http://localhost:8200/library/1/series/2 [state:series-edit-modal]
  - `#ngb-nav-4`
  - `.btn-primary`
- http://localhost:8200/profile/1 [state:profile-tab-stats]
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

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-dialog-name?application=axeAPI

- http://localhost:8200/library/1 [state:card-actions]
  - `ngb-modal-window`
- http://localhost:8200/library/1/series/2 [state:series-edit-modal]
  - `ngb-modal-window`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-prohibited-attr?application=axeAPI

- http://localhost:8200/profile/1 [state:profile-tab-stats]
  - `#activity-level-0`
  - `#activity-level-1`
  - `#activity-level-2`
  - `#activity-level-3`
  - `#activity-level-4`

## [SERIOUS] scrollable-region-focusable — Scrollable region must have keyboard access

Ensure elements that have scrollable content are accessible by keyboard in Safari
Référence : https://dequeuniversity.com/rules/axe/4.14/scrollable-region-focusable?application=axeAPI

- http://localhost:8200/profile/1 [state:profile-tab-stats]
  - `.graph-wrapper`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:8200/home
  - `html`
- http://localhost:8200/home [state:nav-user-menu]
  - `html`
- http://localhost:8200/library/1/series/2 [state:series-read-options]
  - `html`
- http://localhost:8200/library/1/series/2 [state:series-tab-chapters]
  - `html`
- http://localhost:8200/lists/1 [state:rl-tab-details]
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:8200/library/1/series/2 [state:series-edit-modal]
  - `.row[_ngcontent-ng-c825986750=""]:nth-child(1) > .mb-3[_ngcontent-ng-c825986750=""] > app-setting-item > div[_ngcontent-ng-c3103186822=""] > .settings-row.g-0.row > .edit.setting-title.col-auto > h6`
- http://localhost:8200/profile/1 [state:profile-tab-stats]
  - `.mb-0[_ngcontent-ng-c320901677=""]:nth-child(1)`
  - `app-string-breakdown[translationkey="genre-breakdown"] > .card.p-4[_ngcontent-ng-c3390504575=""] > h6`
  - `app-string-breakdown[translationkey="tag-breakdown"] > .card.p-4[_ngcontent-ng-c3390504575=""] > h6`
  - `app-favorite-authors > .card.p-4.stats-card > h6`

## [MINOR] aria-allowed-role — ARIA role should be appropriate for the element

Ensure role attribute has an appropriate value for the element
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-role?application=axeAPI

- http://localhost:8200/home
  - `html`
- http://localhost:8200/home [state:nav-user-menu]
  - `html`
- http://localhost:8200/home [state:search-typeahead]
  - `html`
- http://localhost:8200/home [state:search-config]
  - `html`
- http://localhost:8200/library/1 [state:card-actions]
  - `html`
- http://localhost:8200/library/1/series/2 [state:series-read-options]
  - `html`
- http://localhost:8200/library/1/series/2 [state:series-edit-modal]
  - `html`
- http://localhost:8200/library/1/series/2 [state:series-tab-chapters]
  - `html`
- http://localhost:8200/lists/1 [state:rl-tab-details]
  - `html`
- http://localhost:8200/profile/1 [state:profile-tab-stats]
  - `html`
- http://localhost:8200/home [state:mobile-nav-390]
  - `html`

## Résultats incomplets à revoir (236)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8200/home
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - … +10 autres
- http://localhost:8200/home [state:nav-user-menu]
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - … +10 autres
- http://localhost:8200/home [state:search-typeahead]
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - … +10 autres
- http://localhost:8200/home [state:search-config]
  - `.active.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - … +10 autres
- http://localhost:8200/library/1 [state:card-actions]
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `.active > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/2"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/3"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - … +5 autres
- http://localhost:8200/library/1/series/2 [state:series-read-options]
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/1"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/2"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/3"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - … +14 autres
- http://localhost:8200/library/1/series/2 [state:series-edit-modal]
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/1"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/2"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/3"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - … +14 autres
- http://localhost:8200/library/1/series/2 [state:series-tab-chapters]
  - `.side-nav-item[href$="home"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/1"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/2"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/3"] > .side-nav-text > div[_ngcontent-ng-c31611253=""]`
  - … +14 autres
- http://localhost:8200/lists/1 [state:rl-tab-details]
  - `.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - … +9 autres
- http://localhost:8200/profile/1 [state:profile-tab-stats]
  - `.side-nav-item[href$="home"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="want-to-read"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="collections"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="lists"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="bookmarks"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="all-series"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="people"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/1"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/2"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - `a[href$="library/3"] > .side-nav-text[_ngcontent-ng-c31611253=""] > div[_ngcontent-ng-c31611253=""]`
  - … +31 autres
- http://localhost:8200/home [state:mobile-nav-390]
  - `app-carousel-reel:nth-child(3) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(1) > h4 > .section-title[href="javascript:void(0)"]`
  - `#entity-0 > .dark-exempt.btn-icon[href$="series/7"]`
  - `app-carousel-reel:nth-child(3) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(2) > swiper-container > .swiper-slide-next[aria-label="2 / 7"] > app-entity-card > .card-item-container.card[aria-label="The Testing Chronicles"] > .card-title-container > .card-title[placement="top"] > .dark-exempt.btn-icon[href$="series/6"]`
  - `app-carousel-reel:nth-child(4) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(1) > h4 > .section-title[href="javascript:void(0)"]`
  - `#entity-7 > .dark-exempt.btn-icon[href$="series/7"]`
  - `app-carousel-reel:nth-child(4) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(2) > swiper-container > .swiper-slide-next[aria-label="2 / 7"] > app-entity-card > .card-item-container.card[aria-label="The Testing Chronicles"] > .card-title-container > .card-title[placement="top"] > .dark-exempt.btn-icon[href$="series/6"]`

### aria-required-children — Certain ARIA roles must contain particular children

- http://localhost:8200/home [state:search-config]
  - `#id-98970b20-af57-42cb-983d-e0cdc459009d-listbox`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:8200/library/1 [state:card-actions]
  - `app-root`
- http://localhost:8200/library/1/series/2 [state:series-edit-modal]
  - `app-root`

