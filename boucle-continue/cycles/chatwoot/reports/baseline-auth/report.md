# Audit accessibilité — 2026-10-08

**19 règle(s) violée(s), 385 occurrence(s), 22/22 scénario(s) audité(s), 0 erreur(s), 108 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `b51547705e80`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:9700/app/accounts/1/dashboard
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `#toggleConversationFilterButton`
  - `.relative.flex > .v-popper--has-tooltip.w-6.bg-n-slate-9\/10`
  - `.rtl\:rotate-180`
- http://localhost:9700/app/accounts/1/inbox-view
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `.gap-1.relative.flex > .w-8.hover\:enabled\:bg-n-alpha-2.active\:enabled\:scale-\[0\.97\]`
- http://localhost:9700/app/accounts/1/inbox/1
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `#toggleConversationFilterButton`
  - `.relative.flex > .v-popper--has-tooltip.w-6.bg-n-slate-9\/10`
  - `.rtl\:rotate-180`
- http://localhost:9700/app/accounts/1/conversations/1
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `#toggleConversationFilterButton`
  - `.relative.flex > .w-6.h-6.bg-n-slate-9\/10`
  - `.rtl\:rotate-180`
  - `.ltr\:rounded-l-none`
  - `.group-hover\:bg-n-alpha-2`
  - `.text-n-violet-9`
  - `.gap-2.items-center.flex > .text-n-blue-11.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2`
  - `.left-wrap > .bg-n-slate-9\/10.hover\:enabled\:bg-n-slate-9\/20.focus-visible\:bg-n-slate-9\/20:nth-child(1)`
  - `.file-uploads > .bg-n-slate-9\/10.hover\:enabled\:bg-n-slate-9\/20.focus-visible\:bg-n-slate-9\/20`
  - … +3 autres
- http://localhost:9700/app/accounts/1/conversations/2
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `#toggleConversationFilterButton`
  - `.relative.flex > .w-6.h-6.bg-n-slate-9\/10`
  - `.rtl\:rotate-180`
  - `.group-hover\:bg-n-alpha-2`
  - `.text-n-violet-9`
  - `.gap-2.items-center.flex > .text-n-blue-11.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2`
  - `.left-wrap > .bg-n-slate-9\/10.hover\:enabled\:bg-n-slate-9\/20.focus-visible\:bg-n-slate-9\/20:nth-child(1)`
  - `.file-uploads > .bg-n-slate-9\/10.hover\:enabled\:bg-n-slate-9\/20.focus-visible\:bg-n-slate-9\/20`
  - `.left-wrap > .bg-n-slate-9\/10.hover\:enabled\:bg-n-slate-9\/20.focus-visible\:bg-n-slate-9\/20:nth-child(3)`
  - … +2 autres
- http://localhost:9700/app/accounts/1/contacts
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `#toggleContactsFilterButton`
  - `.relative:nth-child(2) > .w-8.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2`
  - `.relative:nth-child(3) > .w-8.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2`
  - `.relative:nth-child(1) > .relative > .group\/cardLayout.bg-n-solid-2.outline-n-container > .flex-row.py-5.px-6 > .h-6.w-6.text-xs`
  - `.relative:nth-child(1) > .relative > .group\/cardLayout.bg-n-solid-2.outline-n-container > .grid-rows-\[0fr\].opacity-0.overflow-hidden > .overflow-hidden > .border-t.p-6.gap-6 > .gap-6.flex-col > .items-start.flex-col:nth-child(1) > .grid-cols-1.sm\:grid-cols-2.gap-4 > div:nth-child(4) > .outline-n-ruby-8.dark\:outline-n-ruby-8.hover\:outline-n-ruby-9 > .\!flex-row.gap-1.flex-col > .flex-shrink-0 > .\!h-\[1\.875rem\].top-1.ltr\:ml-px`
  - `.relative:nth-child(2) > .relative > .group\/cardLayout.bg-n-solid-2.outline-n-container > .flex-row.py-5.px-6 > .h-6.w-6.text-xs`
  - `.relative:nth-child(2) > .relative > .group\/cardLayout.bg-n-solid-2.outline-n-container > .grid-rows-\[0fr\].opacity-0.overflow-hidden > .overflow-hidden > .border-t.p-6.gap-6 > .gap-6.flex-col > .items-start.flex-col:nth-child(1) > .grid-cols-1.sm\:grid-cols-2.gap-4 > div:nth-child(4) > .outline-n-ruby-8.dark\:outline-n-ruby-8.hover\:outline-n-ruby-9 > .\!flex-row.gap-1.flex-col > .flex-shrink-0 > .\!h-\[1\.875rem\].top-1.ltr\:ml-px`
  - `.relative:nth-child(3) > .relative > .group\/cardLayout.bg-n-solid-2.outline-n-container > .flex-row.py-5.px-6 > .h-6.w-6.text-xs`
  - `.relative:nth-child(3) > .relative > .group\/cardLayout.bg-n-solid-2.outline-n-container > .grid-rows-\[0fr\].opacity-0.overflow-hidden > .overflow-hidden > .border-t.p-6.gap-6 > .gap-6.flex-col > .items-start.flex-col:nth-child(1) > .grid-cols-1.sm\:grid-cols-2.gap-4 > div:nth-child(4) > .outline-n-ruby-8.dark\:outline-n-ruby-8.hover\:outline-n-ruby-9 > .\!flex-row.gap-1.flex-col > .flex-shrink-0 > .\!h-\[1\.875rem\].top-1.ltr\:ml-px`
  - … +4 autres
