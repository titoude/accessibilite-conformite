# Audit accessibilité — 2026-10-04

**14 règle(s) violée(s), 198 occurrence(s), 13/13 scénario(s) audité(s), 0 erreur(s), 175 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `02bf0e80de36`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-attr?application=axeAPI

- http://localhost:8000/
  - `.me-2`
- http://localhost:8000/advanced-search
  - `.v-toolbar__content > .cursor-pointer`
- http://localhost:8000/mealplan
  - `.me-2`
  - `.v-field--no-label`
  - `.cv-weeks`
  - `.d2026-09-28`
  - `.d2026-09-29`
  - `.d2026-09-30`
  - `.d2026-10-01`
  - `.d2026-10-02`
  - `.d2026-10-03`
  - `.d2026-10-04`
  - … +14 autres
- http://localhost:8000/books
  - `.me-2`
- http://localhost:8000/shopping
  - `.me-2`
- http://localhost:8000/settings/account
  - `.cursor-pointer`
- http://localhost:8000/help
  - `.me-2`
- http://localhost:8000/list/recipe
  - `.me-2`
- http://localhost:8000/recipe/2
  - `.me-2`
- http://localhost:8000/edit/recipe
  - `.me-2`
- http://localhost:8000/pantry
  - `.me-2`
- http://localhost:8000/ [state:add-menu]
  - `.me-2`
- http://localhost:8000/ [state:user-menu]
  - `.me-2`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://localhost:8000/
  - `.v-col:nth-child(1) > .v-list--density-compact.pt-0.pb-0`
  - `.v-col:nth-child(2) > .v-list--density-compact.pt-0.pb-0`
  - `.v-col:nth-child(3) > .v-list--density-compact.pt-0.pb-0`
  - `.v-col:nth-child(4) > .v-list--density-compact.pt-0.pb-0`
  - `.v-navigation-drawer__content > .bg-transparent.v-list--density-default.v-list`
  - `.v-list--nav`
- http://localhost:8000/advanced-search
  - `.v-navigation-drawer__content > .v-list.bg-transparent.v-list--density-default`
  - `.v-list--nav`
- http://localhost:8000/mealplan
  - `.v-navigation-drawer__content > .v-list.bg-transparent.v-list--density-default`
  - `.v-list--nav`
- http://localhost:8000/books
  - `.v-navigation-drawer__content > .v-list.bg-transparent.v-list--density-default`
  - `.v-list--nav`
- http://localhost:8000/shopping
  - `.v-navigation-drawer__content > .v-list.bg-transparent.v-list--density-default`
  - `.v-list--nav`
- http://localhost:8000/settings/account
  - `.v-col-md-3 > .v-list.v-list--density-default.v-list--one-line`
  - `.v-navigation-drawer__content > .v-list.bg-transparent.v-list--density-default`
  - `.v-list--nav`
- http://localhost:8000/help
  - `.v-application__wrap > nav > .v-navigation-drawer__content > .v-list.bg-transparent.v-list--density-default`
  - `.v-list--nav`
- http://localhost:8000/list/recipe
  - `.v-navigation-drawer__content > .v-list.bg-transparent.v-list--density-default`
  - `.v-list--nav`
- http://localhost:8000/recipe/2
  - `.v-navigation-drawer__content > .v-list.bg-transparent.v-list--density-default`
  - `.v-list--nav`
- http://localhost:8000/edit/recipe
  - `.v-navigation-drawer__content > .v-list.bg-transparent.v-list--density-default`
  - `.v-list--nav`
- http://localhost:8000/pantry
  - `.v-navigation-drawer__content > .v-list.bg-transparent.v-list--density-default`
  - `.v-list--nav`
- http://localhost:8000/ [state:add-menu]
  - `.v-navigation-drawer__content > .bg-transparent.v-list--density-default.v-list`
  - `.v-list--nav`
  - `.v-overlay__content > .v-list--density-default.v-list.v-list--one-line`
- http://localhost:8000/ [state:user-menu]
  - `.v-navigation-drawer__content > .bg-transparent.v-list--density-default.v-list`
  - `.v-list--nav`
  - `.v-overlay__content > .v-list--density-compact.v-list.v-list--one-line`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:8000/
  - `.v-btn--icon`
- http://localhost:8000/advanced-search
  - `button[aria-controls="v-menu-v-9"]`
  - `.v-btn--elevated`
