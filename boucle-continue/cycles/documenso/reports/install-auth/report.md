# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 24/24 scénario(s) audité(s), 0 erreur(s), 80 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `c704f3ccdeb6`

## Résultats incomplets à revoir (80)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9410/t/personal_cuoynezlombdudsk/documents/envelope_kfzseitcehwfaoyb/edit
  - `.mt-6`
  - `.mt-1`
- http://localhost:9410/t/personal_cuoynezlombdudsk/documents/envelope_ikwnlktyatezunzk/logs
  - `.text-foreground.text-sm:nth-child(1) > h2`
  - `.text-foreground.text-sm:nth-child(1) > .text-muted-foreground`
  - `.text-foreground.text-sm:nth-child(2) > h2`
  - `.text-foreground.text-sm:nth-child(2) > .text-muted-foreground`
  - `.text-foreground.text-sm:nth-child(3) > h2`
  - `.text-foreground.text-sm:nth-child(3) > .text-muted-foreground`
  - `.text-foreground.text-sm:nth-child(4) > h2`
  - `.text-foreground.text-sm:nth-child(4) > .text-muted-foreground`
  - `.text-foreground.text-sm:nth-child(5) > h2`
  - `.text-foreground.text-sm:nth-child(5) > .text-muted-foreground`
  - … +7 autres
- http://localhost:9410/t/personal_cuoynezlombdudsk/templates/envelope_blyzafhiuwaxtkdi/edit
  - `.mt-6`
  - `.mt-1`
- http://localhost:9410/t/personal_cuoynezlombdudsk/analytics
  - `tspan[x="47.95"][dy="0.71em"]`
  - `tspan[x="167.45"][dy="0.71em"]`
  - `tspan[x="286.95"][dy="0.71em"]`
  - `tspan[x="406.45"][dy="0.71em"]`
  - `tspan[x="525.95"][dy="0.71em"]`
  - `tspan[x="645.45"][dy="0.71em"]`
  - `text[y="210"] > tspan[dy="0.355em"][x="28"]`
  - `text[y="142.66666666666669"] > tspan[dy="0.355em"][x="28"]`
  - `text[y="75.33333333333334"][orientation="left"][width="36"] > tspan[dy="0.355em"][x="28"]`
  - `text[y="9"] > tspan[dy="0.355em"][x="28"]`
- http://localhost:9410/t/personal_cuoynezlombdudsk/documents [state:search-command-menu]
  - `.h-7.text-\[13px\].whitespace-nowrap:nth-child(2) > .opacity-60.font-normal`
  - `#radix-_r_a_ > .min-w-0.flex-1 > .block.text-foreground.truncate`
  - `#radix-_r_a_ > .tracking-widest.text-xs.text-muted-foreground`
  - `#radix-_r_b_ > .min-w-0.flex-1 > .block.text-foreground.truncate`
  - `#radix-_r_c_ > .min-w-0.flex-1 > .block.text-foreground.truncate`
  - `#radix-_r_d_ > .min-w-0.flex-1 > .block.text-foreground.truncate`
  - `#radix-_r_e_ > .min-w-0.flex-1 > .block.text-foreground.truncate`
  - `#radix-_r_h_ > .min-w-0.flex-1 > .block.text-foreground.truncate`
  - `#radix-_r_h_ > .tracking-widest.text-xs.text-muted-foreground`
  - `#radix-_r_k_ > .min-w-0.flex-1 > .block.text-foreground.truncate`
  - … +4 autres
- http://localhost:9410/t/personal_cuoynezlombdudsk/documents/envelope_kfzseitcehwfaoyb/edit [state:editor-settings-dialog]
  - `.mt-6`
  - `.mt-1`
  - `label[for="_r_3h_-form-item"]`
- http://localhost:9410/t/personal_cuoynezlombdudsk/documents [state:mobile-documents-390]
  - `th:nth-child(4)`
  - `th:nth-child(5)`
  - `th:nth-child(6)`
  - `th:nth-child(7)`
  - `a[title="C53 Pending multi-signataires"]`
  - `tr[data-state="false"]:nth-child(1) > td:nth-child(4)`
  - `tr[data-state="false"]:nth-child(1) > td:nth-child(6) > span`
  - `a[title="C53 Draft multi-signataires"]`
  - `tr[data-state="false"]:nth-child(2) > td:nth-child(4)`
  - `tr[data-state="false"]:nth-child(2) > td:nth-child(6) > span`
- http://localhost:9410/t/personal_cuoynezlombdudsk/documents [state:dark-documents]
  - `th:nth-child(4)`
  - `th:nth-child(5)`
  - `th:nth-child(6)`
  - `th:nth-child(7)`
  - `a[title="C53 Pending multi-signataires"]`
  - `tr[data-state="false"]:nth-child(1) > td:nth-child(4)`
  - `:root`
  - `a[title="C53 Draft multi-signataires"]`
  - `tr[data-state="false"]:nth-child(2) > td:nth-child(4)`
  - `:root`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:9410/t/personal_cuoynezlombdudsk/documents [state:search-command-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `div[data-aria-hidden="true"][aria-hidden="true"]:nth-child(2)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(9)`
- http://localhost:9410/t/personal_cuoynezlombdudsk/documents [state:create-folder-dialog]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `div[data-aria-hidden="true"][aria-hidden="true"]:nth-child(2)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(9)`
- http://localhost:9410/t/personal_cuoynezlombdudsk/documents/envelope_kfzseitcehwfaoyb/edit [state:editor-settings-dialog]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `div[data-aria-hidden="true"][aria-hidden="true"]:nth-child(2)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(13)`

### bypass — Page must have means to bypass repeated blocks

- http://localhost:9410/t/personal_cuoynezlombdudsk/documents [state:search-command-menu]
  - `html`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9410/t/personal_cuoynezlombdudsk/documents [state:team-switcher-menu]
  - `#radix-_R_2aj5_`
- http://localhost:9410/t/personal_cuoynezlombdudsk/documents [state:status-filter-popover]
  - `button[data-testid="documents-table-status-filter"]`

