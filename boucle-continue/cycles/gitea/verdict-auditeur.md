# Verdict auditeur — cycle 32 : go-gitea/gitea

**Verdict : PARTIAL** — tout l'axe se reproduit indépendamment (score axe 1453 vs 1456 livré, même ensemble de 20 règles ; final 0 viol/0 err ; sondes 943/943 conformes sur MON seed et MON port ; verify 51/51 ; eval 30/30 ; provenance 37/37 sha256 ; install-build clone+apply+build+boot+rescan 0 viol) **MAIS le patch introduit une régression clavier réelle, invisible à axe : les dropdowns menu-button (`role=button` APG) ne s'ouvrent plus au clavier** — Enter/Espace/flèches morts (menu jamais visible, `aria-expanded` reste `false`) alors que vanilla ouvrait sur Enter — et sur les combos de sidebar (labels/milestone/assignees), Enter **clique l'item `.selected` (« Clear labels ») au lieu d'ouvrir** : action destructive non demandée + `activeElement` retombe sur `BODY` (focus perdu). WCAG 2.1.1 régressif sur toutes les pages portant ces widgets, dont des pages du périmètre scanné.

- Auditeur : session Devin indépendante `devin-4c6c347d7afd4f75bbe2c3c32cb3b408`
- Produit : go-gitea/gitea @ `99053ce4fa2b45f1bca5837418c0c57f793ca824` (v1.24.7)
- Branche/commit audités : `devin/boucle-continue` @ `e7f2b8e`
- Mes ports : vanilla :3300 (`~/work/gitea-base`), patché install-build :3301 (`~/work/gitea-install`) ; rapports rejoués dans `~/work/audit-reports/` ; origines réécrites sur mes ports (leçon syncthing).
- Méthode : rejeu intégral — clone vierge @SHA ×2, `git apply --check` + `git apply patch.diff` **0 rejet, 270 fichiers (+1224/−722)**, `npm ci` + webpack + `go build` (TAGS sqlite) réels → binaire → boot :3301 → seed frais (DB sqlite, token API neuf, auth-3301.json régénéré — sessions gitea en mémoire) → baseline vanilla :3300 + final patché :3301 + sondes + verify + eval + provenance recalculée + surfaces hors-scope.

## Rejeu vs livré — chiffres

| Axe | Livré | Rejeu auditeur | Δ |
|---|---|---|---|
| baseline-public | 270 occ / 15 règles / 23 p | **273 occ / 15 règles / 23 p** | +3, même ensemble de règles |
| baseline-auth | 1186 occ / 18 règles / 50 p | **1180 occ / 18 règles / 50 p** | −6, même ensemble de règles |
| baseline total | **1456 occ / 20 règles union** | **1453 occ / 20 règles union** | **−3 (−0,2 %)** — familles transitoires documentées (link-in-text-block positions feed, color-contrast admin-users-2, target-size +1) ; identité de règles exacte |
| baseline incomplets | 177+987=1164 | 53+150=203 | variance élevée des incomplets axe sur données fraîches — l'occurrence est la métrique contractuelle, les incomplets dépendent du seed |
| final-public | 0 viol / 0 err / 125 inc | 0 viol / 0 err / **125 inc** | identique |
| final-auth | 0 viol / 0 err / 817 inc | 0 viol / 0 err / **818 inc** | +1 `color-contrast` (même famille transitoire que la dérive baseline) |
| sondes incomplets | 942/942 conformes | **943/943 conformes, 0 non-conforme, 0 non retrouvée** | +1 = même incrément que final-auth |
| verify.mjs | 51/51 | 51/51 exécuté entier | identique |
| eval-final.mjs | 30/30 | 30/30 exécuté entier | identique |
| provenance.json | 37 sha256 | **37/37 recalculés exacts** | identique (après restauration du rapport de sondes, voir wart W1) |
| install-build | clone+apply+build+boot :3233 → 0 viol | clone vierge + apply + npm ci + webpack + go build + boot :3301 → **0 viol/0 err** | confirmé — le binaire reconstruit embarque bien les sources patchées |

## Santé du patch (zones chaudes relues + éprouvées en live)

