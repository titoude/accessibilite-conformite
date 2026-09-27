# Rapport de requalification des exécutions V2

Méthode §9C de la revue externe : pour chacun des 6 dépôts du benchmark V2,
**checkout propre au commit épinglé → application du patch → installation
verrouillée (lockfile) → build/lint**. Objectif : séparer la reproductibilité
du score axe (déjà CONFIRMED par l'audit tiers) de l'**installabilité** et de
la qualité réelle des patchs.

Environnement : node 24.19, yarn 1.22.22, pnpm 11.21 (+ corepack pnpm 9.11
pour it-tools), go 1.25.1, php 8.3.12 statique.

## Verdicts

| dépôt | patch s'applique | install verrouillée | build/lint | verdict |
|---|---|---|---|---|
| miniflux | ✔ | — (Go, pas de lockfile dans le patch) | `go build ./...` PASS | **CONFORME** |
| whoogle | ✔ | `pip install -r requirements.txt` PASS | `import app` PASS | **CONFORME** |
| freshrss | ✔ (96 fichiers, warnings whitespace) | — (pas de lockfile PHP) | `php -l` PASS sur tous les fichiers modifiés | **CONFORME** |
| excalidraw | ✔ | `yarn --frozen-lockfile --ignore-scripts` PASS | `yarn build:app` PASS (14 s) | **CONFORME** |
| it-tools | ✔ | **FAIL** `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` → corrigé → PASS | `pnpm build` PASS | **DÉFAUT CONFIRMÉ, CORRIGÉ** |
| raspap | ✔ | **FAIL** `Invalid value type 61:0` (yarn.lock corrompu) → corrigé → PASS | `php -l` PASS | **DÉFAUT CONFIRMÉ, CORRIGÉ** |

## Défauts confirmés et corrections

### raspap — yarn.lock corrompu par le patch
Le patch V2 avait réécrit `yarn.lock` en perdant le fragment `#sha1` des URLs
`resolved` et en doublant les champs `integrity` non quotés → `yarn install
--frozen-lockfile` partait en `SyntaxError Invalid value type 61:0`.
**Correction** : yarn.lock régénéré proprement (`yarn install --ignore-scripts`
sur l'arbre patché → 17 lignes ajoutées uniquement) ; `--frozen-lockfile`
passe ensuite.

Autres défauts du patch corrigés au passage :
- `templates/system/theme.php` : labels `for="code"` → `for="theme-select"`,
  `for="settings-color"` (+ `id` ajouté), `for="alertTimeout"` (+ `id`).
- `app.js` : ralentissement `setInterval` imposé par le harnais (règle 16) →
  rétabli à l'intervalle d'origine.
- Patch corrigé : `benchmark-v2/raspap/patch-fixed.diff` (63 fichiers,
  s'applique proprement sur le commit épinglé — vérifié sur clone vierge).

**Défaut systémique préexistant** (hors périmètre du patch, documenté) :
`for="code"` récurrent dans `wg/peers.php` (×5), `system/language.php`,
`system/advanced.php` — labels pointant vers des ids absents ou erronés dans
le dépôt d'origine.

### it-tools — hash de patch pnpm incohérent
Le patch ajoutait `pnpm.patchedDependencies` (patch local pour naive-ui) mais
le `pnpm-lock.yaml` livré portait un hash de patch différent du fichier
`patches/naive-ui@2.35.0.patch` → `--frozen-lockfile` échoue sur pnpm 11 ET
sur le pnpm 9.11 épinglé par le repo (défaut réel, pas un artefact de
version). **Correction** : hash aligné sur le fichier livré → install +
`pnpm build` PASS. Patch corrigé : `benchmark-v2/it-tools/patch-fixed.diff`.

## Suite de validation des validateurs

`tests-validateurs/validateurs.mjs` : 5 mutants connus (sous-chaîne read/unread,
labelledby mort, app masquée, élément requis absent, page d'erreur) confrontés
aux assertions faibles vs durcies.

- **5/5 mutants détectés** par les assertions durcies, **0 faux négatif** sur
  les témoins corrects.
- Les assertions faibles passent à tort sur 4/5 mutants — ce qui valide à la
  fois la suite et la dangerosité des anti-patrons.
- Enseignement nouveau intégré à la règle 15 : Chromium retombe sur le
  contenu de l'élément quand `aria-labelledby` est mort → l'assertion durcie
  exige nom calculé ET résolution des ids référencés.

## Ce que cette requalification change au verdict V2

- Les 6 « CONFIRMED » restent valables pour la **reproductibilité du score
  axe** (0 violation, périmètre identique) — l'audit tiers l'a établi.
- Pour la **livrabilité**, deux patchs n'étaient pas installables tels quels :
  c'est maintenant corrigé, avec les patchs rectifiés versionnés à côté des
  originaux (historique préservé : `patch.diff` intact, `patch-fixed.diff`
  ajouté).
- Le contrat benchmark-v3 (`install_build` obligatoire) aurait détecté ces
  deux défauts automatiquement — la correction du contrat est justifiée par
  des preuves réelles.

## Limites assumées

- `yarn build` complet de raspap non rejoué (node-sass 4 incompatible node 24
  hors blueprint du projet) — `php -l` + install verrouillée seulement.
- Les patchs corrigés n'ont pas été re-audités par un tiers indépendant ;
  chaque correction est vérifiable (patch-fixed.diff s'applique + install
  verrouillée passe sur clone vierge).
- Le mutant suite couvre les classes de défauts des règles 13-17, pas
  l'exhaustivité des anti-patrons possibles.
