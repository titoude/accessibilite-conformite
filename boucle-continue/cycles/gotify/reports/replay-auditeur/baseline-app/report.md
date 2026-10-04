# Audit accessibilité — 2026-10-04

**13 règle(s) violée(s), 96 occurrence(s), 17/17 scénario(s) audité(s), 0 erreur(s), 39 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `8f1daa574945`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.13/image-alt?application=axeAPI

- http://127.0.0.1:8095/#/
  - `.MuiAvatar-img`
- http://127.0.0.1:8095/#/messages/1
  - `.MuiAvatar-img`
- http://127.0.0.1:8095/#/applications
  - `.MuiAvatar-img`
- http://127.0.0.1:8095/#/clients
  - `img`
- http://127.0.0.1:8095/#/users
  - `img`
- http://127.0.0.1:8095/#/settings
  - `img`
- http://127.0.0.1:8095/#/plugins
  - `img`
- http://127.0.0.1:8095/#/ [state:nav-drawer-mobile]
  - `div:nth-child(5) > .item[href$="#/messages/1"][data-discover="true"] > .MuiListItemButton-root.MuiListItemButton-gutters.css-1qm8dkc > .MuiListItemAvatar-root.css-1w7gz70 > .MuiAvatar-root.MuiAvatar-square.css-18n5vbe > .MuiAvatar-img.css-45do71[src$="defaultapp.png"]`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://127.0.0.1:8095/#/
  - `div[data-index="0"] > .css-ozccyo-wrapperPadding.message > .MuiPaper-rounded.MuiPaper-elevation6.css-1tqu5qn-paper > .css-1yqgk7i-header > .MuiIconButton-root.MuiIconButton-sizeLarge.delete`
  - `div[data-index="1"] > .css-ozccyo-wrapperPadding.message > .MuiPaper-rounded.MuiPaper-elevation6.css-1tqu5qn-paper > .css-1yqgk7i-header > .MuiIconButton-root.MuiIconButton-sizeLarge.delete`
- http://127.0.0.1:8095/#/messages/1
  - `div[data-index="0"] > .css-ozccyo-wrapperPadding.message > .MuiPaper-rounded.MuiPaper-elevation6.css-1tqu5qn-paper > .css-1yqgk7i-header > .MuiIconButton-root.MuiIconButton-sizeLarge.delete`
  - `div[data-index="1"] > .css-ozccyo-wrapperPadding.message > .MuiPaper-rounded.MuiPaper-elevation6.css-1tqu5qn-paper > .css-1yqgk7i-header > .MuiIconButton-root.MuiIconButton-sizeLarge.delete`
- http://127.0.0.1:8095/#/applications
  - `div > .MuiIconButton-root.MuiIconButton-sizeMedium.css-mfslm7`
  - `.regenerate-token`
  - `.edit`
  - `.delete`
- http://127.0.0.1:8095/#/clients
  - `.Mui-selected > .MuiTableCell-paddingNone.css-1hyhec3.MuiTableCell-alignRight:nth-child(7) > .edit.MuiIconButton-root.MuiIconButton-sizeMedium`
  - `.Mui-selected > .MuiTableCell-paddingNone.css-1hyhec3.MuiTableCell-alignRight:nth-child(8) > .delete.MuiIconButton-root.MuiIconButton-sizeMedium`
  - `tr:nth-child(2) > .MuiTableCell-paddingNone.css-1hyhec3.MuiTableCell-alignRight:nth-child(7) > .edit.MuiIconButton-root.MuiIconButton-sizeMedium`
  - `tr:nth-child(2) > .MuiTableCell-paddingNone.css-1hyhec3.MuiTableCell-alignRight:nth-child(8) > .delete.MuiIconButton-root.MuiIconButton-sizeMedium`
- http://127.0.0.1:8095/#/users
  - `tr:nth-child(1) > .MuiTableCell-alignRight.MuiTableCell-paddingNone.css-1hyhec3 > .edit.MuiIconButton-root.MuiIconButton-sizeLarge`
  - `tr:nth-child(1) > .MuiTableCell-alignRight.MuiTableCell-paddingNone.css-1hyhec3 > .delete.MuiIconButton-root.MuiIconButton-sizeLarge`
  - `tr:nth-child(2) > .MuiTableCell-alignRight.MuiTableCell-paddingNone.css-1hyhec3 > .edit.MuiIconButton-root.MuiIconButton-sizeLarge`
  - `tr:nth-child(2) > .MuiTableCell-alignRight.MuiTableCell-paddingNone.css-1hyhec3 > .delete.MuiIconButton-root.MuiIconButton-sizeLarge`
