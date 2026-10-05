# Verdict auditeur v2 — cycle 19 Stirling-Tools/Stirling-PDF

**Verdict : CONFIRMED** — toute la chaîne v2 se reproduit sur rejeu indépendant
(provenance 31/31 sha256, patch-v2 apply propre et cumulatif, build gradle exit 0,
jar 158 344 280 o ≈ 151 Mo, **cold boot rejoué : modale analytics réellement
affichée et 0 violation / 82 incomplets**, warm : 0 / 88, verify 32/32 littérales
×2 modes, eval-final 23 lignes PASS, sondes rejouées à la distribution identique,
mutant vanilla prouvé non-vacu). F1 est corrigé à la source : `#analyticsModalLabel`
h5→h2 **plus toute la classe** `.modal-title`/`.alert-heading`, zéro masquage DOM.

Comme pour tout cycle de la boucle : CONFIRMED = **reproductibilité du score axe
et santé du patch, PAS conformité WCAG complète**. Périmètre = axe wcag2a/aa +
best-practice sur 18 scénarios (12 pages + 6 états), thème light seul ; 82–88
résultats `incomplete` (dont 13 nœuds sous modale) sondés restent une limite de
couverture connue.

Auditeur : session indépendante (devin-c99d6728315944298a9611f16e58354a), VM
dédiée, clone upstream frais à `70349fb7e32551b0afa9ba8c5ae3d85bfcc30e48`,
aucun artefact du fixer réutilisé — tout rejoué depuis les sources.

## Méthode de rejeu (indépendante)

- Clone vierge `Stirling-Tools/Stirling-PDF`, checkout du commit épinglé ;
  `git apply --check` + `git apply patch-v2.diff` : **propre, 26 fichiers**.
- Cumulativité vérifiée : les 23 fichiers de `patch.diff` (v1) sont tous dans
  patch-v2 avec aucun hunk perdu (≥ lignes +/- par fichier) + 3 nouveaux
  (`adminSettings.html`, `navbar.html`, `login.html`) — le diff v2 se suffit.
- Build gradle wrapper avec miroir maven (`~/.gradle/init.d/mirror.gradle`,
  `maven-central.storage-download.googleapis.com/maven2/`) →
  `build/libs/Stirling-PDF-0.46.2.jar` = **158 344 280 o**.
- Build vanilla séparé (worktree non patché) pour le mutant.
- Boot selon manifest sur `:8110` ; **froid** = `configs/settings.yml` supprimé
  avant démarrage (premier boot → `enableAnalytics:null` → modale armée) ;
  **chaud** = reboot après écriture `enableAnalytics:true` par `InitialSetup`.
- `audit.mjs` (runner v5 + settleAnimations), `verify.mjs`, `eval-final.mjs`,
  `incomplete-probes.mjs` — tous rejoués depuis `~/audit-tools` (playwright
  1.63 + axe-core 4.13 + chromium-1243).

## Résultats du rejeu

| Étape | Livré v2 | Rejoué | Verdict |
|---|---|---|---|
| provenance.json | carte sha256 complète | **31/31 hash conformes** aux fichiers du repo | OK (F2 corrigé) |
| patch-v2.diff | 26 fichiers, cumulatif | apply propre au commit épinglé, 23/23 fichiers v1 présents | OK |
| install + build | exit 0, jar ~151 Mo | `gradlew build` exit 0, jar **158 344 280 o** | OK (compte « 151 Mo » honnête — F5 corrigé) |
| **final3-cold** | 0 viol / 83 inc | **0 viol / 82 inc / 0 err** — modale `show` display:block, label H2 | OK (±1 flake incomplets) |
| **final3-warm** | 0 viol / 89 inc | **0 viol / 88 inc / 0 err**, 0 nœud modale | OK (±1 flake) |
| verify.mjs | 32/32 | **32 PASS / 0 FAIL littéral à froid ET à chaud** | OK — compte littéral exact |
| eval-final.mjs | 22/22 | **23 lignes PASS / 0 FAIL** — E1×12 + 11 sous-assertions (E6 émet 2 `ok()`) | OK mais compte « 22 » sous-estimé (nit W1) |
| sondes incomplets | 83 sondes | **83 sondes, distribution identique** (80 color-contrast + 3 aria-prohibited-attr), 13 nœuds modale mesurés 18,3:1 | OK |
| scopeHash | `972e979b…` | **identique** baseline↔final3↔rejeu, recomputé depuis scenarios | IDENTIQUE |
| statesHash | `99c8309d…` (final3) | **identique**, recomputé depuis `audit.mjs` livré | IDENTIQUE |
| statesHash baseline | `a09d3258…` | divergence documentée (runner a changé mi-cycle : settleAnimations ajouté) | légitime — le code STATES ne peut plus être recomputé pour la baseline, mais le hash livré final est vérifié |
| states.json | 6 états réels | synchronisé exactement au `STATES` du runner livré + `manifest.scope.states` | OK (F3 corrigé) |
| baseline livrée | 1036 occ / 11 règles | distribution rejouée : **/sign et /pipeline occurrence-exactes** ; / + états navbar différents — explication ci-dessous | OK |

## Statut des findings v1

