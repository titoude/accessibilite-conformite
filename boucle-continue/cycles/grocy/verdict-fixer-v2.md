# Verdict fixer v2 — cycle 36 grocy

**Verdict : FIXED — chaîne de vérification complète rejouée live, toutes les mesures à zéro défaut.**

Le claim manifeste « aria-label ajoutés contiennent TOUJOURS le texte visible (leçon 29) », falsifié par l'auditeur, est **à nouveau vrai et prouvé** : 0 `label-content-name-mismatch` sous axe-core **4.14.0** (scratch) sur les 18 pages flaguées + sondes accName ⊇ visible ; 0 violation sous axe **4.13.0** épinglé sur les 87 scénarios (85 auth + 2 public) ; `?? 9` remplacé par des assertions réelles mesurées live.

Fixer : session devin-50e9e2781e91482c94e94fd5b4bb584f, instance propre :8360 (clone `~/work/run36/grocy` @`41206cb90154e0d17d3e108cc1f182b94fdb465d` + patch régénéré + fixes dans les vraies sources). axe 4.14 utilisé **uniquement** en sonde scratch (kit épinglé inchangé 4.13.0 — leçon 30).

## Fixes produit (dans patch.diff régénéré, 96 fichiers +1447/−567)

| Finding | Fichier | Fix |
|---|---|---|
| F1a — `.nav-link-collapse` `aria-label="Toggle"` | `views/layout/default.blade.php` | **aria-label retiré** — le `<span class="nav-link-text">` rendu fournit déjà le nom (« Manage master data »). Choix « retirer » plutôt que `${visible} — ${label}` : le texte visible suffit, amont plus propre. |
| F1b — productcard « Show more » `aria-label="Toggle"` | `views/components/productcard.blade.php` | **aria-label retiré** — le texte bascule Show more/Show less via `.text()` (productcard.js:298) et porte le nom dynamiquement. |
| F1c — Summernote « Font Size » (amont) | `public/js/grocy_summernote.js` | Bouton dropdown à valeur dynamique : resync `aria-label = "${visible} — ${label}"` au rendu + à chaque changement via **MutationObserver** (label d'origine mis en cache dans `data-a11y-label`, idempotent). Amont non patché (vendor dist intact) — la couche app absorbe. |
| F2 — /transfer `select-name` | `views/transfer.blade.php` + `tools/urls-auth.txt` | `aria-label="{{ $__t('Use a specific stock item') }}"` sur `#specific_stock_entry` (pattern existant `consume.blade.php:124`) ; route intégrée au scope (72 urls). |

## Fixes harnais (tools/)

| Finding | Fichier | Fix |
|---|---|---|
| F3 — verify `?? 9` vacuus | `tools/verify.mjs` | Helper `measureBtn(sel)` : retourne `{found:false}` si absent → `check` FAIL réel (plus de `?? 9`). Cibles corrigées : `.related-links a.btn-primary` sur /products ; `#save-purchase-button` sur /purchase (le vrai bouton success — /products n'a **pas** de `.btn-success`, d'où le `ratio=undefined` live de l'auditeur). Nuit : `page.goto` explicite (pas `reload` qui restait sur /calendar). |
| F4 — sonde alpha ligne 63 | `tools/incomplete-probes.mjs` | Fallback corrigé : `acc[i]*acc[3] + 255*(1-acc[3])` (le `×acc[3]` manquant surestimait les canaux, pouvait dépasser 255). Dormant sur grocy mais calcul honnête maintenant. |
| F5 — états positionnels | `tools/audit.mjs` + `states.json` | 3 menus header : sélecteurs **par contenu exclusif** (`:has(.logout-button)`, `:has(input[name=night-mode])`, `:has(a[href*="/stocksettings"])`) + **stateProof** (waitForSelector du descendant exclusif dans `.dropdown-menu.show` — FAIL bruyant si mauvais widget). Leçon 32. |
| F6 — nits | `tools/package.json` | Nom corrigé `a11y-cycle36-grocy-tools`. urls-auth.txt documenté dans manifeste (72 urls, /transfer ajouté). |

## Mesures live rejouées

| Étape | Commande | Résultat |
|---|---|---|
| axe 4.14 scratch (lcnm) | `node lcnm-414.mjs http://localhost:8360 ../tools/auth.json` (depuis scratch `npm i axe-core@4.14`) | **0 lcnm, 0 autre viol, 0 FAIL** — 18 pages (12 nav-collapse + 4 Summernote + /transfer + /stockoverview scroll-fold `scrollTop=99999`) + modale productcard. accName sondés : `Manage master data`, `Show more`, `13 — Font Size`, select `Use a specific stock item`. Garde : exit 2 si axe ≠ 4.14 (pas de PASS trivial sous 4.13). |
| axe 4.13 épinglé auth | `node audit.mjs … --urls $(cat urls-auth.txt) --states all --storage-state auth.json --wait 1500` | **85 scénarios (72 urls + 13 états), 0 viol, 0 err, 471 inc** — rapport `reports/finalv2-auth/` |
| axe 4.13 épinglé public | `… --urls /login --states login-failed` | **2 scénarios, 0 viol, 0 err** — `reports/finalv2-public/` |
| verify.mjs | `node verify.mjs http://localhost:8360 auth.json` | **16/16 PASS** — wart F3 prouvé corrigé live : `btn-success jour — ratio=5.14`, `nuit — ratio=5.12` (réels, sur `#save-purchase-button`) |
| incomplete-probes | sur `finalv2-auth/report.json` | **280 PASS / 191 N-A / 0 FAIL** — distribution N-A honnête inchangée (disabled→exemption 1.4.3) |
| eval-final | `node eval-final.mjs` | **0 FAIL** (12 pages axe hors-scope+scope, dup-ids, modale post-.show, mobile 390, sidenav ×4) |
| patch.diff | régénéré `git diff HEAD` arbre vérifié | 96 fichiers, **+1447/−567**, sha256 `dca4207515bb41b386cee8a16b160c171579b27c36cc426ed627286f6de9b9d7`, `git apply --check` **propre** sur clone vierge @SHA |
| provenance | `rehash-provenance.py --strict` EN DERNIER | conforme (voir commit) |

## Vérifications indépendantes du fixer

- **F1 mécanisme isVisible/scroll-fold** : la sonde 4.14 scrolle `.navbar-sidenav` à `scrollTop=99999` sur chaque page avant axe → les nav-link-collapse hors viewport initial sont audités. 0 lcnm partout.
- **MutationObserver idempotent** : `data-a11y-label` capture le label Summernote d'origine une fois ; les resync suivants recomposent `${visible} — ${label}` sans empiler les préfixes. Vérifié live : `acc="13 — Font Size"`, `vis="13"`.
- **stateProof effectif** : les 13 états du run finalv2 ont tous produit un scénario `audited` (pas `error`) — les menus ouverts contiennent bien les marqueurs exclusifs attendus.
- **Périmètre non-vacuus** : 85 auth = 72+13 (l'écart +1 vs iter6 = /transfer ajouté, traçable dans scope.json).
- **Incomplets constants** : 471 inc vs 471 (iter6 livré) / 466 (IB) — transitoire DOM attendu, sondes rejouées 280/191/0.

## Limites honnêtes

- axe 4.14 reste **scratch only** : la règle lcnm est absente du gate épinglé 4.13.0 (leçon 30 — pas de bump non sollicité). Le défaut de classe est prouvé absent ; une future mouture du kit le gardera sous contrôle via `tools/lcnm-414.mjs` (garde de version dure).
- `/stockreportspendings` (section B de eval-final) est une URL fautive non-flaguée par l'auditeur — le check dup-ids y mesure une page 404. Laissé tel quel : hors findings, comportement non vacuus (la page 404 rend quand même un DOM contrôlé).
- Aucun autre `aria-label` ajouté par le patch ne porte de texte visible contradictoire : les dropdowns header (View settings/Settings) ont des icônes sans texte (vis=""), l'ajout aria-label est le fix nominal 4.1.2 — couvert par le scan 4.14 complet (0 lcnm toutes pages).
