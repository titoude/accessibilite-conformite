# Verdict auditeur — cycle 22 PrivateBin/PrivateBin @c77f5f1b

**Verdict : CONFIRMED** — rejeu indépendant complet, sans confiance (auditeur : devin-499c03dd, 2026-10-05).

Rejeu effectué : clone propre `PrivateBin/PrivateBin` @ `c77f5f1ba0e9dab499cad22d5d13c65b29e20dc6`,
`git apply patch.diff` (4 fichiers, +71/−27, 0 rejet), `docker run -p 8080:80 -v …:/var/www/html php:8.3-apache`
(image mirror.gcr.io — docker.io rate-limité 429, même digest), `mkdir data && chmod 777`,
`node tools/seed.mjs` puis commandes `manifest.auditCommands` verbatim.

## Rejeu point par point

| Claim | Rejeu auditeur |
|---|---|
| provenance.json | **24/24 sha256 OK** — tous les fichiers livrés hachés depuis le disque, aucun livrable hors carte |
| scopeHash | `79a62c3e…` **identique** baseline ↔ final ↔ install-build ; recomputé depuis `scope.json` (tri ids, JSON.stringify compact) = match |
| statesHash | recomputé **depuis le source** `tools/audit.mjs` (url + setup.toString() des 7 états) = `195875e3…` identique aux 3 scope.json livrés — le runner livré EST celui qui a produit les rapports |
| Baseline 48 occ / 8 règles / 14 scénarios | **reproduite exactement** : vanilla @c77f5f1b re-seedé → 48 occ / 8 règles / 16 incomplets, **distribution par page × règle identique (0 diff nœud-pour-nœud)** |
| Final 0 viol / 15 incomplets | **reproduit** sur mon instance patchée : 0 violation, 14/14 audités, 15 incomplets aux cibles identiques |
| install-build | **rejoué de bout en bout** : apply propre → docker → seed **6/6 ids identiques** (34f395b6…, 872e3787…, 14997909…, 09d52e8d…, commentaires 307aafd6…/a4cdc628…) → rescan 0/0/15 exit 0 |
| verify.mjs 24/24 | **rejoué : 24/24 PASS** (assertions dures, vrai ArrowRight, labels via `el.labels`) |
| eval-final.mjs 9/9 | **rejoué : 9/9 PASS** (30 Tab réels, piège modale, focus indicator, dark link) |
| Sondes incomplets 22/22 | **rejouées : 22 entrées, ratios identiques à l'unité près** (0 FAIL — dont btn-danger 4.53:1 et `.commentdata a` 4.5:1 borderline confirmés). Logique honnête : couches collectées el→root, compositing root→el en alpha-over correct, `backgroundImage` rapportées dans `bgImg` (icône chevron des `<select>`, pas un fond), fallback blanc jamais déclenché, tous les nœuds matchés mesurés (pas de cherry-pick) |
| SRI sha512 Configuration.php | **exact** : recomputé `sha512-z7LaXgl+…` sur `js/privatebin.js` patché = hash déclaré. Confirmé aussi en live : le script charge (les états déchiffrement/password réussissent — un SRI faux aurait bloqué privatebin.js) |

## Patch — chasse au masquage

Lu en entier, appliqué sur clone propre. **Aucun masquage** : pas de `display:none` ajouté, pas d'`aria-valuemax`, aucune suppression de DOM/fonctionnalité ; `aria-hidden="true"` sur les modales pré-existe au patch (attribut Bootstrap togglé). Fixes structurels réels :

- `editorTabs` → `role=tablist` + `li[role=presentation]` + `aria-selected`/`aria-controls`/`roving tabindex` sur les 2 onglets, **keydown Arrow/Home/End réel** dans `js/privatebin.js` (activation automatique, `focus()` + `click()`) ; `aria-controls` → `editorpanel`/`prettymessage` `role=tabpanel` résolvent
- `#sendbutton` **sorti du `<ul>`** (wrapper flex séparé) — fix `list`, bouton conservé
- `#replytemplate` : `<label>` visible **englobant** `#nickname`/`#replymessage` (for/id impossible : ids dupliqués dans le clone) — conforme à la règle axe qui exige un label visible
- `tabindex=1/2/3` retirés sur `#message`/`#sendbutton`/`#messagetab` (ordre naturel)
- 4 modales : `aria-labelledby` ajouté (3× `h2.modal-title.h5` + `passwordmodal` nommé par son `<label>` — voir wart W2)
- `h1` ajouté via `navbar-brand` ; h4/h5/h6 → `h2` avec classes visuelles (`.h4/.h5/.h6`) — heading-order résiduel traité
- `#qrcode-display` `role=img` + `aria-label`
- liens contenu light : `--bs-link-color-rgb → hover` (#0d6efd→#0a58ca, mesuré 6.11:1 ; dark garde #6ea8fe — eval le vérifie)
- 6 occ color-contrast baseline = **vrais liens de contenu** (github issues, privatebin.info, example.com preview) — pas d'artefact de timing

## Warts (n'altèrent pas le verdict)

- **W1 — markup invalide bénin** : `<h2 id="copyShortcutHint"> … </h6>` (la fermeture `</h6>` n'a pas été remplacée dans le diff). HTML5 ferme quand même le h2 à `</h6>` — vérifié en DOM live : le h2 ne contient que `copyShortcutHintText`/`copyShortcutHintBtn`, `#editorpanel` n'est PAS dedans. Invalide pour un validateur, sans effet a11y.
- **W2 — doc results.json** : « titres h2.modal-title sur passwordmodal/… » — passwordmodal n'a PAS de h2 ; son `aria-labelledby` pointe le `<label>` existant (fonctionne, mais le libellé en exagère).
- **W3 — « 22/22 PASS » approximatif** : 21 PASS + 1 **ABSENT** (`#plaintext a`, honnêtement rapporté dans l'artefact, pas masqué).
- **W4 — couverture sondes** : le nœud incomplet dark-mode `a[href$="privatebin.info/"]` (aboutbox) n'est pas sondé directement ; mesuré par mes soins : **6.39:1 PASS**. Les incomplets preview-tab couverts par équivalence (mêmes éléments navbar).
- **W5 — eval-final check F** tolère `children === 0` (passerait si kjua ne rendait rien) + `focusInfo` calculé inutilisé ; nit de harnais sans impact.
- **W6 — nit** : `states.json.statesHash` provient de `reports/final/scope.json` (documenté honnêtement en note) ; les 3 scope.json partagent le même hash de toute façon.

## Détails de rejeu

- `--keep-hash` indispensable confirmé : les fragments base58 portent la clé ; sans lui le scan mesure « Cannot decrypt ».
- Baseline incomplets 16 vs final 15 : cohérent (un nœud résolu).
- `tools/audit.mjs` = `/audit.mjs` canonique du repo **byte-identique hors carte STATES** (setups réels avec sédimentation ; `dark-mode` normalise le viewport 1280 avant le clic — la leçon de contamination page-partagée est appliquée dans le harnais).
- Seed rejoué : POST JSON réels, 12 s entre écritures, ids `fnv1a64(ct)` reproduits bit-à-bit sur `data/` vierge.
- verify.mjs : pas d'assertion vacuole (éléments requis : `links.found`, `headsSeen > 0`, `m.name` truthy).
