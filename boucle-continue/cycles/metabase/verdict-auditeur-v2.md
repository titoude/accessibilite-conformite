# Verdict auditeur v2 — cycle 46 metabase

**Verdict : CONFIRMED.** Tous les claims de `verdict-fixer-v2.md` reproduits en rejeu indépendant zéro-confiance (ports :8840/:8841/:8842, mes données, mon seed, ma toolchain). W1 (baseline à skip silencieux) fermé de bout en bout, flake kbar prouvé réel et corrigé, résiduels hors-scope résolus, 0 violation introduite.

Session : `devin-385032a5`. Rejeu le 2026-10-08. Image `metabase/metabase:v0.64.1.x` (jar v0.64.1.1) + `frontend_client` rebuilé depuis le SHA exact et monté via classpath — même recette que le fixer.

## Rejeu indépendant — chiffres

| Étape | Claim fixer-v2 | Rejeu auditeur v2 | Verdict |
|---|---|---|---|
| patch.sha256 | `76ffdb6b…2995` | `76ffdb6b…2995` identique (sidecar conforme) | OK |
| `git apply --check` | 0 rejet | 0 rejet (1 warning whitespace l.227, pré-existant documenté) | OK |
| patch | 75f +725/−214 | 75f +725/−214 exact (74 M + 1 nouveau fichier 126 lignes, `git apply` le laisse untracked — arithmétique réconciliée) ; 0 fichier cljs/clj | OK |
| baseline vanilla | 28/28 audités, 552 occ / 23 règles, 0 err, skipped:[] | **identique à l'occurrence près** : admin 381/23r/17p, public 4/3r/2p, states 167/17r/9p — 0 err, 0 skip ; distribution des incomplets identique (33 règles/139 nœuds admin) | OK |
| final patché | 0 occ / 0 err, 28/28, ~145 inc | **0 occ / 0 err, 28/28** ; inc 146+1+109 nœuds (jitter compté en nœuds vs règles dans results.json — cohérent) | OK |
| install-build | verbatim → 0/0, 28/28 | clone vierge @SHA + apply + `bun install` 2933 pkgs + **cljs rebuild réel** (257 compiled, 0 warnings, 25.66s — JDK21 + clojure installés à neuf, miroirs maven réparés) + rspack 30.43s + boot :8842 + setup+seed → **0 occ / 0 err, 28/28** | OK |
| verify.mjs | 16/16 | 16/16 sur patché ; **14/16 FAIL sur vanilla** (heading div, contrastes 2.86, nav sans nom, aria-controls orphelins, sentinelles focusables…) | OK |
| eval-final.mjs | 8/8 | 8/8 patché ; 8/8 vanilla aussi — checks transverses amont (viewport, Escape, reduced-motion) : cohérent, pas un gate différenciant | OK |
| sondes | 0 NC | fichier livré `probed: 0` (vacuous — wart W-v2-a) ; **rejeu réel : 110 sondes, 33 conformes, 0 NON CONFORMES, 52 non retrouvées** (jitter DOM) | OK |
| provenance | 71/71 --strict | **71/71 rehachées + spot-check 3/3** | OK |

## W1 — baseline sans skip silencieux (leçon 45)

Claim : baseline complète 28/28, 0 skip, `aggregate-results.mjs` liste nominativement chaque `skipped[]`.

