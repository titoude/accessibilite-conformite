# Audit accessibilité — 2026-10-08

**5 règle(s) violée(s), 29 occurrence(s), 2/3 scénario(s) audité(s), 1 erreur(s), 21 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `93d6ba681b28`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

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
- http://localhost:7500/home [state:mobile-nav-390]
  - `.btn-outline-secondary`
  - `#actions-home`
  - `#actions-reading-lists`
  - `#actions-Kv45\ Manga`
  - `#actions-Kv45\ Comics`
  - `#actions-Kv45\ Books`
  - `#actions-The\ Testing\ Chronicles`
  - `#actions-Accessibility\ Field\ Manual`
  - `#actions-Test\ Comics\ Alpha`
  - `#actions-Beta\ Men`
  - … +3 autres

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:7500/library/4
  - `.side-nav-item[rel="noopener noreferrer"][target="_blank"]`
- http://localhost:7500/home [state:mobile-nav-390]
  - `.navbar-brand`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.14/list?application=axeAPI

- http://localhost:7500/library/4
  - `ul`
- http://localhost:7500/home [state:mobile-nav-390]
  - `ul`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:7500/library/4
  - `html`

## [MINOR] aria-allowed-role — ARIA role should be appropriate for the element

Ensure role attribute has an appropriate value for the element
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-role?application=axeAPI

- http://localhost:7500/library/4
  - `html`
- http://localhost:7500/home [state:mobile-nav-390]
  - `html`

## Résultats incomplets à revoir (21)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

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
- http://localhost:7500/home [state:mobile-nav-390]
  - `app-carousel-reel:nth-child(3) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(1) > h4 > .section-title[href="javascript:void(0)"]`
  - `#entity-0 > .dark-exempt.btn-icon[href="/library/6/series/12"]`
  - `#entity-1 > .dark-exempt.btn-icon[href="/library/6/series/11"]`
  - `app-carousel-reel:nth-child(4) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(1) > h4 > .section-title[href="javascript:void(0)"]`
  - `#entity-12 > .dark-exempt.btn-icon[href="/library/6/series/12"]`
  - `#entity-11 > .dark-exempt.btn-icon[href="/library/6/series/11"]`

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:7500/library/4 [state:card-actions] — stateProof échoué (card-actions) : page.waitForSelector: Timeout 8000ms exceeded.
Call log:
  - waiting for locator('.dropdown-menu').locator('button') to be visible


