# Cycle 44 — verdict auditeur v3 (mealie @06ccc2b1)

Rôle : rejouer **en zéro confiance** les claims du fixer v3 (fermeture du
wart W5 + sonde anti-slug leçon 43 exécutable) — mes instances, mes ports
(:87xx), mes données, mon seed.

Verdict : **CONFIRMED** — W5 fermé et prouvé discriminant sur les 3 états,
tous les chiffres produits reproduisent. **1 wart de précision de claim**
(non produit) : le décompte de FAILs vanilla annoncé (17+2) sous-compte le
réel (21+6 mesuré chez moi) — la direction et les surfaces nommées restent
exactes. + 1 wart upstream latent journalisé (`validation.required`).

## Environnement auditeur (indépendant)

| Instance | Port | Image | Données |
|---|---|---|---|
| patchée | :8754 | mealie-av3:patched | seed propre (shareToken 8873f57b, shoppingListId 96339c76) |
| vanilla | :8744 | mealie-av3:vanilla | seed propre (shareToken f6f69d8c) |
| install | :8764 | mealie-av3:install | install-build.sh verbatim adapté (chemins/port à moi) + seed |

Sources : clone vierge @`06ccc2b1a6eef90dece7cfcd5aa48e140f544bf9` ;
`git apply --check` patch.diff → **0 rejet** (×2 clones : patched + install) ;
sha256 recalculé =
`9ea64659c12a527e4cf9148ccb6ccd8e8f7fedfc448646dd191a4e9c1e3c0e76` —
conforme au `.sha256` livré ; comptes recomptés par parsing du diff =
**114 fichiers, +504/−206** (le `git apply --stat` de git 2.34.1 affiche
encore "0 files" — comptés à la main comme aux cycles précédents).

## Rejeu des claims

**Rescan patchée :8754** — 51 auth + 5 public, axe-core 4.14.0 :
**0 violation / 0 erreur**, **1440 inc auth + 64 inc public** — les chiffres
exact du fixer. Sondes incompletes rejouées : **774 PASS / 180 N-A / 0 FAIL**
(incomplete-probes.mjs sur mon report).

**Install-build verbatim :8764** — clone + apply + `docker build`
multi-stage amont + seed + double audit : **auth 0 viol/0 err/1440 inc,
public 0 viol/0 err/64 inc** — bit-identique au claim. Transportabilité
prouvée sur mon matériel.

**Baseline vanilla :8744** — auth **1275 occ / 18 règles / 1483 inc**,
public **73 occ / 9 règles / 62 inc** — cohérent avec auditeur v2 (même
total 1275 ; distribution de familles identique : button-name 386,
aria-tooltip-name 325, color-contrast 121, …). **Pureté prouvée**
(leçon 40) : les marqueurs patch sont **absents du dist vanilla** —
4 règles `color-mix(in srgb,rgb(var(--v-theme-{primary,secondary,success,error})`,
`.v-overlay.v-tooltip:not(.v-overlay--active)`, `Mealie home`,
`Toggle navigation`, `safe-markdown` (0 fichier chacune vs présentes dans
le dist patché).

## W5 — slug i18n : FERMÉ, 3 états discriminés

- **État réel (patché :8754)** : sonde live — ouverture du dialog langue via
  `STATES`, `labelText = "Select Language"`, `inputAria` renseigné ;
  capture `proof-language-dialog-auditeur-v3.png`. `RecipeLastMade` :
  le fallback `$t('general.recipe')` résout bien `"Recipe"` (clé présente
  dans en-US patché, hunk `:40` vérifié).
- **État slug (sabotage)** : retrait de l'entrée `"select-language"` du
  catalogue en dans le dist → verify **28/30, exactement 2 FAIL nommés** :
  `[G2] labelText="data-pages.select-language"` (le slug brut rendu) +
  `[N1]` avec offenders précisés (`label#…-label.v-label[text]="data-pages.select-language"`).
- **État absent (vanilla :8744)** : verify → `[G2] FAIL`,
  `{"labelText":"","inputAria":""}` — label vide, état amont pur.

La sonde distingue donc absent / slug / réel — la leçon 43 est exécutable.
Note méthodo : la clé vit dupliquée dans ~40 chunks (un par locale) ;
saboter le chunk **nl** laisse 30/30 PASS (outil honnête, aucun faux
positif) — seul le chunk de la locale active (en) déclenche les 2 FAIL.

## i18n-coherence.mjs

Rejoué : **47/47 clés `$t/$tc` du patch résolues**. Casse-test :
renommage de `data-pages.select-language` dans le catalogue source →
**46/47 + 1 manquante listée, exit 1**. Restauration → 47/47, exit 0.

