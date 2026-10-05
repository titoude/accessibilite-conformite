# Verdict auditeur — cycle 30 : nocodb

**Verdict : CONFIRMED** — le score axe est reproductible de bout en bout (baseline 10r/48 public exact après parité de seed, 20r auth identique ; final 0 violation / 0 erreur sur les deux scénarios, DB reprise ET conteneur frais ; install-build équivalent propre), le patch est sain (108 fichiers sources, 0 rejet, patch pnpm antd matérialisé dans node_modules et dans la build), l'outillage est réellement exécutable et ses assertions sont non vacues (verify 43/43, eval-final 26/26 rejoués intégralement sur mon instance), les 12 sondes d'incomplets sont mesurées à l'identique, et la provenance est véridique (43/43 sha256 exacts). Défauts de portabilité de l'outillage documentés ci-dessous — défauts de livraison, pas de falsification : les crashs sont bruyants (pas de faux PASS), et tous les nombres livrés se reproduisent après adaptation des identifiants.

- Auditeur : session Devin indépendante `devin-c9f24001bb074f6794cb9b718270093f`
- Produit : nocodb/nocodb @ `00ab4886b85063b4cdcb158f4999adca2c67b721` — image docker `nocodb/nocodb@sha256:27d2fd1467…` (pinée)
- Commit audité : `d7d35df` sur `devin/boucle-continue`
- Mes instances : vanilla :9080 (`nc-audit-vanilla`, ws `wftmzcw9`), patché :9081 (`nc-audit-patched`, ws `wxoxoo4p`, conteneur frais + DB fraîche + frontend rebuildé) — puis :9080 re-déployé avec ma build patchée pour le scénario « final sur DB reprise ».
- Méthode : rejeu intégral — clone vierge @00ab4886 + `git apply` (0 rejet, 108 fichiers +946/−141, conforme au claim), pipeline install-build rejoué (pnpm locked → `pnpm --filter=nocodb-sdk{,-v2} build` → re-install → `nuxt generate` → docker cp + index.html←200.html), signup/seed/urls via les outils livrés, auditCommands verbatim (ports décalés), verify/eval/probes entiers, provenance recalculée, patch lu, surfaces hors scope sondées.

## Rejeu vs livré — chiffres

| Axe | Livré | Rejeu auditeur | Δ |
|---|---|---|---|
| baseline-public | 10 règles / 48 occ / 7 inc | **10 règles / 48 occ / 7 inc** (9r/47 avant correction de mon seed — voir note survey) | **identique** |
| baseline-auth | 20 règles / 347 occ / 14 inc | **20 règles / 329 occ / 20 inc** | set de règles identique à 100 % ; occ ±1/page (Δ5 % = volume de seed) ; inc = même univers de nœuds, bucketing axe variable |
| final public (DB reprise) | 0v / 0e / 5 inc | **0v / 0e / 5 inc** (:9080 re-patché) | identique |
| final auth (DB reprise) | 0v / 0e / 7 inc | **0v / 0e / 8 inc** (:9080 re-patché) | même famille de nœuds occlus/borderline, bucketing axe ±1 |
| install-build public | 0v / 0e / 5 inc | **0v / 0e / 5 inc** (:9081 frais) | identique |
| install-build auth | 0v / 0e / 7 inc | **0v / 0e / 7 inc** (:9081 frais) | identique |
| verify.mjs | 43/43 | **43/43** | crash verbatim (IDs codés en dur) → PASS complets après adaptation |
| eval-final.mjs | 26/26 | **26/26** | idem |
| sondes incomplets | 12 nœuds décidés | **12 nœuds, mêmes cibles** | mesures concordantes (contrastes 4.68/4.87/7.78/1.42-occulté, th-cells headerOnly+siblingRows>0) |
| provenance.json | 43 fichiers | **43/43 sha256 exacts** | patch.diff = `4b74003e…` conforme à patch.diff.sha256 |
| patch.diff | 108 fichiers +946/−141 | **exact** (`git apply --numstat`) | 0 rejet ; sources uniquement (.vue/.ts/.scss/.css/.patch/pnpm-lock/package.json/components.d.ts + nouveau `usePageH1.ts`), aucun bundle compilé édité |

Note seed : ma forme « survey » recréée manquait la description tiptap → `aria-input-field-name` absent (9r/47) ; après `PATCH subheading`, la violation revient → **48 occ / 10 règles exactement**. Les claims du worker incluent donc un détail de seed non documenté (le texte « Questions une par une. » dans la description du formulaire survey porte une violation).

## Patch — revue falsification

- **patch pnpm `ant-design-vue@3.2.20` : réel et appliqué.** Vérifié dans le `.pnpm` store de ma build (`ant-design-vue@3.2.20_patch_hash=a98f4bcff5a1…`) : `vc-tooltip/src/Content.js` porte `aria-live:"polite"`, `vc-select/Selector/Input.js` porte `aria-expanded: open?'true':'false'`, `menu/src/SubMenu.js` porte `role:"menuitem"`, `vc-dialog/Content.js` rend les sentinelles `tabindex:0` **sans** `aria-hidden` (le fix exact). Les assertions verify qui les exercent PASSENT (aria-controls sous-menus résolus, sentinelle focusable 0, select combobox expanded+list résolus).
- **`iconUtils.ts scopeSvgIds` : vrai correctif** (remapping id par `<svg>` avec compteur, réécrit url(#)/href/aria-*) — cohérent avec la disparition de duplicate-id-aria.
- **Api.ts +285 lignes : bruit de scope, pas falsification** — expansion de types `FormFieldValidatorV3Type` (validateurs EE, commentaires doc). Aucune incidence a11y ni runtime ; livrable idéalement à part.
- Aucune ligne minifiée/aucun artefact `.output`/`dist` dans le diff — la leçon searxng est respectée.

## Défauts de livraison mesurés (outillage / doc)

1. **`verify.mjs`, `eval-final.mjs`, `incomplete-probes.mjs` codent les IDs du worker en dur** (`NC_WS/NC_BASE/NC_TABLE/NC_GRID/NC_KANBAN/NC_FORM` lignes ~21-38 + uuid de formulaire `540b143b…` en dur à verify:126 / eval-final:233). Rejeu verbatim sur instance fraîche : **crash déterministe non rattrapé** (verify → `waitForSelector` timeout sur la forme publique inexistante ; eval → timeout sur le bouton Share d'une page redirigée). `audit.mjs` est correctement paramétrable (env `NC_*`), les trois autres non. Après adaptation des constantes : exécution intégrale et verte. Défaut de portabilité réel ; heureusement bruyant.
2. **La commande de levée du gate onboarding documentée dans le manifest (`PATCH /api/v1/user/profile {"attrs":{"is_new_user":false}}`) no-op silencieusement** : 200 retourné, `is_new_user` reste 1 (le backend applique `extractProps` sur le corps brut, pas `body.attrs`). Payload qui marche : `{"is_new_user":false}` (vérifié : 1→0). Sans ça, toute la baseline auth redirige vers `?continueAfterOnboardingFlow` et mesure du vide. La manipulation correcte n'est PAS dans `auditCommands` — le install-build.log montre que le worker a buté sur le même mur et l'a contourné sans consigner la commande exacte.
3. **`tools/urls-auth.txt` est un artefact stale** : il liste `/wd10yk1f/settings/members` alors que le rapport baseline livré enregistre la page demandée `/wd10yk1f/members` (le fichier fourni à l'exécution avait été corrigé, pas celui commité). De plus la route canonique **bascule selon la build** : sur mon vanilla :9080 `settings/members` → `members` (erreur « document final diffère »), sur mon patché :9081 c'est `members` → `settings/members`. L'outil protège correctement en marquant ERREUR toute redirection de pathname.
4. **`gen-urls.sh` émet le même uuid pour la ligne forme et la ligne `/survey`** : la parité de scope exige une vue forme dédiée en `surveyMode` (je l'ai créée via POST /forms + share + PATCH meta `surveyMode:true`, puis subheading). Commande absente du manifest.
5. **eval-final sections B/C : PASS potentiellement vacues** — les assertions « aucun id dupliqué » / « pas de saut de titre » ne vérifient pas que le document chargé est bien la page visée ; en rejeu verbatim elles PASSaient sur des pages redirigées avant le crash plus bas. L'instrumentation est bonne sur le bon document, fragile sans garde d'URL finale (le garde-fou existe dans audit.mjs, pas dans eval-final.mjs).
6. Mineur : `signup.mjs` hardcode :8080 (mais `signup-install.mjs` prend `<baseUrl>` — variante portable présente).

## Findings résiduels hors axe (mesurés sur la build patchée :9081)

Surfaces **hors scope livré** sondées par mes soins (règles axe des familles corrigées) :

- **Modale d'édition d'enregistrement `?rowId=` — NON couverte par states.json, 4 règles résiduelles** : `aria-dialog-name` (`.ant-modal-wrap.nc-modal-wrapper` sans nom accessible), `aria-input-field-name` (éditeur tiptap des commentaires sans nom), `button-name` ×3 (`.nc-expand-form-more-actions`, `.nc-expand-form-close-btn`, bouton primaire submit anonymes), `label` (textarea `!py-1` sans label). Même famille de défauts que ceux corrigés ailleurs — surface manquée.
- `/account/tokens/new` : `label` ×1 ; `/admin/?tab=settings` : `label` ×2 — champs non nommés résiduels.
- Vue **Calendar** jamais créée ni scannée (scope parité avec le worker — seed.sh ne la crée pas), ni expanded-record, ni autres onglets `?settings=` (`integrations`, `data-sources` : propres, mesurés).
- Bruit : `429` du MetaApiLimiterGuard sous charge de scan — cosmétique, pas une régression du patch.
- Aucun pageerror JS ni erreur console fonctionnelle observée sur les surfaces sondées.

## Ce que le verdict signifie

- **CONFIRMED** parce que les quatre critères tiennent : score axe reproduit (baseline à l'occurrence près après parité seed, final 0/0 sur les deux scénarios de déploiement), patch sain (sources + pnpm patch vérifié jusqu'au conteneur), outillage exécutable et mesurant réellement (43/43, 26/26, 12 sondes — rejoués entièrement, assertions sur le DOM vivant), claims véridiques (chaque nombre de results.json retrouvé ou expliqué).
- Les défauts §défauts sont des défauts de portabilité/documentation, pas des claims faux : ils se signalent par des crashs explicites, jamais par des PASS inventés. Ils relèvent toutefois du même motif que syncthing (« auditCommands verbatim » non tenable sans édition) — recommandé pour un vrai « verbatim » : passer `NC_*` en env dans verify/eval/probes (comme audit.mjs), documenter le payload `{"is_new_user":false}` et la création de la vue survey dans le manifest, régénérer `urls-auth.txt`.
- Résiduel produit : la modale d'édition d'enregistrement est un miss de scope réel (4 règles) — à intégrer à states.json au prochain cycle nocodb.
