# Verdict ré-auditeur v3 — cycle 40 redmine/redmine @10d61f8

**Verdict : CONFIRMED** — rejeu indépendant complet, zéro confiance (ré-auditeur :
devin-574b3ce9, 2026-10-08), de fixer-v3 `717d250` (patch.diff sha256
`e134664e17e32a951305c9380bd6d96ce65455defb65fadf255869fa21934a12`, 102 fichiers
+1360/−1088). Quatre instances propres construites par mes soins : `:7201`
(clone @SHA + patch v3 à la main + `tools/Dockerfile`), `:7203` (vanilla même
SHA — contrôle amont), `:7204` (patch v2 `9308a98d` — instance sabotage des
régressions), `:7205` (install-build : clone vierge + `git apply` + image
dérivée). Chacune : sqlite propre, `load_default_data` + `seed.rb` rejoués,
`auth-*.json` régénérée par instance.

## Rejeu point par point

| Claim fixer-v3 | Rejeu ré-auditeur v3 |
|---|---|
| patch.diff 102f +1360/−1088, `git apply --check` 0 rejet, sha256 `e134664e…` | **confirmé** : `--check` 0 rejet sur clone vierge ; `--numstat` = 102 f / +1360 / −1088 ; sha256 du fichier identique au sidecar à l'octet |
| baseline 3067 occ auth + 889 public reproduite | **confirmée, nœud-par-nœud** : mon rescan vanilla :7203 → 3067 (15 règles, 152 inc) + 889 (16 règles, 72 inc) ; diff nœud-par-nœud vs rapports livrés = **0** sur les 4 rapports (3219 nœuds auth + 961 publics) après normalisation `localhost:\d+`→P et `form[name="form-…"]`→RN |
| final 0 viol / 0 err — 37 sc. auth + 18 public | **confirmé** : mon rescan :7201 → **0 violation / 0 erreur**, 142 inc auth + 58 publics — ensembles identiques aux livrés (0 diff nœud) |
| verify.mjs 52 sondes / 0 FAIL | **rejoué : 52 PASS / 0 FAIL** sur :7201 — dont R3 TypeError, R1 glyphe, R2 navigation, W-v2-4 24px, W-v2-5 27 th scopés |
| sondes incomplets 142 → 115P/27NA/0F | **rejoué : identique** — `incomplete-probes.mjs` sur MON report :7201 → **115 PASS / 27 N-A / 0 FAIL** sur les mêmes 142 nœuds |
| eval-final 25 sondes / 0 FAIL | **rejoué : 25 PASS / 0 FAIL** sur :7201 — le gate sudo A2 a réellement tiré (`#sudo-form a.lost_password` h=24, session sudo expirée chez moi → portail servi) |
| sabotage : casser un fix détecté | **rejoué sur v2 :7204 → exactement 5 FAIL** (R3 TypeError, R3 inert fuit, R1 glyphe, W-v2-5 27th sans scope, W-v2-4 19px) — les branches durcies mordent |
| install-build verbatim 0 viol | **rejoué de bout en bout** : clone vierge @`10d61f8` → `git apply` 0 rejet → `docker build` → `:7205` → seed → rescan **0 viol / 0 err ; 142 + 58 inc — 0 diff nœud vs livré** |
| provenance 49/49 --strict | **rejoué : 49/49** — sha256 de chaque fichier recalculé depuis le disque par mes soins ; ré-haché 50/50 après ajout de ce fichier |

## R1 / R2 / R3 — éprouvés en LIVE (sonde indépendante `probe-r123.mjs`, événements pointeur réels)

Matrice sur mes trois instances — 13 lignes `hascontextmenu` seedées, vrai clic
Playwright (pointerover→down→up→click) + `jQuery.trigger` synthétique :

