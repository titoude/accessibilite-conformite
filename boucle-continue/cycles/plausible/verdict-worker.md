# Cycle 48 — verdict-worker — plausible/analytics

Premier Elixir de la boucle. Stack mixte Phoenix LiveView + React esbuild + Tailwind, backend PG + ClickHouse.

## Chaîne d'évidence rejouée

| Étape | Résultat |
|---|---|
| Clone @ SHA b89b749 (master HEAD) | OK — pinné manifest.json |
| Boot réel :89xx (mix/phx local, containers PG+CH) | OK — :8950 app, :8952 PG, :8953 CH |
| Seed (user, 2 sites, 711k events CH, shared link) | OK — tools/seed.sh + seed-info.json |
| Pureté vanilla avant baseline | OK — marqueur patch absent (leçon 40) |
| Baseline axe 4.14.0 (18 auth × 11 états + 6 public) | 13+6 règles, 195+14 occurrences, 292+34 incomplets, 0 erreur |
| Fixes vraies sources (35 fichiers, HEEx + React + CSS) | OK — rebuild mix assets.build |
| Rescan final | **0 violation / 0 erreur** auth + public |
| verify.mjs live | 37/37 OK (3 N-A documentées) |
| eval-final.mjs live | 8/8 OK (1 N-A) |
| Sabotage (aria-label bouton options supprimé) | FAIL nommé attendu : "dashboard: bouton options nommé" |
| Vanilla (git stash patch) | 18 FAIL attendus, tous nommés |
| incomplete-probes.mjs | 325 sondés : 322 conformes, 0 non-conformes, 3 non-retrouvées (ticks SVG d3 — coordonnées recalculées par render, documenté) |
| install-build verbatim clone propre @SHA | `git apply --check` OK, boot.sh + seed + rescan : **0 viol / 0 err** (:8960) |

## Pièges découverts (nouveaux pour la boucle)

- **Phoenix LiveView** : les attributs non déclarés sur un slot/composant sont *dropped* au rendu → `attr :button_aria_label` obligatoire ; `aria-checked={false}` booléen est omis → émettre la string `"false"` (aria-required-attr).
- **CH image alpine** : `CLICKHOUSE_SKIP_USER_SETUP=1` + `CLICKHOUSE_DB` requis sinon le serveur exige un mot de passe — corrigé dans boot.sh (leçon boot).
- **seeds.exs non idempotent** et démarre l'Endpoint → seed avant le serveur, reset DB pour rejeu.
- **React root** = `#stats-react-container`, pas `#app`.

## Comptes régénérés du diff final (leçon 39)

patch.diff : 35 fichiers, +157 −105. Probes : 325 nœuds incomplets traités.

## Livrables

manifest.json, patch.diff + .sha256, provenance.json (--strict), results.json (pas d'auto-verdict), scope-compare.json, reports/{baseline-auth,baseline-public,final-auth,final-public,install-build,install-public,incomplete-probes.json}, tools/{audit,boot,login,seed,verify,eval-final,incomplete-probes}.mjs, urls-*.txt, seed-info.json, verdict-worker.md.
