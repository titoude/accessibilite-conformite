# Audit accessibilité — 2026-10-04

**17 règle(s) violée(s), 1387 occurrence(s), 38/38 scénario(s) audité(s), 0 erreur(s), 56 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `723c223bc12d`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:3000/dashboard
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
- http://localhost:3000/dashboard/edit
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
  - `#base-ui-_r_l_`
  - `#base-ui-_r_r_`
- http://localhost:3000/websites
  - `.p-3.justify-between.flex-row > .hover\:bg-transparent.active\:bg-transparent[data-variant="zero"]`
  - `#base-ui-_r_k_`
- http://localhost:3000/boards
  - `.hover\:bg-transparent.active\:bg-transparent[data-slot="button"]`
  - `#base-ui-_r_k_`
  - `#base-ui-_r_n_`
- http://localhost:3000/boards/f08a66bc-226d-484b-8446-71ac26a22375
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
  - `#_r_f_`
  - `.gap-1.flex-row.flex > .active\:bg-surface-raised.shadow-xs[data-variant="outline"]:nth-child(1)`
  - `button[data-disabled=""]`
  - `#_r_p_`
- http://localhost:3000/links
  - `.hover\:bg-transparent.active\:bg-transparent[data-slot="button"]`
  - `#base-ui-_r_k_`
  - `#base-ui-_r_n_`
- http://localhost:3000/links/ec520c8a-0a22-4b18-9cde-5feb562e4563
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
  - `#_r_f_`
  - `.gap-1.flex-row.flex > .active\:bg-surface-raised.shadow-xs[data-variant="outline"]:nth-child(1)`
  - `button[data-disabled=""]`
  - `#_r_n_`
- http://localhost:3000/pixels
  - `.hover\:bg-transparent.active\:bg-transparent[data-slot="button"]`
  - `#base-ui-_r_k_`
  - `#base-ui-_r_n_`
- http://localhost:3000/pixels/afa6189b-6717-41d9-b6ca-cb0c6838ec1b
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
  - `#_r_f_`
  - `.gap-1.flex-row.flex > .active\:bg-surface-raised.shadow-xs[data-variant="outline"]:nth-child(1)`
  - `button[data-disabled=""]`
  - `#_r_n_`
- http://localhost:3000/teams
  - `button[data-slot="button"]`
  - `#base-ui-_r_l_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `.p-3.justify-between.items-center > .border-0.hover\:bg-transparent.active\:bg-transparent`
  - `#_r_f_`
  - `.gap-1.flex-row.flex > .active\:bg-surface-raised.shadow-xs[data-variant="outline"]:nth-child(1)`
  - `button[data-disabled=""]`
  - `#_r_n_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/realtime
  - `.p-3.justify-between.flex-row > .hover\:bg-transparent.active\:bg-transparent[data-variant="zero"]`
  - `#_r_f_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions
  - `.p-3.justify-between.flex-row > .hover\:bg-transparent.active\:bg-transparent[data-variant="zero"]`
  - `#_r_f_`
  - `.flex-wrap.gap-\[var\(--zen-gap\)\].flex-row > .gap-1.flex-row > .active\:bg-surface-raised.hover\:border-edge-strong[data-variant="outline"]:nth-child(1)`
  - `.flex-wrap.gap-\[var\(--zen-gap\)\].flex-row > .gap-1.flex-row > .active\:bg-surface-raised[data-disabled=""][data-variant="outline"]`
  - `#_r_n_`
  - `#base-ui-_r_12_`
  - `.flex-nowrap > .gap-1.flex-row > .active\:bg-surface-raised[data-disabled=""][data-variant="outline"]`
  - `.flex-nowrap > .gap-1.flex-row > .active\:bg-surface-raised.hover\:border-edge-strong[data-variant="outline"]:nth-child(2)`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/events
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
  - `#_r_f_`
  - `.gap-1.flex-row.flex > .active\:bg-surface-raised.shadow-xs[data-variant="outline"]:nth-child(1)`
  - `button[data-disabled=""]`
  - `#_r_n_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/breakdown
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
  - `#_r_f_`
  - `.gap-1.flex-row > .active\:bg-surface-raised.shadow-xs[data-variant="outline"]:nth-child(1)`
  - `button[data-disabled=""]`
  - `#_r_n_`
  - `#base-ui-_r_u_`
  - `#base-ui-_r_10_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/funnels
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
  - `#_r_f_`
  - `.gap-1.flex-row.flex > .active\:bg-surface-raised.shadow-xs[data-variant="outline"]:nth-child(1)`
  - `button[data-disabled=""]`
  - `#_r_n_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/retention
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
  - `#_r_f_`
  - `#_r_n_`
  - `#_r_r_`
  - `#base-ui-_r_10_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/utm
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
  - `#_r_f_`
  - `.gap-1.flex-row.flex > .active\:bg-surface-raised.shadow-xs[data-variant="outline"]:nth-child(1)`
  - `button[data-disabled=""]`
  - `#_r_n_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/revenue
  - `.p-3.justify-between.flex-row > .hover\:bg-transparent.active\:bg-transparent[data-variant="zero"]`
  - `#_r_f_`
  - `.flex-wrap.gap-\[var\(--zen-gap\)\].flex-row > .gap-1.flex-row > .active\:bg-surface-raised[data-variant="outline"][data-slot="button"]:nth-child(1)`
  - `.flex-wrap.gap-\[var\(--zen-gap\)\].flex-row > .gap-1.flex-row > .active\:bg-surface-raised[data-disabled=""][data-variant="outline"]`
  - `#_r_n_`
  - `#base-ui-_r_14_`
  - `#base-ui-_r_16_`
  - `#_r_17_`
  - `#base-ui-_r_1n_`
  - `.flex-nowrap > .gap-1.flex-row > .active\:bg-surface-raised[data-disabled=""][data-variant="outline"]`
  - … +1 autres
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/segments
  - `.hover\:bg-transparent.active\:bg-transparent[data-slot="button"]`
  - `#_r_f_`
  - `#base-ui-_r_p_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/settings
  - `.p-3.justify-between.flex-row > .hover\:bg-transparent.active\:bg-transparent[data-variant="zero"]`
  - `#_r_f_`