| Test | vanilla :7203 | **v2 :7204** | **v3 :7201** |
|---|---|---|---|
| `trigger('contextmenu')` sans coords, menu ouvert | N-A (pas d'inert amont) | **threw `elementFromPoint non-finite`** | PASS — aucune exception |
| état après trigger sans coords (pointeur sur menu) | N-A | **menu ouvert + `inert=false` résiduel** | menu ouvert + inert conservé |
| trigger coords NaN | ok | ok (artefact : inert déjà collé false → early-return) | ok, inert conservé |
| trigger coords réels → reciblage | recible | recible | recible (sel=issue-9) |
| Escape → fermé + inert false | N-A (Escape n'existe pas amont) | PASS | PASS — pas de résidu |
| clic glyphe `svg` `.js-contextmenu`, menu ouvert | recible (parité amont) | **`absorbé-par-inert` — clic physiquement non livrable** | **recible** — PASS |
| clic glyphe, menu fermé | ouvre | ouvre | ouvre |
| clic lien `td.subject`, menu ouvert | **navigue** | **`navigated=false` absorbé-par-inert** | **navigue** → `/issues/10` |
| clic-droit sur menu ouvert | ok | ok | ok — état cohérent |
| clic zone vide → ferme | ferme | **reste ouvert** (clic absorbé) | ferme, inert levé |
| Enter clavier ouvre + focus dedans | ouvre (focus non géré) | ouvre | ouvre, `activeElement=#context-menu` |
| double trigger sans coords | ok | ok | ok, inert cohérent |

Score sonde : **v3 15/15 PASS** — vanilla 10 PASS/5 N-A — **v2 9 PASS/6 FAIL**
(les 3 régressions reproduites mécaniquement : TypeError+fuite inert ×2,
`absorbé-par-inert` ×2, zone-vide).

**Mécanisme R3 vérifié dans le code ET en live** : v2 levait `inert` puis
`elementFromPoint(undefined)` → TypeError → le re-inert (ligne suivante) jamais
atteint → `inert=false` collé sous menu `aria-modal` visible. v3 : garde
`isFinite(clientX) && isFinite(clientY)` avant le lift + `try/finally`
hit-test→re-inert. Bonus mécanique observée : sur v2 le second trigger NaN ne
jette pas — l'inert était déjà collé `false`, `realTarget` court-circuite — la
fuite se masque elle-même.

**Distinction auditée** : sur v3 un `pointerover` hors menu lève inert
transitoirement (le `down-close-up-leave` exige de lever avant `pointerdown`).
Mesuré : `inert=false` observable seulement pendant le survol hors menu ; tout
re-`show` le ré-applique, `Escape`/`pointerdown` ferment proprement — lift
transitoire borné, pas fuite résiduelle. (Wart W-v3-1 ci-dessous.)

## W-v2-4 — `a.lost_password` ≥24px : mesuré réellement

| Surface | v3 :7201 | vanilla :7203 |
|---|---|---|
| `/login` | **24.0×96px** (min-height:24px, display:block, line-height:24px) | 19.0×96px (inline, line-height normal) |
| portail sudo (`GET /settings` → `sudo_mode/new`, `#sudo-form`) | **24.0×96px** (minH 24px, inline-block) | 19.0×96px |

La règle CSS globale couvre les deux contextes ; les gates existent dans
`verify.mjs` (L352, pin déterministe /login) et `eval-final.mjs` (L54-68, gate
sudo). Le gate sudo a réellement tiré pendant mon eval → `h=24` mesuré.

## W-v2-5 — `th` scope : échantillonné

`/help/wiki_syntax.html` : v3 → **27 th, 0 sans scope** (11 `colgroup` +
13 `row` + 3 `col`) ; vanilla → 42 th, **42 sans scope**. Les comptes fixer-v3
(71col/194colgroup/301row globaux) plausibles — échantillon conforme.
Reliquat hors-scope inchangé : `th` sans scope sur `/issues` (10) et `/users`
(9) — identiques amont (headers `sort_header_tag`), déjà comptés dans les
incomplets honnêtes.

## Chasse — nouvelles régressions clavier/souris (sonde `probe-hunt.mjs`, 8 scénarios)

| Scénario | v3 :7201 | vanilla :7203 |
|---|---|---|
| H1 clic-droit réel autre ligne, menu ouvert → recible | PASS (issue-15→issue-7, inert conservé) | PASS |
| H2 touche ContextMenu clavier ouvre le menu | FAIL — n'ouvre pas | **FAIL identique** → parité amont |
| H3 Tab dans le menu → focus sur items | PASS — focus traverse `icon-edit`→`submenu`×3 | focus saute hors menu (BODY→nav) — v3 **améliore** |
| H4 clic checkbox ligne, menu ouvert → bascule | PASS (false→true, menu fermé) | PASS |
| H5 clic milieu lien, menu ouvert → onglet | FAIL `about:blank` | **FAIL identique** → quirk amont |
| H6 scroll pendant menu ouvert | PASS | PASS |
| H7 2e clic-droit même ligne (dernier td) | PASS — stable | PASS |
| H8 clic item Edit du menu → navige | PASS → `/issues/15/edit` | PASS |

**Zéro régression nouvelle** : les deux FAIL (H2, H5) sont à l'identique sur
vanilla — comportement amont, pas introduit. Aucune violation axe introduite
(final 0 viol nœud-identique).

## Warts / résidus constatés (honnêtes, non bloquants)

- **W-v3-1** — fenêtre transitoire `aria-modal` + inert levé : pendant un survol
  pointeur hors menu ouvert, `inert` est levé par design (requis pour que le
  `pointerdown` atteigne la cible). Un lecteur d'écran peut lire la page dans
  cette fenêtre — compromis assumé du down-close-up-leave, borné à la durée du
  survol ; v2 y laissait l'état collé, v3 non.
- **W-v3-2** — 4× `label-content-name-mismatch` en N-A (boutons `Move to top/⇈`
  du sélecteur de colonnes) : le patch a ajouté les `aria-label` (fix
  `button-name`) → texte visible `⇈` ≠ nom accessible — résidu 2.5.3 honnête,
  compté dans les 27 N-A.
- **W-v3-3** — `th` sans `scope` sur listes `/issues`+`/users` : identique
  amont, hors périmètre du patch (générateur `sort_header_tag`).
- **W-v3-4** — écart prompt orchestrateur vs livraison : la consigne parlait de
  « docker-compose officiel mysql », le mécanisme livré est sqlite + image
  dérivée `tools/Dockerfile` (documenté correctement dans manifest.json).
  J'ai rejoué le mécanisme réel — divergences de consigne, pas de falsification.
- Outillage : mon `probe-r123.mjs`/`probe-hunt.mjs` a dû distinguer lift
  transitoire vs fuite (le `pointerover`-lift rend `inert=false` légitime) et
  éviter les collisions de position menu/souris — `verify.mjs` livré gère ces
  cas proprement.

## Chiffres

| Mesure | livré | rejoué (mes instances) |
|---|---|---|
| patch --check / fichiers / sha256 | 0 rejet / 102f +1360/−1088 / `e134664e` | **0 rejet / 102f / identique** |
| baseline auth+public occ | 3067 + 889 | **3067 + 889** (:7203, 0 diff nœud ×4 rapports) |
| final auth viol/err/inc | 0/0/142 | **0/0/142** (:7201 ET :7205 IB) |
| final public viol/err/inc | 0/0/58 | **0/0/58** (:7201 ET :7205) |
| verify.mjs | 52 PASS / 0 FAIL | **52/0** :7201 ; **5 FAIL** :7204 (sabotage v2 mordant) |
| sondes incomplets | 115P/27NA/0F | **115P/27NA/0F** sur mon report |
| eval-final | 25/0F | **25/0F** (gate sudo réellement tiré, h=24) |
| install-build | 0v/0e | **0v/0e** :7205, inc 142+58 **0 diff nœud** |
| sonde R1/R2/R3 | — | **15/15** :7201 / **6F** :7204 / parité amont :7203 |
| chasse clavier-souris | — | 6P/2F :7201 — les 2F identiques amont (parité) |
| provenance --strict | 49/49 | **49/49** → 50/50 après ce fichier |

**Conclusion** : tous les mécanismes rejoués de bout en bout sur mes instances —
patch 102f sha256-identique, baseline 3067+889 bit-à-bit, final 0 viol nœud-par-
nœud sur DEUX builds indépendants, verify 52/0 + sabotage v2 5 FAIL prouvant la
morsure, probes 115P/27NA, eval 25/0 avec gate sudo tiré, IB verbatim 0 diff.
R1 (closest sur svg ~44 % de surface), R2 (down-close-up-leave / pointerover+
pointerdown), R3 (isFinite + try/finally) **ferment réellement les régressions**
— démontré live : la même sonde qui échoue 6× sur v2 passe 15/15 sur v3, avec
parité amont sur R2 (vanilla:true / v3:true / v2:false). W-v2-4 (24px sur /login
ET sudo) et W-v2-5 (th scopés) fermés aussi. Aucune régression nouvelle au
clavier ni à la souris. **CONFIRMED.**

Provenance : ce fichier ajouté à `provenance.json` + re-hachage strict avant
commit ; REGISTRE ligne 40 amendé (cellule auditeur).
