# Cycle 40 redmine — verdict fixer-v2

Date : 2026-10-08. Produit : redmine/redmine @10d61f8aea (Rails 8.1.4 + ERB + jQuery). axe-core 4.14.0 (épinglé). Ports fixer : :6201 patché, :6202 install-replay, :6203 vanilla baseline.

## Verdict : findings auditeur v2 corrigés, périmètre étendu à 0 violation, preuves live rejouées

### F-v2-1 — régression reciblage clic-droit sous inert : CORRIGÉ

Cause : `#wrapper` inert absorbait le hit-test — `event.target` retombait sur body/html, jamais sur la ligne, et le handler `.js-contextmenu` (delegated click) ne tirait plus du tout.

Fix (vraies sources, `app/assets/javascripts/context_menu.js`) : `contextMenuRealTarget(event)` lève inert, re-hit-teste via `document.elementFromPoint(clientX, clientY)`, ré-applique inert — retourne la vraie cible. `contextMenuClick` et `contextMenuRightClick` l'utilisent ; un clic-gauche sur `a.js-contextmenu` sous inert est rerouté vers le chemin contextmenu (fermeture+réouverture sur la nouvelle cible). `contextMenuShow` prend la cible résolue pour `data-cm-url` et le serialize du formulaire.

Preuve live : clic-droit ligne A → menu ouvert (916,1) ; clic-droit cellule hors-menu ligne B → menu se déplace (35,1) + ligne B sélectionnée ; clic-gauche `.js-contextmenu` ligne 9 sous inert → menu reciblée (896,199) + ligne 9 sélectionnée.

### F-v2-2 — Escape + restore focus : CORRIGÉ

