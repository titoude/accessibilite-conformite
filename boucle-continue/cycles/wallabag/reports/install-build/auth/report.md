# Audit accessibilité — 2026-10-07

**0 règle(s) violée(s), 0 occurrence(s), 36/36 scénario(s) audité(s), 0 erreur(s), 45 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `f55fac6050b7`

## Résultats incomplets à revoir (45)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### link-in-text-block — Links must be distinguishable without relying on color

- http://127.0.0.1:8039/view/12
  - `.title-edit`
- http://127.0.0.1:8039/view/14
  - `.title-edit`
- http://127.0.0.1:8039/view/12 [state:entry-annotated]
  - `.title-edit`
- http://127.0.0.1:8039/view/3 [state:entry-leftbar-theme]
  - `.title-edit`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8039/unread/list/1 [state:account-dropdown]
  - `.card-title[href="/view/12"]`
- http://127.0.0.1:8039/unread/list/1 [state:mass-action-bar]
  - `.card-title[href="/view/13"]`
  - `a[title="cssnotes.example.net"]`
  - `#entry-13 > .card.entry-card > .card-action > .reading-time.grey-text > .card-reading-time > span`
  - `#entry-13 > .card.entry-card > .card-action > .reading-time.grey-text > .card-created-at > span`
  - `.card-title[href="/view/12"]`
  - `a[title="tutorials.example.org"]`
  - `#entry-12 > .card.entry-card > .card-action > .reading-time.grey-text > .card-reading-time > span`
  - `#entry-12 > .card.entry-card > .card-action > .reading-time.grey-text > .card-created-at > span`
  - `.card-title[href="/view/10"]`
  - `a[title="terminalnotes.example.org"]`
  - … +26 autres
- http://127.0.0.1:8039/config [state:config-tab-rules]
  - `#tagging_rule_rule`
  - `#tagging_rule_tags`
  - `.btn > span`
  - `.file-path`

