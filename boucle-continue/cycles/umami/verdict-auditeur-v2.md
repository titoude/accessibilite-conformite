# Verdict auditeur v2 — cycle 17 umami/umami (re-audit des corrections U1-U5)

**Verdict : CONFIRMED** — les 5 findings du verdict v1 sont verifiablement corrigés : commande publique figée désormais déterministe par construction (`--wait-for 'h1' --wait 1000`, 2 runs rejoués byte-identiques hors runId/generatedAt, 0 violation / 0 incomplet / exit 0, scopeHash `b7db2d55…` identique), `tools/urls.txt` livré et octet-exact, `tools/seed.sh` rejoué verbatim produit l'état figé complet, `toolVersions` réels (pnpm 12.9.1, prisma 7.10.0, axe 4.13.0, playwright 1.63.0), `eval-final` 20/20 rejoué, `installBuild` décrit par commandes + exit codes (chaîne complète rejouée exit 0), `patch-v2.diff` apply `--check` propre sur clone vierge sans `container:` dupliqué (patch_hash `e966f526…` rejoué par pnpm). Ceci n'affirme PAS la conformité WCAG complète : périmètre axe seul (wcag2a/aa + best-practice) et 49-59 résultats `incomplete` décidés N-A (dispersion documentée, mêmes 3 familles).

Auditeur : session indépendante (devin-66a4ae92336c4bba962c0d4d12eb08d6), VM neuve, clone upstream frais `umami-software/umami@ec0ff50388c264ed8ce46f00967e92f7e71476ae`, patch-v2 appliqué, aucune réutilisation des artefacts du worker ni du fixer.

## Méthode de rejeu

- `git clone` upstream → `checkout ec0ff50` → `git apply --check patch-v2.diff` **propre** → `git apply` propre (114 entrées : 112 modifiés + `patches/@umami__react-zen@0.254.0.patch` + `src/app/(main)/not-found.tsx` ; 1 warning trailing whitespace, inchangé vs v1).
- `docker run postgres:15-alpine` (umami-pg :5432) + `.env` → `corepack pnpm install --frozen-lockfile` : **pnpm 12.9.1** résolu par corepack (aucun champ `packageManager` — `engines.pnpm` dit 12.3.4, résolution effective 12.9.1, conforme au manifeste corrigé) ; le patch react-zen est rejoué mécaniquement : `node_modules/.pnpm/@umami+react-zen@0.254.0_patch_hash=e966f526…` — **hash identique** au hunk `pnpm-lock.yaml` du patch-v2.
- `pnpm prisma generate` (client **7.10.0**) → `db:migrate` (26 migrations) → `db:seed` (2 sites, 15 353 sessions / 43 944 events) → `pnpm build` (next --turbo 16.3.4, **70/70 pages**) → `pnpm start` :3000 (200 sur /login).
- `tools/seed.sh` rejoué **verbatim** (`UMAMI_DIR` par défaut = `~/work/umami`) → exit 0, état figé exact.
- Harnais `~/umami-audit/tools` : axe-core **4.13.0**, playwright **1.63.0** (chromium-1243) — `login.mjs` → `auth.json`, puis `auditCommands` rejouées verbatim.

## Rejeu point par point

