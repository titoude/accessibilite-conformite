# Verdict auditeur — cycle 47 espocrm

**Auditeur** : session `devin-11e5088f9c7a4a8f8a01318cdfe264cd` (indépendante, zéro confiance)
**Cible** : `espocrm/espocrm @6c369056e81038fdcbb6512d5d5df11db4ed6e03` (tag 10.0.9)
**Date** : 2026-10-08 — **VERDICT : CONFIRMÉ**

Mes instances propres : vanilla `espoc47a` :8347, patchée `espoc47b` :8348 (install-build verbatim), MariaDB 11.4 propres, seed propre via `tools/seed.mjs`, axe-core **4.14.0** + playwright **1.63.0** (npm ci du lockfile fourni).

## Rejeu des claims

| Claim worker | Résultat rejoué | Verdict |
|---|---|---|
| sha256 patch.diff `6ff39237…70d944` | `6ff39237ae07173506e7f14a8b7cff14ac1358c01ea4027658282fe52070d944` | EXACT |
| 103 fichiers +339/−180 | `git apply --stat` : 103 f, +339/−180 | EXACT |
| `git apply --check` 0 rejet | 0 rejet sur clone vierge @SHA (5 warnings whitespace cosmétiques) | OK |
| Image officielle = SHA exact | `ESPOCRM_VERSION=10.0.9` dans l'image ; clone = tag 10.0.9 | EXACT |
| Baseline public 26 occ/8 règles/0 err | **26 occ / 8 règles / 0 err** (mes données, :8347) | EXACT |
| Baseline auth 2925 occ/21 règles/44 sc. | **2889 occ / 20 règles / 0 err / 44 sc.** | REPRODUIT (bruit ~1.2 %) |
| Install-build verbatim → 0 viol | clone+apply+npm install+`grunt internal`+boot+rescan : **final-auth 0 viol/0 err/244 inc ; final-public 0/0/0** | EXACT |
| verify.mjs 0 FAIL | **37/37 pass, 0 FAIL** | OK |
| eval-final 6/6 (2 N-A) | **6/6 OK (2 N-A)** | EXACT |
| sondes 181 conformes/0 NC/61 NR | **176 conformes / 0 NC / 66 NR** (3 états en timeout flaky) | 0 NC OK |
| provenance --strict 39/39 | **39 empreintes, 0 stale, 0 non-listé, exit 0** | OK |

### Baseline auth : détail de l'écart (−36 occ, −1 règle)
20/21 règles identiques ; écarts tracés par scénario : `link-name` −36 sur 3 états (quick-create-modal, stream-composer, stream-panel-menu — contenu dynamique), `region` +1 systématique (32→33), `color-contrast` ±5, `aria-command-name` −3, `target-size` 2→0 (cellules recouvertes par le menu add-filter — flaky notoire documenté). Toutes les règles dominantes reproduites à l'échelle (region ~1070, link-name ~460, color-contrast ~420, button-name 273 exact, autocomplete-valid 103 exact, etc.). **Pas une falsification — nondéterminisme de données dynamiques** ; magnitude et structure confirmées.

## Pièges stack documentés — vérifiés

- **`@@version`** : CONFIRMÉ. Source git : `application/Espo/Resources/defaults/config.php:57` = `'version' => '@@version'` brut ; image : `'10.0.9'` substitué. Un mount dossier `application/` casserait `config:populate` → file-mounts justifiés.
- **`title` bootstrap→`data-original-title`** : vérifié — les éléments gardent `title`/`data-original-title` ; sonde : les intitulés tooltip restent sur des `span` non interactifs (pas de nom requis) ; boutons/link ont bien des `aria-label` (probe 2.5.3 : 0 fail sur 60 éléments échantillonnés).
- **`#main` requis par controller.js** : vérifié — app rend `<main id="content">` (landmark) contenant `<div id="main">` (outlet routeur, `tabindex="-1"`) ; login rend son propre `<main data-a11y-c47-login>` sans id ; 404 idem. Pas de `<main>` imbriqué.
- **EntityManager custom dans volume** : vérifié — `CSiteAudit` créé via `EntityManager/action/createEntity`, `docker restart espoc47b` → entité toujours servie (`/api/v1/CSiteAudit` = 3 records). Les volumes `espoc47b-custom` + `client-custom` portent la persistance.

## Fixes éprouvés live (mes mesures)

