# Verdict auditeur — cycle 16 (docmost)

Auditeur : session indépendante (rejoue complet sur instance propre : docker postgres :5435 + redis :6382, `PORT=3010 pnpm run server:dev`, vite `--port 5175 --strictPort` patché + `--port 5176` vanilla, seed recréé de zéro : workspace « Audit WS », admin@test.local, espace `general`, page « Test page a11y » avec `slug_id` fixé à `YE3rIig7Vn`, espace public publié).

## Verdict : **PARTIAL**

Le patch est réel, s'applique proprement, ne masque rien, et supprime effectivement la quasi-totalité des violations sur un périmètre identique (baseline re-dérivée auditeur : 33 occ. app + 9 occ. public → 4 + 5). **Mais** le titre « final : 0 violation » n'est pas reproductible : il ne tient que si la page docs publique ne rend aucun contenu (la seed elle-même dit « vue publique shell »). Sur un doc réellement rendu (titre + lien), il reste 9 occurrences / 4 règles. En outre le patch introduit une régression (modale drawio sans nom). Artefacts honnêtes, métrique titre creuse : PARTIAL.

## Rejoue point par point

| # | Point | Résultat |
|---|-------|----------|
| 1 | provenance.json | **29/29 sha256 recalculés identiques** — exact. |
| 2 | patch.diff sur clone propre @2e0538c7 | `git apply --check` OK, apply OK, **705 lignes, 32 fichiers, 0 untracked**, +165/−66 — exact. |
| 3 | install + build | `pnpm install --frozen-lockfile` (pnpm 11.28.2), `@docmost/editor-ext` build, `tsc --noEmit`, `vite build` — **tout passe** sur clone vanilla et patché. |
| 4 | scope.json / states.json | Les 6 `scopeHash` recomputés identiquement ; `states.json.statesHash` = `f7fb50bc…` = final + recomputé depuis la map STATES livrée. `baseline-states2` = sous-ensemble [command-palette, dark-mode] (`b0cf28fc` recomputé). `baseline-states` (`d7de15e3`) **non reproductible** — itération antérieure de STATES, cohérent avec la baseline partielle déclarée mais non vérifiable. |
| 5 | manifest.json | Substitutions documentées (`/`, `/settings/workspace/general`, `/settings/shares`, `/p/docmost`). `auditCommands[]` verbatim rejouables (4 commandes, seulement les runs finaux — **aucune commande baseline**). Boot.notes honnêtes (MAIL_DRIVER non défini = correct : `log` ferait échouer la validation env). Seed **incomplète** : contenu de la page jamais spécifié (le « shell » docs est la clé du 0), migrations `pnpm migration:latest`, `BETA_PUBLIC_SPACES=true` + `allowPublicSpaces` + publish non documentés. |
| 6 | results.json | Pas de verdict auto-proclamé ; baseline partielle déclarée honnêtement (« mesurée APRÈS une première vague », liste les règles vues en scans non persistés). Voir findings sur `verify: "19/19"` et `exit: 0`. |
| 7 | verify.mjs / eval-final.mjs | Assertions **réelles** : `aria-controls` résolu vers un `Tabs.Panel` monté visible, h1 non vides, contrastes calculés sur styles réels, dark-mode via `data-mantine-color-scheme` + `waitForFunction` (pas emulateMedia), dialogs recherchés dans `#a11y-popup-layer` (vraie cible). Rejoue live : **verify 20/20 PASS** (pas 19), **eval-final 9 PASS / 1 FAIL** (`éditeur sombre : aria-allowed-attr` — le linkWrapper, contenu-dépendant). Le check « modal ouverte » passe mais **vacuously** (`found:false` → conditionnelle). |
| 8 | Rejoue audit | Rejoué intégralement. App : **2 règles / 4 occ.** (livré : 0). Public : **3 règles / 5 occ. + 1 erreur + 2 incomplets** (livré : 0 occ / mêmes erreur et incomplets). Même périmètre sur vanilla : **13 règles / 33 occ. app ; 5 règles / 9 occ. public.** |
| 9 | Triches | Aucune trouvée dans le diff lu en entier : pas de `display:none`/DOM removal/`opacity:0` ; le seul `aria-hidden` ajouté est sur l'image avatar décorative dans un `UnstyledButton` nommé (correct). Pas de page déclarée non scannée ; `--wait 3500` raisonnable ; assertions non tautologiques (sauf la conditionnelle modale d'eval-final). **Une régression trouvée** : voir F2. |

## Mesures re-dérivées (même périmètre, même seed, même axe-core 4.13.0)

| Run | Vanilla (baseline auditeur) | Patché (rejoue auditeur) | Livré |
|---|---|---|---|
| app (12 urls + 4 états) | 13 règles / 33 occ. / 8 inc. | 2 règles / 4 occ. / 1 inc. | 0 occ. / 1 inc. |
| public (4 urls) | 5 règles / 9 occ. / 2 inc. | 3 règles / 5 occ. / 2 inc. | 0 occ. / 2 inc. |
| verify.mjs | — | 20/20 PASS | « 19/19 » |
| eval-final.mjs | — | 9/10 (1 FAIL) | « 10/10 » |