| Finding v1 | Correction livrée | Rejoué | Verdict |
|---|---|---|---|
| **U1** (major) commande publique sans sédimentation | `auditCommands[1]` gagne `--wait-for 'h1' --wait 1000` ; `reports/final-public` régénéré (2 runs identiques livrés) | **2 runs consécutifs byte-identiques** hors `runId`/`generatedAt` : 0 viol / 0 inc / exit 0 ×2 ; `scope.json` stocke `wait: 1000` + `waitFor: "h1"` (runner v6) ; scopeHash `b7db2d55…` identique au livré | **corrigé** |
| U1 contrefactuel | — | **Ancienne commande (sans --wait) rejouée 5/5 PASS** 0 viol — le flake v1 n'est PAS reproduit sur cette VM. Sonde DOM : `<h1>`/`<main>` montent **370-790 ms après domcontentloaded** (3/3 runs) — le mécanisme de race existe réellement mais axe termine son injection après le montage ici. **La défaillance v1 était contextuelle** (timing machine) ; la correction reste justifiée : elle rend le résultat déterministe par construction | honnêteté : voir N1 |
| **U2** urls.txt absent | `tools/urls.txt` livré (32 urls) | fichier = `manifest.urls` absolutisées `http://localhost:3000` **octet-exact** ; scopeHash recomputé depuis les ids de scénarios livrés = `723c223bc12d…` (auth) et `b7db2d55b9f0…` (public) — `JSON.stringify` compact, trié | **corrigé** |
| **U3** seed sous-spécifié | `tools/seed.sh` verbatim + `manifest.seed` réécrit | **exit 0 verbatim** : remaps SQL website_id sur 13 tables + share.entity_id ; `POST /links`+`/pixels` honorent `id`+`slug` (aucun remap, contrairement à share) ; `POST /boards` exige `type` (documenté) ; `POST /websites/:id/shares` ignore le slug (documenté → remap `share_id`+`slug`). État final : websites `a59bd9be`/`d4bdaf1e`, link `ec520c8a`/`a11ylink01`, pixel `afa6189b`/`a11ypixel`, board `f08a66bc`, share `6c2d7451`/`a11yumamishare` — tous aux ids figés ; /share/a11yumamishare → 200 ; 15 260+93 sessions remapées | **corrigé** |
| **U4** métadonnées | `toolVersions` ajouté, `stack` corrigé, `evalFinal` 20/20, `installBuild` en commandes+exit codes, scope.json stocke wait+waitFor | pnpm **12.9.1** (résolution corepack réelle, `engines.pnpm=12.3.4` non pinnant — le manifeste le dit honnêtement) ; prisma client **7.10.0** généré ; axe **4.13.0** + playwright **1.63.0** installés ; eval-final **20/20 PASS** (préconditions `editCount`/`mobCount`/`selCount` désormais assertées `ok()` — plus de `if (count())` silencieux) ; installBuild rejoué : apply --check 0, install 0, generate 0, migrate 0 (26), seed 0, build 0 (70/70), start sert 200 ; `installBuild.verdict` auto-proclamé retiré | **corrigé** |
| **U5** nit patch + comptage | `patch-v2.diff` : 2 `container:` dupliqués retirés + hash lockfile recalculé ; incomplets 59 conservés avec note | `git apply --check` **propre** sur clone vierge ; `.patch` react-zen : 30 occurrences `zenPopupContainer`, **0 duplicat** ; dist instrumentés **×16/fichier** dup=0 ; `patch-v2.diff` vs `patch.diff` : diff exactement limitée au `.patch` (2 lignes dédup) + `pnpm-lock.yaml` (`ade2a276`→`e966f526`) ; `patch-v2.diff.sha256` conforme ; report.json livré contient bien **59** incomplets (34+22+3) | **corrigé** |

## Rejeu transversal (résultats v1 re-vérifiés sous patch-v2)

| Étape | Livré | Rejoué |
|---|---|---|
| provenance.json | 26 entrées | **26/26 sha256 conformes** (incl. `patch-v2.diff` ↔ `.sha256`) |
| final auth (32 urls + 6 états) | 0 viol / 0 err / exit 0 (artefact v5, non régénéré) | **0 / 0 / exit 0, 38/38 audités sous patch-v2** — scopeHash `723c223b…` + statesHash `ab58a769…` **identiques** au livré : patch-v2 fonctionnellement identique, choix de non-régénération défendable |
| verify.mjs | 27/27 | **27/27** |
| eval-final.mjs | 20/20 | **20/20** (7 pages hors-périmètre + 404 + dialog édition dans la couche + dark + reflow 320px + select dans la couche) |
| incomplets | 59 (34 cc + 22 ahf + 3 avav) | **49** (24 cc + 22 ahf + 3 avav) — les 2 familles stables identiques, color-contrast disperse sur lignes virtualisées (59→58→24 selon le timing ; même leçon que v1 : dispersion, pas régression) |

## Findings résiduels (nits, non bloquants)

- **N1** — l'ancienne commande publique passe 5/5 chez moi : la défaillance v1 était **contextuelle** (VM de l'auditeur v1 probablement plus lente/froide). Le mécanisme est réel (montage async mesuré 370-790 ms) et la correction le supprime par construction.
- **N2** — `tools/audit.mjs` v6 ≠ `audit.mjs` canonique racine octet pour octet : le canonique (au commit cdf5777) contient `settleAnimations` (introduit au cycle 19, cacfe64) que la copie cycle 17 — forkée avant ce changement — n'a pas ; STATES diffère par construction. Le label « v6 » est par fork, pas global : la fonctionnalité annoncée (wait+waitFor dans scope.json) est bien présente et prouvée par l'artefact livré.
- **N3** — `reports/final` (auth) reste un artefact runner v5 : son `scope.json` ne porte pas `wait`/`waitFor`. Choix documenté et cohérent (patch-v2 = duplication inerte) ; re-vérifié 0 violation sous patch-v2 quand même.
- **N4** — `manifest.toolVersions.runner` dit « audit.mjs v6 (scope.json stocke wait + waitFor) » — exact pour les artefacts régénérés (final-public) ; voir N3 pour le périmètre auth.

## Points de la mission

1. Commande publique corrigée rejouée **2× identiques** (0/0/0 exit 0) — déterminisme acquis, pas seulement observé.
2. Ancienne commande rejouée **5/5 PASS** — flake non reproduit, mécanisme documenté (N1).
3. `seed.sh` verbatim produit l'état figé exact — aucune étape manuelle nécessaire.
4. `patch-v2.diff` sain : apply propre, patch pnpm sans duplicat, hash lockfile rejoué par pnpm, diff v1↔v2 limitée et documentée.
5. CONFIRMED = reproductibilité axe + santé patch — jamais conformité WCAG complète.
