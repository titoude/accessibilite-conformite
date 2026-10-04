# Audit accessibilité — 2026-10-04

**7 règle(s) violée(s), 162 occurrence(s), 5/5 scénario(s) audité(s), 0 erreur(s), 25 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `b294107c5c64`

## [CRITICAL] aria-required-attr — Required ARIA attributes must be provided

Ensure elements with ARIA roles have all required ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-attr?application=axeAPI

- http://localhost:8083/
  - `.splitpanes__splitter`
- http://localhost:8083/settings
  - `.splitpanes__splitter`
- http://localhost:8083/notifications
  - `.splitpanes__splitter`
- http://localhost:8083/container/a11y-web
  - `.splitpanes__splitter`
- http://localhost:8083/container/a11y-db
  - `.splitpanes__splitter`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.13/image-alt?application=axeAPI

- http://localhost:8083/
  - `.ring-base-content\/25`
- http://localhost:8083/settings
  - `.ring-base-content\/25`
- http://localhost:8083/notifications
  - `.ring-base-content\/25`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:8083/
  - `.btn-active`
  - `.join-item.btn-xs.btn-ghost`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8083/
  - `.truncate[data-v-4f3c76e3=""]`
  - `.text-base-content\/60.truncate.text-sm`
  - `section:nth-child(2) > .mb-3.min-h-8.gap-3 > .hover\:text-base-content.-ml-1.px-1 > .tracking-\[0\.08em\]`
  - `.gap-x-2 > span:nth-child(1)`
  - `.gap-x-2 > span:nth-child(3)`
  - `div[title="Host"] > span:nth-child(2)`
  - `div[title="Host"] > span:nth-child(3)`
  - `span[title="47.2 GB / 123.9 GB"]`
  - `.text-primary.font-medium.gap-1\.5 > .truncate`
  - `.py-2\.5.bg-base-200\/40.rounded-lg:nth-child(1) > .gap-2.items-center.flex > .text-base-content\/40.ml-auto.tabular-nums`
  - … +10 autres
- http://localhost:8083/settings
  - `.truncate[data-v-4f3c76e3=""]`
  - `.items-end > div[data-v-905807bd=""] > p`
  - `.btn-xs`
  - `.badge`
  - `#appearance > .section-heading`
  - `.gap-1\.5.flex-col[type="button"]:nth-child(1) > .font-normal.text-base-content\/60.text-xs`
  - `.gap-1\.5.flex-col[type="button"]:nth-child(2) > .font-normal.text-base-content\/60.text-xs`
  - `#logs > .section-heading`
  - `.max-md\:hidden[datetime="2026-10-03T21:33:51.450Z"]`
  - `time[datetime="2026-10-03T21:33:51.450Z"]:nth-child(2)`
  - … +24 autres
- http://localhost:8083/notifications
  - `.truncate[data-v-4f3c76e3=""]`
  - `.truncate.text-base-content\/60.text-sm`
  - `.mb-6:nth-child(1) > p`
  - `.tab.gap-2[role="tab"]:nth-child(2)`
- http://localhost:8083/container/a11y-web
  - `.nav-group-toggle > .truncate`
  - `p:nth-child(2)`
- http://localhost:8083/container/a11y-db
  - `.nav-group-toggle > .truncate`
  - `p:nth-child(2)`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=axeAPI

- http://localhost:8083/
  - `html`
- http://localhost:8083/settings
  - `html`
- http://localhost:8083/notifications
  - `html`
- http://localhost:8083/container/a11y-web
  - `html`
- http://localhost:8083/container/a11y-db
  - `html`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:8083/
  - `html`
- http://localhost:8083/settings
  - `html`
- http://localhost:8083/notifications
  - `html`
- http://localhost:8083/container/a11y-web
  - `html`