Occurrences résiduelles sur le build patché (identiques sur vanilla → **pré-existantes, non introduites, non masquées**) :

- `aria-allowed-attr` : `<span class="linkWrapper">` — `Popover.Target` injecte `aria-haspopup`/`aria-expanded` sur un span nu pour tout lien de page (fix nécessaire côté `link-view.tsx`, non couvert par le patch).
- `aria-input-field-name` ×2 : les deux éditeurs read-only de `readonly-page-editor.tsx` (`role="textbox"` ProseMirror sans nom — patch de `page-editor.tsx`/`title-editor.tsx` ne couvre pas la vue publique docs).
- `color-contrast` ×2 : texte du lien (`span[data-mark-view-content] > span`) et `._tocLink` en mode clair — hors des overrides `docs.module.css`/`--mantine-color-dimmed`.

## Findings

### Major

- **M1 — « 0 violation » non reproductible : dépend d'un doc sans contenu.** La page `/docs/general/YE3rIig7Vn` livrée est décrite dans la seed comme « vue publique shell » : les violations baseline docs portaient uniquement sur des éléments shell (`._searchKbd`, `._searchLabel`, `._description_`, `div[data-portal]`) et le run final n'y voit aucun éditeur. Sur un doc réellement rendu (titre + lien — ce qu'un lecteur public verrait), le périmètre livré produit 9 occ. / 4 règles. Le titre métrique du cycle est donc creux : la seed ne spécifie aucun contenu de page, et la page choisie ne rend rien d'audit-significatif. Écart le plus grave du cycle ; mitigé par le fait que la seed avoue « shell ».
- **M2 — Régression introduite par le patch : modale drawio sans nom.** `drawio-view.tsx` : `aria-label={t("Diagram editor")}` retiré de `Modal.Root`, et cette modale full-screen n'a **pas de `Modal.Title`** → dialog sans nom accessible (WCAG 4.1.2). Les autres retraits d'aria-label (template-preview, history ×2, page-verification) sont sains — `Modal.Title` présent dans chacun. Hors périmètre scanné (la modale ne s'ouvre qu'en éditant un bloc drawio), donc invisible dans les rapports, mais c'est un défaut réel créé par le patch.

### Minor

- **m1** — `verify: "19/19"` : le script livré émet **20** assertions, toutes PASS en rejoue. Sous-déclaration favorable, pas triche.
- **m2** — `final.exit: 0` : vrai seulement pour le run app ; `final-public` sort 2 (erreur `/p/docmost`, par design). Ambiguïté de formulation.
- **m3** — `decisionsIncomplets` ne décide que l'incomplete user-menu (aria-valid-attr-value, probe DOM honnête : `aria-controls` → dropdown réellement monté) ; les 2 incompletes `color-contrast` de `/login` + `/forgot-password` du run public ne sont pas décidées.
- **m4** — `auditCommands[]` ne couvrent que les runs finaux : aucune commande baseline ni `login.mjs` ; la seed ne documente ni les migrations kysely, ni `BETA_PUBLIC_SPACES`, ni le contenu des pages (un lecteur ne peut pas reproduire le 0 sans deviner que le doc doit être vide).
- **m5** — `baseline-states/scope.json.statesHash` (`d7de15e3`) non reproductible depuis la map STATES livrée (itération antérieure ; cohérent avec la baseline partielle déclarée, mais l'artefact n'est pas auto-vérifiable).
- **m6** — eval-final : le check « modal ouverte = dialog nommée dans la couche » est conditionnel (`!found || …`) et passe vacuously (`found:false`) — assertion qui ne teste rien quand la modale n'est pas ouverte.
- **m7** — `scope.json` stocke `runnerVersion` mais ni la valeur `--wait` ni la version axe-core (présente dans `report.json:testEngine` — 4.13.0) ; conventions du protocole partiellement suivies.
- **m8** — Scope baseline ≠ scope final (baseline : 8+2+5+3 scénarios ; final : 12+4+4) — déclaré honnêtement, mais le delta « corrections » n'est pas dérivable des artefacts ; la baseline auditeur ci-dessus (33+9 occ.) fournit la vraie comparaison.

## Ce qui est confirmé au-delà du doute

- Provenance exacte (29/29), patch sain qui s'applique propre (705 l./32 fichiers, 0 untracked), install/build verts.
- Aucun masquage : `#a11y-popup-layer` est un landmark `role=complementary` nommé, visible, qui reçoit réellement les portails (vérifié live : menu, popover notifications, 8 modales dans la couche).
- Efficacité réelle : −88 % d'occurrences app et −45 % public sur périmètre identique (33→4, 9→5) ; dark-mode contrast ×8 → 0 ; `aria-required-children`, `empty-table-header`, `aria-dialog-name`, `page-has-heading-one`, `link-name`, `label`, `heading-order`, `region` tous effectivement corrigés.
- Assertions verify/eval non triviales, rejouées ; l'incomplete user-menu est une décision N-A documentée avec preuve DOM (acceptable).
