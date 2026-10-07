# Verdict auditeur v2 — cycle 36 grocy

**Verdict : CONFIRMED** — les 6 claims du fixer v2 (`c1fcd17`) rejoués intégralement sur mes propres instances/ports/db et tous corroborés, y compris ceux qui étaient falsifiables seulement sous axe 4.14 et les warts d'outillage. Zéro défaut résiduel trouvé par la chasse indépendante ; 2 observations mineures (gap de scope bénin, limite de cycle de vie) documentées.

Auditeur : session indépendante devin-493ba219224a47f1ae1fb763f4cd2528, VM neuve. Instances propres : `:8430` = clone @`41206cb90154` + patch livré (`~/work/grocy-v2/patched`), `:8431` = install-build depuis clone vierge (`~/work/grocy-v2/ib`), axe 4.14 scratch `~/work/grocy-v2/probe414` (hors repo, `npm i axe-core@4.14` → 4.14.0). Zéro réutilisation des instances fixer/worker (:8360, :821x).

## Claims éprouvés (zéro confiance)

| Claim fixer v2 | Rejeu auditeur | Verdict |
|---|---|---|
| F1 — 0 `label-content-name-mismatch` sous axe 4.14 ×18 pages | `lcnm-414.mjs` sous vrai axe **4.14.0** (scratch, garde de version passée) : **0 lcnm, 0 autre viol, 0 FAIL** sur les 18 pages + scroll-fold sidenav (`scrollTop=99999`) | OK |
| accName ⊇ visible | sondés live : `.nav-link-collapse` → « Manage master data » ; productcard → « Show more » ; Font Size → `13 — Font Size` ; select /transfer → « Use a specific stock item » | OK |
| MutationObserver idempotent, survit aux ré-ouvertures | probe `tools/summernote-idem.mjs` (livrée) : initial `13 — Font Size` → changement réel via dropdown → `18 — Font Size` (1 seul ` — `, pas d'empilement) → mutation texte forcée → `36 — Font Size` exact → **codeview on/off : composite conservé** — 4/4 PASS. Limite honnête documentée : destroy+reinit complet hors du bloc a11y de grocy perd le composite (init one-shot au load — aucun chemin réel de ré-init dans grocy : vérifié, `.summernote(` n'est appelé qu'au chargement sur 4 vues) | OK |
| F2 — /transfer dans scope + corrigé | `urls-auth.txt` = 72 urls dont `/transfer` (ajout c1fcd17 tracé) ; rejeu route : **0 viol, 0 select-name** ; `#specific_stock_entry` porte `aria-label="Use a specific stock item"` ⊇ visible | OK |
| F3 — `?? 9` → ratios réels 5.14/5.12 | `verify.mjs` rejoué : **16/16**, `btn-success jour — ratio=5.14`, `nuit — ratio=5.12` sur `#save-purchase-button` ; `measureBtn` retourne `{found:false}` → FAIL si absent (lu : plus de fallback `?? 9`) | OK |
| F4 — fallback alpha ligne 63 | lu : `acc.slice(0,3).map(v => v*acc[3] + 255*(1-acc[3])).concat(1)` — composite alpha-pondéré sur blanc **mathématiquement juste** (chaque canal `v·a + 255·(1−a) ∈ [0,255]`) | OK |
| F5 — sélecteurs par contenu + stateProof | lu : 3 menus via `:has()` exclusifs + `waitForSelector` du descendant exclusif dans `.dropdown-menu.show`. **Éprouvé par sabotage** : copie d'audit.mjs avec stateProof `header-user-menu` → `input[name=night-mode]` (marqueur du menu voisin) → scénario `error` (Timeout 30000ms) compté `1 erreur` — le FAIL est bruyant, pas silencieux | OK |
| Rejeu complet 85+2 scénarios 0 viol/0 err/471 inc | **identique au nœud près** : finalv2-auth :8430 = 85 sc. (72 urls + 13 états) 0 viol/0 err/471 inc, distribution par règle identique ; public 2 sc. 0/0 | OK |
| verify 16/16 ; sondes 280P/191NA/0F ; eval 0 FAIL | 16/16 ; **280 PASS / 191 N-A / 0 FAIL** (distribution identique, N-A jamais comptés PASS) ; **0 FAIL** | OK |
| install-build verbatim | clone vierge @SHA + `git apply --check` → **0 rejet**, patch 96f +1447/−567, sha256 `dca42075…` = sidecar ; composer+yarn → :8431 → **85 sc. 0 viol/0 err/471 inc**. Δ vs IB livrée (84 sc./466 inc) = exactement la page /transfer (+1 sc., +5 nœuds color-contrast) — le rapport IB livré date du worker, avant l'élargissement de scope ; cohérent | OK |
| provenance | `rehash-provenance.py --strict` moi-même : **56/56 empreintes conformes** | OK |

## Chasse indépendante

- **Aria-labels résiduels (le fixer en a traité 3 — reste-t-il des mismatch ?)** : sweep live naïf sur 20 pages lourdes → **29 candidats** où `innerText` n'est pas contenu dans `aria-label` ; **tous bénins** sous sémantique axe 4.14, ce qui recoupe l'empirique « 0 lcnm » :
  - 27 × mobilier Summernote caché (`display:none` : `.note-dropdown-menu` Font Size/Table, popover resize 100/50/25%, `.note-modal` paresseuses) — invisibles pour axe (`innerText` y retombe sur `textContent`) ;
  - 1 × `DIV.note-editable` (« Preparation » vs corps de recette) — le *value* d'un contenteditable n'est pas son label, règle non applicable ;
  - 1 × `SELECT` « Shopping list » vs « Shopping list (5) » — les select ne sont pas dans le sélecteur de la règle lcnm (widgets à nom-par-contenu) ; confirmé empirique : /shoppinglist = 0 lcnm sous 4.14.
  - Verdict : **0 restant sous axe 4.14**.
- **Routes Slim hors-scope** : 121 routes GET énumérées dans `routes.php` ; non-scopées = API/JSON (`/stock/*`, `/system/*`, `/openapi/*`, `/calendar/ical*`, `/manifest`, `/files/*`), impressions/binaires (`*/printlabel`, `*/grocycode`, `/stockentry/{id}/label`, `/print/shoppinglist/thermal` — 404 sans param), actions (`/`, `/logout`, `/manageapikeys/new` → 302) et routes 404 en données démo (`/batteries/{id}`, `/chores/{id}`, `/objects/*`, `/userfields/{e}/{o}`, `/recipes/fulfillment*`, `/user`, `/users/{id}/permissions` — probées live, toutes 404 « Page not found »).
  - **Seule vraie page UI hors scope atteignable** : `/barcodescannertesting` — **liée dans la nav principale** (`default.blade.php:683`, menu), 200, titre propre — **absente de `urls-auth.txt`**. Scannée : 0 viol/0 inc. Gap de scope **bénin** mais réel — à ajouter au scope pour exhaustivité.
- **Warts restants** : aucun nouveau. Le nom de `tools/package.json` est corrigé (`a11y-cycle36-grocy-tools`).

## Observations mineures (non bloquantes)

- **O1 — scope** : `/barcodescannertesting` (liée nav, propre) à intégrer à `urls-auth.txt` au prochain cycle pour couverture exhaustive des pages nav-liées.
- **O2 — limite cycle de vie** : la couche a11y Summernote s'attache une fois au chargement ; un `destroy`+re-init par un code tiers perdrait le composite (observer + label) — aucun chemin applicatif réel dans grocy aujourd'hui.

## Chiffres clefs rejoués (mes instances)

- Patch : **96 fichiers, +1447/−567, 0 rejet**, sha256 conforme au sidecar.
- Final :**85 sc. auth 0 viol/0 err/471 inc + 2 sc. public 0** ; install-build : **85 sc. 0/0/471** (IB livrée 84/466 = scope pré-/transfer) ; verify **16/16** (ratios réels 5.14/5.12) ; sondes **280 PASS / 191 N-A / 0 FAIL** ; eval **0 FAIL** ; lcnm 4.14 **0** sur 18 pages ; provenance **56/56 --strict**.

## Conclusion

Les défauts v1 (F1×3 sites, F2, warts F3/F4/F5/F6) sont corrigés **et prouvés** par le fixer : je les ai tous rejoués et attaqués (sabotage stateProof, sweep naïf de labels, énumération de routes). Rien de falsifiable n'a survécu. Cycle 36 grocy : **CONFIRMED**.