- http://localhost:9700/app/accounts/1/contacts/1
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `.\!h-\[1\.875rem\]`
- http://localhost:9700/app/accounts/1/label/urgent
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `#toggleConversationFilterButton`
  - `.relative.flex > .v-popper--has-tooltip.w-6.bg-n-slate-9\/10`
  - `.rtl\:rotate-180`
- http://localhost:9700/app/accounts/1/reports/overview
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `.flex-wrap.max-w-full.flex-row:nth-child(2) > .m-0\.5.py-5.bg-n-solid-2 > .card-header.mb-6.grid-cols-\[repeat\(auto-fit\,minmax\(max-content\,50\%\)\)\] > .justify-end.flex-row.gap-2 > .v-popper--has-tooltip.group-hover\:bg-n-alpha-2.rounded-md`
  - `.flex-wrap.max-w-full.flex-row:nth-child(3) > .m-0\.5.py-5.bg-n-solid-2 > .card-header.mb-6.grid-cols-\[repeat\(auto-fit\,minmax\(max-content\,50\%\)\)\] > .justify-end.flex-row.gap-2 > .v-popper--has-tooltip.group-hover\:bg-n-alpha-2.rounded-md`
  - `.flex-wrap.max-w-full.flex-row:nth-child(4) > .m-0\.5.py-5.bg-n-solid-2 > .card-body.ml-auto.mr-auto > .flex-col.flex-1.flex > .mt-2.justify-between.items-center > .justify-between.flex-1.gap-2 > .gap-2.items-center.flex > .isolate > .\!size-6.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2:nth-child(1)`
  - `.flex-wrap.max-w-full.flex-row:nth-child(4) > .m-0\.5.py-5.bg-n-solid-2 > .card-body.ml-auto.mr-auto > .flex-col.flex-1.flex > .mt-2.justify-between.items-center > .justify-between.flex-1.gap-2 > .gap-2.items-center.flex > .isolate > .\!size-6.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2:nth-child(2)`
  - `.flex-wrap.max-w-full.flex-row:nth-child(4) > .m-0\.5.py-5.bg-n-solid-2 > .card-body.ml-auto.mr-auto > .flex-col.flex-1.flex > .mt-2.justify-between.items-center > .justify-between.flex-1.gap-2 > .gap-2.items-center.flex > .isolate > .\!size-6.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2:nth-child(4)`
  - `.flex-wrap.max-w-full.flex-row:nth-child(4) > .m-0\.5.py-5.bg-n-solid-2 > .card-body.ml-auto.mr-auto > .flex-col.flex-1.flex > .mt-2.justify-between.items-center > .justify-between.flex-1.gap-2 > .gap-2.items-center.flex > .isolate > .\!size-6.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2:nth-child(5)`
  - `.flex-wrap.max-w-full.flex-row:nth-child(5) > .m-0\.5.py-5.bg-n-solid-2 > .card-body.ml-auto.mr-auto > .flex-col.flex-1.flex > .mt-2.justify-between.items-center > .justify-between.flex-1.gap-2 > .gap-2.items-center.flex > .isolate > .\!size-6.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2:nth-child(1)`
  - `.flex-wrap.max-w-full.flex-row:nth-child(5) > .m-0\.5.py-5.bg-n-solid-2 > .card-body.ml-auto.mr-auto > .flex-col.flex-1.flex > .mt-2.justify-between.items-center > .justify-between.flex-1.gap-2 > .gap-2.items-center.flex > .isolate > .\!size-6.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2:nth-child(2)`
  - `.flex-wrap.max-w-full.flex-row:nth-child(5) > .m-0\.5.py-5.bg-n-solid-2 > .card-body.ml-auto.mr-auto > .flex-col.flex-1.flex > .mt-2.justify-between.items-center > .justify-between.flex-1.gap-2 > .gap-2.items-center.flex > .isolate > .\!size-6.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2:nth-child(4)`
  - … +1 autres
- http://localhost:9700/app/accounts/1/profile
  - `.dark\:hover\:\!bg-n-slate-9\/30`
- http://localhost:9700/app/accounts/1/settings/agents/list
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `.flex-row.py-4.items-start:nth-child(2) > .justify-end.gap-3.flex > .v-popper--has-tooltip.dark\:hover\:enabled\:bg-n-solid-2.dark\:focus-visible\:bg-n-solid-2:nth-child(1)`
  - `.flex-row.py-4.items-start:nth-child(2) > .justify-end.gap-3.flex > .hover\:enabled\:text-n-ruby-11.hover\:enabled\:bg-n-ruby-2.v-popper--has-tooltip`
  - `.flex-row.py-4.items-start:nth-child(3) > .justify-end.gap-3.flex > .v-popper--has-tooltip.dark\:hover\:enabled\:bg-n-solid-2.dark\:focus-visible\:bg-n-solid-2:nth-child(1)`
  - `.flex-row.py-4.items-start:nth-child(3) > .justify-end.gap-3.flex > .hover\:enabled\:text-n-ruby-11.hover\:enabled\:bg-n-ruby-2.v-popper--has-tooltip`
