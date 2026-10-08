# Verdict worker v2 — cycle 57 Dolibarr

Réponse au verdict auditeur **CONFIRMED-avec-résiduels** (devin-2c2701e2, commit `ed6996d`).
Tout ce qui suit a été **exécuté** sur des instances réelles ; rien n'est déclaré sans preuve.

## Findings auditeur → corrections

### 1. `.badge-status1` #fff/#bc9526 = 2,81:1 — CORRIGÉ + mesuré

Palette `.badge-statusN` corrigée dans `htdocs/theme/eldy/` **et** `htdocs/theme/md/` :
- fonds vifs (`#bc9526`, `#9c9c26`, `#cad2d2`, `#e7f0f0`) : fg → `#212529` (sombre)
- `.badge-status4` → `#0f7a55` bg (5.34:1), `.badge-status8` `#993013`/`#994013` (≥6.7:1)
- variantes daltoniennes conservées (texte noir sur fonds éclatants)
- **résidu caché corrigé au passage** : `.badge-status6` (« Paid ») était `#777` = **2.91:1** sur vanilla — jamais visible car la surface facture-validée/payée n'était pas scannée (même trou de scope que le finding)

Mesures (measure-badges.mjs, CSS générée + DOM live) :
- **0 variante < 4.5:1** sur les 16 règles `.badge-statusN`, eldy ET md
- DOM :9800 eldy : status1 5.48:1, status6 10.03:1, status0 5.1:1 — idem après bascule MAIN_THEME=md live

### 2. `tools/seed.php` bug réel — CORRIGÉ + non-silencieux

- `getRights()` déplacé **après** l'activation des modules (dans `activateModules()` avant `validate()`)
- échec de `validate()` désormais **non silencieux** : `fwrite(STDERR, …) + exit(2)`
- seed-info.json régénéré **véridique**, vérifié en DB : `llx_facture` rowid=1 → `fk_statut=1` (IN2610-0001 validée), rowid=2 → 2 (payée), rowid=3 → 0 (brouillon)

### 3. verify.mjs recalibré — 38/38 OK sur :9800 ET :9810

- 38 checks : les 5 faux FAIL (form add-line absente sur facture validée) recalés sur l'état DB réel
- **sonde contraste computed `.badge-status1` ajoutée** : axe ne l'a pas vu (règle color-contrast marquée *incomplete* par axe sur ce nœud — la sonde mesure le composite alpha : 2.81:1 vanilla / 5.48:1 patché) + sondes `badges statut >= 4.5:1` (liste factures) et `role autorisé sur aria-label`
- sur vanilla :9820 → **30 FAIL nommés** dont la sonde badge-status1 qui reproduit **exactement** le finding (2.81:1 mesuré)

### 4. Trou de scope — comblé

Nouvel état `facture-validee` dans STATES (audit.mjs) + states.json :
`/compta/facture/card.php?facid=<validée>` → preuve `.badge-status` visible + `.badge-status1` texte|aria-label =~ /not paid|unpaid|impay|valid/i.
Exécuté : **11 règles violées sur vanilla** (dont le résidu) / **0 sur patché**.

## Warts corrigés

| Wart | Correction |
|---|---|
| observer « débouncé » en prose, synchrone en code | debounce **réellement implémenté** (timer 50ms + rescan différé des passes fixSearchInputs/fixSelect2/ensureH1) |
| probes lisent `page.state` inexistant | incomplete-probes.mjs lit `report.json.scenarios[].state` (champ réel) |
| install.lock → re-boot no-ops silencieux | lock absent/incomplet → install rejouée ; lock complet → skip **loggé** |
| `git apply --stat` 277≠274 annoncés | patch.diff v2 régénéré : **22 fichiers +305/−90** (stat réel) + sidecar sha256 `f1dd0980…` |
| `</div>` orphelin après `<nav class=tmenudiv>` | `</nav>` correct dans le patch |
| (trouvé en route) createRequire CWD | deps résolues depuis `tools/` — commandes manifest verbatim OK |

## Chaîne rejouée (verbatim)

| Étape | Résultat |
|---|---|
| rescan :9800 (patch v2) | public **0v/0e**/1inc · auth **0v/0e**/333inc — 26 scénarios dont facture-validee |
| verify :9800 | **38/38 OK** |
| eval-final :9800 | **20/20 OK** |
| sabotage `$onlycontrols=false` | **FAIL nommé** « liste: aucun <th> vide » (37/38) → restore |
| vanilla :9820 (worktree @SHA) | verify **30 FAIL nommés** dont sonde badge-status1 **2.81:1** = finding auditeur |
| baseline :9820 regénérée | public 3r/8occ · auth **19r/1901occ**/671inc — ensembles identiques au final |
| sondes incomplets | **308 OK / 26 N-A / 0 NON-CONFORME** |
| install-build :9810 | clone propre @`7e92776` + `git apply --check` + apply + boot + seed (facture 1 validée réelle) → **0v/0e**/333inc + verify **38/38** |
| patch.diff v2 | 22 fichiers +305/−90, sha256 `f1dd0980c8b3bbe842aac5e46daed33dbe14ce94ba69dcd08f8e667841275a93` |
| provenance --strict | voir provenance.json (regénérée en dernier) |

## Chiffres clés

- baseline auth : 19 règles / **1901 occ** → final : **0/0** (même ensemble de 26 scénarios)
- badges statuts : vanilla 2.46–2.91:1 → patché **≥5.1:1 partout** (2 thèmes, CSS + DOM)
- verify : 38 checks (+3 sondes badges/status vs v1 35)

*Le verdict de conformité revient à l'auditeur indépendant — ce document ne rend pas d'auto-verdict.*
