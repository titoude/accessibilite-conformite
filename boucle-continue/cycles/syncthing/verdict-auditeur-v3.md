# Verdict auditeur v3 — cycle 28 : syncthing

**Verdict : PARTIAL** — les six corrections d'outillage v3 sont toutes confirmées à l'identique par rejeu indépendant (STATES exporté 45/45 sans exécution, sondes rejouées bit-pour-bit 198/15/0 sur DEUX instances, verify 32 PASS/0 FAIL, auth.json détracké, provenance 37/37). MAIS le rejeu sur une instance en thème sombre a exposé **39 occurrences réelles de color-contrast** dans les modales — une surface atteignable (thème dark + modale ouverte) que les 45 états ne couvrent jamais : les modales ne sont scannées qu'en thème clair.

- Auditeur : session Devin indépendante `devin-f57ea1f59b2b4cefa04f87e811c5ab1e`
- Produit : syncthing/syncthing @ `7ad73b408adc792cabeed41d89a37b93e2bd84d0`
- Commit audité : `e7b4232` sur `devin/boucle-continue`
- Méthode : clone propre @SHA + `git apply patch.diff` (0 rejet, 20 fichiers), `go generate` → gui.files.go 5 821 396 o (taille identique au mesuré v2), `go build` → 38 506 864 o (identique v2), boot STGUIASSETS :8384 + seed.sh complet + login.mjs, rescan 45 états complet, sondes sur rapport livré ET sur instance embed :8484 (copie home, assets embarqués), verify complet.

## Rejeu vs claims v3 — chiffres

