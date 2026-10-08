# Verdict ré-auditeur — cycle 57 v2 Dolibarr/dolibarr @7e927764767343334aaa067ca5ec054cfea0a26b (tag 24.0.2)

**Verdict : CONFIRMED-avec-1-résiduel** — rejeu indépendant complet, zéro confiance
(ré-auditeur : devin-430abfcc, 2026-10-08). Trois instances propres construites
par mes soins : `:9830` (clone `~/work/doli57v2-audit` patché), `:9840` (vanilla
`~/work/doli57v2-vanilla` jamais patché — baseline + verify-vanilla), `:9850`
(install-build `~/work/doli57v2-ib` : clone vierge @SHA → `git apply` → boot →
seed → rescan + verify). Patch v2 sha256 `f1dd0980c8b3bbe842aac5e46daed33dbe14ce94ba69dcd08f8e667841275a93`
conforme au sidecar ; `git apply --check` 0 rejet ; stat mesuré **22 fichiers /
+305/−90** — exactement annoncé.

## Rejeu point par point

| Claim v2 | Rejeu ré-auditeur |
|---|---|
| seed.php corrigé → facture réellement fk_statut=1 | **confirmé en DB sur les 3 instances** : `llx_facture` = rowid 1 `IN2610-0001` **fk_statut=1** paye=0 ; rowid 2 `IN2610-0002` fk_statut=2 paye=1 ; rowid 3 `(PROV3)` fk_statut=0. Le bug v1 (getRights avant modules → draft silencieux) est mort : seed échouerait exit≠0 sinon |
| `.badge-status1` 5.48:1 / `.badge-status6` 10.03:1 sous eldy ET md | **reproduit exact ×2 thèmes** : measure-badges eldy → status1 **5.48:1** (fg #212529/bg #bc9526), status6 **10.03:1** (fg #212529/bg #cad2d2) ; md → **5.48:1** / **10.03:1** identiques. 16 variantes de la famille relevées par thème, **0 < 4.5:1** (2 règles fg=? non mesurables, exclues du décompte — CSS alpha). DOM live liste factures : 3 badges computed cohérents |
| rescan auth 0v/0e/333inc sur 26 scénarios | **reproduit exact** : :9830 → **0 règle / 0 occ / 0 err / 333 inc** sur 26 scénarios dont `facture-validee` (facid=1) — 2 inc sur cet état. Public :9830 → **0/0/0/1 inc** |
| verify 38/38 dont sonde computed badge réelle | **confirmé** : :9830 → **38/38 OK, 0 FAIL** (2 N-A honnêtes). La sonde mesure réellement — preuve négative : sur vanilla elle sort `mesuré 2.81:1 fg=rgb(255,255,255) bg=rgb(188,149,38)`, pas un PASS vacuus. Rejouée aussi sur :9850 → 38/38 |
| eval 20/20 | **reproduit** : 20/20 OK, 0 FAIL |
| sabotage `$onlycontrols=false` → FAIL nommé | **reproduit** : :9830 → `FAIL liste: aucun <th> vide 1`, 37/38 — nommé et exact ; restore → 38/38 |
| vanilla 30 FAIL nommés incl. badge 2.81:1 | **reproduit ligne-pour-ligne** : :9840 → **8/38 OK, 30 FAIL** — dont `sonde .badge-status1 contraste >= 4.5:1 mesuré 2.81:1`, `badges statut >= 4.5:1` (status1 2.81 + status9 2.46), `badges statusN liste (3 statuts seedés)` status1:2.81/status6:2.91/status0:2.85. Identique au verify-vanilla.txt livré |
| baseline regénérée 19r/1901 occ | **reproduit nœud-par-nœud** : vanilla :9840 auth → **19 règles / 1901 occ / 0 err / 671 inc** ; distribution par règle **identique au livré** (comparaison programmée, 0 écart). Public vanilla → 3r/8occ/2inc identique |
| sondes 308/26/0 | **reproduit exact** : 334 nœuds re-sondés → **308 OK / 26 N-A / 0 NON-CONFORME** |
| install-build verbatim 0/0/0 + verify 38/38 | **reproduit** : :9850 → public 0/0/1 + auth **0v/0e/333inc** + verify **38/38** |
| provenance 49/49 | **vérifiée** : rehash-provenance.py --strict → 49 empreintes re-hachées, spot-check 3/3, exit 0 |
| wart debounce 50ms réel | **confirmé dans le code servi** : lib_head.js.php:2062 `clearTimeout(window.__a11yObsT); window.__a11yObsT = setTimeout(function(){fixSearchInputs();fixSelect2();},50)` — vrai timer, pas de la prose |
| wart probes `scenarios[].state` | **confirmé** : incomplete-probes.mjs lit `page.state \|\| [state:…]` fallback + rejoue `STATES[stateName].setup` ; les 26 N-A/308 OK incluent les pages à état |
| wart `</nav>` fermant | **confirmé** : eldy.lib.php:767 `print '</nav>'` (plus de `</div>` orphelin) |
| wart createRequire depuis tools/ | **confirmé empiriquement** : verify lancé depuis `/tmp` (hors CWD tools/) → 38/38 — résolution deps via `createRequire(HERE)` effective |
| wart install.lock rejoué | **PARTIEL — résiduel reproduit (W7)** : voir ci-dessous |

## W7 (nouveau résiduel) — chemin install.lock encore silencieux un gate plus loin

Rejeu réel du scénario wart v1 sur :9850 : checkout réutilisé (conf.php présente,
**444** — état post-install standard, constaté sur les 3 checkouts) +
`install.lock` résiduel (444 www-data) dans documents/ + **DB vidée**.

1. `DROP DATABASE dolibarr; CREATE DATABASE dolibarr;` → `bash tools/boot.sh <checkout> 9850 -ri`
2. v2 fait bien sa part : `NEED_STEPS=1` → `rm -f install.lock` → steps relancés → re-lock final (fichier recréé, 644 www-data) ✓
3. **MAIS** step2.php s'arrête sur `Configuration file htdocs/conf/conf.php is not writable` — sortie HTML, **exit 0**, 0 table créée. Le canary ne greppe que `DisabledByFileLock|install\.lock` → muet. boot affiche `[boot] install OK` **alors que la base est vide** (0/275 tables)
4. Conséquence réelle : seed.php → `{"ok":false,"errors":["admin fetch KO"]}` ; verify timeout `#id-right`
5. Preuve de la cause : `docker exec -u www-data php -r 'is_writable(conf.php)'` → `false` (444) ; `chmod 666 conf.php` + step2 manuel → **275 tables** d'un coup → step4/step5 → seed OK → verify 38/38 retrouvé

Le fix v2 couvre le lock (retiré, canary, re-lock — mécanisme vérifié) mais le
même scénario de réutilisation échoue encore **silencieusement** au gate
suivant : il manque (a) un `chmod 666 conf.php` quand NEED_STEPS sur checkout
réutilisé, (b) un canary `not writable` / post-check `llx_user` après step5.
Impact : nul sur le flux nominal (clone propre → conf.php absente → step1 la
crée 666 — tout le chaînon v2 marche, prouvé ×3) ; résiduel sur volume+checkout
réutilisés — exactement la famille de warts « boot no-op silencieux ».

## Faits marquants du rejeu

- **Bit-identité partout où elle compte** : baseline-auth 1901 occ distribuées
  à l'identique par règle ; verify-vanilla 30 FAIL ligne-pour-ligne ; badges
  5.48/10.03 sous les deux thèmes ; sondes 308/26/0 exactes.
- **La sonde computed badge mesure vraiment** : sur vanilla elle échoue en
  rapportant fg/bg computed (2.81:1) — elle n'est pas un PASS décoratif.
- **L'état `facture-validee` exerce réellement la surface** : 11 règles
  violées sur vanilla, 2 inc résiduels légitimes patché.
- scopeHash diffère du livré (baseUrl :9840 vs :9820 incluse — normal, connu
  leçon 44) ; statesHash absent des deux côtés.

## Environnement de rejeu

- `doli57-ra-web` :9830 (patché) / `doli57-rv-web` :9840 (vanilla) /
  `doli57-ri-web` :9850 (install-build) — image `doli57-web:24.0.2` +
  mariadb:11.8, clones `~/work/doli57v2-{audit,vanilla,ib}` @7e927764…
- tools/ copiés dans `~/run57v2/tools` (axe-core 4.14.0, playwright 1.63.0,
  node 24) ; rapports de rejeu hors repo `~/run57v2/reports/ra-*`
- Rapports livrés intacts après rejeu (git status propre avant rédaction)
