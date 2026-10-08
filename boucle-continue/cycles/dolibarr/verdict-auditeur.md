# Verdict auditeur — cycle 57 Dolibarr/dolibarr @7e927764767343334aaa067ca5ec054cfea0a26b (tag 24.0.2)

**Verdict : CONFIRMED-avec-résiduels** — rejeu indépendant complet, zéro confiance
(auditeur : devin-2c2701e2, 2026-10-08). Deux instances propres construites par
mes soins : `:9800` (clone `~/work/doli57-audit`, vanilla → patché in situ comme
le worker) et `:9810` (install-build verbatim : clone local vierge `~/work/doli57-ib`
@SHA → `git apply` → boot `-i` → seed). Image `doli57-web:24.0.2` re-buildée par
mes soins depuis le Dockerfile livré (absente du cache), mariadb:11.8 frais.

## Rejeu point par point

| Claim worker | Rejeu auditeur |
|---|---|
| patch sha256 `e7d54669…`, 20 fichiers, `git apply --check` 0 rejet | **confirmé** : sha256 identique ; `git apply --check` propre sur les 2 clones ; 20 fichiers modifiés. `git apply --stat` = **277 insertions / 76 suppressions** vs « +274/−76 » annoncé (Δ3 lignes, cosmétique — W5) |
| baseline public 3 règles / 8 occ | **reproduit exact** : vanilla :9800 → 3 règles / **8 occ** / 2 inc |
| baseline auth 19 règles / 1860 occ | **reproduit à la dérive près** : **19 règles / 1845 occ** / 627 inc. scopeHash `14cf48c7…` + statesHash `37c55213…` **bit-à-bit identiques** aux rapports livrés. Δ−15 occ localisée par règle : region −18, label −7, select-name −2, link-name −1, color-contrast +5, aria-prohibited-attr +8 — dérive de contenu dynamique (listes/widgets), structure identique |
| final 0 viol / 0 err / 303 inc | **PARTIELLEMENT reproduit** : final-public 0/0/1 inc OK ; final-auth → **1 règle / 2 occ** / 304 inc : `color-contrast` sur `.badge-status1` (fg #fff / bg #bc9526 = **2.81:1**) × 2 pages (facture list + card facid=1). Cause racine → W1 : la facture 1 du worker était **draft** dans tous ses rapports (`tr[data-rowid="1"].status0`, `badge-status0`), donc badge-status1 jamais rendu chez lui ; mon seed a réellement validé (fk_statut=1, ref IN2610-0001 — comme le prétend leur seed-info) → la violation résiduelle apparaît |
| verify.mjs 35/35 | **reproduit dans leur état réel** : 35/35 OK sur facture **draft** (facid=2, état que le worker avait réellement). Sur l'état que seed-info.json prétend (facture **validée**) : **29/35** — 6 FAIL : 5 checks du form add-line absents sur facture validée (le DOM ne rend pas `price_ht/qty/tva_tx/type/dropdownAdd` — assertions calibrées pour un draft, wart d'outil) + 1 check contrastes badges réel (`Not paid` cr=2.81 + dot status9 cr=4.4 <4.5) |
| eval-final.mjs 20/20 | **reproduit** : 20/20 OK, 0 FAIL, 2 N-A honnêtes (skip-link absent produit, régions live absentes) |
| sabotage `$onlycontrols` → FAIL nommé | **reproduit** : `$onlycontrols=false` sur clone live → `FAIL liste: aucun <th> vide 1` (nommé, exact) → restore |
| vanilla verify 22 FAIL | **reproduit exact** : clone :9810 pré-patch → **13/35 OK, 22 FAIL**, liste ligne-pour-ligne identique au verify-vanilla.txt livré (mêmes 22 items, mêmes 2 N-A) |
| sondes 304 → 279 OK/25 N-A/0 NC | **reproduit** : mes rapports regénérés → **305 nœuds → 280 OK / 25 N-A / 0 non-conforme** (Δ+1 nœud = dérive contenu). Mêmes familles N-A (fond image login, select2 transient, link-in-text-block couleur-distincte-non-soulignée, menuhider 0×0 mobile) |
| install-build 0/0/0 verbatim | **reproduit** : clone vierge @SHA + `git apply --check` 0 rejet + boot `-i` + seed + rescan :9810 → public 0/0/1 + auth **1r/2occ** — les mêmes 2 occ badge-status1 (cohérent : install-build du worker tournait aussi sur facture draft) |
| provenance 46/46 | **vérifiée** : re-hash sha256 de tous les fichiers livrés = 46/46 exact |

## Épreuves spécifiques demandées

- **Leçon 43 — `$langs->trans` résolvent réellement en_US, ×2 thèmes** : OK.
  DOM live (auth) : `nav.tmenudiv[aria-label="Menu"]`, `nav.side-nav[aria-label="Modules/Applications"]`,
  entrées menu « Home / Third parties / Products | Services / Projects / Commerce /
  Billing | Payment / Banks | Cash / Agenda », h1 « Home ». **Idem sous thème md**
  (`MAIN_THEME=md` posé via llx_const, `theme/md/style.css.php` chargé, fonte roboto) :
  les deux landmarks + mêmes libellés traduits réels. Restauré à eldy.
