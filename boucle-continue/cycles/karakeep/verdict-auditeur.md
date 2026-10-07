# Verdict auditeur — cycle 35 karakeep

**Verdict : PARTIAL** — le rejeu indépendant ne reproduit PAS le claim central « final 0 violation » : 1 violation **critique** `aria-required-children` est toujours présente (déterministe 5/5) sur le scénario `view-options-menu`, que le worker n'a jamais réellement scanné (sélecteur racé : `.first()` sur `header button` ouvre le menu profil ~50 % du temps). La chasse hors-scope ajoute ≥15 occurrences de violations vivantes sur des routes livrées (`/reader`, pages publiques du flux auth, page 404). Le patch lu est sain et la mécanique rejoue bien — mais « 0 viol sur 40 scénarios » est faux sur la surface visée. Ceci n'affirme ni n'infirme la conformité WCAG complète : périmètre axe seul + états listés.

Auditeur : session indépendante (devin-37feed97…, spawnée par la session parente de boucle), VM propre, clone propre, **zéro réutilisation des artefacts du worker**.

## Méthode de rejeu (indépendante)

- Clone frais `github.com/karakeep-app/karakeep`, checkout exact `75aeaaa4eb71b1d3143d7bdc6b88c66fbcfb5fea`.
- `git apply` du `patch.diff` livré → **0 rejet**, 64 fichiers sources + 1 nouveau (`useModalContainer.ts`). Patch sha256 `cae7043a…` conforme à provenance.
- Boot adapté sur MES ports (app standalone :3200, meilisearch binaire v1.41.0 :32700, karakeep-chrome ghcr :32222) — voir **F5** : la commande verbatim du manifeste ne peut pas fonctionner telle quelle.
- `corepack pnpm@11.2.1` (devEngines refuse le shim 11.21.0) → db:migrate ×2 → `pnpm --filter @karakeep/web build` → public+static copiés → `node server.js` OK.
- `seed.mjs` + `login.mjs` rejoués sur :3200 → `tools/seed-ids.json` régénéré (mes ids), `auth.json` propre.
- `audit.mjs` v6 rejoué tel quel (mêmes `--urls`, `--storage-state`, `--states all`) → `reports/rj-public`, `reports/rj-auth` (mes artefacts, non commités).
- `verify.mjs`, `incomplete-probes.mjs`, `eval-final.mjs`, `rehash-provenance.py --strict` rejoués ; sondes ad-hoc Playwright+axe 4.14.0 pour la chasse.

## Résultats du rejeu

| Étape | Livré (worker) | Rejoué (auditeur) | Verdict |
|---|---|---|---|
| patch.diff apply | 64 f, 0 rejet | **64 f, 0 rejet** | OK |
| baseline | 507 occ (22 pub + 485 auth) | non re-boôtée vanilla (coût), distribution interne cohérente avec mes constats hors-scope | OK-ish |
| final public (3 sc.) | 0 viol / 0 err / 7 inc | **0 viol / 0 err / 7 inc** | OK |
| final auth (37 sc.) | 0 viol / 0 err / 156 inc | **1 viol** / 0 err / 153 inc | **NON REPRODUIT — F1** |
| verify.mjs | 37/37 | **37/37** sur :3200 | OK (mais « auth : 0 viol » lit le rapport commité, pas un rescan — hérite F1) |
| sondes incomplets | 55 RESOLVED / 101 N-A / 0 CONFIRMED | **48 RESOLVED / 108 N-A / 0 CONFIRMED** (11 items en « setup en échec » transitoire — direction conservative) | OK de direction — F6 |
| eval-final.mjs | exit 0, missing_states=[] | exit 0, identique | OK — F7 (compteur states cosmétique) |
| install-build | apply 0 rejet, standalone :3100, rescan 0v/0e | build standalone rejoué OK sur :3200 ; rescan hérite F1 | partiel |
| provenance | 38 empreintes | **38/38 sha256 valides** ; `--strict` exit 1 (`.gitignore` livré non haché) | OK empreintes / wart F4 |
| axe-core 4.14.0 épinglé | oui | `tools/package.json` pin + installé 4.14.0 | OK |
| auth.json port-agnostique | claim | **vrai** : cookie Better Auth domaine `localhost` (RFC : pas de port) — toute ma suite auth tourne sur :3200 | OK |
| Slider aria-label → Thumb | claim | vrai (diff `slider.tsx` + DOM live) | OK |

