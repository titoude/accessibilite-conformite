# Audit accessibilité — 2026-10-05

**8 règle(s) violée(s), 132 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 9 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `c34253ddc17a`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:17170/users/create
  - `#avatarInput`
  - `input[name="department"]`
  - `input[name="display_name"]`
  - `input[name="first_name"]`
  - `input[name="last_name"]`
  - `input[name="mail"]`
- http://localhost:17170/user/jdoe
  - `#avatarInput`
  - `input[name="display_name"]`
  - `input[name="first_name"]`
  - `input[name="last_name"]`
  - `input[name="mail"]`
  - `input[name="department"]`
- http://localhost:17170/groups/create
  - `input[name="description"]`
- http://localhost:17170/group/4
  - `input[name="display_name"]`
  - `input[name="description"]`
- http://localhost:17170/user-attributes/create
  - `input[value="is_list"]`
  - `input[value="is_visible"]`
  - `input[value="is_editable"]`
- http://localhost:17170/group-attributes/create
  - `input[value="is_list"]`
  - `input[value="is_visible"]`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/select-name?application=axeAPI

- http://localhost:17170/user/jdoe
  - `select`
- http://localhost:17170/group/4
  - `select`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://localhost:17170/users
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/users/create
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/user/jdoe
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/user/jdoe/password
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/groups
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/groups/create
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/group/4
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/user-attributes
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/user-attributes/create
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/group-attributes
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/group-attributes/create
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/users [state:user-menu-dropdown]
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/users [state:delete-user-modal]
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/groups [state:delete-group-modal]
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`
- http://localhost:17170/users [state:dark-mode]
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:17170/users
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/users/create
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/user/jdoe
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/user/jdoe/password
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/groups
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/groups/create
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/group/4
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/user-attributes
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/user-attributes/create
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/group-attributes
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/group-attributes/create
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/users [state:user-menu-dropdown]
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`
- http://localhost:17170/users [state:dark-mode]
  - `div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`

## [SERIOUS] autocomplete-valid — autocomplete attribute must be used correctly

Ensure the autocomplete attribute is correct and suitable for the form field
Référence : https://dequeuniversity.com/rules/axe/4.13/autocomplete-valid?application=axeAPI

- http://localhost:17170/groups/create
  - `#groupname`
- http://localhost:17170/user-attributes/create
  - `#attribute_name`
- http://localhost:17170/group-attributes/create
  - `#attribute_name`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:17170/users
  - `html`
- http://localhost:17170/users/create
  - `html`
- http://localhost:17170/user/jdoe
  - `html`
- http://localhost:17170/user/jdoe/password
  - `html`
- http://localhost:17170/groups
  - `html`
- http://localhost:17170/groups/create
  - `html`
- http://localhost:17170/group/4
  - `html`
- http://localhost:17170/user-attributes
  - `html`
- http://localhost:17170/user-attributes/create
  - `html`
- http://localhost:17170/group-attributes
  - `html`
- http://localhost:17170/group-attributes/create
  - `html`
- http://localhost:17170/users [state:user-menu-dropdown]
  - `html`
- http://localhost:17170/users [state:dark-mode]
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://localhost:17170/user/jdoe
  - `div:nth-child(3) > h5`
- http://localhost:17170/user/jdoe/password
  - `h5`
- http://localhost:17170/groups/create
  - `h5`
- http://localhost:17170/group/4
  - `h5`
- http://localhost:17170/user-attributes/create
  - `h5`
- http://localhost:17170/group-attributes/create
  - `h5`
- http://localhost:17170/users [state:delete-user-modal]
  - `#deleteUserModaljdoe > .modal-dialog > .modal-content > .modal-header > h5`
- http://localhost:17170/groups [state:delete-group-modal]
  - `#deleteGroupModal4 > .modal-dialog > .modal-content > .modal-header > h5`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://localhost:17170/user/jdoe
  - `th:nth-child(2)`
- http://localhost:17170/group/4
  - `th:nth-child(3)`

## Résultats incomplets à revoir (9)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### duplicate-id-aria — IDs used in ARIA and labels must be unique

- http://localhost:17170/users
  - `#deleteUserModaladmin > .modal-dialog > .modal-content > .modal-header > h5`
- http://localhost:17170/groups
  - `#deleteGroupModal1 > .modal-dialog > .modal-content > .modal-header > h5`
- http://localhost:17170/users [state:user-menu-dropdown]
  - `#deleteUserModaladmin > .modal-dialog > .modal-content > .modal-header > h5`
- http://localhost:17170/users [state:delete-user-modal]
  - `#deleteUserModaladmin > .modal-dialog > .modal-content > .modal-header > h5`
- http://localhost:17170/groups [state:delete-group-modal]
  - `#deleteGroupModal1 > .modal-dialog > .modal-content > .modal-header > h5`
- http://localhost:17170/users [state:dark-mode]
  - `#deleteUserModaladmin > .modal-dialog > .modal-content > .modal-header > h5`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:17170/user/jdoe
  - `select`
- http://localhost:17170/group/4
  - `select`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:17170/users [state:user-menu-dropdown]
  - `.dropdown-menu`