- http://localhost:3000/settings/profile
  - `button[data-slot="button"]`
- http://localhost:3000/settings/preferences
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
  - `#_r_g_`
  - `#_r_k_`
  - `#_r_o_`
- http://localhost:3000/settings/security
  - `button[data-slot="button"]`
- http://localhost:3000/settings/teams
  - `button[data-slot="button"]`
  - `#base-ui-_r_l_`
- http://localhost:3000/settings/websites
  - `.hover\:bg-transparent.active\:bg-transparent[data-slot="button"]`
  - `#base-ui-_r_h_`
- http://localhost:3000/settings/api-keys
  - `button[data-slot="button"]`
- http://localhost:3000/admin/users
  - `button[data-slot="button"]`
  - `#base-ui-_r_m_`
  - `#base-ui-_r_p_`
- http://localhost:3000/admin/teams
  - `button[data-slot="button"]`
  - `#base-ui-_r_m_`
- http://localhost:3000/admin/websites
  - `button[data-slot="button"]`
  - `#base-ui-_r_k_`
  - `#base-ui-_r_n_`
  - `#base-ui-_r_q_`
- http://localhost:3000/admin/security
  - `button[data-slot="button"]`
- http://localhost:3000/console/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `button[data-slot="button"]`
- http://localhost:3000/dashboard [state:user-menu]
  - `.p-3.justify-between.flex-row > .border-0.hover\:bg-transparent.active\:bg-transparent`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3 [state:date-range]
  - `#base-ui-_r_3_`
  - `#_r_f_`
  - `.gap-1.flex-row.flex > .active\:bg-surface-raised.shadow-xs[data-variant="outline"]:nth-child(1)`
  - `button[data-disabled=""]`
  - `#_r_n_`
- http://localhost:3000/settings/preferences [state:dark-mode]
  - `#base-ui-_r_3_`
  - `#_r_g_`
  - `#_r_k_`
  - `#_r_o_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions [state:website-select]
  - `#base-ui-_r_3_`
  - `#_r_f_`
  - `.flex-wrap.gap-\[var\(--zen-gap\)\].flex-row > .gap-1.flex-row.flex > .active\:bg-surface-raised.hover\:border-edge-strong[data-variant="outline"]:nth-child(1)`
  - `.flex-wrap.gap-\[var\(--zen-gap\)\].flex-row > .gap-1.flex-row.flex > .active\:bg-surface-raised[data-disabled=""][data-variant="outline"]`
  - `#_r_n_`
  - `.flex-nowrap > .gap-1.flex-row.flex > .active\:bg-surface-raised[data-disabled=""][data-variant="outline"]`
  - `.flex-nowrap > .gap-1.flex-row.flex > .active\:bg-surface-raised.hover\:border-edge-strong[data-variant="outline"]:nth-child(2)`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.13/image-alt?application=axeAPI

- http://localhost:3000/dashboard
  - `img`
- http://localhost:3000/dashboard/edit
  - `img`
- http://localhost:3000/websites
  - `body > img`
- http://localhost:3000/boards
  - `img`
- http://localhost:3000/boards/f08a66bc-226d-484b-8446-71ac26a22375
  - `body > img`
- http://localhost:3000/links
  - `img`
- http://localhost:3000/links/ec520c8a-0a22-4b18-9cde-5feb562e4563
  - `img`
- http://localhost:3000/pixels
  - `img`
- http://localhost:3000/pixels/afa6189b-6717-41d9-b6ca-cb0c6838ec1b
  - `img`
- http://localhost:3000/teams
  - `img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/realtime
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions
  - `td:nth-child(5) > .gap-3.flex-row > img[src$="unknown.png"]`
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/events
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/breakdown
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/funnels
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/retention
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/utm
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/revenue
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/segments
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/settings
  - `img`
- http://localhost:3000/settings/profile
  - `img`
- http://localhost:3000/settings/preferences
  - `img`
- http://localhost:3000/settings/security
  - `img`
- http://localhost:3000/settings/teams
  - `img`
- http://localhost:3000/settings/websites
  - `body > img`
- http://localhost:3000/settings/api-keys
  - `img`
- http://localhost:3000/admin/users
  - `img`
- http://localhost:3000/admin/teams
  - `img`
- http://localhost:3000/admin/websites
  - `img`
- http://localhost:3000/admin/security
  - `img`
- http://localhost:3000/console/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `img`
- http://localhost:3000/dashboard [state:user-menu]
  - `img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3 [state:date-range]
  - `img[data-base-ui-inert=""]`
