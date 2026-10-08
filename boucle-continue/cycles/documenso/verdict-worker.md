# Verdict worker — cycle 53 : documenso/documenso

- **SHA** : `38ecb217effcc53a7164d7123c51336f636bd3b2` (v2.20.0, HEAD main au pin)
- **Stack** : React Router 7 + tRPC + Prisma/Postgres + Tailwind + shadcn/Radix + Lingui
- **Boot** : dev server vite `:9400` (patchable en direct), postgres:15 `c53-pg`, inbucket `c53-mail` — tout dans `tools/boot.sh` rejouable (`APP_PORT/PG_PORT/MAIL_*` injectables)

## Chiffres

| Scan | Violations (règles/occ) | Erreurs | Incomplets | Pages |
|---|---|---|---|---|
| baseline auth | 22 / 269 | 0 | 158 | 24 |
| baseline public | 7 / 26 | 0 | 57 | 14 |
| **final auth** | **0 / 0** | **0** | 76 | 24 |
| **final public** | **0 / 0** | **0** | 43 | 14 |
| **install auth (:9410)** | **0 / 0** | **0** | 80 | 24 |
| **install public (:9410)** | **0 / 0** | **0** | 43 | 14 |

Baseline = **295 occurrences / 24 règles uniques → 0** sur 38 scénarios (15 urls auth + 9 états auth + 10 urls publics + 4 états publics).

- **verify.mjs** : 27/27 checks OK (:9400 et :9410 patché)
- **eval-final.mjs** : 12 OK / 0 FAIL / 1 N-A (badge statut absent du DOM sondé) — sur les deux instances
- **Sabotage** : aria-label retiré du bouton ⋯ tableau documents → **FAIL nommé** `documents: bouton ⋯ de ligne a un aria-label`, restauré
- **Vanilla (:9410 avant patch)** : verify 18 FAIL nommés / 6 OK ; eval-final 1 FAIL (1.4.10 reflow folder-grid)
- **incomplete-probes** : 119 sondes → 118 conformes / 0 non conformes / 0 non retrouvées (1 N-A honnête)
- **scopeHash** : baseline == final (8f0a3e92) ; install-build différent (urls-ib aux ids du seed rejoué — leçon 44)

## Corrections (138 fichiers, +12858/−1017 dont ~12 900 lignes d'extraction .po ×11 locales)

- **Nommage** : ~90 boutons/selects/déclencheurs reçoivent aria-label i18n résolu (`msg`/`t`/`_` correctement importés — macro vs runtime), SelectTrigger nommés (Delegate document ownership, Jump to settings section, rôles destinataires, détection IA), boutons ⋯ tableaux (documents, membres, templates), engrenage éditeur, tooltip signature dans le dialog settings, trigger upload dropzone hors du button (noClick + Button.open)
- **Rôles/structures** : ancres cmdk dans listbox → overlay `<a aria-hidden tabindex=-1>` (menuitems gardés), enfants directs menu switcher conformes, `DropdownMenu modal={false}` ×3 (aria-hidden-focus + h1), `DialogTitle` sr-only ajouté à SignaturePadDialog (aria-dialog-name), FormLabel manquant + import dans reject-dialog, h4→h3/h2 hiérarchies (Actions, Quick Actions, editor)
- **shadcn Form** : `aria-describedby` n'émis que si FormDescription réellement rendu (flag contexte enregistré par FormDescription — 26 idrefs pendus)
- **Contrastes mesurés pixel** : text-primary→documenso-900+underline (liens auth 1.48), yellow-700→800 (avatars 4.23→5.89), green-600→800 (badges 3.00→6.49), muted-foreground/60→muted-foreground ; variantes `dark:text-documenso-500` ajoutées (dark-signin 2.2 → ≥4.5)
- **Reflow** : folder-grid passe flex-col sous sm (scroll horizontal 320px)

## Warts notables (documentés dans manifest.gotchas)

- seed.sh régénère seed-info/urls dans tools/ → le boot install-build a écrasé les canoniques :9400 (restaurés depuis reports + summary ; artefacts `-ib` séparés, `SEED_INFO=` pour le rejeu)
- vite dev a servi un transform périmé pour signature-pad-dialog (watcher râté sur double-touch git) → kill arbre turbo + purge `.vite` exigés avant le rescan install-build
- `--states none` sur public aurait sauté 4 états (leçon 45) — public scanné avec `--states all`
- eval-final durci : poll 3s focus-restore + retry click table + retry submit (flakes hydratation à froid, jamais des vrais défauts)

## Livrables

`patch.diff` (138 fichiers, sha256 `4999976f…`), `manifest.json`, `results.json`, `scope-compare.json`, `provenance.json`, `tools/` (audit/verify/eval/incomplete-probes/boot/seed/login/gen-urls + seed-info[-ib], urls-*.txt, package.json axe 4.14.0), `reports/` (baseline/final/install auth+public, incomplete-probes).
