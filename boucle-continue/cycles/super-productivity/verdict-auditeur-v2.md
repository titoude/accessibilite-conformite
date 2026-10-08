# Verdict auditeur v2 — cycle 51 johannesjo/super-productivity @71eb7780 (v19.1.0)

**Verdict : CONFIRMED** — le fix `cbd63ed` (warts W1–W4 de l'audit `d0a1b78`) est réel, complet et rejoué en entier sur environnement et données indépendants : patch régénéré sain (sha256 `65a52468…878c6` conforme au sidecar et à la provenance, `git apply --check` 0 rejet ×2, 54 fichiers +241/−89 recomptés), build dev + install-build verbatim à **0 violation / 0 erreur** sur 34 scénarios chacun, verify **45/45** (les 6 sondes anti-slug i18n s'exécutent réellement, bascule comprise), eval **8/8** (1 N-A skip-link), sabotage **4/4** FAIL nommés, vanilla **17 FAIL nommés** (14 documentés + 3 i18n — la sonde discrimine), sondes d'incomplets **0 non-conforme**, provenance 62/62. Ceci mesure la reproductibilité du score axe et la santé du patch, pas la conformité WCAG complète.

Ré-auditeur : session indépendante (devin-110723777f31486ca0141c753110e3bf), clone upstream frais @71eb7780bcf5d6b1dfdcd39a8a8265547d040760 (`git init` + `fetch --depth 1`), ports :9291 (patché) / :9292 (vanilla) / :9293 (install-build), node 24.19.0, seeds régénérés par seed.mjs sur chaque instance (ids propres : `gPGtVSf5…`, `7ZHjsLlp…`, `6zMjECx8…`), aucun artefact d'exécution worker/fixer réutilisé, tools exécutés depuis copies scratch (leçon : ne pas écraser les commités).

## Rejeu de la chaîne complète (manifest.auditCommands, URLs :92xx)

| Étape | Livré fixer | Rejoué v2 | Verdict |
|---|---|---|---|
| patch.diff sha256 | `65a52468…878c6` | identique (sidecar + provenance concordent) | OK |
| `git apply --check` / apply | propre | 0 rejet ×2 (dev + install), 3 warnings whitespace fin de ligne (cosmétique, identique v1) | OK |
| Compte fichiers | 54 f, +241/−89 | **identique** recompté | OK |
| Build dev `ng build --configuration stage` | OK :9281 | OK 28.7s → `.tmp/angular-dist` :9291 | OK |
| Rescan patché | 0 viol / 0 err / 34 sc / 556 inc | **0 viol / 0 err / 34 sc / 558 inc** | OK — incomplets axe flottent ±2 entre runs |
| verify.mjs patché | 45/45 | **45/45** (0 FAIL, 0 N-A) — voir « sondes i18n » | OK |
| eval-final.mjs | 8/8 (1 N-A) | **8/8**, même N-A (skip-link non fourni par le produit) | OK |
| sabotage.mjs | 4/4 | **4/4** (lang absent, main tabindex=-1, boutons anonymisés, nav role=list) | OK |
| verify.mjs vanilla | (non rejoué par le fixer) | **27/44, 17 FAIL nommés** : les 14 documentés dans results.json (`vanillaFails`) **+ 3 FAIL i18n** — `overlay rendu=null attendu=undefined`, `handle rendu="Resize sidenav" (en dur, le wart amont) attendu=undefined`, `daily-summary ni add ni remove nommés`. Les sondes anti-slug discriminent exactement où elles doivent | OK |
| Baseline vanilla | (v1 : 732/16) | **730 occ / 16 règles / 0 err / 34 sc**, même distribution règle-par-règle (deltas = fixture `#/contrast-test` exclue + dérive contenu dynamique) | OK |
| Install-build verbatim | 0 viol / 0 err | **0 viol / 0 err / 34 sc / 556 inc** sur clone vierge @SHA + apply + build + seed frais :9293 — et **0 page-error** (le report worker-ère `install-build.json` commité portait 1 timeout `task-done-toggle` compensé par `install-build-states.json` ; mon urls.txt généré sur mes ids d'install n'en a eu aucun) | OK |
| Skips silencieux (leçon 45) | — | **34/34 scénarios avec résultat axe** dans les 3 runs (patché, install, vanilla) — chaque `[scan]` a produit une ligne | OK |
| incomplete-probes | 554 → 508P/0NC/48NR | **556 → 542P / 0 NC / 16 NR** sur mon propre rescan | OK — NR = sélecteurs transitoires (`routerlinkactive`/`_ngcontent`) + état `mobile-menu-open-390` non rejoué à la sonde (click-timeout connu, même chez le fixer) |
| provenance.json | 62 fichiers | **62/62 sha256 revérifiés depuis le disque** (inclut verdict-fixer.md ; patch.diff = sidecar) | OK |

