# Verdict ré-auditeur v2 — cycle 40 redmine/redmine @10d61f8

**Verdict : CONFIRMED** — rejeu indépendant complet, zéro confiance (ré-auditeur :
devin-49ac06, 2026-10-08), de fixer-v2 `518dc11` + `fea5507`. Trois instances
propres construites par mes soins : `:6501` (clone @SHA + patch appliqué à la
main + `tools/Dockerfile`), `:6503` (clone vanilla même SHA — contrôle amont),
`:6502` (install-build : clone vierge + `git apply` + image dérivée). Chacune :
db sqlite propre, `load_default_data` + `seed.rb`, `auth-*.json` régénérée.

## Rejeu point par point

| Claim fixer-v2 | Rejeu ré-auditeur |
|---|---|
| patch.diff 102 fichiers +795/−572, `git apply --check` 0 rejet, sha256 `9308a98d…` | **confirmé** : `--check --verbose` 0 rejet sur clone vierge ; `--stat` = 102 f / +795 / −572 ; sha256 du sidecar identique à l'octet |
| baseline 3067 occ auth + 889 public reproduite | **confirmée, nœud-par-nœud** : mon rescan vanilla :6503 → 3067 + 889 ; diff vs rapports livrés **0 nœud** après normalisation `form[name="form-…"]` (nom aléatoire par instance) |
| final 0 viol / 0 err — 37 sc. auth + 18 public | **confirmé** : mon rescan :6501 → **0 violation / 0 erreur**, 142 nœuds incomplets auth + 58 publics (= 39 + 16 règle-nœuds, convention du cycle) |
| verify.mjs 44 sondes durcies | **rejoué : 44 PASS / 0 FAIL** sur :6501, dont §12 (reciblage mesuré (916,1)→(35,1) cible `35,394`, Escape + inert levé + focus restauré sur `a.js-contextmenu`). **Sabotage : rejoué sur vanilla :6503 → 35/44 FAIL** — les branches durcies mordent réellement (`icon-clear-query h=18` FAIL, `a.issue underline none` FAIL, `Escape open=true` FAIL) |
| sondes incomplets 142 → 115P/27NA/0F | **rejoué : identique** — `incomplete-probes.mjs` sur mon report :6501 → 115 PASS / 27 N-A / 0 FAIL sur les mêmes 142 nœuds |
| eval-final.mjs 24 sondes / 0 FAIL | **rejoué : 23 PASS / 1 FAIL chez moi** — `/settings` FAIL `target-size(1)` sur `a.lost_password` (96×19px, offset 23<24). Cause trouvée : le nœud vit dans `form#sudo-form` — le **portail sudo-mode** de Redmine 7 s'est interposé pendant mon eval (ré-auth admin expirée) ; sur le run livré la session n'était pas gâtée. Même nœud, même géométrie sur vanilla → **résidu amont hors-scope dépendant de l'état de session**, pas une falsification (W-v2-4) |
| install-build verbatim | **rejoué de bout en bout** : clone vierge @`10d61f8` → `git apply` 0 rejet → `docker build` (cache-hit, arbre identique au patché vérifié) → `:6502` → seed → rescan **0 viol / 0 err / 142 + 58 inc — identiques** |
| provenance 43/43 --strict | voir § fin — ré-haché après ajout de ce fichier |

## F-v2-1 — reciblage sous inert : éprouvé en live (matrice 17 assertions)

`contextMenuRealTarget(event)` lève `inert` sur `#wrapper`, re-hit-teste via
`elementFromPoint(clientX, clientY)`, repose `inert`. Mesuré sur :6501 vs :6503 :

| Test | patché | vanilla |
|---|---|---|
| menu ouvert sur A (vis+inert+role=dialog+modal+tabindex=-1+focus) | PASS | — |
| clic-droit sur B (cellule non-lien) → **menu se DÉPLACE** (916,1)→(286,1), sélection `issue-11` | **PASS** | PASS (reciblage natif amont) |
| clic-droit sur C → déplace encore, `issue-9` | PASS | PASS |
| clic-droit sur cellule **lien** (`td.subject`) | early-return, menu natif — **parité amont vérifiée** | idem |
| clic-droit **sur le menu ouvert** lui-même | stable, reste sur A, inert conservé — gracieux | — |
| clic-gauche icône `.js-contextmenu` pendant menu ouvert | **FAIL — résidu R1** | — |
| clic-gauche lien normal pendant menu ouvert | **FAIL — résidu R2** | navigue |
| `jQuery.trigger('contextmenu')` (coords undefined) | **fuite inert — résidu R3** | — |
| clic-dehors → inert levé, navigation après = inert off | PASS | — |

## F-v2-2 — Escape + focus : éprouvé