- http://localhost:8083/container/a11y-db
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8083/
  - `.tag`
  - `a[href$="notifications"]`
  - `a[href$="settings"]`
  - `div[data-testid="user-menu"]`
  - `.gap-x-2`
  - `div[title="Host"] > span:nth-child(2)`
  - `div[title="Host"] > span:nth-child(3)`
  - `span[title="47.2 GB / 123.9 GB"]`
  - `.text-primary.font-medium.gap-1\.5 > .truncate`
  - `.py-2\.5.bg-base-200\/40.rounded-lg:nth-child(1) > .gap-2.items-center.flex > .text-base-content\/40.ml-auto.tabular-nums`
  - … +24 autres
- http://localhost:8083/settings
  - `a[href$="notifications"]`
  - `a[aria-current="page"]`
  - `div[data-testid="user-menu"]`
  - `.items-end > div[data-v-905807bd=""]`
  - `.menu-active > .flex-1[data-v-905807bd=""]`
  - `.router-link-active[href$="settings#appearance"][aria-current="false"] > .flex-1[data-v-905807bd=""]`
  - `.router-link-active[href$="settings#logs"][aria-current="false"] > .flex-1[data-v-905807bd=""]`
  - `.router-link-active[href$="settings#sidebar"][aria-current="false"] > .flex-1[data-v-905807bd=""]`
  - `.router-link-active[href$="settings#behavior"][aria-current="false"] > .flex-1[data-v-905807bd=""]`
  - `.router-link-active[href$="settings#setup"][aria-current="false"] > .flex-1[data-v-905807bd=""]`
  - … +25 autres
- http://localhost:8083/notifications
  - `.tag`
  - `.router-link-active`
  - `a[href$="settings"]`
  - `div[data-testid="user-menu"]`
  - `.mb-6:nth-child(1)`
  - `.tabs`
  - `.gap-1\.5.flex-col.flex`
- http://localhost:8083/container/a11y-web
  - `.gap-1\.5.flex-col.flex`
  - `.mt-1`
- http://localhost:8083/container/a11y-db
  - `.gap-1\.5.flex-col.flex`
  - `.mt-1`

## Résultats incomplets à revoir (25)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8083/
  - `.font-normal`
  - `kbd:nth-child(1)`
  - `section:nth-child(2) > .mb-3.min-h-8.gap-3 > .hover\:text-base-content.-ml-1.px-1 > .px-1\.5.py-px.text-\[0\.6875rem\]`
  - `.text-base-content\/25`
  - `section:nth-child(3) > .mb-3.min-h-8.gap-3 > .hover\:text-base-content.-ml-1.px-1 > .px-1\.5.py-px.text-\[0\.6875rem\]`
- http://localhost:8083/settings
  - `.tabular-nums.opacity-60[data-v-4f3c76e3=""]`
  - `.menu-active > .flex-1[data-v-905807bd=""]`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(1)`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(2)`
  - `#appearance > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.px-4:nth-child(2) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.px-4:nth-child(7) > .gap-2.shrink-0.items-center > .popover-anchor:nth-child(1) > .flex-nowrap.btn[type="button"]`
  - `.popover-anchor:nth-child(3) > .flex-nowrap.btn[type="button"]`
  - `#sidebar > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.px-4:nth-child(2) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.px-4:nth-child(1) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.mt-3.gap-2.flex > a[href$="cloud.dozzle.dev"][rel="noreferrer noopener"][target="_blank"]`
  - … +1 autres
- http://localhost:8083/notifications
  - `.font-normal`
  - `kbd:nth-child(1)`
  - `.tab-active > .text-base-content\/40.font-mono.text-xs`
  - `.tab.gap-2[role="tab"]:nth-child(2) > .text-base-content\/40.font-mono.text-xs`
  - `.flex-wrap > .btn-primary.btn.btn-sm`
- http://localhost:8083/container/a11y-web
  - `.font-normal`
  - `.btn.btn-sm[href="/"]`
- http://localhost:8083/container/a11y-db
  - `.font-normal`
  - `.btn.btn-sm[href="/"]`