- **Leçon 47 — stateProof/setups vanilla-safe** : OK. Les 5 états ont tourné sur
  l'instance **vanilla** :9800 pendant mon baseline-auth — 25/25 pages auditées,
  0 erreur de setup (chaque `setup` finit sur un waitForSelector de preuve qui
  existerait sur vanilla : `.login-dropdown-a`, `.tabsElemActive`, `.butAction`,
  `.select2-container`, `#id-container`).
- **Pas de masquage axe (lib_head.js.php)** : confirmé. L'IIFE tourne inconditionnellement
  (pas de détection d'axe), n'écrit que des accNames **sémantiques réels** (label[for],
  cellule d'en-tête, td précédent, placeholder, name fallback `replace(/[_-]/,' ')`),
  écritures conditionnelles `!==` anti-boucle. Le MutationObserver n'est **pas débouncé**
  contrairement à la prose worker (« débouncé 50ms ») : il rappelle fixSearchInputs/
  fixSelect2 synchrone à chaque batch de mutations — convergent car les écritures aria
  deviennent des no-ops au 2e passage (et `aria-label` n'est pas dans l'attributeFilter).
  Wart de documentation, pas de défaut (W4).
- **th-contrôles→td structurel** : confirmé par le sabotage (le check mord) + diff lu :
  `$onlycontrols` ou `textprobe` vide → `<td>` — correct.
- **Nav non fermée** (soupçon auditeur : patch pose `<nav class="tmenudiv">` mais
  `print_end_menu_array()` imprime toujours `</div>`) : DOM live **sain** — le parseur
  HTML5 ferme `nav.tmenudiv` au `</div>` orphelin ; `nav` ne contient **pas** `#id-right`
  (vérifié `nav.contains(right)=false`), landmarks disjoints. Benin.

## Warts

- **W1 — résidu réel + trou de provenance seed-info** : `seed.php` appelle
  `$admin->getRights()` **avant** l'activation des modules → `Facture::validate()`
  tombe sur `hasRight('facture','creer')=false` → « Permission denied » sur DB
  vraiment fraîche ; la facture reste **draft** silencieusement. C'est l'état réel
  des 3 rapports worker (rowid=1 status0 partout) — pourtant leur `seed-info.json`
  clame `facture_validee_id:1` + `IN2610-0001` + `errors:[]` : le seed-info livré ne
  provient pas de l'état DB réellement scanné. Conséquences : (a) la facture validée
  n'a jamais été exercée chez le worker → 2 violations `color-contrast` réelles
  `.badge-status1` (#fff/#bc9526, 2.81:1 — patch corrige status4/4b/7 mais **pas
  status1**) détectées chez moi ; (b) dot badge status9 #6e6e6e/#e7f0f0 = 4.4:1
  <4.5 aussi flaggé par le check verify badges. Pour rejouer verbatim, j'ai dû
  pré-activer les modules (snippet hors patch) puis re-seeder sur base remise à zéro.
- **W2 — verify.mjs suppose une facture draft** : `FAC1 = facture_validee_id` pointe
  sur facid=1 ; si la facture est réellement validée le form add-line n'existe pas →
  5 FAIL d'outillage. Assertion d'état manquante (leçon 32 : prouver `fk_statut`
  avant d'affirmer sur le form).
- **W3 — install.lock persistant** : le volume `documents` garde `install.lock` →
  un re-boot `base vide` rejoue step2/4/5 qui deviennent des **no-ops silencieux**
  (tables absentes, seed KO « admin fetch »). `rm install.lock` + steps manuels requis.
- **W4 — prose « MutationObserver débouncé 50ms » inexacte** : non débouncé, synchrone
  (convergent par gardes `!==` — sûr mais pas comme décrit).
- **W5 — décompte patch** : 277 insertions mesurées (git apply --stat) vs 274 annoncées.
- **W6 — probes lisent `page.state` inexistant** : `incomplete-probes.mjs` lit
  `j.state` depuis les pages du report — champ absent → les nœuds des états sont
  re-sondés sur l'URL de base (état fermé). Aucun faux négatif observé (les N-A
  restants sont des états transitoires assumés), mais la couverture des états par
  les sondes est plus faible qu'annoncée.

## Verdict

CONFIRMED-avec-résiduels : tous les chiffres-tête reproduisent (baseline 3r/8 public
+ 19r/~1860 auth à dérive près, mêmes scopeHash/statesHash ; 22 FAIL vanilla nommés
identiques ; sabotage FAIL nommé ; eval 20/20 ; sondes 279+→0 NC ; install-build ;
provenance 46/46 ; axe non masqué ; i18n ×2 thèmes). Résidu réel : `badge-status1`
(Not paid, 2.81:1) non corrigé + trou de provenance seed-info — le worker n'a
jamais scanné la facture validée qu'il déclarait avoir. Reste une amélioration
sérieuse et honnête : 1860→2 occ résiduelles localisées.