| Point énoncé | Claim v3 | Rejeu auditeur | Δ |
|---|---|---|---|
| `export { STATES }` | import retourne les 45 états sans exécuter run() | `import('./audit.mjs')` → **45/45 états, tous avec `setup` fonction**, aucun lancement navigateur en 8 s — les noms correspondent à states.json | **confirmé** |
| Garde CLI | le CLI marche toujours | `node tools/audit.mjs … --states none` → scan complet produit (0 viol public patché) ; `isCli = resolve(argv[1]) === fileURLToPath(import.meta.url)` correct | **confirmé** |
| Sondes rejouent les états | items d'ÉTATS réellement mesurés | **0 N-A « setup en échec », 0 N-A « navigation en échec »** sur 213 items — chaque page `state:*` a rejoué son setup avant mesure | **réparé** |
| (a) origine réécrite sur BASE | urls :8384 réécrites sur le BASE passé | probes avec `BASE=:8484` (instance embed distincte) sur le rapport livré (urls :8384) → **198/15/0 identique** — la réécriture est prouvée en live, pas seulement lue | **confirmé** |
| (b) goto en échec = N-A explicite | nav non-ok → N-A détaillée | code vérifié : `nav instanceof Error || !nav.ok()` → verdict N-A « navigation vers … en échec au rejeu : … » — plus d'avalement | **confirmé** |
| (c) sondes link-in-text-block / th-has-data-cells | atteignables | link-in-text-block : **12 items sondés → 12 RESOLVED** (`decoration=underline` mesuré) ; th-has-data-cells : 1 item → N-A honnête « 0 `<td>` dans la table — revue manuelle » | **confirmé** |
| Rapport livré vs rejeu | 198 RESOLVED / 15 N-A / 0 CONFIRMED_VIOLATION | **198/15/0 — 0 item divergent** sur les 213 (même verdict item-par-item, mêmes 15 N-A) | **bit-identique** |
| verify.mjs (a) modale #ur | attendue + déclinée | code : waitForSelector('#ur.in') 15 s → clic declineUR() si présente — sur mon instance déjà déclinée (urAccepted=-1) le chemin gracieux passe sans blocage ; sur seed frais (urAccepted=0) le chemin déclinaison est correct par inspection | **confirmé** |
| verify.mjs (b) liens Help panneau ouvert | mesurés visibles, >0 | `PASS liens Help du panneau ouvert soulignés` — `total>0 && underlined===total` exigé (non-vacu) — passe en exécution réelle | **confirmé** |
| verify.mjs (c) :not(#device-this) | n'éteint plus le panneau pré-ouvert | `PASS pas d id dupliqué sharedwith-*` atteint — le clic ouvre un panneau `device-0-*` fermé, editDeviceExisting devient visible, #editDevice/Sharing mesuré, exit 0 | **confirmé** |
| verify.mjs global | 32 PASS / 0 FAIL (+1 N-A toléré) | **32 PASS / 0 FAIL / 1 N-A** (« aucune local addition dans la seed courante » — même N-A qu'en v1/v2, honnête) | **bit-identique** |
| auth.json détracké | plus commité | `git ls-files` : absent ; `git check-ignore tools/auth.json` → match `.gitignore:10` (`boucle-continue/cycles/*/tools/auth.json`) ; supprimé en e7b4232 | **confirmé** |
| provenance 37 fichiers | sha256 exacts | **37/37 recalculés = déclarés** (depuis le disque, post-checkout e7b4232) | **confirmé** |
| results.json claims | verify 32/32, sondes 198/15/0 | tous les deux reproduits exactement ; `corrections_post_audit_warts[1]` décrit fidèlement les fixes (sauf nuance ci-dessous) | **confirmé** |

## Rejeu produit (rappel) : surfaces couvertes toujours propres

- Mon rescan STGUIASSETS :8384, 45 états + login : **0 violation / 0 erreur / 188 incomplets** — identique au rejeu v2 (213 livrés − 25 items des fixes F2/F3 = 188 ✓).
- Probes sur l'embed :8484 (même build, assets embarqués — `theme-assets/light/theme.css` contient bien `#1d6fa5`) : mesures réelles partout où des éléments existent.

## NOUVEAU FINDING — violations réelles en thème sombre (jamais couvertes)

Mon instance embed :8484 a booté avec `theme=dark` (cause : le rejeu des sondes sur :8384 avait rejoué l'état `theme-dark` — PUT config + restart — mais `mobile-home` n'a **0 item incomplete** dans le rapport livré → son setup de restauration n'est jamais rejoué → la home copiée était restée en dark). Le rescan 45 états sur :8484 a donc mesuré les modales **en thème sombre** — surface qu'aucun état ne produit par construction (`theme-dark` ne scanne que le dashboard, après coup).

**39 occurrences `color-contrast` sur 25 états**, trois paires fg/bg, toutes < 4,5:1 :

| Surface | Mesure axe | Cause racine dans `gui/dark/assets/css/theme.css` |
|---|---|---|
| Onglets actifs de TOUTES les modales (#editFolder, #editDevice, #settings, #about, #log-viewer, #urPreview…) | `#3498db` sur `#424242` = **3,18:1** | ligne 31 : `.nav-tabs > li.active > a { color:#3498db !important }` — spécificité (0,3,1) **supérieure** au patch `a:not(.btn){#56a8e0 !important}` (ligne 333, spec 0,1,1) → le fix perd |
| Boutons primaires de modales (Save, Restore…) | `#ffffff` sur `#217dbb` = **4,45:1** | ligne 157 : `.btn-primary { background-color:#217dbb !important }` — jamais patché en dark (le patch ne touche `.btn-primary` qu'en light) |
| Item actif des dropdowns (menu langue « English »…) | `#ffffff` sur `#217dbb` = **4,45:1** | ligne 85 : `.dropdown-menu>.active>a { background:#217dbb !important }` — le patch ligne 334 `{background:#145f93}` est **sans `!important`** → perd systématiquement |
| Titres fancytree (modale restore-versions) | `#aaaaaa` sur `#424242` = **4,32:1** | `.fancytree-title` sur fond sombre — pas de fix |

Vérification live (mesure directe, pas seulement axe) : onglet actif #editFolder = `rgb(52,152,219)` sur `rgb(66,66,66)`, `.btn-primary` = `rgb(255,255,255)` sur `rgb(33,125,187)` — réels, reproductibles, atteignables par tout utilisateur en thème sombre ouvrant une modale.

**Pourquoi le pipeline ne l'a jamais vu** : le baseline et le final scannent les ~20 états-modales AVANT `theme-dark` (sur le thème clair), et `theme-dark` ne scanne que le dashboard. Aucune combinaison « modale ouverte × thème sombre » n'existe dans les 45 états → ces nœuds n'ont jamais été mesurés ni en baseline ni en final. Ce n'est pas une régression du patch — c'est une **famille non couverte** (cf. précédent searxng v1 : surface atteignable hors états = finding produit réel).

Note : le thème `black` (exclu du scope, « variante de dark ») porte les mêmes règles `#3498db`/`#217dbb`/`!important` — même motif probable.

## Warts

1. **REGISTRE.md ligne 28 toujours périmée** (déjà flaggé v2) : cite « patch.diff sha e46c369c » / « 19 fichiers » — le patch livré v2+ fait 20 fichiers, sha256 `a2c0eef6…`. *Corrigé par l'auditeur dans ce commit (doc uniquement).*
2. `results.json` → `resume.verify` = « 26 PASS / 1 N-A » : figure v1 non rafraîchie — le résultat livré v3 (et mon rejeu) est **32 PASS**. Le bloc `corrections_post_audit_warts[1]` est lui correct.
3. `residuel_assume` v3 dit « 14 contrôles share-template + 1 th-has-data-cells » — les 15 N-A réels (livrés = rejoués) sont **13** `duplicate-id-aria` share-template + **1** `color-contrast` (titre du pending-device st3, id aléatoire → absent au rejeu, légitime) + 1 th-has-data-cells. Total exact, libellé imprécis.
4. **Effet de bord des sondes** : `incomplete-probes.mjs` rejoue `theme-dark` (PUT config + RESTART) sans restauration quand `mobile-home` a 0 item — l'instance auditée **reste en thème sombre** après le run. C'est ce qui a rendu ma home :8484 sombre (et permis le finding) — mais en général les sondes laissent l'état config de l'instance modifié : documenter ou restaurer explicitement.

## Ce que le verdict signifie

- Tout ce que la v3 *prétendait* sur l'outillage est vrai et rejoué à l'identique : l'export STATES fonctionne, les sondes mesurent réellement les états (0 « setup en échec »), verify termine 32/32, provenance exacte, claims results.json véridiques, auth.json propre.
- **PARTIAL** parce qu'un défaut produit réel subsiste : la correction color-contrast est incomplète en thème sombre (famille de ~39 occ démontrée, règles `!important` amont non couvertes). Le claim « 0 violation axe sur 46 pages » tient sur les surfaces mesurées, mais une surface atteignable (modale × dark) viole encore WCAG AA.
- Pour un CONFIRMED en v4 : (a) patcher dark/theme.css — `.nav-tabs>li.active>a` (couleur ≥4,5 ou lever le `!important` amont), `.btn-primary` bg (≥4,5 avec #fff), `.dropdown-menu>.active>a` avec `!important` ou spécificité suffisante, `.fancytree-title` ; (b) ajouter un état qui ouvre une modale APRÈS `theme-dark` (ou rejouer 2-3 états-modales en dark) pour fermer le trou de couverture ; (c) régénérer rapports + provenance comme d'habitude.
