# Audit accessibilité — 2026-10-08

**3 règle(s) violée(s), 34 occurrence(s), 19/19 scénario(s) audité(s), 0 erreur(s), 313 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d91cc8e30d68`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:7500/library/6/series/11/book/19
  - `.btn-secondary.me-1.btn-icon:nth-child(3)`
  - `.btn-secondary.me-1.btn-icon:nth-child(4)`
  - `.btn-secondary.me-1.btn-icon:nth-child(5)`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:7500/home
  - `.sidenav-bottom`
- http://localhost:7500/library/4
  - `.sidenav-bottom`
- http://localhost:7500/library/5
  - `.sidenav-bottom`
- http://localhost:7500/library/6
  - `.sidenav-bottom`
- http://localhost:7500/library/4/series/6
  - `.sidenav-bottom`
- http://localhost:7500/library/5/series/9
  - `.sidenav-bottom`
- http://localhost:7500/library/6/series/11
  - `.sidenav-bottom`
- http://localhost:7500/lists
  - `.sidenav-bottom`
- http://localhost:7500/lists/1
  - `.sidenav-bottom`
- http://localhost:7500/collections
  - `.sidenav-bottom`
- http://localhost:7500/bookmarks
  - `.sidenav-bottom`
- http://localhost:7500/want-to-read
  - `.sidenav-bottom`
- http://localhost:7500/all-series
  - `.sidenav-bottom`
- http://localhost:7500/browse
  - `.sidenav-bottom`
- http://localhost:7500/announcements
  - `.sidenav-bottom`
- http://localhost:7500/profile
  - `.sidenav-bottom`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:7500/home
  - `app-carousel-reel:nth-child(3) > .carousel-container.mb-3[_ngcontent-ng-c78859032=""] > div[_ngcontent-ng-c78859032=""]:nth-child(1) > h4`
- http://localhost:7500/library/4
  - `h4`
- http://localhost:7500/library/5
  - `h4`
- http://localhost:7500/library/6
  - `h4`
- http://localhost:7500/library/4/series/6
  - `h4`
- http://localhost:7500/library/5/series/9
  - `h4`
- http://localhost:7500/library/6/series/11
  - `h4`
- http://localhost:7500/lists
  - `h4`
- http://localhost:7500/lists/1
  - `h4`
- http://localhost:7500/collections
  - `h4`
- http://localhost:7500/bookmarks
  - `h4`
- http://localhost:7500/want-to-read
  - `h4`
- http://localhost:7500/all-series
  - `h4`
- http://localhost:7500/announcements
  - `h4`
- http://localhost:7500/settings
  - `app-change-username > app-setting-item > div[_ngcontent-ng-c3103186822=""] > .settings-row.g-0.row > .edit.setting-title.col-auto > .section-title`

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
  - `div > h1`
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
  - `.side-nav-header.mb-2:nth-child(1)`
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