- http://localhost:3000/settings/preferences [state:dark-mode]
  - `img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions [state:website-select]
  - `.border-edge.py-3.border-b:nth-child(10) > .text-sm > .gap-3.items-center.flex-row > img[src$="unknown.png"]`
  - `img[data-base-ui-inert=""]`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/realtime
  - `div[role="list"]`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/settings
  - `#_r_q_`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:3000/dashboard/edit
  - `.bg-primary`
- http://localhost:3000/websites
  - `.bg-primary > .gap-2.flex-row > .text-sm`
- http://localhost:3000/boards
  - `#base-ui-_r_h_ > .gap-2.flex-row.flex > .text-sm`
- http://localhost:3000/links
  - `#base-ui-_r_h_ > .gap-2.flex-row > .text-sm`
- http://localhost:3000/links/ec520c8a-0a22-4b18-9cde-5feb562e4563
  - `.px-6.py-4.gap-4:nth-child(1) > .px-2.py-1.self-start > .text-sm > div`
  - `.px-6.py-4.gap-4:nth-child(2) > .px-2.py-1.self-start > .text-sm > div`
  - `.px-6.py-4.gap-4:nth-child(3) > .px-2.py-1.self-start > .text-sm > div`
- http://localhost:3000/pixels
  - `#base-ui-_r_h_ > .gap-2.flex-row.flex > .text-sm`
- http://localhost:3000/pixels/afa6189b-6717-41d9-b6ca-cb0c6838ec1b
  - `.px-6.py-4.gap-4:nth-child(1) > .px-2.py-1.self-start > .text-sm > div`
  - `.px-6.py-4.gap-4:nth-child(2) > .px-2.py-1.self-start > .text-sm > div`
  - `.px-6.py-4.gap-4:nth-child(3) > .px-2.py-1.self-start > .text-sm > div`
- http://localhost:3000/teams
  - `#base-ui-_r_j_ > .text-sm`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `.px-6.py-4.gap-4:nth-child(1) > .px-2.py-1[title="-150"] > .text-sm > div`
  - `.px-6.py-4.gap-4:nth-child(2) > .px-2.py-1[title="-150"] > .text-sm > div`
  - `div[title="-329"] > .text-sm > div`
  - `div[title="2%"] > .text-sm > div`
  - `div[title="-4s "] > .text-sm > div`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/events
  - `.px-6.py-4.gap-4:nth-child(1) > .px-2.py-1[title="-62"] > .text-sm > div`
  - `.px-6.py-4.gap-4:nth-child(2) > .px-2.py-1[title="-62"] > .text-sm > div`
  - `div[title="-91"] > .text-sm > div`
  - `div[title="0"] > .text-sm > div`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/funnels
  - `#base-ui-_r_s_ > .gap-2.flex-row.flex > .text-sm`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/revenue
  - `div[title="$299.00"] > .text-sm > div`
  - `div[title="$7.89"] > .text-sm > div`
  - `div[title="$2.15"] > .text-sm > div`
  - `div[title="1"] > .text-sm > div`
  - `div[title="2"] > .text-sm > div`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/segments
  - `#base-ui-_r_n_ > .gap-2.flex-row.flex > .text-sm`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/settings
  - `button[type="submit"]`
  - `#base-ui-_r_1a_ > .gap-2.flex-row.flex > .text-sm`
  - `#base-ui-_r_18_`
- http://localhost:3000/settings/security
  - `.Badge-module__TqIQVa__badge`
- http://localhost:3000/settings/teams
  - `#base-ui-_r_j_ > .text-sm`
- http://localhost:3000/settings/api-keys
  - `#base-ui-_r_h_ > .text-sm`
- http://localhost:3000/admin/users
  - `#base-ui-_r_j_ > .text-sm`
- http://localhost:3000/admin/teams
  - `#base-ui-_r_j_ > .text-sm`
- http://localhost:3000/websites [state:mobile-nav]
  - `.bg-primary > .gap-2.flex-row.flex > .text-sm`
