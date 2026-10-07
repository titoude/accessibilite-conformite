# Verdict ré-auditeur v2 — cycle 35 karakeep

**Verdict : CONFIRMED** — le rejeu indépendant reproduit le claim central « final 0 violation » : sur MES instances (patchée :3400, vanilla :3401), la chaîne complète rejoue : clone @SHA + `patch.diff` 72 fichiers `git apply --check` 0 rejet → build standalone → **46 scénarios (39 auth + 7 public) : 0 viol / 0 err** ; verify **51/51** ; sondes incomplets **169 + 12 items → 0 CONFIRMED** ; eval **514→0** exit 0 ; provenance **42/42 strict exit 0**. La race F1 est morte (prouvée des deux côtés) et les routes F2 sont mesurées pixel-vrai. Ceci n'affirme ni n'infirme la conformité WCAG complète : périmètre axe + états listés seulement.

Auditeur : session indépendante (devin-6d9604bd…, spawnée par la session parente de boucle), VM propre, clones propres, ports/db/out propres — **zéro réutilisation des artefacts du fixer**.

## Méthode de rejeu (indépendante)

- Clone frais `github.com/karakeep-app/karakeep` @ `75aeaaa4eb71b1d3143d7bdc6b88c66fbcfb5fea`, `git apply` du `patch.diff` livré → **0 rejet, 72 fichiers** (+747/−445 ; `useModalContainer.ts` présent via intent-to-add).
- Clone vanilla = clone local du clone patché (le clone local ne transporte que les objets commités → patch absent, `git status` vierge). Vanilla sert le produit **pur @SHA**.
- Recette manifeste adaptée à mes chemins : `corepack pnpm@11.2.1 install` → `packages/db migrate.ts` → `apps/workers migrateQueue.ts` → `next build --experimental-build-mode compile` → `public` + `.next/static` copiés dans `standalone` → `env -i … PORT=3400 node .next/standalone/apps/web/server.js` (DATA_DIR propre par instance).
- `seed.mjs` + `login.mjs` rejoués sur les DEUX instances → `seed-ids.json` + `auth.json` régénérés (mes ids : bookmarkLink `uo5aegsb…`, publicList `newr8kzi…`).
- `audit.mjs` v6, `verify.mjs`, `incomplete-probes.mjs`, `eval-final.mjs`, `rehash-provenance.py --strict` rejoués tels quels ; sondes ad-hoc Playwright + axe-core **4.14.0** pour F1, F2 et la chasse.
- Pas de meilisearch ni karakeep-chrome : plugins optionnels (MEILI_ADDR), parité avec le setup fixer (logs plugins : Filesystem/Liteque/In-Memory uniquement).

## Résultats du rejeu

| Étape | Livré (fixer v2) | Rejoué (ré-auditeur) | Verdict |
|---|---|---|---|
| patch.diff apply | 72 f, 0 rejet | **72 f, 0 rejet** | OK |
| baseline auth vanilla | 19 règles / 484 occ | **19 règles / 476 occ**, 0 err — Δ expliquée ci-dessous | OK (dérive honnête) |
| baseline public vanilla | 6 règles / 38 occ | **6 règles / 38 occ** — règles ET occ identiques | OK exact |
| final auth (39 sc.) | 0 viol / 0 err / 169 inc-items | **0 viol / 0 err / 169 inc-items** (24 routes + 15 états) | OK |
| final public (7 sc.) | 0 viol / 0 err / 12 inc-items | **0 viol / 0 err / 12 inc-items** | OK |
| verify.mjs | 51/51 | **51/51** sur MES rapports rejoués (§8 popover, §9 reader, §10 public+404 inclus) | OK |
| sondes incomplets | 169 auth + 12 pub → 0 CONFIRMED | **169 + 12 → 0 CONFIRMED** (RESOLVED/N-A documentés) | OK |
| eval-final.mjs | exit 0, 522→0 | exit 0, **514→0** (mon baseline), missing_states=[], unresolved_rules=[], 0 err | OK |
| install-build | standalone :3300 = cible des final-* | équivalent : MON build standalone :3400 ISSU du clone+apply rejoué = cible de mes final-* 0/0 | OK |
| provenance | 42 emp., strict exit 0 | **42/42 sha256 valides** (vérifiés par moi), `.gitignore` listé, `--strict` **exit 0**, réécriture idempotente (diff nul → re-haché en dernier confirmé) | OK |
| axe-core 4.14.0 | épinglé | installé et utilisé 4.14.0 partout | OK |

