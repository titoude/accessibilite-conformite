# Verdict auditeur — cycle 17 umami/umami

**Verdict : PARTIAL** — la chaîne complète se reproduit bit-identiquement sur le périmètre authentifié (scopeHash `723c223b…` + statesHash `ab58a769…` identiques au livré, 0 violation / 0 erreur / exit 0 sur 38 scénarios), le patch est sain, le mécanisme pnpm `patchedDependencies` est prouvé réel (couche popup montée dans le DOM live), verify 27/27 et eval-final rejoués à 100 % ; MAIS le « 0 violation » du périmètre public n'est pas reproductible déterministement sous la commande figée du manifeste : `/share/a11yumamishare` monte son `<main>`+`<h1>` après un fetch client et la commande publique n'a aucune sédimentation (`--wait`), donc axe échantillonne le shell et produit des violations dans ~40 % des replays (2/5 : `page-has-heading-one`, dont 1× aussi `landmark-one-main`). Ceci n'affirme PAS la conformité WCAG complète : périmètre axe seul (wcag2a/aa + best-practice) et 58-59 résultats `incomplete` décidés N-A (sondés ci-dessous).

Auditeur : session indépendante (devin-52a20089496f4e4a990bd99aeedce4e7), VM neuve, clone upstream frais `umami-software/umami@ec0ff50388c264ed8ce46f00967e92f7e71476ae`, rejeu complet sans réutilisation des artefacts du worker.

## Méthode de rejeu (indépendante)

- `git clone` upstream → `checkout ec0ff50` → `git apply --check` puis `git apply` du `patch.diff` livré → propre (1 warning trailing whitespace, conforme au récit), 112 fichiers modifiés + 2 nouveaux fichiers présents dans le diff (`patches/@umami__react-zen@0.254.0.patch`, `src/app/(main)/not-found.tsx`).
- `docker run postgres:15-alpine` (umami-pg :5432) + `.env` DATABASE_URL → `corepack pnpm install --frozen-lockfile` (pnpm 12.9.1 résolu — voir U4) → `pnpm prisma generate` → `pnpm db:migrate` (26 migrations) → `pnpm db:seed` (2 sites, 15 586 sessions) → `pnpm build` (next --turbo, 70/70 pages) → `pnpm start` :3000. Tout exit 0, conforme au récit install-build.
- UUIDs remappés en SQL vers les valeurs figées du manifeste (website/link/pixel/board/share sont des ids générés serveur — voir U3).
- `tools/` recopié dans `~/umami-audit/tools` + `npm install` (axe-core 4.13.0, playwright 1.63.0, chromium-1243) ; `urls.txt` reconstruit depuis `manifest.urls` (voir U2) ; `login.mjs` → `auth.json`.
- `audit.mjs` rejoué avec les `auditCommands` verbatim ; worktree vanilla séparé @ec0ff50 (sans patch, pnpm-workspace.yaml sans `patchedDependencies`, dist sans `zenPopupContainer`) servi sur :3001 contre la même base.

## Résultats du rejeu

