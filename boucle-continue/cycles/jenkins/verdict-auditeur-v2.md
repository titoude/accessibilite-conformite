# Verdict auditeur v2 — cycle 42 jenkinsci/jenkins

Auditeur : session indépendante (rejeu zéro confiance, ports propres
:7350 vanilla / :7351 patched / :7352 install-build, JENKINS_HOME propres,
seed tools/seed.* rejoué, toolchain provisionnée par l'auditeur : Temurin
JDK 21.0.12.1 + Maven 3.9.16 + miroir ~/.m2). Produit
@`db0e08291b113878ba08f97274d56c321be32078`, version servie 2.586-SNAPSHOT.

## Claims du fixer-v2 vs rejeu

| Claim | Verdict rejeu |
|---|---|
| patch.diff sha256 `611a1630`, 53f +232/−77, `git apply --check` 0 rejet | **confirmé à l'octet** : sha256 sidecar identique, 53 fichiers, +232/−77, 0 rejet sur clone vierge |
| baseline élargie vanilla 3003 occ / 16 règles | **reproduite à −5** : 2998 occ / 16 règles sur :7350. 14/16 règles exactes ; color-contrast 512 vs 521 (−9), target-size 27 vs 23 (+4) — variance dynamique (menus tippy, badges horodatés), même famille que W6 v1. Honnête. |
| final patched 0 viol / 0 err / 48 scans | **confirmé** : 0 violation / 0 erreur sur 48 scénarios (42 routes + 6 états) sur :7351 |
| final incomplets 507 = 382 cc + 125 lcnm | **confirmé exact** : 507 (382 + 125). Diff nœud-par-nœud vs livré = cellules `td[data=ISO8601]` de badges dashboard (horodatages du seed) — même règle, même cible |
| crash amont updates.jelly (`attrs != null`) | **confirmé, preuve live** : vanilla /manage/pluginManager/updates rend un body tronqué (pas de `id="main-panel"`, pas de `</body></html>`) + `JellyTagException … updates.jelly:253:24: <d:invokeBody> Cannot invoke body` verbatim au log ; patched rend la page entière (mainLen 6847, « No updates available ») |
| /available : 50 checkboxes nommées + bouton « More actions » | **confirmé** : vanilla 0/50 nommées → patched 50/50 (displayName sr-only) ; `button-install-after-restart` aria-label présent |
| sondes 312P/64NA/6F patché vs 157F vanilla | **reproduit à ±1** : patched 311P/65NA/6F ; vanilla 157 cc-FAIL exact + 125 lcnm-FAIL + 40 apa-N-A + 1 th-PASS (claim verbatim). Les 6 FAIL patché = `.ace_line:nth-child(N) > .ace_string:nth-child(M)` byte-identiques au livré |
| 6 résidus `.ace_string` ⊆ vanilla, source jpi binaire | **confirmé** : les 6 sont strictement ⊆ des FAIL vanilla (mêmes URL+selecteurs) ; `workflow-editor.css` vit dans `WEB-INF/lib/workflow-cps.jar` à l'intérieur de `workflow-cps.jpi` (zip dans zip), 0 occurrence dans le dépôt, patch ne touche aucun fichier workflow — résidu amont hors périmètre, zéro introduite |
| verify.mjs 31/31 patched | **confirmé** : 31 PASS / 0 FAIL sur :7351 |
| verify 25 FAIL sur vanilla (sabotage discriminant) | **confirmé verbatim** : verify.mjs sur :7350 vanilla → exactement 25 FAIL |
| eval-final.mjs 25/25 | **confirmé** : 25 PASS / 0 FAIL, assertion dialog `{found:true, role:DIALOG, labelled:true}` |
| sabotage détecté | **partiellement confirmé** : revert du label plugin `installed.jelly` dans le jar servi → 75 violations `label` re-détectées par audit.mjs ✓ ; MAIS revert de `aria-labelledby` dans `jsbundles/app.js` servi → eval passe toujours (voir W-v2-1) |
| dialog sans nom réparé live | **confirmé** : `war/jsbundles/app.js:2210-2213` servi pose `id="jenkins-dialog-title-1"` + `aria-labelledby` ; DOM réel : `<dialog class="jenkins-dialog" aria-labelledby="jenkins-dialog-title-1" open>` |
| measure-contrast oklch (parser réparé) | **confirmé** : rejoué sur nœuds réels oklch — `fg=oklch(0.05 0.075 256.91)` → ratio 20.03, `color(srgb …)` parsé aussi ; plus de NaN/crash |
| install-build verbatim 0 viol | **confirmé** : clone vierge @SHA + `git apply` 0 rejet + `mvn -Pquick-build` BUILD SUCCESS + JENKINS_HOME vierge (init.groovy + 75 jpi) + seed `SEED_DONE jobs=6 creds=4` + boot :7352 → rescan 48 scénarios **0 viol / 0 err**, 503 inc (378 cc + 125 lcnm ; −4 cc = cellules badges horodatées, variance connue) |
| provenance --strict 54/54 | **confirmé** : 54/54 sha256 recomputés (clé `gitignore` = `.gitignore`, hash exact) |
| warts W1-W4 v1 corrigés | **confirmé** : package.json renommé `a11y-cycle42-jenkins-tools` ; tautologie branding supprimée (commentaire explicite + vraie assertion `header.app-branding` sur /login) ; assertion eval dialog durcie (`dialog.jenkins-dialog[open]`, `found===true` requis) ; measure-contrast parse oklch/color(srgb) + alpha propagé |