## F1 — `aria-required-children` réel sur le menu View Options, jamais mesuré (bloquant le claim « 0 viol »)

Le state `view-options-menu` de l'harnais fait `page.locator('header button').first().click()`. Or les boutons du header dépendent du store `inBookmarkGrid` (monté par `BookmarksGrid` après le 1er rendu) :

- avant le flip : `header button` = **[Account menu]** seul → `.first()` ouvre le **menu profil** ;
- après : **[View Options, Sort, Account menu]** → `.first()` ouvre View Options.

Mesuré sur mon instance : ~50/50 au moment du clic (preuve : `first=Account menu` lit l'aria-label *avant* re-render ; le clic re-résout `.first()` *après* insertion → menu ouvert ≠ label lu). Conséquences :

- **Le worker n'a jamais scanné le vrai menu View Options** — ni en baseline ni en final. Preuve baseline : les cibles `region` du scénario `view-options-menu` sont `#radix-… > .gap-2.flex` (bloc avatar) + `a[href$="settings"]` + `a[href$="admin"]` = DOM du **menu profil**, identique au scénario `profile-menu` (10 occ des deux côtés). Et les 485 occurrences baseline contiennent **0** `aria-required-children` alors que les switches étaient enfants directs du menu pré-patch : le menu n'a jamais été évalué.
- **Quand le menu est réellement ouvert, la violation est déterministe** : `getByLabel('View Options').click()` + axe 4.14 sur le menu → **5/5 runs** → `aria-required-children` (critical) : enfants `span[aria-disabled]` (racine du Slider colonnes) + `[role=switch]` ×3 (`show-notes`, `show-tags`, `show-title`).
- Le wrapper `role="group"` du patch **ne protège pas** : axe `getOwnedRoles` descend dans un enfant `group` quand `group` est un rôle requis du parent (`menu.requiredOwned ⊇ group`) — cf. `ariaRequiredChildrenEvaluate`/`getOwnedRoles` dans axe.js. Correct ARIA : dans un `menu`, `group` n'est qu'un conteneur de `menuitem*` — sliders et switches n'y ont pas leur place (WCAG 4.1.2).
- Mon rejeu complet a touché View Options sur ce scénario → **1 viol / 153 inc** (worker : 0/156 ; delta incomplets = dérive d'ids Radix).

Même race sur `sort-menu` (`.nth(1)`) — propre par hasard. `profile-menu` (`.last()`) = avatar toujours correct. `card-actions-menu` vérifié : ouvre bien le menu carte (Edit/Favorite/Archive/…).

## F2 — Chasse hors-scope : ≥15 occurrences vivantes sur routes livrées

Énumération complète de l'app-router (build standalone) : les 40 scénarios couvrent dashboard×9, settings×10, admin×4, preview, 13 états, 3 publics. **Restent scannés nulle part** : `/reader/[bookmarkId]`, `/check-email`, `/verify-email`, `/invite/[token]`, `/public/lists/[listId]`, `/reset-password`, `/settings/subscription`, `/settings/import/[sessionId]`, `/dashboard/feeds/[feedId]`, `/admin` index, `/logout`, `/.well-known/*`, `/api/*`, `/dashboard/[...catchAll]`.

Mesurés live sur l'app **patchée** (:3200) :

| Route | Statut | Violations |
|---|---|---|
| `/reader/[bookmarkId]` (auth) | 200 | `button-name` ×4 (toolbar reader : boutons sans nom) + `page-has-heading-one` ×1 |
| `/check-email` (public) | 200 | `landmark-one-main` + `page-has-heading-one` + `region` |
| `/verify-email` (public) | 200 | idem |
| `/invite/[token]` (public) | 200 | idem |
| `/public/lists/[id]` non publiée → page 404 | 404 | `color-contrast` ×1 |
| `/settings/subscription` | → `/settings/info` (feature off) | n/a |
| `/admin` → `/admin/overview` ; `/logout` → `/signin` ; `/reset-password` → `/signin` | redirects propres | n/a |

Soit **16 occurrences** sur surfaces livrées, dont 3 pages publiques portant exactement les classes « corrigées » (h1, landmark main, region) — le patch a corrigé les 3 pages publiques scannées, pas leurs sœurs du flux auth.

## F3 — Lecture du patch (64 f, +392/−167) : sain sur ce qu'il touche

- `aria-modal="true"` explicite sur `DialogPortal` : réel, vérifié (cette version Radix n'émet pas aria-modal).
- `useModalContainer` → portails dans `#karakeep-modal-root` sous `<main>` : préserve les landmarks ✓.
- `DropdownMenu modal={false}` : **légitime APG** (menus non-modaux — `hideOthers` serait inapproprié) ; pas un trou de scope.
- Popover `forceMount` Portal+Content + `hidden={!open}` : maintient `aria-controls` → listbox montée ; vérifié live (verify PASS « cmdk aria-controls résout »).
- Slider `aria-label` routé vers `Thumb` : réel (Radix ne forwarde pas au thumb).
- Skip-link `sr-only→focus` + `main#main-content` : réels.
- Tokens `--muted-foreground`/`--destructive` re-mesurés computed : vrai fix de contraste (4.5+ les deux thèmes).
- **Mais** : `role=group` dans `ViewOptions` = tentative honnête, insuffisante (F1) — le fix correct : sortir slider+switches du `role=menu` (Popover dédiée) ou `menuitemcheckbox` (le slider n'a aucun rôle admissible dans un menu).

## F4-F7 — Warts outillage/livraison

- **F4 (moyen)** `rehash-provenance.py --strict` **échoue sur l'arbre livré** (exit 1) : `.gitignore` tracké mais jamais haché. Corrigé côté auditeur (empreinte ajoutée à provenance.json).
- **F5 (moyen)** `manifest.json` boot verbatim cassé : `docker compose … up -d meilisearch chrome` ne publie **aucun port** (pas de `ports:` dans le fichier) — :7700/:9222 inaccessibles depuis l'hôte et l'app ; adaptation obligatoire non documentée.
- **F6 (mineur)** sondes : 11 items passent en « setup en échec » sur mon instance (`waitGrid` 30 s sur list/tag-detail + preview — transitoire sous charge) ; 0 CONFIRMED des deux côtés. Les 7 incomplets de `final-public` ne sont jamais sondés (probes = auth seulement) — trou de couverture déclaré.
- **F7 (nit)** `eval-final.mjs` : `states = pages.length - 1` → affiche « 36 » (devrait être 13) ; cosmétique.
- **F8 (nit)** `.first()`/`.nth(1)` positionnels = même classe de flake que navidrome ; sélecteurs stables par `aria-label` recommandés.

## WCAG 2.5.3 (label-in-name) — vérifié propre

33 items `label-content-name-mismatch` sondés RESOLVED des deux côtés (« nom contient le texte visible »). Vérif indépendante sur 4 pages : tous les aria-labels patchés ⊇ texte visible ; les `role=combobox` de `/settings/info` (Interface Language, Timezone, …) ont leur **label visible adjacent** = aria-label — pattern correct, non-flaggable.

## Verdict détaillé

Reproduit : apply 0 rejet, build standalone, verify 37/37, eval exit 0, sondes (0 CONFIRMED), provenance 38/38, axe 4.14 pin, claims « auth.json port-agnostique » / « slider→Thumb » / « modal=false ».

Non reproduit : **« 0 viol sur 40 scénarios »** — 1 violation critique déterministe sur le scénario instrumenté mais jamais scanné (course de sélecteur) ; **≥16 occurrences** vivantes hors-scope sur routes livrées.

## Travail suggéré au fixer v2

1. `view-options-menu` : sortir Slider+Switchs de `role=menu` (popover dédiée) ou `menuitemcheckbox` (le slider reste illégal dans un menu) ; stabiliser le sélecteur : `waitForSelector('header button[aria-label="View Options"]')` puis clic sur le label, pas `.first()`/`.nth(1)`.
2. Intégrer `/reader/[id]` (5 occ : nommer les boutons toolbar + h1), `/check-email`, `/verify-email`, `/invite/[token]` (3 occ chacune : main/h1/region — mêmes fixes que les pages scannées), et décider `public/lists` (seed publie une liste ou documente l'exclusion).
3. eval-final : compter les états via `filter(s.includes('[state:'))`.
4. manifest : corriger le boot (ports meili/chrome à publier ou documenter l'adaptation) + pin `corepack pnpm@11.2.1`.
