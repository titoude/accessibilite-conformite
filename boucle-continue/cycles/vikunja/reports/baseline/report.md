# Audit accessibilité — 2026-10-04

**6 règle(s) violée(s), 55 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 32 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `f1662265e160`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-parent?application=axeAPI

- http://127.0.0.1:3457/projects/2/10
  - `.gantt-timeline`
  - `.gantt-timeline-months`
  - `.gantt-timeline-days`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:3457/
  - `li:nth-child(1) > .router-link-active.router-link-exact-active[aria-current="page"]`
  - `.menu-bottom-link`
  - `div[data-task-id="3"] > .task.single-task.loader-container > .show-project.tasktext[data-v-79b1fd91=""] > span[data-v-79b1fd91=""]:nth-child(1) > .task-project.mie-1.v-popper--has-tooltip`
  - `div[data-task-id="2"] > .task.single-task.loader-container > .show-project.tasktext[data-v-79b1fd91=""] > span[data-v-79b1fd91=""]:nth-child(1) > .task-project.mie-1.v-popper--has-tooltip`
  - `div[data-task-id="1"] > .task.single-task.loader-container > .show-project.tasktext[data-v-79b1fd91=""] > span[data-v-79b1fd91=""]:nth-child(1) > .task-project.mie-1.v-popper--has-tooltip`
- http://127.0.0.1:3457/projects
  - `.router-link-active`
  - `.menu-bottom-link`
- http://127.0.0.1:3457/projects/2/9
  - `a[href$="projects/2"] > .project-menu-title[data-v-fe8abaa7=""]`
  - `.menu-bottom-link`
- http://127.0.0.1:3457/projects/2/10
  - `a[href$="projects/2"] > .project-menu-title[data-v-fe8abaa7=""]`
  - `.menu-bottom-link`
- http://127.0.0.1:3457/projects/2/11
  - `a[href$="projects/2"] > .project-menu-title[data-v-fe8abaa7=""]`
  - `.menu-bottom-link`
- http://127.0.0.1:3457/projects/2/12
  - `a[href$="projects/2"] > .project-menu-title`
  - `.menu-bottom-link`
- http://127.0.0.1:3457/tasks/1
  - `.menu-bottom-link`
  - `.task-id`
  - `.is-danger > span[data-v-ab206f4e=""]:nth-child(2)`
- http://127.0.0.1:3457/labels
  - `.router-link-active`
  - `.menu-bottom-link`
  - `.has-text-centered`
  - `.has-text-centered > a[href$="new"][data-v-b8096804=""]`
- http://127.0.0.1:3457/teams
  - `.router-link-active`
  - `.menu-bottom-link`
  - `.has-text-centered`
  - `.has-text-centered > a[href$="new"][data-v-25b82702=""]`
- http://127.0.0.1:3457/user/settings/general
  - `.menu-bottom-link`
- http://127.0.0.1:3457/projects/2/9 [state:project-menu-open]
  - `.has-text-danger > span[data-v-f51cdba4=""]:nth-child(2)`
  - `a[href$="projects/2"] > .project-menu-title[data-v-fe8abaa7=""]`
  - `.menu-bottom-link`
- http://127.0.0.1:3457/ [state:user-menu-open]
  - `li:nth-child(1) > .router-link-active.router-link-exact-active[aria-current="page"]`
  - `.menu-bottom-link`
  - `div[data-task-id="3"] > .task.single-task.loader-container > .show-project.tasktext[data-v-79b1fd91=""] > span[data-v-79b1fd91=""]:nth-child(1) > .task-project.mie-1.v-popper--has-tooltip`
  - `div[data-task-id="2"] > .task.single-task.loader-container > .show-project.tasktext[data-v-79b1fd91=""] > span[data-v-79b1fd91=""]:nth-child(1) > .task-project.mie-1.v-popper--has-tooltip`
  - `div[data-task-id="1"] > .task.single-task.loader-container > .show-project.tasktext[data-v-79b1fd91=""] > span[data-v-79b1fd91=""]:nth-child(1) > .task-project.mie-1.v-popper--has-tooltip`
- http://127.0.0.1:3457/ [state:notifications-open]
  - `li:nth-child(1) > .router-link-active.router-link-exact-active[aria-current="page"]`
  - `.menu-bottom-link`
  - `div[data-task-id="3"] > .task.single-task.loader-container > .show-project.tasktext[data-v-79b1fd91=""] > span[data-v-79b1fd91=""]:nth-child(1) > .task-project.mie-1.v-popper--has-tooltip`
  - `div[data-task-id="2"] > .task.single-task.loader-container > .show-project.tasktext[data-v-79b1fd91=""] > span[data-v-79b1fd91=""]:nth-child(1) > .task-project.mie-1.v-popper--has-tooltip`
  - `div[data-task-id="1"] > .task.single-task.loader-container > .show-project.tasktext[data-v-79b1fd91=""] > span[data-v-79b1fd91=""]:nth-child(1) > .task-project.mie-1.v-popper--has-tooltip`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://127.0.0.1:3457/
  - `.show-helper-text`
