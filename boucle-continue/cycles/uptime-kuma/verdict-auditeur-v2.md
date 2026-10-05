# Verdict auditeur v2 — cycle 29 louislam/uptime-kuma @c98982ac (tag 2.5.5)

**Verdict : CONFIRMED** — rejeu indépendant intégral sur commit `a390a4d` (auditeur : devin-b780aa66, 2026-10-05), après verdict v1 PARTIAL (devin-0ffd0ee0).

Les deux findings v1 sont réellement corrigés et le score axe rejoue à l'identique : **48 scénarios auth (24 urls + 24 états), 0 violation, 0 erreur** ; public 2/2, 0/0. Patch sain — aucun masquage (aria-hidden ajouté uniquement sur des éléments légitimement décoratifs/auxiliaires : icônes FA, `<object>` logo, textarea-buffer clipboard).

## Rejeu effectué (tout exécuté, rien relu au crédit)

Clone propre @`c98982ac` → `git apply --check` + `git apply` patch.diff : **0 rejet, 72 fichiers, +628/−234** (stat git apply — les comptes v2 sont exacts). `npm ci` + `npm run build` → `dist/assets/index-DYNgee6T.js` : **même nom de bundle que le v2 documenté** dans results.json (build vite déterministe ⇒ contenu identique). Boot `DATA_DIR=~/work/uk-data-v2audit UPTIME_KUMA_PORT=3737 node server/server.js` → le serveur démarre en mode setup-database (db-config.json absent) : complété via `POST /setup-database {"dbConfig":{"type":"sqlite"}}` → `seed.mjs` (4 monitors : group 1, http 2, ping 3, **real-browser 4** — nouveau, requis par screenshot-dialog) + heartbeats/stats figés → `login.mjs` → auth.json (JWT 183 chars, localStorage per-origin).

| Claim v2 | Rejeu |
|---|---|
| Scan auth --states all : 0 viol / 0 err / 48 scans | **reproduit** : 48/48 audited, 0 violation, 0 erreur. Incomplets 88 vs 90 livrés — delta = `#switch-theme` (select thème sidebar status-page-edit) flagué 2× chez le worker, 0 chez moi ; même famille documentée (bgImage, flèche SVG native) — inconclusif axe, pas violation. Réapparu chez moi sur le run edge-case : flottant confirmé |
| Scan public | **bit-identique** : 2/2, 0 viol, 0 inc |
| verify.mjs 22/22 (2 N-A) | **22/22 rejoué verbatim** — mêmes 2 N-A (aucun input password sur /add) |
| eval-final.mjs 13/13 (4 N-A) | **13/13 rejoué verbatim** — mêmes 4 N-A |
| incomplete-probes 7 sondes | **ratios bit-identiques** (18.88 / 15.43 ×2 / 21.00 ×3 / 4.69) — seuls generatedAt/base changent dans le JSON produit |
| provenance.json | **49/49 sha256 vérifiés** ; `auth*.json` exclus comme annoncé (JWT éphémères) — wart W5 corrigé |
| statesHash v2 `d9a4b1fb…` | **recomputé exact** depuis le code STATES (digest = url(origin)+setup.toString() par état) ; mon run :3737 → `fcd019e3…`, même méthode, mêmes 24 setups |
| scopeHash | **7/7 recomputés** (JSON.stringify compact) — v2-auth, v2-public, baseline-auth, postfix-auth, install-build-auth + mes 2 runs |
| Ensemble des scénarios | **48 ids identiques** modulo port entre mon scope.json et v2-auth livré |
| Bundle servi | `index-DYNgee6T.js` servi live (restart post-build respecté) |

## F1 — textarea cachée CopyableInput : corrigé, prouvé live sur les 3 surfaces

