# Verdict auditeur indépendant — cycle 12 : navidrome/navidrome @ 95f67d2c (v2)

**Verdict : PARTIAL** (score v2 rejoué à l'identique — 0 viol./0 err./exit 0 sur 15 surfaces, scopeHash + statesHash identiques, verify 14/14 durci, eval 6/6, les findings v1 F1/F2/F4/F5/F7 réellement corrigés et vérifiés en live — MAIS `patch-v2.diff` livré ne peut pas produire l'app : 3 fichiers nouveaux absents du diff, `npm ci` échoue sur checkout propre)

Auditeur : session Devin b7143e87 (boucle-continue, branche `devin/boucle-continue`)
Date : 2026-10-04 · Méthode : rejeu intégral — worktree vierge @ `95f67d2c4ef391967327f0c7dccd5d0d8b02f62e`, `git apply patch-v2.diff` (sha256 `3b2d2aab…89c3`, conforme à patch-v2.diff.sha256 + results.json + provenance), outils du cycle relus (audit.mjs, verify.mjs durcis — diff vérifié), même seed 5 mp3 ffmpeg, mêmes commandes boot.

## Ce que j'ai rejoué (build v2 reconstruit — voir finding 1)

| Étape | Résultat |
|---|---|
| sha256 `patch-v2.diff` | OK — `3b2d2aab…` conforme aux 3 emplacements |
| `git apply` sur clone propre | OK (24 fichiers) — **mais patch incomplet, voir finding 1** |
| `npm ci` + postinstall, `npm run build`, `go build -tags netgo,sqlite_fts5` | PASS (après restauration des 3 fichiers manquants) |
| Boot `ND_PORT=8089`, scan 5 pistes, `login.mjs` | PASS |
| `audit.mjs` v2 : 10 urls + `--states all` | **0 règle / 0 occurrence / 0 erreur, exit 0** — conforme à `reports/final-v2/report.json` |
| `audit.mjs` login | **0/0/0, 6 incomplets** — conforme à `reports/final-login-v2/report.json` |
| scopeHash / statesHash rejoués | `830a3798…ce60` / `6548828d…9d3c` — **identiques** au `scope.json` livré et au `states.json` régénéré (F2 résolu : le hash est désormais vérifiable de bout en bout) |
| `verify.mjs` | **14/14 PASS** — dont la nouvelle assertion `menu … layer landmark + #root non masqué` (`{"items":9,"inPopupLayer":true,"rootHidden":null}`) |
| `eval-final.mjs` | **6/6 PASS** |
| provenance.json | **28/28 fichiers conformes** |
| Profil d'incomplets | Identique au livré : `color-contrast` ×14, `aria-valid-attr-value` ×9 — et surtout **zéro `aria-hidden-focus`, zéro `bypass`** (les 6 incomplets des états-menu de la v1 ont disparu) |

## Findings v1 — statut vérifié en live

- **F1 (major) — CORRIGÉ, mieux que le vanilla.** Sondes indépendantes sur les 3 états : `ul[role=menu]` (9 items) → ancêtre `#a11y-popup-layer[role=complementary][aria-label="Popup layer"]`, layer frère de `#root` au niveau body, `#root` `aria-hidden` = **null** à chaque état. Le ModalManager n'a plus de frère à masquer : rien n'est jamais `aria-hidden`, ni le contenu ni le menu — strictement meilleur que le vanilla (qui masquait tout `#root`) et que la v1 (qui masquait le menu). Effet de bord documenté réel : le menu désormais visible par axe a exposé `aria-required-children` amont (Card username/Divider dans `ul[role=menu]`) — déplacés hors du `MenuList`, `Logout` `role=group`. Résolu proprement.
- **F2 (major) — CORRIGÉ.** `states.json.statesHash` = `6548828d…` reproduit à l'identique par mon run via l'`audit.mjs` livré ; `scope.json` présent dans `reports/final-v2/` et `reports/final-login-v2/` ; chaîne de traçabilité complète.
- **F4 (minor) — CORRIGÉ.** `aria-controls="context-menu"` cible un id stable rendu par `keepMounted` → résout.
- **F5 (minor) — CORRIGÉ.** verify.mjs : `h1:visible === 1` réel, sous-menu inspecte le bouton `aria-expanded="true"` réel, et le check menu exige `inPopupLayer && rootHidden !== 'true'` — l'assertion couvre exactement la régression F1.
- **F7 (minor) — CORRIGÉ.** scope.json livrés.
- **F3 (minor) — NON CORRIGÉ.** 39 hunks `"peer": true` de package-lock persistent dans patch-v2.diff (churn non-fonctionnel).
- **F6 (minor) — CORRIGÉ en partie.** `aria-label="more"` → `translate('ra.action.open_menu')` sur les boutons du patch ; un `aria-label="more"` résiduel amont subsiste sur une tuile d'album (hors patch).

