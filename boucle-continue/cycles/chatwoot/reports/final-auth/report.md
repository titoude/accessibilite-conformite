# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 22/22 scénario(s) audité(s), 0 erreur(s), 75 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `5ec145a26c92`

## Résultats incomplets à revoir (75)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9700/app/accounts/1/dashboard
  - `.bg-n-blue-3 > span`
  - `.gap-2.items-center.flex:nth-child(1) > .gap-2.items-center.flex > .text-lg`
  - `.gap-2.items-center.flex:nth-child(2) > .gap-2.items-center.flex > .text-lg`
- http://localhost:9700/app/accounts/1/inbox/1
  - `.bg-n-blue-3 > span`
  - `.gap-2.items-center.flex:nth-child(1) > .gap-2.items-center.flex > .text-lg`
  - `.gap-2.items-center.flex:nth-child(2) > .gap-2.items-center.flex > .text-lg`
- http://localhost:9700/app/accounts/1/conversations/1
  - `.bg-n-blue-3 > span`
- http://localhost:9700/app/accounts/1/conversations/2
  - `.bg-n-blue-3 > span`
- http://localhost:9700/app/accounts/1/contacts
  - `.line-clamp-1`
  - `.tabular-nums`
  - `.text-body-main.text-n-slate-11.truncate`
- http://localhost:9700/app/accounts/1/label/urgent
  - `.bg-n-blue-3 > span`
  - `.gap-2.items-center.flex:nth-child(1) > .gap-2.items-center.flex > .text-lg`
  - `.gap-2.items-center.flex:nth-child(2) > .gap-2.items-center.flex > .text-lg`
- http://localhost:9700/app/accounts/1/reports/overview
  - `.\[--cw-viz-heatmap-focus-color\:rgb\(var\(--blue-9\)\)\] > .cw-viz-heatmap__scroll > .cw-viz-heatmap__grid[role="grid"] > .cw-viz-heatmap__row[role="row"]:nth-child(1) > .cw-viz-heatmap__row-label[role="rowheader"] > strong`
  - `.\[--cw-viz-heatmap-focus-color\:rgb\(var\(--blue-9\)\)\] > .cw-viz-heatmap__scroll > .cw-viz-heatmap__grid[role="grid"] > .cw-viz-heatmap__row[role="row"]:nth-child(1) > .cw-viz-heatmap__row-label[role="rowheader"] > span`
  - `.\[--cw-viz-heatmap-focus-color\:rgb\(var\(--blue-9\)\)\] > .cw-viz-heatmap__scroll > .cw-viz-heatmap__grid[role="grid"] > .cw-viz-heatmap__row[role="row"]:nth-child(2) > .cw-viz-heatmap__row-label[role="rowheader"] > strong`
  - `.\[--cw-viz-heatmap-focus-color\:rgb\(var\(--blue-9\)\)\] > .cw-viz-heatmap__scroll > .cw-viz-heatmap__grid[role="grid"] > .cw-viz-heatmap__row[role="row"]:nth-child(2) > .cw-viz-heatmap__row-label[role="rowheader"] > span`
  - `.\[--cw-viz-heatmap-focus-color\:rgb\(var\(--blue-9\)\)\] > .cw-viz-heatmap__scroll > .cw-viz-heatmap__grid[role="grid"] > .cw-viz-heatmap__row[role="row"]:nth-child(3) > .cw-viz-heatmap__row-label[role="rowheader"] > strong`
  - `.\[--cw-viz-heatmap-focus-color\:rgb\(var\(--blue-9\)\)\] > .cw-viz-heatmap__scroll > .cw-viz-heatmap__grid[role="grid"] > .cw-viz-heatmap__row[role="row"]:nth-child(3) > .cw-viz-heatmap__row-label[role="rowheader"] > span`
  - `.\[--cw-viz-heatmap-focus-color\:rgb\(var\(--blue-9\)\)\] > .cw-viz-heatmap__scroll > .cw-viz-heatmap__grid[role="grid"] > .cw-viz-heatmap__row[role="row"]:nth-child(4) > .cw-viz-heatmap__row-label[role="rowheader"] > strong`
  - `.\[--cw-viz-heatmap-focus-color\:rgb\(var\(--blue-9\)\)\] > .cw-viz-heatmap__scroll > .cw-viz-heatmap__grid[role="grid"] > .cw-viz-heatmap__row[role="row"]:nth-child(4) > .cw-viz-heatmap__row-label[role="rowheader"] > span`
  - `.\[--cw-viz-heatmap-focus-color\:rgb\(var\(--blue-9\)\)\] > .cw-viz-heatmap__scroll > .cw-viz-heatmap__grid[role="grid"] > .cw-viz-heatmap__row[role="row"]:nth-child(5) > .cw-viz-heatmap__row-label[role="rowheader"] > strong`
  - `.\[--cw-viz-heatmap-focus-color\:rgb\(var\(--blue-9\)\)\] > .cw-viz-heatmap__scroll > .cw-viz-heatmap__grid[role="grid"] > .cw-viz-heatmap__row[role="row"]:nth-child(5) > .cw-viz-heatmap__row-label[role="rowheader"] > span`
  - … +4 autres
