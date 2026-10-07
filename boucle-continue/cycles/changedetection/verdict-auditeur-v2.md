# Verdict ré-auditeur v2 — cycle 33 : dgtlmoon/changedetection.io @ a1ce35619aae

**Verdict : PARTIAL**

Ré-audit indépendant du fix v2 (e74ea41) après le CONFIRMED-avec-warts de v1 (306b675). Stack auditeur propre : re-clone upstream @a1ce35619aae + `git apply patch.diff` (43 fichiers, 0 rejet) ; datastore frais seedé par `tools/seed.py` (exit 0) ; fixtures servies sur 2 ports (`:5699` + `:5599` — voir W2) ; proxy CDP spawn-per-connection (`CDP_PORT=9433`) ; `npm ci` dans tools/ → axe **4.14.0** exécuté (tracé `axeVersion` dans chaque scope/report.json). Aucune confiance aux artefacts livrés.

## Chiffres rejoués (v2) vs livrés

| Run | Livré | Rejoué | Concordance |
|---|---|---|---|
| baseline-public | 12 occ / 6 règles | **12 / 6** | nœud-par-nœud identique |
| baseline-auth | 1328 occ / 14 règles / 215 inc | **1333 / 14 / 213** | par règle identique sauf `color-contrast` 401→406 : **+5 nœuds sur `/queue`** = lignes transitoires (row `.is-completed` de grâce : strong/small/time/tag — markup amont `opacity:0.7`, absent au moment du run livré). Classe connue de variance dynamique (cf. v1). `lcnm` 75 ✓, `region` 601 ✓, `html-lang-valid` 42 ✓, toutes les autres règles à l'unité près ✓ |
| Gap `/diff/<u>/extract` | 21 occ baseline → 0 final | **21 → 0** | baseline : CC 11 + lcnm 2 + lang 1 + landmark 1 + heading 1 + region 5 = 21 exact ; final 0. Page bien dans le scope auth (`$CD_API_DOCS_UUID` expansé) |
| `.regex-highlight` | 6,7:1 clair / 7,4:1 sombre | **6,68:1 / 7,43:1** mesurés en computed style live | claim reproduit |
| final-public | 0/0/0 | **0/0/0** | identique |
| final-auth | 0 viol / 117 inc / 48 pages | **0 viol / 117 inc / 48 pages** | identique nœud-par-nœud (l'état addwatchui-live-preview rejoué séparément : inc 1 identique) |
| verify.mjs | 29 PASS / 0 FAIL | **29 / 0** | sondes computed clair+sombre rejouées en live |
| incomplete-probes | 117 items, 0 CONFIRMED (75R+42NA) | **117 items, 0 CONFIRMED** | bit-identique |
| eval-final | 1340→0, missing=[], unresolved=[] | **1325→0** recomputé (mon baseline) / 1333→0 avec l'état re-scanné | mêmes résultats structurels |
| install-build (clone+apply+venv+npm build+datastore frais) | 0 viol / 117 inc | **1 viol / 118 inc** | **écart — voir F1** ; scopeHash b↔f identiques sur mes runs (`e8aa2d8` public, `c21829a` auth) |
| provenance.json | 43 entrées | **43/43 sha256 revérifiés** + `rehash-provenance.py --strict` OK | `auth.json` éphémère gitignoré |
| styles.css buildé | dans patch | **byte-identique** sha256 `5c397514…` au `npm run build` de mon clone patché | artefact compilé authentique |
| seed.py | exit 0 | **exit 0** (2 exécutions, proxy inclus) | wart W2-v1 corrigé |
| login.mjs | argv positionnel | **OK** `node login.mjs <base> <pass>` | — |

## Corrections v1 → v2 vérifiées

- **W1-v1 (gap /extract)** : clos — page ajoutée au scope auth, violation fixée (`color:red` inline → `.regex-highlight`, ratios re-mesurés ci-dessus).
- **W2-v1 (seed.py crash)** : clos — `log()` → `print()`, exit 0, résumé JSON imprimé.
- **W3-v1 (axe version doc)** : clos — `tools/package.json` épingle `axe-core@4.14.0` exact + lockfile ; `axeVersion:"4.14.0"` tracé dans tous les scope/report.json. Le re-run sous 4.14 est réel : `label-content-name-mismatch` ×75 capturé par 4.14 (règle absente de 4.13), baseline rejouée = 1328→1333 occ.
- **W4-v1 (regles_baseline)** : clos — 14 ids auth réels du rapport (region, color-contrast, lcnm, html-lang-valid, landmark-one-main, page-has-heading-one, target-size, label, link-in-text-block, empty-table-header, select-name, link-name, image-alt, scrollable-region-focusable) + 6 public.
- **W5-v1 (incomplets)** : clos — `conventions.incomplets` = nœuds (215/117 vérifiables dans les rapports).
- **W6-v1 (`</h3>` mismatch)** : clos — hunk patch `add-watch-ui.html` corrige en `</h2>`, DOM rendu sain.

## F1 — résidu introduit par le patch (falsifie « final 0 viol » sur contenu vivant)

`/queue` — **1 violation color-contrast 1,05:1** mesurée sur mon install-build `:5016` (thème clair) :

```
.worker-busy > .watch-cell > small
<small style="color: var(--color-text);">http://127.0.0.1:5598/legacy-portail.html</small>
fg computed #333333 (light : --color-text→#333) sur bg effectif #262626 (surface queue sombre permanente) × opacity .7 → 1,05:1
```

- **Origine** : hunk `renderWatchCell` du patch — `'<br><small style="opacity:0.7;">'` (amont : hérite `td{color:var(--color-white)}` → blanc ~10:1) remplacé par `'<br><small style="color: var(--color-text);">'`. Le panneau `#queue-page` est **toujours sombre** (`color: var(--color-white)`, stripes `rgba(255,255,255,.04)`), quel que soit le thème. Les autres hunks du même fichier utilisent `#c2c2c2` — correct ; ce hunk choisit le mauvais token.
- **Surface** : tout row `/queue` re-rendu par JS (socket/poll `updateFromSnapshot`) pour un watch ayant title+url — workers busy ET queued ET `.is-completed` (ce dernier n'existe qu'en JS). Thème clair uniquement (en sombre `--color-text`=blanc → conforme). Le chemin Jinja server-side `<small>{{ w.url }}</small>` est sain.
- **Pourquoi le livré dit 0** : détection stochastique — la row n'existe que pendant un recheck ; le run livré n'avait pas de worker occupé à cet instant. Le défaut est déterministe dans le markup, non dans le déclenchement axe. Reproduit à volonté : recheck API → `<tr class="worker-slot worker-busy">` avec le `<small>` fautif.
- Le même anti-pattern `var(--color-text)` inline existe dans `settings_llm_tab.html` (résultat test LLM) — **mais** là la surface est claire (`rgba(39,174,96,.08)` sur fond page) → conforme dans les deux thèmes. Pas un bug.
- **Impact verdict** : 1 occurrence réelle WCAG 1.4.3, introduite par le patch, sur URL du scope. Même classe de défaut que le gap /extract de v1 (résidu trouvé par audit indépendant). Fix trivial attendu : `var(--color-text)` → `var(--color-white)` ou `#c2c2c2`.

## Warts (non bloquants)

- **W2-v2 — states.json portabilité** : l'état `addwatchui-live-preview` hardcode `http://127.0.0.1:5599/api-docs.html` dans son setup. Si les fixtures tournent sur un autre port (`--fixture-port 5699` seul), l'état scanne une preview vide **silencieusement** (0 viol, 0 error, 1 inc — ligne présente mais creuse). J'ai dû servir `:5599` en plus pour que l'état exerce le markup ; rejeu séparé = 20 occ baseline identiques au livré. À documenter dans le manifest ou paramétrer.
- **W3-v2 — inc /queue dynamique** : `+1` incomplet `color-contrast` inter-run sur `.spinner-wrapper .status-text` (statut « Checking… » d'un fetch en vol) — non-détermination axe sur contenu transitoire, même classe que l'overlay heart de v1.

## Chasse hors-scope / 2.5.3 (demandée)

- 88 routes Flask énumérées ; GET HTML hors-scope propres sur build patché (`/settings/apprise` 0, `/backups/restore` 0). Les « violations » sur `/gc-cleanup`, `/queue.json`, `llm-summary/prompt` = endpoints JSON — `html_has_lang`/`document-title` sur le wrapper `<pre>` de Chrome = faux positifs, pas du markup produit.
- 2.5.3 résiduels : seuls les spans `role=note/insertion` du markup diff amont (aria-label « Added text »/« Changed into » sur texte visible) — axe-silencieux, couleurs 5.51/5.74 mesurées ; déjà classés N-A revue manuelle en v1 (W7). Amont, pas patch.

## Conclusion

Claims v2 tous rejoués et corroborés sur infra indépendante — sauf le « 0 violation final » : **1 violation résiduelle introduite par le patch** (`/queue`, `var(--color-text)` sur surface sombre, thème clair, chemin JS). Détection stochastique mais défaut déterministe dans le code. Le gap /extract de v1 est proprement clos, l'outillage corrigé, la provenance intègre. Verdict **PARTIAL** — à router vers fixer v3 pour le token de `renderWatchCell` (et en profiter pour paramétrer le port fixture de l'état live-preview).
