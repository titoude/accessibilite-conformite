# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 32 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `f1662265e160`

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
  - `#task-add-textarea-y7q57ltio`
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
  - `.gantt-rows`