## Findings

1. **[critical] `patch-v2.diff` ne peut pas produire l'app auditée — 3 fichiers nouveaux absents du diff.** Le patch référence mais ne contient pas : `ui/bin/patch-ra-a11y.mjs` (appelé par le postinstall de `ui/package.json` que le patch ajoute), `ui/src/common/popupContainer.js` (importé par ContextMenus.jsx, SongContextMenu.jsx, UserMenu.jsx), `ui/src/layout/NavItemLink.jsx` (importé par Menu.jsx, PlaylistsSubMenu.jsx). Preuve : sur worktree vierge + patch-v2 seul, `npm ci` échoue — `MODULE_NOT_FOUND bin/patch-ra-a11y.mjs` (exit 1 au postinstall) ; même contourné, vite échouerait sur les imports `popupContainer`/`NavItemLink`. Cause probable : fichiers non trackés dans l'arbre du worker → invisibles pour `git diff`. `install-build.log` date de la v1 (17:32, pas régénéré) — la garantie « install-build sur clone propre » ne couvre pas la v2. J'ai vérifié le score en reconstruisant : les 2 fichiers repris verbatim de `patch.diff` v1 + `popupContainer` réécrit en 3 lignes (`export const popupContainer = () => document.getElementById('a11y-popup-layer')` — pattern standard du prop `container` MUI v4, à confirmer contre le fichier réel du worker). Le mécanisme est prouvé sain ; la chaîne d'artefacts, non. Correctif : régénérer patch-v2 en incluant les nouveaux fichiers (`git add -N` avant `git diff`, ou `git diff HEAD` après `git add`).

2. **[minor] `install-build.log` non rejoué pour la v2** — le log livré est celui de la v1 ; or c'est précisément ce rejeu qui aurait détecté le finding 1. `results.json.installBuild.onCleanCheckout: true` est une affirmation v1 recyclée.

3. **[minor] `manifest.json` : notes et artefacts obsolètes.** `boot.notes` documente encore « disablePortal ajouté aux Menu/Popover » (supprimé en v2) et `artifacts.patch` pointe patch.diff v1 + « +451/-111 » — le lecteur applique la mauvaise version. `patch_v2` n'est décrit que dans results.json/errata.

4. **[minor] Churn lockfile persistant** (F3 non traité) : 39 hunks `"peer": true` non fonctionnels.

5. **[minor] Landmark vide permanent.** `#a11y-popup-layer[role=complementary]` est présent et vide tant qu'aucun menu n'est ouvert — un point de repère vide pour la navigation par landmarks (bruit AT mineur ; un `aria-hidden` bascule sur état vide l'éviterait).

6. **[minor] Résidus amont.** `aria-label="more"` codé en dur subsistant sur un bouton hors patch ; `aria-valid-attr-value` incomplete ×9 = `aria-controls` amont MUI/RA vers des menus non résolubles (`simple-menu`, ids générés) — même classe que le finding v1 n°4, non introduit par le patch, jamais arbitré.

7. **[info] Runner et outils intègres.** `audit.mjs` : seuls les sélecteurs d'états ont changé (durcissement `:not([aria-hidden])` légitime — cible les menus réellement ouverts, pas masquage) ; `RULE_TAGS` inchangés ; axe-core 4.13.0 ; verify.mjs plus strict qu'en v1, pas plus laxiste.

## Rationale du verdict

Le travail de fond est excellent : les deux majors de la v1 sont corrigés proprement, le nouveau mécanisme est vérifiable et vérifiablement meilleur que l'amont, le score est parfaitement reproductible et la traçabilité states/scope est enfin bouclée. Mais le critère CONFIRMED exige « patch sain » au sens artefact : or `patch-v2.diff` livré seul ne build pas (npm ci exit 1) — la chaîne patch → app auditée est rompue pour tout reproducteur. Même classe que « provenance calculée avant l'édition finale », en plus grave : c'est le livrable central qui est incomplet. **PARTIAL** — à convertir en CONFIRMED dès que patch-v2.diff est régénéré avec les 3 fichiers (et install-build rejoué pour le prouver) ; le reste du cycle est déjà au niveau CONFIRMED.