- http://localhost:9700/app/accounts/1/settings/inboxes/list
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `a > .v-popper--has-tooltip.dark\:hover\:enabled\:bg-n-solid-2.dark\:focus-visible\:bg-n-solid-2`
  - `.hover\:enabled\:text-n-ruby-11`
- http://localhost:9700/app/accounts/1/settings/labels/list
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `tr:nth-child(1) > .text-end > .justify-end.gap-3.flex-shrink-0 > .v-popper--has-tooltip.dark\:hover\:enabled\:bg-n-solid-2.dark\:focus-visible\:bg-n-solid-2:nth-child(1)`
  - `tr:nth-child(1) > .text-end > .justify-end.gap-3.flex-shrink-0 > .hover\:enabled\:text-n-ruby-11.hover\:enabled\:bg-n-ruby-2.v-popper--has-tooltip`
  - `tr:nth-child(2) > .text-end > .justify-end.gap-3.flex-shrink-0 > .v-popper--has-tooltip.dark\:hover\:enabled\:bg-n-solid-2.dark\:focus-visible\:bg-n-solid-2:nth-child(1)`
  - `tr:nth-child(2) > .text-end > .justify-end.gap-3.flex-shrink-0 > .hover\:enabled\:text-n-ruby-11.hover\:enabled\:bg-n-ruby-2.v-popper--has-tooltip`
  - `tr:nth-child(3) > .text-end > .justify-end.gap-3.flex-shrink-0 > .v-popper--has-tooltip.dark\:hover\:enabled\:bg-n-solid-2.dark\:focus-visible\:bg-n-solid-2:nth-child(1)`
  - `tr:nth-child(3) > .text-end > .justify-end.gap-3.flex-shrink-0 > .hover\:enabled\:text-n-ruby-11.hover\:enabled\:bg-n-ruby-2.v-popper--has-tooltip`
- http://localhost:9700/app/accounts/1/settings/teams/list
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `a > .v-popper--has-tooltip.dark\:hover\:enabled\:bg-n-solid-2.dark\:focus-visible\:bg-n-solid-2`
  - `.hover\:enabled\:text-n-ruby-11`
- http://localhost:9700/app/accounts/1/settings/general
  - `.dark\:hover\:\!bg-n-slate-9\/30`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `#toggleConversationFilterButton`
  - `.relative.flex > .w-6.h-6.bg-n-slate-9\/10`
  - `.rtl\:rotate-180`
  - `.ltr\:rounded-l-none`
  - `.group-hover\:bg-n-alpha-2`
  - `.text-n-violet-9`
  - `.gap-2.items-center.flex > .text-n-blue-11.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2`
  - `.left-wrap > .bg-n-slate-9\/10.hover\:enabled\:bg-n-slate-9\/20.focus-visible\:bg-n-slate-9\/20:nth-child(1)`
  - `.file-uploads > .bg-n-slate-9\/10.hover\:enabled\:bg-n-slate-9\/20.focus-visible\:bg-n-slate-9\/20`
  - … +3 autres
- http://localhost:9700/app/accounts/1/dashboard [state:profile-menu]
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `#toggleConversationFilterButton`
  - `.relative.flex > .w-6.v-popper--has-tooltip.bg-n-slate-9\/10`
  - `.rtl\:rotate-180`
- http://localhost:9700/app/accounts/1/inbox-view [state:notifications-panel]
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `.gap-1.relative.flex > .w-8.hover\:enabled\:bg-n-alpha-2.active\:enabled\:scale-\[0\.97\]`
- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `#toggleConversationFilterButton`
  - `.relative.flex > .v-popper--has-tooltip.w-6.bg-n-slate-9\/10`
  - `.rtl\:rotate-180`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `#toggleConversationFilterButton`
  - `.relative.flex > .w-6.h-6.text-xs`
  - `.rtl\:rotate-180`
  - `.ltr\:rounded-l-none`
  - `.group-hover\:bg-n-alpha-2`
  - `.text-n-violet-9`
  - `.gap-2.items-center.flex > .text-n-blue-11.hover\:enabled\:bg-n-alpha-2.focus-visible\:bg-n-alpha-2`
  - `.left-wrap > .w-8.bg-n-slate-9\/10[data-v-fa33e37b=""]:nth-child(1)`
  - `.file-uploads > .w-8.bg-n-slate-9\/10[data-v-fa33e37b=""]`
  - … +3 autres
- http://localhost:9700/app/accounts/1/dashboard [state:mobile-390]
  - `.dark\:hover\:\!bg-n-slate-9\/30`
  - `#toggleConversationFilterButton`
  - `.relative.flex > .v-popper--has-tooltip.w-6.h-6`
  - `.\!rounded-full`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.14/image-alt?application=axeAPI

- http://localhost:9700/app/accounts/1/dashboard
  - `.size-6.flex-shrink-0.place-content-center > img`
- http://localhost:9700/app/accounts/1/inbox-view
  - `img`
- http://localhost:9700/app/accounts/1/inbox/1
  - `.size-6.flex-shrink-0.place-content-center > img`
- http://localhost:9700/app/accounts/1/conversations/1
  - `img`
- http://localhost:9700/app/accounts/1/conversations/2
  - `img`
- http://localhost:9700/app/accounts/1/contacts
  - `img`
- http://localhost:9700/app/accounts/1/contacts/1
  - `img`
