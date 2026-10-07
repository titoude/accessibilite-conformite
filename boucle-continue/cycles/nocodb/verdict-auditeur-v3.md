# Verdict auditeur v3 — cycle 30 : nocodb

**Verdict : CONFIRMED** — les 6 défauts de portabilité du verdict v1 sont réparés et rejoués verbatim sur mes instances (verify 43/43, eval-final 26/26, probes paramétrés via `NC_*` env, plus aucun crash d'IDs en dur), le manifest est tenable mot pour mot (payload onboarding direct `{"is_new_user":false}`, séquence survey POST /forms → share → PATCH surveyMode), `gen-urls.sh` émet des uuid distincts form/survey et la route canonique `/settings/members`, la garde d'URL finale d'eval-final est prouvée vivante (14 FAIL « page redirigée » en rejeu non authentifié), le résiduel produit v1 est corrigé (modale `?rowId=` : dialog nommé, tiptap textbox, textarea étiquetée, boutons nommés — 0 violation sur les 3 surfaces), le rescan final reproduit les chiffres livrés à l'identique (auth 22p 0v/0e/7inc, public 10p 0v/0e/5inc, install-build idem sur conteneur frais), et la provenance est véridique (46/46 sha256 exacts). **Une réserve** : la chasse indépendante sous axe-core 4.14 relève `label-content-name-mismatch` ×15 sur `nc-sidebar-userinfo` — violation WCAG 2.5.3 réelle introduite par le patch (aria-label « Account » vs texte visible « AW »), invisible sous la 4.13 pinnée du livrable (règle encore `enabled:false` en 4.13, standard taguée wcag21a en 4.14). Défaut produit à consolider + wart de version du harnais, pas de falsification.

- Auditeur : session Devin indépendante `devin-23f1d7924e744d7cb61e7fd68e0d0eaf` (ré-audit v3 ; ni l'auditeur v1 ni le fixer v2)
- Produit : nocodb/nocodb @ `00ab4886b85063b4cdcb158f4999adca2c67b721` — image `mirror.gcr.io/nocodb/nocodb@sha256:27d2fd1467…` (digest piné, registry docker.io en rate-limit 429 → mirror à digest identique)
- Commit audité : `a55b9bb` sur `devin/boucle-continue` (patch.diff 114 fichiers +971/−142, sha256 `5d6c0cdd…` conforme à patch.diff.sha256)
- Mes instances : patché :9180 (`nc-a3-patched`, ws `w4rpoacw`, base `p473luocmfuq8b9`, table `mlsrj70guauv91v`, grid `vwc13m572utaz3np`), install-build :9181 (`nc-a3-install`, ws `w52r7edn`, base `pk0lofu3wu7czic`, table `m5qc81n8fx865ti`) — conteneur frais, frontend rebuildé par moi via la pipeline livrée, nc-gui patché matérialisé dans le conteneur (`/usr/src/app/docker/nc-gui`, index.html←200.html)
- Méthode : rejeu intégral sur MES ids — pipeline install-build rejouée (worktree → `git apply` 0 rejet → `pnpm --filter=nocodb-sdk{,-v2} build` → `pnpm install --frozen-lockfile` → `nuxt generate` → docker cp + restart), signup/seed/urls via les outils livrés, auditCommands verbatim (ports décalés), verify/eval/probes entiers, provenance recalculée, patch relu, surfaces hors scope sondées, sonde axe 4.14 croisée avec la 4.13 livrée.

## Rejeu vs livré — chiffres

| Axe | Livré (v2) | Rejeu auditeur v3 | Δ |
|---|---|---|---|
| final-auth (:9180 patché) | 22 scénarios / 0v / 0e / 7 inc | **22 / 0v / 0e / 7 inc** | **identique** |
| final-public | 10 scénarios / 0v / 0e / 5 inc | **10 / 0v / 0e / 5 inc** | **identique** |
| install-build auth (:9181 frais) | 0v / 7 inc / 0e | **0v / 7 inc / 0e** (22 pages) | **identique** |
| install-build public | 0v / 5 inc / 0e | **0v / 5 inc / 0e** (10 pages) | **identique** |
| verify.mjs | 43/43 | **43/43** | identique, via `NC_*` env — sans retouche du code |
| eval-final.mjs | 26/26 | **26/26** | idem — mes ids `w4rpoacw/p473luocmfuq8b9/…` dans les URL des sections B/C |
| sondes incomplets | mêmes motifs v1 | **7 nœuds auth + 5 publics, mêmes cibles** | contrastes mesurés 1.42-occulté / 4.87 / 7.78 / 4.68-composite, th-cells `headerOnly+siblingRows>0` — aucune n'est une violation |
| residual-probe.mjs | 0 viol (3 surfaces) | **0 viol** — modale `?rowId=`, `/account/tokens/new`, `/admin/?tab=settings` | identique |
| provenance.json | 46 fichiers | **46/46 sha256 exacts** | `verdict-auditeur.md` non listé, légitime (sortie post-audit) |
| patch.diff | 114 fichiers +971/−142 | **exact** | sha256 `5d6c0cdd…` = patch.diff.sha256 |

## Les 6 défauts v1, éprouvés un à un

1. **IDs en dur → `NC_*` env** : verify.mjs (l.34-40), eval-final.mjs, incomplete-probes.mjs (l.22-26) lisent tous `NC_WS/NC_BASE/NC_TABLE/NC_GRID/NC_KANBAN/NC_FORM/NC_SHARE_FORM` avec les anciens défauts worker. Rejeu sur :9180/:9181 avec mes ids exportés : **43/43, 26/26, 12 sondes** — zéro crash, les URLs de section B/C portent bien mes identifiants. Corrigé.
2. **Payload onboarding no-op → corps direct** : manifest corrigé (`PATCH /api/v1/user/profile {"is_new_user":false}`). Rejoué verbatim sur :9181 → `GET /api/v1/auth/user/me` retourne `is_new_user: 0`. Corrigé.
3. **urls-auth.txt stale** : `gen-urls.sh` régénère 14 auth + 7 public depuis l'API, route canonique `/w52r7edn/settings/members` présente. Corrigé.
4. **uuid form/survey identique** : gen-urls.sh émet `55cf7e86…` (form) ≠ `9613b97c…` (survey `/survey` suffix), garde `if [ "$SHFORM" = "$SHSURV" ] → exit 1` présente. Vue survey dédiée créée via la séquence manifest verbatim (POST `/api/v2/meta/tables/$TID/forms` → `vwv03wh9otiltbtf` → POST share → uuid `9613b97c` → PATCH meta `{"surveyMode":true,…}` confirmé en réponse). Corrigé.
5. **PASS vacues B/C → garde d'URL finale** : `if (pathname !== attendu) ok(…, false, 'page redirigée vers …')` aux lignes 70-91. **Prouvé vivant** : eval-final sans storage-state sur :9181 → 14 FAIL explicites `page redirigée vers http://localhost:9181/signin?continueAfterSignIn=…` (le rejeu v1 aurait mesuré le signin en silence). Corrigé.
6. **signup.mjs :8080 en dur** : signup-install.mjs `<baseUrl>` argumenté, utilisé tel quel sur :9181 (`continueAfterOnboardingFlow` atteint). Corrigé.

## Résiduel produit v1 — éprouvé au DOM

`?rowId=1` ouvre l'expanded form : `.ant-modal-wrap.nc-modal-wrapper` porte `role="dialog"` + `aria-label="Edit record"` (mécanisme patch : `NcModal.ariaLabel` → `wrapProps` → `:aria-label="dialogLabel"` dans l'expanded form, `t('labels.editRecord')`), inner `.ant-modal` `role="document"` ; tiptap commentaires `role="textbox"` + `aria-label="Comment..."` ; textarea `aria-label="Title"` ; boutons tous nommés (`Prev/Next record ALT+←/→`, `Copy record URL`, `Actions`, `Close`, `Expand`, textes `Save record`/`All comments`). `/account/tokens/new` et `/admin/?tab=settings` : 0 violation. État `edit-record-modal` présent dans STATES (setup viewport 1280×800 + reload + waitForSelector `[data-testid="nc-expanded-form-modal"]`) et exercé dans le rescan : 0 viol. Corrigé.

## Chasse — surfaces hors scope (mesurées :9180, axe 4.13 pinnée)

- **Dropdowns outils rejoués : 0 violation chacun** — Fields, Filter, Sort (toolbar grid), switcher de workspace (`.nc-mini-sidebar-ws-item` → `.nc-dropdown`), `/account/settings`, base dashboard.
- **Palette recherche globale injoignable** : bouton `nc-global-search-show-input` présent mais click/Ctrl+K n'ouvre rien sur cette build (feature gatée côté produit) — non auditable, non couverte.
- **Grille de données = rendu canvas** : headers de colonnes non DOM — non sondables par axe (limite de surface, cohérente avec states livrés).
- **Audit complet axe-core 4.14.0 (ma sonde, vs 4.13.0 livrée)** : **1 seule règle supplémentaire se déclenche** — voir findings.

## Finding nouveau — résiduel produit (axe 4.14)

`label-content-name-mismatch` **×15 pages** (toute page à mini-sidebar) sur `.nc-mini-sidebar-ws-item` (`[data-testid="nc-sidebar-userinfo"]`). Le patch ajoute `role="button"` + `:aria-label="$t('labels.account')"` → nom accessible « Account » alors que le texte visible est « AW » (initiales avatar). WCAG 2.5.3 exige que le nom contienne le texte présenté visuellement : violation réelle, introduite par le correctif du `button-name` v1. **Invisible sous la toolchain livrée** : `tools/package-lock.json` épingle axe-core 4.13.0 où la règle est expérimentale (`enabled:false`) ; en 4.14.0 elle est standard, taguée `wcag21a` — donc dans le `runOnly` d'audit.mjs. Mesuré : 4.13 → 0 violation ; 4.14 → 15 nœuds, aucun autre delta sur les 22 pages. Recommandation v4 : `aria-hidden` sur les initiales avatar OU intégrer les initiales au nom ; **et bumper axe-core ≥4.14 dans tools/** (le harnais ne peut pas voir une règle wcag21a devenue standard).

## Ce que le verdict signifie

- **CONFIRMED** : chaque claim v2 reproduit verbatim sur des ids et des conteneurs qui ne sont pas les siens ; les 6 défauts v1 + le résiduel modale sont corrigés et éprouvés ; la provenance est exacte ; les incomplets restent des motifs documentés et mesurés (overlay occlusion, composite 4.68, split-table antd), jamais des violations.
- Le finding 4.14 est un résiduel produit nouveau de même nature que le `?rowId=` de v1 — à consolider au prochain cycle ; le wart associé (axe pinnée < règle standard) est un défaut de harnais, pas de falsification : les nombres livrés restent exacts sous la version qu'ils déclarent.