- **F1 (major) — RÉSOLU, prouvé à froid.** Le fix est dans les templates
  sources : `#analyticsModalLabel` h5→h2 + les 7 sites `h5.modal-title`
  (analytics, survey, settings, help, logins, addUser, previewFileName) et
  `h4.alert-heading` → h2. Rejeu à froid sur mon clone patché : modale armée
  ET affichée (`modal fade show`, `display:block`, label visible), **0
  violation heading-order** (livré 0/83, mesuré 0/82).
  - Précision sur le mécanisme : en **vanilla à froid** la modale analytics
    s'affiche aussi (vérifié live : `prompt:true`, `role=dialog`, label H5) mais
    ne produit **pas** de heading-order — les titres visibles qui précèdent sont
    des h6 (h6→h5 = diminution légale pour axe). F1 ne se matérialisait que
    parce que le patch v1 élevait les `.menu-title` h6→h2 devant le h5 de la
    modale (h2→h5 = saut >+1). Le défaut h5-dans-modale est bien amont, mais
    le signal venait de l'interaction avec le patch v1 — la correction
    classe-entière de v2 est la bonne réponse. Mon libellé v1 (« upstream,
    non liée au patch ») était imprécis : à retenir comme nit de formulation.
  - Mutant : `verify.mjs` sur le **vanilla à froid** → 24 FAIL dont
    l'assertion modale `{"prompt":true,"labelTag":"H5","jump":"h2→h5"}` —
    l'assertion n'est pas vacuée.
- **F2 (provenance) — RÉSOLU.** `provenance.json` porte une carte sha256
  complète : les 31 entrées re-hachées une par une sur les fichiers du repo,
  toutes conformes.
- **F3 (states.json / manifest) — RÉSOLU.** `states.json` = 12 routes + 6
  états réels (attente navbar, langue, favoris, collapse-mobile, upload,
  theme-dark) en sync avec `audit.mjs` STATES et `manifest.scope.states`.
- **F4 (probes) — RÉSOLU.** `incomplete-probes.mjs` adapté stirling
  (`STATE_SETUPS` = les 6 états réels, BASE 8110, attente `main,[role=main],
  body`) et sortie commitée `incomplete-probes-v2.json`. Ma rejeu produit 83
  sondes à distribution identique, dont les 13 nœuds sous modale tous à
  18,3:1.
- **F5 (comptes) — RÉSOLU.** jar 151 Mo réel (158 344 280 o dans
  install-build.txt et mesuré), baseline 11 règles / 1036 occ, « verify 32/32 »
  est désormais le compte littéral exact.
- **F6 (variance incomplets) — RÉSOLU** : variance ±1 observée (82/88 vs
  83/89) caractérisée flake axe timing-sensible, documentée.

## Résiduel #closeMultiToolAdvert

Claim : `color:white` → `inherit`, 1,14:1 → **18,3:1**. Rejeu : le bouton
« × » hérite la couleur du conteneur navbar sombre ; fg mesuré rgb(0,1,1) →
**13,4:1 alpha-composited** (≈18,3 vs couche opaque — même ordre de grandeur,
méthode de mesure différente). **≥4,5 vérifié.**

## Asymétrie baseline expliquée (non un écart)

La baseline livrée `/` porte `landmark-one-main` + `page-has-heading-one` +
7 color-contrast ; mon scan vanilla **à froid** n'en montre aucun. Cause
vérifiée : modale ouverte → axe traite le DOM sous-jacent comme inerte pour
les règles page-level (region continue de compter). La baseline livrée était
donc un boot chaud — cohérent avec le mécanisme F1, pas un écart d'artefact.

## Warts restants (mineurs, non bloquants)

- **W1** — `eval-final.mjs` émet **23 lignes PASS** (12 routes E1 + 11
  sous-assertions, E6 produisant 2 `ok()`) ; docs claims « 22/22 » —
  sous-compte littéral d'une ligne. Toutes passent.
- **W2** — `provenance.json` `jar_bytes: 158 344 279` vs jar réel et
  `install-build.txt` `158 344 280` — 1 octet (zip non déterministe).
- **W3** — `runnerVersion` reste « audit.mjs v5 » dans report.json alors que
  statesHash a changé mi-cycle (v5+settleAnimations) — documenté dans
  provenance.json, mais le libellé de version n'a pas suivi.
- **W4** — incomplets flake ±1 entre runs (82 vs 83 froid, 88 vs 89 chaud) ;
  accepté comme variance axe, déjà documentée par le fixer.
- **W5** — `incomplete-probes.mjs` BASE par défaut `127.0.0.1:8110` tandis que
  les rapports utilisent `localhost` — sans effet (hash scope embarque
  l'origine du manifeste) mais à harmoniser.
- **W6** — nit de formulation hérité de l'audit v1 : F1 est un défaut
  amont *latent* qui ne se manifeste qu'en combinaison avec l'élévation h6→h2
  du patch v1 ; le verdict v2 corrige à la fois le défaut et la classe.

## Conclusion

Toutes les preuves v2 rejouées sans faire confiance aux affirmations :
fix F1 présent dans les templates sources (aucun masquage DOM), 0 violation
axe aux deux températures de boot avec la modale réellement affichée à froid,
verify 32/32 littéral non vacu (mutant vanilla 24 FAIL), sondes et hash
recomputés conformes. **CONFIRMED.**
