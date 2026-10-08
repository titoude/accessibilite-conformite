# Cycle 44 — verdict fixer v3 (mealie @06ccc2b1)

Rôle : fermer le wart W5 (slug i18n rendu — leçon 43) et le wart doc du
verdict auditeur v2 `61897d1`, sans casser le 0-violation confirmé. Toutes
les mesures ci-dessous sont **live**, rejouées par le fixer sur ses propres
instances Docker : `:8554` = upstream+patch v3 (image `mealie-v3:patched`),
`:8544` = vanilla @06ccc2b1 (image `mealie-v3:vanilla`).

## W5 — `$t('language-dialog.select-language')` rend le slug brut

Le patch ajoutait `:label="$t('language-dialog.select-language')"` sur
l'autocomplete de `frontend/app/components/global/LanguageDialog.vue`, mais
cette clé n'existe pas dans `en-US.json` : le dialog rendait le texte brut
`language-dialog.select-language`. axe ne voit rien — c'est exactement la
leçon 43.

Fix retenu : pointer la clé amont existante
`$t('data-pages.select-language')` (« Select Language »), qui est déjà
l'idiome upstream pour cet autocomplete (`units.vue:72`, `foods.vue:82`).
Aucune clé ajoutée, aucun fichier de locale touché (AGENTS.md : seul en-US
est modifiable, les autres locales passent par Crowdin — on n'en a même pas
eu besoin).

Fix latent joint : dans `RecipeLastMade.vue`, le fallback
`childRecipe.name || $t('recipe.recipe')` pointait une clé inexistante —
corrigé en `$t('general.recipe')` (« Recipe »), clé amont pré-existante.

Preuve live : check `G2` — le label rendu par le dialog ouvert est
exactement `Select Language` (et ne matche pas la regex slug). Capture
`proof-language-dialog.png`. Grep du dist : **0 occurrence** de
`language-dialog.select-language` dans `_nuxt/*.js` ;
`data-pages.select-language` et `general.recipe` présentes.

## Sonde anti-slug — leçon 43 rendue exécutable

Deux ajouts à `verify.mjs` (28 → 30 checks) :

- `sweepSlugs()` balaie après chaque surface visitée les attributs de nom
  introduits par le patch (`aria-label`, `title`, `placeholder`, `alt`,
  `label`) ainsi que le texte des `label`, `.v-label`, `.v-messages` et
  `legend`. Toute valeur matchant `^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$` est un
  contrevenant (extensions de fichiers, domaines et versions exclus).
- `N1` : `slugOffenders.length === 0` en fin de run, sinon FAIL **nommé**
  listant chaque contrevenant (surface, élément, valeur).

## Grep complet — i18n-coherence.mjs

Nouvel outil `tools/i18n-coherence.mjs` : extrait toutes les clés
`$t('…')` / `$tc('…')` introduites par le patch (lignes `+`) et vérifie que
chacune résout dans `frontend/app/lang/messages/en-US.json` de l'arbre
patché (le patch ajoute lui-même des clés amont-série — le check se fait
donc sur l'arbre patché, pas le clone vierge).

**Résultat : 47/47 clés résolues, 0 manquante.** Un slug restant = FAIL
(le script sort exit 1 en nommant la clé).

## Sabotage — le check mord

Renommage de la clé `select-language` → `select-language-sabote` dans les
3 chunks EN du dist (`C8XODPeO.js`, `CG7Jukra.js`, `rT7bMurJ.js`), puis
rejeu de verify.mjs : **28/30, exactement 2 FAIL nommés** :

- `FAIL [G2]` — `labelText: "data-pages.select-language"` : le slug s'affiche
  dans le dialog, le mécanisme exact de W5 est reproduit live.
- `FAIL [N1]` — les contrevenants sont listés nommément.

Clé restaurée ensuite ; rejeu = 30/30.

## Wart doc — compte des routes

`manifest.json` : « 40 routes auth » → **41** (`urls-auth.txt` = 41 lignes
réelles ; 41 urls + 10 états = 51 scénarios auth).
Prose publique recalée sur le fichier réel : 4 routes (`/login`,
`/forgot-password`, `/register`, recette partagée shareToken) + état
`shared-recipe-menu` = 5 scénarios publics.

## Rejeu complet

| mesure | :8554 patché v3 | :8544 vanilla |
|---|---|---|
| axe auth (51 scénarios) | **0 règle, 0 occurrence**, 1440 inc | — |
| axe public (5 scénarios) | **0 règle, 0 occurrence**, 64 inc | — |
| verify.mjs | **30/30 PASS** | **17 FAIL** (nommés : B1–B4, C1, D1, F1, G1, **G2 label vide amont**, H1–H2, M3–M4, I1, J1, M5, L1 ; N1 PASS amont — pas de slug upstream) |
| eval-final.mjs | **26/26 PASS** | **2 FAIL** (C1 clavier, H2 partage — attendus) |
| i18n-coherence | **47/47 clés résolues** | — |

Discrimination confirmée : sur vanilla, G2 échoue avec `labelText: ""`
(l'autocomplete n'a pas de `:label` du tout amont) ; sur le dist saboté,
G2 échoue avec le slug ; sur le patch v3, G2 passe avec le texte réel.

## Artefacts régénérés

- `patch.diff` : `git add -N` (app.vue, error.vue) + `git diff` depuis
  l'arbre **vérifié** ; `git apply --check` **0 rejet** sur worktree
  vierge @06ccc2b1 ; `diff -rq frontend/` patch→arbre **identique** à
  l'arbre vérifié ; **114 fichiers, +504/−206** ; sha256
  `9ea64659c12a527e4cf9148ccb6ccd8e8f7fedfc448646dd191a4e9c1e3c0e76`
  (sidecar `patch.diff.sha256` régénéré).
- `tools/verify.mjs` : +G2 +N1 + sweeps (30 checks).
- `tools/i18n-coherence.mjs` : nouveau.
- `tools/seed-env.json`, `tools/urls-auth.txt`, `tools/urls-public.txt` :
  régénérés sur l'instance patchée :8554 (shareToken `2f5743f1…`).
- `manifest.json` / `results.json` : compte 41 routes, bloc `fixer_v3`.
- `reports/fixer-v3-auth` + `reports/fixer-v3-public` : résultats du
  re-scan (scopeHash `f3c5ce73…` / `c52ac056…`).
- `provenance.json` : re-hachée `--strict` en dernier.
