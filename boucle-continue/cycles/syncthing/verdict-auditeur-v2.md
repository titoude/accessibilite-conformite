# Verdict auditeur v2 — cycle 28 : syncthing

**Verdict : PARTIAL** — les corrections produit (F1–F3, W1, W2) sont toutes confirmées par mesures indépendantes en live, MAIS l'outillage livré avec les corrections est défectueux : `verify.mjs` v2 ne peut pas terminer (FAIL garanti + crash déterministe), et `incomplete-probes.mjs` ne rejoue pas les états en pratique (185/188 items restent N-A) — le claim F4 « les 124 items jamais re-mesurés le sont désormais » est faux tel que livré, et le rapport de sondes commité est celui du vieux script.

- Auditeur : session Devin indépendante `devin-5f6867d78c0e46d6a7690a801060e819`
- Produit : syncthing/syncthing @ `7ad73b408adc792cabeed41d89a37b93e2bd84d0`
- Commits audités : `91ba72a` + `1a5ba9f` (+ `838948c` gitignore) sur `devin/boucle-continue`
- Méthode : rejeu intégral — clone vierge @SHA (fetch --depth 1) ×2 (vanilla + patché), `git apply patch.diff` **0 rejet, 20 fichiers (+274/−124)**, `go generate` → gui.files.go 5 821 220→5 821 396 o, `go build` (38 506 864 o), boot STGUIASSETS vanilla :8384 → seed → baseline, reboot STGUIASSETS patché → final, verify, probes, install-build clone+apply+generate+build → embed :8484 rescan.

## Rejeu vs livré — chiffres

| Axe | Livré (v1 corrigé) | Rejeu auditeur v2 | Δ |
|---|---|---|---|
| baseline-public | 3 règles / 6 occ | 3 règles / 6 occ | **identique** |
| baseline-auth | 16 règles / 1157 occ / 46 pages | 16 règles / **1158** occ / 46 pages | ±1–2 dérive documentée (color-contrast +1, landmark-one-main −1, page-has-heading-one −1, region +2 — les mêmes familles dynamiques) |
| final-public | 0 viol / 0 err | 0 viol / 0 err | identique |
| final-auth | 0 viol / 0 err / 213 inc | 0 viol / 0 err / **188 inc** / 46 pages | scopeHash `54bb51d7…` **identique** ; le −25 est exactement les familles corrigées (cf. ci-dessous) |
| eval-final | 1163 → 0 | **1164 → 0** (mes rapports rejoués) | cohérent (6 public + 1158 auth) |
| install-build | embed :8484 → 0 viol | clone+apply+generate+build rejoué → **0 viol / 0 err / 188 inc / 46 pages** | confirmé — l'embed embarque bien les sources corrigées (188 = post-fix, pas 213) |
| provenance | 36 fichiers | **36/36 sha256 exacts** (depuis objets git) ; node_modules×2 en `skipped_unreadable`, auth.json exclu | corrigé |

**Delta incomplets final-auth (par règle, livré → rejeu)** : `link-in-text-block` 12→**0**, `duplicate-id-aria` 13→**0**, `color-contrast` 187→187, `th-has-data-cells` 1→1. Les 13 duplicate-id-aria livrés étaient tous `input#sharedwith-` — la famille F3 exacte.

## Findings v1 — éprouvés indépendamment en live

1. **F1 (2.1.1 accordéon) — CONFIRMÉ RÉPARÉ.** Mesures auditeur sur #advanced ouvert : 15 `.panel-heading[role="button"][data-toggle="collapse"]`, **15/15 portent `tabindex="0"`**, aucun `tabindex` sur les h4/panel-title ; `document.activeElement` = le `div.panel-heading` au focus ; **Enter → #guiConfig `.in` + aria-expanded="true"**, **Espace → #optionsConfig `.in`**, re-clic referme. Le handler keydown dans app.js fonctionne ; Bootstrap collapse reçoit le click synthétique.
2. **F2 (1.4.1 liens Help) — CONFIRMÉ RÉPARÉ.** 15 liens texte mesurés dans les modales ouvertes : #settings = 9 « Help » sur 5 onglets (General/GUI/Connections/Ignored Devices/Ignored Folders), #editFolder = 6 (5 « Help » + 1 « full documentation ») — **tous `text-decoration-line: underline`**, couleur rgb(29,111,165). Le sélecteur `.modal-body a:not(.btn)` couvre bien les positions adjacentes aux labels. axe `link-in-text-block` : 12→0.
3. **F3 (duplicate-id sharedwith-*) — CONFIRMÉ RÉPARÉ.** #editDevice onglet Sharing ouvert : 3 inputs `sharedwith-archives-s658`, `sharedwith-broken-s660`, `sharedwith-sync-main-s662` — **tous uniques**, `label[for]` appariés, 0 orphelin. axe `duplicate-id-aria` : 13→0. Résiduel assumé documenté confirmé : l'hôte `<share-template id="">` garde un id vide (≠ doublon axe) et des inputs password/checkbox sans id subsistent hors portée `sharedwith-`.
4. **F4 (sonde rejoue les états) — NON RÉPARÉ en pratique.** Le mécanisme existe dans le code (extraction `const STATES = {…}` d'audit.mjs par regex+eval, rejeu du setup avant mesure) mais **il échoue à l'exécution** : les setups référencent des helpers module-level (`dashReady`, `waitDashboard`, `restartSyncthing`, `waitThemeApplied`, `putJson`, `getJson`, `expandPanel`, `openSettings`, `openEditFolder`, `openEditDevice`, `actionsMenuClick`, `helpMenuClick`, `addDevice`, `addFolder`, `showDiscoveryStatus`, `showListenerStatus`, `shareDeviceIdDialog`, `restoreTree`, …) que l'eval ne remonte pas → **chaque setup d'état lève `ReferenceError: dashReady is not defined`** (et assimilés). Résultat de mon rejeu : **188 items → 1 RESOLVED / 187 N-A**, dont 185 « setup de l'état … en échec » — couverture équivalente à v1, motif différent. Les sondes `link-in-text-block` / `th-has-data-cells` existent bien dans le code, mais ne sont atteintes que si le setup passe (l'item `th-has-data-cells` de `recent-changes` : N-A setup en échec). Correctif sain : extraire STATES+helpers dans un module commun importé par les deux scripts (ou `export` depuis audit.mjs avec import dynamique sans exécution).
5. **W1 (provenance re-hashée) — CONFIRMÉ** : 36/36 sha256 recalculés depuis les objets git = déclarés.
6. **W2 (seed.sh ports paramétrables) — CONFIRMÉ** : les seules occurrences de 8484/8485/22001/22002 sont les défauts `ST2_GUI_PORT`/`ST2_LISTEN_PORT`/`ST3_GUI_PORT`/`ST3_LISTEN_PORT` ; toutes les substitutions utilisent les variables (config.xml st2/st3 via argv python). Prouvé en live : seed complet avec `ST2_GUI_PORT=8684 ST3_GUI_PORT=8685` → pending device st3 + pending folder st2 obtenus, sans collision avec mon instance :8484 install-build.

