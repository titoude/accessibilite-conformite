# Audit accessibilité — 2026-10-04

**6 règle(s) violée(s), 53 occurrence(s), 3/3 scénario(s) audité(s), 0 erreur(s), 4 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `15098e198a1b`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:30030/
  - `li[data-name="My First Service"] > .overflow-clip.service-card.bg-theme-100\/20 > .z-0.service-title.select-none > .service-title-text[href$="localhost/"] > .service-name.px-2.z-10`
  - `li[data-name="My Second Service"] > .overflow-clip.service-card.bg-theme-100\/20 > .z-0.service-title.select-none > .service-title-text[href$="localhost/"] > .service-name.px-2.z-10`
  - `li[data-name="My Third Service"] > .overflow-clip.service-card.bg-theme-100\/20 > .z-0.service-title.select-none > .service-title-text[href$="localhost/"] > .service-name.px-2.z-10`
  - `a[href$="github.com/"] > .flex > .bookmark-text.rounded-r-md.overflow-hidden > .bookmark-name.pl-3.py-2`
  - `a[href$="reddit.com/"] > .flex > .bookmark-text.rounded-r-md.overflow-hidden > .bookmark-name.pl-3.py-2`
  - `a[href$="youtube.com/"] > .flex > .bookmark-text.rounded-r-md.overflow-hidden > .bookmark-name.pl-3.py-2`
- http://localhost:30030 [state:quicklaunch]
  - `.text-theme-600`
- http://localhost:30030 [state:dark-theme]
  - `li[data-name="My First Service"] > .overflow-clip.service-card.bg-theme-100\/20 > .z-0.service-title.select-none > .service-title-text[href$="localhost/"] > .service-name.px-2.z-10`
  - `li[data-name="My Second Service"] > .overflow-clip.service-card.bg-theme-100\/20 > .z-0.service-title.select-none > .service-title-text[href$="localhost/"] > .service-name.px-2.z-10`
  - `li[data-name="My Third Service"] > .overflow-clip.service-card.bg-theme-100\/20 > .z-0.service-title.select-none > .service-title-text[href$="localhost/"] > .service-name.px-2.z-10`
  - `a[href$="github.com/"] > .flex > .bookmark-text.rounded-r-md.overflow-hidden > .bookmark-name.pl-3.py-2`
  - `a[href$="reddit.com/"] > .flex > .bookmark-text.rounded-r-md.overflow-hidden > .bookmark-name.pl-3.py-2`
  - `a[href$="youtube.com/"] > .flex > .bookmark-text.rounded-r-md.overflow-hidden > .bookmark-name.pl-3.py-2`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-dialog-name?application=axeAPI

- http://localhost:30030 [state:quicklaunch]
  - `.z-40`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.13/meta-viewport?application=axeAPI

- http://localhost:30030/
  - `meta[name="viewport"]`
- http://localhost:30030 [state:quicklaunch]
  - `meta[name="viewport"]`
- http://localhost:30030 [state:dark-theme]
  - `meta[name="viewport"]`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:30030/
  - `.flex-none.py-1\.5.information-widget-resource:nth-child(1) > .ml-3.min-w-\[85px\].text-left`
  - `.flex-none.py-1\.5.information-widget-resource:nth-child(2) > .ml-3.min-w-\[85px\].text-left`
  - `.flex-none.py-1\.5.information-widget-resource:nth-child(3) > .ml-3.min-w-\[85px\].text-left`
  - `#headlessui-combobox-input-_R_1ndit6_`
  - `#headlessui-disclosure-panel-_R_irt6_`
  - `#headlessui-disclosure-panel-_R_krt6_`
  - `#headlessui-disclosure-panel-_R_mrt6_`
  - `#headlessui-disclosure-panel-_R_j3t6_`
  - `#headlessui-disclosure-panel-_R_l3t6_`
  - `#headlessui-disclosure-panel-_R_n3t6_`
  - … +1 autres
- http://localhost:30030 [state:quicklaunch]
  - `.flex-none.py-1\.5.information-widget-resource:nth-child(1) > .ml-3.min-w-\[85px\].text-left`
  - `.flex-none.py-1\.5.information-widget-resource:nth-child(2) > .ml-3.min-w-\[85px\].text-left`
  - `.flex-none.py-1\.5.information-widget-resource:nth-child(3) > .ml-3.min-w-\[85px\].text-left`
  - `#headlessui-combobox-input-_R_1ndit6_`
  - `#headlessui-disclosure-panel-_R_irt6_`
  - `#headlessui-disclosure-panel-_R_krt6_`
  - `#headlessui-disclosure-panel-_R_mrt6_`
  - `#headlessui-disclosure-panel-_R_j3t6_`
  - `#headlessui-disclosure-panel-_R_l3t6_`
  - `#headlessui-disclosure-panel-_R_n3t6_`
  - … +1 autres
- http://localhost:30030 [state:dark-theme]
  - `.flex-none.py-1\.5.information-widget-resource:nth-child(1) > .ml-3.min-w-\[85px\].text-left`
  - `.flex-none.py-1\.5.information-widget-resource:nth-child(2) > .ml-3.min-w-\[85px\].text-left`
  - `.flex-none.py-1\.5.information-widget-resource:nth-child(3) > .ml-3.min-w-\[85px\].text-left`
  - `#headlessui-combobox-input-_R_1ndit6_`
  - `#headlessui-disclosure-panel-_R_irt6_`
  - `#headlessui-disclosure-panel-_R_krt6_`
  - `#headlessui-disclosure-panel-_R_mrt6_`
  - `#headlessui-disclosure-panel-_R_j3t6_`
  - `#headlessui-disclosure-panel-_R_l3t6_`
  - `#headlessui-disclosure-panel-_R_n3t6_`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:30030/
  - `html`
- http://localhost:30030 [state:dark-theme]
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:30030/
  - `html`
- http://localhost:30030 [state:dark-theme]
  - `html`

## Résultats incomplets à revoir (4)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:30030/
  - `#headlessui-combobox-input-_R_1ndit6_`
- http://localhost:30030 [state:quicklaunch]
  - `#headlessui-combobox-input-_R_1ndit6_`
- http://localhost:30030 [state:dark-theme]
  - `#headlessui-combobox-input-_R_1ndit6_`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:30030 [state:quicklaunch]
  - `nextjs-portal,#next-logo`