- http://localhost:8000/mealplan
  - `.v-btn--variant-text`
  - `.v-input__prepend > .v-btn--density-compact.v-btn--icon.v-btn--variant-plain`
  - `.v-field__append-inner > .v-btn--density-compact.v-btn--icon.v-btn--variant-plain`
  - `.v-input__append > .v-btn--density-compact.v-btn--icon.v-btn--variant-plain`
- http://localhost:8000/books
  - `.v-btn--variant-text`
  - `.v-btn--elevated`
- http://localhost:8000/shopping
  - `.v-btn--icon`
- http://localhost:8000/settings/account
  - `.v-btn--icon`
- http://localhost:8000/help
  - `.v-btn--icon`
- http://localhost:8000/list/recipe
  - `.v-btn--variant-text`
  - `.v-btn--elevated`
  - `button[aria-controls="v-menu-v-29"]`
  - `button[aria-controls="v-menu-v-32"]`
- http://localhost:8000/recipe/2
  - `.v-btn--icon`
- http://localhost:8000/edit/recipe
  - `.v-btn--icon`
- http://localhost:8000/pantry
  - `.v-btn--variant-text`
  - `.v-btn--elevated`
- http://localhost:8000/ [state:add-menu]
  - `button[aria-controls="v-menu-v-22"]`
  - `button[aria-controls="v-menu-v-24"]`
- http://localhost:8000/ [state:user-menu]
  - `.v-btn--variant-text`
  - `button[aria-controls="v-menu-v-22"]`
  - `button[aria-controls="v-menu-v-24"]`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.13/image-alt?application=axeAPI

- http://localhost:8000/
  - `img`
- http://localhost:8000/advanced-search
  - `a[href="/"] > .v-responsive > img`
- http://localhost:8000/mealplan
  - `img`
- http://localhost:8000/books
  - `img`
- http://localhost:8000/settings/account
  - `.v-img__img--contain`
- http://localhost:8000/help
  - `img`
- http://localhost:8000/list/recipe
  - `img`
- http://localhost:8000/edit/recipe
  - `img`
- http://localhost:8000/pantry
  - `img`
- http://localhost:8000/ [state:add-menu]
  - `.v-img__img--contain`
- http://localhost:8000/ [state:user-menu]
  - `.v-img__img--contain`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:8000/books
  - `#input-v-2`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8000/
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
- http://localhost:8000/advanced-search
  - `#input-v-12-label`
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
- http://localhost:8000/mealplan
  - `.week1 > .cv-weeknumber > span`
  - `.week2 > .cv-weeknumber > span`
  - `.week3 > .cv-weeknumber > span`
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
  - `label[for="input-v-13"]`
- http://localhost:8000/books
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
- http://localhost:8000/shopping
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
- http://localhost:8000/settings/account
  - `.v-messages__message`
  - `#input-v-7-label`
  - `#input-v-10-label`
  - `.text-disabled`
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
- http://localhost:8000/help
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
- http://localhost:8000/list/recipe
  - `.text-wrap`
  - `#input-v-14-label`
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
- http://localhost:8000/recipe/2
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
- http://localhost:8000/edit/recipe
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
- http://localhost:8000/pantry
  - `.text-wrap`
  - `#input-v-14-label`
  - `#input-v-19-label`
  - `.v-data-table-column--align-start:nth-child(1) > .v-data-table-header__content > span`
  - `.v-data-table-column--align-start:nth-child(2) > .v-data-table-header__content > span`
  - `.v-data-table-column--align-start:nth-child(3) > .v-data-table-header__content > span`
  - `.v-data-table-column--align-start:nth-child(4) > .v-data-table-header__content > span`
  - `.v-data-table-column--align-end > .v-data-table-header__content > span`
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
- http://localhost:8000/ [state:add-menu]
  - `.v-list-item-subtitle:nth-child(2)`
  - `div[to="[object Object]"]`
- http://localhost:8000/ [state:user-menu]
  - `.mb-2.v-list-item--density-default[role="listitem"] > .v-list-item__content[data-no-activator=""] > .v-list-item-subtitle:nth-child(2)`
  - `.mb-2.v-list-item--density-default[role="listitem"] > .v-list-item__content[data-no-activator=""] > .v-list-item-subtitle[to="[object Object]"]`
  - `.mb-2.v-list-item--density-compact[role="listitem"] > .v-list-item__content[data-no-activator=""] > .v-list-item-subtitle:nth-child(2)`
  - `.mb-2.v-list-item--density-compact[role="listitem"] > .v-list-item__content[data-no-activator=""] > .v-list-item-subtitle[to="[object Object]"]`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://localhost:8000/
  - `.router-link-active`
