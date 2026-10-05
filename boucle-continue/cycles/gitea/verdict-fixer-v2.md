# verdict-fixer-v2 — cycle 32 gitea

Date : 2026-10-05. Rôle : fixer v2 sur le verdict PARTIAL de l'auditeur
(verdict-auditeur.md, commit 2a7ee8c). Toutes les preuves ci-dessous sont
rejouées sur instances réelles de cette session : vanilla :3400, patché v2
:3401, clone vierge + patch v2 :3402.

## F5 — régression clavier WCAG 2.1.1 (corrigée, fix produit)

**Mécanisme confirmé** : le patch v1 retire `tabindex` de la racine
`.ui.dropdown` ; le focus tombe sur l'enfant trigger, que le `showOnFocus`
fomantic (dropdown.js:3956) n'écoute pas — et le keydown fomantic n'ouvre un
menu fermé que sur `downArrow`, jamais sur Enter/Espace. Le seul keydown
ajouté par v1 cliquait `.item.selected` sans condition d'ouverture : sur les
combos sidebar (labels/milestone/assignees) cet item est `a.item.clear-selection`
→ « Clear labels » destructif + focus perdu sur BODY au re-render.

**Correctif** dans `web_src/js/modules/fomantic/dropdown.ts` (`attachDomEvents`) :

- `keydown` sur menu-button (non-combobox) + menu fermé + événement né sur le
  trigger (pas dans `.menu`) + `Enter|Espace|ArrowDown|ArrowUp` →
  `preventDefault` + `dropdown('show')` + `deferredRefreshAriaActiveItem()`.
  Le `show` fomantic réalise le `focusSearch()` natif : sur search-combos le
  focus entre dans l'`input.search` du menu, **exactement comme vanilla**.
  Les comboboxes (role=combobox) sont explicitement exclues — leur clavier
  fomantic natif est intact (équivalence mesurée en v1 par l'auditeur).
- Activation d'item : `Enter` **uniquement si menu ouvert** (`isMenuVisible()`)
  → jamais de clic `.item.selected` quand l'intention est « ouvrir ».
- `Escape` : la fermeture reste celle de fomantic ; notre handler (déclenché
  sur un événement dont l'origine est DANS le widget — nécessaire car fomantic
  masque le menu *synchronement* avant nous, `isMenuVisible()` est déjà faux)
  lance un poll borné 2 s qui restaure le focus sur le trigger focusable une
  fois le menu refermé (3 ticks stables pour absorber le blur tardif fomantic).

**Mesures live** (vrai clavier Playwright, `reports/keyboard-f5-v2.md`) :
:3401 — Enter/Espace/ArrowDown **ouvrent** navbar user-menu (aria-expanded
true), flèches naviguent `.item.selected`, Escape referme + focus restauré
sur `SPAN.text`. Sidebar labels : Enter **ouvre** (focus → input.search),
`label_ids` inchangé `1`→`1` (**pas de clear-labels**), ArrowDown sélectionne
« bug », Escape referme + focus restauré sur `a.fixed-text.muted`.
Constat honnête : le clear-labels destructif existe **aussi en vanilla**
(:3400 mesuré `1`→`""`, focus → BODY) — v2 est strictement meilleur que
l'amont ET que v1. Assertions intégrées à `verify.mjs` section 3b (7 ajoutées)
rejouées sur :3401 — **58/58 OK**.

## F1 — h1 `.tw-sr-only` vide (corrigé, fix produit)

- `templates/{admin,user/settings,org/settings,repo/settings}/layout_head.tmpl`
  ×4 : `<h1 class="tw-sr-only">{{.ctxData.Title}}</h1>` et
  `aria-label="{{.ctxData.Title}}"` rendus **conditionnellement**
  (`{{if .ctxData.Title}}`) — plus de h1 vide ni d'aria-label vide.
- `routers/web/admin/admin.go` `SelfCheck` : `ctx.Data["Title"] =
  ctx.Tr("admin.self_check")` — la page a désormais un titre.
- **Mesuré** :3401 `/-/admin/self_check` : `h1.tw-sr-only` = « Self Check »,
  `role=main` `aria-label="Self Check"`, `<title>Self Check - …</title>`.

## Résiduels amont (intégrés au patch + scope documenté élargi)

| Défaut | Fichier | Fix |
|---|---|---|
| `label` input[name=seconds] | `templates/admin/trace_tabs.tmpl` | `aria-label` via `tool.raw_seconds` |
| `link-name` ×3 emails | `templates/admin/emails/list.tmpl` | `aria-label` sur lien modal (change_email_header) et delete (emails.delete) |
| `link-name` ×2 repos | `templates/admin/repo/list.tmpl` | `aria-label` `repo.settings.delete: <name>` sur .delete-button |
| `link-name` ×2 watchers | `templates/repo/user_cards.tmpl` | `aria-label="{{.DisplayName}}"` sur lien avatar (alt reste décoratif) |

Scope : `tools/urls-auth.txt` +5 urls (`/-/admin/self_check`,
`/-/admin/monitor/stacktrace`, `/-/admin/emails`, `/-/admin/repos`,
`/a11yorg/demo-repo/watchers`) ; `manifest.json` runs.auth.urls synchronisé,
`watchers` sorti de la liste `excluded`. Leçon 20 appliquée : les résiduels
intègrent le périmètre, pas une exception.

## Warts corrigés (tous rejoués)

- **W1** : `incomplete-probes.mjs` sort par défaut dans
  `reports/incomplete-probes-<runId>.json` (plus d'écrasement du rapport
  hashé) ; `--out` explicite pour régénérer le rapport commité — auditCommands
  manifest documenté. Rejoué : sortie via `--out ../reports/incomplete-probes.json`.
- **W2** : compteur unfound = `r.found === false` (avant : filtre sur
  `r.pass === null` ratant les `found:false` sans clé pass).
- **W3** : réécriture d'origine sur `BASE` pour **toutes** les URLs (états et
  pages nues) — leçon 15 fermée côté outil.