- **dropdown.ts** — vraie implémentation APG, pas un contournement : combobox détecté par `:scope > input.search` (rôle sur l'input), menu-button sinon (rôle sur premier enfant non-popup), `aria-haspopup/controls/expanded`, nom dérivé label→placeholder→texte→tooltip→fallback, items `menuitem|option`, `aria-activedescendant` limité aux comboboxes (aria-allowed-attr respecté), menus scrollables `tabindex=0`, sync via MutationObserver. **Vérifié live : les comboboxes fonctionnent au clavier** (focus → menu `visible` + `aria-expanded=true`, flèche bas → `aria-activedescendant` résolu vers un vrai id `_aria_auto_id_*` régénéré — /repo/create 4/4, /pulls/5 1/2, le 2e n'ouvrant pas au focus par design). **MAIS la classe menu-button est cassée au clavier** — finding F5 ci-dessous.
- **modal.ts** — `lastInteraction` capturé au pointerdown + `resolveOpener` + restore dans `onHidden`. **Prouvé en live** : focus sur le déclencheur `#lock-conversation` → Enter ouvre la modale (focus à l'intérieur) → **Escape → `document.activeElement` = exactement le bouton déclencheur**. Conforme au claim « restauration vers déclencheur visible ».
- **tippy.ts / toast.ts** — `aria-label` uniquement sur déclencheurs nameables ; `role=status|alert` + `aria-live` + bouton close nommé. Réel, dans les sources.
- **templates** — landmarks main/footer, h1 `.tw-sr-only` injectés, hiérarchie h4→h2 corrigée, alts. **Exception mesurée : `admin/layout_head.tmpl` injecte `<h1 class="tw-sr-only">{{.ctxData.Title}}</h1>` qui rend VIDE sur `/-/admin/self_check`** (Title non défini) → finding F1.
- **theme-gitea-light/dark.css** — recolors réels de tokens. Spot-check dark sur mon instance (emulateMedia + `[data-theme="gitea-auto"]`) : body 11,22:1, header 11,47:1, `.ui.button.primary` 5,59:1, footer/navbar 11,93:1 — contrastes réels ≥ 4,5.

## Findings — régression introduite par le patch

### F5 (majeur) — les dropdowns menu-button perdent l'ouverture clavier (WCAG 2.1.1 régressif)

Mesures comparées même page (`/a11yorg/demo-repo/issues/1` et navbar), mêmes événements (synthétiques ET `page.keyboard` réel) :

| Widget | Vanilla :3300 | Patché :3301 |
|---|---|---|
| navbar dropdown | focus `DIV[tabindex=0]` → **Enter : menu `visible`**, focus stable | focus `SPAN[role=button]` → **Enter/Espace/ArrowDown : rien** (`visible` false, `aria-expanded` false) |
| sidebar combo labels (`.issue-sidebar-combo`) | focus `INPUT` → **Enter : menu `visible`** | focus `<a class="fixed-text muted">` → **Enter clique `.item.selected` (« Clear labels »)** → re-render → **`activeElement` = BODY** |

Mécanisme lu dans le diff : `dropdown.ts` retire `tabindex` de la racine `.ui.dropdown` (l.248) et donne le focus au premier enfant non-popup (l.239-245 : `<a>`/`<span>` sans comportement d'activation natif — Enter sur `<a>` sans `href` ne synthétise pas de `click`). Le seul `keydown` ajouté (l.306-317) clique `.item.selected` s'il existe — d'où « Clear labels » déclenché au lieu d'ouvrir, avec perte de focus quand le combo re-rend le DOM. Le handler fomantic natif ignore apparemment l'Enter quand `document.activeElement` n'est plus la racine du module.

Portée : **tous les `.ui.dropdown` non-combobox du produit** (menus navbar, combos sidebar, dropdowns de filtres/jump…) — les comboboxes (search input) sont épargnées et mesurées fonctionnelles. Vanilla : Enter ouvrait ces menus. La structure ARIA APG affichée (role=button, haspopup, expanded) annonce un contrat clavier que le patch ne livre pas — et sur les sidebar combos Enter a un effet destructif inattendu. Axe ne voit rien de tout ça ; c'est exactement le genre de régression qu'un audit doit attraper.

### F1 — `empty-heading` introduit sur `/-/admin/self_check`

`templates/admin/layout_head.tmpl` ajoute `<h1 class="tw-sr-only">{{.ctxData.Title}}</h1>` ; sur self_check `Title` n'est pas renseigné → **`<h1 class="tw-sr-only"></h1>` vide** mesuré (violation axe `empty-heading`, 1 occ). Vanilla avait `page-has-heading-one` à la place — même sévérité WCAG, la règle change mais le défaut persiste : le mécanisme h1 dépend silencieusement de `.Title` renseigné.

### Résiduels amont hors périmètre scanné (mesurés, non bloquants)

- `label` ×1 `/-/admin/monitor/stacktrace` : `<input name="seconds" size="3">` sans label (le template a été patché h4→h2 mais l'input oublié).
- `link-name` ×3 `/-/admin/emails` + ×2 `/-/admin/repos` : liens d'action icône-only sans nom discernable (tables admin non scannées).
- `link-name` ×2 `/a11yorg/demo-repo/watchers` : liens avatar dont l'`<img alt="">` rend le lien sans nom (`watchers.tmpl` patché pour le h1, pas pour `user_cards`).
- 15 autres URLs admin/org/settings/PR rejouées : 0 violation (`monitor/stats|cron|queue|diagnosis`, `/org/a11yorg/settings`, `user/settings/{organization,blocked_users,keys}`, `pulls/5/commits`, `forks`…). Diagnosis = téléchargement (non scannable), quelques 404 de routes devinées normalisées (`issues/1/edit`, `stargazers`, `pulls/5/checks`).

## Honnêteté des claims — vérifiée

- États mutants non-idempotents **documentés** (navbar-mobile, dark-theme placés en fin de STATES, notés dans states.json + results.honnêteté). ✓
- Runs anonymes avant détection **documentés** (2 runs silencieux, leçon sessions-en-mémoire). ✓
- Sondes = **vraies mesures** (composite alpha top→down avec repli des couches rgba, `getElementById` sur `aria-controls` `_aria_auto_id_*`, target-size, underline, td count) — rejeu sur mon seed : **943 sondes, 943 conformes, 0 non-conforme, 0 non retrouvée**. Le repli « présence » d'aria-controls est une mesure de résolution, déclarée en commentaire. ✓
- `results.json` ne cache rien de mesuré par moi ; scopeHash/statesHash baseline↔final cohérents. ✓

## Warts d'outillage (défauts non bloquants, mesurés)

- **W1 — `incomplete-probes.mjs` écrit sa sortie dans `../reports/incomplete-probes.json`** : le rapport commité + hashé par provenance est écrasé à chaque exécution. Mon run a dû être restauré par `git checkout` pour que les 37 sha256 restent valides. Sortie devrait aller hors arbre ou être régénérée+commitée.
- **W2 — compteur `unfound` défectueux** : les résultats `found:false` n'ont pas de clé `pass` → le filtre `r.pass === null` les rate → des sondes non relocalisées seraient invisibles du résumé (vérifié en erreur d'invocation anonyme : 434 « non retrouvées » réelles remontées seulement parce que la synthèse les compte — mais le code les compterait mal si `found:false` cohabitait avec `pass` absent). Correctif trivial : compter `r.found === false`.
- **W3 — origines non réécrites** : pour les pages non-état, la sonde utilise `t.url` verbatim depuis les report.json (absolus). Rejouer les rapports *du worker* verbatim viserait son port (leçon 15 non implémentée côté outil — ça marche ici parce que je rejoue MES rapports qui portent mon origine).
- **W4 — `seed.mjs` non robuste/non idempotent** : `prs.body.some()` crashe quand `GET /pulls` retourne un objet d'erreur non-tableau (reproduit ×3 sur DB fraîche) ; l'issue fermée est absente de `?type=issues` (open-only) → un re-run la recrée en open et **décale l'index PR #5→#6**. Seed à réparer (attendre un tableau, requêter les closed).
- **W5 (mineur)** — invocation sondes positionnelle non documentée (`argv[3]` = authPath) : passer `--storage-state` classique casse silencieusement l'auth.

## Ce que le verdict signifie

- **PARTIAL** : le contrat mesurable est entièrement reproduit — 1453/1456 baseline (mêmes 20 règles, dérive documentée), 0 viol final sur build réel indépendant, sondes 943/943 mesurées conformes, verify/eval complets, provenance intègre, claims honnêtes. Rien n'est simulé ni orienté scanner.
- Mais « patch sain » n'est pas établi à 100 % : **F5 casse l'opérabilité clavier de tous les dropdowns menu-button** (et transforme Enter en « clear + perte de focus » sur les combos sidebar) — une régression WCAG 2.1.1 sur pages du périmètre, plus F1 (h1 vide auto-injecté). L'ARIA affiché promet un comportement APG non livré.
- Pour CONFIRMED en v2 : relier le `keydown` du focusable menu-button à `module.toggle()`/ouverture (Enter/Espace/ArrowDown ouvrent comme vanilla, items navigables, Escape referme + restore), empêcher le clic `.item.selected` d'être déclenché quand l'intention est « ouvrir », poser le h1 conditionnellement à `.Title` non vide, labeller les inputs/liens admin restants (stacktrace, emails, repos, watchers).
