# Audit accessibilité — 2026-10-05

**18 règle(s) violée(s), 305 occurrence(s), 22/22 scénario(s) audité(s), 0 erreur(s), 218 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `25c366e73d08`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://localhost:8080/ [state:menu-profil]
  - `ul`
- http://localhost:8080/books/demo-a11y-book [state:menu-export]
  - `.wide`
- http://localhost:8080/books/demo-a11y-book [state:recherche-fil]
  - `.dropdown-search-list`
- http://localhost:8080/ [state:menu-mobile]
  - `ul`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-parent?application=axeAPI

- http://localhost:8080/ [state:menu-profil]
  - `a[data-shortcut="favourites_view"]`
  - `a[data-shortcut="profile_view"]`
  - `li:nth-child(3) > .icon-item[role="menuitem"]`
  - `button[data-shortcut="logout"]`
- http://localhost:8080/books/demo-a11y-book [state:menu-export]
  - `li:nth-child(1) > .label-item[target="_blank"][role="menuitem"]`
  - `li:nth-child(2) > .label-item[target="_blank"][role="menuitem"]`
  - `li:nth-child(3) > .label-item[target="_blank"][role="menuitem"]`
  - `li:nth-child(4) > .label-item[target="_blank"][role="menuitem"]`
  - `li:nth-child(5) > .label-item[target="_blank"][role="menuitem"]`
- http://localhost:8080/ [state:menu-mobile]
  - `a[data-shortcut="favourites_view"]`
  - `a[data-shortcut="profile_view"]`
  - `li:nth-child(3) > .icon-item[role="menuitem"]`
  - `button[data-shortcut="logout"]`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-attr?application=axeAPI

- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `button[data-tab="info"]`
  - `.active`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y [state:onglets-commentaires]
  - `.active`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:8080/search
  - `input[name="search"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8080/books/demo-a11y-book
  - `.text-book.outline-hover[href$="books"] > span:nth-child(2)`
  - `.text-book.outline-hover.icon-list-item:nth-child(3) > span:nth-child(2)`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `.text-book.outline-hover[href$="books"] > span:nth-child(2)`
  - `.text-book.outline-hover.icon-list-item:nth-child(3) > span:nth-child(2)`
  - `.text-page.outline-hover.icon-list-item > span:nth-child(2)`
  - `.pt-xs`
  - `.no-hover.icon-list-item > span:nth-child(2)`
  - `#comment-tab-archived`
  - `.bold`
- http://localhost:8080/books/demo-a11y-book/edit
  - `.text-book.icon-list-item[href$="books"] > span:nth-child(2)`
  - `.text-book.icon-list-item.outline-hover:nth-child(3) > span:nth-child(2)`
  - `.icon-list-item.outline-hover:nth-child(5) > span:nth-child(2)`
- http://localhost:8080/books/demo-a11y-book/sort
  - `.icon-list-item.outline-hover[href$="books"] > span:nth-child(2)`
  - `.icon-list-item.outline-hover.text-book:nth-child(3) > span:nth-child(2)`
  - `.icon-list-item.outline-hover:nth-child(5) > span:nth-child(2)`
- http://localhost:8080/settings/features
  - `.in-sidebar > .active`
- http://localhost:8080/my-account/profile
  - `.active`
- http://localhost:8080/ [state:menu-profil]
  - `a[data-shortcut="favourites_view"] > div`
- http://localhost:8080/books/demo-a11y-book [state:menu-export]
  - `.text-book.outline-hover[href$="books"] > span:nth-child(2)`
  - `.text-book.outline-hover.icon-list-item:nth-child(3) > span:nth-child(2)`
- http://localhost:8080/ [state:menu-mobile]
  - `a[href$="search"]`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y [state:onglets-commentaires]
  - `.pt-xs`
  - `.no-hover.icon-list-item > span:nth-child(2)`
  - `#comment-tab-active`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit [state:onglet-editeur]
  - `.small.text-muted > .text-warn`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.13/link-in-text-block?application=axeAPI

- http://localhost:8080/books/demo-a11y-book
  - `p > a`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `a[href$="example.com/"]`
- http://localhost:8080/books/demo-a11y-book [state:menu-export]
  - `p > a`
- http://localhost:8080/books/demo-a11y-book [state:recherche-fil]
  - `p > a`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.13/listitem?application=axeAPI

