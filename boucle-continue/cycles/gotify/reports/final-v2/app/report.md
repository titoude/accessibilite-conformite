# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 17/17 scénario(s) audité(s), 0 erreur(s), 15 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `8f1daa574945`

## Résultats incomplets à revoir (15)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8095/#/settings
  - `.MuiSelect-select`
  - `#_r_14_`
- http://127.0.0.1:8095/#/applications [state:user-menu]
  - `#user-menu-button`
- http://127.0.0.1:8095/#/ [state:nav-drawer-mobile]
  - `.MuiTypography-caption`
- http://127.0.0.1:8095/#/applications [state:add-app-dialog]
  - `#create-app`
- http://127.0.0.1:8095/#/applications [state:update-app-dialog]
  - `.css-195ypl5:nth-child(4)`
  - `.css-1plsf6o:nth-child(4)`
- http://127.0.0.1:8095/#/clients [state:add-client-dialog]
  - `#create-client`
- http://127.0.0.1:8095/#/users [state:add-user-dialog]
  - `#create-user`
- http://127.0.0.1:8095/#/messages/1 [state:push-message-dialog]
  - `#push-message`
  - `.MuiTypography-caption`
- http://127.0.0.1:8095/#/ [state:confirm-delete-all]
  - `#delete-all`
  - `.MuiTypography-caption`
- http://127.0.0.1:8095/#/ [state:snackbar-undo]
  - `.MuiTypography-caption`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://127.0.0.1:8095/#/applications [state:user-menu]
  - `#user-menu-button`