- http://localhost:8000/advanced-search
  - `.v-toolbar__content > a[href="/"]`
- http://localhost:8000/mealplan
  - `.v-toolbar__content > a[href="/"]`
- http://localhost:8000/books
  - `.v-toolbar__content > a[href="/"]`
- http://localhost:8000/shopping
  - `.v-toolbar__content > a[href="/"]`
- http://localhost:8000/settings/account
  - `.v-toolbar__content > a[href="/"]`
- http://localhost:8000/help
  - `.v-toolbar__content > a[href="/"]`
- http://localhost:8000/list/recipe
  - `.v-toolbar__content > a[href="/"]`
- http://localhost:8000/recipe/2
  - `.v-toolbar__content > a[href="/"]`
- http://localhost:8000/edit/recipe
  - `.v-toolbar__content > a[href="/"]`
- http://localhost:8000/pantry
  - `.v-toolbar__content > a[href="/"]`
- http://localhost:8000/ [state:add-menu]
  - `.router-link-active`
- http://localhost:8000/ [state:user-menu]
  - `.router-link-active`

## [SERIOUS] aria-progressbar-name — ARIA progressbar nodes must have an accessible name

Ensure every ARIA progressbar node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-progressbar-name?application=axeAPI

- http://localhost:8000/
  - `:root`
  - `:root`
  - `:root`
  - `:root`
- http://localhost:8000/advanced-search
  - `.v-progress-linear`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/label-title-only?application=axeAPI

- http://localhost:8000/books
  - `#input-v-2`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:8000/
  - `html`
- http://localhost:8000/advanced-search
  - `html`
- http://localhost:8000/mealplan
  - `html`
- http://localhost:8000/books
  - `html`
- http://localhost:8000/shopping
  - `html`
- http://localhost:8000/settings/account
  - `html`
- http://localhost:8000/help
  - `html`
- http://localhost:8000/list/recipe
  - `html`
- http://localhost:8000/recipe/2
  - `html`
- http://localhost:8000/edit/recipe
  - `html`
- http://localhost:8000/pantry
  - `html`
- http://localhost:8000/ [state:add-menu]
  - `html`
- http://localhost:8000/ [state:user-menu]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8000/ [state:add-menu]
  - `a[href$="recipe"] > .v-list-item__content[data-no-activator=""]`
  - `.v-overlay__content > .v-list--density-default.v-list.v-list--one-line > .v-list-item--link[href$="import"][role="link"] > .v-list-item__content[data-no-activator=""]`
- http://localhost:8000/ [state:user-menu]
  - `.mb-2.v-list-item--density-compact[role="listitem"]`
  - `.v-list-item--density-compact[href$="settings"][role="link"] > .v-list-item__content[data-no-activator=""]`
  - `a[href$="help"] > .v-list-item__content[data-no-activator=""]`
  - `a[href$="admin/"] > .v-list-item__content[data-no-activator=""]`
  - `.v-list-item--density-compact.v-list-item--link[role="listitem"]:nth-child(7) > .v-list-item__content[data-no-activator=""]`
  - `.v-list-item--density-compact.v-list-item--link[role="listitem"]:nth-child(8) > .v-list-item__content[data-no-activator=""]`
  - `a[href$="logout/"] > .v-list-item__content[data-no-activator=""]`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-main-is-top-level?application=axeAPI

- http://localhost:8000/help
  - `.v-main--scrollable`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-no-duplicate-main?application=axeAPI

- http://localhost:8000/help
  - `.v-application__wrap > main`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://localhost:8000/help
  - `.v-application__wrap > main`
  - `.v-layout > nav`

## Résultats incomplets à revoir (175)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:8000/
  - `.v-btn--icon`
  - `.me-2`
- http://localhost:8000/advanced-search
  - `button[aria-controls="v-menu-v-9"]`
  - `.v-toolbar__content > .cursor-pointer`
- http://localhost:8000/mealplan
  - `.v-btn--variant-text`
  - `.me-2`
  - `.v-field--no-label`
  - `#input-v-2`
  - `div[aria-owns="menu-v-11"]`
  - `div[aria-owns="menu-v-17"]`
  - `div[aria-owns="menu-v-23"]`
- http://localhost:8000/books
  - `.v-btn--variant-text`
  - `.me-2`
  - `#input-v-2`
- http://localhost:8000/shopping
  - `.v-btn--icon`
  - `.me-2`
