# verdict-fixer-v2 — cycle 19 stirling-pdf

Date : 2026-10-04. Rôle : fixer v2 sur finding F1 de l'auditeur (verdict PARTIAL).
Cible : Stirling-Tools/Stirling-PDF @70349fb7e32551b0afa9ba8c5ae3d85bfcc30e48 (v0.46.2), branche artefact devin/boucle-continue.

## F1 — modale analytics : heading-order au boot froid (corrigé, fix produit)

**Mécanisme confirmé en live** : clone propre → `configs/settings.yml` naît avec `system.enableAnalytics: null` → `AppConfig.java:181` (`getEnableAnalytics() == null`) → bean `@analyticsPrompt=true` → `th:if` rend `#analyticsModal` + `window.analyticsPromptBoolean=true` → `home.js` l'affiche. `InitialSetup.java` écrit ensuite `enableAnalytics:true` → le boot SUIVANT est chaud (modale absente). Le rapport final v1 avait été produit à chaud : la violation était donc latente, invisible des rapports v1.

**Correctif produit** (pas de contournement harnais) :
- `home.html` : `<h5 class="modal-title" id="analyticsModalLabel">` → `<h2 class="modal-title fs-5">` — `role="dialog"` + `aria-labelledby="analyticsModalLabel"` déjà présents et corrects (vérifiés : `labelResolves:true`).
- Même classe de défaut corrigée partout — une modale qui s'ouvre expose son titre d'un coup, chaque `<h5 class="modal-title">` était une violation latente identique : `surveyModalLabel` (home.html), `settingsModalLabel` (fragments/navbar.html), `helpModalLabel` (fragments/errorBannerPerPage.html), `loginsModalLabel` (login.html), `addUserModalLabel` (adminSettings.html), `previewFileName` (sign.html). `fs-5`/`fs-4` Bootstrap conservent le visuel (1.25rem/1.5rem).
- `errorBannerPerPage.html` : `<h4 class="alert-heading">` → `<h2 class="alert-heading fs-4">`.

**Résiduel réel trouvé en rejouant les sondes** : `#closeMultiToolAdvert` (« × » de l'encart multi-tool, inline `color:white` sur surface-5 translucide) mesurait **1.14:1** — axe le reléguait en incomplet (`shortTextContent`). Corrigé `color:white` → `color:inherit` → **18.3:1 mesuré** en DOM live (multi-toolAdvert.html).

## Résultats rejoués sur l'artefact final (jar 158 344 280 o)

| Run | Conditions | Violations | Incomplets | verify | eval |
|---|---|---|---|---|---|
| final3-cold | configs/ supprimé → premier boot, modale armée+affichée | **0** | 83 | 32/32 | 22/22 |
| final3-warm | reboot, `enableAnalytics:true` posé | **0** | 89 | 32/32 | 22/22 |

Assertion 13 de verify.mjs (ajoutée) — non-vacue dans les deux modes : si la modale est rendue, exige `role=dialog` + label `H2` + `aria-labelledby` résolu + aucun saut de niveau dans la séquence des titres (sémantique de visibilité axe : `checkVisibility`, titres de modales rendues audités même masqués) ; si absente, exige `analyticsPromptBoolean===false`. À froid : `{"prompt":true,"rendered":true,"role":"dialog","labelTag":"H2","labelledby":"analyticsModalLabel","labelResolves":true,"jump":null,"levels":"22221222222222"}`.

Incomplets : 83 nœuds sondés à froid (`reports/incomplete-probes-v2.json`) dont 13 dans la modale — tous ≥ 18.3:1 réels mesurés ; les motifs `bgOverlap`/`elmPartiallyObscuring` sont des artefacts positionnels (modale ouverte recouvrant la page), pas des défauts.

## Warts corrigés

- **provenance.json** : régénéré au format ntfy — carte `files{path: sha256}` de tous les artefacts (était sans carte, régression).
- **states.json** : réécrit — 6 états réels audit.mjs + 12 routes (était périmé, ne reflétait plus le code).
- **manifest.scope.states** : resynchronisé avec les noms réels audit.mjs ; `boot.notes` ajouté documentant le mécanisme cold/warm (`configs/` écrit dans le cwd java).
- **incomplete-probes.mjs** : les 3 STATE_SETUPS ntfy stale remplacés par les 6 états stirling réels ; BASE par défaut `:8110` ; attente `main, [role=main], body` + `waitUntil:'load'` (l'ancien sélecteur `main, #root` expirait sur /view-pdf dont le main est `role=main`).
- **Comptes honnêtes** : verify.mjs v1 comptait **31** assertions réelles malgré la mention « 32/32 » (12 routes + 6 contrastes + 13 singletons) ; v2 en compte **32** avec l'assertion modale — le « 32/32 » est désormais littéral. Jar : 158 344 279 o ≈ **151 Mo** (install-build.txt disait « 46MB », corrigé).
- **REGISTRE** : `baseline_rules` corrigé — les 11 règles réelles du rapport baseline sont `aria-allowed-attr, button-name, color-contrast, label-title-only, landmark-one-main, meta-viewport, page-has-heading-one, region, select-name, tabindex, target-size` (la ligne disait heading-order/image-alt).

## Livrables v2

- `patch-v2.diff` — cumulatif v1+v2, 26 fichiers, s'applique seul sur clone propre @HEAD (vérifié `git apply --check`), sha256 `91e93fdb898e102faabbb23a007fe32fa6c077fa5f9c71b5af5f3d1cefd274a5`.
- `reports/final3-cold/` + `reports/final3-warm/` — rapports axe rejoués (0 violation dans les deux modes).
- `reports/incomplete-probes-v2.json` — 83 sondes à froid.
- `results.json` `corrections_v2`, `manifest.json`, `states.json`, `tools/{verify,incomplete-probes}.mjs`, `provenance.json` régénérés.