- http://127.0.0.1:3457/projects/2/9
  - `.show-helper-text`
- http://127.0.0.1:3457/projects/2/9 [state:project-menu-open]
  - `.show-helper-text`
- http://127.0.0.1:3457/ [state:user-menu-open]
  - `.show-helper-text`
- http://127.0.0.1:3457/ [state:notifications-open]
  - `.show-helper-text`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.13/list?application=axeAPI

- http://127.0.0.1:3457/projects/2/9
  - `ul`
- http://127.0.0.1:3457/projects/2/9 [state:project-menu-open]
  - `ul`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-prohibited-attr?application=axeAPI

- http://127.0.0.1:3457/tasks/1
  - `.tiptap__task-description > .tiptap__wrapper.tiptap__wrapper-is-editing > .tiptap__editor.tiptap__editor-is-edit-enabled[data-user-content=""] > .ProseMirror[translate="no"][contenteditable="true"]`
  - `.tiptap[data-v-0e67a67e=""] > .tiptap__wrapper.tiptap__wrapper-is-editing > .tiptap__editor.tiptap__editor-is-edit-enabled[data-user-content=""] > .ProseMirror[translate="no"][contenteditable="true"]`
- http://127.0.0.1:3457/filters/new
  - `.tiptap__editor > .ProseMirror[contenteditable="true"][translate="no"]`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.13/link-in-text-block?application=axeAPI

- http://127.0.0.1:3457/labels
  - `.has-text-centered > a[href$="new"][data-v-b8096804=""]`
- http://127.0.0.1:3457/teams
  - `.has-text-centered > a[href$="new"][data-v-25b82702=""]`

## Résultats incomplets à revoir (32)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:3457/projects
  - `.project-grid-item[data-v-9268da2a=""]:nth-child(1) > .project-card[data-v-9268da2a=""][data-v-feceedff=""] > .project-title[data-v-feceedff=""][aria-hidden="true"]`
  - `.project-grid-item[data-v-9268da2a=""]:nth-child(2) > .project-card[data-v-9268da2a=""][data-v-feceedff=""] > .project-title[data-v-feceedff=""][aria-hidden="true"]`
  - `.project-grid-item[data-v-9268da2a=""]:nth-child(3) > .project-card[data-v-9268da2a=""][data-v-feceedff=""] > .project-title[data-v-feceedff=""][aria-hidden="true"]`
- http://127.0.0.1:3457/filters/new
  - `.card-header-title`
  - `.content[data-v-93d38b73=""] > p`
  - `label[for="Title"]`
  - `#Title`
  - `label[for="v-3"]`
  - `.editor-toolbar__button.v-popper--has-tooltip.base-button--type-button:nth-child(1) > .icon > .icon__lower-text[aria-hidden="true"]`
  - `.editor-toolbar__button.v-popper--has-tooltip.base-button--type-button:nth-child(2) > .icon > .icon__lower-text[aria-hidden="true"]`
  - `.editor-toolbar__button.v-popper--has-tooltip.base-button--type-button:nth-child(3) > .icon > .icon__lower-text[aria-hidden="true"]`
  - `label[for="v-4"]`
  - `p > .field`
  - … +3 autres
- http://127.0.0.1:3457/projects/2/9 [state:project-menu-open]
  - `#task-add-textarea-6vru4nv7m`
- http://127.0.0.1:3457/ [state:user-menu-open]
  - `.project-title`
- http://127.0.0.1:3457/ [state:notifications-open]
  - `.explainer`
  - `.project-title`
- http://127.0.0.1:3457/projects/2/9 [state:quickadd-magic-modal]
  - `.card-header-title`
  - `.has-no-shadow.card[data-v-93d38b73=""] > .card-content.loader-container[data-v-93d38b73=""] > .content[data-v-93d38b73=""] > p:nth-child(1)`
  - `h3:nth-child(2)`
  - `p:nth-child(3)`
  - `p:nth-child(4)`
  - `h3:nth-child(5)`
  - `p:nth-child(6)`
  - `h3:nth-child(7)`
  - `p:nth-child(8)`
  - `h3:nth-child(9)`
  - … +1 autres

### aria-required-children — Certain ARIA roles must contain particular children

- http://127.0.0.1:3457/projects/2/10
  - `div[aria-rowcount="0"]`