- http://localhost:8080/ [state:menu-profil]
  - `li:nth-child(1)`
  - `li:nth-child(2)`
  - `li:nth-child(3)`
  - `li:nth-child(5)`
  - `li:nth-child(7)`
- http://localhost:8080/books/demo-a11y-book [state:menu-export]
  - `.wide > li:nth-child(1)`
  - `.wide > li:nth-child(2)`
  - `.wide > li:nth-child(3)`
  - `.wide > li:nth-child(4)`
  - `.wide > li:nth-child(5)`
- http://localhost:8080/ [state:menu-mobile]
  - `li:nth-child(1)`
  - `li:nth-child(2)`
  - `li:nth-child(3)`
  - `li:nth-child(5)`
  - `li:nth-child(7)`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://localhost:8080/ [state:menu-profil]
  - `.user-name`
  - `.icon-list-item.text-link[role=""]`
- http://localhost:8080/books/demo-a11y-book [state:recherche-fil]
  - `.outline-hover.text-book[href$="books"]`
  - `.dropdown-search-toggle-breadcrumb`
- http://localhost:8080/ [state:menu-mobile]
  - `.mobile-menu-toggle`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/label-title-only?application=axeAPI

- http://localhost:8080/settings/users
  - `input[name="search"]`
- http://localhost:8080/settings/roles
  - `input[name="search"]`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y [state:onglets-commentaires]
  - `.text-book.outline-hover[href$="books"]`
  - `.text-book.outline-hover.icon-list-item:nth-child(3)`
  - `.text-page.outline-hover.icon-list-item`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit [state:onglet-editeur]
  - `.inline.block > .icon-list-item.text-link`

## [SERIOUS] document-title — Documents must have <title> element to aid in navigation

Ensure each HTML document contains a non-empty <title> element
Référence : https://dequeuniversity.com/rules/axe/4.13/document-title?application=axeAPI

- http://localhost:8080/templates
  - `html`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=axeAPI

- http://localhost:8080/templates
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8080/
  - `#recently-viewed > h3`
  - `#recently-viewed > .px-m > .entity-list.compact > .page[data-entity-id="344"][data-entity-type="page"] > .content > h4`
  - `.book > .content > h4`
  - `#recent-pages > h3`
  - `a[data-entity-id="345"] > .content > h4`
  - `#recently-updated-pages > .entity-list.compact > .page[data-entity-id="344"][data-entity-type="page"] > .content > h4`
  - `a[data-entity-id="281"] > .content > h4`
  - `a[data-entity-id="280"] > .content > h4`
  - `a[data-entity-id="279"] > .content > h4`
  - `a[data-entity-id="278"] > .content > h4`
  - … +4 autres
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `.pt-xs`
  - `.no-hover.icon-list-item > span:nth-child(2)`
- http://localhost:8080/books/demo-a11y-book/edit
  - `h2`
  - `.content-wrap.auto-height.card:nth-child(3) > p`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit
  - `.icon-list-item.text-link > .hide-under-l`
  - `.title-input`
- http://localhost:8080/books/demo-a11y-book/sort
  - `h1`
  - `.gap-m`
  - `.text-chapter > .flex-container-row.items-center > .px-none.no-hover.entity-list-item > div`
  - `li[data-id="345"] > .px-none.no-hover.entity-list-item > span:nth-child(2)`
  - `li[data-id="344"] > .flex-container-row.items-center > .px-none.no-hover.entity-list-item > div`
  - `.list > .outline.button`
- http://localhost:8080/settings/features
  - `h5:nth-child(1)`
  - `.mt-xl`
  - `.py-xs`
  - `#features`
  - `.half.gap-xl.grid:nth-child(1) > div:nth-child(1)`
  - `#toggle-switch-label-setting-app-public > .custom-checkbox.text-primary[role="checkbox"]`
  - `#toggle-switch-label-setting-app-public > .label`
  - `.half.gap-xl.grid:nth-child(2) > div:nth-child(1)`
  - `#toggle-switch-label-setting-app-secure-images > .custom-checkbox.text-primary[role="checkbox"]`
  - `#toggle-switch-label-setting-app-secure-images > .label`
  - … +3 autres
- http://localhost:8080/settings/roles
  - `.half`
  - `p`
  - `.gap-m > div:nth-child(1)`
  - `.list-sort-label`
  - `.item-list`
