# verdict-fixer-v3 — cycle 33 changedetection.io

Date : 2026-10-07. Rôle : fixer v3 sur le verdict **PARTIAL** de
l'auditeur v2 (verdict-auditeur-v2.md, commit 743eae1). Toutes les preuves
ci-dessous sont **rejouées dans cette session** : instance patchée
`~/work/changedetection` :5005 (baseline vanilla + final), clone vierge +
patch v3 `~/work/cd-install` :5006 (install-build, sonde F1, verify).

## Résumé des chiffres rejoués

| Run | occ | règles | incomplets | pages | erreurs |
|---|---|---|---|---|---|
| baseline-public | 12 | 6 | 1 | 1 | 0 |
| baseline-auth | 1316 | 14 | 215 | 48 | 0 |
| final-public | 0 | 0 | 0 | 1 | 0 |
| final-auth | 0 | 0 | 117 | 48 | 0 |
| install-build-public | 0 | 0 | 0 | 1 | 0 |
| install-build-auth | 0 | 0 | 118 | 48 | 0 |

- Baseline-auth rejouée à 1316 occ vs 1328 livré : variance **-4 région /
  +6 target-size / +2 color-contrast**, entièrement expliquée par l'état
  watchlist — les rechecks déclenchés pour la preuve F1 ont muté le
  datastore partagé (2 rows rendues en mode minimal, contrôles
  mute/pause `state-off` visibles). Les **14 ids de règles sont
  identiques** au livré ; classe de variance identique au ±5 occ /queue
  constaté par l'auditeur.
- verify.mjs **29 PASS / 0 FAIL** (rejoué sur :5006 — sondes computed
  clair+sombre : lien titre watch, bouton primaire, badges unread/erreurs,
  tag pill).
- Sondes incomplets rejouées : **117 items → 75 RESOLVED + 42 N-A,
  0 CONFIRMED_VIOLATION**.
- eval-final : baseline 1328 → final **0**, toutes règles `resolved`,
  states 47/47, `missing_in_final=[]`, `residual_errors=[]`.
- axe-core **4.14.0** exécuté (tracé `axeVersion` dans chaque scope.json +
  report.json).

## F1 — résidu `/queue` `renderWatchCell` (corrigé + prouvé)

**Constat auditeur** : le hunk avait remplacé `style="opacity:0.7"`
(héritait `var(--color-white)` ~10:1 brut) par `var(--color-text)` → #333
sur le panneau queue toujours sombre = **~1,05:1 en thème clair**, pour
toute row JS re-rendue (busy/queued/completed).

**Correctif** : `queue.html` L179 —
`<small style="color: #c2c2c2;">` (escapeHtml(w.url)). Choix `#c2c2c2`
plutôt que `var(--color-white)` : la règle amont `table.pure-table
small { opacity: 0.7 }` compose par-dessus toute valeur inline ; les hunks
frères du même fichier (idle L93/L297, time-cell L303/L331/L347,
légende L25) utilisent tous `#c2c2c2` — la row busy doit rester cohérente
avec la row idle adjacente dans la même table.

**Preuve exécutée** (tools/probe-f1-queue.mjs, sortie dans
reports/f1-queue-probe.jsonl) : vrais rechecks déclenchés via
`GET /api/v1/watch/<uuid>?recheck=true` (x-api-key du datastore), page
`/queue` authentifiée sur l'**install-build :5006**, attente des rows
produites par `updateFromSnapshot`, mesure du composite
`fg×opacity` replié sur la chaîne de fond réelle, dans les deux thèmes :

- 20 rows JS réelles capturées : **busy=14, queued=6**, idle=2,
  is-completed=1 — inline `color: #c2c2c2;` confirmé dans le DOM rendu.
- Composite mesuré **4,60–5,05:1** en thème clair **et** sombre (pire cas
  4,60:1 ≥ 4,5) — le panneau étant sombre dans les deux thèmes, les
  mesures sont identiques. Exit 0.
- Repère : la row amont `is-completed` (blanc@0,7, hors patch) mesure
  8,26:1 sur le même DOM.

Note honnêteté : la marge est fine (4,60 ≥ 4,5). `var(--color-white)`
aurait donné ~8:1 mais aurait rendu la row busy plus claire que la row
idle voisine (#c2c2c2@0,7) ; le mandat autorisait les deux et imposait la
cohérence avec les hunks frères.

## Wart — `:5599` hardcodé dans `addwatchui-live-preview` (corrigé)

**Constat** : le setup remplissait l'URL fixture en dur
(`http://127.0.0.1:5599/api-docs.html`) — si les fixtures étaient servies
ailleurs, l'état scannait silencieusement une preview vide en « 0
viol/0 err ».

**Correctif** (tools/audit.mjs + tools/boot.sh + manifest.json) :

- `CD_FIXTURE_BASE` env (défaut `http://127.0.0.1:5599`) + `CD_FIXTURE_PORT`
  dans boot.sh ; manifest documenté.
- Garde anti-scan-vide en deux étages, qui **fait échouer l'état** au lieu
  de scanner du vide :
  1. `GET fixtureUrl` doit répondre 200 **et** contenir le markup attendu
     (`Acme Metrics API`) ;
  2. la réponse POST `/snapshot` est interceptée : son `xpath_data.size_pos`
     doit porter les ids du markup fixture (`#auth`, `#endpoints`,
     `#rate-limits`, `#changelog`), sinon `throw` — preview vide refusée.

Rejoué sur install-build : l'état `addwatchui-live-preview` passe les deux
gardes et scanne la preview réelle (0 viol/0 err, scénario non vide).

## Chaîne install-build rejouée bout-en-bout

1. Clone vierge `~/work/cd-install` @ `a1ce3561` → `git apply --check`
   patch v3 : **0 rejet**, `git apply` OK.
2. `npm install && npm run build` → `styles.css` sha256
   `5c3975140d01fe0b…` **byte-identique** à l'artefact livré (le fix F1
   est template-only, le CSS compilé ne change pas).
3. venv 3.11 + boot :5006 + seed (exit 0, 4 watches + 2 tags, diff_ok×3,
   error_ok) + login → rescan auth : **0 viol/0 err**, 118 inc
   (+1 vs final-auth : même classe de mécanismes transitoires).
4. `patch.diff` régénéré depuis `~/work/changedetection` (arbre appliqué
   **et vérifié**) : diff vs patch v2 = la ligne F1 seule (43 fichiers,
   +273/−88, inchangés).

## Limites

- La variance baseline-auth (1316 vs 1328 livré) est structurelle —
  mutations du datastore par les rechecks F1 —, pas un défaut de patch ;
  les ids de règles et le compte d'erreurs sont strictement identiques.
- `/queue` n'est mesurable par axe qu'à l'instant du scan (rows
  transitoires) : la preuve F1 repose sur la sonde computed, pas sur axe —
  c'est précisément le protocole demandé par l'auditeur.

## Artéfacts produits / mis à jour

`patch.diff` (v3), `tools/audit.mjs`, `tools/boot.sh`, `manifest.json`,
`tools/probe-f1-queue.mjs`, `reports/f1-queue-probe.jsonl`,
`reports/{baseline,final,install-build}-{public,auth}/`,
`reports/eval-final.json`, `reports/incomplete-probes.json`,
`results.json` (entrée `corrections_post_audit_warts` v3),
`provenance.json` (re-hashé en dernier via rehash-provenance.py).
