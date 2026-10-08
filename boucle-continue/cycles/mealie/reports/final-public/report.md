# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 5/5 scénario(s) audité(s), 0 erreur(s), 64 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `397857019168`

## Résultats incomplets à revoir (64)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7054/login/
  - `#username`
  - `#password`
  - `.v-btn--block > .v-btn__content[data-no-activator=""]`
  - `.mr-auto > .v-btn__content[data-no-activator=""]`
  - `.text-center[data-v-0bb11b2d=""]:nth-child(1) > a[target="_blank"] > .v-btn__content[data-no-activator=""]`
  - `.text-center[data-v-0bb11b2d=""]:nth-child(2) > a[target="_blank"] > .v-btn__content[data-no-activator=""]`
  - `a[href$="docs.mealie.io/"] > .v-btn__content[data-no-activator=""]`
- http://localhost:7054/forgot-password/
  - `#input-v-0-3`
  - `.v-btn--block > .v-btn__content[data-no-activator=""]`
  - `.mx-auto > .v-btn__content[data-no-activator=""]`
- http://localhost:7054/register/
  - `a > .v-btn__content[data-no-activator=""]`
  - `button > .v-btn__content[data-no-activator=""]`
- http://localhost:7054/g/home/shared/r/6b9c1c23-9d57-4821-af04-499c832c2713
  - `.font-weight-regular`
  - `.my-3[data-v-fcb5a4a3=""] > p`
  - `.mb-4 > .time-card-flex[data-v-c92dc9d8=""] > .flex-nowrap.v-row--no-gutters.justify-center > .flex-no-wrap.my-1[data-v-c92dc9d8=""] > .my-0.text-no-wrap[data-v-c92dc9d8=""]`
  - `.mb-4 > .time-card-flex[data-v-c92dc9d8=""] > .flex-nowrap.v-row--no-gutters.justify-center > .flex-no-wrap.my-1[data-v-c92dc9d8=""] > .my-0.text-no-wrap[data-v-c92dc9d8=""] > .font-weight-bold.opacity-80[data-v-c92dc9d8=""]`
  - `button[aria-controls="v-menu-v-0-0-8"] > .v-btn__content[data-no-activator=""] > span`
  - `button[aria-controls="v-menu-v-0-0-12"] > .v-btn__content[data-no-activator=""] > span`
  - `.pr-2:nth-child(1) > div:nth-child(1) > .justify-start.d-flex > .mt-1`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .py-1.ingredient-list-item.px-0 > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .py-1.ingredient-list-item.px-0 > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item > .d-inline[data-v-fcb5a4a3=""]:nth-child(1) > p`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .py-1.ingredient-list-item.px-0 > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item > .text-bold.d-inline[data-v-fcb5a4a3=""] > p`
  - … +12 autres
- http://localhost:7054/g/home/shared/r/6b9c1c23-9d57-4821-af04-499c832c2713 [state:shared-recipe-menu]
  - `.font-weight-regular`
  - `.my-3[data-v-fcb5a4a3=""] > p`
  - `.mb-4 > .time-card-flex[data-v-c92dc9d8=""] > .flex-nowrap.v-row--no-gutters.justify-center > .flex-no-wrap.my-1[data-v-c92dc9d8=""] > .my-0.text-no-wrap[data-v-c92dc9d8=""]`
  - `.mb-4 > .time-card-flex[data-v-c92dc9d8=""] > .flex-nowrap.v-row--no-gutters.justify-center > .flex-no-wrap.my-1[data-v-c92dc9d8=""] > .my-0.text-no-wrap[data-v-c92dc9d8=""] > .font-weight-bold.opacity-80[data-v-c92dc9d8=""]`
  - `button[aria-controls="v-menu-v-0-0-8"] > .v-btn__content[data-no-activator=""] > span`
  - `button[aria-controls="v-menu-v-0-0-12"] > .v-btn__content[data-no-activator=""] > span`
  - `.pr-2:nth-child(1) > div:nth-child(1) > .justify-start.d-flex > .mt-1`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .py-1.ingredient-list-item.px-0 > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .py-1.ingredient-list-item.px-0 > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item > .d-inline[data-v-fcb5a4a3=""]:nth-child(1) > p`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .py-1.ingredient-list-item.px-0 > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item > .text-bold.d-inline[data-v-fcb5a4a3=""] > p`
  - … +14 autres

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:7054/g/home/shared/r/6b9c1c23-9d57-4821-af04-499c832c2713
  - `.bg-info`
  - `button[aria-controls="v-menu-v-0-0-8"]`
  - `button[aria-controls="v-menu-v-0-0-12"]`
- http://localhost:7054/g/home/shared/r/6b9c1c23-9d57-4821-af04-499c832c2713 [state:shared-recipe-menu]
  - `.bg-info`
  - `button[aria-controls="v-menu-v-0-0-8"]`
  - `button[aria-controls="v-menu-v-0-0-12"]`