- http://localhost:8000/settings/account
  - `.v-btn--icon`
  - `.cursor-pointer`
- http://localhost:8000/help
  - `.v-btn--icon`
  - `.me-2`
- http://localhost:8000/list/recipe
  - `.v-btn--variant-text`
  - `.me-2`
  - `button[aria-controls="v-menu-v-29"]`
  - `button[aria-controls="v-menu-v-32"]`
  - `.v-field--active`
  - `#input-v-20`
- http://localhost:8000/recipe/2
  - `.v-btn--icon`
  - `.me-2`
- http://localhost:8000/edit/recipe
  - `.v-btn--icon`
  - `.me-2`
- http://localhost:8000/pantry
  - `.v-btn--variant-text`
  - `.me-2`
  - `div[aria-owns="menu-v-12"]`
  - `div[aria-owns="menu-v-17"]`
  - `.v-field--active`
  - `#input-v-25`
- http://localhost:8000/ [state:add-menu]
  - `.v-btn--variant-text`
  - `.me-2`
  - `button[aria-controls="v-menu-v-22"]`
  - `button[aria-controls="v-menu-v-24"]`
- http://localhost:8000/ [state:user-menu]
  - `.v-btn--variant-text`
  - `.me-2`
  - `button[aria-controls="v-menu-v-22"]`
  - `button[aria-controls="v-menu-v-24"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8000/
  - `.d-sm-block`
  - `.v-chip__content`
  - `.me-2`
  - `.v-list-item__prepend > .v-avatar.bg-primary.v-avatar--density-default`
- http://localhost:8000/advanced-search
  - `.d-sm-block`
  - `.v-chip__content`
  - `.v-toolbar__content > .cursor-pointer`
  - `#input-v-12`
  - `.v-list-item__prepend > .v-avatar.v-avatar--density-default.v-avatar--size-default`
  - `.v-list-item--active > .v-list-item__content[data-no-activator=""] > .v-list-item-title`
- http://localhost:8000/mealplan
  - `.d-sm-block`
  - `.v-chip__content`
  - `.me-2`
  - `#input-v-2`
  - `.v-list-item__prepend > .v-avatar.bg-primary.v-avatar--density-default`
  - `.v-list-item--active > .v-list-item__content[data-no-activator=""] > .v-list-item-title`
  - `div[aria-owns="menu-v-11"] > .v-field__field[data-no-activator=""] > .v-field__input[data-no-activator=""] > .v-select__selection > .v-select__selection-text`
- http://localhost:8000/books
  - `.d-sm-block`
  - `.v-chip__content`
  - `.me-2`
  - `#input-v-2`
  - `.v-list-item__prepend > .v-avatar.bg-primary.v-avatar--density-default`
  - `.v-list-item--active > .v-list-item__content[data-no-activator=""] > .v-list-item-title`
- http://localhost:8000/shopping
  - `.d-sm-block`
  - `.v-chip__content`
  - `.me-2`
  - `.v-list-item__prepend > .v-avatar.bg-primary.v-avatar--density-default`
- http://localhost:8000/settings/account
  - `.d-sm-block`
  - `.v-chip__content`
  - `.cursor-pointer`
  - `a[href$="account"] > .v-list-item__content[data-no-activator=""]`
  - `.v-col:nth-child(1)`
  - `.float-right > .v-btn__content[data-no-activator=""]`
  - `.mt-2`
  - `#input-v-7`
  - `#input-v-10`
  - `.bg-success > .v-btn__content[data-no-activator=""]`
  - … +9 autres
- http://localhost:8000/help
  - `.d-sm-block`
  - `.v-chip__content`
  - `.me-2`
  - `a[href$="tandoor.dev"] > .v-btn__content[data-no-activator=""]`
  - `.bg-info > .v-btn__content[data-no-activator=""]`
  - `.v-alert__content`
  - `.v-alert-title`
  - `.bg-secondary > .v-btn__content[data-no-activator=""]`
  - `.bg-success > .v-btn__content[data-no-activator=""]`
  - `.v-list-item__prepend > .v-avatar.v-avatar--density-default.v-avatar--size-default`
- http://localhost:8000/list/recipe
  - `.d-sm-block`
  - `.v-chip__content`
  - `.me-2`
  - `.v-btn--variant-flat > .v-btn__content[data-no-activator=""]`
  - `#input-v-14`
  - `.v-select__selection-text`
  - `.v-list-item__prepend > .v-avatar.bg-primary.v-avatar--density-default`