- http://127.0.0.1:8095/#/ [state:nav-drawer-mobile]
  - `.css-deih4v`
- http://127.0.0.1:8095/#/ [state:snackbar-undo]
  - `.css-1775zyj`
  - `#navigate-users > .css-1vpch0n.MuiIconButton-colorInherit.MuiIconButton-root`
  - `#navigate-apps > .css-1vpch0n.MuiIconButton-colorInherit.MuiIconButton-root`
  - `#navigate-clients > .css-1vpch0n.MuiIconButton-colorInherit.MuiIconButton-root`
  - `#navigate-plugins > .css-1vpch0n.MuiIconButton-colorInherit.MuiIconButton-root`
  - `#user-menu-button`
  - `div[data-index="0"] > .css-ozccyo-wrapperPadding.message > .MuiPaper-rounded.MuiPaper-elevation6.css-1tqu5qn-paper > .css-1yqgk7i-header > div:nth-child(2) > .delete.css-fe2t1u-trash.MuiIconButton-root`
  - `div[data-index="1"] > .css-ozccyo-wrapperPadding.message > .MuiPaper-rounded.MuiPaper-elevation6.css-1tqu5qn-paper > .css-1yqgk7i-header > div:nth-child(2) > .delete.css-fe2t1u-trash.MuiIconButton-root`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:8095/#/
  - `p > a:nth-child(1)`
  - `p > a:nth-child(2)`
- http://127.0.0.1:8095/#/messages/1
  - `p > a:nth-child(1)`
  - `p > a:nth-child(2)`
- http://127.0.0.1:8095/#/ [state:nav-drawer-mobile]
  - `p > a:nth-child(1)`
  - `p > a:nth-child(2)`
- http://127.0.0.1:8095/#/messages/1 [state:push-message-dialog]
  - `p > a:nth-child(1)`
  - `p > a:nth-child(2)`
- http://127.0.0.1:8095/#/ [state:confirm-delete-all]
  - `p > a:nth-child(1)`
  - `p > a:nth-child(2)`
- http://127.0.0.1:8095/#/ [state:snackbar-undo]
  - `p > a:nth-child(1)`
  - `p > a:nth-child(2)`
  - `#notistack-snackbar`
  - `.MuiButton-text`

## [SERIOUS] aria-command-name — ARIA commands must have an accessible name

Ensure every ARIA button, link and menuitem has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-command-name?application=axeAPI

- http://127.0.0.1:8095/#/applications
  - `div[aria-roledescription="sortable"]`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-dialog-name?application=axeAPI

- http://127.0.0.1:8095/#/ [state:nav-drawer-mobile]
  - `.MuiPaper-elevation16`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://127.0.0.1:8095/#/ [state:snackbar-undo]
  - `#navigate-users`
  - `#navigate-apps`
  - `#navigate-clients`
  - `#navigate-plugins`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-main-is-top-level?application=axeAPI

- http://127.0.0.1:8095/#/
  - `.css-1dyj36-content > main`
- http://127.0.0.1:8095/#/messages/1
  - `.css-1dyj36-content > main`
- http://127.0.0.1:8095/#/applications
  - `.css-1dyj36-content > main`
- http://127.0.0.1:8095/#/clients
  - `.css-1dyj36-content > main`
- http://127.0.0.1:8095/#/users
  - `.css-1dyj36-content > main`
- http://127.0.0.1:8095/#/settings
  - `.css-1dyj36-content > main`
- http://127.0.0.1:8095/#/plugins
  - `.css-1dyj36-content > main`
- http://127.0.0.1:8095/#/ [state:snackbar-undo]
  - `.css-1dyj36-content > main`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-no-duplicate-main?application=axeAPI

- http://127.0.0.1:8095/#/
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/messages/1
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/applications
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/clients
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/users
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/settings
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/plugins
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/ [state:snackbar-undo]
  - `.css-1dyj36-content`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://127.0.0.1:8095/#/
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/messages/1
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/applications
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/clients
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/users
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/settings
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/plugins
  - `.css-1dyj36-content`
- http://127.0.0.1:8095/#/ [state:snackbar-undo]
  - `.css-1dyj36-content`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://127.0.0.1:8095/#/
  - `html`