Patch : `<textarea ref="hiddenTextarea" … aria-hidden="true" tabindex="-1">` — présent dans le diff. Live sur mon instance :
- **badge-link-dialog** (surface d'origine du finding, via /status/demo → edit → monitor-settings → badge-link) : textarea fixe hors-écran porte `aria-hidden="true" tabindex="-1"` ; le state scanné = 0 violation.
- **api-key dialog post-génération** : axe direct sur /settings/api-keys après ouverture+génération → **0 violation, 0 incomplet**. (Note : CopyableInput est monté dès le dialog — `keymodal` toujours dans le DOM — le fix est au niveau composant, couvre rendu et affichage.)
- **monitor type push** (/add, select push) : axe direct → **0 violation** ; textarea cachée avec les deux attributs.

La famille `label` (16 occ baseline → 0) tient sur tout le scope, surfaces CopyableInput incluses.

## F2 — les 6 modales sont des états rejoués

`create-group-dialog`, `tags-add-dialog`, `monitor-setting-dialog`, `badge-link-dialog`, `incident-manage-dialog`, `screenshot-dialog` : chacun a produit un scan sur `.modal.show` sans erreur ni violation dans mon run (et dans v2-auth livré). Le seed v2 ajoute le monitor real-browser id=4 nécessaire à screenshot-dialog — présent et fonctionnel.

## F2b — prism-tomorrow sous la barre : corrigé

`.prism-editor__container { background: #2d2d2d }` dans app.scss — mesuré **computed rgb(45,45,45)** sur /status/demo en édition. Tokens mesurés en live après saisie réelle : selector #cc99cd **5.91:1** (était 2.33 sur blanc), punctuation #cccccc 8.58, property #f8c555 8.60, comment #999999 **4.83** — tous ≥4.5. incident-manage-dialog (le state qui l'a révélé) : 0 violation rejoué, dont mon run edge isolé.

## Cas limite éprouvé : incident pré-existant

L'état incident-manage crée un incident à chaque run — mon premier passage a laissé `incident.id=1` en base (la modale manage ouverte = cible du scan, suppression jamais confirmée). Re-run du state seul avec cet incident présent : **succès** — `create-incident-button` produit un 2e incident (id=2), le sélecteur scoped `[data-testid="incident-edit"]` fonctionne, `.modal.show` scanné, 0 violation, 0 erreur. Sélecteur robuste au pré-existant.

## Warts restants (n'altèrent pas le verdict)

- **WV-1 — login.mjs toujours non rejouable verbatim sur vanilla** (W4 v1 persiste) : `page.fill('#floatingPassword')` exige le patch (l'id arrive sur l'input via `:id` forwardé de HiddenInput). Sans conséquence v2 — le rejeu v2 ne porte que le build patché — mais le login livré suppose toujours le patch appliqué.
- **WV-2 — notes_honnêteté « incident-manage crée+supprime » inexact** : il crée + ouvre la modale manage ; la suppression n'est jamais confirmée → chaque run **accumule** un incident (prouvé : ids 1 puis 2). Non-idempotent croissant — symétrie baseline/final saufée car +1/run, mais la doc dit l'inverse.
- **WV-3 — manifest.seed encore « 3 monitors PAUSÉS »** : le seed v2 en crée 4 (real-browser ajouté) ; scope-compare.v2_post_audit le documente, la section seed du manifest non.
- **WV-4 — `<a>` copier de CopyableInput toujours sans href** : non focusable clavier (gap WCAG 2.1.1 réel, hors périmètre axe — inchangé depuis v1, pas régressé).
- **WV-5 — rapports install-build-* restent ceux de v1** (bundle BBXzlFvr) : v2 n'a pas produit de rapport install-build séparé sur DYNgee6T — sans objet ici : mon rejeu EST un install-build indépendant complet (clone propre + apply + npm ci + build déterministe + rescan 0 viol).
- **WV-6 — `#switch-theme` = incomplet flottant** (bgImage, intermittence scroll/paint) : 2 occurrences livrées, 0-1 chez moi selon les runs — inconclusif axe documenté, jamais une violation.

## Détail technique

- node v24.19.0, playwright 1.63.0, axe-core 4.13.0 (lockfile tools/ — les toolVersions déclarent les ranges ^1.55/^4.10), port :3737, DATA_DIR frais, bundle `index-DYNgee6T.js` servi et vérifié via curl.
- Mes artefacts : `~/work/audit-v2/{auth,public,edge-incident}` + `~/work/probe-v2.mjs`, `probe-axe-f1.mjs` (recomputes + sondes live F1/F2b).