- http://localhost:9700/app/accounts/1/label/urgent
  - `.size-6.flex-shrink-0.place-content-center > img`
- http://localhost:9700/app/accounts/1/reports/overview
  - `img`
- http://localhost:9700/app/accounts/1/profile
  - `img`
- http://localhost:9700/app/accounts/1/settings/agents/list
  - `img`
- http://localhost:9700/app/accounts/1/settings/inboxes/list
  - `img`
- http://localhost:9700/app/accounts/1/settings/labels/list
  - `img`
- http://localhost:9700/app/accounts/1/settings/teams/list
  - `img`
- http://localhost:9700/app/accounts/1/settings/general
  - `img`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `img`
- http://localhost:9700/app/accounts/1/dashboard [state:profile-menu]
  - `.size-6.place-content-center.flex-shrink-0 > img`
- http://localhost:9700/app/accounts/1/inbox-view [state:notifications-panel]
  - `img`
- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `.size-6.flex-shrink-0.place-content-center > img`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `img`
- http://localhost:9700/app/accounts/1/dashboard [state:mobile-390]
  - `img`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/select-name?application=axeAPI

- http://localhost:9700/app/accounts/1/settings/general
  - `select`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9700/app/accounts/1/dashboard
  - `.text-start.text-n-slate-10.flex-grow`
  - `.leading-5.text-start.flex-grow`
  - `bdi`
- http://localhost:9700/app/accounts/1/inbox-view
  - `.text-start.text-n-slate-10.flex-grow`
  - `.p-4`
- http://localhost:9700/app/accounts/1/inbox/1
  - `.text-start.text-n-slate-10.flex-grow`
  - `.leading-5.text-start.flex-grow`
  - `bdi`
- http://localhost:9700/app/accounts/1/conversations/1
  - `.text-start.text-n-slate-10.flex-grow`
  - `.leading-5.text-start.flex-grow`
  - `bdi`
  - `.xl\:flex-1 > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\] > .select-none`
- http://localhost:9700/app/accounts/1/conversations/2
  - `.text-start.text-n-slate-10.flex-grow`
  - `.leading-5.text-start.flex-grow`
  - `bdi`
- http://localhost:9700/app/accounts/1/contacts
  - `.text-n-slate-10.text-start.flex-grow`
  - `.inline-flex > .bg-n-brand.hover\:enabled\:brightness-110.focus-visible\:brightness-110 > .truncate.min-w-0`
  - `.relative:nth-child(1) > .relative > .group\/cardLayout.bg-n-solid-2.outline-n-container > .flex-row.py-5.px-6 > .justify-start.gap-4.flex-1 > .relative > .group\/avatar.z-0.align-middle > .object-cover.outline-\[rgb\(0_0_0_\/_0\.03\)\].dark\:outline-\[rgb\(255_255_255_\/_0\.04\)\] > .select-none`
  - `.relative:nth-child(3) > .relative > .group\/cardLayout.bg-n-solid-2.outline-n-container > .flex-row.py-5.px-6 > .justify-start.gap-4.flex-1 > .relative > .group\/avatar.z-0.align-middle > .object-cover.outline-\[rgb\(0_0_0_\/_0\.03\)\].dark\:outline-\[rgb\(255_255_255_\/_0\.04\)\] > .select-none`
- http://localhost:9700/app/accounts/1/contacts/1
  - `.text-start.text-n-slate-10.flex-grow`
  - `.inline-flex:nth-child(3) > .bg-n-brand.hover\:enabled\:brightness-110.focus-visible\:brightness-110 > .truncate.min-w-0`
  - `.scale-\[0\.98\].active\:scale-\[1\.02\].hover\:text-n-brand:nth-child(4) > .truncate`
  - `.scale-\[0\.98\].active\:scale-\[1\.02\].hover\:text-n-brand:nth-child(6) > .truncate`
  - `.scale-\[0\.98\].active\:scale-\[1\.02\].hover\:text-n-brand:nth-child(8) > .truncate`
  - `.scale-\[0\.98\].active\:scale-\[1\.02\].hover\:text-n-brand:nth-child(10) > .truncate`
- http://localhost:9700/app/accounts/1/label/urgent
  - `.text-start.text-n-slate-10.flex-grow`
- http://localhost:9700/app/accounts/1/reports/overview
  - `.text-start.text-n-slate-10.flex-grow`
  - `.md\:w-\[65\%\] > .m-0\.5.py-5.bg-n-solid-2 > .card-header.mb-6.grid-cols-\[repeat\(auto-fit\,minmax\(max-content\,50\%\)\)\] > .flex-row.gap-2.items-center:nth-child(1) > .rounded.bg-n-teal-3.text-xs > .text-n-teal-11.text-xs`
  - `.md\:w-\[35\%\] > .m-0\.5.py-5.bg-n-solid-2 > .card-header.mb-6.grid-cols-\[repeat\(auto-fit\,minmax\(max-content\,50\%\)\)\] > .flex-row.gap-2.items-center:nth-child(1) > .rounded.bg-n-teal-3.text-xs > .text-n-teal-11.text-xs`
  - `.flex-wrap.max-w-full.flex-row:nth-child(2) > .m-0\.5.py-5.bg-n-solid-2 > .card-header.mb-6.grid-cols-\[repeat\(auto-fit\,minmax\(max-content\,50\%\)\)\] > .flex-row.gap-2.items-center:nth-child(1) > .rounded.bg-n-teal-3.text-xs > .text-n-teal-11.text-xs`
  - `.flex-wrap.max-w-full.flex-row:nth-child(3) > .m-0\.5.py-5.bg-n-solid-2 > .card-header.mb-6.grid-cols-\[repeat\(auto-fit\,minmax\(max-content\,50\%\)\)\] > .flex-row.gap-2.items-center:nth-child(1) > .rounded.bg-n-teal-3.text-xs > .text-n-teal-11.text-xs`
