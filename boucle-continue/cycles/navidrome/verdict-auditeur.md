# Verdict auditeur indépendant — cycle 12 : navidrome/navidrome @ 95f67d2c

**Verdict : PARTIAL** (score axe reproduit à l'identique — baseline 204 occurrences / 13 règles, final 0/0/exit 0 — et patch sans astuce de harnais, MAIS un correctif (`disablePortal`) introduit une régression d'accessibilité réelle absorbée en `incomplete` sans décision, et `states.json` porte un statesHash périmé invérifiable)

Auditeur : session Devin b7143e87 (cycle boucle-continue, branche `devin/boucle-continue`)
Date : 2026-10-04 · Méthode : rejeu intégral sur machine propre — clone vierge @ `95f67d2c4ef391967327f0c7dccd5d0d8b02f62e`, `git apply` du `patch.diff` livré (sha256 `fe99bfa9…d3b`, conforme), outils du cycle non modifiés, seed 5 mp3 ffmpeg régénéré (IDs album/artiste identiques au manifeste : `69IwB2p7tQDejD3lowUIFo`, `6QiT23Pg8GAJHZop58uMKH`).

## Ce que j'ai rejoué moi-même

| Étape | Résultat |
|---|---|
| sha256 `patch.diff` livré vs recalculé | OK — conforme à `patch.diff.sha256` et `provenance.json` |
| `git apply` sur clone propre @ 95f67d2c | OK (24 fichiers, +455/-111) |
| `npm ci` (ui) + postinstall `patch-ra-a11y.mjs` | PASS — 20 remplacements appliqués, 6 patterns absents (variantes lib/esm, warnings identiques au log du worker) |
| `npm run build` (vite) | PASS |
| `go build -tags netgo,sqlite_fts5` | PASS (go 1.27.1) |
| Boot `ND_MUSICFOLDER/ND_DATAFOLDER/ND_PORT=8089`, scan 5 pistes | PASS — ids déterministes conformes |
| `login.mjs` → `auth.json` | PASS |
| `audit.mjs` final : 10 urls + `--states all` | **0 règle / 0 occurrence / 0 erreur, exit 0** — conforme à `final/report.json` |
| `audit.mjs` login (sans auth, `--states none`) | **0 / 0 / 0** — conforme à `final-login/report.json` |
| `verify.mjs` | **14/14 PASS** — conforme à `results.json` |
| `eval-final.mjs` | **6/6 PASS** — conforme à `results.json` |
| `scopeHash` rejoué | `830a3798…ce60` = scopeHash du `final/report.json` livré — **identique** (mêmes 14 scénarios, ids à l'identique) |
| install-build sur clone propre (ma session = le rejeu) | PASS — npm ci / npm build / go build tous exit 0 |
| provenance.json | **19/19 fichiers conformes** (sha256 + bytes) |

## Baseline rejouée sur build vanilla (worktree séparé, port 8090, même seed)

Distribution **identique** au rapport livré : 197 occurrences sur les 10 pages applicatives (7/6/7/4/8/6/4/5/4/3 par page, mêmes règles par page) + 7 sur login (label ×2, landmark-one-main ×1, page-has-heading-one ×1, region ×3) = **204 occurrences / 13 règles**. La baseline du worker est honnête.

## Incomplets : mêmes règles des deux côtés

Mon run final : 14 scénarios → mêmes règles en incomplete que le rapport livré — `color-contrast` (14 pages), `aria-valid-attr-value` (6), et sur les 3 états à menu modal : `aria-hidden-focus` + `bypass` ×3. Seuls les comptes de nœuds diffèrent (299 vs ~216 — timing, non contradictoire).

## Patch sain — lecture intégrale (1403 lignes, 24 fichiers)

Pas de `display:none`, pas de suppression de DOM audité, pas d'aria décoratif déconnecté, pas de délai artificiel. Corrections réelles et mappables sur les règles de la baseline : `MenuItemLink` → `NavItemLink` maison (suppression de `role=menuitem` hors menu — aria-required-parent), SubMenu restructuré (ListItem non-button + ButtonBase + IconButtons frères — nested-interactive), `<main>` + h1 + labels liés sur login/signup, h5/h6 → h2/p sur les pages show, `srOnly` dans les labels de colonnes d'icônes (empty-table-header honeste), aria-labels sur les IconButtons nus, `component={'div'}` retiré du GridList (ul>li restauré — listitem), contrastes dark/light remontés (`#2979ff` 3.98:1 → `#3f51b5` 6.97:1 — vérifié en computed style), patch postinstall ra-ui-materialui idempotent (aria-label span → inputProps, th bulk nommé, h6 bulk-toolbar → p, h1 role=alert → div, SearchInput label). Mécanisme de patch de dépendance conforme à la leçon CyberChef n°4.

## Findings

1. **[major] `disablePortal` rend les menus ouverts invisibles pour les technologies d'assistance — régression introduite par le patch, absorbée sans décision en `incomplete`.** Démontré en live sur le build patché : menu contextuel ouvert (`[role=menu]`, 9 items) → `document.getElementById('root').ariaHidden === "true"` ET le menu est **à l'intérieur** de `#root` (chaîne DOM : `menu < … < MAIN < … < div#root[aria-hidden]`). Sur le build vanilla, même `aria-hidden` sur `#root` mais le menu en portail au niveau `body` → accessible (mais hors landmarks — la vraie violation `region` que le fix visait). Le patch a donc échangé « menu accessible hors landmark » contre « menu dans un landmark entièrement masqué à l'AT » : fonctionnellement pire pour un utilisateur lecteur d'écran (menu inatteignable), tout en faisant disparaître la violation axe. axe le signale honnêtement comme `aria-hidden-focus` **incomplete** sur les 3 états menu — mais ni `results.json` ni le manifeste ne documentent ce compromis ni ne tranchent ces incomplets. Correct attendu : conserver le portail et rattacher le menu à un landmark/dialog (`role="dialog"` + nom, ou container dédié non-masqué), ou neutraliser l'`aria-hidden` du ModalManager quand le modal vit dans `#root`.

2. **[major] `states.json` : `statesHash` non reproductible — méthadonnée périmée.** Déclaré `890fa714…3cf8` ; recalculé avec le `audit.mjs` livré (même origine `127.0.0.1:8089`, sérialisation `{name:{url,setup}}` telle que scope.json la produit) : `69b0e761…e2a9`. Aucune variante d'origine ni de sérialisation (source brute, setups seuls, labels scénario) ne reproduit le hash livré — il provient d'une révision antérieure d'`audit.mjs` (le `harnessFindings` du manifeste documente une itération `:visible`/hover sur les setups). Même classe que les findings CyberChef (leçon n°5) et paperless : métadonnées calculées avant l'édition finale. Aggravé par l'absence de `scope.json` dans les dossiers `baseline/`/`final/` livrés — le statesHash du run final n'existe nulle part où le vérifier (scopeHash, lui, survit dans report.json et matche).

3. **[minor] Churn non-fonctionnel dans `patch.diff`.** 36 hunks de `package-lock.json` retirant seulement des drapeaux `"peer": true` (regénération par une version npm différente, sans changement de dépendance) — ~72 lignes de bruit. Le manifeste annonce « +451/-111 » pour +455/-111 réel (24 fichiers corrects).

4. **[minor] `aria-controls="long-menu"` pendant** sur le bouton « more » (ContextMenus) : cible `#long-menu` absente du DOM quand le menu est fermé → `aria-valid-attr-value` incomplete sur 6 surfaces. Wart MUI amont (non introduit par le patch), mais jamais décidé.

5. **[minor] `verify.mjs` : deux assertions faibles.** « exactement un h1 visible » teste `>= 1` (libellé trompeur, ne détecterait pas deux h1) ; le check sous-menu inspecte `btns[0]` du premier `[aria-expanded]` du document — pourrait passer sur un autre bouton que celui du sous-menu. Aucune n'est tautologique, toutes deux peuvent échouer — couverture insuffisante, pas triche.

6. **[minor] i18n partielle.** `aria-label="more"` codé en dur (anglais) sur `MoreButton` ; les nouvelles clés (`contextMenu`, `starred`, `playlistConfig`, `saveQueue`) ne sont ajoutées qu'à `en.json` — les autres langues livrées affichent la clé brute ou l'anglais.

7. **[minor] Artefacts incomplets côté livrable.** `audit.mjs` écrit `scope.json` dans le dossier de sortie ; ni `baseline/` ni `final/` ne le contiennent — seuls report.json/report.md sont committés. Le scopeHash reste vérifiable via `report.json.scopeHash` (conforme), mais la traçabilité des états est perdue (voir finding 2).

8. **[info] `bypass` incomplete ×3 états menu.** axe ne peut pas évaluer les bypass-blocks en contexte modal ouvert — attendu, non bloquant.

9. **[info] Runner intègre.** `audit.mjs` octet-identique au cycle 11 hors carte `STATES` ; `RULE_TAGS` inchangés (wcag2a→22aa + best-practice) ; axe-core 4.13.0 dans les deux rapports ; exit codes 0/1/2 respectés ; `--strict-incomplete` non utilisé (cohérent avec le protocole actuel — voir finding 1 pour ce qu'il aurait révélé).

## Rationale du verdict

CONFIRMED exige « score axe reproductible + patch sain ». Le score l'est — intégralement (baseline 204 à l'occurrence près, final 0 viol./0 err./exit 0, mêmes 14+1 scénarios, verify 14/14, eval 6/6, install-build propre, provenance 19/19). Mais le patch n'est pas entièrement sain : le `disablePortal` corrige `region` en rendant les menus inaccessibles à l'AT — défaut réel introduit par la correction, visible uniquement en `incomplete` axe, jamais arbitré. Ajouté au statesHash invérifiable (même classe que le mismatch de provenance du cycle 10), le verdict est **PARTIAL** — à convertir en CONFIRMED après (a) correction du portail/aria-hidden des menus et rescan des 3 états, (b) régénération de `states.json` depuis le `audit.mjs` livré et livraison des `scope.json` dans les rapports.
