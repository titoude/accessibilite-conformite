# verdict-auditeur-v3 — cycle 32 gitea

**Verdict : CONFIRMED** — les fixes v2 (commit aa5181a) corrigent intégralement
les findings du ré-audit v1 (PARTIAL, commit 2a7ee8c). Tout a été rejoué
indépendamment : aucun artefact livré n'est pris pour argent comptant.

Date : 2026-10-07. Rôle : ré-auditeur v3 indépendant (session devin-6aeffa8d).
Produit : go-gitea/gitea @99053ce4fa2b45f1bca5837418c0c57f793ca824 (tag
v1.24.7), branche `devin/boucle-continue`. Méthode : clone propre de ma propre
instance, patch v2 appliqué de zéro, build complet (webpack + go build), deux
instances réelles — vanilla :3500 (`~/work/gitea-src`, SHA propre) et patché
v2 :3501 (`~/work/gitea-v2`, worktree patch appliqué) — seeds propres,
auth par contenu de page (sessions gitea en mémoire), événements clavier
Playwright réels. Ports :3500/:3501 pour ne pas interférer avec les instances
du fixer.

## Tableau mesuré (livré vs rejeu v3)

| Axe | Livré (fixer v2) | Rejeu v3 indépendant | Δ |
|---|---|---|---|
| patch.diff apply | 0 rejet, 273 fichiers / 7090 lignes | `git apply --check` + apply : **0 rejet, 273 fichiers**, sha256 identique | 0 |
| final-public | 0 viol / 0 err / 125 inc (23 sc.) | :3501 **0 / 0 / 125** (23 sc.) | identique |
| final-auth | 0 viol / 0 err / 857 inc (55 sc.) | :3501 **0 / 0 / 860** (55 sc.) | +3 inc transient (même variance que livré↔install ±1) |
| verify.mjs | 58/58 | **58/58** (incl. §3b clavier) | 0 |
| eval-final.mjs | 30/30 | **30/30** | 0 |
| incomplete-probes | 982/982 conformes, 0 unfound | **985/985 conformes, 0 unfound** | +3 = les 3 inc de plus de mon run |
| provenance.json | 41 fichiers | **41/41 sha256 exacts** + `patch.diff.sha256` vérifié | 0 |
| baseline reproduite | public 270 / auth 1186 (scope v1 50 pages) | public 269 (mêmes 14 familles ±1 occ) / auth **1244** sur 55 pages (scope étendu rejoué sur vanilla) | familles identiques ; Δ auth = +5 urls étendues mesurées cassées en vanilla |
| scope | 55 scénarios auth = 32 urls + 23 états ; 23 publics | 55/23 mesurés, urls-auth.txt verbatim | identique |

## F5 — régression clavier (le point critique)

**Claim fixer vérifié : vrai, et la comparaison honnête est en sa faveur.**

Mesures live vrai clavier (`page.keyboard`, pas de dispatchEvent synthétique),
sidebar labels `/a11yorg/demo-repo/issues/2` :

- **Vanilla :3500** — le menu s'ouvre au FOCUS (showOnFocus fomantic) ;
  `Enter` clique `.item.selected` pré-marqué = `a.item.clear-selection` →
  `input[name=label_ids]` passe `2`→`""` (**clear-labels destructif**), focus
  perdu sur BODY. Le claim « le destructif existe aussi en vanilla » est
  **confirmé par mesure**.
