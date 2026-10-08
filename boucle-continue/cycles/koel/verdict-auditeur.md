# Verdict auditeur — cycle 49 koel/koel @72ab1e8d (master)

**Verdict : CONFIRMED** — rejeu indépendant complet sur trois instances propres (patché :9149, vanilla :9150, install-build :9148), images et seeds régénérés. Final patché reproduit à **0 violation / 0 erreur** sur les 36 scénarios, verify **37/37**, eval-final **24/24**, sondes incomplets **0 FAIL**, sabotage → FAIL nommé identique (`context-menu: dialog nommé`), vanilla → 15 FAIL nommés, install-build verbatim → 0v/0e ×3. Le seul écart mesurable est le baseline states (576 occ/12r/1err vs 832 occ/13r/0err chez le worker) : le `stateProof` de l'audit.mjs commité exige `ul[role="menu"]` — ajouté par le patch — donc le menu contexte vanilla ne s'ouvre plus et `aria-required-children` (1 occ, baseline worker) devient inaccessible ; mon run reproduit à l'identique le claim vanilla du worker (12r/1err, ~590 occ). Aucune triche détectée à la lecture complète du patch (83 fichiers, +234/−152, que du a11y). Ceci mesure la reproductibilité du score axe et la santé du patch, pas la conformité WCAG complète.

Auditeur : session indépendante devin-1ec866c6 (1ec866c677024dc7864fd19509da01c1), clone upstream frais @72ab1e8d9bc4b744b2043a5259e1a06d733a9a29, image `koel49-php` reconstruite (php:8.3-cli + gd/exif/fileinfo/pdo_sqlite/mbstring/zip/curl/bcmath/intl/xsl/sockets/pcntl + composer:2 — miroir gcr, Docker Hub étant rate-limité), axe-core 4.14.0 + playwright 1.64 via node v24.19.0/pnpm 10.32.1, aucun artefact d'exécution du worker réutilisé (auth.json, ids, medias régénérés).

## Méthode de rejeu

1. Clone propre `github.com/koel/koel` @SHA → `git apply --check` patch.diff → **0 rejet** ; sha256 du patch revérifié `bb305a053609…93d` (conforme manifest).
2. `pnpm install --frozen-lockfile` + `pnpm build` (vp build + sw.js), `.env` sqlite-persistent + DB `/koel/database/koel.sqlite` + MEDIA_PATH=/media + APP_URL port propre.
3. `composer install --no-dev`, conteneur `artisan serve`, `key:generate`, `koel:init -n --no-assets --no-scheduler`, `config:cache`, seed-media (30 mp3) + `koel:scan` + seed.py (playlists/favoris/plays/rating) + login → auth.json propre.
4. `audit.mjs` axe 4.14.0 : baseline vanilla (states none ×2 + states all) puis patch + rebuild → final ×3, puis verify/eval/sondes/sabotage ; instance vanilla :9150 dédiée pour verify-vanilla ; instance install-build :9148 re-clonée @SHA + apply + rescan ×3.

## Chiffres (auditeur / worker)

| Métrique | Auditeur | Worker | Δ |
|---|---|---|---|
| baseline-public | 25 occ / 4 règles / 0 err / 12 inc | 25/4/0/12 | **identique** |
| baseline-auth | 927 occ / 13 règles / 0 err / 625 inc | 924/13 | +3 occ (variance données) |
| baseline-states | 576 occ / 12 règles / 1 err / ~159 inc | 832/13/0err | voir wart W1 |
| baseline total | 1528 occ / 16 règles | 1781 occ / 17 règles | W1 |
| final-public | 0v/0e/12inc | 12 inc | ✓ |
| final-auth | 0v/0e/67inc | 68 inc | −1 |
| final-states | 0v/0e/22inc | 22 inc | **identique** |
| verify patché | **37/37 PASS** | 37/37 | ✓ |
| eval-final | **24/24 PASS** | 24/24 | ✓ |
| sondes incomplets | 0 FAIL (96 N-A / 5 PASS / 101) | 0 FAIL (102 N-A / 6 PASS) | proportionnel au Δ inc |
| sabotage (aria-label dialog retiré du bundle) | `FAIL context-menu: dialog nommé null` → 36/37 | idem | **identique** |
| verify vanilla | 15 FAIL nommés / 31 checks | 16 FAIL / 32 | W2 |
| install-build verbatim :9148 | 0v/0e — 12+66+22 inc | 0v/0e | ✓ |
| patch.diff sha256 | bb305a05…93d | bb305a05…93d | ✓ |
| apply --check | 0 rejet | 0 rejet | ✓ |