## Sabotage — résultat détaillé

- **Label plugin** : revert de `<label class="attach-previous">` dans
  `jenkins-core.jar!/hudson/PluginManager/installed.jelly` → rescan
  /manage/pluginManager/installed : **75 occ `label` re-détectées**.
  L'outillage axe mord. (Après restauration + restart propre : 0 viol.)
- **Dialog aria-labelledby** : remplacement de
  `setAttribute("aria-labelledby", …)` par un data-attr dans le `app.js`
  servi → **eval ne le détecte PAS** : `labelled` vrai via le fallback
  `querySelector('h1,h2,.jenkins-dialog__title')` (le titre visible reste
  rendu). axe non plus (aucune règle de nommage de dialog dans le ruleset
  par défaut 4.14). L'assertion durcie v2 (find exact + non-vacuité) est un
  vrai progrès sur v1, mais le test `labelled` reste incapable de
  discriminer « titre affiché » de « nom accessible ». Le FIX lui-même est
  prouvé live (attribut servi + asserté). → W-v2-1.

## Chasse — hors-scope restant

Routes réelles non couvertes par les 42, scannées sur :7351 :
`/updateCenter/` 0 viol, `/manage/load-statistics` 0, `/user/admin/builds`
0, `/user/admin/security/` 0, `/job/nightly-backup/lastBuild/consoleFull` 0,
`/job/services/job/worker-queue/configure` 0, `/manage/prepareShutdown/` 0,
`/job/api-pipeline/pipeline-syntax/` **1 viol** (`label` sur `#prototypeText`
— textarea du Snippet Generator servi par workflow-cps.jpi binaire ; même
page en vanilla : 8 règles/27 occ → résidu ⊆ vanilla, net progrès
27→1). Les autres candidates 404 (pas de blue-ocean, pas de
fingerprint/workspace/builds sur ce seed, `/asynchPeople` absent des deux).

**Fausse alerte régression** : en cours de sabotage jar, 6 routes ont 500é
par `ZipException: invalid LOC header` (index zip du jar caché par la JVM vs
fichier réécrit in-place) — artefact de MON sabotage, disparu après restart
propre (`/updateCenter/` 200 = vanilla). Aucune violation introduite par le
patch.

## Warts

- **W-v2-1** `eval-final.mjs` — assertion « dialogue suppression » :
  `labelled` accepte le titre visuel comme preuve de nom accessible → une
  association cassée (titre présent, aria-labelledby absent) passe. Non
  falsificatrice (le fix est réel et servi), mais l'assertion ne sait pas
  mordre seule — une mesure de l'accName calculé (ou check strict
  aria-labelledby|aria-label non vide) la fermerait.
- Sabotage confirmé discriminant pour les labels (75 label rejoués),
  sélecteur dialog assoupli en fallback — sinon tout le reste du harnais
  est net : verify discrimine vanilla à 25 FAIL exacts.

## Chiffres

| Mesure | livré (fixer v2) | rejoué auditeur |
|---|---|---|
| baseline vanilla occ/règles (48 sc.) | 3003/16 | **2998/16** (−5 variance dyn.) |
| final patched viol/err/inc | 0/0/507 | **0/0/507** exact |
| install-build viol/err/inc | 0/0/507 | **0/0/503** (−4 badges horodatés) |
| probes patché / vanilla | 312P/64NA/6F / 157F+125F+40NA+1P | **311P/65NA/6F / 157F+125F+40NA+1P** |
| verify patché / vanilla | 31 PASS / 25 FAIL | **31 PASS / 25 FAIL** exact |
| eval-final | 25 PASS | **25 PASS** |
| sabotage label / dialog | — | **détecté (75 viol) / non détecté (W-v2-1)** |
| provenance --strict | 54/54 | **54/54** |
| oklch measure-contrast | parsé | **ratio 20.03 réel, 0 NaN** |
| résidus .ace_string / pipeline-syntax | 6 ⊆ vanilla / non couvert | **6 ⊆ vanilla exact / 1 label ⊆ vanilla 27** |

**Conclusion** : chaîne complète rejouée de source vierge → war compilé →
service — intégrité patch bit-exacte, baseline élargie honnête (−5 occ),
final 0 viol/0 err/507 inc exact sur deux instances indépendantes + 0 viol
sur install-build vierge, crash amont updates.jelly reproduit puis réparé
live, labels plugin 0→50/50 nommées, sondes et verify discriminants sur
vanilla, 6 résidus jpi binaire ⊆ vanilla zéro introduite, provenance 54/54
stricte. Seul reliquat : l'assertion eval « dialog nommé » ne sait pas
détecter une association cassée (W-v2-1) — faiblesse d'outillage, le fix
produit est prouvé servi. **CONFIRMED.**