- http://127.0.0.1:8095/#/messages/1
  - `html`
- http://127.0.0.1:8095/#/applications
  - `html`
- http://127.0.0.1:8095/#/clients
  - `html`
- http://127.0.0.1:8095/#/users
  - `html`
- http://127.0.0.1:8095/#/settings
  - `html`
- http://127.0.0.1:8095/#/plugins
  - `html`
- http://127.0.0.1:8095/#/ [state:snackbar-undo]
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://127.0.0.1:8095/#/settings
  - `.MuiGrid-grid-xs-12.css-j5005a.MuiGrid-root:nth-child(2) > .MuiPaper-rounded.MuiPaper-elevation6.css-viwgfh > h6`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://127.0.0.1:8095/#/applications [state:user-menu]
  - `a[href$="#/settings"] > .MuiListItemText-root.css-14rdsw0`
  - `#logout > .MuiListItemText-root.css-14rdsw0`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://127.0.0.1:8095/#/applications
  - `.css-1b5qkmq`
  - `.MuiTableCell-paddingCheckbox`
  - `.css-195ypl5:nth-child(8)`
  - `.css-195ypl5:nth-child(9)`
- http://127.0.0.1:8095/#/clients
  - `th:nth-child(6)`
  - `th:nth-child(7)`
  - `th:nth-child(8)`
- http://127.0.0.1:8095/#/users
  - `th:nth-child(4)`

## Résultats incomplets à revoir (39)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://127.0.0.1:8095/#/settings
  - `div[aria-label="Password is required"]`
- http://127.0.0.1:8095/#/applications [state:add-app-dialog]
  - `div[aria-label="name is required"]`
- http://127.0.0.1:8095/#/clients [state:add-client-dialog]
  - `div[aria-label="name is required"]`
- http://127.0.0.1:8095/#/users [state:add-user-dialog]
  - `div[aria-label="username is required"]`
- http://127.0.0.1:8095/#/messages/1 [state:push-message-dialog]
  - `div[aria-label="message is required"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8095/#/settings
  - `.MuiSelect-select`
  - `#_r_14_`
- http://127.0.0.1:8095/#/applications [state:user-menu]
  - `#user-menu-button`
- http://127.0.0.1:8095/#/applications [state:add-app-dialog]
  - `#create-app`
  - `#_r_e_`
  - `#_r_f_`
- http://127.0.0.1:8095/#/applications [state:update-app-dialog]
  - `#_r_e_`
  - `#_r_f_`
- http://127.0.0.1:8095/#/clients [state:add-client-dialog]
  - `#create-client`
  - `#_r_h_`
  - `#_r_i_`
- http://127.0.0.1:8095/#/clients [state:elevate-client-dialog]
  - `.MuiSelect-select`
- http://127.0.0.1:8095/#/users [state:add-user-dialog]
  - `#create-user`
  - `#username`
  - `#password`
- http://127.0.0.1:8095/#/messages/1 [state:push-message-dialog]
  - `#push-message`
  - `.MuiDialogContentText-root`
  - `#_r_d_`
  - `#_r_e_`
  - `#_r_f_`
- http://127.0.0.1:8095/#/ [state:confirm-delete-all]
  - `#delete-all`
- http://127.0.0.1:8095/#/ [state:snackbar-undo]
  - `.MuiTypography-caption`

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://127.0.0.1:8095/#/plugins
  - `#plugin-table`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://127.0.0.1:8095/#/applications [state:user-menu]
  - `#root`
- http://127.0.0.1:8095/#/ [state:nav-drawer-mobile]
  - `#root`
- http://127.0.0.1:8095/#/applications [state:add-app-dialog]
  - `#root`
- http://127.0.0.1:8095/#/applications [state:update-app-dialog]
  - `#root`
- http://127.0.0.1:8095/#/clients [state:add-client-dialog]
  - `#root`
- http://127.0.0.1:8095/#/clients [state:elevate-client-dialog]
  - `#root`
- http://127.0.0.1:8095/#/users [state:add-user-dialog]
  - `#root`
- http://127.0.0.1:8095/#/messages/1 [state:push-message-dialog]
  - `#root`
- http://127.0.0.1:8095/#/ [state:confirm-delete-all]
  - `#root`

### bypass — Page must have means to bypass repeated blocks

- http://127.0.0.1:8095/#/applications [state:user-menu]
  - `html`
- http://127.0.0.1:8095/#/ [state:nav-drawer-mobile]
  - `html`

