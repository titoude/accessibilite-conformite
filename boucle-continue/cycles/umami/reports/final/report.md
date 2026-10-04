# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 38/38 scénario(s) audité(s), 0 erreur(s), 59 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `723c223bc12d`

## Résultats incomplets à revoir (59)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/realtime
  - `div[data-react-window-index="10"] > .flex-row.flex:nth-child(2) > .text-nowrap.text-sm`
  - `div[data-react-window-index="10"] > .gap-2.flex-row.flex > .truncate.text-sm`
  - `div[data-react-window-index="10"] > .gap-2.flex-row.flex > .truncate.text-sm > b`
  - `div[data-react-window-index="10"] > .gap-2.flex-row.flex > .truncate.text-sm > a[href$="signup"][target="_blank"][rel="noreferrer noopener"]`
  - `div[data-react-window-index="11"] > .flex-row.flex:nth-child(2) > .text-nowrap.text-sm`
  - `div[data-react-window-index="11"] > .gap-2.flex-row.flex > .truncate.text-sm > a[href$="signup"][target="_blank"][rel="noreferrer noopener"]`
  - `div[data-react-window-index="12"] > .flex-row.flex:nth-child(2) > .text-nowrap.text-sm`
  - `div[data-react-window-index="12"] > .gap-2.flex-row.flex > .truncate.text-sm`
  - `div[data-react-window-index="12"] > .gap-2.flex-row.flex > .truncate.text-sm > b`
  - `div[data-react-window-index="12"] > .gap-2.flex-row.flex > .truncate.text-sm > a[href$="pricing"][target="_blank"][rel="noreferrer noopener"]`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/retention
  - `.flex-col.flex:nth-child(10) > .text-nowrap.text-center.font-bold`
  - `.flex-col.flex:nth-child(11) > .text-nowrap.text-center.font-bold`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/utm
  - `.text-fg-muted.justify-center.flex-row`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/revenue
  - `#lastAt`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(1) > td:nth-child(9) > .text-sm`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(2) > td:nth-child(9) > .text-sm`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(3) > td:nth-child(9) > .text-sm`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(4) > td:nth-child(9) > .text-sm`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(5) > td:nth-child(9) > .text-sm`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(6) > td:nth-child(9) > .text-sm`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(7) > td:nth-child(9) > .text-sm`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(8) > td:nth-child(9) > .text-sm`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(9) > td:nth-child(9) > .text-sm`
  - … +11 autres

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:3000/dashboard [state:user-menu]
  - `.flex-row.flex.items-center > span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `.flex-row.flex.items-center > span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(4)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(6)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`
- http://localhost:3000/websites [state:mobile-nav]
  - `.skip-link`
  - `.h-screen`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][data-base-ui-inert=""]:nth-child(1)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][data-base-ui-inert=""]:nth-child(3)`
- http://localhost:3000/websites [state:add-website]
  - `.skip-link`
  - `.h-screen`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][data-base-ui-inert=""]:nth-child(1)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][data-base-ui-inert=""]:nth-child(3)`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3 [state:date-range]
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(2)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(4)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions [state:website-select]
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(2)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(4)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:3000/dashboard [state:user-menu]
  - `#base-ui-_r_d_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3 [state:date-range]
  - `#_r_f_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions [state:website-select]
  - `#_r_f_`

