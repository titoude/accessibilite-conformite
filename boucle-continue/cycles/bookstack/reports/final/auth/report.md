# Audit accessibilité — 2026-10-05

**0 règle(s) violée(s), 0 occurrence(s), 21/21 scénario(s) audité(s), 0 erreur(s), 193 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `3930e93d4089`

## Résultats incomplets à revoir (193)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8080/books
  - `#actions > .h5`
  - `a[data-shortcut="new"] > span:nth-child(2)`
  - `button[name="view"] > span:nth-child(2)`
  - `a[href$="tags"] > span:nth-child(2)`
  - `a[href$="import"] > span:nth-child(2)`
  - `#recents > .h5`
  - `#recents > .entity-list.compact > .book.entity-list-item[data-entity-id="342"] > .content > .entity-list-item-name.break-text`
  - `#popular > .h5`
  - `#popular > .entity-list.compact > .book.entity-list-item[data-entity-id="342"] > .content > .entity-list-item-name.break-text`
  - `#new > .h5`
  - … +4 autres
- http://localhost:8080/books/demo-a11y-book
  - `.mb-xl:nth-child(1) > h2`
  - `.entity-meta-item:nth-child(1) > div`
  - `.entity-meta-item:nth-child(1) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(1) > div > a`
  - `.entity-meta-item:nth-child(2) > div`
  - `.entity-meta-item:nth-child(2) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(2) > div > a`
  - `.actions > h2`
  - `.icon-list-item[data-shortcut="new"]:nth-child(1) > span:nth-child(2)`
  - `.icon-list-item[data-shortcut="new"]:nth-child(2) > span:nth-child(2)`
  - … +33 autres
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `#page-details > .h5`
  - `.entity-meta-item:nth-child(1)`
  - `.entity-meta-item:nth-child(2) > div`
  - `.entity-meta-item:nth-child(2) > div > span[title="2026-10-05 00:08:12 UTC"]`
  - `.entity-meta-item:nth-child(2) > div > a`
  - `.entity-meta-item:nth-child(3) > div`
  - `.entity-meta-item:nth-child(3) > div > span[title="2026-10-05 00:08:12 UTC"]`
  - `.entity-meta-item:nth-child(3) > div > a`
  - `#actions > .h5`
  - `a[data-shortcut="edit"] > span:nth-child(2)`
  - … +16 autres
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit
  - `.tox-tbtn__select-label`
- http://localhost:8080/books/demo-a11y-book/sort
  - `#auto-sort`
- http://localhost:8080/my-account/profile
  - `#user-language`
- http://localhost:8080/books/demo-a11y-book [state:menu-export]
  - `.mb-xl:nth-child(1) > h2`
  - `.entity-meta-item:nth-child(1) > div`
  - `.entity-meta-item:nth-child(1) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(1) > div > a`
  - `.entity-meta-item:nth-child(2) > div`
  - `.entity-meta-item:nth-child(2) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(2) > div > a`
  - `.actions > h2`
  - `.icon-list-item[data-shortcut="new"]:nth-child(1) > span:nth-child(2)`
  - `.icon-list-item[data-shortcut="new"]:nth-child(2) > span:nth-child(2)`
  - … +43 autres
- http://localhost:8080/books/demo-a11y-book [state:recherche-fil]
  - `.mb-xl:nth-child(1) > h2`
  - `.entity-meta-item:nth-child(1) > div`
  - `.entity-meta-item:nth-child(1) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(1) > div > a`
  - `.entity-meta-item:nth-child(2) > div`
  - `.entity-meta-item:nth-child(2) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(2) > div > a`
  - `.actions > h2`
  - `.icon-list-item[data-shortcut="new"]:nth-child(1) > span:nth-child(2)`
  - `.icon-list-item[data-shortcut="new"]:nth-child(2) > span:nth-child(2)`
  - … +38 autres
- http://localhost:8080/ [state:suggestions-recherche]
  - `#recent-pages > h2`
  - `.compact.entity-list > .page[data-entity-id="345"][data-entity-type="page"] > .content > .entity-list-item-name.break-text`
  - `#recently-updated-pages > .compact.entity-list > .page[data-entity-id="344"][data-entity-type="page"] > .content > .entity-list-item-name.break-text`

### frame-tested — Frames should be tested with axe-core

- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit
  - `#html-editor_ifr`

### skip-link — The skip-link target should exist and be focusable

- http://localhost:8080/ [state:menu-profil]
  - `.skip-to-content-link`
- http://localhost:8080/ [state:menu-mobile]
  - `.skip-to-content-link`

