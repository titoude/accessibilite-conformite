# Verdict auditeur — cycle 24 TwiN/gatus @884f64d

**Verdict : CONFIRMED** — rejeu indépendant complet, sans confiance (auditeur : devin-afdaac53, 2026-10-05).

Rejeu effectué : clone propre `TwiN/gatus` @ `884f64d8e6d796654ca92b6855aa502151af1f00`,
`git apply patch.diff` (19 fichiers web/app/src, 0 rejet, diff appliqué = diff livré octet
pour octet hors abréviation des index de blobs), `npm ci` + `npm run build` (vue-cli →
web/static), `go build` à la racine, `node fake-services.mjs` (:9101/:9102, rien sur :9999),
`GATUS_CONFIG_PATH=config.yaml ./gatus` sur :8080, attente remplissage watchdog, puis
commandes `manifest.auditCommands` verbatim. Worktree vanilla séparé au même SHA pour la
baseline.

## Rejeu point par point

| Claim | Rejeu auditeur |
|---|---|
| provenance.json | **26/26 sha256 OK** — recalculés depuis le disque ; seul `provenance.json` lui-même est hors carte (normal : il ne peut pas s'auto-hacher) |
| scopeHash | `4b4c5c23…` **identique** baseline ↔ final ↔ install-build ; recomputé depuis `scope.json` (tri des ids de scénarios) = match |
| statesHash | `e281158a…` recomputé **depuis le source** `tools/audit.mjs` livré (url + `setup.toString()` des 7 états) = identique aux 3 scope.json — le runner livré EST celui qui a produit les rapports |
| Baseline 162 occ / 8 règles / 11 scénarios | **recomptée exacte sur le report.json livré** (150 color-contrast + 4 heading-order + 2 role-img-alt + 2 select-name + region + nested-interactive + aria-input-field-name + button-name ; 7 incomplets, 0 erreur). **Rejouée sur vanilla rebuilt** : 145 occ / **mêmes 8 règles, comptes non-contraste identiques nœud-pour-nœud** — tout le delta (−17) est dans les lignes d'*Execution History* de la suite (badges `Passed` + lignes muted `2 endpoints • Nms`), qui croissent d'une exécution toutes les 60 s ; l'uptime au scan diffère → compte indicatif, conforme à la règle protocole « baseline indicative sur données démo » (voir W1) |
| Final 0 viol / 5 incomplets | **reproduit** : re-scan du binaire patché (clone propre) = 0 violation, 0 erreur, 6 incomplets (mêmes familles : overlaps d'overlay transitoire + glyphes ✓ ; voir W2) |
| install-build | **rejoué de bout en bout** : `git apply` propre → `npm ci` → `npm run build` → `go build` → boot → rescan. **Bit-identique** : hash de build frontend `6110cc93c69c19cd` = valeur du install-build.txt livré ; binaire `50870810` octets = valeur livrée ; audit 0 violation ×11 scénarios |
| verify.mjs 28/28 | **rejoué : 28/28 PASS, 0 N-A** — assertions dures relues : élément manquant = `na()` déclaré (jamais `if(el) ok()`), nom accessible réel des boutons, Enter bascule groupe/annonce, modale : aria-modal + focus entré + **12 Tab réels piégés** + Escape ferme, contrastes mesurés (badge pire cas ≥4.5, barres ≥3:1) |
| eval-final.mjs 16/16 | **rejoué : 16/16 PASS** — contrôles indépendants : 1 h1 non vide ×4 routes, Enter carte→détails, ordre Tab sans saut, toggle thème bascule `html.dark`, aria-expanded réel, ArrowDown ouvre listbox + Enter sélectionne, imgs alt, lien markdown rendu focusable, reflow 320px (scrollWidth ≤321), zoom 200 %, indicateur de focus, pagination |
| 5 incomplets = artefacts | **sondes rejouées, ratios identiques** (4.76 / 20.01 / 4.76 sur les bgOverlap, 5.02 ×2 sur les glyphes ✓) — tous mesurés PASS ou hors-scope texte (nonBmp). Logique honnête : marche d'ancêtres vers le premier fond opaque (carte blanche réelle), remesure sous overlay masqué pour le nœud couvert par `#settings` (4.76 identique) ; voir W3 pour une imprécision du champ `coveredBy` |
| manifest.notes « /dashboard n'existe pas » | **vérifié** : router Vue = `/` + `/endpoints/:key` + `/suites/:key`, pas de catch-all ; `GET /dashboard` → **404 `Cannot GET`** côté serveur (nuance de formulation, voir W4). La vraie page publique est bien `/` |
| Seed littéral | `tools/config.yaml` livré rejoué verbatim : 3 endpoints (2 up, legacy-service down :9999), suite checkout-flow 2 étapes avec `[CONTEXT].itemId`, annonce active avec **lien markdown réellement rendu** (vérifié : eval H trouve le `<a href=https://github.com/TwiN/gatus>` focusable) |

## Patch — chasse au masquage

Lu en entier (630 lignes), appliqué sur clone propre. **Aucun masquage** : zéro `display:none`,
zéro `aria-hidden`, zéro `aria-valuemax`, aucune suppression de DOM ni de fonctionnalité —
tous les `v-if` du diff sont des lignes de contexte amont. Corrections structurelles réelles :

- `Settings.vue` : le dropdown intervalles **sorti du `<button>` toggle** dans un `<div class="relative">` frère — vrai fix `nested-interactive` (le bouton ne contient plus de boutons) + `aria-haspopup` ajouté
- `StepDetailsModal.vue` : vrai dialog — `role=dialog` `aria-modal=true` `aria-labelledby=step-modal-title` `tabindex=-1` + `modalContent.focus()` au montage + **piège Tab réel** (keydown document : Shift+Tab sur le 1er focusable → wrap au dernier, Tab sur le dernier → wrap au 1er ; code relu, comportement prouvé par verify) + `Escape→close` + aria-label « Close step details »
- `App.vue` + `Tooltip.vue` : `#tooltip` **déplacé dans `<main>`** + `role=tooltip` + position recalculée relative à `offsetParent` (correct, géométrie conservée) — fix `region`
- `CardTitle.vue` h3→h2 (composant partagé → heading-order ×4), `<h1>` header site → `<p>` (1 h1 par vue, eval A le vérifie ×4)
- `Select.vue`/`SearchBar.vue` : `aria-label` sur `[role=listbox]` via prop `label` (« Filter by »/« Sort by ») ; `EndpointDetails.vue` `aria-label="Chart duration"` sur le `<select>` ; `ResponseTimeChart.vue` aria-label propagé au `canvas[role=img]` (le role amont existait déjà)
- Couleurs réelles : Badge `success` bg-green-500→700, `warning` text-white→text-yellow-950 ; `--destructive` 84.2 %→72.2 % L ; `text-green-500/600`→`700/800` (Tooltip, StepDetailsModal), `text-muted-foreground/60`→plein, `text-muted-foreground`→`foreground/70` sur ligne sélectionnée bg-accent ; barres résultats bg-*-500→600 + placeholders 200→300 (1.4.11 non-texte)
- Hors-axe assumé et réel : `role=button tabindex=0` + Enter/Space sur FlowStep, lignes Execution History, `.endpoint-group-header`, `.announcement-header` ; reflow 320px (`flex-wrap`+`min-w-0` en-tête Home)

## Warts (n'altèrent pas le verdict)

- **W1 — baseline dépendante de l'uptime** : rejouée 145 occ vs 162 livrées, tout le delta sur `/suites/api-tests_checkout-flow` + son état `modale-etape` (badges et lignes muted d'Execution History, +1 ligne par exécution de suite toutes les 60 s). Distribution page×règle et comptes non-contraste identiques ; score final 0 non affecté. Attendu du protocole (compte indicatif sur données croissantes), à tracer pour la prochaine relecture.
- **W2 — compte d'incomplets flottant** : final livré 5, install-build livré 6, mon rejeu 6 — le 6e est un 2e span « N seconds ago » partiellement recouvert par le tooltip ouvert (sa largeur dépend du texte de temps). Même famille d'artefact, sondé PASS (4.76:1). Aucun incomplet n'est un défaut caché : tous mesurés ≥4.5:1 ou glyphes non-texte.
- **W3 — `coveredBy` des sondes imprécis** : `elementsFromPoint` au centre du nœud remonte le **parent** du nœud quand l'overlay ne couvre qu'un coin (vérifié en live : le stack au centre = nœud + ancêtres, le tooltip est bien le recouvrement partiel). Conséquence : `ratioSousOverlayMasque` n'a tourné que sur le nœud recouvert par `#settings` ; les autres bgOverlap reposent sur le ratio direct — suffisant (4.76–20.01:1), mais le champ `coveredBy` ne nomme pas l'overlay réel.
- **W4 — formulation manifeste** : « /dashboard rend le shell sans contenu » — en réalité le serveur répond un **404 nu** (`Cannot GET /dashboard`), sans shell SPA. La conclusion (« /dashboard n'existe pas, la page publique est / ») reste exacte.
- **W5 — nit** : `states.json` est de la prose pointant vers `audit.mjs` (cohérente, setups relus : sédimentation `#settings`+3 s, waitForSelector post-action, reload pour theme-sombre — conformes aux leçons accumulées).

## Détails de rejeu

- `--wait-for '#settings'` + `--wait 3000` rejoués verbatim ; `settleAnimations` du runner v6 actif.
- Bundle patché vérifié servi : `app.js` contient `step-modal-title`, `Close step details`, `Filter by`, `Chart duration`, `aria-modal` ; le bundle vanilla ne contient aucun — contrôle négatif OK.
- `tools/` complet et nécessaire (audit.mjs v6 + verify.mjs + eval-final.mjs + incomplete-probes.mjs + config.yaml + fake-services.mjs + urls.txt + package.json) — aucune dépendance superflue dans tools/package.json.
- `results.json` ne porte pas d'auto-verdict (mesures seules) — conforme protocole.
