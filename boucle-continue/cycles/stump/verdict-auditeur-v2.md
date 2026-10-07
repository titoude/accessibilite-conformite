# Verdict auditeur v2 — cycle stump (stumpapp/stump @42a9918c1542, v0.1.10)

**Statut : CONFIRMED** — toutes les claims du fixer v2 (11c6e83) rejouées par moi, de bout en bout, sur une infra 100% indépendante : mes propres clones vierges @SHA, mon patch appliqué par moi, mes builds (yarn + cargo), mes db (sqlite fraîches, seed rejoué ×2), mes ports (`:17434` instance principale, `:17435` install-build) — jamais :11334/:11335. Aucune confiance aux artefacts livrés : chaque chiffre a été recalculé ou re-mesuré par mes scripts.

Rappel protocole : le verdict porte sur la reproductibilité axe et la santé du patch sur le périmètre déclaré, pas sur la conformité WCAG du produit.

---

## Ce que j'ai rejoué et vérifié

### 0. Espace de travail indépendant
- `~/work/stump` — clone vierge `@42a9918` + `git apply patch.diff` : **0 rejet**, 136 fichiers, +520/−281 (sha256 `46a02123e76d8f16a87071a0fd902e1dd99202477a11282d8a6f4e9bcf801216` — le patch diffère de celui du worker/11c6e83 `6b93a008…`, régénéré post-fix v2 : attendu et cohérent avec les 5 fichiers modifiés en plus).
- `~/work/stump-ib` — second clone + même patch → **install-build vraiment indépendant** (cargo build exécuté *dans* ce clone, pas binaire recyclé).
- `~/work/stump-vanilla` — clone sans patch, dist vanilla conservée pour le rejeu baseline (swappée sur l'instance :17434).
- Builds **par moi** : `yarn install --frozen-lockfile` + `yarn web build` (84s → `index-B6F3sN3J.js`), `cargo build` 461s + 213s (ib). Binaries :17434 = `~/work/stump/target/debug/stump_server`, :17435 = `~/work/stump-ib/target/debug/stump_server`.
- Sessions/auth créées par moi (`admin`/`adminpass123`, storageState `auth-a17434.json` / `auth-a17435.json`), db sqlite `stump.db` sous `db/` de chaque clone — UUIDs réécrits par moi via sqlite (13 refs/db, valeurs des probes/urls reprises).

### 1. Rejeu baseline élargi (claim « 1126 occ / 20 règles / 53 surfaces »)
- **Mesure :** dist vanilla servie sur :17434, re-run `baseline-newscope.mjs` sur les 7 routes ajoutées v2 → **163 occ / 12 règles / 8 incomplets — identique à l'artefact livré** (`baseline-newscope/report.json`). Les `div[aria-haspopup="dialog"]` des 4 triggers sont bien présents en live sur dist vanilla (`/settings/delete` → `div type="button"`), les comptages intra-report et les règles recomptés nœud par nœud coïncident.
- **Total recalculé :** 963 (artefacts baseline v1 : 950 auth + 13 public, re-agrégés par moi) + 163 (re-mesuré) = **1126 occ / 20 règles / 53 surfaces** (44+2 v1 + 7 nouvelles). Claim exact.
- États n'affectant pas ces routes : 51 scénarios (42 urls + 9 états) — chaque nouvelle route résout (200 + h1 monté) avec les UUIDs réécrits.

### 2. Rejeu patch final — claims « 0 viol sur 53 scénarios »
| Mesure (la mienne) | :17434 livré | :17434 mesuré | :17435 livré | :17435 mesuré |
|---|---|---|---|---|
| public (/auth + login-failed) | 0 viol / 2 inc | **0 / 2 — identique** | 0 / 2 | **0 / 2 — identique** |
| auth 51 scénarios | 0 viol / 130 inc | **0 / 131 inc** | 0 / 131 inc | **0 / 131 inc** |

- **0 violation aria-allowed-attr sur :17434 ET :17435** — mesuré par moi, incl. les 4 triggers F1 (`/settings/delete`, `/libraries/:id/settings/clean`, `/libraries/:id/settings`, `/clubs/:id/settings`) : le DOM live montre désormais `<button aria-haspopup="dialog" aria-expanded aria-controls>` (plus de div). Correctif vérifié au runtime, pas juste en source.
- Le **+1 incomplet** (131 vs 130 livré) est le `<select class="appearance-none bg-input/30…">` de `/libraries/:id/settings/scanning` (color-contrast) — surface flaky **documentée mot pour mot dans install-build.log** ; elle apparaît chez moi sur les deux instances (~50% des runs, dependant du paint). Sa sonde la classe conforme (alpha non nul, ≥4.5). Non bloquant, divergence explicable et honnêtement tracée par le fixer.
- Install-build : rescan complet **nœud pour nœud identique** à l'artefact livré :11335 (même jeu de 51 scénarios ; scopeHash/statesHash différents comme documenté — le port entre dans le hash ; mécanisme re-vérifié dans audit.mjs : `statesHash` couvre url+setup.toString()).

### 3. Sondes et verify (claims « 132+133 conformes », « 40P/1NA/0F déterministe »)
- `incomplete-probes.mjs` : **133/133 conformes sur :17434 et 133/133 sur :17435** (claim 132+133 — la sonde en plus chez moi = le select flaky ci-dessus). Les sondes rejouent réellement : ouverture des popovers pour idrefs lazy, composite alpha, repaint des charts…
- `verify.mjs` : 41 assertions → **40P/1NA/0F sur :17434 ET :17435** — déterministe (la 1 N-A = wikipedia-lang exigeant wikipedia.org, claimée comme telle). Mesuré sur les deux instances, « même ordre et mêmes cibles » respecté.
- `eval-final.mjs` : **38/38** (3 N-A honnêtes : skip-link non présent, vars dark non inspectées, prefers-reduced-motion non simulé).
- `seed.mjs` : **exit 0 ×2 sur deux db vraiment vierges** (register 200 + isClaimed:true + 9 media READY incl. 2 oneshots) — le fix `claim.isClaimed || claim.is_claimed` fonctionne (W2 résolu).
- **W3 vérifié par le code + par les binaires :** `apps/server/src/main.rs:22-27` — `debug_setup()` sous `#[cfg(debug_assertions)]` fait `set_var("STUMP_CLIENT_DIR", env!("CARGO_MANIFEST_DIR")+"/../web/dist")` : chemin **compile-time** qui prime sur Stump.toml et l'env shell (priorité env>toml confirmée dans settings.rs). Preuve `strings` : chaque binaire contient le chemin dist de SON clone (`~/work/stump/...` vs `~/work/stump-ib/...`). L'ib sert bien **sa** dist (B6F3sN3J compilée dans stump-ib). install-build.log réécrit de façon exacte (mécanisme réel + lignes G1/G2/G3/G4 rejouées : hash différent entre les 4 fichiers index*).

### 4. Provenance et intégrité (claims « 42/42 », hash de scope)
- `boucle-continue/rehash-provenance.py` exécuté **par moi** : `{"hashes_updated": 42, "mismatches": []}` → **42/42 conformes**.
- scopeHash/statesHash recalculés dans mes 4 rapports : internes cohérents (baseline-newscope != final : attendu — dist différente), ensemble de scénarios identique livré vs rejoué.
- Wart mineur (nouveau) : `tools/package-lock.json` figure à la fois dans `files{}` et `excluded[]` de provenance.json — incohérence de bookkeeping mineure, sans impact mesurable.

---

## Chasse (hors scope, résiduels, 2.5.3)

**Router React énuméré complet** (`apps/web/src/App.tsx` + sous-routeurs settings/library/book/club/smart-list) : ~80 routes réelles, toutes admin-accessibles sauf le set documenté. Exclusions `manifest.excluded` vérifiées, dont `/settings/users/:id/manage` — **rejouée en live : redirige bien vers `/settings/account` pour le server-owner** (l'assertion « redirect » est exacte). 2.5.3 `label-content-name-mismatch` testé sous axe 4.14 scratch (règle absente de 4.10) : contrôle positif injecté → **1 violation détectée** (règle active), et **0 sur 6 pages réelles** (`/`, `/books`, librairie, `/settings/preferences`, `/smart-lists/create`, `/clubs/create`) — les `aria-label="${visible} — ${label}"` du patch respectent 2.5.3.

### Findings v2

**F-v2 (nouveau, même famille que F1 — envoi fixer v3) : le pattern trigger/asChild→`<div>` existe encore à ≥2 sites non corrigés.**

- `packages/components/src/calendar/DatePicker.tsx:29-42` — `<PopoverTrigger asChild><div className="w-70 …"><Label/><Button/></div></PopoverTrigger>`. **Prouvé en live** : ouverture de la modale « Create API key » sur `/settings/api-keys` → le trigger rend `<div type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-…">` et axe mesure **1 violation aria-allowed-attr**. La modale est atteignable depuis une route in-scope (api-keys, metadata-integrations via CreateProviderDialog, smart-lists/create via filtre RangeValue) mais aucun état déclaré ne l'ouvre → hors des 53 scénarios mesurés.
- `packages/browser/src/components/Pagination.tsx:142-146` — `PagePopoverForm` reçoit `trigger={<div className="-mt-1"><button…/></div>}` → `<Popover.Trigger asChild>` injecte aria sur le div quand la pagination affiche l'ellipsis (nécessite >pageSize items ; le seed de 9 médias ne la rend jamais).

Dispositions : les deux sites sont la **même famille de défaut** que F1, non réintroduits par v2 mais non chassés — la claim « 0 viol sur 53 scénarios » reste exacte et reproductible, d'où CONFIRMED plutôt que PARTIAL ; le correctif (Button direct) et/ou un état ouvrant ces dialogs est à porter en v3, avec au moins `/settings/api-keys` modal couverte par un état déclaré (la surface est déjà in-scope, seul l'état manque).

---

## Chiffres rejoués (récap)

| Claim fixer v2 | Rejoué par moi | Résultat |
|---|---|---|
| patch 136 fichiers +520/−281 | apply --check 0 rejet sur vierge @42a9918 | conforme |
| baseline élargi 163 occ / 12 règles (7 routes) | re-run dist vanilla sur :17434 | **identique** |
| baseline total 1126 / 20 règles / 53 surfaces | 963 (artefacts v1 recomptés) + 163 (rejoué) | **= 1126, exact** |
| 51 scénarios auth + 2 public, 0 viol | mesuré :17434 et :17435 | **0 viol partout** |
| ~130 inc | 131 :17434, 131 :17435 | +1 flaky documenté |
| probes 132+133 conformes | 133/133 ×2 | conforme |
| verify 40P/1NA/0F ×2 | 40P/1NA/0F ×2 | conforme |
| eval 38/38 | 38/38 | conforme |
| seed exit 0 sur db vierge | exit 0 ×2 (register 200, 9 READY) | conforme |
| ib sert sa dist | strings par-binaire + rescan identique | conforme |
| provenance 42/42 | rehash 42, mismatches [] | conforme |

## Verdict

**CONFIRMED.** Le patch v2 s'applique proprement, les chiffres livrés se reproduisent à l'identique ou à +1 incomplet flaky tracé, W2/W3/W4/W5/W6 sont résolus avec les mécanismes réels vérifiés au code et au runtime, la provenance est cohérente à 42/42, et les 4 triggers F1 sont réellement fixés en DOM live. Un résidu de la même famille F1 persiste sur ≥2 sites hors des états déclarés (DatePicker — prouvé en live sur `/settings/api-keys`, Pagination — latent) : scope-gap, à corriger en fixer v3 avec un état couvrant la modale api-keys.

— Ré-audit v2 indépendant, session devin-76739766f25949f8899d1bde5f09e26d, instances :17434/:17435.