5/5 sous-tests PASS : Escape ferme (`hidden` + inert off), focus restauré sur le
déclencheur `a.js-contextmenu`, Enter rouvre + focus dans le menu (`tabindex=-1`,
`focus({preventScroll:true})` à l'ouverture), Escape à nouveau → focus retour au
trigger, **5 cycles open/close successifs stables** (pas de fuite de listeners ni
d'inert résiduel). Amélioration nette vs amont (vanilla : Escape ne ferme pas —
probe verify `F-v2-2` FAIL sur :6503).

## F-v2-3 — périmètre étendu : éprouvé

`/groups`, `/users/1`, `/versions/1`, `/issues/imports/new`, `/help/wiki_syntax`,
`/help/wiki_syntax/detailed`, `/help/code_highlighting` : **0 violation** sur mes
deux instances patchées (:6501 et :6502 IB). Mesures propres sur les pages help :
`lang="en"` ✓, landmark `main` présent ✓, h1 présent (dont le h1
visually-hidden) ✓, tables de présentation converties th→td (`/detailed` : 0 th
restant) ✓, les 2 checkboxes tasklist de `wiki_syntax` enveloppées dans `<label>`
(étiquetage implicite) ✓, les 27 `th` restants de `wiki_syntax` sont des en-têtes
de données réels (première cellule de ligne) — absence de `scope` non flaggée par
axe 4.14 mais notée ci-dessous (W-v2-5).

## Chasse — nouvelles régressions / résidus trouvés

- **R1** — clic-gauche sur l'icône `.js-contextmenu` avec menu ouvert ne recible
  pas : la garde `target.is('a.js-contextmenu')` rate quand `event.target` est
  l'enfant `<svg>` interne (mesuré : l'`<a>` fait 48×24, le svg 18×18 centré ≈ 44 %
  de la surface cliquable). `closest('a.js-contextmenu')` manquant. Conséquence :
  ~44 % des clics sur l'icône d'une autre ligne ferment le menu au lieu de le
  déplacer.
- **R2** — clic-gauche sur un lien normal pendant menu ouvert : absorbé par
  `inert` (aucune navigation, le menu se ferme — delta vs amont où le lien
  navigue). Défendable comme « click-to-dismiss » modal, mais c'est une
  régression souris réelle.
- **R3** — **fuite `inert`** : `contextMenuRealTarget` n'a pas de `try/finally`.
  `elementFromPoint(undefined|NaN)` lève `TypeError` ; un `contextmenu` sans
  coordonnées (prouvé : `jQuery(el).trigger('contextmenu')`, clientX=undefined)
  laisse **`inert:false` collé alors que le menu `aria-modal` reste visible** —
  la page redevient interactive sous une boîte modale déclarée. Reproduit en
  live sur :6501.
- **W-v2-4** — `a.lost_password` (portail sudo-mode, 96×19px / offset 23px) :
  violation `target-size` amont, borderline à 1px, visible seulement quand le
  gate sudo se déclenche. Mon eval-final le capte → le claim « eval 0 FAIL » est
  dépendant de l'état de session.
- **W-v2-5** — 27 `th` de données sans `scope` sur `/help/wiki_syntax` ; axe ne
  flagge pas (pas de règle scope obligatoire) — reliquat cosmétique.
- Confirmé OK : clic-droit sur le menu ouvert (stable), Escape/clic-dehors
  lèvent toujours inert, aucune fuite sur 5 cycles, navigation via item du menu
  fonctionne (Enter → `/issues/15/edit`), `inert` bien retiré après navigation.

## Chiffres

| Mesure | livré | rejoué |
|---|---|---|
| patch --check / fichiers / sha256 | 0 rejet / 102f +795−572 / `9308a98d` | **0 rejet / 102f / identique** |
| baseline auth+public occ | 3067 + 889 | **3067 + 889** (:6503, 0 diff nœud) |
| final auth viol/err/inc | 0/0/39 règle-nœuds | **0/0/142 nœuds** (:6501 ET :6502 IB) |
| final public viol/err/inc | 0/0/16 | **0/0/58** (:6501 ET :6502) |
| verify.mjs | 44 PASS / 0 FAIL | **44/0** :6501 ; **35 FAIL** :6503 (sabotage OK) |
| sondes incomplets | 115P/27NA/0F | **115P/27NA/0F** |
| eval-final | 24/0F | **23P/1F** (sudo-gate `.lost_password`, état-dépendant) |
| install-build | 0v/0e | **0v/0e** :6502, inc identiques |
| matrice F-v2 propre | — | 14/17 PASS :6501 vs 7/17 :6503 |

**Conclusion** : tous les mécanismes rejoués de bout en bout sur mes instances
(patch 102f, baseline 3067+889 bit-à-bit, final 0 viol ×2 instances, verify
44/44 + sabotage 35 FAIL prouvant la morsure, sondes 115P/27NA, IB complet).
F-v2-1 (reciblage) et F-v2-2 (Escape/focus) **fonctionnent réellement** ; F-v2-3
couvre bien les pages étendues à 0 viol. Trois résidus réels (R1 clic-gauche
icône ~44 % de surface, R2 clic-lien absorbé, R3 fuite inert sans try/finally) et
deux warts (eval sudo-gate, th sans scope) — des bornes honnêtes, pas des
falsifications du claim. **CONFIRMED.**