Fix : handler `keydown` document (contextMenuInit) — Escape sur menu visible → `contextMenuHide()` + focus rendu à `contextMenuTrigger` (enregistré à l'ouverture : `.js-contextmenu` de la ligne, sinon checkbox/lien/li). `tabindex="-1"` + `focus({preventScroll:true})` à l'ouverture : le focus entre dans le dialog (APG).

Preuve live : Escape → menu fermé, `wrapper.inert=false`, `activeElement = a.js-contextmenu` (déclencheur). Répété ×2, y compris après ouverture clavier (Enter).

### F-v2-3 — hors-scope intégré + corrigé : FAIT

Scope étendu : auth +/groups, /users/1, /versions/1, /issues/imports/new ; public +/help/wiki_syntax, /help/wiki_syntax/detailed, /help/code_highlighting (37+18 scénarios).

Corrections sources :
- `groups/index.html.erb`, `users/show.html.erb` : `<th></th>` → `<span class="visually-hidden">` + `l()` (convention du patch).
- `versions/show` : `.badge-status-closed` oc-green-9 (#2b8a3e, 4,36:1) → #237434 → **5,80:1** mesuré.
- `imports/new.html.erb` : `label_tag 'file'` visually-hidden + `l(:label_attachment)` — la legend reste.
- Surface help (47 erb, 8 squelettes `<html>` + 38 XHTML + code_highlighting) : `lang="<%= @help_lang %>"` (+`xml:lang` XHTML) — `@help_lang` posé par `help_controller` = langue RÉELLE du template (fallback en), jamais current_language (honnêteté contenu) ; contenu enveloppé dans `<main>` (landmark-one-main + region) ; `<th></th>`→`<td></td>` ×~90 cellules décoratives de 1re colonne ; `<th><span class="syntax-pre"/></th>` (label « pre » injecté en CSS `:before`, vide pour AT) → `<td>` + sélecteur CSS élargi `th,td` ; checkboxes task-list désactivées → `<label>` ×4 locales ; liens `text-decoration: underline` ×2 CSS ; `ul.toc` sous-listes nues → nichées dans leur `<li>` parent ×23 locales (list) + cibles sommaire 28,4px (target-size) ; syntaxhl `green-9→#237434` (k/nb), `gray-6→gray-7` (c1), alert-titles tip #237434 / caution #9c6500 / warning #c1410e (toutes ≥4,9:1 mesurées).

### Warts

- **W3 `.day-value`** : le claim 6,09:1 était doublement faux — mesure pixel-vraie post-patch : gray-8 (#495057) sur gray-1 (#f1f3f5) = **7,35:1** (PASS). results/verdict corrigés.
- **W1 scopeHash** : régénéré proprement — baseline+final rejoués avec les mêmes `urls-*.txt`/états/axe. Le hash brut inclut l'origine (port) : comparaison normalisée chemin+requête+état → **ensembles de scénarios identiques** auth ET public (`scope-compare.json`, `normalizedScenarioSetsEqual=true`). Le drift venait d'une URL d'état éditée entre runs ; l'ensemble est désormais prouvé égal.
- **W2 verify.mjs** : 3 branches durcies → assertions réelles. `.icon-clear-query` : mesure exigée sur `/issues?query_id=8` (requête appliquée) — h=28px PASS, absence = FAIL. `a.issue` : mesuré sur `/issues/9` (bloc relations rend `link_to_issue` — la liste/issues/6 n'en contient pas, le « absent » masquait un vrai trou) — underline PASS. `m.dlg` : asserté `=== 'dialog'` — la vraie modale jQuery UI s'ouvre via Watchers (Edit déplie un formulaire inline, pas #ajax-modal) — PASS `dialog`.

## Chiffres (périmètre ÉTENDU)

| Run | Scénarios | Violations | Règles | Occurrences | Incomplete | Erreurs |
|---|---|---|---|---|---|---|
| baseline auth (vanilla :6203) | 37 | 308 | 15 | **3067** | 39 | 0 |
| baseline public (vanilla :6203) | 18 | 115 | 16 | **889** | 17 | 0 |
| final auth (patché :6201) | 37 | **0** | 0 | 0 | 39 | 0 |
| final public (patché :6201) | 18 | **0** | 0 | 0 | 16 | 0 |
| install-replay auth (:6202) | 37 | **0** | 0 | 0 | 39 | 0 |
| install-replay public (:6202) | 18 | **0** | 0 | 0 | 16 | 0 |

- verify.mjs : **44 sondes, 0 FAIL** (37 héritées durcies + 7 section 12 menu contextuel).
- incomplete-probes : **141 nœuds — 115 PASS / 26 N-A / 0 FAIL**.
- eval-final : **24 sondes, 0 FAIL** (pages hors périmètre, dup-ids, mobile 390).
- Sondes live dédiées F-v2-1/F-v2-2 : **11/11 PASS**.
- patch.diff : **102 fichiers, +795/−572**, sha256 `9308a98d…c83` — `git apply --check` OK sur clone vierge @10d61f8 ; install-replay (apply→build→seed→rescan) 0 viol/0 err.
- pixel-vrai (leçons 31/35) : badge-closed 5.80, progress-info 8.18, day-value 7.35, syntaxhl k/nb 5.50, c1 7.76, alerts 5.80/4.91/5.21, toc 28.4px — toutes PASS.

## Limites honnêtes

- 26 N-A probes : duplicatas de contraste (même cause gray/blue déjà prouvée) + th-has-data-cells + bypass — inchangés, structurels axe.
- Le right-click sur une zone SOUS le menu ouvert retombe sur le menu (non inert) → `closest(.hascontextmenu)` échoue → return natif sans preventDefault : parité amont (le menu natif s'ouvrirait aussi). Comportement documenté, pas masqué.
- `lang` des templates help reflète la locale du FICHIER servi (fallback en) — pas la langue UI : honnête vis-à-vis du contenu réellement rendu.
- Les 4 fichiers `wiki_syntax` common_mark hors-scope locales (de/ja/ta-in quick-ref + detailed) reçoivent les mêmes transformations mécaniques — seules les pages en (langue seed) sont mesurées ; les autres sont auditées par symétrie de gabarit, pas rejouées par axe (navigateur en `en`).

## Registre outils touchés par le fixer

`tools/urls-auth.txt` (+4), `tools/urls-public.txt` (+3), `tools/verify.mjs` (3 branches durcies + section 12), `reports/{baseline,final,install-replay}/*` regénérés, `scope-compare.json` recalculé normalisé, `results.json` étendu (`fixer_v2`), `patch.diff` régénéré + `patch.diff.sha256`.
