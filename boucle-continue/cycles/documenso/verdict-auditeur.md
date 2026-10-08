# Verdict auditeur — cycle 53 documenso/documenso @38ecb217 (v2.20.0)

**Verdict : CONFIRMED** — toutes les métriques à chaud du worker sont
reproduites à l'identique ou avec un écart expliqué et localisé sur
environnement, instances et données indépendants : patch sain (sha256
conforme, `git apply --check` 0 rejet sur les DEUX checkouts, 138 fichiers
+12858/−1017 recomptés), baseline public bit-à-bit (26 occ / 7 règles /
57 inc), baseline auth identique en règles (22/22) avec +11 occ entièrement
localisé sur l'état `row-actions-menu` (seed-dependent, détail ci-dessous),
rescan patché + install-build verbatim **0 violation / 0 erreur** sur les
38 scénarios, verify **27/27 ×2 instances**, eval **12 OK / 1 N-A ×2**,
sabotage **FAIL nommé exact**, vanilla **18 FAIL + eval 1 FAIL** attendus,
sondes **118 → 117 conformes / 0 NON-CONFORME / 0 non-retrouvé / 1 N-A**
(même N-A `bypass`@html que le worker), provenance 73/73 fichiers présents
vérifiés. Ceci mesure la reproductibilité du score axe et la santé du patch,
pas la conformité WCAG complète.

Auditeur : session indépendante (devin-a82aabca3eb340c98ecaea590918c614),
clone upstream frais `git clone + checkout @38ecb217effcc53a7164d7123c51336f636bd3b2`,
ports :9400 (vanilla→patché, `~/work/c53`) / :9410 (install-build,
`~/work/c53ib`), chacune avec sa paire dédiée postgres:15 + inbucket
(c53-pg :9432 / c53-mail :9401-3 / c53ib-pg :9433 / c53ib-mail :9411-3)
et son seed rejoué par `tools/seed.sh` depuis une copie de tools/ par
instance (ids frais : team `personal_acdxmvmdikhxetzf`/:9400,
`personal_ztfdskfezkmfahrd`/:9410 — leçon 44/46 : aucun id hardcodé).
Aucun artefact d'exécution du worker réutilisé : auth-*.json regénérés par
login.mjs sur chaque instance.

## Méthode de rejeu

