# Verdict worker — cycle 50 : castopod v1.15.5

SHA épinglé : `12720055b475d6d27c9e1e9f9053d0fa491c061c` (tag v1.15.5, ad-aures/castopod).
Pas d'auto-verdict — résultats mesurés ci-dessous, auditeur tranche.

## Chiffres mesurés (rapports/ joints, locale en-US partout)

| Surface | Baseline | Final | Install-build verbatim |
|---|---|---|---|
| public (9 urls + 1 état mobile-390) | 23 occ / 6 règles / 0 err | **0 / 0 / 0 err** (28 inc) | 0 / 0 / 0 err (28 inc) |
| auth (22 urls + 3 états) | 212 occ / 11 règles / 0 err | **0 / 0 / 0 err** (194 inc) | 0 / 0 / 0 err (199 inc) |

- verify.mjs : **20/20 OK** ; eval-final.mjs : **10/10 OK** (2 N-A : pas de skip-link dans le produit, aucune région live).
- Sabotage : stash du fix 2.5.3 → `FAIL 2.5.3: bouton listes — aria-label=More texte=2026` (nommé) ; restore → 20/20.
- Sondes incomplete : 243 sondés → **66 conformes / 0 NON-CONFORME / 177 N-A**. 4 vrais NON-CONFORME trouvés par les sondes (blanc/90 sur `bg-accent-base/75` au-dessus du gradient cover = 1.07:1) → corrigés aux sources (`bg-accent-base` plein, mesuré 5.4:1).
- Route-404 : réponse JSON — scénario conservé, exclusion documentée (expectHttp:404), 0 skip silencieux.

## Stack (1re boucle)

CodeIgniter 4 / PHP 8.2 + JS vanilla TS + Tailwind, thèmes `cp_app` (public) et `cp_admin`. MariaDB 11.4 + `php spark serve` (container cp50-php:8.2, Dockerfile cycle) — écart image/SHA : nul, le produit tourne depuis les sources du SHA.

## Corrections (30 fichiers, +133/−53 — patch.diff)

- Tooltip.ts : aria-label sur éléments nommables sans texte (2.5.3), `role=tooltip`, ancrage DOM dans le landmark parent.
- Dropdown.ts : Escape ferme le menu + refocus bouton (trou produit réel détecté par eval).
- Charts.ts : `<svg>` amCharts en aria-hidden + tabindex internes retirés (landmark-unique/nested-interactive) ; menu export intact.
- xml-editor.ts : aria-label du `.cm-content` résolu depuis `label[for]` (aria-input-field-name).
- markdown-write-preview.ts : `::slotted(button)` couleur `text-muted` (était opacity .5 → 3.75:1).
- Colors.php : `accent-base` pine 29→24 (≈5.6:1 sur blanc).
- publication_pill() : textes `-800` sur fonds `-50`.
- Button.php : variante `info` blue-600/700 (était 3.67:1).
- cp_admin : `<dl>` autour des dt/dd de _user_info, navs aria-label distinctes, more-dropdown aria-label épisode, `alt=""` sur avatars redondants, i18n clés Navigation ajoutées.
- cp_app : header `bg-accent-base` plein, fermeture `</section>` manquante, navs `py-2 inline-flex` (target-size ≥24px), `z-10` parasites retirés.

## Pièges castopod (utiles auditeur)

1. **Trois couches de cache** : `writable/cache/page_*` (rendu), `writable/cache/vite-manifest` (hashes assets), OPCache. Stale manifest → CSS 404 → fixes Tailwind invisibles à axe. Purge obligatoire avant CHAQUE rescan :
   `docker exec castopod50 sh -c 'find /app/writable/cache -type f ! -name index.html -delete'`
2. **Nouvelles classes Tailwind n'existent qu'après rebuild** (`pnpm run build`) — `bg-accent-base/90` non émise avant build.
3. **Couleurs runtime** : `/themes/colors` sert les CSS vars depuis `app/Config/Colors.php` (cache `colors.css` décennal).
4. Les ids DB varient selon l'ordre de seed — `seed.sh` écrit `seed-info.json` + `urls-auth.resolved.txt` (leçon 44). BenchSeeder.php recopié dans le checkout à chaque seed.

## Fichiers du cycle

patch.diff + patch.diff.sha256, manifest.json (auditCommands), results.json, incomplete-probes.json, tools/ (audit.mjs v11-c50, verify.mjs, eval-final.mjs, incomplete-probes.mjs, login.mjs, boot.sh, seed.sh, BenchSeeder.php, urls-public.txt, urls-auth.txt, seed-info.json, auth.json, auth-i.json, scope.json, package.json, Dockerfile.php), reports/ (baseline-*, final-*, install-*), provenance.json.