- http://localhost:8080/my-account/profile
  - `h5`
  - `.justify-space-between.gap-l.wrap`
  - `.text-muted.mb-none.text-small`
  - `.setting-list > .gap-l.wrap.flex-container-row`
  - `.setting-list > div:nth-child(2)`
  - `.gap-xl.half.grid:nth-child(3) > div:nth-child(1)`
  - `.half.grid > .text-center:nth-child(1)`
  - `#profile_image`
  - `label[for="profile_image"]`
  - `.v-center`
  - … +2 autres
- http://localhost:8080/search
  - `h5`
  - `h6:nth-child(1)`
  - `input[name="search"]`
  - `form[method="get"] > h6:nth-child(3)`
  - `.form-group`
  - `h6:nth-child(5)`
  - `h6:nth-child(7)`
  - `h6:nth-child(9)`
  - `label:nth-child(10)`
  - `label:nth-child(11)`
  - … +56 autres
- http://localhost:8080/ [state:menu-profil]
  - `#recently-viewed > h3`
  - `#recently-viewed > .px-m > .entity-list.compact > .page[data-entity-id="344"][data-entity-type="page"] > .content > h4`
  - `.book > .content > h4`
  - `#recent-pages > h3`
  - `a[data-entity-id="345"] > .content > h4`
  - `#recently-updated-pages > .entity-list.compact > .page[data-entity-id="344"][data-entity-type="page"] > .content > h4`
  - `a[data-entity-id="281"] > .content > h4`
  - `a[data-entity-id="280"] > .content > h4`
  - `a[data-entity-id="279"] > .content > h4`
  - `a[data-entity-id="278"] > .content > h4`
  - … +4 autres
- http://localhost:8080/ [state:suggestions-recherche]
  - `#recently-viewed > h3`
  - `.compact.entity-list > .book[data-entity-type="book"][data-entity-id="342"] > .content > h4`
  - `#recently-viewed > .px-m > .compact.entity-list > .page[data-entity-id="344"][data-entity-type="page"] > .content > h4`
  - `#recent-pages > h3`
  - `.compact.entity-list > .page[data-entity-id="345"][data-entity-type="page"] > .content > h4`
  - `#recently-updated-pages > .compact.entity-list > .page[data-entity-id="344"][data-entity-type="page"] > .content > h4`
  - `a[data-entity-id="281"] > .content > h4`
  - `a[data-entity-id="280"] > .content > h4`
  - `a[data-entity-id="279"] > .content > h4`
  - `a[data-entity-id="278"] > .content > h4`
  - … +4 autres
- http://localhost:8080/ [state:menu-mobile]
  - `#recently-viewed > h3`
  - `.book > .content > h4`
  - `#recently-viewed > .px-m > .entity-list.compact > .page[data-entity-id="344"][data-entity-type="page"] > .content > h4`
  - `#recent-pages > h3`
  - `a[data-entity-id="345"] > .content > h4`
  - `#recently-updated-pages > .entity-list.compact > .page[data-entity-id="344"][data-entity-type="page"] > .content > h4`
  - `a[data-entity-id="281"] > .content > h4`
  - `a[data-entity-id="280"] > .content > h4`
  - `a[data-entity-id="279"] > .content > h4`
  - `a[data-entity-id="278"] > .content > h4`
  - … +4 autres
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y [state:onglets-commentaires]
  - `.pt-xs`
  - `.no-hover.icon-list-item > span:nth-child(2)`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit [state:onglet-editeur]
  - `div[data-tab-content="files"] > h4`
  - `.relative > .small.text-muted`
  - `.relative > div:nth-child(4)`
  - `div[refs="attachments@list-panel"]`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:8080/
  - `html`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit
  - `html`
- http://localhost:8080/settings/features
  - `html`
- http://localhost:8080/settings/roles
  - `html`
- http://localhost:8080/my-account/profile
  - `html`
- http://localhost:8080/search
  - `html`
- http://localhost:8080/templates
  - `html`
- http://localhost:8080/ [state:menu-profil]
  - `html`
- http://localhost:8080/ [state:suggestions-recherche]
  - `html`
- http://localhost:8080/ [state:menu-mobile]
  - `html`
- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `html`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit [state:onglet-editeur]
  - `html`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://localhost:8080/books
  - `.tri-layout-right-contents`
- http://localhost:8080/books/demo-a11y-book
  - `form[component="global-search"]`
  - `.tri-layout-right-contents`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `.tri-layout-right-contents`
- http://localhost:8080/settings/features
  - `.header-links`