## Nouveaux findings (outillage livré défectueux)

1. **verify.mjs v2 ne peut pas terminer — déterministe.** Rejeu tel quel : 24 PASS / 1 N-A (localChanged, même N-A qu'en v1) / 1 FAIL / crash.
   - `FAIL liens d aide des modales soulignés — -1 souligné(s)` : l'assertion mesure la modale ouverte `#advanced`, qui ne contient que des liens **icône** (`a[target="_blank"] > span.fas`, textContent vide → filtrés) ; les « Help » textuels sont dans #settings/#editFolder/#editDevice. `helpUnderlined = -1` quand le set mesuré est vide → FAIL garanti sur un produit pourtant conforme. (Mesure indépendante ci-dessus : les vrais liens sont soulignés.)
   - Crash `editDeviceExisting` (timeout 30 s → exit 1, sans ligne de synthèse) : `button.panel-heading[data-target^="#device-"].first()` résout `#device-this` (« This Device ») qui est **déjà ouvert** (`collapse in`) → le clic le **referme** → le bouton Edit (dans les panneaux distants `device-0-*`, fermés) reste invisible. Les assertions sharedwith-*/settings/theme/login après cette ligne ne tournent jamais. Aucun output verify livré dans reports/ → probablement jamais exécuté à terme après ajout des assertions.
   - Les 4 assertions accordéon, elles, passent réellement (non-vacues : confirmées par ma mesure indépendante).
2. **reports/incomplete-probes.json livré = sortie du VIEUX script** (213 items, dont 124 N-A « élément absent au rejeu ») — jamais régénéré avec le script F4, qui produit 188 items dont 185 N-A « setup en échec ». Artefact interne cohérent (son sha256 est correct dans provenance.json) mais le contenu documente une couverture que le nouvel outil n'atteint pas — lag doc, pas falsification.
3. (Mineur) REGISTRE.md ligne 28 cite « patch.diff sha e46c369c » et « 19 fichiers » — patch v1 ; le patch v2 fait 20 fichiers, sha256 `a2c0eef6…`.

## Warts restants

- `gui.files.go` non déterministe au sha256 près entre deux go generate (même taille 5 821 396 o, hash différent — timestamps d'embed ; attendu, vérifier par taille + contenu servi).
- Dérive ±1–2 incomplets/occurrences par état entre runs (contenu dynamique) — inchangé, documenté.
- `tools/auth.json` écrasé par le login de l'instance install-build (artefact éphémère exclu de la provenance — conforme).

## Ce que le verdict signifie

- **PARTIAL** parce que tout ce qui touche le *produit* est confirmé (patch sain, 0 rejet, 0 violation axe sur 46 pages ×2 pipelines, scopeHash identique, F1/F2/F3 prouvés réparés par mesures live indépendantes, W1/W2 corrigés) mais les claims portés par l'outillage des corrections ne tiennent pas : F4 ne rejoue pas les états en pratique (claim « désormais mesurés » faux tel que livré), verify.mjs v2 livré échoue/crashe de façon déterministe, et le rapport de sondes commité est périmé.
- Le claim principal du cycle reste vrai : « 0 violation axe sur 46 pages » reproduit à l'occurrence près, y compris sur le binaire embed reconstruit.
- Pour un CONFIRMED en v3 : corriger verify.mjs (mesurer les Help dans une modale qui en contient, ex. #settings ; cliquer un panneau `device-0-*` fermé plutôt que `#device-this`), partager STATES+helpers via un module importé (pas d'eval d'une tranche de code), régénérer reports/incomplete-probes.json avec le script corrigé.
