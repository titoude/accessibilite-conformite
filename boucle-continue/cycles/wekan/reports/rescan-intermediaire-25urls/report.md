# Audit accessibilité — 2026-10-07

**1 règle(s) violée(s), 1 occurrence(s), 25/25 scénario(s) audité(s), 0 erreur(s), 111 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `2e5c1dbbe5c8`

## [MINOR] empty-heading — Headings should not be empty

Ensure headings have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/empty-heading?application=axeAPI

- http://localhost:5580/b/templates
  - `.header-page-title`

## Résultats incomplets à revoir (111)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:5580/
  - `a[data-type="remaining"] > .menu-count`
- http://localhost:5580/admin/people/people
  - `.new-user`
  - `th:nth-child(2)`
  - `th:nth-child(3)`
  - `th:nth-child(4)`
  - `th:nth-child(5)`
  - `th:nth-child(6)`
  - `th:nth-child(7)`
  - `th:nth-child(8)`
  - `th:nth-child(9)`
  - `.select-all-user > span`
  - … +4 autres
- http://localhost:5580/admin/people/roles
  - `th:nth-child(1)`
  - `th:nth-child(2)`
  - `th:nth-child(3)`
  - `th:nth-child(4)`
  - `th:nth-child(5)`
  - `th:nth-child(6)`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web
  - `.member > svg > text`
- http://localhost:5580/allboards
  - `a[data-type="starred"] > .menu-count`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web/c39wknCard000000001
  - `.minicard-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"] > svg > text`
  - `.card-details-item-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"] > svg > text`
  - `.card-details-item-creator > .js-member[title=" (audit.c39) Admin"][aria-label=" (audit.c39) Admin"] > svg > text`
  - `.card-details-show-lists > .card-details-item-title`
  - `.card-details-item-flow > .card-details-item-title`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:board-sidebar]
  - `.minicard-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"] > svg > text`
  - `.sidebar-xmark`
  - `a[title=" (audit.c39) Admin"] > svg > text`
  - `.board-widget-content > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"] > svg > text`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:board-filter-sidebar]
  - `.minicard-members > .member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"] > svg > text`
  - `.sidebar-xmark`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:board-search-sidebar]
  - `.member > svg > text`
  - `.sidebar-xmark`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:board-menu-popup]
  - `.minicard-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"] > svg > text`
  - `.sidebar-xmark`
  - `a[title=" (audit.c39) Admin"] > svg > text`
  - `.board-widget-content > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"] > svg > text`
  - `span[aria-hidden="true"]`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web/c39wknCard000000001 [state:card-details]
  - `.minicard-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"] > svg > text`
  - `.card-details-item-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"] > svg > text`
  - `.card-details-item-creator > .js-member[title=" (audit.c39) Admin"][aria-label=" (audit.c39) Admin"] > svg > text`
  - `.card-details-show-lists > .card-details-item-title`
  - `.card-details-item-flow > .card-details-item-title`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web/c39wknCard000000001 [state:card-details-menu]
  - `.minicard-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"] > svg > text`
  - `.card-details-item-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"] > svg > text`
  - `.card-details-item-creator > .js-member[title=" (audit.c39) Admin"][aria-label=" (audit.c39) Admin"] > svg > text`
  - `.card-details-show-lists > .card-details-item-title`
  - `.card-details-item-flow > .card-details-item-title`
  - `.js-set-card-recurrence-interval`
  - `span[aria-hidden="true"]`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:minicard-menu]
  - `.member > svg > text`
  - `span[aria-hidden="true"]`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:list-menu-popup]
  - `.member > svg > text`
  - `span[aria-hidden="true"]`
- http://localhost:5580/allboards [state:header-member-menu]
  - `a[data-type="starred"] > .menu-count`
  - `span[aria-hidden="true"]`
- http://localhost:5580/allboards [state:header-starred-boards]
  - `a[data-type="starred"] > .menu-count`
  - `.board-list-item`
  - `span[aria-hidden="true"]`
- http://localhost:5580/allboards [state:new-board-popup]
  - `a[data-type="starred"] > .menu-count`
  - `span[aria-hidden="true"]`
- http://localhost:5580/allboards [state:allboards-sidebar]
  - `.sidebar-xmark`
  - `a[data-type="starred"] > .menu-count`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web/c39wknCard000000001 [state:mobile-card-390]
  - `h2 > .viewer[dir="auto"] > p`
  - `a[title=" (audit.c39.member) Normal"] > svg > text`
  - `.card-details-item-creator > .js-member[title=" (audit.c39) Admin"][aria-label=" (audit.c39) Admin"] > svg > text`

### label-content-name-mismatch — Elements must have their visible text as part of their accessible name

- http://localhost:5580/
  - `.js-add-workspace`
- http://localhost:5580/admin/people/people
  - `a[aria-label="Change Avatar audit.c39.member"]`
  - `a[aria-label="Change Avatar audit.c39"]`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web
  - `.member`
- http://localhost:5580/allboards
  - `.js-add-workspace`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web/c39wknCard000000001
  - `.minicard-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"]`
  - `.card-details-item-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"]`
  - `.card-details-item-creator > .js-member[title=" (audit.c39) Admin"][aria-label=" (audit.c39) Admin"]`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:board-sidebar]
  - `.minicard-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"]`
  - `.sidebar-xmark`
  - `a[title=" (audit.c39) Admin"]`
  - `.board-widget-content > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"]`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:board-filter-sidebar]
  - `.minicard-members > .member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"]`
  - `.sidebar-xmark`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:board-search-sidebar]
  - `.member`
  - `.sidebar-xmark`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:board-menu-popup]
  - `.minicard-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"]`
  - `.sidebar-xmark`
  - `a[title=" (audit.c39) Admin"]`
  - `.board-widget-content > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"]`
  - `.js-date-popup-resize`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web/c39wknCard000000001 [state:card-details]
  - `.minicard-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"]`
  - `.card-details-item-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"]`
  - `.card-details-item-creator > .js-member[title=" (audit.c39) Admin"][aria-label=" (audit.c39) Admin"]`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web/c39wknCard000000001 [state:card-details-menu]
  - `.minicard-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"]`
  - `.card-details-item-members > .js-member[title=" (audit.c39.member) Normal"][aria-label=" (audit.c39.member) Normal"]`
  - `.card-details-item-creator > .js-member[title=" (audit.c39) Admin"][aria-label=" (audit.c39) Admin"]`
  - `.js-date-popup-resize`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:minicard-menu]
  - `.member`
  - `.js-date-popup-resize`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web [state:list-menu-popup]
  - `.member`
  - `.js-date-popup-resize`
- http://localhost:5580/allboards [state:header-member-menu]
  - `.js-add-workspace`
  - `.js-date-popup-resize`
- http://localhost:5580/allboards [state:header-starred-boards]
  - `.js-add-workspace`
  - `.js-date-popup-resize`
- http://localhost:5580/allboards [state:new-board-popup]
  - `.js-add-workspace`
  - `.js-date-popup-resize`
- http://localhost:5580/allboards [state:allboards-sidebar]
  - `.sidebar-xmark`
  - `.js-add-workspace`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web/c39wknCard000000001 [state:mobile-card-390]
  - `a[title=" (audit.c39.member) Normal"]`
  - `.card-details-item-creator > .js-member[title=" (audit.c39) Admin"][aria-label=" (audit.c39) Admin"]`