- http://localhost:9700/app/accounts/1/profile
  - `.text-start.text-n-slate-10.flex-grow`
- http://localhost:9700/app/accounts/1/settings/agents/list
  - `.text-start.text-n-slate-10.flex-grow`
  - `.px-3 > .truncate`
- http://localhost:9700/app/accounts/1/settings/inboxes/list
  - `.text-start.text-n-slate-10.flex-grow`
  - `.px-3 > .truncate`
- http://localhost:9700/app/accounts/1/settings/labels/list
  - `.text-n-slate-10.flex-grow.text-start`
  - `.px-3 > .truncate`
- http://localhost:9700/app/accounts/1/settings/teams/list
  - `.text-start.text-n-slate-10.flex-grow`
  - `.px-3 > .truncate`
- http://localhost:9700/app/accounts/1/settings/general
  - `.text-start.text-n-slate-10.flex-grow`
  - `div:nth-child(3) > .bg-n-brand.text-white[type="submit"]`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `.text-start.text-n-slate-10.flex-grow`
  - `.leading-5.text-start.flex-grow`
  - `bdi`
  - `.xl\:flex-1 > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\] > .select-none`
- http://localhost:9700/app/accounts/1/dashboard [state:profile-menu]
  - `.text-start.text-n-slate-10.flex-grow`
- http://localhost:9700/app/accounts/1/inbox-view [state:notifications-panel]
  - `.text-start.text-n-slate-10.flex-grow`
  - `.p-4`
- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `.text-start.text-n-slate-10.flex-grow`
  - `.leading-5.text-start.flex-grow`
  - `bdi`
  - `ninja-keys,.group-header:nth-child(1)`
  - `ninja-keys,.group-header:nth-child(8)`
  - `ninja-keys,.esc`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `.text-start.text-n-slate-10.flex-grow`
  - `.leading-5.text-start.flex-grow`
  - `bdi`
  - `.xl\:flex-1 > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\] > .select-none`
- http://localhost:9700/app/accounts/1/dashboard [state:mobile-390]
  - `.text-start.text-n-slate-10.flex-grow`
  - `.leading-5.text-start.flex-grow`
  - `bdi`
- http://localhost:9700/route-c56-inexistante [state:route-404]
  - `a`
  - `.help`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.14/html-has-lang?application=axeAPI

- http://localhost:9700/app/accounts/1/dashboard
  - `html`
- http://localhost:9700/app/accounts/1/inbox-view
  - `html`
- http://localhost:9700/app/accounts/1/inbox/1
  - `html`
- http://localhost:9700/app/accounts/1/conversations/1
  - `html`
- http://localhost:9700/app/accounts/1/conversations/2
  - `html`
- http://localhost:9700/app/accounts/1/contacts
  - `html`
- http://localhost:9700/app/accounts/1/contacts/1
  - `html`
- http://localhost:9700/app/accounts/1/label/urgent
  - `html`
- http://localhost:9700/app/accounts/1/reports/overview
  - `html`
- http://localhost:9700/app/accounts/1/profile
  - `html`
- http://localhost:9700/app/accounts/1/settings/agents/list
  - `html`
- http://localhost:9700/app/accounts/1/settings/inboxes/list
  - `html`
- http://localhost:9700/app/accounts/1/settings/labels/list
  - `html`
- http://localhost:9700/app/accounts/1/settings/teams/list
  - `html`
- http://localhost:9700/app/accounts/1/settings/general
  - `html`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `html`
- http://localhost:9700/app/accounts/1/dashboard [state:profile-menu]
  - `html`
- http://localhost:9700/app/accounts/1/inbox-view [state:notifications-panel]
  - `html`
- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `html`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `html`
- http://localhost:9700/app/accounts/1/dashboard [state:mobile-390]
  - `html`

## [SERIOUS] role-img-alt — [role="img"] and [role="image"] elements must have alternative text

Ensure [role="img"] and [role="image"] elements have alternative text
Référence : https://dequeuniversity.com/rules/axe/4.14/role-img-alt?application=axeAPI

- http://localhost:9700/app/accounts/1/dashboard
  - `.object-cover`
- http://localhost:9700/app/accounts/1/inbox-view
  - `.object-cover`
- http://localhost:9700/app/accounts/1/inbox/1
  - `.object-cover`
- http://localhost:9700/app/accounts/1/conversations/1
  - `.text-left > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.xl\:flex-1 > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.\[grid-area\:avatar\] > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
- http://localhost:9700/app/accounts/1/conversations/2
  - `.text-left > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.xl\:flex-1 > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.\[grid-area\:avatar\] > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
