# Verdict fixer v2 — cycle 35 karakeep

**Statut : travaux v2 exécutés et mesurés** — le verdict reste à l'auditeur v2. Feuille de route = `verdict-auditeur.md` (v1, PARTIAL) : F1 (vrai menu view-options masqué par race de sélecteur), F2 (16 occ vivantes hors-scope sur routes livrées), warts (compose sans ports publiés, `--strict` exit 1, eval « states:36 », 7 incomplets public non sondés, race sort-menu).

Toutes les mesures ci-dessous proviennent d'exécutions réelles sur **deux instances séparées** — aucun chiffre n'est repris des rapports v1 :

| Instance | Rôle | Port | Origine |
|---|---|---|---|
| vanilla | baseline élargie v2 | :3301 | `git clone` du clone f2 (uniquement les objets commités @75aeaaa4 — les modifs non commitées ne sont jamais transportées par clone local), own DATA_DIR, seed+login rejoués |
| patché | final v2 | :3300 | arbre de travail patché (patch.diff v2 = `git diff` complet, 72 fichiers), build standalone `next build --experimental-build-mode compile`, `node server.js` |
| meilisearch | commun | :33700 | binaire v1.41.0, master-key dédiée |
| chrome | commun | :33222 | `ghcr.io/karakeep-app/karakeep-chrome:release` |

axe-core **4.14.0** épinglé partout (`tools/package.json`, tracé dans chaque report/scope.json).

## Chiffres mesurés (exécutés)

| Rapport | Pages | Règles | Occurrences | Erreurs |
|---|---|---|---|---|
| `reports/baseline-auth` (vanilla :3301) | 39 | **19** | **484** | 0 |
| `reports/baseline-public` (vanilla :3301) | 7 | **6** | **38** | 0 |
| `reports/final-auth` (patché :3300) | 39 | **0** | **0** | 0 |
| `reports/final-public` (patché :3300) | 7 | **0** | **0** | 0 |
| `eval-final.json` | — | toutes résolues | **522 → 0** | exit 0, missing=[] |
| `verify.mjs` | — | — | **51 PASS / 0 FAIL** | exit 0 |
| sondes incomplets auth | — | — | 169 items : RESOLVED / N-A honnêtes | **0 CONFIRMED_VIOLATION** |
| sondes incomplets public | — | — | 12 items | **0 CONFIRMED_VIOLATION** |

Top baseline v2 auth : link-name 101, button-name 84, color-contrast 59, listitem 42, meta-viewport 39, aria-allowed-attr 33, aria-valid-attr-value 33, region 33… (par rapport à v1 : +aria-required-children du vrai menu, +button-name/h1 de /reader, +landmark/region des routes publiques, +link-name RSS, etc. — le recompte est **plus haut** que v1 (484 vs 485 nominal mais 5 règles de plus avec le scope élargi), ce qui est le signe attendu d'un scope plus complet).

## F1 — le vrai menu View Options est maintenant mesuré, des deux côtés

**Cause racine (confirmée en DOM live)** : les boutons View Options / Sort ne sont montés par `GlobalActions` qu'après le flip du store `inBookmarkGrid` — `header button`.first() ouvrait le menu profil ~50 % du temps. Les deux runs v1 (baseline ET final) ont donc scanné le menu profil sous le nom `view-options-menu`.

**Sélecteur réparé** (`tools/audit.mjs`) : `header button:has(svg.lucide-settings), header button[aria-label="View Options"]` — déterministe, jamais positionnel. Même traitement pour `sort-menu` : `aria-label="Sort"` + familles d'icônes `lucide-arrow-down-wide-narrow`/`arrow-up-narrow-wide`/`sort-*`/`list-filter` (l'icône réelle est arrow-down-wide-narrow ; la liste couvre les variantes de version). Chaque état laisse désormais une **`stateProof`** dans report.json — comptage de rôles visibles consigné au moment du scan.

**Preuves dans les rapports eux-mêmes** (stateProof de la page `view-options-menu`) :

- baseline vanilla : `{"menus":1,"radiogroups":0,"switches":3,"sliders":1}` + violation `aria-required-children` — **le vrai menu (role=menu) est bien ouvert et axe l'attrape** ;
- final patché : `{"menus":0,"radiogroups":2,"switches":3,"sliders":1}` + 0 violation — **le même sélecteur ouvre le Popover (dialog), slider et switches toujours présents, zéro role=menu**.

`aria-required-children` live sur le vrai widget : **1 règle violante en baseline → 0 en final** (mesuré, pas déduit).

**Fix source** (`apps/web/components/dashboard/ViewOptions.tsx`) : le menu est devenu un **Popover** (c'est un panneau de réglages, pas une liste d'actions) :

- `PopoverContent role="dialog" aria-label={t("view_options")}` ;
- les deux groupes single-select → `RadioGroupPrimitive.Root` (`role=radiogroup`, aria-label) — sémantique native des radios ;
- les 3 switches dans `div role="group"` aria-label, chacun lié à un `Label htmlFor` ;
- le slider de colonnes dans `role="group"` aria-label ;
- `forceMount` propagé pour que le contenu reste monté (hidden) — cohérent avec le traitement Popover du cycle.

## F2 — routes hors-scope intégrées et corrigées

**Scope élargi** (`tools/urls-public.txt` + `states.json`) :

- public +4 : `/check-email?email=…`, `/verify-email`, `/invite/token-inexistant-c35`, `/public/lists/<publicListId>` — la seed publie désormais la liste « veille » (`PATCH /api/v1/lists/:id {public:true}`, `publicListId` persisté dans seed-ids.json) ;
- auth états +2 : `reader-page` (`/reader/<bookmarkId>` seedé) et `public-list-page` (même route, vue authentifiée) ;
- la 404 `/public/lists/<id-inconnu>` n'est pas scannable par le runner (HTTP ≥ 400 = erreur de navigation, axe ne tourne pas) → couverte par une **sonde de contraste dédiée** dans `verify.mjs` §10 (mesurée : h1/p/icône ≥ 4.5:1).

