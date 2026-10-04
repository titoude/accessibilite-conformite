# Audit accessibilité — 2026-10-04

**11 règle(s) violée(s), 197 occurrence(s), 10/10 scénario(s) audité(s), 0 erreur(s), 195 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `8b6dcbd05626`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-parent?application=axeAPI

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}
  - `.jss86:nth-child(1) > .jss84`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `.jss72`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - `a[href$="#/song"]`
  - … +3 autres
- http://127.0.0.1:8089/app/#/artist
  - `.jss86:nth-child(1) > .jss84`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `.jss72`
  - `a[href$="#/song"]`
  - … +3 autres
- http://127.0.0.1:8089/app/#/song
  - `.jss86:nth-child(1) > .jss84`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - `.jss72`
  - … +3 autres
- http://127.0.0.1:8089/app/#/playlist
  - `.jss86:nth-child(1) > .jss84`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - `a[href$="#/song"]`
  - … +3 autres
- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `.jss86:nth-child(1) > .jss84`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - `a[href$="#/song"]`
  - … +3 autres
- http://127.0.0.1:8089/app/#/artist/6QiT23Pg8GAJHZop58uMKH/show
  - `.jss86:nth-child(1) > .jss84`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `.jss72`
  - `a[href$="#/song"]`
  - … +3 autres
- http://127.0.0.1:8089/app/#/personal
  - `.jss86:nth-child(1) > .jss84`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - `a[href$="#/song"]`
  - … +3 autres
- http://127.0.0.1:8089/app/#/user
  - `.jss86:nth-child(1) > .jss84`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - `a[href$="#/song"]`
  - … +3 autres
- http://127.0.0.1:8089/app/#/transcoding
  - `.jss86:nth-child(1) > .jss84`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - `a[href$="#/song"]`
  - … +3 autres
- http://127.0.0.1:8089/app/#/about
  - `.jss86:nth-child(1) > .jss84`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - `a[href$="#/song"]`
  - … +3 autres

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}
  - `.jss83.MuiIconButton-sizeSmall.MuiIconButton-root:nth-child(4)`
  - `.jss226`
- http://127.0.0.1:8089/app/#/artist
  - `.jss83.MuiIconButton-sizeSmall:nth-child(4)`
- http://127.0.0.1:8089/app/#/song
  - `.jss83.MuiIconButton-sizeSmall:nth-child(4)`
- http://127.0.0.1:8089/app/#/playlist
  - `.jss83.MuiIconButton-sizeSmall.MuiIconButton-root:nth-child(4)`
- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `.jss83.MuiIconButton-sizeSmall:nth-child(4)`
- http://127.0.0.1:8089/app/#/artist/6QiT23Pg8GAJHZop58uMKH/show
  - `.jss83.MuiIconButton-sizeSmall.MuiIconButton-root:nth-child(4)`
  - `.jss639`
- http://127.0.0.1:8089/app/#/personal
  - `.jss83.MuiIconButton-sizeSmall:nth-child(4)`
- http://127.0.0.1:8089/app/#/user
  - `.jss83.MuiIconButton-sizeSmall.MuiIconButton-root:nth-child(4)`
- http://127.0.0.1:8089/app/#/transcoding
  - `.jss83.MuiIconButton-sizeSmall.MuiIconButton-root:nth-child(4)`
- http://127.0.0.1:8089/app/#/about
  - `.jss83.MuiIconButton-sizeSmall.MuiIconButton-root:nth-child(4)`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://127.0.0.1:8089/app/#/song
  - `.select-all > .MuiIconButton-label > .jss384[type="checkbox"][data-indeterminate="false"]`
  - `.jss312.jss311.jss376:nth-child(1) > .MuiTableCell-paddingCheckbox > .select-item.jss309[aria-label="Select this row"] > .MuiIconButton-label > .jss384[type="checkbox"][data-indeterminate="false"]`
  - `.jss313.jss311.jss376:nth-child(2) > .MuiTableCell-paddingCheckbox > .select-item.jss309[aria-label="Select this row"] > .MuiIconButton-label > .jss384[type="checkbox"][data-indeterminate="false"]`
  - `.jss312.jss311.jss376:nth-child(3) > .MuiTableCell-paddingCheckbox > .select-item.jss309[aria-label="Select this row"] > .MuiIconButton-label > .jss384[type="checkbox"][data-indeterminate="false"]`
  - `.jss313.jss311.jss376:nth-child(4) > .MuiTableCell-paddingCheckbox > .select-item.jss309[aria-label="Select this row"] > .MuiIconButton-label > .jss384[type="checkbox"][data-indeterminate="false"]`
  - `.jss312.jss311.jss376:nth-child(5) > .MuiTableCell-paddingCheckbox > .select-item.jss309[aria-label="Select this row"] > .MuiIconButton-label > .jss384[type="checkbox"][data-indeterminate="false"]`
- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `.select-all > .MuiIconButton-label > .jss550[type="checkbox"][data-indeterminate="false"]`
  - `.jss539.jss538.jss526:nth-child(1) > .MuiTableCell-paddingCheckbox > .select-item.jss536[aria-label="Select this row"] > .MuiIconButton-label > .jss550[type="checkbox"][data-indeterminate="false"]`
  - `.jss540.jss538.jss526:nth-child(2) > .MuiTableCell-paddingCheckbox > .select-item.jss536[aria-label="Select this row"] > .MuiIconButton-label > .jss550[type="checkbox"][data-indeterminate="false"]`
  - `.jss539.jss538.jss526:nth-child(3) > .MuiTableCell-paddingCheckbox > .select-item.jss536[aria-label="Select this row"] > .MuiIconButton-label > .jss550[type="checkbox"][data-indeterminate="false"]`
  - `.jss540.jss538.jss526:nth-child(4) > .MuiTableCell-paddingCheckbox > .select-item.jss536[aria-label="Select this row"] > .MuiIconButton-label > .jss550[type="checkbox"][data-indeterminate="false"]`
  - `.jss539.jss538.jss526:nth-child(5) > .MuiTableCell-paddingCheckbox > .select-item.jss536[aria-label="Select this row"] > .MuiIconButton-label > .jss550[type="checkbox"][data-indeterminate="false"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}
  - `#react-admin-title > span`
- http://127.0.0.1:8089/app/#/artist
  - `#react-admin-title > span`
- http://127.0.0.1:8089/app/#/song
  - `#react-admin-title > span`
- http://127.0.0.1:8089/app/#/playlist
  - `#react-admin-title > span`
- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `#react-admin-title > span`
- http://127.0.0.1:8089/app/#/artist/6QiT23Pg8GAJHZop58uMKH/show
  - `#react-admin-title > span`
- http://127.0.0.1:8089/app/#/personal
  - `#react-admin-title > span`
- http://127.0.0.1:8089/app/#/user
  - `#react-admin-title > span`
- http://127.0.0.1:8089/app/#/transcoding
  - `#react-admin-title > span`
- http://127.0.0.1:8089/app/#/about
  - `#react-admin-title > span`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/label-title-only?application=axeAPI

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}
  - `#search`
- http://127.0.0.1:8089/app/#/artist
  - `#search`
- http://127.0.0.1:8089/app/#/song
  - `#title`
- http://127.0.0.1:8089/app/#/user
  - `#search`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.13/listitem?application=axeAPI

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}
  - `.MuiGridListTile-root`
- http://127.0.0.1:8089/app/#/artist/6QiT23Pg8GAJHZop58uMKH/show
  - `.MuiGridListTile-root`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}
  - `.jss152`
  - `.jss229`
- http://127.0.0.1:8089/app/#/artist/6QiT23Pg8GAJHZop58uMKH/show
  - `.jss630`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-prohibited-attr?application=axeAPI

- http://127.0.0.1:8089/app/#/song
  - `.select-all`
  - `.jss312.jss311.jss376:nth-child(1) > .MuiTableCell-paddingCheckbox > .select-item.jss309[aria-label="Select this row"]`
  - `.jss313.jss311.jss376:nth-child(2) > .MuiTableCell-paddingCheckbox > .select-item.jss309[aria-label="Select this row"]`
  - `.jss312.jss311.jss376:nth-child(3) > .MuiTableCell-paddingCheckbox > .select-item.jss309[aria-label="Select this row"]`
  - `.jss313.jss311.jss376:nth-child(4) > .MuiTableCell-paddingCheckbox > .select-item.jss309[aria-label="Select this row"]`
  - `.jss312.jss311.jss376:nth-child(5) > .MuiTableCell-paddingCheckbox > .select-item.jss309[aria-label="Select this row"]`
- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `.select-all`
  - `.jss539.jss538.jss526:nth-child(1) > .MuiTableCell-paddingCheckbox > .select-item.jss536[aria-label="Select this row"]`
  - `.jss540.jss538.jss526:nth-child(2) > .MuiTableCell-paddingCheckbox > .select-item.jss536[aria-label="Select this row"]`
  - `.jss539.jss538.jss526:nth-child(3) > .MuiTableCell-paddingCheckbox > .select-item.jss536[aria-label="Select this row"]`
  - `.jss540.jss538.jss526:nth-child(4) > .MuiTableCell-paddingCheckbox > .select-item.jss536[aria-label="Select this row"]`
  - `.jss539.jss538.jss526:nth-child(5) > .MuiTableCell-paddingCheckbox > .select-item.jss536[aria-label="Select this row"]`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}
  - `html`
- http://127.0.0.1:8089/app/#/artist
  - `html`
- http://127.0.0.1:8089/app/#/song
  - `html`
- http://127.0.0.1:8089/app/#/playlist
  - `html`
- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `html`
- http://127.0.0.1:8089/app/#/artist/6QiT23Pg8GAJHZop58uMKH/show
  - `html`
- http://127.0.0.1:8089/app/#/personal
  - `html`
- http://127.0.0.1:8089/app/#/user
  - `html`
- http://127.0.0.1:8089/app/#/transcoding
  - `html`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://127.0.0.1:8089/app/#/artist
  - `th:nth-child(1)`
- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `th:nth-child(8)`

## [MINOR] empty-heading — Headings should not be empty

Ensure headings have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-heading?application=axeAPI

- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `.jss475:nth-child(2)`

## Résultats incomplets à revoir (195)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}
  - `button[aria-controls="long-menu"]`
  - `.jss224`
- http://127.0.0.1:8089/app/#/artist
  - `button[aria-controls="long-menu"]`
- http://127.0.0.1:8089/app/#/song
  - `button[aria-label="more"]`
  - `button[aria-label="Add to Playlist"]`
- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `button[aria-label="more"]`
  - `button[aria-controls="simple-menu"]`
- http://127.0.0.1:8089/app/#/artist/6QiT23Pg8GAJHZop58uMKH/show
  - `.jss637`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}
  - `.MuiBadge-badge`
  - `.jss86:nth-child(1) > .jss84 > .jss85.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `.jss72`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +6 autres
- http://127.0.0.1:8089/app/#/artist
  - `.MuiBadge-badge`
  - `.jss86:nth-child(1) > .jss84 > .jss85.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `.jss72`
  - … +7 autres
- http://127.0.0.1:8089/app/#/song
  - `.MuiBadge-badge`
  - `.jss86:nth-child(1) > .jss84 > .jss85.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +17 autres
- http://127.0.0.1:8089/app/#/playlist
  - `.MuiBadge-badge`
  - `.jss86:nth-child(1) > .jss84 > .jss85.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +5 autres
- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `.MuiBadge-badge`
  - `.jss86:nth-child(1) > .jss84 > .jss85.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +20 autres
- http://127.0.0.1:8089/app/#/artist/6QiT23Pg8GAJHZop58uMKH/show
  - `.MuiBadge-badge`
  - `.jss86:nth-child(1) > .jss84 > .jss85.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `.jss72`
  - … +9 autres
- http://127.0.0.1:8089/app/#/personal
  - `.MuiBadge-badge`
  - `.jss86:nth-child(1) > .jss84 > .jss85.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +8 autres
- http://127.0.0.1:8089/app/#/user
  - `.MuiBadge-badge`
  - `.jss86:nth-child(1) > .jss84 > .jss85.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +6 autres
- http://127.0.0.1:8089/app/#/transcoding
  - `.MuiBadge-badge`
  - `.jss86:nth-child(1) > .jss84 > .jss85.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +4 autres
- http://127.0.0.1:8089/app/#/about
  - `.MuiBadge-badge`
  - `.jss86:nth-child(1) > .jss84 > .jss85.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +5 autres