- http://localhost:9700/app/accounts/1/contacts
  - `.text-left > .group\/avatar.z-0.align-middle > .object-cover.outline-\[rgb\(0_0_0_\/_0\.03\)\].dark\:outline-\[rgb\(255_255_255_\/_0\.04\)\]`
  - `.relative:nth-child(1) > .relative > .group\/cardLayout.bg-n-solid-2.outline-n-container > .flex-row.py-5.px-6 > .justify-start.gap-4.flex-1 > .relative > .group\/avatar.z-0.align-middle > .object-cover.outline-\[rgb\(0_0_0_\/_0\.03\)\].dark\:outline-\[rgb\(255_255_255_\/_0\.04\)\]`
  - `.relative:nth-child(2) > .relative > .group\/cardLayout.bg-n-solid-2.outline-n-container > .flex-row.py-5.px-6 > .justify-start.gap-4.flex-1 > .relative > .group\/avatar.z-0.align-middle > .object-cover.outline-\[rgb\(0_0_0_\/_0\.03\)\].dark\:outline-\[rgb\(255_255_255_\/_0\.04\)\]`
  - `.relative:nth-child(3) > .relative > .group\/cardLayout.bg-n-solid-2.outline-n-container > .flex-row.py-5.px-6 > .justify-start.gap-4.flex-1 > .relative > .group\/avatar.z-0.align-middle > .object-cover.outline-\[rgb\(0_0_0_\/_0\.03\)\].dark\:outline-\[rgb\(255_255_255_\/_0\.04\)\]`
- http://localhost:9700/app/accounts/1/contacts/1
  - `.text-left > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.gap-3.items-start.flex-col > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
- http://localhost:9700/app/accounts/1/label/urgent
  - `.object-cover`
- http://localhost:9700/app/accounts/1/reports/overview
  - `.hover\:bg-n-alpha-1 > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `tr:nth-child(1) > td:nth-child(1) > div[table="[object Object]"][column="[object Object]"][cell="[object Object]"] > .text-left.items-center.flex > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `tr:nth-child(2) > td:nth-child(1) > div[table="[object Object]"][column="[object Object]"][cell="[object Object]"] > .text-left.items-center.flex > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `tr:nth-child(3) > td:nth-child(1) > div[table="[object Object]"][column="[object Object]"][cell="[object Object]"] > .text-left.items-center.flex > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
- http://localhost:9700/app/accounts/1/profile
  - `.object-cover`
- http://localhost:9700/app/accounts/1/settings/agents/list
  - `.text-left > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.flex-row.py-4.items-start:nth-child(1) > .gap-4.items-center.flex > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.flex-row.py-4.items-start:nth-child(2) > .gap-4.items-center.flex > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.flex-row.py-4.items-start:nth-child(3) > .gap-4.items-center.flex > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
- http://localhost:9700/app/accounts/1/settings/inboxes/list
  - `.object-cover`
- http://localhost:9700/app/accounts/1/settings/labels/list
  - `.object-cover`
- http://localhost:9700/app/accounts/1/settings/teams/list
  - `.object-cover`
- http://localhost:9700/app/accounts/1/settings/general
  - `.object-cover`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `.text-left > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.xl\:flex-1 > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.\[grid-area\:avatar\] > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
- http://localhost:9700/app/accounts/1/dashboard [state:profile-menu]
  - `.object-cover`
- http://localhost:9700/app/accounts/1/inbox-view [state:notifications-panel]
  - `.object-cover`
- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `.object-cover`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `.text-left > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.xl\:flex-1 > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
  - `.\[grid-area\:avatar\] > .group\/avatar.z-0.align-middle > .object-cover.-outline-offset-1.outline-\[rgb\(0_0_0_\/_0\.03\)\]`
- http://localhost:9700/app/accounts/1/dashboard [state:mobile-390]
  - `.object-cover`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.14/list?application=axeAPI

- http://localhost:9700/app/accounts/1/dashboard
  - `.reset-base`
- http://localhost:9700/app/accounts/1/inbox/1
  - `.reset-base`
- http://localhost:9700/app/accounts/1/conversations/1
  - `.reset-base`
  - `.conversation-panel`
- http://localhost:9700/app/accounts/1/conversations/2
  - `.reset-base`
  - `.conversation-panel`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `.reset-base`
  - `.conversation-panel`
- http://localhost:9700/app/accounts/1/dashboard [state:profile-menu]
  - `.ms-5.reset-base.m-0`
  - `.shadow-sm`
  - `.max-h-96`
- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `.reset-base`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `.reset-base`
  - `.conversation-panel`
- http://localhost:9700/app/accounts/1/dashboard [state:mobile-390]
  - `.reset-base`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:9700/app/accounts/1/dashboard
  - `.before\:\!w-px`
- http://localhost:9700/app/accounts/1/inbox/1
  - `.before\:\!w-px`
- http://localhost:9700/app/accounts/1/conversations/1
  - `.before\:\!w-px`
- http://localhost:9700/app/accounts/1/conversations/2
  - `.before\:\!w-px`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `.before\:\!w-px`
- http://localhost:9700/app/accounts/1/dashboard [state:profile-menu]
  - `.before\:\!w-px`
  - `.gap-0 > .n-dropdown-item:nth-child(1)`
  - `.n-dropdown-item:nth-child(2)`
  - `div:nth-child(3) > .n-dropdown-item`
  - `div:nth-child(4) > .n-dropdown-item`
  - `div:nth-child(5) > .n-dropdown-item`
  - `div:nth-child(6) > .n-dropdown-item`
  - `div:nth-child(7) > .n-dropdown-item`
  - `div:nth-child(8) > .n-dropdown-item`
- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `.before\:\!w-px`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `.before\:\!w-px`
- http://localhost:9700/app/accounts/1/dashboard [state:mobile-390]
  - `.before\:\!w-px`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:9700/app/accounts/1/settings/inboxes/list
  - `.justify-end > a`
- http://localhost:9700/app/accounts/1/settings/teams/list
  - `.justify-end > a`

## [SERIOUS] scrollable-region-focusable — Scrollable region must have keyboard access

Ensure elements that have scrollable content are accessible by keyboard in Safari
Référence : https://dequeuniversity.com/rules/axe/4.14/scrollable-region-focusable?application=axeAPI

- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `ninja-keys,.actions-list`

## [SERIOUS] svg-img-alt — <svg> elements with an img or image role must have alternative text

Ensure <svg> elements with an img, image, graphics-document or graphics-symbol role have accessible text
Référence : https://dequeuniversity.com/rules/axe/4.14/svg-img-alt?application=axeAPI

- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `ninja-keys,ninja-action:nth-child(2),.ninja-icon[role="img"][viewBox="0 0 24 24"]`
  - `ninja-keys,ninja-action:nth-child(3),.ninja-icon[role="img"][viewBox="0 0 24 24"]`
  - `ninja-keys,ninja-action:nth-child(4),.ninja-icon[role="img"][viewBox="0 0 24 24"]`
  - `ninja-keys,ninja-action:nth-child(5),.ninja-icon[role="img"][viewBox="0 0 24 24"]`
  - `ninja-keys,ninja-action:nth-child(6),.ninja-icon[role="img"][viewBox="0 0 24 24"]`
  - `ninja-keys,ninja-action:nth-child(7),.ninja-icon[role="img"][viewBox="0 0 24 24"]`
  - `ninja-keys,ninja-action:nth-child(9),.ninja-icon[role="img"][viewBox="0 0 24 24"]`
  - `ninja-keys,ninja-action:nth-child(10),.ninja-icon[role="img"][viewBox="0 0 24 24"]`
  - `ninja-keys,ninja-action:nth-child(11),.ninja-icon[role="img"][viewBox="0 0 24 24"]`
  - `ninja-keys,ninja-action:nth-child(12),.ninja-icon[role="img"][viewBox="0 0 24 24"]`
  - … +18 autres

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.14/meta-viewport?application=axeAPI

- http://localhost:9700/app/accounts/1/dashboard
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/inbox-view
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/inbox/1
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/conversations/1
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/conversations/2
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/contacts
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/contacts/1
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/label/urgent
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/reports/overview
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/profile
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/settings/agents/list
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/settings/inboxes/list
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/settings/labels/list
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/settings/teams/list
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/settings/general
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/dashboard [state:profile-menu]
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/inbox-view [state:notifications-panel]
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `meta[name="viewport"]`
- http://localhost:9700/app/accounts/1/dashboard [state:mobile-390]
  - `meta[name="viewport"]`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:9700/app/accounts/1/contacts
  - `.px-0`
- http://localhost:9700/app/accounts/1/contacts/1
  - `.px-0`
- http://localhost:9700/app/accounts/1/reports/overview
  - `.overflow-y-scroll`
- http://localhost:9700/app/accounts/1/settings/agents/list
  - `.px-0`
- http://localhost:9700/app/accounts/1/settings/inboxes/list
  - `.px-0`
- http://localhost:9700/app/accounts/1/settings/labels/list
  - `.px-0`
- http://localhost:9700/app/accounts/1/settings/teams/list
  - `.px-0`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-main-is-top-level?application=axeAPI

- http://localhost:9700/app/accounts/1/contacts
  - `.h-full.duration-300.flex-col > main`
- http://localhost:9700/app/accounts/1/contacts/1
  - `.\33 xl\:px-px`
- http://localhost:9700/app/accounts/1/settings/agents/list
  - `.font-inter > main`
- http://localhost:9700/app/accounts/1/settings/inboxes/list
  - `.font-inter > main`
- http://localhost:9700/app/accounts/1/settings/labels/list
  - `.font-inter > main`
- http://localhost:9700/app/accounts/1/settings/teams/list
  - `.font-inter > main`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://localhost:9700/app/accounts/1/contacts
  - `.px-0`
- http://localhost:9700/app/accounts/1/contacts/1
  - `.px-0`
- http://localhost:9700/app/accounts/1/settings/agents/list
  - `.px-0`
- http://localhost:9700/app/accounts/1/settings/inboxes/list
  - `.px-0`
- http://localhost:9700/app/accounts/1/settings/labels/list
  - `.px-0`
- http://localhost:9700/app/accounts/1/settings/teams/list
  - `.px-0`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9700/app/accounts/1/contacts
  - `html`
- http://localhost:9700/app/accounts/1/contacts/1
  - `html`
- http://localhost:9700/app/accounts/1/reports/overview
  - `html`
- http://localhost:9700/app/accounts/1/profile
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:9700/app/accounts/1/contacts/1
  - `h6`