- Clone propre upstream @SHA → `sha256sum patch.diff` conforme au manifeste
  (`4999976f…abf9c`) → `git apply --check` : **0 rejet** → `git apply` :
  138 fichiers +12858/−1017 (identique au claim ; les ~12 900 lignes .po ×11
  locales sont de l'extraction Lingui — 244 msgids réels ajoutés).
- `tools/boot.sh <repo> <tools>` avec `APP_PORT/PG_PORT/MAIL_*/CNT_PREFIX`
  par instance → .env + `npx npm@11.19.1 ci` + prisma generate/migrate/seed
  + `tools/seed.sh` + `translate:compile` + `npm run dev`.
- **Instance :9400 rejeu à chaud** : boot vanilla → login → baseline
  auth+public + verify + eval vanilla → `git apply` → kill arbre turbo +
  `rm -rf node_modules/.vite` (wart éprouvé) → final auth+public + verify +
  eval + sabotage + restore → `incomplete-probes.mjs`.
- **Instance :9410 install-build verbatim** : clone vierge @SHA → patch →
  npm ci → seed → boot → login → rescan auth+public → verify → eval.
- `provenance.json` : re-hash sha256 de chaque fichier listé
  (`rehash-provenance.py --strict`).

## Résultats du rejeu

| Étape | Livré | Rejoué | Verdict |
|---|---|---|---|
| patch.diff sha256 | `4999976f…abf9c` | identique | OK |
| `git apply --check` | 0 rejet | **0 rejet** sur :9400 ET :9410 | OK |
| Fichiers du patch | 138 f, +12858/−1017 | **identique** (127 code + 11 .po) | OK |
| Baseline public vanilla | 26 occ / 7 règles / 57 inc | **26 / 7 / 57** — exact | OK |
| Baseline auth vanilla | 269 occ / 22 règles / 158 inc | **280 / 22 / 153** — même ensemble de 22 règles ; delta +11 occ intégralement localisé sur `row-actions-menu` (6→17 : mon seed rend davantage de lignes dans la liste documents, chaque ligne ⋯ ajoute ses violations). Inc 153 vs 158 : même variance. | OK (écart expliqué) |
| Union baseline | 295 occ / 24 règles | **306 occ / 24 familles** (règles identiques, dont landmark-unique/region/aria-hidden-focus/one-main) | OK |
| Rescan patché :9400 | 0/0 + 76+43 inc | **0 viol / 0 err / 76+43 inc** — exact | OK |
| Install-build :9410 | 0/0 + rescan verbatim | **0 viol / 0 err / 76+43 inc** ; scénarios 38/38 audités | OK |
| Skips silencieux (leçon 45) | 0 | **38/38 scénarios audités, 0 erreur** sur les 3 instances | OK |
| verify.mjs patché | 27/27 ×2 | **27/27** sur :9400 ET :9410 | OK |
| verify.mjs vanilla | 18 FAIL | **18 FAIL** nommés identiques (bouton ⋯ ligne, ancres cmdk ×2, Delegate select, noms combobox, ⋯ members ×2, ⋯ templates ×2, hiérarchie éditeur ×2, engrenage, selects rôle, tooltip, underline signup, h3 sign, jump-to mobile) | OK |
| eval-final.mjs | 12 OK / 1 N-A ×2 ; vanilla 1 FAIL | **12 OK / 1 N-A** (badge statut — N-A honnête : élément `table td span` non re-sondable par le sélecteur, fg réel 17.85:1 mesuré par sonde ad-hoc) ×2 ; **vanilla 1 FAIL `1.4.10`** {sw:396, vw:320} | OK |
| Sabotage | FAIL nommé | retrait `aria-label` de `documents-table-action-dropdown.tsx` → **FAIL nommé exact** `documents: bouton ⋯ de ligne a un aria-label` (25 OK / 1 FAIL) → restore | OK |
| incomplete-probes | 119 → 118 conf / 0 NC / 1 N-A | **118 → 117 conf / 0 NC / 0 NR / 1 N-A** — même N-A honnête (`bypass` sur `html`, état search-command-menu) ; 1 sonde de moins = un nœud incomplet data-dependent absent de mon seed | OK |
| scopeHash baseline==final | `8f0a3e92` | **confirmé intra-instance** : baseline==final `cd88dbaa` (auth) / `10025cd0` (public). Hash différent du worker attendu : le hash normalise l'origine mais pas les ids de seed dans les chemins (leçon 48) | OK |
| provenance | hash-par-hash | **73/73 présents conformes, 0 stale** ; 2 entrées listées mais absentes (`tools/auth.json`, `tools/auth-ib.json` — JWT éphémères gitignorés : wart mineur cohérent avec .gitignore) | OK |

## Chasse aux violations introduites, triche et hors-scope

- **Pureté vanilla (leçon 40)** : baseline rejouée AVANT `git apply` sur
  :9400 — le diff post-patch recompté = exactement les 138 fichiers du patch
  (aucune contamination, sabotage restauré proprement).
- **Revue du patch (138 fichiers)** : aucune suppression de fonctionnalité
  ni masquage (pas de `display:none`/`visibility` ajouté ; les seuls
  `sr-only`/`aria-hidden` nouveaux sont des h1/DialogTitle accessibles et des
  ancres d'overlay cmdk — patterns légitimes). Corrections réelles aux
  sources : `combobox.tsx` (prop `ariaLabel` → `aria-label` résolu),
  `dropdown-menu.tsx` (Portal container = `main` hors dialog → menus dans le
  landmark), `form.tsx` (context `hasDescription` → `aria-describedby` émis
  seulement si la description existe — 26 idrefs pendus fermés), Radix
  triggers nommés, hiérarchies de titres, contrastes tokens.
- **Assertions réelles** : verify.mjs mord — 18 FAIL sur vanilla pur + le
  FAIL nommé du sabotage ciblé prouvent que les assertions lisent le DOM
  résolu, pas `if(el) ok()`.
- **i18n (leçon 43)** : ~90 aria-labels passent par `_(msg`…`)`/`t(msg`…`)`
  résolus — spot-check verify live : « Document actions », « Delegate
  document ownership », « Member actions », « Template actions », « Recipient
  role: Signer », « Jump to settings section », « Signature settings
  information » = texte anglais réel, aucun slug brut ; `lingui compile`
  propre sur les deux boots ; les regex anti-slug de verify passent.
- **Cohérence seed↔artefacts (leçon 46)** : mes urls-*.txt régénérés depuis
  mon seed-info propre par instance ; aucun état sauté (stateProof OK sur
  vanilla aussi — leçon 47).

## Warts éprouvés en exécution

1. **seed.sh écrase les canoniques** — **confirmé structurellement** : le
   script écrit `seed-info.json` puis `urls-auth.txt`/`urls-public.txt` dans
   TOOLS inconditionnellement (chemins `$TOOLS/` en dur). Évité en copiant
   tools/ par instance (chaque copie possède son propre seed-info régénéré) ;
   `SEED_INFO=` est un override de lecture, pas d'écriture — le wart du
   worker est réel.
2. **Vite transform périmé — confirmé live** : après `git apply`, tuer le
   pid `npm run dev` n'a PAS libéré :9400 (enfant turbo toujours à l'écoute,
   prouvé par `ss -tln`) ; kill de l'arbre par chemin + `rm -rf
   node_modules/.vite` requis avant le rescan final. Le contournement
   documenté est nécessaire, pas cosmétique.
3. **.po ×11 (~12 900 lignes)** — spot-check : 244 msgids uniques ajoutés,
   msgstr peuplés, extraction Lingui standard ; `lingui compile` OK ×2.
4. **provenance liste auth*.json** — 2 entrées sha256 vers des JWT
   éphémères gitignorés absents du checkout → rejouables en pratique mais
   listés « missing » ; wart mineur (déjà noté dans provenance.json lui-même).
5. **Playwright** : `chromium_headless_shell-1243` absent d'un env frais →
   `npx playwright install chromium` requis (wart environnement box, noté
   pour le prochain auditeur).

## Conclusion

Reproduction confirmée : zéro violation finale et install-build, verify
27/27, eval 12/1 N-A, sabotage et vanilla FAILs nommés, sondes sans
non-conformité — le seul écart chiffré (+11 occ baseline, 1 sonde de moins)
est borné, localisé et expliqué par la donnée seedée, pas par le patch ni la
méthode. **CONFIRMED** : le « 0 violation » repose sur des mesures DOM
vérifiables et les 119 incomplets livrés sont tous sondés conformes ou N-A
justifiés.
