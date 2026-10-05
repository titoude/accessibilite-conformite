# Verdict auditeur — cycle 23 BookStackApp/BookStack @f585a7d9100a99cba8479c1ef5fd56e05562daea

**Verdict : CONFIRMED** — rejeu indépendant complet, sans confiance (auditeur : devin-6a8385fb792a4d3b930bcea64c83707d, 2026-10-05).

Rejeu effectué : clone propre `BookStackApp/BookStack` @ `f585a7d9100a99cba8479c1ef5fd56e05562daea`,
`docker compose up -d` (stack officielle du dépôt : php:8.3-apache + mysql:8.4 + node:22-alpine watch + mailhog),
`key:generate --force`, `tools/seed.sh` verbatim (book 342 / chapter 343 / pages 344-345 / comment 1 — ids identiques au log livré),
`login.mjs` → auth.json frais, puis `manifest.auditCommands` verbatim sur :8080 (baseline vanilla → patch appliqué in-place → final).
`tools/install-build.sh` rejoué verbatim → seconde instance :8081 (clone propre du clone → checkout SHA → apply → compose → seed → sondes).

## Rejeu point par point

| Claim | Rejeu auditeur |
|---|---|
| provenance.json | **34/34 sha256 OK** — chaque fichier livré rehashé depuis le disque, aucun livrable hors carte |
| scopeHash | recomputés depuis MES rejeux : `a0967215…` (public, identique baseline↔final), `25c366e7…` (baseline auth avec /templates), `3930e93d…` (final auth) — **les 4 scope.json livrés matchent mes propres runs bit-à-bit**, ensemble de scénarios identique (diff vide) |
| statesHash | recomputé **depuis le source livré** `tools/audit.mjs` (STATES.url(origin) + setup.toString(), JSON.stringify compact) : public `d6ee48c3…`, auth `b1394d44…` — **identiques aux scope.json livrés** : le runner livré EST celui qui a produit les rapports |
| Baseline public 12 règles / 239 occ / 13 scénarios | **reproduite exactement** : 12 règles / **239 occ** / 13 pages / 55 incomplets — distribution page×règle identique |
| Baseline auth 18 règles / 305 occ / 22 scénarios | **reproduite à −2 occ** : 18 règles / **303 occ** / 22 pages / 218 incomplets. Le delta entier = `region` sur `/` (14→12) : nœuds `#recently-viewed`/h4 d'entity-list du widget « récemment consultés » — état de navigation du worker (historique de consultation peuplé) vs le mien. 17/18 règles bit-identiques dont color-contrast 25, region hors-home identique, document-title/html-has-lang sur /templates identiques |
| Final 0 violation | **confirmé live** : 0 violation sur public (13) + auth (21) sur :8080 patché **et** spot 3 pages sur le clone install-build :8081 |
| Final incomplets 231 | rejoué **233** (+2 `color-contrast` sur `[state:recherche-fil]` : items d'entity-list dynamiques) — les incomplets sont le seau « indéterminé » d'axe (messageKey pseudoContent), flottant au timing ; les violations sont à 0 partout |
| Sondes incomplets | **rejouées sur MES rapports** : public 37 PASS + 1 skip-link PASS (identique au livré) ; auth 188 cc PASS + 2 skip-link PASS + 4 N-A `sélecteur absent` (entités des listes dynamiques, même famille que les 2 N-A livrés) + 1 frame-tested N-A — **0 FAIL**. Logique relue : mesure WCAG réelle in-page (dé-masquage display/visibility/opacity des ancêtres, fond composite avec blending alpha), N-A toujours explicité |
| verify.mjs 27/27 | **rejoué : 27/27 PASS live** — assertions réelles (Tab clavier, backdrop présent à l'ouverture, inert sur `main, footer` hors overlay, inert retiré à la fermeture, role=tab/tabpanel câblés, cibles ≥24px mesurées) |
| eval-final.mjs 19/19 | **rejoué : 19/19 PASS live** — rescan axe 8 routes 0 viol (sous-ensemble déclaré, pas le scope entier — honnête), menus/tab/éditeur/recherche fonctionnels, dark-mode restauré par re-clic (persistance serveur réelle, toggle ×2 inconditionnel mais chaque état vérifié) |
| install-build verbatim | **rejoué de bout en bout** : clone propre → checkout SHA → `git apply` 0 rejet (144 fichiers +412/−295) → compose up → /login **500 pré-key** → `key:generate` → **200** → dist/styles.css sert le patch (menu-backdrop) → seed verbatim **ids identiques** (342/343/344/345/commentaire 1) → **5/5 sondes 200** |
| /templates retiré du scope auth (22→21) | **légitime** : `PageTemplateController::list()` rend `pages.parts.template-manager-list` — fragment Blade nu (`{{ $templates->links() }}` + cartes, **sans** `<html>`/`<head>`/`<title>`/`<body>`), consommé en XHR par `template-manager.js` (`$http.get('/templates')`). Vérifié live : GET /templates = 200, **0 octet** avec 0 template seedé. Les 4 violations baseline = bruit structurel `<html>` impossible sur un fragment. Le même markup reste couvert via l'include `editor-toolbox` dans `/edit` (au scope) |

## Patch — chasse au masquage

2810 lignes relues en entier (144 fichiers). **Aucun masquage** : pas de `display:none` ajouté, pas de suppression de contenu, pas de harnais-ajustement du produit. Les changements d'opacité vont dans le sens « plus visible » (opacités réduites supprimées, tab-inactive .5→.75). Points vérifiés :

- `dropdown.js` / `header-mobile-toggle.js` : `.menu-backdrop` (fixed, z-10, transparent) + `inert` posé sur `[main, footer].filter(!contains(menu))` — **inert sur le contenu derrière, PAS sur l'overlay** ; retiré à la fermeture. Menu au-dessus du backdrop (z-999) et header (z-11) : pas de régression cliquable. Le claim « partiallyObscured n'occulte que via cibles tabbables → inert requis » tient : vérifié live par verify (backdrop + inert + retrait).
- Landmark : layouts `simple`/`tri`/`edit` rendent `<main id="main-content" tabindex="-1">` unique ; ~31 vues `<main>`→`<div class="content-wrap card">` (élimine les main imbriqués/doubles) ; `<aside>`→`<div>` dans les sidebars ; skip-link déplacé dans `<header>` (dans le banner landmark — corrige `region` sur le lien lui-même).
- Auth `@section('content')`→`@section('body')` ×11 vues : pré-patch ces vues REMPLAÇAIENT la section `content` de `simple.blade.php` → rendues **sans** le wrapper `#main-content` → landmark-one-main/region réels. Correction structurelle réelle (vérifiée : le yield-chain base→simple→body est cohérent).
- Tabs mobile tri-layout : `role=tablist/tab/tabpanel` câblés avec ids/`aria-controls`/`aria-labelledby` réels, `aria-selected` géré par `tri-layout.ts` (vérifié au source + waitForSelector live sur aria-selected=true).
- h5/h6 → `h2.h5` (~20 vues) + `.h4`/`.h5` ajoutées dans `_text.scss` (rendu visuel conservé) ; `users/profile` h4→h1 ; `home/default` h1 ajouté.
- Contrastes réels mesurés : `.text-muted` #999→#757575 (**2.85→4.61:1**), placeholder explicite #737373 (4.74), tab-inactive .5→.75 alpha, `--color-primary`/`--color-link`/`--color-page`/`--editor-color-primary` #206ea7→#1e6aa5 (5.45→5.74), `$warning` #cf4d03→#c34a03, hovers header blanc-translucide→noir.
- Liens soulignés : `.entity-description a, .comment-box .content a, .editor-content-area a` underline + classes `entity-description` posées sur les descriptions dans les vues.
- Cibles ≥24px : min-width/height sur boutons icône, search-button, icon-list-item min-height 24.
- `dark-mode-toggle` : le `role="{{ $butonRole ?? '' }}"` **typo d'origine** (attribut vide) corrigé en `@if(isset($buttonRole))` + `buttonRole: 'menuitem'` passé depuis le partial — réel fix.
- Avatars `alt="{{ name }}"`→`alt=""` (nom adjacent présent → image-redundant-alt légitime).
- `role=menu`/`role=list` retirés là où les enfants n'étaient pas role-compatibles (child-menu, breadcrumb-listing container, users/edit mfa, markdown-editor) — meilleur sans rôle que faux.

## Warts (n'altèrent pas le verdict)

- **W1 — assertion vacuole dans verify.mjs** : `ok('placeholder >= #757575', /…/.test(ph) || true, ph)` — le `|| true` rend l'assertion infaillible (mesure et affiche seulement). Non bloquant : la valeur réellement mesurée passe (#737373 → ratio ≥4.5), et verify l'a rejouée PASS.
- **W2 — login.mjs écrit `auth.json` au CWD** alors que `auditCommands` lit `tools/auth.json` : le verbatim `node tools/login.mjs` depuis la racine du cycle produit `cycles/bookstack/auth.json`, pas `tools/auth.json`. Pour rejouer il faut `cd tools` ou copier le fichier — gap de doc du manifeste (le worker a dû faire équivalent ; `tools/auth.json` commité est lié à SON APP_KEY et ne fonctionne pas sur une autre instance).
- **W3 — dérive ±2 occ de contenu dynamique** : baseline auth 303 vs 305 (widget `#recently-viewed`, entités consultées par le worker avant son run) ; final +2 incomplets cc sur `[state:recherche-fil]` (listes filtrées). Distribution page×règle identique hors ces nœuds — reproductibilité du score confirmée, pas fabrication.
- **W4 — résidu #999 non patché** : `.dropdown-menu .text-muted`/`… .xl-limited .text-muted` (`_lists.scss`) reste à #999 (2.85:1) — visible seulement dans des menus transitoires non audités (ex. confirmation suppression commentaire). Ne rend rien sur les surfaces scannées (0 viol confirmé live) mais le texte existe.
- **W5 — N-A probe différents (5 vs 3)** : mes 4 `color-contrast/N-A` sont `sélecteur absent du DOM` (entités de listes récentes différentes entre les deux sessions) + 1 `frame-tested` — même famille d'N-A que le livré, honnêtement rapportés.

## Détails de rejeu

- Boot verbatim manifest.boot sur stack officielle : `cp .env.example .env`, compose up, **key:generate obligatoire confirmé** (500 avant, 200 après — identique au log livré install-build.txt).
- Les 8 états STATES rejoués fonctionnellement : aria-selected/mobile-tabs, menus `.anim` visibles, suggestions recherche, onglets commentaires/éditeur — waitForSelector réels passés.
- `audit.mjs` : règles wcag2a/aa/21/22+best-practice, garde-fous stricts (HTTP≥400, redirect-login, changement d'origine/pathname refusés — vérifiés : ils ont détecté mes redirects quand auth.json était invalide), axe injecté avec preuve `window.axe.version`.
- Comptes « pages » recollés : public 13 = 10 urls + 3 états ; auth 22 = 14 urls (avec /templates) + 8 états ; final auth 21 = 13 + 8.
- Deux instances docker simultanées :8080 (dev, patchée in-place) et :8081 (install-build propre) — 0 violation sur les deux.

**Conclusion** : baseline reproductible (239 exact public / 303 vs 305 auth — dérive contenu dynamique documentée), final 0 violation confirmé sur deux instances indépendantes, patch sain sans masquage, scope /templates légitime, preuves (hash, sondes, install-build) authentiques. **CONFIRMED**.