- Landmarks : login `<main>` propre + h1 sr-only + labels `for` + viewport déverrouillé + 0 tabindex>0 ; app : 1 `<main>`, 1 nav, 1 header, 1 footer, h1 "Accounts" ✓
- 2.5.3 (label-in-name) : échantillon 60 boutons/liens aria-label → **0 mismatch** ; slugs i18n dans le rendu réel : **0**
- Contrastes pixel-vrai (composite alpha chaîne DOM + luminance WCAG, mes calculs) : `.text-muted` **5.10:1**, `.text-soft` **5.41:1**, `th .sort` **15.13:1**, `.label-state.label-default` blanc/#6f6f6f **5.03:1** — tous ≥4.5
- Formulaires : login labellisé (`label[for]` user+pass) ; `#Account/create` : axe 0 `label` (mon probe naïf en compte trop — Espo labellise via structure de cellules, non retenu comme finding)
- Menus Backbone : `role=menu` + `li role=none` + `aria-labelledby` résolu ✓ ; `a role=menuitem` présents sur les menus tpl patchés (quick-create, user) — **sauf** more-tabs (voir R1)
- Sabotage : `aria-labelledby` cassé dans `res/templates/site/navbar.tpl` servi → verify.mjs : `FAIL liaison: tous les aria-labelledby de menus résolvent 3 menus, 1 liaisons mortes` — **assertion de LIAISON réelle (L42 ✓)**

## Findings de l'auditeur (rien de falsifiant)

**R1 — Violation résiduelle atteignable (pré-existante, non introduite)** : le menu « more tabs » (`.more-dropdown-menu`, construit en JS — pas par les tpl) conserve `role=menu` + `a` sans `role=menuitem` → axe 4.14 : `aria-required-children` ×1 **quand on l'ouvre**. Présent à l'identique sur vanilla (:8347). Aucun des 12 états n'ouvre ce menu → invisible dans le « 0 viol » des 44 scénarios. Le claim reste vrai *sur les scénarios scannés* ; la couverture n'est pas exhaustive.

**R2 — Hors-scope pré-existant (non introduit)** : `#Admin/upgrade` → `label` ×1 (`input[type=file]`) + `heading-order` ×1 (`h4`) — identique en vanilla ; `#Admin/fieldManager` et routes admin assimilées → `link-name` ×1 (`a[href="#Admin/entityManager/scope="]` — tuile d'entité sans nom, identique en vanilla). `#Email/compose`, `#Report` : routes non rendues dans le produit (composer = modale, Report = module payant absent) → confirmation que le hors-scope est structurel, pas masqué.

**R3 — Trou L43 dans verify.mjs** : j'injecte `aria-label="navbar.moreTabsLabel"` (slug non résolu) dans le tpl servi → il se rend dans le DOM et verify : **0 FAIL**. Les checks accName testent non-vacuité, pas le motif slug. Le patch livré est propre (0 slug détecté en live) — mais verify ne détecterait pas une régression de ce type.

**R4 — Warts outillage** : (a) docstring `incomplete-probes.mjs` mentionne « cycle 34 (stump) » — reste de copier-coller ; (b) `verify.mjs` contient une navigation morte vers `#Account/view/` avec `SEED_ACCOUNT_ID` vide (inerte) ; (c) probes : 3 états en timeout (stream-composer, stream-panel-menu, mobile-nav-390) — re-setup moins robuste que waitForSelector des audits ; (d) patch : 5 lignes whitespace (trailing ws, space-before-tab) ; (e) libellé claim « 31 routes+13 états » — réel : **32 routes + 12 états** = 44 (total correct, répartition erronée dans le prompt et la ligne REGISTRE).

**R5 — `client/lib/templates.tpl` (bundle compilé) n'est pas le chemin servi** : éditer le bundle ne change rien au DOM — Espo sert `client/res/templates/*.tpl` bruts. Sans conséquence pour le patch (il modifie bien `res/templates/`), mais tout futur sabotage/mesure doit viser `res/templates/`.

## Conclusion

**CONFIRMÉ.** Les claims forts sont exacts : install-build verbatim 0 viol/0 err/244 inc (incomplets identiques au claim), baseline public 26/8 exact, sha256/diffstat/0-rejet exacts, verify 0 FAIL, eval 6/6, probes 0 NC, provenance 39/39. Baseline auth reproduite à ~1.2 % près (bruit de données dynamiques, structure intacte). La couverture n'est pas exhaustive : un état réel (more-tabs ouvert) conserve une violation upstream résiduelle, et verify.mjs a un angle mort L43. Ni falsification ni violation introduite détectées.