- http://localhost:9700/app/accounts/1/reports/overview
  - `.md\:w-\[35\%\] > .m-0\.5.py-5.bg-n-solid-2 > .card-header.mb-6.grid-cols-\[repeat\(auto-fit\,minmax\(max-content\,50\%\)\)\] > .flex-row.gap-2.items-center:nth-child(1) > h5`
  - `.flex-wrap.max-w-full.flex-row:nth-child(2) > .m-0\.5.py-5.bg-n-solid-2 > .card-header.mb-6.grid-cols-\[repeat\(auto-fit\,minmax\(max-content\,50\%\)\)\] > .flex-row.gap-2.items-center:nth-child(1) > h5`
- http://localhost:9700/app/accounts/1/settings/general
  - `.\!pt-0 > header > .col-span-3 > h4`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:9700/route-c56-inexistante [state:route-404]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9700/route-c56-inexistante [state:route-404]
  - `.page`

## Résultats incomplets à revoir (108)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9700/app/accounts/1/dashboard
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/inbox-view
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/inbox/1
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/conversations/1
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/conversations/2
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/contacts
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/contacts/1
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/label/urgent
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/reports/overview
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/profile
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/settings/agents/list
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/settings/inboxes/list
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/settings/labels/list
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/settings/teams/list
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/settings/general
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/dashboard [state:profile-menu]
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/inbox-view [state:notifications-panel]
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `#sidebar-account-switcher`
- http://localhost:9700/app/accounts/1/dashboard [state:mobile-390]
  - `#sidebar-account-switcher`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9700/app/accounts/1/dashboard
  - `.mx-0\.5`
  - `.bg-n-blue-3 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(2) > .after\:bg-transparent.after\:opacity-0.flex-row > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(3) > .after\:bg-transparent.after\:opacity-0.flex-row > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.gap-2.items-center.flex:nth-child(1) > .gap-2.items-center.flex > .text-lg`
  - `.gap-2.items-center.flex:nth-child(2) > .gap-2.items-center.flex > .text-lg`
- http://localhost:9700/app/accounts/1/inbox/1
  - `.mx-0\.5`
  - `.bg-n-blue-3 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(2) > .after\:bg-transparent.after\:opacity-0.flex-row > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(3) > .after\:bg-transparent.after\:opacity-0.flex-row > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.gap-2.items-center.flex:nth-child(1) > .gap-2.items-center.flex > .text-lg`
  - `.gap-2.items-center.flex:nth-child(2) > .gap-2.items-center.flex > .text-lg`
- http://localhost:9700/app/accounts/1/conversations/1
  - `.mx-0\.5`
  - `.bg-n-blue-3 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(2) > .after\:bg-transparent.after\:opacity-0.after\:bottom-px > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(3) > .after\:bg-transparent.after\:opacity-0.after\:bottom-px > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
- http://localhost:9700/app/accounts/1/conversations/2
  - `.mx-0\.5`
  - `.bg-n-blue-3 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(2) > .after\:bg-transparent.after\:opacity-0.after\:bottom-px > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(3) > .after\:bg-transparent.after\:opacity-0.after\:bottom-px > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
- http://localhost:9700/app/accounts/1/contacts
  - `.line-clamp-1`
  - `.tabular-nums`
  - `.text-body-main.text-n-slate-11.truncate`
- http://localhost:9700/app/accounts/1/label/urgent
  - `.bg-n-blue-3 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(2) > .after\:bg-transparent.after\:opacity-0.flex-row > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(3) > .after\:bg-transparent.after\:opacity-0.flex-row > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
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
- http://localhost:9700/app/accounts/1/settings/general
  - `select`
- http://localhost:9700/app/accounts/1/conversations/1 [state:conv-thread]
  - `.mx-0\.5`
  - `.bg-n-blue-3 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(2) > .after\:bg-transparent.after\:opacity-0.after\:bottom-px > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(3) > .after\:bg-transparent.after\:opacity-0.after\:bottom-px > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
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
  - … +14 autres
- http://localhost:9700/app/accounts/1/dashboard [state:command-bar]
  - `.mx-0\.5`
  - `.bg-n-blue-3 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(2) > .after\:bg-transparent.after\:opacity-0.flex-row > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(3) > .after\:bg-transparent.after\:opacity-0.flex-row > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.gap-2.items-center.flex:nth-child(1) > .gap-2.items-center.flex > .text-lg`
  - `.gap-2.items-center.flex:nth-child(2) > .gap-2.items-center.flex > .text-lg`
- http://localhost:9700/app/accounts/1/conversations/1 [state:inbox-filters]
  - `.mx-0\.5`
  - `.mt-4 > .text-n-slate-12.truncate.text-sm`
  - `.bg-n-blue-3 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(2) > .after\:bg-transparent.after\:opacity-0.after\:bottom-px > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(3) > .after\:bg-transparent.after\:opacity-0.after\:bottom-px > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
- http://localhost:9700/app/accounts/1/dashboard [state:mobile-390]
  - `.mx-0\.5`
  - `.bg-n-blue-3 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(2) > .after\:bg-transparent.after\:opacity-0.flex-row > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
  - `.mx-2.ltr\:first\:ml-0.rtl\:first\:mr-0:nth-child(3) > .after\:bg-transparent.after\:opacity-0.flex-row > .bg-n-alpha-1.h-5.ltr\:ml-1 > span`
- http://localhost:9700/route-c56-inexistante [state:route-404]
  - `.error-number`

