# Audit accessibilité — 2026-10-04

**7 règle(s) violée(s), 387 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 0 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `b7db2d55b9f0`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:3000/share/a11yumamishare
  - `header > .bg-transparent.hover\:bg-interactive[data-slot="button"]`
  - `.w-\[42px\]`
  - `#base-ui-_r_4_`
  - `#base-ui-_r_6_`
  - `.gap-1.flex-row.flex > .active\:bg-surface-raised.shadow-xs[data-variant="outline"]:nth-child(1)`
  - `button[data-disabled=""]`
  - `#_r_b_`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:3000/login
  - `.bg-primary`
- http://localhost:3000/share/a11yumamishare
  - `.px-6.py-4.gap-4:nth-child(1) > .px-2.py-1[title="-150"] > .text-sm > div`
  - `.px-6.py-4.gap-4:nth-child(2) > .px-2.py-1[title="-150"] > .text-sm > div`
  - `div[title="-329"] > .text-sm > div`
  - `div[title="2%"] > .text-sm > div`
  - `div[title="-4s "] > .text-sm > div`

## [SERIOUS] aria-command-name — ARIA commands must have an accessible name

Ensure every ARIA button, link and menuitem has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-command-name?application=axeAPI

- http://localhost:3000/share/a11yumamishare
  - `#base-ui-_r_1m_`
  - `#base-ui-_r_1o_`
  - `#base-ui-_r_1q_`
  - `#base-ui-_r_1s_`
  - `#base-ui-_r_1u_`
  - `#base-ui-_r_20_`
  - `#base-ui-_r_22_`
  - `#base-ui-_r_24_`
  - `#base-ui-_r_26_`
  - `#base-ui-_r_28_`
  - … +158 autres

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://localhost:3000/share/a11yumamishare
  - `#base-ui-_r_1m_`
  - `#base-ui-_r_1o_`
  - `#base-ui-_r_1q_`
  - `#base-ui-_r_1s_`
  - `#base-ui-_r_1u_`
  - `#base-ui-_r_20_`
  - `#base-ui-_r_22_`
  - `#base-ui-_r_24_`
  - `#base-ui-_r_26_`
  - `#base-ui-_r_28_`
  - … +158 autres

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:3000/login
  - `html`
- http://localhost:3000/share/a11yumamishare
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:3000/login
  - `html`
- http://localhost:3000/share/a11yumamishare
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:3000/login
  - `h2`
  - `div[data-test="input-username"]`
  - `label[for="_r_2_"]`
  - `#_r_2_`
- http://localhost:3000/share/a11yumamishare
  - `.mb-6`
  - `.text-start`
  - `.px-6.py-4.gap-4:nth-child(1) > .items-start.justify-between.flex-row`
  - `.px-6.py-4.gap-4:nth-child(1) > .text-4xl.text-nowrap.font-bold`
  - `.px-6.py-4.gap-4:nth-child(1) > .px-2.py-1[title="-150"] > .text-sm`
  - `.px-6.py-4.gap-4:nth-child(2) > .items-start.justify-between.flex-row`
  - `.px-6.py-4.gap-4:nth-child(2) > .text-4xl.text-nowrap.font-bold`
  - `.px-6.py-4.gap-4:nth-child(2) > .px-2.py-1[title="-150"] > .text-sm`
  - `.px-6.py-4.gap-4:nth-child(3) > .items-start.justify-between.flex-row`
  - `.px-6.py-4.gap-4:nth-child(3) > .text-4xl.text-nowrap.font-bold`
  - … +20 autres