| Étape | Livré | Rejoué | Verdict |
|---|---|---|---|
| provenance.json (sha256) | 22 entrées | **22/22 conformes** (incl. `patch.diff` ↔ `patch.diff.sha256`) | OK |
| patch.diff | apply propre | `--check` OK + apply propre sur clone @ec0ff50 | OK |
| patchedDependencies | patch pnpm rejoué mécaniquement | `node_modules/.pnpm/@umami+react-zen@0.254.0_patch_hash=ade2a276…` — hash **identique** au hunk `pnpm-lock.yaml` livré ; 15 sites `.Portal` instrumentés dans `dist/index.js` **et** `dist/index.mjs` ; `zenPopupContainer` ×16/fichier | OK (nit U5) |
| install-build | PASS | clone propre : install frozen + prisma generate + migrate + seed + build 70/70 + start | OK |
| final auth (32 urls + 6 états) | 0 viol / 0 err / exit 0 | **0 / 0 / exit 0, 38/38 audités** | OK |
| final public (/login + /share) | 0 viol / 0 inc | **`/login` 0/0 déterministe ×3 ; `/share` FLAKY : 2/5 runs avec violations réelles** (`page-has-heading-one` ×2, `landmark-one-main` ×1) | **U1** |
| scopeHash auth / public | `723c223b…` / `b7db2d55…` | **identiques**, baseline↔final↔rejeu | OK |
| statesHash | `ab58a769…` | **identique** (rejoué) | OK |
| verify.mjs | 27/27 | **27/27** | OK — assertions dures : noms accessibles calculés (`getByRole name:`), `inLayer` sur DOM live, contraste mesuré, absent=FAIL |
| eval-final.mjs | 15/15 | **18/18 PASS** (libellé « 15/15 » obsolète — le script exécute 18 assertions, toutes passent) | OK (nit U4) |
| baseline vanilla | 1387 occ/17 règles + 387/7 public | distribution **famille-par-famille reproduite** sur échantillon (dashboard+websites+detail+share : region ×82, aria-command-name ×336, target-size ×336, button-name, image-alt, landmark-one-main, page-has-heading-one, color-contrast, empty-table-header, link-name ; /share seul ≈ composition des 387 publics : 168+168+34+7+6+2+2) | OK |
| incompletes | 59 (3 familles) | **58** — mêmes 3 familles (color-contrast 33, aria-hidden-focus 22, aria-valid-attr-value 3) ; 5 sondes rejouées OK | OK (dispersion −1 nœud) |

## Lecture du patch (114 entrées, +589/−202) — sain

- `#a11y-popup-layer` : `<div role="complementary" aria-label="Popup layer">` ajouté dans `<body>` de `layout.tsx` + patch pnpm react-zen (`container: zenPopupContainer()` sur les 15 sites `.Portal` des deux dist). **Prouvé en DOM live** : menu utilisateur, dialog « Add website »/« Share », sheet mobile et listbox de select montent tous DANS la couche (`inLayer: true`), `aria-controls` résout vers l'overlay réel, fond `data-base-ui-inert` pendant l'overlay — mécanique propre, meilleure que vanilla, pas du masquage.
- Landmarks réels : `App.tsx` `role="main" id="main-content" tabIndex={-1}` + skip-link `a.skip-link:focus-visible` (vérifié : visible au 1er Tab), navs nommées sans imbrication, banner mobile top-level, `not-found.tsx` `as="main"` + h1.
- `alt={value}`→`alt=""` sur TypeIcon décoratif (légende adjacente porte le nom) ; cellule heatmap `role="button"`→`role="img"`+`tabIndex`+label descriptif (non-cliquable — la sémantique fausse-bouton est corrigée) ; `<th>` vides → VisuallyHidden ; pixel télémétrie `alt=""`+`aria-hidden` (0×0, légitime) ; contrastes en source (`--zen-primary` 62.3%→55% lightness, commenté honnêtement ~4.7:1).
- **Aucun** `display:none` ajouté, suppression de contenu, `aria-hidden` posé sur de l'interactif, ni retouche de test/harnais dans le patch produit.
- Wart cosmétique : dans la section `index.mjs` du patch pnpm, 2 lignes portent `{container: zenPopupContainer(),  container: zenPopupContainer(),` (Combobox.Portal, NavigationMenu.Portal) — prop dupliquée inoffensive (React last-wins, même valeur) ; les 15 sites sont bien tous instrumentés dans les deux dist.

## Sondes incompletes (5/5 rejouées sur DOM live)

- `aria-hidden-focus` ×2 : sentinels `span[data-base-ui-focus-guard]` = `aria-hidden=true` + `tabindex=0` + `position:fixed` 1×1 px (FocusGuard Base UI délibéré) ; pendant la sheet mobile : 11 régions `data-base-ui-inert` dont le skip-link — décision N-A du worker **vérifiée**.
- `aria-valid-attr-value` : `aria-controls` du combobox de période → résout vers un `[role=listbox]` vivant monté dans `#a11y-popup-layer` (ids dynamiques par montage, `_r_56_` etc.) — axe ne suit pas le portail, N-A **vérifié**.
- `color-contrast` ×2 : lignes virtualisées realtime + cellules revenue — fond réel blanc, texte quasi-noir, **ratio mesuré 20.79:1** — « background indéterminable » axe, N-A **vérifié**.