## Fermeture des warts W1–W4

- **W1 — aria-labels hardcodés EN → i18n** : `grep` exhaustif du patch = **0 littéral EN restant** (tous `[attr.aria-label]="…|translate"` ou bindings dynamiques ; seule chaîne EN est la `-` retirée `'Resize sidenav'`). Live : `en.json` **servi** par l'instance contient les 4 clés en vrai texte anglais — `G.OVERLAYS="Overlays"`, `MH.RESIZE_SIDENAV="Resize sidenav"`, `PDS.ADD_CUSTOM_TEXT_BLOCK`, `PDS.REMOVE_DAILY_SUMMARY_NOTE` — et les rendus DOM **égalent** ces valeurs (`.cdk-overlay-container` via `stream()`, `.resize-handle` via pipe). Sweep : **0 aria-label en forme de clé** `X.Y.Z` sur la page.
- **W2 — prose `--ink-muted`** : `verdict-worker.md` corrigé aux valeurs réelles du diff (0.66→0.82 clair, 0.65→0.8 sombre) — vérifié dans `_css-variables.scss` patché (`rgba(44,44,44,0.82)` / `rgba(235,235,235,0.8)`).
- **W3 — aria-labels eval-sheet axe-blind** : les 3 `[attr.aria-label]="T.F.METRIC.EVAL_FORM.*"` du patch worker-ère sont **absents** du patch actuel ; les `<div>` `daily-state-label` et `.label` sont génériques (**role absent** → le nommage était du bruit, retrait correct) ; info toujours portée par texte + `matTooltip`.
- **W4 — route INBOX** : `#/project/INBOX_PROJECT/tasks` est une **vraie route distincte** (page Inbox projet, hash préservé, « No tasks planned » + actions rendues, axe exécuté — 0 viol / 1 inc dans mon rescan) ; `#/tag/INBOX/tasks` **redirige** maintenant vers la route projet (ValidTagIdGuard) — plus aucune couverture doublée de `history`. `gen-urls.mjs`/`seed.mjs`/`urls.txt` livrés sur la bonne route.

## Sondes anti-slug i18n (leçon 43) — exécution prouvée, pas d'exit-early

- Le total **45/45** est la preuve arithmétique de l'exécution : 39 assertions d'origine + `en.json servi` + overlay + resize-handle + sweep-slugs + **2** assertions daily-summary (branche add→clic→remove) = 45. Un `enJson` nul aurait produit 1 FAIL + total 41.
- **Rejeu instrumenté indépendant** (ma propre sonde, sortie complète) : `rendu overlay="Overlays" === en.G.OVERLAYS`, `handle="Resize sidenav" === en.MH.RESIZE_SIDENAV`, `slugs=[]` ; sur daily-summary : `add="Add a custom text block…"` → **clic réel** → `rm="Remove daily summary note"` (=== en.json) → clic `visibility_off` → retour à `add`. Bascule add⇄remove exercée dans les deux sens, état restauré.
- **La sonde discrimine** (stateProof vanilla) : sur vanilla elle produit 3 FAIL nommés — `handle="Resize sidenav"` en dur vs `undefined`, overlay `null`, boutons daily-summary anonymes. Elle ne peut pas passer « verte à tort ».
- Aucun bug de sonde à réparer de mon côté (verify.mjs :9291 45/45 du premier coup). Skipped listé : dans incomplete-probes, l'état `mobile-menu-open-390` échoue au click `mobile-bottom-nav button` (timeout 30s — flake reproduit chez le fixer aussi), 16 NR listés dans la sortie ; dans verify/eval, 0 skip hormis le N-A skip-link déclaré.

## Warts résiduels (nouveaux, immatériels)

1. `results.json` décrit encore l'ère worker (`verify.patched: 39`, pas de section fixer) — lag documentaire : la verify livrée compte désormais 45 assertions ; les chiffres fixer vivent dans `verdict-fixer.md` + REGISTRE. Non bloquant.
2. `incomplete-probes.mjs` : flake transitoire `mobile-menu-open-390` (click timeout) — 16 sondes NR chez moi (worker : sélecteurs transitoires déjà documentés). Non bloquant : 0 NC.
3. Manifest `boot.deps` dit « node 22.18.0 » ; la chaîne se reproduit strictement à l'identique sous node 24.19.0 (fixer idem) — note manifeste, pas un défaut.

## Limites du verdict

Périmètre axe seul (wcag2a/2aa/21a/21aa/22aa + best-practice, axe 4.14.0 — `testEngine` recoupé dans les rapports). Les ~550 `incomplete` (color-contrast bgOverlap nav, composites) sont sondés 0 non-conforme mais restent des indéterminés axe par nature. Surfaces natives/Electron, synchronisation et canvas hors champ.