- http://localhost:8080/settings/users
  - `.header-links`
- http://localhost:8080/settings/roles
  - `.header-links`
- http://localhost:8080/my-account/profile
  - `.header-links`
- http://localhost:8080/search
  - `.header-links`
- http://localhost:8080/books/demo-a11y-book [state:menu-export]
  - `form[component="global-search"]`
  - `.tri-layout-right-contents`
- http://localhost:8080/books/demo-a11y-book [state:recherche-fil]
  - `form[component="global-search"]`
  - `.tri-layout-right-contents`
- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `.tri-layout-right-contents`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:8080/
  - `html`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit
  - `html`
- http://localhost:8080/templates
  - `html`
- http://localhost:8080/ [state:menu-profil]
  - `html`
- http://localhost:8080/ [state:suggestions-recherche]
  - `html`
- http://localhost:8080/ [state:menu-mobile]
  - `html`
- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `html`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit [state:onglet-editeur]
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://localhost:8080/books/demo-a11y-book
  - `.has-children > .content > h4`
- http://localhost:8080/books/demo-a11y-book/sort
  - `h5`
  - `h4`
- http://localhost:8080/search
  - `.content-wrap > h6`
- http://localhost:8080/books/demo-a11y-book [state:menu-export]
  - `.has-children > .content > h4`
- http://localhost:8080/books/demo-a11y-book [state:recherche-fil]
  - `.has-children > .content > h4`

## [MINOR] image-redundant-alt — Alternative text of images should not be repeated as text

Ensure image alternative is not repeated as text
Référence : https://dequeuniversity.com/rules/axe/4.13/image-redundant-alt?application=axeAPI

- http://localhost:8080/
  - `img[alt="Admin"]`
- http://localhost:8080/favourites
  - `.avatar`
- http://localhost:8080/books
  - `.avatar`
- http://localhost:8080/books/demo-a11y-book
  - `img[alt="Admin"]`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `img[alt="Admin"]`
- http://localhost:8080/books/demo-a11y-book/edit
  - `.avatar`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit
  - `img[alt="Admin"]`
- http://localhost:8080/books/demo-a11y-book/sort
  - `.avatar`
- http://localhost:8080/settings/features
  - `.avatar`
- http://localhost:8080/settings/users
  - `.user-name > .avatar[alt="Admin"]`
- http://localhost:8080/settings/roles
  - `.avatar`
- http://localhost:8080/my-account/profile
  - `img[alt="Admin"]`
- http://localhost:8080/search
  - `.avatar`
- http://localhost:8080/ [state:menu-profil]
  - `img[alt="Admin"]`
- http://localhost:8080/books/demo-a11y-book [state:menu-export]
  - `img[alt="Admin"]`
- http://localhost:8080/books/demo-a11y-book [state:recherche-fil]
  - `img[alt="Admin"]`
- http://localhost:8080/ [state:suggestions-recherche]
  - `img[alt="Admin"]`

## Résultats incomplets à revoir (218)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### target-size — All touch targets must be 24px large, or leave sufficient space

- http://localhost:8080/
  - `#header-search-box-button`
- http://localhost:8080/favourites
  - `#header-search-box-button`
- http://localhost:8080/books
  - `#header-search-box-button`
- http://localhost:8080/books/demo-a11y-book
  - `#header-search-box-button`
  - `.flexible > button[aria-label="Search"][type="submit"]`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y
  - `#header-search-box-button`
- http://localhost:8080/books/demo-a11y-book/edit
  - `#header-search-box-button`
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit
  - `#header-search-box-button`
- http://localhost:8080/books/demo-a11y-book/sort
  - `#header-search-box-button`
- http://localhost:8080/settings/features
  - `#header-search-box-button`
- http://localhost:8080/settings/users
  - `#header-search-box-button`
- http://localhost:8080/settings/roles
  - `#header-search-box-button`
- http://localhost:8080/my-account/profile
  - `#header-search-box-button`
- http://localhost:8080/search
  - `#header-search-box-button`
- http://localhost:8080/ [state:menu-profil]
  - `#header-search-box-button`
- http://localhost:8080/books/demo-a11y-book [state:menu-export]
  - `#header-search-box-button`
  - `.flexible > button[aria-label="Search"][type="submit"]`
- http://localhost:8080/books/demo-a11y-book [state:recherche-fil]
  - `#header-search-box-button`
  - `.flexible > button[aria-label="Search"][type="submit"]`
