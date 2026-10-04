# Audit accessibilité — 2026-10-04

**13 règle(s) violée(s), 33 occurrence(s), 16/16 scénario(s) audité(s), 0 erreur(s), 8 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `aecacbb9ec3e`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-attr?application=axeAPI

- http://127.0.0.1:5176/settings/account/profile
  - `#mantine-gqpdtlnoo`
- http://127.0.0.1:5176/s/general/p/test-page-a11y-YE3rIig7Vn
  - `#mantine-0e4jh4ldo`
- http://127.0.0.1:5176/settings/workspace
  - `#mantine-0pcj95ne8`
- http://127.0.0.1:5176/docs/general/YE3rIig7Vn [state:dark-mode]
  - `#mantine-88edod3c2`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://127.0.0.1:5176/settings/security
  - `#mantine-dlurtl1rd`
  - `#mantine-xdrk7ucz8`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://127.0.0.1:5176/home [state:user-menu]
  - `#mantine-6dpk9l0w9-dropdown`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-valid-attr-value?application=axeAPI

- http://127.0.0.1:5176/home [state:notifications]
  - `#mantine-jjx6qqlja-tab-direct`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-prohibited-attr?application=axeAPI

- http://127.0.0.1:5176/s/general/p/test-page-a11y-YE3rIig7Vn
  - `#mantine-iwx0k539v`
  - `#mantine-z6lecdzv9`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://127.0.0.1:5176/settings/sharing
  - `a[target="_blank"]`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-dialog-name?application=axeAPI

- http://127.0.0.1:5176/home [state:command-palette]
  - `section`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-input-field-name?application=axeAPI

- http://127.0.0.1:5176/docs/general/YE3rIig7Vn [state:dark-mode]
  - `.page-title > div > .tiptap[role="textbox"][translate="no"]`
  - `div:nth-child(4) > .tiptap[role="textbox"][translate="no"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:5176/docs/general/YE3rIig7Vn [state:dark-mode]
  - `._searchLabel_8faiy_176`
  - `._searchKbd_8faiy_181`
  - `.m_811560b9`
  - `._crumbLink_8faiy_588`
  - `._byline_8faiy_642 > span`
  - `._footerBranding_8faiy_552`
  - `._tocLabel_8faiy_470`
  - `._editPageLink_8faiy_520`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://127.0.0.1:5176/home
  - `html`
- http://127.0.0.1:5176/s/general
  - `html`
- http://127.0.0.1:5176/s/general/trash
  - `html`
- http://127.0.0.1:5176/templates
  - `html`
- http://127.0.0.1:5176/home [state:user-menu]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://127.0.0.1:5176/s/general/p/test-page-a11y-YE3rIig7Vn
  - `div:nth-child(16)`
  - `div:nth-child(18)`
- http://127.0.0.1:5176/home [state:user-menu]
  - `div[data-portal="true"]`
- http://127.0.0.1:5176/docs/general/YE3rIig7Vn [state:dark-mode]
  - `div[data-portal="true"]`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://127.0.0.1:5176/settings/security
  - `h4`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://127.0.0.1:5176/settings/members
  - `th[aria-label="Action"]`

## Résultats incomplets à revoir (8)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### form-field-multiple-labels — Form field must not have multiple label elements

- http://127.0.0.1:5176/settings/account/preferences
  - `#_r_eh_`
  - `#_r_et_`
  - `#_r_f9_`
  - `#_r_fl_`
  - `#_r_g1_`

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://127.0.0.1:5176/s/general/p/test-page-a11y-YE3rIig7Vn
  - `.ProseMirror-focused`
  - `div[aria-label="Page content"]`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://127.0.0.1:5176/home [state:user-menu]
  - `#mantine-6dpk9l0w9`