## verify / eval / provenance

- verify.mjs :8754 → **30/30 PASS** (rejoué ×2 post-restauration).
- eval-final.mjs :8754 → **26/26 PASS**.
- `rehash-provenance.py cycles/mealie --strict` → **58/58 OK**,
  spot-check 3/3.

**Écart vs claim sabotage vanilla** : fixer annonce « vanilla :8544 →
17 FAIL verify + 2 FAIL eval ». Mesuré chez moi sur vanilla pur :
**verify 21 FAIL** (9/30) et **eval 6 FAIL** (20/26). Le claim énumère 17
noms mais en omet 4 qui échouent forcément sur vanilla vrai :
`A1/A2/A3-lang` (html[lang] absent — `<html>` servi sans lang, `lang=en-GB`
posé côté client par `app.vue` du patch, confirmé en runtime) + `K1`
(landmark main 404 via `error.vue` du patch). Idem eval : `A1–A4-lang` ×4
non listés. Les surfaces nommées par le fixer sont toutes dans mon set —
direction exacte, **décompte sous-déclaré** (sa vanilla était-elle
contaminée par du patch, ou comptage partiel ?). Wart de précision de
claim, pas de produit : le résultat corrigé est **21 + 6 FAIL**.

## Chasse

- **Hors-scope** : les 114 fichiers du patch sont tous sous `frontend/`
  (0 backend). Les lignes `+` dominantes = pattern overlays
  `:menu-props="{ eager: true }"` / `<v-tooltip eager>` (DOM overlay
  présent pour nommage/axe), couleurs thème `on-primary`, scaffolding
  `app.vue`/`error.vue` (htmlAttrs lang/dir + landmark main 404).
  Rien de non-a11y repéré.
- **Violations introduites (2.5.3 label-content-name-mismatch)** : sonde
  accName-vs-texte-visible sur les éléments nommés par le patch
  (checkboxes membres ×8, shopping, header) → **0 suspect**.
- **Slugs i18n résiduels dans tout le dist patché** : extraction des clés
  `t(...)` du bundle → 1223 dont 1099 dotted ; 12 non résolues =
  11 bruits d'extraction (sélecteurs CSS, noms CodeMirror, tronqués)
  + **1 réelle : `validation.required`**.
- **Wart upstream latent (non introduit)** : `register/index.vue:398`
  émet `i18n.t("validation.required")` alors que la clé catalogue est
  `validators.required` → slug rendu quand `groupErrorMessages` se
  remplit sur /register. Présent à l'identique dans le dist vanilla —
  amont, hors-scope du patch, journalisé.

## Chiffres

| Métrique | Fixer v3 | Auditeur v3 | Verdict |
|---|---|---|---|
| Patch | sha256 9ea64659, 114f +504/−206 | idem recompté | ✔ |
| Patché auth/public | 0 viol/0 err (1440+64 inc) | 0 viol/0 err (1440+64 inc) | ✔ exact |
| Install verbatim | 0 viol (1440+64 inc) | 0 viol/0 err (1440+64 inc) | ✔ exact |
| Vanilla auth/public | baseline pure | 1275 occ/18r + 73 occ/9r, pureté ×5 marqueurs | ✔ |
| W5 label dialog | "Select Language" réel | "Select Language" live (capture) | ✔ |
| RecipeLastMade fallback | `general.recipe` résout | "Recipe" résout | ✔ |
| Sabotage clé dist | 2 FAIL [G2]+[N1] | 28/30, G2 slug rendu + N1 nommés | ✔ exact |
| 3 états discriminés | absent/slug/réel | prouvés (label "" / slug / "Select Language") | ✔ |
| i18n-coherence | 47/47, casse→FAIL | 47/47, casse→46/47 exit 1 | ✔ |
| verify / eval patché | 30/30, 26/26 | 30/30, 26/26 | ✔ |
| vanilla verify/eval | 17+2 FAIL | **21+6 FAIL** (A1–A3/A4-lang + K1 sous-comptés) | ⚠ claim sous-déclaré |
| sondes incompletes | 0 FAIL | 774 PASS / 180 N-A / 0 FAIL | ✔ |
| provenance --strict | 58/58 | 58/58 + spot-check 3/3 | ✔ |

**CONFIRMED** — reproductibilité du score axe + rejeu indépendant
(PAS une certification WCAG complète). W5 fermé et la sonde anti-slug
discrimine réellement les 3 états. Warts : décompte sabotage vanilla
sous-déclaré (21+6 réels vs 17+2 annoncés) et wart amont
`validation.required` journalisé.

— auditeur v3 indépendant, ports :8744/:8754/:8764, images mealie-av3:*,
données propres.
