# Audit accessibilité — 2026-10-08

**9 règle(s) violée(s), 94 occurrence(s), 5/7 scénario(s) audité(s), 2 erreur(s), 109 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `2ac5fd0d9a81`

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
- http://localhost:7500/home [state:nav-user-menu]
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
- http://localhost:7500/home [state:search-typeahead]
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
- http://localhost:7500/home [state:search-config]
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
- http://localhost:7500/library/4/series/6 [state:series-read-options]
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

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:7500/home [state:search-typeahead]
  - `#id-d0b6b529-ed8a-420a-adfc-857c532fc1b9-listbox`
- http://localhost:7500/library/4/series/6 [state:series-read-options]
  - `.nav-tabs`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:7500/library/4/series/6 [state:series-read-options]
  - `#ngb-nav-2`
  - `#ngb-nav-3`
  - `#ngb-nav-1`
  - `#ngb-nav-0`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:7500/home
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/home [state:nav-user-menu]
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/home [state:search-typeahead]
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/home [state:search-config]
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/library/4/series/6 [state:series-read-options]
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.14/list?application=axeAPI

- http://localhost:7500/home
  - `ul`
- http://localhost:7500/home [state:nav-user-menu]
  - `ul`
- http://localhost:7500/home [state:search-typeahead]
  - `.navbar-nav`
- http://localhost:7500/home [state:search-config]
  - `.navbar-nav`
- http://localhost:7500/library/4/series/6 [state:series-read-options]
  - `.navbar-nav`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:7500/home [state:search-typeahead]
  - `#id-d0b6b529-ed8a-420a-adfc-857c532fc1b9-series-group`
  - `#id-d0b6b529-ed8a-420a-adfc-857c532fc1b9-row-1 > .result-row.clickable.gap-2 > .body[_ngcontent-ng-c2929606411=""] > .subtitle.gap-1.d-flex > .text-truncate[_ngcontent-ng-c2929606411=""]`
  - `#id-d0b6b529-ed8a-420a-adfc-857c532fc1b9-row-1 > .result-row.clickable.gap-2 > .meta.ms-auto.flex-shrink-0`
  - `#id-d0b6b529-ed8a-420a-adfc-857c532fc1b9-row-2 > .result-row.clickable.gap-2 > .body[_ngcontent-ng-c2929606411=""] > .subtitle.gap-1.d-flex > .text-truncate[_ngcontent-ng-c2929606411=""]`
  - `#id-d0b6b529-ed8a-420a-adfc-857c532fc1b9-row-2 > .result-row.clickable.gap-2 > .meta.ms-auto.flex-shrink-0`
  - `#id-d0b6b529-ed8a-420a-adfc-857c532fc1b9-row-3 > .result-row.clickable.gap-2 > .body[_ngcontent-ng-c2929606411=""] > .subtitle.gap-1.d-flex > .text-truncate[_ngcontent-ng-c2929606411=""]`
  - `#id-d0b6b529-ed8a-420a-adfc-857c532fc1b9-row-3 > .result-row.clickable.gap-2 > .meta.ms-auto.flex-shrink-0`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:7500/library/4/series/6 [state:series-read-options]
  - `li:nth-child(1)`
  - `li:nth-child(2)`
  - `li:nth-child(3)`
  - `li:nth-child(4)`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:7500/home
  - `html`
- http://localhost:7500/home [state:nav-user-menu]
  - `html`
- http://localhost:7500/library/4/series/6 [state:series-read-options]
  - `html`

## [MINOR] aria-allowed-role — ARIA role should be appropriate for the element

Ensure role attribute has an appropriate value for the element
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-role?application=axeAPI

- http://localhost:7500/home
  - `html`
- http://localhost:7500/home [state:nav-user-menu]
  - `html`
- http://localhost:7500/home [state:search-typeahead]
  - `html`
- http://localhost:7500/home [state:search-config]
  - `html`
- http://localhost:7500/library/4/series/6 [state:series-read-options]
  - `html`

## Résultats incomplets à revoir (109)

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

### aria-required-children — Certain ARIA roles must contain particular children

- http://localhost:7500/home [state:search-config]
  - `#id-7df399eb-dbfd-4346-941f-b0508deaa818-listbox`

## Erreurs (2) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:7500/library/4 [state:card-actions] — stateProof échoué (card-actions) : page.waitForSelector: Timeout 8000ms exceeded.
Call log:
  - waiting for locator('.dropdown-menu').locator('button, ngb-dropdown').locator('button') to be visible

- http://localhost:7500/home [state:mobile-nav-390] — stateProof échoué (mobile-nav-390) : page.waitForSelector: Timeout 8000ms exceeded.
Call log:
  - waiting for locator('app-side-nav') to be visible
    20 × locator resolved to hidden <app-side-nav _ngcontent-ng-c3892503704="">…</app-side-nav>