## F1 — race morte, mesurée des deux côtés ×5

La correction repose sur trois verrous que j'ai chacun éprouvés :

1. **Sélecteurs déterministes** : `viewOptionsTrigger` = `header button:has(svg.lucide-settings)` puis fallback `aria-label="View Options"` — fini le `header button.first()` racé. Mon audit rejoué ouvre le vrai menu **à chaque run** (stateProof persisté dans le rapport final).
2. **stateProof dans le rapport** : mon `rj-final-auth` contient `"view-options {\"menus\":0,\"radiogroups\":2,\"switches\":3,\"sliders\":1}"` et `"sort-menu: items *First présents"` — les deux assertions exigées, mesurées sur MON run.
3. **Refonte composant** : `ViewOptions.tsx` DropdownMenu→Popover (`role=dialog aria-label="View Options"`), 2× `RadioGroupPrimitive` (view/sort), switches+slider sous `role=group`.

Mon propre script ×5 recharges distinctes, DOM réel + axe complet :

| Instance | stateProof DOM | aria-required-children |
|---|---|---|
| **vanilla :3401** | `{menus:1, radiogroups:0, switches:3, sliders:1}` | **CRITICAL ×1 — 5/5** (switch×3 + slider enfants directs du menu) |
| **patchée :3400** | `{menus:0, radiogroups:2, switches:3, sliders:1}` | **0 — 5/5** |

DOM patché vérifié à la main : `[role=dialog]` nommé « View Options », portalé dans `#karakeep-modal-root`, enfants = radiogroup×2 + group×2 (switches/slider) + switch×3 + slider×1 — **aucun** role=menu nulle part. Plus de race possible : le déclencheur est unique et stable.

