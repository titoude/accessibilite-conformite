# verdict-fixer-v4 — cycle 31 phpmyadmin

**Fixer v4 : session `devin-59d03a1958d64071baa9c4d15e1307e5`** (spawnée par
devin-3cde6939fc0b489ab7c0d2ffa16c3255), sur la base du ré-audit v4
(`0d96566`, CONFIRMED + 2 résiduels + warts doc déjà corrigés par
l'orchestrateur `35f4ca6`). Stack propre construite par moi :
`~/work/pma31-v4-fixer` (clone @e7e3f96 + patch + `yarn build` + composer
docker) servie par `pma31f-web`/`pma31f-db` sur **:8520** ; outillage rejoué
depuis `~/work/run31v4f`, axe-core **4.13.0** (pin respecté), reset-theme
exécuté avant le scan. Toutes les corrections sont **exécutées en live**.

## Résiduel 1 — course thème : la garantie « aucun écrivain en vol » est maintenant VRAIE

L'auditeur a prouvé 1 annulation de mutation sur 122 : `/navigation&ajax_request=1`
part en XHR ambiante après chaque goto, non couverte par les `page.route`
permanents. Fix v4 (audit.mjs, reset-theme.mjs, login.mjs — même mécanisme) :

- **Verrou de mutation universel** : route `**/index.php**` enregistrée EN
  DERNIER (évaluée en premier) → pendant une fenêtre `withPrefMutation`,
  TOUTE requête index.php est avortée ; hors verrou `fallback()` rend la main
  aux blocages permanents (/git-revision, /version-check) et au réseau.
- **Quiescence pré-mutation** : on n'attend que les requêtes déjà en vol au
  verrou (snapshot post-settle 300 ms) ; le critère de libération est
  **`response`** (en-têtes reçus = middleware déjà exécuté, write engagé),
  pas `requestfinished` — qu'un body non consommé peut différer à vie.
- **Deux fuites de suivi tuées** : `route.abort()` n'émet pas toujours
  `requestfailed` → `abortedInLock` (WeakSet) marque à l'évaluation de la
  route, quel que soit l'ordre des événements ; une navigation
  (goto/about:blank/reload) tue le loader du document et ses événements
  terminaux ne viennent JAMAIS alors qu'Apache les a servis (prouvé par
  access-log) → époques de navigation, `killedAt` + grâce serveur 2 s.
- **Échec bruyant conservé** : >15 s en vol = mutation refusée (visible dans
  le scan), garde reload `link[href*=theme.css]` en filet.

**Preuve par exécution** : 20 mutations réelles alternées (bootstrap/dark,
pmahomme/light, metro win/teal/redmond/blueeyes/mono, original/light) sous
spam continu `POST /navigation&ajax_request=1` (~30 ms) → **20/20 PASS,
0 annulation**, 216 requêtes avortées pendant les fenêtres. **Sonde
indépendante** (`docker logs pma31f-web`) : 22 `route=/themes/set` servis +
les `theme.css` des 4 thèmes mutés réellement servis (bootstrap 373, metro
210, original 105, pmahomme 198 requêtes). Avant le fix, la même charge
produisait le blocage « requêtes pré-verrou en vol » (loader mort par
navigation) — diagnostic instrumenté, puis éliminé par les époques.

## Résiduel 2 — 4 occurrences hors-scope → scope v4 (0 viol rejoué)

`urls-auth.txt` **44 → 47** ; les 3 pages corrigées dans le patch et mesurées
0 violation au rejeu :

| Page | Occurrence | Fix |
|---|---|---|
| `/database/events` | image-alt ×1 | `toggle-{dir}.png` → `alt="" aria-hidden="true"` (décorative : le conteneur porte déjà `title`) — même convention que les dot.gif v1 ; `tracking/tables.twig` avait la même image, corrigée par cohérence |
| `/server/status/queries` | heading-order ×1 | `<h3>` « Questions since startup » → `<h2>` (cohérent avec le fix v3 de `status/index.twig`) |
| `/preferences/navigation` | color-contrast ×2 (`#d63384`/`#eee` = 3,90:1) | `$code-color` → **`#ad1457`** dans les 4 thèmes : **6,0:1** vs `#eee`, 6,97 vs `#fff`, 4,75 vs `#d5d5d5` (pire gris) ; `$code-color-dark` `#ce729a` inchangé. Vérifié compilé : `--bs-code-color: #ad1457` dans les 4 `theme.css` servis |

## Chiffres rejoués (instance fixer :8520)

| Contrôle | Résultat |
|---|---|
| reset-theme + scan complet v4 | **64/64 scénarios — 0 violation, 0 erreur**, 1670 incomplets (47 pages + 17 états, wait=1500) |
| verify.mjs | **25/25 PASS** |
| eval-final.mjs | **0 FAIL** — 9 pages en axe indépendant dont les 3 nouvelles (0 viol chacune) + dup-ids + rejoues |
| sondes incomplets | **1670 : 1630 PASS / 40 N-A documentés / 0 FAIL** (`reports/probes/incomplete-probes.json`) |
| patch.diff | régénéré depuis l'arbre appliqué+vérifié : **88 fichiers** (+1138/−250) ; `git apply --check` OK sur clone vierge @e7e3f96 |
| patch.diff.sha256 | régénéré : `5833542a…` (= sha256(patch.diff), sha256sum -c OK) |

Incomplets détail : color-contrast 1642, th-has-data-cells 12, target-size
10, aria-allowed-role 1, duplicate-id-aria 4, aria-prohibited-attr 1 — même
bruit heuristique axe que les runs précédents, sondé à 0 FAIL.

## Fichiers modifiés (outillage)

- `tools/audit.mjs` — verrou universel + quiescence `response` + settle 300 ms
  + `abortedInLock` + époques de navigation (`killedAt` 2 s) ; erreur
  quiescence enrichie des URLs coincées.
- `tools/reset-theme.mjs` — idem (même verrou, mutations `page.request.post`).
- `tools/login.mjs` — idem (reset initial pmahomme/light).
- `tools/urls-auth.txt` — 44 → 47 lignes.
- `tools/eval-final.mjs` — EXTRA +3 pages (évaluation indépendante des fixes).
- `patch.diff`, `patch.diff.sha256`, `manifest.json` (final_v4),
  `results.json` (fixes_appliques_v4, reste_v4 vidé), `reports/final/*`,
  `reports/probes/incomplete-probes.json`, `REGISTRE.md`.
