# Audit accessibilité — 2026-10-04

**6 règle(s) violée(s), 217 occurrence(s), 9/10 scénario(s) audité(s), 1 erreur(s), 48 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `36112a98445b`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:8083/container/0b8bb5aa3e7f
  - `.w-8`
  - `#\32 733060336 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\39 13491865 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\33 609326236 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\33 412344717 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\31 590333592 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\33 612167734 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\35 86000144 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\33 260992153 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\32 467090641 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - … +92 autres
- http://localhost:8083/container/3020dc9b6f19
  - `.w-8`
  - `#\32 467697760 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\33 951386321 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\32 446410270 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\32 168857501 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\32 185632667 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\33 804720419 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\39 53238999 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\33 784146047 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - `#\33 702488765 > .group-\[\.compact\]\:items-stretch.items-start.relative > .-left-2.md\:-left-8.z-10 > .btn-xs.group-hover\/entry\:opacity-90.btn-square`
  - … +92 autres

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8083/container/0b8bb5aa3e7f
  - `.is-active > .truncate.flex-1[data-v-3f93574b=""]`
  - `.text-\[10px\].tracking-wider.font-medium:nth-child(1)`
  - `.text-\[10px\].tracking-wider.font-medium:nth-child(6)`
- http://localhost:8083/container/3020dc9b6f19
  - `.is-active > .truncate.flex-1[data-v-3f93574b=""]`
  - `.text-\[10px\].tracking-wider.font-medium:nth-child(1)`
  - `.text-\[10px\].tracking-wider.font-medium:nth-child(6)`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-main-is-top-level?application=axeAPI

- http://localhost:8083/container/0b8bb5aa3e7f
  - `main`
- http://localhost:8083/container/3020dc9b6f19
  - `main`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-no-duplicate-main?application=axeAPI

- http://localhost:8083/container/0b8bb5aa3e7f
  - `.router-view`
- http://localhost:8083/container/3020dc9b6f19
  - `.router-view`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://localhost:8083/container/0b8bb5aa3e7f
  - `.router-view`
- http://localhost:8083/container/3020dc9b6f19
  - `.router-view`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:8083/ [state:mobile]
  - `html`

## Résultats incomplets à revoir (48)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8083/
  - `.font-normal`
  - `kbd:nth-child(1)`
- http://localhost:8083/settings
  - `.opacity-80`
  - `.menu-active > .flex-1`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(1)`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(2)`
  - `#appearance > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.justify-between:nth-child(2) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.justify-between:nth-child(7) > .gap-2.shrink-0.items-center > .popover-anchor:nth-child(1) > .flex-nowrap.btn[type="button"]`
  - `.popover-anchor:nth-child(3) > .flex-nowrap.btn[type="button"]`
  - `#sidebar > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.justify-between:nth-child(2) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.justify-between:nth-child(1) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.mt-3.gap-2.flex > a[href$="cloud.dozzle.dev"][rel="noreferrer noopener"][target="_blank"]`
  - … +1 autres
- http://localhost:8083/notifications
  - `.font-normal`
  - `kbd:nth-child(1)`
  - `.tab-active > .font-mono.text-xs.text-base-content\/80`
  - `.flex-wrap > .btn-primary.btn.btn-sm`
- http://localhost:8083/container/0b8bb5aa3e7f
  - `.opacity-80`
- http://localhost:8083/container/3020dc9b6f19
  - `.opacity-80`
- http://localhost:8083/ [state:dark-dashboard]
  - `kbd:nth-child(1)`
- http://localhost:8083/settings [state:dark-settings]
  - `.menu-active > .flex-1`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(1)`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(2)`
  - `#appearance > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.justify-between:nth-child(2) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.justify-between:nth-child(7) > .gap-2.shrink-0.items-center > .popover-anchor:nth-child(1) > .flex-nowrap.btn[type="button"]`
  - `.popover-anchor:nth-child(3) > .flex-nowrap.btn[type="button"]`
  - `#sidebar > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.justify-between:nth-child(2) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.justify-between:nth-child(1) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.mt-3.gap-2.flex > a[href$="cloud.dozzle.dev"][rel="noreferrer noopener"][target="_blank"]`
  - `.mt-3.gap-2.flex > .btn-primary.btn-sm.btn`
- http://localhost:8083/ [state:search-modal]
  - `input`
  - `.cursor-pointer > kbd`
  - `li:nth-child(1) > .px-2\.5.py-2.rounded-lg > .gap-2.min-w-0.flex-1 > .truncate.text-sm.min-w-0 > .text-base-content[data-name=""][data-v-95ff17bf=""]`
  - `.px-2\.5.py-2.rounded-lg > time[datetime="2026-10-04T13:32:22.720Z"]`
  - `.hover\:bg-base-content\/5 > .gap-2.min-w-0.flex-1 > .truncate.text-sm.min-w-0 > .text-base-content[data-name=""][data-v-95ff17bf=""]`
  - `.hover\:bg-base-content\/5 > time[datetime="2026-10-04T13:32:22.559Z"]`
  - `.sm\:flex.hidden.gap-1:nth-child(1) > kbd:nth-child(1)`
  - `.sm\:flex.hidden.gap-1:nth-child(1) > kbd:nth-child(2)`
  - `.sm\:flex.hidden.gap-1:nth-child(1) > .ml-0\.5[data-v-95ff17bf=""]`
  - `.sm\:flex.hidden.gap-1:nth-child(2) > kbd`
  - … +6 autres
- http://localhost:8083/ [state:mobile]
  - `.flex-nowrap.btn-xs[type="button"]`

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://localhost:8083/ [state:mobile]
  - `table`

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:8083/container/0b8bb5aa3e7f [state:pinned-logs] — locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button[title*="pin" i], button[aria-label*="pin" i]').first()
    - locator resolved to <button title="Pin" aria-label="Pin" aria-pressed="false" class="icon-btn shrink-0 max-md:hidden text-base-content/80 hover:text-base-content">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    56 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms


