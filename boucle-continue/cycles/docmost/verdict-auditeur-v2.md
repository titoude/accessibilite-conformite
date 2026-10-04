# Verdict auditeur v2 — cycle 16 (docmost)

Auditeur : session indépendante (rejoue complet sur instance propre recréée de
zéro : docker `pg-docmost` postgres:16 :5435 + `redis-docmost` redis:7 :6382,
`.env` refait (BETA_PUBLIC_SPACES=true, PORT=3010), migrations kysely
`pnpm --filter ./apps/server migration:latest` rejouées, `pnpm run server:dev`
:3010, vite patché `--port 5175 --strictPort` PUIS worktree vanilla @2e0538c7
rebuildé sur le même port pour la baseline, seed rejoué par `tools/seed.mjs`).

## Verdict : **CONFIRMED**

Toutes les affirmations de la v2 sont reproduites à l'identique, mesure pour
mesure, sur une instance neuve sans réutilisation de la DB du worker :
provenance 24/24, patch qui s'applique et builde proprement, seed littérale qui
produit un doc public réellement rendu, baseline vanilla 50 occ. avec la
distribution règle-par-règle exacte (doc rendu : aria-allowed-attr×1 +
aria-input-field-name×2 + color-contrast×3), final 0 violation sur les 16
scénarios auth + les publics, verify 25/25, eval-final 10/10 dont le check
modale prouvé non-vacuole par mutant réel (modale supprimée → FAIL),
scopeHash/statesHash identiques livrés↔rejoués↔recomputés. Les majors M1+M2 et
les 8 minors m1-m8 sont tous corrigés de manière vérifiable.

## Rejoue point par point

| # | Point | Résultat |
|---|-------|----------|
| 1 | provenance.json | **24/24 sha256 recalculés identiques** (manifest, results, states, scope-compare, patch-v2.diff+sha256, 8 reports v2, 6 tools). Exact. |
| 2 | patch-v2.diff sur clone propre @2e0538c7 | `git apply --check` OK puis apply OK : **35 fichiers, +239/−99, 0 untracked requis** (v1 nécessitait rien de plus non plus). Cumulatif v1+v2 — delta v2 = link-view.tsx, readonly-page-editor.tsx, docs-theme.ts + retouches drawio-view.tsx / docs.module.css. |
| 3 | install-build rejoué | `pnpm install --frozen-lockfile` (pnpm 11.28.2) + `pnpm --filter @docmost/editor-ext build` + `tsc --noEmit` (0 erreur) + `vite build` (1.97 s) — **tout PASS** sur le clone patché. Commande manifeste tracée. |
| 4 | M1 — seed littérale + doc rendu | **Corrigé et prouvé.** `tools/seed.mjs` rejoué sur stack neuve : setup workspace → allowPublicSpaces → `POST /api/pages/create` (format markdown, titre « Test page a11y », corps « # Guide de démarrage » + sections + lien https://docmost.com) → `UPDATE pages SET slug_id='YE3rIig7Vn'` → `public-spaces/publish` → probe page-info (« titre "Test page a11y", contenu 1316 chars, lien externe rendu »). DOM live `/docs/general/YE3rIig7Vn` : **textLen=438, 4 headings** (H1 page + H1 « Guide de démarrage » + H2×2), `a[href=https://docmost.com]` présent, tocLink rendu. Axe final : **0 violation** sur le doc rendu ET sur les 16 scénarios auth (12 urls + 4 états) ; publics : 0 viol sur 3 pages scannées + 1 erreur `/p/docmost`→login (par design, exit 2). |
| 5 | Baseline vanilla sur le doc | **Exactement comme livré** : même backend/seed, worktree vanilla @2e0538c7 sur :5175 → doc = `aria-allowed-attr×1` (linkWrapper `aria-haspopup` sur span nu) + `aria-input-field-name×2` (tiptap role=textbox non nommés) + `color-contrast×3` (searchKbd, texte du lien, tocLink actif). Totaux vanilla : app **13 règles / 41 occ. / 8 inc.** ; public **5 règles / 9 occ. / 2 inc. / 1 err** — **distribution identique nœud par nœud** au `baseline-v2-*` livré. |
| 6 | M2 — drawio-view.tsx | Patch : `aria-label` retiré de `Modal.Root`, `<VisuallyHidden><Modal.Title>{t("Diagram editor")}</Modal.Title></VisuallyHidden>` dans `Modal.Content`. Probe DOM live (page drawio créée, dbl-clic carte → modale) : `role=dialog`, `aria-modal=true`, **`aria-labelledby=mantine-…-title` → « Diagram editor »** (titre caché visuellement), montée dans `#a11y-popup-layer`, aucun aria-label sur le wrapper. **Régression M2 corrigée.** (Un second `role=dialog` 0×0 — coquille « Import pages » montée fermée, pattern Mantine amont préexistant, invisible pour axe — non lié au patch.) |
| 7 | m1-m8 | **Tous vérifiés** — détail ci-dessous. |
| 8 | scope.json / states.json | `states.json.statesHash` = `0e63297d…` = `statesHash` des 4 scope.json v2 = **recomputé indépendamment** depuis la map STATES de audit.mjs v6 livré (setup.toString() + URL par état). `scopeHash` recomputé depuis les listes de scénarios = `6b9d1726…` (app) / `51648b64…` (public) — identique livré↔rejeu↔baseline↔final. `scope.json` porte désormais `waitMs=3500`, `waitFor`, `testEngine {axe-core 4.13.0}` (m7 corrigé). |

## m1-m8 (minors v1) — statut v2

- **m1** (« verify: 19/19 » sous-déclaré) — `verify.mjs` v2 émet **25 ok()** (18 hors boucle + boucle h1 ×7), tous PASS en rejeu ; results.json déclare « 25/25 » — le compte est juste. ✓
- **m2** (exit ambigu) — `results.json.final.exit` explicite : « app=0 ; public=2 par design ». Mesuré : run app exit 0, run public exit 2 (erreur `/p/docmost`→`/login?redirect=…`, identique baseline/final). ✓
- **m3** (incomplets non décidés) — `decisionsIncomplets` couvre désormais les 3 incomplets du final : aria-valid-attr-value /home[user-menu] (dropdown lazy-mount, preuve verify « tab contrôle un tabpanel monté » — rejoué PASS) + color-contrast /login + /forgot-password (wordmark `<p>Docmost</p>` « background indéterminé »). J'ai remesuré moi-même le wordmark : fg `rgb(0,0,0)` sur bg `rgb(255,255,255)` = **21.00:1** — N-A fondée. ✓
- **m4** (auditCommands incomplets) — `manifest.auditCommands[]` liste désormais `login.mjs`, `seed.mjs`, baseline app+public, final app+public, verify, eval-final — verbatim rejouables (ce sont les commandes que j'ai exécutées). Migrations kysely et `BETA_PUBLIC_SPACES=true` documentés dans `boot.migrations`/`boot.env` + en-tête de pré-requis de `seed.mjs`. ✓ (réserve cosmétique : la commande de migration vit dans `boot.migrations`, pas dans le tableau auditCommands — tout est néanmoins reproductible.)
- **m5** (statesHash non reproductible) — `states.json` régénéré : `0e63297d…` recomputé depuis les sources livrées ✓.
- **m6** (check modale vacuole) — `eval-final.mjs` exige `found && titleText && insideLayer`. **Test mutant réel** : `<MemoizedHistoryModal>` neutralisé dans `page.tsx` → le check échoue `{"found":false,...}`, exit 1 ; revert → PASS 10/10. ✓
- **m7** (scope.json sans waits/versions) — `waitMs`, `waitFor`, `testEngine{name,version}`, `runnerVersion "audit.mjs v6"` présents dans les scope.json v2. ✓
- **m8** (scope baseline≠final non dérivable) — les 4 scope.json v2 partagent scopeHash/statesHash identiques baseline↔final, scénarios audités énumérés par statut — le delta est dérivable des artefacts. ✓ (réserve : `scope-compare.json` décrit encore les fichiers v1 — artefact historique non régénéré ; la claim qu'il soutient est vraie sur les artefacts v2, vérifiée directement.)

## Mesures re-dérivées (même périmètre, même seed, même axe-core 4.13.0, même port :5175)

| Run | Vanilla (rejeu auditeur) | Patché (rejeu auditeur) | Livré v2 |
|---|---|---|---|
| app (12 urls + 4 états) | 13 règles / 41 occ. / 8 inc. | **0 occ. / 1 inc.** | 0 occ. / 1 inc. |
| public (4 urls) | 5 règles / 9 occ. / 2 inc. / 1 err | **0 occ. / 2 inc. / 1 err** | 0 occ. / 2 inc. / 1 err |
| doc public rendu | aria-allowed-attr×1 + aria-input-field-name×2 + color-contrast×3 | **0** | 0 |
| verify.mjs | — | **25/25 PASS** | « 25/25 » |
| eval-final.mjs | — | **10/10 PASS** (dont modale found+titleText+insideLayer) | « 10/10 » |
| mutant modale supprimée | — | **FAIL attendu obtenu** (exit 1) | — |

## Triches recherchées

Patch v2 lu en entier (35 fichiers, delta v1→v2 isolé et relu) : aucun
`display:none`/`opacity:0`/retrait DOM ; le seul `aria-hidden` ajouté est sur
l'avatar décoratif dans un `UnstyledButton` nommé (correct). Les corrections
sont sémantiques (role=textbox + noms calculés, Popover.Target sur `<a>`,
Modal.Title caché, variables de contraste) — mesurées dans le DOM live, pas
seulement dans le diff. Waits agnostiques (`waitAppMounted` = #root peuplé +
déclencheurs réels) : la baseline vanilla tourne sous les mêmes STATES — pas
d'asymétrie exploitable. `/p/docmost` reste en erreur honnête (route privée
non partagée → login), non supprimée du périmètre.

## Réserves (n'entament pas le verdict)

- `scope-compare.json` référence les artefacts v1 (statesHash `f7fb50bc`) —
  historique conservé, cohérent mais non régénéré pour v2 ; la dérivabilité
  scope baseline↔final est prouvée directement par les scope.json v2.
- `boot.migrations` mentionne « aucune exécutée pour ce cycle » (DB persistante
  du worker) alors que la commande figure dans les pré-requis de seed.mjs —
  formulation fidèle au déroulé worker, rejeu auditeur = migrations rejouées.
- Le shell « Import pages » monte un `role=dialog` 0×0 sans nom (pattern Mantine
  amont, présent aussi en vanilla) — hors périmètre, non introduit.

CONFIRMED = reproductibilité du score axe + rejeu indépendant, pas conformité
WCAG complète.
