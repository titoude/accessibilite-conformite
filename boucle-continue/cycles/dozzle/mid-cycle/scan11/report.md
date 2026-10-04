# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 10/10 scénario(s) audité(s), 0 erreur(s), 569 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `193f1cddfbbf`

## Résultats incomplets à revoir (569)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8083/
  - `li:nth-child(1) > .group\/header.pr-0\.5.pl-1 > .nav-group-toggle[type="button"][data-v-f6637955=""] > .font-normal.opacity-80.tabular-nums`
  - `li:nth-child(2) > .group\/header.pr-0\.5.pl-1 > .nav-group-toggle[type="button"][data-v-f6637955=""] > .font-normal.opacity-80.tabular-nums`
  - `kbd:nth-child(1)`
- http://localhost:8083/settings
  - `li[data-v-f6637955=""][data-v-414d1e57=""]:nth-child(1) > .group\/header.pr-0\.5.h-7 > .nav-group-toggle[data-v-f6637955=""][type="button"] > .opacity-80.tabular-nums.font-normal`
  - `li[data-v-f6637955=""][data-v-414d1e57=""]:nth-child(2) > .group\/header.pr-0\.5.h-7 > .nav-group-toggle[data-v-f6637955=""][type="button"] > .opacity-80.tabular-nums.font-normal`
  - `.menu-active > .flex-1`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(1)`
  - `.btn-sm[rel="noopener noreferrer"][target="_blank"]:nth-child(2)`
  - `#appearance > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.justify-between:nth-child(2) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.justify-between:nth-child(7) > .gap-2.shrink-0.items-center > .popover-anchor:nth-child(1) > .flex-nowrap.btn[type="button"]`
  - `.popover-anchor:nth-child(3) > .flex-nowrap.btn[type="button"]`
  - `#sidebar > .card.card-border.divide-base-content\/10 > .min-h-13.py-3\.5.justify-between:nth-child(2) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - `.min-h-13.py-3\.5.justify-between:nth-child(1) > .gap-2.shrink-0.items-center > .popover-anchor > .flex-nowrap.btn[type="button"]`
  - … +2 autres
- http://localhost:8083/notifications
  - `li:nth-child(1) > .group\/header.pr-0\.5.h-7 > .nav-group-toggle[type="button"][data-v-f6637955=""] > .font-normal.tabular-nums.opacity-80`
  - `li:nth-child(2) > .group\/header.pr-0\.5.h-7 > .nav-group-toggle[type="button"][data-v-f6637955=""] > .font-normal.tabular-nums.opacity-80`
  - `kbd:nth-child(1)`
  - `.tab-active > .font-mono.text-xs.text-base-content\/80`
  - `.flex-wrap > .btn-primary.btn.btn-sm`
- http://localhost:8083/container/0b8bb5aa3e7f
  - `li[data-v-f6637955=""][data-v-414d1e57=""]:nth-child(1) > .group\/header.pr-0\.5.h-7 > .nav-group-toggle[data-v-f6637955=""][type="button"] > .opacity-80.font-normal[data-v-f6637955=""]`
  - `li[data-v-f6637955=""][data-v-414d1e57=""]:nth-child(2) > .group\/header.pr-0\.5.h-7 > .nav-group-toggle[data-v-f6637955=""][type="button"] > .opacity-80.font-normal[data-v-f6637955=""]`
- http://localhost:8083/container/3020dc9b6f19
  - `li[data-v-f6637955=""][data-v-414d1e57=""]:nth-child(1) > .group\/header.pr-0\.5.h-7 > .nav-group-toggle[data-v-f6637955=""][type="button"] > .opacity-80.font-normal[data-v-f6637955=""]`
  - `li[data-v-f6637955=""][data-v-414d1e57=""]:nth-child(2) > .group\/header.pr-0\.5.h-7 > .nav-group-toggle[data-v-f6637955=""][type="button"] > .opacity-80.font-normal[data-v-f6637955=""]`
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
- http://localhost:8083/container/0b8bb5aa3e7f?columns=3020dc9b6f19 [state:pinned-logs]
  - `.max-md\:hidden[datetime="2026-10-04T14:07:10.530Z"]`
  - `time[datetime="2026-10-04T14:07:10.530Z"]:nth-child(2)`
  - `#\33 641517583 > .group-\[\.compact\]\:items-stretch.items-start.relative > .log-message.\[word-break\:break-word\].whitespace-pre-wrap`
  - `.max-md\:hidden[datetime="2026-10-04T14:07:12.532Z"]`
  - `time[datetime="2026-10-04T14:07:12.532Z"]:nth-child(2)`
  - `#\32 334675565 > .group-\[\.compact\]\:items-stretch.items-start.relative > .log-message.\[word-break\:break-word\].whitespace-pre-wrap`
  - `.max-md\:hidden[datetime="2026-10-04T14:07:14.533Z"]`
  - `time[datetime="2026-10-04T14:07:14.533Z"]:nth-child(2)`
  - `#\34 77063797 > .group-\[\.compact\]\:items-stretch.items-start.relative > .log-message.\[word-break\:break-word\].whitespace-pre-wrap`
  - `.max-md\:hidden[datetime="2026-10-04T14:07:16.534Z"]`
  - … +506 autres

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://localhost:8083/ [state:mobile]
  - `table`