- **Patché v2 :3501** — Enter/Espace/ArrowDown/ArrowUp ouvrent le menu fermé
  sur le trigger (`a.fixed-text.muted`, tabindex=0 role=button) ;
  `label_ids` reste `2` sur toutes les touches d'ouverture ; Enter n'active
  `.item.selected` que menu ouvert (`isMenuVisible()` — vérifié dans le code
  ET mesuré : Enter menu ouvert clique bien l'item) ; flèches naviguent
  `.item.selected` ; Escape referme et le focus revient sur le trigger
  (mesuré : sidebar → `a.fixed-text.muted`, navbar → `SPAN.text`).

Étendue du contrat vérifiée sur 17 formes de widgets (réels événements) :
navbar user-menu + repo-menu, footer, context-menu, reaction-picker, jump ×2
(labels, milestones), sort, diff commit-selector (Vue, bouton natif —
`aria-haspopup="menu"` corrigé, `aria-activedescendant` retiré du bouton),
diff options, user-remote-search (trigger svg), `item.ui.dropdown.jump`,
notifications upward, settings selection-type, issues/new labels+milestone —
tous ouvrent sur les 4 touches, `tabindex=0 role=button` présent, **0
pageerror/console.error** pendant les parcours.

Parité vanilla : v2 ≥ vanilla partout mesuré ; strictement supérieur sur
sidebar combos (focus restauré vs BODY) et sort dropdown (Enter ouvre vs
referme+BODY). Les widgets Vue restants (branch-selector DIV[tabindex=0],
diff-commit-selector `<button>`) ouvrent au clavier à l'identique des deux
côtés — parité, pas de régression.

## F1 — h1 self_check

Mesuré :3501 `/-/admin/self_check` : `h1.tw-sr-only` = **« Self Check »**,
`role=main` `aria-label="Self Check"`, `<title>Self Check - GiteaA11yV2`.
Vanilla :3500 : **aucun h1**, main sans label — le fix produit est bien la
cause du titre (conditionnel `{{if .ctxData.Title}}` ×4 layouts +
`ctx.Data["Title"]` dans SelfCheck).

## Résiduels amont — vérifiés DOM sur :3501 (pas juste axe vert)

| Cible | Vanilla :3500 | v2 :3501 |
|---|---|---|
| stacktrace `input[name=seconds]` | pas d'aria-label | `aria-label="seconds"` |
| emails liens-icône ×3 | `null` | « Delete Email » ×2, « Update Email Properties » |
| repos `.delete-button` ×2 | `null` | « Delete This Repository: notes-perso / demo-repo » |
| watchers avatars ×2 | `null` | « alice », « giteaadmin » |

Scope étendu confirmé : `urls-auth.txt` 32 lignes incluant les 5 urls ;
baseline rejouée sur vanilla AVEC ces urls → violations présentes en vanilla,
0 en v2 — l'intégration au périmètre est effective, pas cosmétique.

## Warts W1-W5 — tous rejoués

- **W1** `incomplete-probes.mjs` : sortie datée par défaut vérifiée — mon run
  a écrit `reports/incomplete-probes.json` dans MON répertoire de travail ;
  le rapport commité (sha256 dans provenance) est intact. `--out` fonctionne.
- **W2** unfound = `found:false` : le compteur sépare pass/fail/unfound ;
  mesuré 985/985/0/0.
- **W3** origines réécrites : mes rapports portent `base=http://localhost:3501`
  et urls absolues de l'instance scannée (pas de 127.0.0.1 résiduel).
- **W4** `seed.mjs` idempotent : rejoué — PR #5 stable sur mes instances,
  `state=all` retrouve la fermée, retry POST /pulls exercé (404 post-création
  quirk reproduit et absorbé par la re-vérif GET).
- **W5** flags documentés en en-tête des scripts ; flag inconnu → exit 2
  vérifié.

## Chasse aux angles morts

- Inventaire `.ui.dropdown` complet sur 10 pages : les seuls sans enfant
  trigger tabindex=0 sont les widgets Vue autogérés (natifs button/DIV
  tabindex=0) — tous ouvrent au clavier, parité vanilla. Pas d'autre
  menu-button cassé trouvé.
- `/repo/settings` `.ui.dropdown.selection` ×2 : cachés (`vis=false`, selects
  natifs remplacés par fomantic caché) — non actionnables, pas un trou
  clavier. `.ui.floating.filter.dropdown` (pulls/files) : masqué dans le seed
  (PR à 1 fichier) — non rendu, non testable.
- **Nouveau constat — défaut AMONT, parité exacte** : `aria-expanded` reste
  `"true"` après Escape sur les menu-buttons purs sans `input.search` interne
  (navbar, footer, milestone, context-menu…). Mécanisme : la resync n'est
  déclenchée que par focus/blur/mouseup/Arrow-keyup ; sans blur (le focus
  reste sur le trigger par design du fix), `expanded` n'est jamais rafraîchi.
  Mesuré identique :3500 et :3501 — upstream, invisible à axe, **pas une
  régression v2** mais un reliquat du contrat APG menu-button à signaler.
- Focus perdu ailleurs : aucun cas mesuré — les 3 chemins de fermeture
  (Escape, item, click-extérieur) rendent un élément focusable.

## Honnêteté des claims fixer

- « vanilla aussi destructif » : **vrai, mesuré** (label_ids 2→"" en vanilla).
- « 58/58 verify, 30/30 eval, 982 sondes » : **rejoués exacts** (985 chez
  moi, +3 = variance incomplete axe documentée 857↔858↔860).
- « 0 rejet patch v2 » : **vrai** — sha256 du patch livré = hash du fichier
  appliqué, `git apply` propre sur clone vierge.
- « scope étendu +5 » : **vrai** — urls-auth.txt 32 lignes, baseline vanilla
  rejouée montre les violations sur ces pages.
- results.json / REGISTRE : les chiffres cités correspondent aux artefacts.

## Ce que le verdict signifie

CONFIRMED : le patch v2 supprime la régression clavier F5 (et rend les combos
strictement meilleurs que vanilla), corrige F1 et les 4 résiduels avec scope
étendu réel, et les 5 warts d'outillage sont effectivement fermés. Le seul
défaut résiduel trouvé est amont (aria-expanded stale post-Escape), en parité
exacte vanilla/v2 — il ne bloque pas le verdict mais mérite une entrée
upstream. Livrables : ce fichier + provenance.json re-hashé (42 fichiers).
