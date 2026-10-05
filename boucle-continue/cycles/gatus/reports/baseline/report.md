# Audit accessibilité — 2026-10-05

**8 règle(s) violée(s), 162 occurrence(s), 11/11 scénario(s) audité(s), 0 erreur(s), 7 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `4b4c5c23b10f`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/select-name?application=axeAPI

- http://127.0.0.1:8080/endpoints/core_front-end
  - `select`
- http://127.0.0.1:8080/endpoints/internal_legacy-service
  - `select`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://127.0.0.1:8080/suites/api-tests_checkout-flow [state:modale-etape]
  - `.border-b.p-4.justify-between > .h-10.w-10.inline-flex`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:8080/
  - `.ml-2.flex-shrink-0[data-v-88e61ed6=""] > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(1) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(2) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `.bg-destructive`
  - `div:nth-child(2) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(3) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(4) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(5) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(6) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(7) > .py-2 > .italic.text-muted-foreground\/60`
  - … +7 autres
- http://127.0.0.1:8080/endpoints/core_front-end
  - `.items-start.justify-between.flex > .px-2\.5.py-0\.5.focus\:ring-offset-2`
  - `.flex-shrink-0 > .px-2\.5.py-0\.5.focus\:ring-offset-2`
- http://127.0.0.1:8080/endpoints/internal_legacy-service
  - `.items-start.justify-between.flex > .px-2\.5.py-0\.5.focus\:ring-offset-2`
  - `.flex-shrink-0 > .px-2\.5.py-0\.5.focus\:ring-offset-2`
- http://127.0.0.1:8080/suites/api-tests_checkout-flow
  - `.gap-2.items-center.flex > .px-2\.5.py-0\.5.focus\:outline-none`
  - `.bg-accent > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.bg-accent > .gap-3.items-center.flex > div:nth-child(2) > .text-xs`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(2) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(3) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(4) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(5) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(6) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(7) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(8) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - … +2 autres
- http://127.0.0.1:8080/ [state:annonce-repliee]
  - `.ml-2.flex-shrink-0[data-v-88e61ed6=""] > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(1) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(2) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `.bg-destructive`
  - `div:nth-child(2) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(3) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(4) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(5) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(6) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(7) > .py-2 > .italic.text-muted-foreground\/60`
  - … +7 autres
- http://127.0.0.1:8080/ [state:tooltip-resultat]
  - `.ml-2.flex-shrink-0[data-v-88e61ed6=""] > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(1) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(2) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `.bg-destructive`
  - `div:nth-child(2) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(3) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(4) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(5) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(6) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(7) > .py-2 > .italic.text-muted-foreground\/60`
  - … +7 autres
- http://127.0.0.1:8080/ [state:menu-refresh]
  - `.ml-2.flex-shrink-0[data-v-88e61ed6=""] > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(1) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(2) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `.bg-destructive`
  - `div:nth-child(2) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(3) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(4) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(5) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(6) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(7) > .py-2 > .italic.text-muted-foreground\/60`
  - … +7 autres
- http://127.0.0.1:8080/ [state:select-ouvert]
  - `.ml-2.flex-shrink-0[data-v-88e61ed6=""] > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(1) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(2) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `.bg-destructive`
  - `div:nth-child(2) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(3) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(4) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(5) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(6) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(7) > .py-2 > .italic.text-muted-foreground\/60`
  - … +7 autres
- http://127.0.0.1:8080/suites/api-tests_checkout-flow [state:modale-etape]
  - `.gap-2.items-center.flex > .px-2\.5.py-0\.5.focus\:outline-none`
  - `.bg-accent > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.bg-accent > .gap-3.items-center.flex > div[data-v-e2a91c9e=""]:nth-child(2) > .text-xs`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(2) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(3) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(4) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(5) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(6) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(7) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - `.p-3.hover\:bg-accent\/50.cursor-pointer:nth-child(8) > .gap-3.items-center.flex > .px-2\.5.py-0\.5[size="sm"]`
  - … +7 autres
- http://127.0.0.1:8080/ [state:theme-sombre]
  - `.ml-2.flex-shrink-0[data-v-88e61ed6=""] > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(1) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `.endpoint.transition.hover\:shadow-lg:nth-child(2) > .endpoint-header.pt-3.sm\:pt-6 > .sm\:gap-3.items-start.gap-2 > .ml-2.flex-shrink-0 > .text-white.px-2\.5.py-0\.5`
  - `div:nth-child(2) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(3) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(4) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(5) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(6) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(7) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(8) > .py-2 > .italic.text-muted-foreground\/60`
  - … +7 autres
- http://127.0.0.1:8080/ [state:groupe-deplie]
  - `.px-2\.5`
  - `div:nth-child(2) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(3) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(4) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(5) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(6) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(7) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(8) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(9) > .py-2 > .italic.text-muted-foreground\/60`
  - `div:nth-child(10) > .py-2 > .italic.text-muted-foreground\/60`
  - … +5 autres

## [SERIOUS] role-img-alt — [role="img"] and [role="image"] elements must have alternative text

Ensure [role="img"] and [role="image"] elements have alternative text
Référence : https://dequeuniversity.com/rules/axe/4.13/role-img-alt?application=axeAPI

- http://127.0.0.1:8080/endpoints/core_front-end
  - `canvas`
- http://127.0.0.1:8080/endpoints/internal_legacy-service
  - `canvas`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.13/nested-interactive?application=axeAPI

- http://127.0.0.1:8080/ [state:menu-refresh]
  - `.gap-1\.5`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-input-field-name?application=axeAPI

- http://127.0.0.1:8080/ [state:select-ouvert]
  - `.top-full`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://127.0.0.1:8080/endpoints/core_front-end
  - `.gap-6 > .bg-card.shadow-sm.rounded-lg:nth-child(1) > .pb-2.space-y-1\.5.flex-col > h3`
- http://127.0.0.1:8080/endpoints/internal_legacy-service
  - `.gap-6 > .bg-card.shadow-sm.rounded-lg:nth-child(1) > .pb-2.space-y-1\.5.flex-col > h3`
- http://127.0.0.1:8080/suites/api-tests_checkout-flow
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(1) > .space-y-1\.5.flex-col.p-6 > .leading-none`
- http://127.0.0.1:8080/suites/api-tests_checkout-flow [state:modale-etape]
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(1) > .space-y-1\.5.flex-col.p-6 > .leading-none.text-2xl.tracking-tight`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://127.0.0.1:8080/ [state:tooltip-resultat]
  - `#tooltip`

## Résultats incomplets à revoir (7)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8080/ [state:tooltip-resultat]
  - `.endpoint.transition.hover\:shadow-lg:nth-child(1) > .endpoint-content.pb-3.sm\:pb-4 > .space-y-2 > div > .mt-1.justify-between.text-xs > span:nth-child(1)`
  - `.past-announcements > .text-2xl`
  - `div:nth-child(1) > .mb-3 > .uppercase.tracking-wider`
  - `.items-start.gap-1.flex:nth-child(1) > .text-green-500`
  - `.items-start.gap-1.flex:nth-child(2) > .text-green-500`
- http://127.0.0.1:8080/ [state:menu-refresh]
  - `.mb-6 > .text-lg`
  - `span[title="api-tests"]`