- http://localhost:3000/websites [state:add-website]
  - `.bg-primary.text-primary-fg.hover\:opacity-90 > .gap-2.flex-row.flex > .text-sm`
  - `button[type="submit"]`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3 [state:date-range]
  - `.px-6.py-4.gap-4:nth-child(1) > .px-2.self-start[title="-150"] > .text-sm > div`
  - `.px-6.py-4.gap-4:nth-child(2) > .px-2.self-start[title="-150"] > .text-sm > div`
  - `div[title="-329"] > .text-sm > div`
  - `div[title="2%"] > .text-sm > div`
  - `div[title="-4s "] > .text-sm > div`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://localhost:3000/websites
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(1) > .justify-end > .hover\:bg-interactive.active\:bg-interactive-hover[dir="ltr"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(2) > .justify-end > .hover\:bg-interactive.active\:bg-interactive-hover[dir="ltr"]`
- http://localhost:3000/settings/websites
  - `.border-b.border-edge-muted.min-h-10:nth-child(1) > .justify-end > .hover\:bg-interactive.active\:bg-interactive-hover[dir="ltr"]`
  - `.border-b.border-edge-muted.min-h-10:nth-child(2) > .justify-end > .hover\:bg-interactive.active\:bg-interactive-hover[dir="ltr"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://localhost:3000/links
  - `td:nth-child(2) > .overflow-hidden.gap-\[var\(--zen-gap\)\].flex-row > .truncate.text-sm > a[target="_blank"]`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `#base-ui-_r_22_`
  - `#base-ui-_r_24_`
  - `#base-ui-_r_26_`
  - `#base-ui-_r_28_`
  - `#base-ui-_r_2a_`
  - `#base-ui-_r_2c_`
  - `#base-ui-_r_2e_`
  - `#base-ui-_r_2g_`
  - `#base-ui-_r_2i_`
  - `#base-ui-_r_2k_`
  - … +158 autres

## [SERIOUS] aria-command-name — ARIA commands must have an accessible name

Ensure every ARIA button, link and menuitem has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-command-name?application=axeAPI

- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `#base-ui-_r_22_`
  - `#base-ui-_r_24_`
  - `#base-ui-_r_26_`
  - `#base-ui-_r_28_`
  - `#base-ui-_r_2a_`
  - `#base-ui-_r_2c_`
  - `#base-ui-_r_2e_`
  - `#base-ui-_r_2g_`
  - `#base-ui-_r_2i_`
  - `#base-ui-_r_2k_`
  - … +158 autres
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3 [state:date-range]
  - `#base-ui-_r_22_`
  - `#base-ui-_r_24_`
  - `#base-ui-_r_26_`
  - `#base-ui-_r_28_`
  - `#base-ui-_r_2a_`
  - `#base-ui-_r_2c_`
  - `#base-ui-_r_2e_`
  - `#base-ui-_r_2g_`
  - `#base-ui-_r_2i_`
  - `#base-ui-_r_2k_`
  - … +158 autres

## [SERIOUS] scrollable-region-focusable — Scrollable region must have keyboard access

Ensure elements that have scrollable content are accessible by keyboard in Safari
Référence : https://dequeuniversity.com/rules/axe/4.13/scrollable-region-focusable?application=axeAPI

- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/retention
  - `.overflow-auto`

## [SERIOUS] aria-toggle-field-name — ARIA toggle fields must have an accessible name

Ensure every ARIA toggle field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-toggle-field-name?application=axeAPI

- http://localhost:3000/admin/security
  - `#base-ui-_r_j_`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-dialog-name?application=axeAPI

- http://localhost:3000/websites [state:mobile-nav]
  - `#_r_2_`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:3000/dashboard
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.border-b > .flex-col.gap-2.flex`
  - `.text-fg-muted`
  - `img`
- http://localhost:3000/dashboard/edit
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.border-b > .flex-col.gap-2.flex`
  - `img`
- http://localhost:3000/websites
  - `.p-3.justify-between.flex-row > .gap-2.flex-row > .font-bold.text-sm`
  - `.mb-6 > .flex-col.gap-2`
  - `#chart`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(1) > td:nth-child(1)`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(1) > td:nth-child(2)`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(1) > td:nth-child(4)`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(2) > td:nth-child(1)`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(2) > td:nth-child(2)`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(2) > td:nth-child(4)`
  - `.mt-4`
  - … +1 autres
- http://localhost:3000/boards
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mb-6 > .flex-col.gap-2.flex`
  - `td:nth-child(1)`
  - `td:nth-child(2)`
  - `td:nth-child(3)`
  - `td:nth-child(4)`
  - `.mt-4`
  - `img`
- http://localhost:3000/boards/f08a66bc-226d-484b-8446-71ac26a22375
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].flex-row.flex > .truncate.text-sm`
  - `.border-b > .flex-col.gap-2.flex`
  - `.rounded-full`
  - `#_r_p_ > .text-start.truncate[data-slot="select-value"]`
  - `body > img`
- http://localhost:3000/links
  - `.p-3.justify-between.flex-row > .gap-2.flex-row > .font-bold.text-sm`
  - `.mb-6 > .flex-col.gap-2`
  - `#chart`
  - `td:nth-child(1)`
  - `td:nth-child(2) > .overflow-hidden.gap-\[var\(--zen-gap\)\].flex-row > .truncate.text-sm`
  - `span[title="https://example.com/campaign"]`
  - `td:nth-child(5)`
  - `.mt-4`
  - `img`
- http://localhost:3000/links/ec520c8a-0a22-4b18-9cde-5feb562e4563
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.items-center > .font-bold.text-sm`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].flex-row.items-center > .truncate.text-sm`
  - `.text-lg`
  - `span[title="https://example.com/campaign"]`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `.grid.gap-\[var\(--zen-gap\)\]`
  - `.pb-6 > .md\:px-6.py-6.px-3`
  - `.zen-grid-_r_s_`
  - `.zen-grid-_r_17_ > .md\:px-6.py-6.px-3:nth-child(2)`
  - `img`
- http://localhost:3000/pixels
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mb-6 > .flex-col.gap-2.flex`
  - `#chart`
  - `td:nth-child(1)`
  - `.overflow-hidden.gap-\[var\(--zen-gap\)\].flex-row > .truncate.text-sm`
  - `td:nth-child(4)`
  - `.mt-4`
  - `img`
- http://localhost:3000/pixels/afa6189b-6717-41d9-b6ca-cb0c6838ec1b
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.items-center > .font-bold.text-sm`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].flex-row.items-center > .truncate.text-sm`
  - `.text-lg`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `.grid.gap-\[var\(--zen-gap\)\]`
  - `.pb-6 > .md\:px-6.py-6.px-3`
  - `.zen-grid-_r_s_`
  - `.zen-grid-_r_17_ > .md\:px-6.py-6.px-3:nth-child(2)`
  - `img`
- http://localhost:3000/teams
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.border-b > .flex-col.gap-2.flex`
  - `.text-fg-muted`
  - `img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `.p-3.justify-between.items-center > .gap-2.items-center.flex-row > .font-bold.text-sm`
  - `.mb-1.gap-1.flex-col:nth-child(2) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(3) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(4) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(5) > .mt-2.px-3.flex-row`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].items-center.flex-row > .truncate.text-sm`
  - `.flex-wrap.gap-6.items-center > a:nth-child(1)`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `.px-6.py-4.gap-4:nth-child(1) > .items-start.justify-between.flex-row`
  - `.px-6.py-4.gap-4:nth-child(1) > .text-4xl.text-nowrap.font-bold`
  - … +27 autres
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/realtime
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mb-1.gap-1.flex-col:nth-child(2) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(3) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(4) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(5) > .mt-2.px-3.flex-row`
  - `.text-start > .gap-\[var\(--zen-gap\)\].flex-row.flex > .truncate.text-sm`
  - `.flex-wrap.gap-6.flex-row > a:nth-child(1)`
  - `.gap-3.grid > .grid.gap-\[var\(--zen-gap\)\]`
  - `.flex-col.flex > .gap-3.grid > .md\:px-6.py-6.bg-surface:nth-child(2)`
  - `.gap-3.flex-col.flex > h2`
  - … +42 autres
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions
  - `.p-3.justify-between.flex-row > .gap-2.flex-row > .font-bold.text-sm`
  - `.mb-1.gap-1.flex-col:nth-child(2) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(3) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(4) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(5) > .mt-2.px-3.flex-row`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].flex-row > .truncate.text-sm`
  - `.gap-6.flex-wrap.flex-row > a:nth-child(1)`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `.md\:px-6.py-6.min-w-0`
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/events
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mb-1.gap-1.flex-col:nth-child(2) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(3) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(4) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(5) > .mt-2.px-3.flex-row`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].flex-row.flex > .truncate.text-sm`
  - `.flex-wrap.gap-6.flex-row > a:nth-child(1)`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `.px-6.py-4.gap-4:nth-child(1) > .items-start.justify-between.flex-row`
  - `.px-6.py-4.gap-4:nth-child(1) > .text-4xl.text-nowrap.font-bold`
  - … +10 autres
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/breakdown
  - `.p-3.justify-between.flex-row > .gap-2.flex-row > .font-bold.text-sm`
  - `.mb-1.gap-1.flex-col:nth-child(2) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(3) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(4) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(5) > .mt-2.px-3.flex-row`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].flex-row > .truncate.text-sm`
  - `.gap-6 > a:nth-child(1)`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `.overflow-auto.min-h-0.flex-col`
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/funnels
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mb-1.gap-1.flex-col:nth-child(2) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(3) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(4) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(5) > .mt-2.px-3.flex-row`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].flex-row.flex > .truncate.text-sm`
  - `.gap-6 > a:nth-child(1)`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/retention
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mb-1.gap-1.flex-col:nth-child(2) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(3) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(4) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(5) > .mt-2.px-3.flex-row`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].flex-row.flex > .truncate.text-sm`
  - `.flex-wrap > a:nth-child(1)`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `#_r_r_ > .text-start.truncate[data-slot="select-value"]`
  - `.grid-flow-col.grid.gap-1:nth-child(1)`
  - … +10 autres
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/utm
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.items-center > .font-bold`
  - `.mb-1.gap-1.flex-col:nth-child(2) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(3) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(4) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(5) > .mt-2.px-3.flex-row`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].flex-row.items-center > .truncate`
  - `.flex-wrap.gap-6.flex-row > a:nth-child(1)`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `.zen-grid-_r_r_`
  - `.zen-grid-_r_1i_`
  - … +4 autres
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/revenue
  - `.p-3.justify-between.flex-row > .gap-2.flex-row > .font-bold.text-sm`
  - `.mb-1.gap-1.flex-col:nth-child(2) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(3) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(4) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(5) > .mt-2.px-3.flex-row`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].flex-row > .truncate.text-sm`
  - `.flex-wrap.gap-6.flex-row > a:nth-child(1)`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `label`
  - `#_r_s_ > .text-start.truncate[data-slot="select-value"]`
  - … +23 autres
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/segments
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mb-1.gap-1.flex-col:nth-child(2) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(3) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(4) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(5) > .mt-2.px-3.flex-row`
  - `.text-start > .gap-\[var\(--zen-gap\)\].flex-row.flex > .truncate.text-sm`
  - `.gap-6 > a:nth-child(1)`
  - `.text-fg-muted.justify-center.flex-row`
  - `body > img`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/settings
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mb-1.gap-1.flex-col:nth-child(2) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(3) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(4) > .mt-2.px-3.flex-row`
  - `.mb-1.gap-1.flex-col:nth-child(5) > .mt-2.px-3.flex-row`
  - `.text-start > .gap-\[var\(--zen-gap\)\].flex-row.flex > .truncate.text-sm`
  - `a > .gap-2.flex-row.flex > .text-sm`
  - `.text-lg`
  - `span[title="app.example.com"]`
  - `label[for="_r_k_"]`
  - … +20 autres