## Claims d'honnêteté éprouvés

- **`koel:init --no-scheduler`** : existe bien upstream (`InitCommand.php:34`), exécuté sans erreur dans mon conteneur.
- **Guard route post-init** : `App.vue:101` recheck `meta?.guard?.()` présent upstream ; patch router.ts évalue `meta.guard` seulement si `userStore.state.current?.id` → routes admin (`/#/users`, `/#/profile`, `/#/upload`) scannées **sans TypeError** post-init, et `/#/browse`+`/#/youtube` → écran 404 (check verify section B PASS).
- **Ghost `.playing` 0×0** : confirmé réel — placeholders `.song-item`/`.playing` à 0×0 présents sur `/#/home` (1), `/#/favorites` (3), `/#/albums` (3) ; sélecteurs `:visible` du harnais les évitent (tous les states passent, context menu ouvert).
- **Sélecteurs patch-dépendants** : `ul[role="menu"]` du stateProof n'existe que post-patch — cohérent avec le FAIL vanilla attendu.
- **Patch anti-triche** : lecture complète des 1732 lignes — uniquement du a11y (roles/aria/landmarks/vars contraste/tooltip a11y/keyboard), pas de test harnais modifié, aucune feature supprimée (StarRating déplacée hors `<ul>` dans `role=group`, conservée), assertions verify/eval non affaiblies.
- **Provenance** : 80 entrées re-hashées depuis le disque — tous les fichiers livrés conformes (voir W3/W4 pour les anomalies).

## Warts

- **W1 — dérive outil/baseline** : l'audit.mjs commité ne peut pas reproduire le baseline-states d'origine (832 occ/0 err) car `stateProof` song-context-menu cible `ul[role="menu"]` (inexistant vanilla). Mon states-vanilla (576 occ/12r/1err) correspond exactement au claim vanilla du worker (591/12r/1err). Les 17e règle (`aria-required-children`, 1 occ sur `.menu.context-menu`) et ~250 occ sont inaccessibles sur vanilla avec l'outil livré. Documenté ici, non bloquant : le claim important (vanilla → FAILs/erreur attendus) est prouvé.
- **W2 — Δ1 check verify-vanilla** : worker 16 FAIL/32 ; moi 15 FAIL/31 — `sidesheet: tabs nommés + aria-selected` compte FAIL chez eux, N-A chez moi (tablist absent → check non applicable). Mêmes domaines couverts, verdict inchangé.
- **W3 — provenance** : `tools/auth-tmp.json` listé à la fois dans `excluded` et `files` ; `generatedAt: null` ; les 3 `tools/auth*.json` sont hashés dans `files` mais non commités (éphémères liés APP_KEY — re-hash des fichiers livrés = 100 % OK).
- **W4 — doc mineure** : `verdict-worker.md` annonce "installbuild-auth 3 erreurs initiales → corrigées" ; le fix post-init fonctionne (0 err sur mes deux instances patchées), mais la provenance de la correction n'est pas traçable dans les artefacts (pas de patch harnais séparé).

## Conclusion

CONFIRMED. La chaîne worker (0 viol/0 err, verify 37/37, eval 24/24, sondes 0 FAIL, sabotage nommé, install-build 0v/0e) se reproduit sur environnement indépendant. Écarts résiduels expliqués (W1-W4), dont un seul structurel : le baseline agrégé d'origine n'est pas rejouable à l'identique avec l'audit.mjs livré — signaler comme leçon boucle (versionner le scopeHash/stateProof avant de changer les preuves d'état).
