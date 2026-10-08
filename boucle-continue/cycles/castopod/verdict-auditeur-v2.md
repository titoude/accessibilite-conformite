# Verdict auditeur v2 — cycle 50 castopod

**Auditeur** : devin-b33796ccfdd7456a87e79b2627c995bc (auditeur v2 indépendant, commandé par Devin Bot/Nighty-Hub)
**Produit** : ad-aures/castopod @`12720055b475d6d27c9e1e9f9053d0fa491c061c` (v1.15.5, CodeIgniter 4/PHP 8.2 + TS vanilla + Tailwind + MariaDB 11.4)
**Objet audité** : verdict-fixer.md (fixer devin-2fd66a4c) — réouverture des réserves F1–F5 de l'audit v1 (devin-4a66e5a1)
**Méthode** : rejeu intégral zéro-confiance — clones propres, image `cp50-php:8.2` reconstruite localement, instances propres sur **:9140/:9141 (vanilla, sfx -v2)** et **:9120/:9121 (install-build, sfx -a2)**, DB mariadb fraîches + seed propre, aucune instance ni donnée du worker/fixer/auditeur v1 réutilisée.
**axe** : 4.14.0 · playwright 1.63 (chromium headless shell 1243) · runner audit.mjs v12-c50 relu avant usage

## Verdict : **CONFIRMED** — les 5 réserves F1–F5 sont réellement fermées ; tous les chiffres du fixer rejouent à l'identique ou au bruit près documenté.

## Rejeu point par point

| # | Claim fixer | Rejeu auditeur v2 | Verdict |
|---|-------------|-------------------|---------|
| 1 | patch.diff sha256 `a794bcd8…`, 31f +145/−63, apply 0 rejet | sha256 recomputé = `a794bcd83e78dbc31808c5295e58797c28409f1edf160de74f0d74854a572b4d` (sidecar conforme) ; recompte regex = **31 fichiers, +145/−63** ; `git apply --check` sur clone vierge @SHA = **0 rejet**, `git apply` propre | CONFIRMÉ |
| 2 | install-build verbatim → rescan 0 viol/0 err sur 36 scénarios | Recette verbatim rejouée : clone @SHA + apply + composer --no-dev + pnpm install/build + boot.sh + seed.sh + login. Rescan : **install-public 0 occ/11 scénarios/0 err, install-auth 0 occ/25 scénarios/0 err = 0/0 sur 36/36** | CONFIRMÉ |
| 2b | baseline complète 341 occ/13 règles (results.json) | Baseline vanilla rejouée sur MA DB : **public 28 occ/6 règles + auth 313 occ/11 règles = 341 occ, union 13 règles, 0 erreur, 36/36 scénarios**. Match **exact règle par règle** avec le `detail` du results.json commis (mieux que « à bruit près ») | CONFIRMÉ |
| 3 (F1) | gen-urls.sh résout les ids depuis la DB seedée | Sur MA DB : podcast résolu **=1** (worker avait 4) → urls-auth.resolved.txt contient 8 URLs `/cp-admin/podcasts/1*` + `/cp-admin/fediverse/blocked-actors` + `/cp-admin/podcasts/1/episodes/1*` — 22 auth + 9 public générées ; la baseline complète (341) couvre les trous de l'audit v1 | CONFIRMÉ |
| 4 (F3) | route-404 réellement scannée : vanilla 3r, patché 0 | Vanilla : `/@auditwaves/chemin-inexistant [state:route-404]` → **3 règles/5 occ** (color-contrast, landmark-one-main, region) — le rapport commis dit aussi 5 occ (la consigne « 6 occ » était imprécise) ; patché : **0** ; hunk `error_404.php` `<main class="flex flex-col items-center">` vérifié dans le patch | CONFIRMÉ |
| 5 (F4) | verify 20/20, id dynamique | Install : **20/20 OK, 0 FAIL, 0 N-A** ; résolution dynamique prouvée sur vanilla : `button-name … (podcast=1)` — il a trouvé MON id=1, pas le 4 en dur | CONFIRMÉ |
| 5b | eval 10/10 | **10/10 OK (2 N-A : skip-link, aria-live)** rejoué à l'identique | CONFIRMÉ |
| 5c | sabotage → FAIL nommé ; vanilla → FAILs | `git stash themes/cp_app/podcast/episodes.php` + purge cache → **19/20, FAIL nommé** « 2.5.3 bouton listes — pas d'aria-label divergent du texte » ; verify vanilla → **7/20, 13 FAIL nommés** | CONFIRMÉ |
| 6 (F5) | sondes rejouent les états ; 67 OK/0 NC/88 N-A sur 155 | Mon rejeu : **227 sondés → 67 OK / 0 NON-CONFORME / 160 N-A**, dont 63 entrées `[state:…]` dont les setups ont été rejoués. OK et NC identiques au claim ; N-A suit mon incomplet (227 vs 155 — les incomplets axe varient entre runs) | CONFIRMÉ |
| 7 (F2) | aggregate-results.mjs → erreurs_liste nominative | Sabotage : scan de 2 URLs auth sans storage-state → 2 erreurs « redirection vers page de connexion » ; aggregate écrit `erreurs: 2` + `erreurs_liste` nominative (scenario::reason) et liste « ÉCHOUÉ » à l'exécution ; results.json commis == agrégat des report.json commis sur baseline+final+install (**MATCH partout**) | CONFIRMÉ |
| 8 | provenance --strict 44/44 | `rehash-provenance.py --strict` → **44 empreintes re-hachées, spot-check 3/3, exit 0, aucun diff** — toutes les empreintes livrées étaient à jour | CONFIRMÉ |