- http://localhost:8000/recipe/2
  - `.d-sm-block`
  - `.v-chip__content`
  - `.me-2`
  - `.v-list-item__prepend > .v-avatar.bg-primary.v-avatar--density-default`
- http://localhost:8000/edit/recipe
  - `.d-sm-block`
  - `.v-chip__content`
  - `.me-2`
  - `.v-btn--variant-flat > .v-btn__content[data-no-activator=""]`
  - `.v-list-item__prepend > .v-avatar.bg-primary.v-avatar--density-default`
- http://localhost:8000/pantry
  - `.d-sm-block`
  - `.v-chip__content`
  - `.me-2`
  - `#input-v-14`
  - `#input-v-19`
  - `.v-select__selection-text`
  - `.v-list-item__prepend > .v-avatar.bg-primary.v-avatar--density-default`
  - `.v-list-item--active > .v-list-item__content[data-no-activator=""] > .v-list-item-title`
- http://localhost:8000/ [state:add-menu]
  - `.d-sm-block`
  - `.v-chip__content`
  - `.me-2`
  - `.v-col:nth-child(1) > .v-list--density-compact.pt-0.pb-0 > .v-list-item--density-compact.text-center[role="listitem"]:nth-child(1) > .v-list-item__content[data-no-activator=""] > .d-flex > .mt-auto.mb-auto.flex-grow-1`
  - `.v-col:nth-child(2) > .v-list--density-compact.pt-0.pb-0 > .v-list-item--density-compact.text-center[role="listitem"]:nth-child(1) > .v-list-item__content[data-no-activator=""] > .d-flex > .mt-auto.mb-auto.flex-grow-1`
  - `.v-col:nth-child(3) > .v-list--density-compact.pt-0.pb-0 > .v-list-item--density-compact.text-center[role="listitem"]:nth-child(1) > .v-list-item__content[data-no-activator=""] > .d-flex > .mt-auto.mb-auto.flex-grow-1`
  - `.v-col:nth-child(4) > .v-list--density-compact.pt-0.pb-0 > .v-list-item--density-compact.text-center[role="listitem"]:nth-child(1) > .v-list-item__content[data-no-activator=""] > .d-flex > .mt-auto.mb-auto.flex-grow-1`
  - `h4`
  - `.text-body-2`
  - `.pr-0.pl-0.v-col:nth-child(1) > .ml-3[data-v-f3575087=""] > .d-flex[data-v-f3575087=""] > .flex-grow-1.cursor-pointer[data-v-f3575087=""] > p`
  - … +4 autres
- http://localhost:8000/ [state:user-menu]
  - `.d-sm-block`
  - `.v-chip__content`
  - `.me-2`
  - `.v-col:nth-child(1) > .pt-0.pb-0.v-list--density-compact > .text-center.v-list-item--density-compact[role="listitem"]:nth-child(1) > .v-list-item__content[data-no-activator=""] > .d-flex > .mt-auto.mb-auto.flex-grow-1`
  - `.v-col:nth-child(2) > .pt-0.pb-0.v-list--density-compact > .text-center.v-list-item--density-compact[role="listitem"]:nth-child(1) > .v-list-item__content[data-no-activator=""] > .d-flex > .mt-auto.mb-auto.flex-grow-1`
  - `.v-col:nth-child(3) > .pt-0.pb-0.v-list--density-compact > .text-center.v-list-item--density-compact[role="listitem"]:nth-child(1) > .v-list-item__content[data-no-activator=""] > .d-flex > .mt-auto.mb-auto.flex-grow-1`
  - `.v-col:nth-child(4) > .pt-0.pb-0.v-list--density-compact > .text-center.v-list-item--density-compact[role="listitem"]:nth-child(1) > .v-list-item__content[data-no-activator=""] > .d-flex > .mt-auto.mb-auto.flex-grow-1`
  - `h4`
  - `.text-body-2`
  - `.pr-0.pl-0.v-col:nth-child(1) > .ml-3[data-v-f3575087=""] > .d-flex[data-v-f3575087=""] > .flex-grow-1.cursor-pointer[data-v-f3575087=""] > p`
  - … +5 autres

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:8000/mealplan
  - `.cv-wrapper`
  - `.d2026-09-28`
  - `.d2026-09-29`
  - `.d2026-09-30`
  - `.d2026-10-01`
  - `.d2026-10-02`
  - `.d2026-10-03`
  - `.d2026-10-04`
  - `.d2026-10-05`
  - `.d2026-10-06`
  - … +12 autres