## Findings

- **U1 (major)** — `reports/final-public` 0/0 non reproductible déterministement : `/share/a11yumamishare` rend `<main>`/`<h1>` uniquement après un fetch client (~1-2 s) ; la commande publique figée n'a pas de `--wait` (la commande auth a `--wait 3500`). Sous `--wait 0`, axe échantillonne le shell avant montage → violations réelles dans 2/5 replays (`page-has-heading-one` ×2, `landmark-one-main` ×1) + 1 `color-contrast` incomplete. La page n'est pas cassée (h1 « Demo SaaS » présent après sédimentation) : c'est un défaut de sédimentation de la commande publique — même classe que les leçons HedgeDoc #2 / NPM #3 (wait-for sur élément monté en async). Correction attendue : `--wait 3500` (ou `--wait-for 'h1'`) sur la commande publique + régénération de `final-public` — sous `--wait 3500` j'obtiens 0/0 déterministe ×2. En l'état, le score public livré était un coup de chance de timing.
- **U2 (minor)** — `auditCommands[0]` référence `urls.txt` **non livré** dans `tools/` (reconstitué depuis `manifest.urls` — le scopeHash identique prouve la reconstitution octet-exacte, mais le verbatim dépend d'un fichier absent).
- **U3 (minor)** — seed sous-spécifié : `POST /api/websites/:id/shares` **ignore** le `slug` fourni (le serveur a généré `2kQYjrMaKskbV7uF` ≠ `a11yumamishare` → remap SQL requis) ; `POST /api/links` exige `slug` et `POST /api/boards` exige `type` — champs absents des payloads documentés ; les UUIDs (website/link/pixel/board/share) sont générés serveur, donc les POST documentés ne peuvent pas seuls atteindre les URLs figées du scope (remap SQL nécessaire chez moi).
- **U4 (minor)** — métadonnées/doc : `toolVersions` absent du manifeste ; `manifest.stack` annonce « pnpm 12.3.4 » mais rien ne l'épingle (corepack a résolu 12.9.1 — install rejouée correctement quand même) ; libellé « eval-final 15/15 » obsolète (18 assertions exécutées) ; `results.json.installBuild.verdict = "PASS"` = auto-verdict sur sous-contrôle (règle « le worker n'écrit que des mesures ») ; `scope.json` ne stocke ni `wait` ni `waitFor` (leçon protocole #8) — l'absence de sédimentation publique de U1 n'est pas lisible dans l'artefact.
- **U5 (nit)** — `index.mjs` du patch pnpm : `container:` dupliqué sur 2 sites (inoffensif) ; incompletes 58 vs 59 déclarés (1 nœud color-contrast de moins — dispersion normale de timing) ; `eval-final.mjs` saute silencieusement 2 checks si `[role=combobox]` absent sur /sessions (précondition non assertée — le seul `if (count())` sans garde préalable).

## Points de la mission

1. **provenance.json** : 22/22 sha256 recalculés conformes.
2. **patch.diff** : apply propre sur clone @ec0ff50 ; `patchedDependencies` prouvé actif (`patch_hash` lockfile → dist instrumentés → portails dans `#a11y-popup-layer` en DOM live).
3. **install-build** : chaîne complète rejouée exit 0 (frozen-lockfile + prisma + migrate + seed + build 70/70 + start).
4. **manifest** : auditCommands verbatim rejouables (U2 : urls.txt absent), seed reproductible avec remaps (U3 : payloads incomplets), toolVersions absent (U4).
5. **results.json** : mesures seules sauf `installBuild.verdict` (U4).
6. **verify/eval-final** : assertions dures confirmées, aucun catch muet, aucun leurre ; rejoués 27/27 et 18/18.
7. **Rejeu audit** : auth bit-identique (hashes + 0 viol + exit 0) ; public non reproductible déterministement (U1).
8. **Baseline vanilla** : distribution famille-par-famille reproduite (2e worktree :3001, même DB).
9. **Incompletes** : 5 sondes rejouées — décisions N-A du worker confirmées par mesure DOM.
10. **Ce verdict** ne certifie que la reproductibilité axe-score, pas la conformité WCAG.