## Chasse (hors-scope / violations introduites / slugs i18n / warts)

- **Hors-scope** : les 31 fichiers sont tous a11y (thèmes cp_app/cp_admin, composants, Colors.php, modules TS tooltip/dropdown/charts/markdown/xml, Navigation.php en). Lignes supprimées = couleurs/contrastes (accent-base pine 29→24, pills text-*-600→-800, Button info blue-500→600) et landmarks — aucun changement de logique métier.
- **Violations introduites** : 0 sur le rescan 36 scénarios + verify 20/20 + eval 10/10 — aucune régression détectée.
- **Slugs i18n (leçon 43)** : les clés ajoutées (`Navigation.main`, `Navigation.podcast`, `Navigation.episode` + `Common.more`, `Navigation.toggle_sidebar`) résolvent — **wart W2** ci-dessous.
- **error_404.php** : contenu re-wrapé dans `<main>` — vanilla 3 règles → patché 0, vérifié sur instance réelle.

## Warts / réserves v2 (n'entament pas le verdict)

- **W1** — `provenance.json` contient `"generatedAt": null` (champ cosmetique non renseigné ; les 44 empreintes elles-mêmes sont strictement à jour).
- **W2** — les 3 nouvelles clés `Navigation.{main,podcast,episode}` ne sont traduites qu'en `en` (36 autres locales absentes). Vérifié dans `vendor/codeigniter4/framework/system/Language/Language.php` `getLine()` : étape 4 = fallback `en` — les lecteurs d'écran entendent les libellés **anglais**, jamais le slug brut « Navigation.main ». Manque de complétude i18n, pas une exposition de slug.
- **W3** — imprécisions de la consigne (pas de l'artefact) : « 14 règles » vs 13 union dans results.json, « 6 occ route-404 » vs 5 dans le rapport commis ; REGISTRE ligne 50 mélange des chiffres worker-ère (sondes 243→66/177, 30 fichiers +133/−53, « 35 scénarios ») avec le résumé fixer — la vérité auditée = **36 scénarios, 13 règles, 31 fichiers +145/−63, sondes 155→67/0/88 (fixer) puis 227→67/0/160 (v2)**. Clause v2 ajoutée au registre.
- **W4** — nit F6 persistant : manifest outils déclare pnpm 12.10.1, box embarque 11.21.0 (corepack télécharge 12.10.1 si exigé) — build fonctionnel dans les deux cas, cosmétique.

## Chiffres audités (rejeu auditeur v2)

- **Baseline vanilla** : 341 occ / 13 règles union / 0 erreur / 36 scénarios (28 public + 313 auth) — **identique au results.json commis, règle par règle**
- **Install-build patché** : **0 violation / 0 erreur / 36 scénarios** (route-404 comprise, réellement scannée)
- **Delta** : 341 → 0
- **verify.mjs** : 20/20 install · 7/20 vanilla (13 FAIL nommés) · sabotage → FAIL nommé
- **eval-final.mjs** : 10/10 (2 N-A)
- **Sondes** : 227 sondés → 67 OK / 0 NC / 160 N-A
- **Provenance** : 44/44 strict + spot-check 3/3
- **results.json** : synchronisé sur les rapports commis (MATCH baseline/final/install)

→ Le patch est sain, le pipeline est rejouable de bout en bout par un tiers, et les réserves F1–F5 de l'audit v1 sont fermées de façon vérifiable. **CONFIRMED.**