- http://localhost:3000/settings/profile
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mt-2`
  - `.border-b`
  - `.bg-surface.py-6.border-edge > .gap-6.flex-col.flex > .flex-col.flex:nth-child(1)`
  - `.gap-6.flex-col.flex > .flex-col.flex:nth-child(2)`
  - `.flex-col.flex:nth-child(3) > label`
  - `img`
- http://localhost:3000/settings/preferences
  - `.p-3.justify-between.flex-row > .gap-2.flex-row > .font-bold.text-sm`
  - `.mt-2`
  - `.border-b`
  - `.gap-1.flex-col:nth-child(1) > label`
  - `#_r_g_ > .text-start.truncate[data-slot="select-value"]`
  - `.gap-1.flex-col:nth-child(2) > label`
  - `#_r_k_ > .text-start.truncate[data-slot="select-value"]`
  - `.gap-1.flex-col:nth-child(3) > label`
  - `#_r_o_ > .text-start.truncate[data-slot="select-value"]`
  - `.gap-1.flex-col:nth-child(4) > label`
  - … +2 autres
- http://localhost:3000/settings/security
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mt-2`
  - `.border-b`
  - `.bg-surface.py-6.border-edge`
  - `img`
- http://localhost:3000/settings/teams
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mt-2`
  - `.border-b > .flex-col.gap-2.flex`
  - `.text-fg-muted`
  - `img`