- http://localhost:8080/ [state:suggestions-recherche]
  - `#header-search-box-button`
- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `.flexible > button[aria-label="Search"][type="submit"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8080/books
  - `#actions > h5`
  - `a[data-shortcut="new"] > span:nth-child(2)`
  - `button[name="view"] > span:nth-child(2)`
  - `a[href$="tags"] > span:nth-child(2)`
  - `a[href$="import"] > span:nth-child(2)`
  - `#recents > h5`
  - `#recents > .entity-list.compact > .book.entity-list-item[data-entity-id="342"] > .content > h4`
  - `#popular > h5`
  - `#popular > .entity-list.compact > .book.entity-list-item[data-entity-id="342"] > .content > h4`
  - `#new > h5`
  - … +4 autres
- http://localhost:8080/books/demo-a11y-book
  - `.mb-xl:nth-child(1) > h5`
  - `.entity-meta-item:nth-child(1) > div`
  - `.entity-meta-item:nth-child(1) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(1) > div > a`
  - `.entity-meta-item:nth-child(2) > div`
  - `.entity-meta-item:nth-child(2) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(2) > div > a`
  - `.actions > h5`
  - `.icon-list-item[data-shortcut="new"]:nth-child(1) > span:nth-child(2)`
  - `.icon-list-item[data-shortcut="new"]:nth-child(2) > span:nth-child(2)`
  - … +33 autres
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
  - `a[data-shortcut="edit"] > span:nth-child(2)`
  - … +16 autres
- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit
  - `.tox-tbtn__select-label`
- http://localhost:8080/books/demo-a11y-book/sort
  - `#auto-sort`
- http://localhost:8080/my-account/profile
  - `#user-language`
- http://localhost:8080/ [state:menu-profil]
  - `a[href$="settings"]`
  - `.name`
  - `.icon-list-item.text-link[role=""] > span:nth-child(2)`
  - `.activity-list-item:nth-child(1) > div:nth-child(2) > a:nth-child(2)`
- http://localhost:8080/books/demo-a11y-book [state:menu-export]
  - `.mb-xl:nth-child(1) > h5`
  - `.entity-meta-item:nth-child(1) > div`
  - `.entity-meta-item:nth-child(1) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(1) > div > a`
  - `.entity-meta-item:nth-child(2) > div`
  - `.entity-meta-item:nth-child(2) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(2) > div > a`
  - `.actions > h5`
  - `.icon-list-item[data-shortcut="new"]:nth-child(1) > span:nth-child(2)`
  - `.icon-list-item[data-shortcut="new"]:nth-child(2) > span:nth-child(2)`
  - … +43 autres
- http://localhost:8080/books/demo-a11y-book [state:recherche-fil]
  - `.mb-xl:nth-child(1) > h5`
  - `.entity-meta-item:nth-child(1) > div`
  - `.entity-meta-item:nth-child(1) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(1) > div > a`
  - `.entity-meta-item:nth-child(2) > div`
  - `.entity-meta-item:nth-child(2) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(2) > div > a`
  - `.actions > h5`
  - `.icon-list-item[data-shortcut="new"]:nth-child(1) > span:nth-child(2)`
  - `.icon-list-item[data-shortcut="new"]:nth-child(2) > span:nth-child(2)`
  - … +35 autres
- http://localhost:8080/ [state:suggestions-recherche]
  - `#recent-pages > h3`
  - `.compact.entity-list > .page[data-entity-id="345"][data-entity-type="page"] > .content > h4`
  - `#recently-updated-pages > .compact.entity-list > .page[data-entity-id="344"][data-entity-type="page"] > .content > h4`
  - `a[data-entity-id="281"] > .content > h4`
  - `a[data-entity-id="280"] > .content > h4`
- http://localhost:8080/ [state:menu-mobile]
  - `.icon-list-item.text-link[role=""] > span:nth-child(2)`

### link-in-text-block — Links must be distinguishable without relying on color

- http://localhost:8080/books/demo-a11y-book/edit
  - `.editor-content-area > p > a`

### frame-tested — Frames should be tested with axe-core

- http://localhost:8080/books/demo-a11y-book/page/page-demo-a11y/edit
  - `#html-editor_ifr`

### skip-link — The skip-link target should exist and be focusable

- http://localhost:8080/books/demo-a11y-book [state:mobile-tabs]
  - `.skip-to-content-link`

