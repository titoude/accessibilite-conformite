# Verdict AUDITEUR v2 — cycle 45 Kareadita/Kavita @f75863cb77c0

Auditeur : session indépendante devin-0b180d00 (rejeu zéro confiance :
clone propre @`f75863cb77c0f6aa26e0794a1848294e63c9d07d`, ports propres
:8240 vanilla / :8241 patché, données+seed propres
(`SEED_DONE series=7 libs=3` ×2 instances), toolchain provisionnée par
l'auditeur : dotnet SDK 10.0.401 ~/work/dotnet10 + node v24.19.0 +
axe-core 4.14.0 épinglé). Version servie identifiée : tag v0.9.1.4 /
runtime 0.9.1.11, .NET 10 + Angular 22.

**Verdict : CONFIRMED** — tous les claims fonctionnels du fixer-v2
reproduits à l'occurrence près ou en mieux ; un wart de provenance
corrigé par l'auditeur (W-a2-1).

## Claims du fixer-v2 vs rejeu indépendant

| Claim fixer-v2 | Verdict rejeu |
|---|---|
| patch.diff sha256 `ee82ead4…`, 65f +233/−206, `git apply --check` 0 rejet | **confirmé à l'octet** : sha256 sidecar = hash du fichier, 65 fichiers tous sous `UI/Web/src/`, 0 rejet sur clone vierge |
| final patché :8201 = 0 viol/0 err (19 auth + 11 états) | **confirmé** : 19/19 urls auth 0 viol/0 err sur :8241 + 11/11 scans états 0 viol/0 err + 2 publics 0 viol. Reports auditeur : `~/work/audit45-reports/finalpat-*` |
| baseline vanilla (L40) — pureté | **confirmée** : index.html vanilla garde `role="main"` (aria-allowed-role ×6), en.json déployé vanilla sans les 5 clés, main.js vanilla sans `actions-for` ; baseline-auth rejouée **241 occ / 9 règles** vs livrée 234/9 — Δ+7 = contenu dynamique (nav-streams/listes), **même jeu de 9 règles exactement** ; baseline-states rejouée **218 occ / 13 règles / 11 scans / 0 err** = bit-identique au `finalv2-states-vanilla` committé |
| K1a : 5 clés i18n réelles dans en.json déployé | **confirmé** : `actionable.actions-for`="Actions for {{name}}", `actionable.edit`="Edit", `side-nav.side-nav-alt`="Side navigation", `side-nav.sidenav-bottom-alt`="Support links", `settings.side-nav-alt`="Settings navigation" — texte réel, pas de slug |
| K1b : `labelBy()` réellement bindé | **confirmé live** : sonde DOM :8241 → accName mesurés « Actions for home », « Actions for reading-lists », « Actions for Kv45 Manga/Comics/Books » (labelBy=navStream.name), « Actions for card » (défaut input `'card'` quand non bindé) ; navs « Side navigation »/« Support links »/« Settings navigation » résolus ; 0 slug dans 9 boutons |
| K1c : sabotage clé → 4 FAIL nommés | **confirmé verbatim** : `actions-for` retirée du `wwwroot/assets/langs/en.json` déployé → verify.mjs = **39/43, exactement 4 FAIL** (`/library/1: aucun aria-label slug` 9×`actionable.actions-for`, `/library/1: aria-label « Actions for … »`, idem ×2 sur `/library/1/series/2`) ; clé restaurée → repass 43/43. La sonde mord nommément |
| K1 bonus : modale ActionableModalComponent nommée | **confirmé** : `id="modal-basic-title"` + `{ariaLabelledBy}` présents dans le dist ; convention produit suivie |
| K2 : seed 7/7 libs, posts scan-all=1, quiescence Hangfire | **confirmé ×2** : rejoué sur :8240 ET :8241 → `SEED_DONE series=7 libs=3` les deux, `posts scan-all=1` chacun, une seule exécution par instance |
| K3 : resolve-ids tokens dynamiques | **confirmé** : `[ids] libs=1,2,3 series=3,5,6` (vanilla) vs `series=2,5,7` (patché) — ids distincts par instance résolus via API, aucun id en dur ; tokens expansés dans audit/verify/eval |
| K4 : baseline-states complète 13r/218occ | **confirmé exact** : 218 occ / 13 règles / 11 scans / 0 err / 236 inc sur ma vanilla — identique au report committé |
| K5 : prose corrigée page-has-heading-one 24, heading-order 1 | **confirmé** : recompte report.json committés vanilla canoniques (baseline-public 2 + baseline-auth 18 + baseline-states 3 + k4-cardactions 1) = **24** ; heading-order = **1** |
| K6 : onglets ngbNav couverts | **confirmé** : verify section D — tablists présents, li avec role sur patché (43/43) vs FAIL vanilla (`{"tablists":1,"bad":1}`) |
| verify.mjs 43/43 patché | **confirmé** : 43/43 PASS / 0 FAIL sur :8241 |
| eval-final.mjs 35/35 patché | **confirmé** : 35/35 PASS / 0 FAIL sur :8241 |
| vanilla → FAIL attendus (discriminant) | **confirmé** : verify vanilla :8240 = **29 FAIL** (role html, h1, navbar, slugs, card-actionables 0, ngbNav, modal labelledby, contrastes 2.14, typeahead, h2→h6) ; eval vanilla = **8 FAIL** (modal non nommée, liens/boutons, dup ids) |
| provenance --strict 107/107 | **infirmé puis corrigé** : sur clone propre, 5 entrées sans fichier (`tools/auth.json`, `tools/auth-vanilla.json`, `tools/a11y-audit/{report.md,scope.json,report.json}` — jamais commitées, sessions+sorties locales du fixer) → retrait + rehash strict = **102/102, spot-check 3/3** ; les 102 autres empreintes étaient fraîches (re-hash n'a changé aucun sha256 livré) |

## Chasse (slugs résiduels, violations introduites, hors-scope, warts)

- **Slugs i18n résiduels** : sonde exhaustive sur 14 pages patchées (home,
  library, series-detail, settings, lists, lists/1, collections, bookmarks,
  want-to-read, all-series, browse, announcements, profile, manga-reader) —
  tout `aria-label`/`title`/`aria-labelledby` rendu filtré par regex slug
  `[a-z0-9]+(\.[a-z0-9-]+)+` : **0 suspect**, 0 labelledby pendant.
  Vérif statique : clés `t()` des nouveaux bindings (`actions-for`,
  `bulk-action-label`→"Bulk Action", `activity-graph.*-activity-alt`×5,
  `activity-graph.title`) toutes résolues dans en.json déployé.
- **2.5.3 label-in-name** : `label() || labelBy()` → accName « Actions for
  \<X\> » contient toujours le texte visible `{{label()}}` (seul site avec
  `[label]` = manage-library « Bulk Action » ⊂ « Actions for Bulk Action ») ;
  sites sans label → texte visible vide → trivial. **Propre**.
- **Violations introduites** : 0 — rescan patché 0 viol/0 err sur 32
  surfaces (19 auth + 11 états + 2 public) ; axe ne remonte rien de nouveau
  vs le jeu de règles vanilla.
- **Hors-scope** : 65/65 fichiers sous `UI/Web/src/` — zéro backend .NET,
  zéro hors produit.
- **Warts nouveaux** :
  - **W-a2-1** : provenance.json v2 livrait 5 sha256 de fichiers absents
    (fixer a re-hashé sur arbre sale — sessions auth.json + a11y-audit
    locaux) ; `--strict` échouait sur clone propre. Corrigé par l'auditeur
    : entrées retirées (auth.json déjà dans `excluded`, incohérence interne
    du json) → 102/102.
  - **W-a2-2** : `verify.mjs`/`eval-final.mjs` prennent l'auth en argument
    POSITIONNEL (`<base> [auth.json]`) — `--storage-state` est avalé comme
    authPath → contexte non authentifié → 13 FAIL génériques trompeurs.
    Piège de CLI documenté (usage string présent mais flag silencieusement
    accepté comme chemin).
  - **W-a2-3** (info) : `id="modal-basic-title"` partagé par ~30 templates
    de modales (convention produit pré-existante que le patch suit) —
    getElementById peut résoudre vers la mauvaise si 2 modales empilées ;
    non observé en audit (eval dup-ids PASS), wart amont hors périmètre.

## Chiffres auditeur (rejeu)

| surface | vanilla :8240 | patché :8241 |
|---|---|---|
| public (2) | 4 occ / 2 règles | **0 / 0** |
| auth (19 urls) | 241 occ / 9 règles | **0 occ / 0 err** |
| états (11 scans) | 218 occ / 13 règles | **0 occ / 0 err** |
| verify.mjs | 29 FAIL | **43/43 PASS** |
| eval-final.mjs | 8 FAIL | **35/35 PASS** |
| provenance --strict | — | **102/102** (après correction W-a2-1) |
| seed.py | SEED_DONE 7/7, posts=1 | SEED_DONE 7/7, posts=1 |
| sabotage K1 | — | **4 FAIL nommés** (claim verbatim) |

Conclusion : le patch v2 est rejouable à l'identique (git apply 0 rejet,
build ng+dotnet reproductible, seed fiable, rescan 0 viol, assertions
dures 43/43+35/35, sonde anti-slug mordante, ids dynamiques). K1–K6 tous
fermés sur preuves indépendantes. Verdict cycle 45 : **CONFIRMED**.
