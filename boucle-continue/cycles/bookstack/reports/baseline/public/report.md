# Audit accessibilité — 2026-10-05

**12 règle(s) violée(s), 239 occurrence(s), 13/13 scénario(s) audité(s), 0 erreur(s), 55 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `a09672159a4f`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://localhost:8080/books/demo-a11y-book/chapter/chapitre-demo-a11y
  - `.chapter-contents-list`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:8080/search
  - `input[name="search"]`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-attr?application=axeAPI

- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `button[data-tab="info"]`
  - `.active`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8080/shelves
  - `#actions > h5`
  - `button[name="view"] > span:nth-child(2)`
  - `a[href$="tags"] > span:nth-child(2)`
  - `#popular > h5`
  - `.pb-l`
  - `#new > h5`
  - `.bookshelf.entity-list-item[data-entity-id="340"] > .content > h4`
  - `.bookshelf.entity-list-item[data-entity-id="338"] > .content > h4`
  - `.bookshelf.entity-list-item[data-entity-id="339"] > .content > h4`
  - `.bookshelf.entity-list-item[data-entity-id="337"] > .content > h4`
- http://localhost:8080/books
  - `#actions > h5`
  - `button[name="view"] > span:nth-child(2)`
  - `a[href$="tags"] > span:nth-child(2)`
  - `#popular > h5`
  - `#popular > .entity-list.compact > .book.entity-list-item[data-entity-id="342"] > .content > h4`
  - `#new > h5`
  - `#new > .entity-list.compact > .book.entity-list-item[data-entity-id="342"] > .content > h4`
  - `.book.entity-list-item[data-entity-id="1"] > .content > h4`
  - `.book.entity-list-item[data-entity-id="17"] > .content > h4`
  - `.book.entity-list-item[data-entity-id="33"] > .content > h4`
- http://localhost:8080/books/demo-a11y-book
  - `.text-book.outline-hover[href$="books"] > span:nth-child(2)`
  - `.text-book.outline-hover.icon-list-item:nth-child(3) > span:nth-child(2)`
- http://localhost:8080/books/demo-a11y-book/chapter/chapitre-demo-a11y
  - `.mb-xl:nth-child(1) > h5`
  - `.entity-meta-item:nth-child(1) > div`
  - `.entity-meta-item:nth-child(1) > div > span[title="2026-10-05 00:08:12 UTC"]`
  - `.entity-meta-item:nth-child(1) > div > a`
  - `.entity-meta-item:nth-child(2) > div`
  - `.entity-meta-item:nth-child(2) > div > span[title="2026-10-05 00:08:12 UTC"]`
  - `.entity-meta-item:nth-child(2) > div > a`
  - `.actions > h5`
  - `button[aria-label="Export"] > span:nth-child(2)`
  - `input[refs="entity-search@searchInput"]`
  - … +11 autres
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `#page-details > h5`
  - `.entity-meta-item:nth-child(1)`
  - `.entity-meta-item:nth-child(2) > div`
  - `.entity-meta-item:nth-child(2) > div > span[title="2026-10-05 00:08:12 UTC"]`
  - `.entity-meta-item:nth-child(2) > div > a`
  - `.entity-meta-item:nth-child(3) > div`
  - `.entity-meta-item:nth-child(3) > div > span[title="2026-10-05 00:08:12 UTC"]`
  - `.entity-meta-item:nth-child(3) > div > a`
  - `#actions > h5`
  - `a[data-shortcut="revisions"] > span:nth-child(2)`
  - … +16 autres
- http://localhost:8080/ [state:menu-mobile]
  - `a[href$="search"]`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.13/link-in-text-block?application=axeAPI

- http://localhost:8080/books/demo-a11y-book
  - `p > a`
- http://localhost:8080/books/demo-a11y-book/chapter/chapitre-demo-a11y
  - `a[href$="example.org/"]`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `a[href$="example.com/"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://localhost:8080/ [state:menu-mobile]
  - `.mobile-menu-toggle`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8080/login
  - `.skip-to-content-link`
  - `h1`
  - `.stretch-inputs`
  - `.custom-checkbox`
  - `.label`
- http://localhost:8080/
  - `#recent-books > h3`
  - `a[data-entity-id="342"] > .content > h4`
  - `a[data-entity-id="1"] > .content > h4`
  - `a[data-entity-id="17"] > .content > h4`
  - `a[data-entity-id="33"] > .content > h4`
  - `a[data-entity-id="49"] > .content > h4`
  - `a[data-entity-id="65"] > .content > h4`
  - `a[data-entity-id="81"] > .content > h4`
  - `#recent-pages > h3`
  - `a[data-entity-id="345"] > .content > h4`
  - … +9 autres
- http://localhost:8080/books/demo-a11y-book/chapter/chapitre-demo-a11y
  - `.pt-xs`
  - `.no-hover.icon-list-item > span:nth-child(2)`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `.pt-xs`
  - `.no-hover.icon-list-item > span:nth-child(2)`
- http://localhost:8080/search
  - `h5`
  - `h6:nth-child(1)`
  - `input[name="search"]`
  - `form[method="get"] > h6:nth-child(3)`
  - `.form-group`
  - `h6:nth-child(5)`
  - `h6:nth-child(7)`
  - `h6:nth-child(9)`
  - `table:nth-child(10) > tbody > tr:nth-child(1)`
  - `table:nth-child(11) > tbody > tr:nth-child(1)`
  - … +49 autres