**Honnêteté du baseline** : v1=485 / v2 fixer=484 / moi=476 — le même jeu de **19 règles** des deux côtés ; deltas par règle entre fixer et moi : `button-name −6`, `target-size −6`, `color-contrast +4` (comptages de contenu, seeds/items différents) ; `aria-required-children=1` présent dans LES deux baselines v2 → le vrai menu est enfin mesuré (v1 ne l'avait jamais scanné : il mesurait le menu profil). La différence 484↔476 est de la dérive de comptage, pas des violations cachées — le claim est honnête.

## F2 — routes intégrées, mesurées pixel-vrai par moi

| Route | Mesure auditeur (patchée :3400) |
|---|---|
| `/reader/[bookmarkId]` | 200, h1 **inconditionnel** (« Accessibility | MDN » au chargement), 0 bouton sans nom (header = Close / Print / Reader Settings / Highlights — tous `aria-label`), H2 « Content Unavailable » avant h1 ? non : ordre des titres correct |
| `/check-email`, `/verify-email`, `/invite/[token]` | 200 chacune, `<main>` + `<h1 class="sr-only">` présents — axe 0 viol |
| `/public/lists/[seed]` | 200, RSS `aria-label="RSS feed"`, compteur « 2 bookmarks » **fg rgb(75,85,99) / bg rgb(241,245,249) = 6.90:1 mesuré** (claim 4.41→6.90 confirmé au pixel) |
| `/public/lists/[inconnu]` | 404 → page not-found avec main+h1, p 6.90:1 — couverte par sonde verify §10 (manifeste l'explicite : HTTP≥400 non scannable) |

Chaque revendication F2 est vraie, mesurée par moi sur mon instance — pas lue dans les rapports livrés.

## Chasse (énumération complète app-router)

**DropdownMenu à enfants non-menuitem** : 7 usages passés au crible. Après le fix ViewOptions, un seul résidu **axe-muet** : `ProfileOptions.tsx` — le bloc avatar `<div class="flex gap-2">` (nom+email, role générique) est enfant DIRECT de `role=menu` (mesuré : 14 enfants = 9 menuitem + 4 role=none + **1 générique**). axe ne le flague pas (getOwnedRoles exclut generic/none) mais c'est la même famille ARIA que F1 → **wart W1 résiduel** : le fixer a patché ce fichier (label trigger + contraste email) sans traiter l'enfant générique. Non bloquant pour le verdict (périmètre axe) mais à corriger au prochain cycle.

**Routes non couvertes par les 46 scénarios** — énumération exhaustive, mesurées par moi sur l'instance patchée : `/` (→dashboard), `/logout` (→signin), `/admin` index (→overview), `/dashboard/feeds/[id]`, `/settings/subscription` (→info), `/settings/import/[sessionId]`, `/api/[[...route]]`, `/.well-known/*` — **toutes 200 + 0 viol** (les sous-pages admin ET leurs cibles étaient déjà dans les 24 pages du scan). Aucune violation de classe F2 subsistante.

**useModalContainer sync-init — correct** : l'initialiseur paresseux lit `document.getElementById(MODAL_ROOT_ID)` au 1er rendu client — pendant l'hydratation le div SSR est déjà dans le document → container défini d'emblée, **pas** de flip undefined→élément qui re-portalerait les overlays forceMount ni ne laisserait pendre `aria-controls`. L'`useEffect` n'est qu'un filet pour le montage client-side (commit avant lecture). Code = commentaire, et le comportement mesuré le confirme (0 `aria-valid-attr-value` sur les portals dans le final).

**SearchInput dé-portalé — mesuré** : vanilla :3401 → `input[role=combobox] aria-controls="radix-…"` pointe vers un élément **absent** quand la liste est fermée (IDREF pendant ; axe `aria-valid-attr-value` l'a flagué dans mon baseline : cibles `div[aria-controls]`, `a[aria-controls]`). Patché :3400 → la listbox est montée `hidden` dans le même arbre que l'input, `aria-controls` **résout** (targetExists vrai). Fix réel, pas cosmétique. Wart mineur W2 : `aria-expanded="true"` persistant avec listbox `[hidden]` — axe-muet, nuance AT acceptable.

**Mobile 390px** : pas de drawer hamburger dans karakeep (la nav est un `aside` horizontal `overflow-x-auto`, toujours visible) — l'état `mobile-390` couvre le layout responsive ; mesuré par moi : boutons header/cartes tous nommés, **axe 0 viol**.

## Warts résiduels (non bloquants)

- **W1** (ci-dessus) : bloc avatar générique enfant direct de `role=menu` dans ProfileOptions — axe-muet, même famille que F1.
- **W2** : combobox cmdk `aria-expanded=true` + listbox `[hidden]` (quirk cmdk, axe-muet).
- **W3** : le manifeste dit « chaque état laisse une preuve DOM stateProof » — en réalité **6/15** états émettent une preuve (view-options, sort-menu, profile-menu, new-list-dialog, reader, public-list) ; les autres sont couverts par verify.mjs. Surestime documentaire, non fonctionnelle.
- **W4** : flake axe `color-contrast` sur fade-in Radix (labels popover mesurés à ~75% opacité → faux 3.89:1) — `settleAnimations()` du harnais l'élimine : mes runs ×5 à 0 viol confirment. Artefact connu et géré.

## Conclusion

Tous les claims v2 se rejouent de bout en bout sur mon infrastructure : 46 scénarios à 0 viol/0 err, baseline vanilla cohérente (19r, dérive de comptage expliquée), F1 racine-causée et prouvée des deux côtés, F2 pixel-vrai, verify 51/51, sondes 0 CONFIRMED, eval exit 0, provenance 42/42 strict propre. Les warts restants sont axe-muets ou documentaires — aucun ne casse la reproductibilité.

**CONFIRMED** — cycle 35 karakeep : fixer v2 validé par rejeu indépendant.

---
*Ré-audit v2 — session devin-6d9604bde2a94e01846529a13d8f3477 — instances :3400 (patchée) / :3401 (vanilla), axe-core 4.14.0, karakeep @75aeaaa4*