**Fixes sources** :

- `check-email`, `verify-email`, `invite/[token]` : `<main>` + `<h1 className="sr-only">` (region + page-has-heading-one + landmark — les 3 occ par page de l'auditeur) ;
- `reader/[bookmarkId]` : h1 **toujours rendu** (« Reader View » tant que le tRPC charge, titre du bookmark ensuite — page-has-heading-one même pendant le chargement), aria-labels sur les 4 boutons icon-only (Close/Print/Highlights toggle avec aria-pressed/X), spinner sous `role="status"` ;
- `ReaderView` : `h3` « Content Unavailable » → `h2` (heading-order après le h1) ;
- `ReaderSettingsPopover` : trigger + 3 clear + 4 Minus/Plus nommés (clés i18n `actions.print/decrease/increase` ajoutées à `en/translation.json` — convention v1 : en seulement) ;
- `PublicListHeader` : lien RSS icon-only → `aria-label="RSS feed"` ; compteur « N bookmarks » + icône `text-gray-500` → `text-gray-600 dark:text-gray-400` (sonde : **4.41:1 → 6.90:1 mesuré**) ;
- `public/lists/[listId]/not-found.tsx` : icône + titres passés à gray-500/600 + variantes dark (≥4.5:1 des deux thèmes).

**Fix structurel additionnel trouvé en rejouant** : `aria-valid-attr-value` transitoire sur le `aria-controls` du combobox cmdk (search). Le portail Radix monte son contenu **un commit après** l'input → l'idref pend. Corrigé structurellement : la listbox vit dans le **même arbre React** que l'input (`div` absolue `hidden`, plus de `Popover`/`Portal` dans `SearchInput`). `useModalContainer()` résout en outre `#karakeep-modal-root` dès le premier rendu client (l'élément est dans le HTML SSR) — supprime la fenêtre de re-portail body→modal-root.

## Warts repris

| Wart | Statut |
|---|---|
| Compose du manifeste sans ports publiés | **Corrigé** — `manifest.json` documente que `docker compose … meilisearch chrome` ne publie aucun port hôte + recette verbatim avec `docker run -p`/binaire meili + ports réels de l'instance (:3300/:3301/:33700/:33222) |
| `--strict` exit 1 (.gitignore non haché) | **Corrigé** — `.gitignore` est dans la liste provenance ; `rehash-provenance.py --strict` = **exit 0** (40 empreintes, spot-check 3/3) |
| eval « states:36 » cosmétique | **Corrigé** — `eval-final.mjs` compte les états réels (filtre `(page)` sur les urls `state:`) : `states.final=15` dans eval-final.json |
| 7 incomplets public jamais sondés | **Corrigé** — `incomplete-probes.mjs --out` permet des sondes par rapport ; `reports/incomplete-probes-public.json` = 12 items (7 page-level + 5 nœuds), 0 CONFIRMED_VIOLATION |
| Race sort-menu `nth(1)` | **Corrigé** — sélecteur par aria-label/icône (voir F1) ; stateProof « items *First présents » dans les deux runs |

## Rejoués de bout en bout

- `verify.mjs` : **51 PASS / 0 FAIL** — incl. §8 popover view-options (switches/radiogroups/slider/dialog nommé + `aria-required-children` 0 occ live), §9 reader (1 h1, 0 bouton sans nom), §10 routes publiques + sonde 404. Fallback `bg-primary` ajouté : le token primaire se mesure sur `/settings/info` (aucun `.bg-primary` sur la grille bookmarks).
- `incomplete-probes.mjs` : auth 169 items + public 12 items, 0 CONFIRMED_VIOLATION (N-A honnêtes : idref vers popups montés à l'ouverture, contenu aria-hidden sous FocusScope, items générés hors page).
- `eval-final.mjs` : **exit 0** — 522→0, 0 état manquant, 0 erreur résiduelle.
- `login.mjs` : attend l'hydratation (networkidle) + retry borné ×3 — le clic pré-hydratation tombait en silence.
- `patch.diff` : régénéré depuis l'arbre patché vérifié (`git diff` complet, **72 fichiers**, `useModalContainer.ts` inclus via intent-to-add — le diff contient le nouveau fichier).
- `provenance.json` : re-hachée **en dernier** (`--strict` exit 0).
- `scope-compare.json` : refait pour v2 — ensembles de scénarios identiques après normalisation port+ids (vérifié par diff exacte des URLs).

## Ce qui reste à la charge de l'auditeur

- Rejeu indépendant du `patch.diff` v2 (72 fichiers) sur clone propre @75aeaaa4 ;
- Re-scan final sur ses propres ports — la preuve « vrai menu » est lue dans `stateProof`, pas dans le nom du scénario ;
- Le verdict v2 (PARTIAL/CONFIRMED) lui appartient — ce document rapporte les exécutions, pas une auto-notation.

## Limites honnêtes

- Les deux instances partagent meilisearch/chrome de la boucle (:33700/:33222) — l'auditeur doit utiliser ses propres ports (le manifeste documente la recette).
- Les ids de seed diffèrent entre vanilla et patché (instances re-seedées) — les rapports embarquent des ids distincts ; la comparaison de scope est fournie normalisée.
- Le run mobile-390 et theme-dark rejouent les états sur les mêmes URLs que v1 (+15 états nommés au total).
- `aria-required-children` = 0 occ mesuré **en direct** sur le widget ouvert — la couverture axe reste celle du runner (règles activées par défaut de 4.14.0).