- http://localhost:8080/user/admin
  - `.right-focus > div:nth-child(1)`
  - `.content-wrap.auto-height:nth-child(1) > .half.v-center.grid > div:nth-child(1)`
  - `#content-counts > .text-muted`
  - `.text-page > span:nth-child(2)`
  - `.text-chapter > span:nth-child(2)`
  - `.text-book > span:nth-child(2)`
  - `.text-bookshelf > span:nth-child(2)`
  - `.book-contents.content-wrap.auto-height:nth-child(2)`
  - `.book-contents.content-wrap.auto-height:nth-child(3)`
  - `.book-contents.content-wrap.auto-height:nth-child(4)`
  - … +1 autres
- http://localhost:8080/ [state:suggestions-recherche]
  - `#recent-books > h3`
  - `.compact.entity-list > .book[data-entity-id="342"][data-entity-type="book"] > .content > h4`
  - `a[data-entity-id="1"] > .content > h4`
  - `a[data-entity-id="17"] > .content > h4`
  - `a[data-entity-id="33"] > .content > h4`
  - `a[data-entity-id="49"] > .content > h4`
  - `a[data-entity-id="65"] > .content > h4`
  - `a[data-entity-id="81"] > .content > h4`
  - `#recent-pages > h3`
  - `.compact.entity-list > .page[data-entity-id="345"][data-entity-type="page"] > .content > h4`
  - … +9 autres
- http://localhost:8080/ [state:menu-mobile]
  - `#recent-books > h3`
  - `a[data-entity-id="342"] > .content > h4`
  - `a[data-entity-id="1"] > .content > h4`
  - `a[data-entity-id="17"] > .content > h4`
  - `a[data-entity-id="33"] > .content > h4`
  - `a[data-entity-id="49"] > .content > h4`
  - `a[data-entity-id="65"] > .content > h4`
  - `a[data-entity-id="81"] > .content > h4`
  - `#recent-pages > h3`
  - `a[data-entity-id="345"] > .content > h4`
  - … +9 autres

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:8080/login
  - `html`
- http://localhost:8080/
  - `html`
- http://localhost:8080/search
  - `html`
- http://localhost:8080/user/admin
  - `html`
- http://localhost:8080/ [state:suggestions-recherche]
  - `html`
- http://localhost:8080/ [state:menu-mobile]
  - `html`
- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `html`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://localhost:8080/shelves
  - `.tri-layout-right-contents`
- http://localhost:8080/books
  - `.tri-layout-right-contents`
- http://localhost:8080/books/demo-a11y-book
  - `form[component="global-search"]`
  - `.tri-layout-right-contents`
- http://localhost:8080/books/demo-a11y-book/chapter/chapitre-demo-a11y
  - `form[component="global-search"]`
  - `.tri-layout-right-contents`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `.tri-layout-right-contents`
- http://localhost:8080/search
  - `.header-links`
- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `.tri-layout-right-contents`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:8080/
  - `html`
- http://localhost:8080/user/admin
  - `html`
- http://localhost:8080/ [state:suggestions-recherche]
  - `html`
- http://localhost:8080/ [state:menu-mobile]
  - `html`
- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://localhost:8080/books/demo-a11y-book
  - `.has-children > .content > h4`
- http://localhost:8080/books/demo-a11y-book/chapter/chapitre-demo-a11y
  - `.entity-list.book-contents > .page[data-entity-id="345"][data-entity-type="page"] > .content > h4`
- http://localhost:8080/search
  - `.content-wrap > h6`

## [MODERATE] skip-link — The skip-link target should exist and be focusable

Ensure all skip links have a focusable target
Référence : https://dequeuniversity.com/rules/axe/4.13/skip-link?application=axeAPI

- http://localhost:8080/login
  - `.skip-to-content-link`

## Résultats incomplets à revoir (55)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### target-size — All touch targets must be 24px large, or leave sufficient space

- http://localhost:8080/login
  - `#header-search-box-button`
- http://localhost:8080/
  - `#header-search-box-button`
- http://localhost:8080/shelves
  - `#header-search-box-button`
- http://localhost:8080/books
  - `#header-search-box-button`
- http://localhost:8080/books/demo-a11y-book
  - `#header-search-box-button`
  - `.flexible > button[type="submit"][aria-label="Search"]`
- http://localhost:8080/books/demo-a11y-book/chapter/chapitre-demo-a11y
  - `#header-search-box-button`
  - `.flexible > button[type="submit"][aria-label="Search"]`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `#header-search-box-button`
- http://localhost:8080/tags
  - `#header-search-box-button`
- http://localhost:8080/search
  - `#header-search-box-button`
- http://localhost:8080/user/admin
  - `#header-search-box-button`
- http://localhost:8080/ [state:suggestions-recherche]
  - `#header-search-box-button`
- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `.flexible > button[type="submit"][aria-label="Search"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8080/books/demo-a11y-book
  - `.mb-xl:nth-child(1) > h5`
  - `.entity-meta-item:nth-child(1) > div`
  - `.entity-meta-item:nth-child(1) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(1) > div > a`
  - `.entity-meta-item:nth-child(2) > div`
  - `.entity-meta-item:nth-child(2) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(2) > div > a`
  - `.actions > h5`
  - `button[aria-label="Export"] > span:nth-child(2)`
  - `input[refs="entity-search@searchInput"]`
  - … +24 autres
- http://localhost:8080/ [state:suggestions-recherche]
  - `#recent-pages > h3`
  - `.compact.entity-list > .page[data-entity-id="345"][data-entity-type="page"] > .content > h4`
  - `.compact.entity-list > .page[data-entity-id="344"][data-entity-type="page"] > .content > h4`
  - `a[data-entity-id="281"] > .content > h4`
  - `a[data-entity-id="280"] > .content > h4`
- http://localhost:8080/ [state:menu-mobile]
  - `button[role=""] > span:nth-child(2)`

### skip-link — The skip-link target should exist and be focusable

- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `.skip-to-content-link`

