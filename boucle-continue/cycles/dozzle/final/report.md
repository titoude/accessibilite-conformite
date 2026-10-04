# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 9/9 scénario(s) audité(s), 0 erreur(s), 553 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `7d797c9a8910`

## Résultats incomplets à revoir (553)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8083/
  - `kbd:nth-child(1)`
- http://localhost:8083/settings
  - `.menu-active > .flex-1`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(1)`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(2)`
  - `#appearance > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.px-4:nth-child(2) > .shrink-0.gap-2.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.px-4:nth-child(7) > .shrink-0.gap-2.items-center > .popover-anchor:nth-child(1) > .flex-nowrap.btn[type="button"]`
  - `.popover-anchor:nth-child(3) > .flex-nowrap.btn[type="button"]`
  - `#sidebar > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.px-4:nth-child(2) > .shrink-0.gap-2.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.px-4:nth-child(1) > .shrink-0.gap-2.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.mt-3.gap-2.flex > .btn-sm[href$="cloud.dozzle.dev"][rel="noreferrer noopener"]`
  - `.mt-3.gap-2.flex > .btn-primary.btn-sm.btn`
- http://localhost:8083/notifications
  - `kbd:nth-child(1)`
  - `.tab-active > .font-mono.text-xs.text-base-content\/80`
  - `.flex-wrap > .btn-primary.btn.btn-sm`
- http://localhost:8083/ [state:dark-dashboard]
  - `kbd:nth-child(1)`
- http://localhost:8083/settings [state:dark-settings]
  - `.menu-active > .flex-1`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(1)`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(2)`
  - `#appearance > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.px-4:nth-child(2) > .shrink-0.gap-2.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.px-4:nth-child(7) > .shrink-0.gap-2.items-center > .popover-anchor:nth-child(1) > .flex-nowrap.btn[type="button"]`
  - `.popover-anchor:nth-child(3) > .flex-nowrap.btn[type="button"]`
  - `#sidebar > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.px-4:nth-child(2) > .shrink-0.gap-2.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.px-4:nth-child(1) > .shrink-0.gap-2.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.mt-3.gap-2.flex > .btn-sm[href$="cloud.dozzle.dev"][rel="noreferrer noopener"]`
  - `.mt-3.gap-2.flex > .btn-primary.btn-sm.btn`
- http://localhost:8083/ [state:search-modal]
  - `input`
  - `.cursor-pointer > kbd`
  - `li:nth-child(1) > .px-2\.5.py-2.rounded-lg > .flex-1.min-w-0.gap-2 > .truncate.min-w-0.text-sm > .text-base-content[data-name=""][data-v-95ff17bf=""]`
  - `.px-2\.5.py-2.rounded-lg > time[datetime="2026-10-04T13:32:22.720Z"]`
  - `.hover\:bg-base-content\/5 > .flex-1.min-w-0.gap-2 > .truncate.min-w-0.text-sm > .text-base-content[data-name=""][data-v-95ff17bf=""]`
  - `.hover\:bg-base-content\/5 > time[datetime="2026-10-04T13:32:22.559Z"]`
  - `.sm\:flex.hidden.gap-1:nth-child(1) > kbd:nth-child(1)`
  - `.sm\:flex.hidden.gap-1:nth-child(1) > kbd:nth-child(2)`
  - `.sm\:flex.hidden.gap-1:nth-child(1) > .ml-0\.5[data-v-95ff17bf=""]`
  - `.sm\:flex.hidden.gap-1:nth-child(2) > kbd`
  - … +6 autres
- http://localhost:8083/ [state:mobile]
  - `.flex-nowrap.btn-xs[type="button"]`
- http://localhost:8083/container/0b8bb5aa3e7f?columns=3020dc9b6f19 [state:pinned-logs]
  - `.max-md\:hidden[datetime="2026-10-04T14:22:37.342Z"]`
  - `time[datetime="2026-10-04T14:22:37.342Z"]:nth-child(2)`
  - `#\33 057225124 > .group-\[\.compact\]\:items-stretch.items-start.relative > .log-message.\[word-break\:break-word\].whitespace-pre-wrap`
  - `.max-md\:hidden[datetime="2026-10-04T14:22:39.344Z"]`
  - `time[datetime="2026-10-04T14:22:39.344Z"]:nth-child(2)`
  - `#\33 128013553 > .group-\[\.compact\]\:items-stretch.items-start.relative > .log-message.\[word-break\:break-word\].whitespace-pre-wrap`
  - `.max-md\:hidden[datetime="2026-10-04T14:22:41.345Z"]`
  - `time[datetime="2026-10-04T14:22:41.345Z"]:nth-child(2)`
  - `#\32 31500957 > .group-\[\.compact\]\:items-stretch.items-start.relative > .log-message.\[word-break\:break-word\].whitespace-pre-wrap`
  - `.max-md\:hidden[datetime="2026-10-04T14:22:43.347Z"]`
  - … +500 autres

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://localhost:8083/ [state:mobile]
  - `table`

