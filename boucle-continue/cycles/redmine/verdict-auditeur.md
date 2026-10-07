# Verdict auditeur — cycle 40 redmine/redmine @10d61f8

**Verdict : CONFIRMED** — rejeu indépendant complet, zéro confiance (auditeur :
devin-9266398d, 2026-10-07). Trois instances propres construites par mes soins :
`:6101` (clone patched à la main + `tools/Dockerfile`), `:6103` (clone vanilla
même SHA pour la baseline), `:6102` (install-build : tarball GitHub vierge @SHA +
`git apply` + image dérivée). Chacune a sa propre db sqlite, son propre seed, sa
propre `auth-*.json`.

## Rejeu point par point

| Claim worker | Rejeu auditeur |
|---|---|
| patch `git apply --check` 0 rejet, 49 fichiers +210/−139 | **confirmé** : appliqué sur clone propre @`10d61f8aea26…` ET sur tarball vierge ; `--numstat` = 49 f / +210 / −139 ; sha256 du sidecar `a744c344de73…` = le mien à l'octet près |
| seed rejouable (leçon 37) | **confirmé ×2** : `rake redmine:load_default_data` + `rails runner tools/seed.rb` rejoués sur :6101 et :6102 — idempotent, comptes/objets conformes (projet office-website, query 8 « Open bugs », issues 1-15) |
| final 0 viol / 0 err, 33 sc. auth + 15 public | **confirmé, bit-à-bit sur les nœuds** : mes rescans :6101 puis :6102 → **0 violation, 0 erreur, 138 nœuds incomplets auth + 56 publics** — comparaison nœud-par-nœud vs rapports livrés : **0 diff** (mêmes règles, mêmes targets) |
| baseline 2873 auth + 758 public | **confirmée modulo noms de formulaires** : mon rescan vanilla :6103 → **2873 auth exact**, 757 public (−1 : lien `users/6` du flux d'activité, dérive de seed dynamique — honnête). Les seules « diffs » de targets sont `form[name="form-…"]`, nom aléatoire par instance — mêmes noeuds, sémantique identique |
| context_menus `<ul>`→`<nav aria-label>` + JS `role=dialog`/`aria-modal` + `#wrapper` inert | **prouvé en live** : menu ouvert = `role=dialog` + `aria-modal=true` + `aria-label="Actions"` copié du nav ; `#wrapper` prend `inert` (attr + prop) ; Tab/Shift-Tab depuis le body n'atteignent QUE les liens du menu (confinement effectif via inert, sans piège JS) ; clic dehors ou activation d'un lien → inert levé, focus normal ; aucune régression clavier ; **axe 4.14 sur menu ouvert : 0 violation**. Voir W4/W5 pour deux nuances |
| stateProofs / états déterministes | **confirmé** : 9 états déclarés dans `tools/states.json` avec stateProof vérifiables ; `audit.mjs` échoue la page si le proof rate (0 erreur aux scans) ; état `context-menu` prouvé en live ci-dessus ; `mobile-nav-390` = `html.flyout-is-active` réellement basculé |
| verify.mjs 37/37 | **rejoué : 37 PASS / 0 FAIL** sur ma :6101 (incl. footer 6.09 blue-9, pagination 8.18, avatar alt). 3 branches assertives faibles → W2 |
| eval-final.mjs 24/24 | **rejoué : 24 PASS / 0 FAIL** — couvre déjà `/admin/plugins`, enumerations, workflows, roadmap, /settings + dup-ids + mobile |
| sondes 139 nœuds → 112 PASS / 27 N-A / 0 FAIL | **rejoué : honnête** — mon lot = 138 nœuds incomplets (le 139e, `.day-value` du calendrier, n'est pas flaggé incomplete chez moi car le `background` réel est déjà composite par axe — voir §contrastes) : sur les 138 nœuds communs, **0 diff de verdict** (111 PASS + 27 N-A dont 4 lcnm + 22 cachés + 1 th-has-data-cells). N-A contrôlés un par un : raisons réelles (élément display:none hors état, glyph-arrow indécidable pour axe, pas de cellule de données) |
| contraste `.day-value` « blue-8 = 6.09:1 » | **vrai en substance, chiffre exagéré** : `::before` supprimé, `background: var(--oc-blue-8)` réel sur l'élément (prouvé au DOM + screenshot : 261 px ≈ #1971c2, encre blanche) → **mesure pixel-vraie 5.0:1**, calcul WCAG exact 5.02:1. ≥4.5 PASS. Le « 6.09 » correspond à blue-9 (liens/footer) — W3 |
| install-build : clone vierge + apply + doc + rescan | **rejoué de bout en bout** : tarball GitHub @SHA → `git init` + `git apply` (0 rejet, 49f) → `docker build -f tools/Dockerfile` → `docker run :6102` → `load_default_data` + `seed.rb` → rescan **0 viol / 0 err / 138+56 inc — identiques au livré et à ma :6101** |
| provenance 39/39 | `python3 rehash-provenance.py cycles/redmine --strict` → **39/39 empreintes re-hachées OK, spot-check 3/3** (les 3 nouveaux fichiers d'audit y seront ajoutés avant commit) |
| axe version | scope.json livré : `axeVersion: 4.14.0`, pin `axe-core@4.14.0` dans tools/package.json — cohérent (pas d'upgrade furtif : baseline rejouée sous la même version) |

## Corrections structurelles — éprouvées en live (non exhaustif)

- **Menu contextuel** : wrapper `<ul>` → `<nav aria-label="Actions"><ul>` (×4 ERB) ; JS ajoute `role=dialog`/`aria-modal=true`/`aria-label` au div flottant à l'ouverture ; `$('#wrapper').prop('inert', true)` à l'ouverture, retiré dans `contextMenuHide()`. Conséquences mesurées : le focus saute au BODY quand le déclencheur devient inerte, puis Tab n'entre que dans le menu (confinement d'inert) ; fermeture par clic-dehors ou navigation restaure inert. Pas de régression clavier.
- **th vides** : reports/enumerations/issue_statuses/trackers/workflows — `span.visually-hidden` localisé `l()`.
- **Cibles ≥24px** : sidebar, calendar day-num, boards, gantt, icon-only — mesurés en live (probe + verify).
- **Contrastes réels** : gray-6→gray-7 (#868e96→#495057 : 3.36→8.18 sur blanc, mesuré), `.day-value` fond réel blue-8 (5.02 — W3), liens soulignés dans texte via spécificité renforcée `#content`.
- **Aria-labels ajoutés** : jump-box, sidebar-toggle, mobile-toggle, tab-scroll prev/next, move-option ↑↓, select all/issues/users/time-entries checkboxes, jump-box, reactions (`"N Reactions"` contient le compte visible — lcnm-safe par construction), nav landmarks (main-menu/sidebar/flyout/top-menu).

## 2.5.3 sous axe 4.14 — éprouvé en live

Dans `?set_filter=1` + Options ouverts : axe 4.14 (version épinglée) retourne
**0 violation** lcnm et 4 incomplets (`Unable to determine visible text`) sur
`Move to top/up/down/to bottom` — glyphes `⇈↑↓⇊` : axe ne peut pas décider si un
caractère-flèche est du « texte visible ». Verdict N-A des sondes = **honnête**
(la sémantique du bouton est correcte : l'aria-label nomme l'action). Avatar
`role=img` + initiales « AR » + `aria-label="Admin Redmine"` : non flaggé —
role=img exempt de lcnm, accessible name = aria-label (correct). Contrôle
positif injecté : la règle tire bien quand un texte visible réel n'est pas dans
le label.

## Hors-scope restant (chasse active, axe 4.14 live)

Pages GET non couvertes par les 33+15 scénarios, rejouées par mes soins —
résidus réels du produit (hors périmètre déclaré, à documenter — ne remettent
pas en cause le claim scopé) :

- `/groups` → `empty-table-header` ×1 (`th:nth-child(3)`)
- `/users/1` → `empty-table-header` ×1 (`.issue-report` — tableau « issues reported by »)
- `/versions/1` → `color-contrast` ×1 (`.badge` de statut)
- `/issues/imports/new` → `label` ×1 (`#file` upload sans étiquette)
- `/help/wiki_syntax` → 26 viol / 7 règles (page popup de doc sans layout : `html-has-lang`, `landmark-one-main`, `region`, `label`, `empty-table-header`, `color-contrast`, `link-in-text-block`) — hors chrome produit, mais existante
- `/queries`, `/projects/office-website/memberships` → **406 Not Acceptable** (non servi en GET HTML — pas scannable axe)

## Warts

- **W1** `scopeHash` public baseline↔final diffère : l'URL de l'état `mobile-nav-390` a été éditée `/issues` → `/issues?set_filter=1` entre les deux runs (tools modifiés après la baseline). Explication déterministe, jumelage des pages documenté — pas une falsification mais une souillure de provenance.
- **W2** `verify.mjs` a 3 branches assertives faibles : `icon-clear-query` passe si `m.clearH === undefined` (l'assertion est vacuante quand le sélecteur ne matche pas — ici l'élément existe, h=28px, donc réalité OK), `a.issue` passe sur la chaîne `'absent'`, `m.dlg` mesuré mais jamais asserté.
- **W3** claim « `.day-value` blue-8 = 6.09:1 » faux en chiffre : réel 5.02:1 (white/#1971c2, pixel-vrai 5.0). Le 6.09 est le ratio blue-9 des liens. La propriété tient (≥4.5) — exagération de nombre, pas de propriété.
- **W4** régression souris introduite par `inert` : clic-droit sur une AUTRE ligne alors que le menu est ouvert ne recible pas (l'`tr` source est sous #wrapper inerte → `contextmenu` ne remonte pas). Amont : le menu se recible. Clavier et premier ouverture inchangés. Régression réelle mais bornée au flux « re-click droit avec menu ouvert ».
- **W5** `Escape` ne ferme PAS le menu contextuel — parité amont (comportement Redmine natif, pas introduit par le patch).
- **W6** baseline public −1 nœud chez moi (`a[href$="users/6"]` du fil d'activité) — dérive de seed dynamique (entrée d'activité différente sur une instance rejouée) — le compte exact de la baseline livrée reste cohérent par ailleurs.
- **W7** `form[name="form-…"]` : nom aléatoire par instance → les `target` axe diffèrent en chaîne, mêmes nœuds sémantiques (normal — non masquable).
- **W8** `docker exec` ignore l'entrypoint de l'image → `SECRET_KEY_BASE` obligatoire sur rails/rake (documenté dans manifest + install-build.log — nécessité vérifiée).

## Chiffres

| Mesure | livré | rejoué :6101 | rejoué :6102 (IB) | rejoué :6103 (vanilla) |
|---|---|---|---|---|
| baseline auth occ/règles/inc/err | 2873/15/148/0 | — | — | 2873/15/148/0 |
| baseline public occ/règles/inc/err | 758/14/70/0 | — | — | 757/14/70/0 |
| final auth viol/err/inc | 0/0/138 | 0/0/138 | 0/0/138 | — |
| final public viol/err/inc | 0/0/56 | 0/0/56 | 0/0/56 | — |
| verify.mjs | 37/37 | 37/37 | — | — |
| eval-final.mjs | 24/24 | 24/24 | — | — |
| sondes incomplete | 112P/27NA/0F | 111P/27NA/0F (n=138, .day-value absent de mon lot incomplet, prouvé séparément pixel-vrai 5.0) | — | — |
| provenance --strict | 39/39 | 39/39 | — | — |
| diff nœud-par-nœud final | — | 0 | 0 | — |

**Conclusion** : mécanisme de boot/seed entièrement rejouable, scans bit-identiques
sur 2 instances indépendantes + install-build vierge, fix structurel du menu
contextuel fonctionnel (confinement d'inert prouvé, axe 0 viol sur menu ouvert),
sondes honnêtes, provenance stricte 39/39. Résidus hors-scope réels listés
ci-dessus (4 pages produit + 1 popup doc) — ce sont des reliquats de périmètre,
pas des falsifications du claim. Les 2 seules infidélités sont chiffrées :
« 6.09:1 » pour `.day-value` (réel 5.02 — toujours PASS) et la régression clic-
droit/recible (W4). **CONFIRMED.**
