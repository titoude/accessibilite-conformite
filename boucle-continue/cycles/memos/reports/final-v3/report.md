# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 106 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `240ca9863691`

## Résultats incomplets à revoir (106)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:3001/
  - `#base-ui-_r_3e_`
- http://localhost:3001/explore
  - `#base-ui-_r_3f_`
- http://localhost:3001/?creator=admin
  - `#base-ui-_r_3f_`
- http://localhost:3001/ [state:memo-editor]
  - `#base-ui-_r_4j_`
- http://localhost:3001/ [state:view-options]
  - `#base-ui-_r_3f_`
- http://localhost:3001/ [state:user-menu]
  - `#base-ui-_r_3f_`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3001/map
  - `a[href$="openmaptiles.org/"]`
  - `.leaflet-control-attribution > a:nth-child(2)`
  - `.pointer-events-auto > h2`
  - `p`
- http://localhost:3001/ [state:view-options]
  - `.tracking-\[-0\.015em\]`
  - `.h-5.tracking-\[0\.04em\].uppercase:nth-child(1)`
  - `.h-5.tracking-\[0\.04em\].uppercase:nth-child(2)`
  - `.h-5.tracking-\[0\.04em\].uppercase:nth-child(3)`
  - `.h-5.tracking-\[0\.04em\].uppercase:nth-child(4)`
  - `.h-5.tracking-\[0\.04em\].uppercase:nth-child(5)`
  - `.h-5.tracking-\[0\.04em\].uppercase:nth-child(6)`
  - `.h-5.tracking-\[0\.04em\].uppercase:nth-child(7)`
  - `.cursor-default.group\/day.select-none:nth-child(1) > .text-muted-foreground.aspect-square.max-w-\[30px\]`
  - `.cursor-default.group\/day.select-none:nth-child(2) > .text-muted-foreground.aspect-square.max-w-\[30px\]`
  - … +20 autres
- http://localhost:3001/ [state:user-menu]
  - `.\@min-\[230px\]\:grid-cols-\[1fr\] > .overflow-hidden.min-w-0 > .text-\[12px\].leading-5[data-sidebar-label="true"]`
  - `.tracking-\[-0\.015em\]`
  - `.tracking-\[0\.04em\].h-5.uppercase:nth-child(1)`
  - `.tracking-\[0\.04em\].h-5.uppercase:nth-child(2)`
  - `.tracking-\[0\.04em\].h-5.uppercase:nth-child(3)`
  - `.tracking-\[0\.04em\].h-5.uppercase:nth-child(4)`
  - `.tracking-\[0\.04em\].h-5.uppercase:nth-child(5)`
  - `.tracking-\[0\.04em\].h-5.uppercase:nth-child(6)`
  - `.tracking-\[0\.04em\].h-5.uppercase:nth-child(7)`
  - `.cursor-default.group\/day.select-none:nth-child(1) > .aspect-square.max-w-\[30px\].text-center`
  - … +36 autres

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:3001/ [state:memo-editor]
  - `.start-0`
  - `.duration-300.ease-in-out.bg-card > .flex-col.gap-2[aria-hidden="true"]`
  - `article`
  - `.tsqd-parent-container`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][data-base-ui-inert=""]:nth-child(3)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][data-base-ui-inert=""]:nth-child(5)`
- http://localhost:3001/ [state:view-options]
  - `span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(2)`
  - `span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(4)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(5)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(7)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`
- http://localhost:3001/ [state:user-menu]
  - `.h-13 > span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `.h-13 > span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(4)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(6)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:3001/ [state:view-options]
  - `#base-ui-_r_2j_`
- http://localhost:3001/ [state:user-menu]
  - `#base-ui-_r_2b_`