- http://localhost:9700/app/accounts/1/profile/settings
  - `#fontSize`
  - `#language`
- http://localhost:9700/app/accounts/1/settings/general
  - `select`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `.bg-n-blue-3 > span`
- http://localhost:9700/app/accounts/1/dashboard [state:profile-menu]
  - `a[href$="inbox-view"] > .gap-1\.5.flex-grow.justify-between > .text-body-main.truncate`
  - `.text-body-main.font-medium.truncate`
  - `.router-link-active > .flex-1.truncate.text-sm`
  - `a[title="Mentions"] > .flex-1.truncate.text-sm`
  - `a[title="Participating"] > .flex-1.truncate.text-sm`
  - `a[title="Unattended"] > .flex-1.truncate.text-sm`
  - `.leading-5.text-start.flex-grow`
  - `div[data-test-id="channel-leaf-label"]`
  - `.mx-0\.5`
  - `bdi`
  - … +12 autres
- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `.bg-n-blue-3 > span`
  - `.gap-2.items-center.flex:nth-child(1) > .gap-2.items-center.flex > .text-lg`
  - `.gap-2.items-center.flex:nth-child(2) > .gap-2.items-center.flex > .text-lg`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `.mt-4 > .text-n-slate-12.truncate.text-sm`
  - `.bg-n-blue-3 > span`
- http://localhost:9700/app/accounts/1/dashboard [state:mobile-390]
  - `.bg-n-blue-3 > span`
- http://localhost:9700/route-c56-inexistante [state:route-404]
  - `.error-number`

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:9700/app/accounts/1/conversations/1
  - `#conversationAttachment`
- http://localhost:9700/app/accounts/1/conversations/2
  - `#conversationAttachment`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `#conversationAttachment`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `#conversationAttachment`

### duplicate-id-aria — IDs used in ARIA and labels must be unique

- http://localhost:9700/app/accounts/1/profile/settings
  - `.col-span-2.text-left.tracking-\[0\.5\] > .bg-n-slate-2.checked\:border-none[value="email_conversation_creation"]`
  - `.text-left.col-span-3.tracking-\[0\.5\] > .bg-n-slate-2.checked\:border-none[value="push_conversation_creation"]`
  - `.col-span-2.text-left.tracking-\[0\.5\] > .bg-n-slate-2.checked\:border-none[value="email_conversation_assignment"]`
  - `.text-left.col-span-3.tracking-\[0\.5\] > .bg-n-slate-2.checked\:border-none[value="push_conversation_assignment"]`
  - `.bg-n-slate-2[aria-labelledby="notif-lbl-conversation_mention"][value="email_conversation_mention"]`
  - `.bg-n-slate-2[aria-labelledby="notif-lbl-conversation_mention"][value="push_conversation_mention"]`
  - `div:nth-child(5) > .content-center.grid-cols-12.py-0 > .col-span-2.text-left.tracking-\[0\.5\] > .bg-n-slate-2.checked\:border-none.rounded-\[4px\]`
  - `div:nth-child(5) > .content-center.grid-cols-12.py-0 > .text-left.col-span-3.tracking-\[0\.5\] > .bg-n-slate-2.checked\:border-none.rounded-\[4px\]`
  - `div:nth-child(6) > .content-center.grid-cols-12.py-0 > .col-span-2.text-left.tracking-\[0\.5\] > .bg-n-slate-2.checked\:border-none.rounded-\[4px\]`
  - `div:nth-child(6) > .content-center.grid-cols-12.py-0 > .text-left.col-span-3.tracking-\[0\.5\] > .bg-n-slate-2.checked\:border-none.rounded-\[4px\]`