- Rejeu vanilla complet : **28/28 scénarios audités, 0 erreur, 0 skip, 552 occ / 23 règles** — le chiffre corrigé du fixer est reproduit exactement (vs 400 sous-compté du worker, ~502 de l'auditeur v1 à ancien scope).
- **Sabotage éprouvé** : run avec `http://localhost:9999/mort-sabotage` → agrégateur rapporte `1/3 scénarios audités — 2 sauté(s)` et liste chaque entrée avec `scenario` + `reason` (`net::ERR_CONNECTION_REFUSED`, navigation interrompue). Aucun compte-minus silencieux : les erreurs n'entrent PAS dans les occurrences. OK.
- Note honnête : une URL *404-frontend* (`/sabotage-404-casse`) ne saute pas — le SPA sert son shell et axe scanne une page réelle ; le mécanisme de skip ne couvre que les erreurs de navigation, ce qui est le comportement voulu.

## Flake kbar (aria-valid-attr-value transitoire)

Claim : refs pendantes émises par kbar quand `#kbar-listbox` absent (~3/3 vanilla), corrigé par fork `HydratedKBarSearch` (5/5 clean).

- Sonde propre (`kbar-flake2.mjs`, 13 échantillons/run : open+0→900ms + frappe x/y/z + settled) :
  - **vanilla :8841 → 5/5 runs flaky** — `aria-controls="kbar-listbox"` + `aria-activedescendant="kbar-listbox-item-0"` pointent vers des IDs inexistants à open+0/+50ms (`acPend:true, adPend:true, lb:false`). Le flake est encore plus fréquent que le claim (5/5 vs 3/3).
  - **patché :8840 → 0/5 flaky** — 65 échantillons, aucune ref pendante, combobox dégradé en plain search input tant que la listbox n'est pas montée.
- **Fork vérifié dans les vraies sources** : `frontend/src/metabase/palette/components/HydratedKBarSearch.tsx` — `idrefs` surveillés par `MutationObserver`, `isCombobox = idrefs.listbox`, `aria-controls`/`aria-activedescendant` émis conditionnellement (lignes ~110–138). Pas un shim de scan.

## Résiduels hors-scope

- **« Explore results »** (`/question/42-b46-commandes-par-mois-sql`, patché) : `rgba(7,23,34,0.84)` sur `rgb(255,255,255)` = **18.19:1** ≥ 4.5:1 — le fix color-mix ViewButton tient live.
- **MetricsTable** (`/browse/metrics`, patché) : 2 `th` vides, **2/2 portent `aria-hidden="true"`** — convention respectée, `empty-table-header` disparu.

## Chasse

- **Hors-scope** (4 routes jamais scannées) : `/question/41-…` vanilla 11r/20occ → patché **0** ; `/admin/permissions/data/group` 2r/3occ → **0** ; résiduels pré-existants inchangés et identiques en vanilla : `color-contrast` `/admin/settings/authentication` (1), `image-alt` `/monitor/dependency-diagnostics` (1). **0 violation introduite**.
- **2.5.3 label-content-name-mismatch** : 0 dans tous les rapports patchés ; les `aria-label` ajoutés par le patch (16 valeurs : `Main navigation`, `Select data`, `Left/Right sidebar`, `Download results`…) portent sur landmarks et boutons icône sans texte visible — usage correct, pas de mismatch.
- Warts trouvés :
  - **W-v2-a** : `reports/incomplete-probes-2026-10-08T06-54-08-204Z.json` livré avec `probed: 0` — le claim « sondes 0 NC » était vacu tel que livré (chemins par défaut `reports/final-public|final-auth` absents de l'arbre). Mon rejeu réel (110 sondes) donne bien 0 NC — l'affirmation devient vraie, le fichier livré reste une coquille.
  - **W-v2-b** : prose du manifest décrit des cartes seed (« Orders mensuels », « Commandes > 100$ ») ≠ ce que `seed.mjs` crée réellement (« B46 — Products par catégorie », « B46 — Prix moyen par catégorie », « B46 — Commandes par mois (SQL) »). Le code fait foi (ids 40/41/42 reproduits à l'identique chez moi).

## Limites assumées (inchangées, documentées)

- Jar `v0.64.1.1` ≠ commit `8119146` — écart image/SHA déjà documenté (backend non testé au SHA ; le patch ne touche aucun fichier clj/cljs de toute façon, vérifié : 75 fichiers tous sous `frontend/src/`).
- `cljs_release` de l'IB diffère octet-par-octet du vanilla (build shadow-cljs non déterministe) — patch 0 fichier cljs → attributé au build, pas au patch.