- **W4** : `seed.mjs` — `asArr()` sur tous les corps de liste (erreurs API =
  objet) ; issues requêtées `state=all` (la fermée est retrouvée par titre +
  `.number`, pas recréée → index PR stable #5) ; `POST /pulls` : retry borné
  + re-vérif GET (le 404 post-création gitea est un quirk — la PR existe,
  mesuré 2×). Seed rejoué idempotent sur :3401 et :3402.
- **W5** : drapeaux `--storage-state/--out/--reports` documentés en en-tête ;
  positionnels conservés ; flag inconnu → exit 2.

## Résultats rejoués (instances :3401 / :3402, patch.diff régénéré de l'arbre appliqué)

| Run | Violations | Erreurs | Incomplets | Détail |
|---|---|---|---|---|
| final-public :3401 | **0** | 0 | 125 | 23 scénarios |
| final-auth :3401 | **0** | 0 | 857 | 55 scénarios (scope étendu +5 urls) |
| install-build-public :3402 | **0** | 0 | 125 | clone vierge, patch v2 `git apply` 0 rejet |
| install-build-auth :3402 | **0** | 0 | 858 | 55 scénarios, mêmes pages+états que final |
| verify.mjs :3401 | — | — | — | **58/58** assertions (+7 clavier APG §3b) |
| eval-final.mjs :3401 | — | — | — | 30/30 contrôles indépendants |
| incomplete-probes :3401 | — | — | — | **982/982 conformes**, 0 non retrouvée |

Variance honnête : 858 vs 857 incomplets entre install-auth et final-auth —
un nœud axe `incomplete` diffère entre instances (axe non déterministe sur un
compteur) ; violations identiques 0.

## Livrables v2

- `patch.diff` régénéré depuis l'arbre appliqué+vérifié (`git diff` dans
  ~/work/gitea-patched) : **273 fichiers, 7090 lignes**, sha256 dans
  `patch.diff.sha256` — appliqué `git apply --check` propre sur le clone
  vierge :3402.
- `reports/{final-public,final-auth,install-build-public,install-build-auth}/`,
  `reports/incomplete-probes.json` + `.log`, `reports/install-build.log`,
  `reports/keyboard-f5-v2.md`.
- `results.json` : entrée `corrections_post_audit_warts`, `auditTiers`
  `'PARTIAL v1 → v2 fixes'`, chiffres finals rafraîchis.
- `scope-compare.json` régénéré ; `provenance.json` re-hashé (40 fichiers).
- `tools/` : verify.mjs (§3b), incomplete-probes.mjs (W1/W2/W3/W5), seed.mjs (W4).

## Non exécuté

- Mesures clavier v1 non rejouées : le binaire v1 n'existe plus (arbre passé
  v2) — les chiffres v1 du tableau viennent du verdict auditeur.
- Combinaison clavier→sélection→POST formulaire complet sur sidebar (le
  submit réel change l'état seedé ; le comportement menu + non-destruction
  de `label_ids` est prouvé par mesure DOM directe).