- http://localhost:3000/settings/websites
  - `.p-3.justify-between.flex-row > .gap-2.flex-row > .font-bold.text-sm`
  - `.mt-2`
  - `.gap-\[var\(--zen-gap\)\].flex-col > .justify-between.flex-row`
  - `#chart`
  - `.border-b.border-edge-muted.min-h-10:nth-child(1) > td:nth-child(1)`
  - `.border-b.border-edge-muted.min-h-10:nth-child(1) > td:nth-child(2)`
  - `.border-b.border-edge-muted.min-h-10:nth-child(1) > td:nth-child(4)`
  - `.border-b.border-edge-muted.min-h-10:nth-child(2) > td:nth-child(1)`
  - `.border-b.border-edge-muted.min-h-10:nth-child(2) > td:nth-child(2)`
  - `.border-b.border-edge-muted.min-h-10:nth-child(2) > td:nth-child(4)`
  - … +2 autres
- http://localhost:3000/settings/api-keys
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mt-2`
  - `.border-b > .flex-col.gap-2.flex`
  - `.text-fg-muted.text-sm`
  - `img`
- http://localhost:3000/admin/users
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mt-2`
  - `.bg-surface-sunken.px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\] > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `a[href$="websites"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row.flex > .font-normal.text-sm`
  - `a[href$="teams"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row.flex > .font-normal.text-sm`
  - `a[href$="security"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row.flex > .font-normal.text-sm`
  - `.mb-6 > .flex-col.gap-2.flex`
  - `#websites`
  - `td:nth-child(1)`
  - `td:nth-child(2)`
  - … +4 autres
- http://localhost:3000/admin/teams
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.mt-2`
  - `a[href$="users"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row.flex > .font-normal.text-sm`
  - `a[href$="websites"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row.flex > .font-normal.text-sm`
  - `.bg-surface-sunken.px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\] > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `a[href$="security"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row.flex > .font-normal.text-sm`
  - `.border-b > .flex-col.gap-2.flex`
  - `.text-fg-muted.justify-center.flex-row`
  - `img`
- http://localhost:3000/admin/websites
  - `.p-3.justify-between.flex-row > .gap-2.flex-row > .font-bold.text-sm`
  - `.mt-2`
  - `a[href$="users"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row > .font-normal.text-sm`
  - `.bg-surface-sunken.px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\] > .gap-2.flex-row > .font-bold.text-sm`
  - `a[href$="teams"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row > .font-normal.text-sm`
  - `a[href$="security"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row > .font-normal.text-sm`
  - `.mb-6`
  - `#owner`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(1) > td:nth-child(1)`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(1) > td:nth-child(2)`
  - … +8 autres
- http://localhost:3000/admin/security
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.items-center > .font-bold.text-sm`
  - `.mt-2`
  - `a[href$="users"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row.items-center > .font-normal.text-sm`
  - `a[href$="websites"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row.items-center > .font-normal.text-sm`
  - `a[href$="teams"] > .px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\].hover\:bg-surface-sunken > .gap-2.flex-row.items-center > .font-normal.text-sm`
  - `.bg-surface-sunken.px-\[var\(--zen-padding-x\)\].py-\[var\(--zen-padding-y\)\] > .gap-2.flex-row.items-center > .font-bold.text-sm`
  - `.border-b`
  - `.gap-4 > .gap-1.flex-col.flex`
  - `.gap-3.flex-row.items-center > .text-sm:nth-child(2)`
  - `img`
- http://localhost:3000/console/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `img`
- http://localhost:3000/dashboard [state:user-menu]
  - `.p-3.justify-between.flex-row > .gap-2.flex-row.flex > .font-bold.text-sm`
  - `.border-b > .flex-col.gap-2.flex`
  - `.text-fg-muted`
  - `img`
  - `#_r_b_`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3 [state:date-range]
  - `.justify-center.items-center.flex-row > .gap-2.items-center.flex-row > .font-bold.text-sm`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].items-center.flex-row > .truncate.text-sm`
  - `.flex-wrap.gap-6.items-center > a:nth-child(1)`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `.px-6.py-4.gap-4:nth-child(1) > .items-start.justify-between.flex-row`
  - `.px-6.py-4.gap-4:nth-child(1) > .text-4xl.text-nowrap.font-bold`
  - `.px-6.py-4.gap-4:nth-child(1) > .px-2.self-start[title="-150"] > .text-sm`
  - `.px-6.py-4.gap-4:nth-child(2) > .items-start.justify-between.flex-row`
  - `.px-6.py-4.gap-4:nth-child(2) > .text-4xl.text-nowrap.font-bold`
  - `.px-6.py-4.gap-4:nth-child(2) > .px-2.self-start[title="-150"] > .text-sm`
  - … +35 autres
- http://localhost:3000/settings/preferences [state:dark-mode]
  - `.flex-row.justify-center > .gap-2.flex-row > .font-bold.text-sm`
  - `.border-b`
  - `.gap-1.flex-col:nth-child(1) > label`
  - `#_r_g_ > .text-start.truncate[data-slot="select-value"]`
  - `.gap-1.flex-col:nth-child(2) > label`
  - `#_r_k_ > .text-start.truncate[data-slot="select-value"]`
  - `.gap-1.flex-col:nth-child(3) > label`
  - `#_r_o_ > .text-start.truncate[data-slot="select-value"]`
  - `.gap-1.flex-col:nth-child(4) > label`
  - `.gap-1.flex-col:nth-child(5)`
  - … +1 autres
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions [state:website-select]
  - `.justify-center.items-center.flex-row > .gap-2.items-center.flex-row > .font-bold.text-sm`
  - `.text-start.truncate[data-slot="select-value"] > .gap-\[var\(--zen-gap\)\].items-center.flex-row > .truncate.text-sm`
  - `.flex-wrap.gap-6.items-center > a:nth-child(1)`
  - `#_r_n_ > .text-start.truncate[data-slot="select-value"]`
  - `.md\:px-6.py-6.min-w-0`
  - `img[data-base-ui-inert=""]`
  - `.min-w-\[120px\].data-highlighted\:bg-interactive.focus-visible\:bg-interactive:nth-child(1)`
  - `div[data-highlighted=""] > div`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:3000/dashboard
  - `html`
- http://localhost:3000/dashboard/edit
  - `html`
- http://localhost:3000/websites
  - `html`
- http://localhost:3000/boards
  - `html`
- http://localhost:3000/boards/f08a66bc-226d-484b-8446-71ac26a22375
  - `html`
- http://localhost:3000/links
  - `html`
- http://localhost:3000/links/ec520c8a-0a22-4b18-9cde-5feb562e4563
  - `html`
- http://localhost:3000/pixels
  - `html`
- http://localhost:3000/pixels/afa6189b-6717-41d9-b6ca-cb0c6838ec1b
  - `html`
- http://localhost:3000/teams
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/realtime
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/events
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/breakdown
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/funnels
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/retention
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/utm
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/revenue
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/segments
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/settings
  - `html`
- http://localhost:3000/settings/profile
  - `html`
- http://localhost:3000/settings/preferences
  - `html`
- http://localhost:3000/settings/security
  - `html`
- http://localhost:3000/settings/teams
  - `html`
- http://localhost:3000/settings/websites
  - `html`
- http://localhost:3000/settings/api-keys
  - `html`
- http://localhost:3000/admin/users
  - `html`
- http://localhost:3000/admin/teams
  - `html`
- http://localhost:3000/admin/websites
  - `html`
- http://localhost:3000/admin/security
  - `html`
- http://localhost:3000/console/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `html`
- http://localhost:3000/settings/preferences [state:dark-mode]
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:3000/dashboard
  - `html`
- http://localhost:3000/dashboard/edit
  - `html`
- http://localhost:3000/websites
  - `html`
- http://localhost:3000/boards
  - `html`
- http://localhost:3000/boards/f08a66bc-226d-484b-8446-71ac26a22375
  - `html`
- http://localhost:3000/links
  - `html`
- http://localhost:3000/links/ec520c8a-0a22-4b18-9cde-5feb562e4563
  - `html`
- http://localhost:3000/pixels
  - `html`
- http://localhost:3000/pixels/afa6189b-6717-41d9-b6ca-cb0c6838ec1b
  - `html`
- http://localhost:3000/teams
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/realtime
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/events
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/breakdown
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/funnels
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/retention
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/utm
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/revenue
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/segments
  - `html`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/settings
  - `html`
- http://localhost:3000/settings/profile
  - `html`
- http://localhost:3000/settings/preferences
  - `html`
- http://localhost:3000/settings/security
  - `html`
- http://localhost:3000/settings/teams
  - `html`
- http://localhost:3000/settings/websites
  - `html`
- http://localhost:3000/settings/api-keys
  - `html`
- http://localhost:3000/admin/users
  - `html`
- http://localhost:3000/admin/teams
  - `html`
- http://localhost:3000/admin/websites
  - `html`
- http://localhost:3000/admin/security
  - `html`
- http://localhost:3000/console/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `html`
- http://localhost:3000/settings/preferences [state:dark-mode]
  - `html`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions [state:website-select]
  - `.max-w-md`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://localhost:3000/websites
  - `#action`
- http://localhost:3000/boards
  - `#action`
- http://localhost:3000/links
  - `#action`
- http://localhost:3000/pixels
  - `#action`
- http://localhost:3000/settings/websites
  - `#action`
- http://localhost:3000/admin/users
  - `#action`
- http://localhost:3000/admin/websites
  - `#action`

## [MINOR] image-redundant-alt — Alternative text of images should not be repeated as text

Ensure image alternative is not repeated as text
Référence : https://dequeuniversity.com/rules/axe/4.13/image-redundant-alt?application=axeAPI

- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/sessions
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(1) > td:nth-child(6) > .gap-3.flex-row > img[alt="Chrome"][src$="chrome.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(1) > td:nth-child(8) > .gap-3.flex-row > img[alt="desktop"][src$="desktop.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(2) > td:nth-child(6) > .gap-3.flex-row > img[alt="Chrome"][src$="chrome.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(2) > td:nth-child(7) > .gap-3.flex-row > img[alt="Linux"][src$="linux.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(2) > td:nth-child(8) > .gap-3.flex-row > img[alt="desktop"][src$="desktop.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(3) > td:nth-child(6) > .gap-3.flex-row > img[alt="Chrome"][src$="chrome.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(3) > td:nth-child(8) > .gap-3.flex-row > img[alt="desktop"][src$="desktop.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(4) > td:nth-child(6) > .gap-3.flex-row > img[alt="Chrome"][src$="chrome.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(4) > td:nth-child(7) > .gap-3.flex-row > img[alt="iOS"][src$="ios.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(4) > td:nth-child(8) > .gap-3.flex-row > img[alt="mobile"][src$="mobile.png"][width="16"]`
  - … +41 autres
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/revenue
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(1) > td:nth-child(6) > .gap-3.flex-row > img[alt="Edge"][src$="edge.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(1) > td:nth-child(8) > .gap-3.flex-row > img[alt="desktop"][src$="desktop.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(2) > td:nth-child(6) > .gap-3.flex-row > img[alt="Safari"][src$="safari.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(2) > td:nth-child(7) > .gap-3.flex-row > img[alt="iOS"][src$="ios.png"][width="16"]`
  - `img[alt="tablet"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(3) > td:nth-child(6) > .gap-3.flex-row > img[alt="Chrome"][src$="chrome.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(3) > td:nth-child(8) > .gap-3.flex-row > img[alt="desktop"][src$="desktop.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(4) > td:nth-child(6) > .gap-3.flex-row > img[alt="Chrome"][src$="chrome.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(4) > td:nth-child(8) > .gap-3.flex-row > img[alt="desktop"][src$="desktop.png"][width="16"]`
  - `.border-edge-muted.min-h-10[data-slot="table-row"]:nth-child(5) > td:nth-child(6) > .gap-3.flex-row > img[alt="Chrome"][src$="chrome.png"][width="16"]`
  - … +43 autres

## Résultats incomplets à revoir (56)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3000/links
  - `a[href$="campaign"]`
- http://localhost:3000/websites/d4bdaf1e-bca5-465f-848d-f33a9045daf3/realtime
  - `div[data-react-window-index="10"] > .flex-row.flex:nth-child(2) > .text-nowrap.text-sm`
  - `.gap-2.flex-row.flex > .truncate.text-sm > a[href$="demo-page-3"][target="_blank"][rel="noreferrer noopener"]`
  - `div[data-react-window-index="11"] > .flex-row.flex:nth-child(2) > .text-nowrap.text-sm`
  - `.gap-2.flex-row.flex > .truncate.text-sm > a[href$="demo-page-2"][target="_blank"][rel="noreferrer noopener"]`
  - `div[data-react-window-index="12"] > .flex-row.flex:nth-child(2) > .text-nowrap.text-sm`
  - `.gap-2.flex-row.flex > .truncate.text-sm > a[href$="demo-page-1"][target="_blank"][rel="noreferrer noopener"]`
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

### bypass — Page must have means to bypass repeated blocks

- http://localhost:3000/console/d4bdaf1e-bca5-465f-848d-f33a9045daf3
  - `html`
- http://localhost:3000/websites [state:mobile-nav]
  - `html`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:3000/dashboard [state:user-menu]
  - `.flex-row.flex.items-center > span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `.flex-row.flex.items-center > span[data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(4)`
  - `span[data-type="outside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(6)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(1)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][aria-hidden="true"]:nth-child(3)`
- http://localhost:3000/websites [state:mobile-nav]
  - `.h-screen`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][data-base-ui-inert=""]:nth-child(1)`
  - `span[data-type="inside"][data-base-ui-focus-guard=""][data-base-ui-inert=""]:nth-child(3)`
- http://localhost:3000/websites [state:add-website]
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

