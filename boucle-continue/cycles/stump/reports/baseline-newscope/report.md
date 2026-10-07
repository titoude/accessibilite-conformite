# Audit accessibilité — 2026-10-07

**12 règle(s) violée(s), 163 occurrence(s), 7/7 scénario(s) audité(s), 0 erreur(s), 8 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `34e239974543`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.10/aria-allowed-attr?application=axeAPI

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/delete
  - `#radix-_r_7_`
  - `.items-end > div[aria-haspopup="dialog"][data-state="closed"][type="button"]`
  - `.space-y-4.flex-col.flex:nth-child(2) > div[aria-haspopup="dialog"][data-state="closed"][type="button"]`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/reading
  - `#radix-_r_7_`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/thumbnails
  - `#radix-_r_7_`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/analysis
  - `#radix-_r_7_`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/metadata
  - `#radix-_r_7_`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/oneshots
  - `#radix-_r_f_`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.10/button-name?application=axeAPI

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/delete
  - `#radix-_r_15_`
  - `#radix-_r_1b_`
  - `#radix-_r_1d_`
  - `#radix-_r_1j_`
  - `.p-1\.5`
  - `.cursor-not-allowed.h-5.w-5:nth-child(1)`
  - `.cursor-not-allowed.h-5.w-5:nth-child(3)`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/reading
  - `#radix-_r_11_`
  - `#radix-_r_17_`
  - `#radix-_r_19_`
  - `#radix-_r_1f_`
  - `.p-1\.5`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/thumbnails
  - `#radix-_r_b_`
  - `#radix-_r_h_`
  - `#radix-_r_j_`
  - `#radix-_r_p_`
  - `.p-1\.5`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/analysis
  - `#radix-_r_b_`
  - `#radix-_r_h_`
  - `#radix-_r_j_`
  - `#radix-_r_p_`
  - `.p-1\.5`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/metadata
  - `#radix-_r_11_`
  - `#radix-_r_17_`
  - `#radix-_r_19_`
  - `#radix-_r_1f_`
  - `.p-1\.5`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/oneshots
  - `#radix-_r_j_`
  - `#radix-_r_p_`
  - `#radix-_r_r_`
  - `#radix-_r_11_`
  - `.p-1\.5`
  - `.bg-primary\/15.px-1.rounded-lg`
  - `button[aria-controls="radix-_r_17_"]`
  - `span[data-state="closed"] > .hover\:bg-accent.\[\&_svg\:not\(\[class\*\=\'size-\'\]\)\]\:size-4.size-8`
  - `.cursor-not-allowed.hover\:bg-accent.\[\&_svg\:not\(\[class\*\=\'size-\'\]\)\]\:size-4`
  - `.hover\:bg-accent.\[\&_svg\:not\(\[class\*\=\'size-\'\]\)\]\:size-4.size-8:nth-child(2)`
  - … +2 autres

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.10/select-name?application=axeAPI

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/delete
  - `select`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/reading
  - `select[name="defaultReadingImageScaleFit"]`
  - `select[name="defaultReadingDir"]`
  - `select[name="defaultReadingMode"]`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.10/aria-valid-attr-value?application=axeAPI

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/oneshots
  - `#radix-_r_7_-trigger-\/libraries\/55c9cf1e-be71-4735-b59d-13be6e6c17db\/oneshots`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.10/label?application=axeAPI

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/oneshots
  - `input[value="20"]`
  - `input[max="1"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=axeAPI

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/delete
  - `#radix-_r_13_`
  - `#radix-_r_1l_`
  - `#radix-_r_1m_ > .pb-4.pt-0.space-y-1\.5 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.bg-card.text-card-foreground > .first\:border-t-0.border-border\/70.border-t > .gap-3.lg\:items-center.lg\:gap-4 > p`
  - `#radix-_r_1n_`
  - `#radix-_r_1o_ > .pb-4.pt-0.space-y-1\.5 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.bg-card.text-card-foreground > .first\:border-t-0.border-border\/70.border-t > .gap-3.lg\:items-center.lg\:gap-4 > p`
  - `.\[\&_p\]\:leading-relaxed`
  - `.space-y-4.flex-col.flex:nth-child(2) > div[aria-haspopup="dialog"][data-state="closed"][type="button"] > .has-data-\[icon\=inline-end\]\:pr-2\.5.has-data-\[icon\=inline-start\]\:pl-2\.5.bg-destructive\/15`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/reading
  - `#radix-_r_v_`
  - `#radix-_r_1h_`
  - `#radix-_r_1i_ > .pb-4.pt-0.space-y-1\.5 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.text-card-foreground.bg-card > .first\:border-t-0.border-t.border-border\/70 > .gap-3.lg\:items-center.lg\:gap-4 > .select-none`
  - `#radix-_r_1j_`
  - `#radix-_r_1k_ > .pb-4.pt-0.space-y-1\.5 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.text-card-foreground.bg-card > .first\:border-t-0.border-t.border-border\/70 > .gap-3.lg\:items-center.lg\:gap-4 > .select-none`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/thumbnails
  - `#radix-_r_9_`
  - `#radix-_r_r_`
  - `#radix-_r_s_ > .pb-4.pt-0.space-y-1\.5 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.bg-card.text-card-foreground > .first\:border-t-0.border-t.border-border\/70 > .gap-3.lg\:items-center.lg\:gap-4 > p`
  - `#radix-_r_t_`
  - `#radix-_r_u_ > .pb-4.pt-0.space-y-1\.5 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.bg-card.text-card-foreground > .first\:border-t-0.border-t.border-border\/70 > .gap-3.lg\:items-center.lg\:gap-4 > p`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/analysis
  - `#radix-_r_9_`
  - `#radix-_r_r_`
  - `#radix-_r_s_ > .pb-4.pt-0.space-y-1\.5 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.bg-card.text-card-foreground > .first\:border-t-0.border-t.border-border\/70 > .gap-3.lg\:items-center.lg\:gap-4 > p`
  - `#radix-_r_t_`
  - `#radix-_r_u_ > .pb-4.pt-0.space-y-1\.5 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.bg-card.text-card-foreground > .first\:border-t-0.border-t.border-border\/70 > .gap-3.lg\:items-center.lg\:gap-4 > p`
  - `.bg-warning\/15 > .\[\&_p\]\:leading-relaxed.justify-items-start[data-slot="alert-description"]`
  - `.bg-info\/15 > .\[\&_p\]\:leading-relaxed.justify-items-start[data-slot="alert-description"]`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/metadata
  - `#radix-_r_v_`
  - `#radix-_r_1h_`
  - `#radix-_r_1i_ > .pb-4.pt-0.space-y-1\.5 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.bg-card.text-card-foreground > .first\:border-t-0.border-t.border-border\/70 > .gap-3.lg\:items-center.lg\:gap-4 > p`
  - `#radix-_r_1j_`
  - `#radix-_r_1k_ > .pb-4.pt-0.space-y-1\.5 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.bg-card.text-card-foreground > .first\:border-t-0.border-t.border-border\/70 > .gap-3.lg\:items-center.lg\:gap-4 > p`
  - `.bg-warning\/15 > .\[\&_p\]\:leading-relaxed.justify-items-start[data-slot="alert-description"]`
  - `.bg-info\/15 > .\[\&_p\]\:leading-relaxed.justify-items-start[data-slot="alert-description"]`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/oneshots
  - `#radix-_r_h_`
  - `#radix-_r_13_`
  - `#radix-_r_14_ > .pt-0.space-y-1\.5.pb-4 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.bg-card.text-card-foreground > .first\:border-t-0.border-border\/70.border-t > .lg\:flex-row.lg\:items-center.lg\:gap-4 > p`
  - `#radix-_r_15_`
  - `#radix-_r_16_ > .pt-0.space-y-1\.5.pb-4 > .space-y-1 > .opacity-50.gap-2.flex-col > .rounded-xl.bg-card.text-card-foreground > .first\:border-t-0.border-border\/70.border-t > .lg\:flex-row.lg\:items-center.lg\:gap-4 > p`
  - `.px-1\.5.gap-1\.5.rounded-lg:nth-child(3) > .opacity-50`
  - `.px-1\.5.gap-1\.5.rounded-lg:nth-child(4) > .opacity-50`
  - `#radix-_r_7_-trigger-\/libraries\/55c9cf1e-be71-4735-b59d-13be6e6c17db\/series`
  - `#radix-_r_7_-trigger-\/libraries\/55c9cf1e-be71-4735-b59d-13be6e6c17db\/books`
  - `#radix-_r_7_-trigger-\/libraries\/55c9cf1e-be71-4735-b59d-13be6e6c17db\/files`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.10/link-name?application=axeAPI

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/delete
  - `.has-data-\[icon\=inline-end\]\:pr-2`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/reading
  - `.has-data-\[icon\=inline-end\]\:pr-2`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/thumbnails
  - `.has-data-\[icon\=inline-end\]\:pr-2`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/analysis
  - `.has-data-\[icon\=inline-end\]\:pr-2`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/metadata
  - `.has-data-\[icon\=inline-end\]\:pr-2`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.10/list?application=axeAPI

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/delete
  - `div:nth-child(2) > ul`
  - `div:nth-child(3) > .pt-2`
  - `div:nth-child(4) > .pt-2`
  - `div:nth-child(5) > .pt-2`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/reading
  - `div:nth-child(2) > ul`
  - `div:nth-child(3) > .pt-2`
  - `div:nth-child(4) > .pt-2`
  - `div:nth-child(5) > .pt-2`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/thumbnails
  - `div:nth-child(2) > ul`
  - `div:nth-child(3) > .pt-2`
  - `div:nth-child(4) > .pt-2`
  - `div:nth-child(5) > .pt-2`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/analysis
  - `div:nth-child(2) > ul`
  - `div:nth-child(3) > .pt-2`
  - `div:nth-child(4) > .pt-2`
  - `div:nth-child(5) > .pt-2`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/metadata
  - `div:nth-child(2) > ul`
  - `div:nth-child(3) > .pt-2`
  - `div:nth-child(4) > .pt-2`
  - `div:nth-child(5) > .pt-2`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.10/listitem?application=axeAPI

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/delete
  - `div:nth-child(2) > ul > a > li`
  - `div:nth-child(3) > .pt-2 > a:nth-child(1) > li`
  - `div:nth-child(3) > .pt-2 > a:nth-child(2) > li`
  - `a:nth-child(3) > li`
  - `div:nth-child(4) > .pt-2 > a:nth-child(1) > li`
  - `div:nth-child(4) > .pt-2 > a:nth-child(2) > li`
  - `div:nth-child(5) > .pt-2 > a:nth-child(1) > li`
  - `.bg-accent`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/reading
  - `div:nth-child(2) > ul > a > li`
  - `.bg-accent`
  - `div:nth-child(3) > .pt-2 > a:nth-child(2) > li`
  - `a:nth-child(3) > li`
  - `div:nth-child(4) > .pt-2 > a:nth-child(1) > li`
  - `div:nth-child(4) > .pt-2 > a:nth-child(2) > li`
  - `div:nth-child(5) > .pt-2 > a:nth-child(1) > li`
  - `div:nth-child(5) > .pt-2 > a:nth-child(2) > li`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/thumbnails
  - `div:nth-child(2) > ul > a > li`
  - `div:nth-child(3) > .pt-2 > a:nth-child(1) > li`
  - `div:nth-child(3) > .pt-2 > a:nth-child(2) > li`
  - `.bg-accent`
  - `div:nth-child(4) > .pt-2 > a:nth-child(1) > li`
  - `div:nth-child(4) > .pt-2 > a:nth-child(2) > li`
  - `div:nth-child(5) > .pt-2 > a:nth-child(1) > li`
  - `div:nth-child(5) > .pt-2 > a:nth-child(2) > li`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/analysis
  - `div:nth-child(2) > ul > a > li`
  - `div:nth-child(3) > .pt-2 > a:nth-child(1) > li`
  - `div:nth-child(3) > .pt-2 > a:nth-child(2) > li`
  - `a:nth-child(3) > li`
  - `.bg-accent`
  - `div:nth-child(4) > .pt-2 > a:nth-child(2) > li`
  - `div:nth-child(5) > .pt-2 > a:nth-child(1) > li`
  - `div:nth-child(5) > .pt-2 > a:nth-child(2) > li`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/metadata
  - `div:nth-child(2) > ul > a > li`
  - `div:nth-child(3) > .pt-2 > a:nth-child(1) > li`
  - `div:nth-child(3) > .pt-2 > a:nth-child(2) > li`
  - `a:nth-child(3) > li`
  - `div:nth-child(4) > .pt-2 > a:nth-child(1) > li`
  - `.bg-accent`
  - `div:nth-child(5) > .pt-2 > a:nth-child(1) > li`
  - `div:nth-child(5) > .pt-2 > a:nth-child(2) > li`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.10/aria-input-field-name?application=axeAPI

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/oneshots
  - `.shadow`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.10/landmark-one-main?application=axeAPI

- http://localhost:11334/server-connection-error
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.10/region?application=axeAPI

- http://localhost:11334/server-connection-error
  - `.h-screen`

## Résultats incomplets à revoir (8)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/settings/reading
  - `select[name="defaultReadingImageScaleFit"]`
  - `select[name="defaultReadingDir"]`
  - `select[name="defaultReadingMode"]`
- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/oneshots
  - `div:nth-child(1) > .hover\:opacity-80.block.group > .relative > .px-2\.5.left-0.py-2 > .font-bold.text-white.md\:text-lg`
  - `div:nth-child(1) > .hover\:opacity-80.block.group > .relative > .px-2\.5.left-0.py-2 > .mt-0\.5.text-white\/75.leading-tight`
  - `div:nth-child(2) > .hover\:opacity-80.block.group > .relative > .px-2\.5.left-0.py-2 > .font-bold.text-white.md\:text-lg`
  - `div:nth-child(2) > .hover\:opacity-80.block.group > .relative > .px-2\.5.left-0.py-2 > .mt-0\.5.text-white\/75.leading-tight`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:11334/libraries/55c9cf1e-be71-4735-b59d-13be6e6c17db/oneshots
  - `button[aria-controls="radix-_r_17_"]`

