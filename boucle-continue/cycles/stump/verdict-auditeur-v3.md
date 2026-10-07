# Verdict auditeur v3 — cycle stump (stumpapp/stump @42a9918c1542, v0.1.10)

**Statut : CONFIRMED** — toutes les claims du fixer v3 (3fc7627) rejouées par moi, de bout en bout, sur une infra 100% indépendante : mes propres clones vierges @SHA, le patch appliqué par moi, mes builds (yarn + cargo), mes db (sqlite fraîches, seed rejoué ×2), mes ports (`:27434` instance principale, `:27435` install-build) — jamais :11334/:11335 ni :19334/:19335 ni :17434/:17435. Aucune confiance aux artefacts livrés : chaque chiffre a été recalculé ou re-mesuré par mes scripts.

Rappel protocole : le verdict porte sur la reproductibilité axe et la santé du patch sur le périmètre déclaré, pas sur la conformité WCAG du produit.

---

## Ce que j'ai rejoué et vérifié

### 0. Espace de travail indépendant
- `~/work/stump-a3` — clone vierge `@42a9918` + `git apply patch.diff` : **0 rejet**, **138 fichiers, +544/−302** (sha256 `34124c25a12b47533694fa34f6d993243812a3c89c563c159805b32813710904` — identique à `patch.diff.sha256` livré).
- `~/work/stump-a3-ib` — second clone + même patch → **install-build vraiment indépendant** (`git apply --check` 0 rejet, `yarn install` + `yarn web build` + `cargo build` exécutés *dans* ce clone, 4m57s ; le binaire sert sa propre dist via `debug_setup()` compile-time — mécanisme W3 déjà vérifié en v2, re-confirmé : `strings` du binaire ib contient `~/work/stump-a3-ib/apps/web/dist`).
- `~/work/stump-a3-vanilla` — clone sans patch, dist vanilla construite par moi puis **swappée sur :27434** (dist servie du disque, pas de restart) pour le contrôle négatif F-v2.
- Sessions/auth créées par moi (`admin`/`adminpass123`, `auth-27434.json` / `auth-ib-27435.json`), db `core/dev.db` de chaque clone — UUIDs épinglés réécrits par moi via sqlite (11 refs + 2 `library_scan_records` sur ib, `PRAGMA foreign_key_check` propre ; 13 refs sur main).

### 1. F-v2 — DatePicker et triggers (claim « 0 aria-allowed-attr »)

Mesure live, modale « Create API key » ouverte sur `/settings/api-keys` :

| Instance | axe `aria-allowed-attr` | `div[aria-haspopup\|aria-expanded]` | `<button>` avec `aria-haspopup` | tag du trigger DatePicker |
|---|---|---|---|---|
| **patché** (:27434) | **0** | **0** | **9** | `BUTTON` |
| **vanilla** (même instance, dist swappée) | **1** (cible `.w-70` — le div layout du DatePicker) | **2** | 7 | `BUTTON` (imbriqué dans le div fautif) |

Le contrôle négatif prouve que ma mesure détecte le bug (il existe bien en vanilla : la div `.w-70` reçoit `aria-haspopup="dialog"`) et que le patch le supprime. Le second `divPopup` vanilla = l'ellipsis de pagination (`trigger={<div>}` de `Pagination.tsx`).

**Pattern vérifié dans les sources patchées** (relecture des hunks, pas juste grep) :
- `packages/components/src/calendar/DatePicker.tsx` — `PopoverTrigger asChild` déplacé du `<div className="w-70">` layout vers le `<Button>` interne ✓
- `packages/browser/src/components/Pagination.tsx:167` — `trigger={<button type="button" aria-label="Go to page" …>}` ✓
- `packages/browser/src/components/table/Pagination.tsx:72` — ellipsis `<Button size="icon" aria-label="Go to page">` + aria-labels Previous/Next ✓
- `packages/browser/src/scenes/book/BookOverviewScene/NextInSeries.tsx` — `const trigger` passé de `<div>` à `<button type="button" aria-label={t('bookOverviewScene.nextInSeries')}>` (+ dismiss Button `aria-label="Dismiss"`, EntityImage alt) ✓

**Claim exacte.**

### 2. Bonus claim — `PagePopoverForm` role=dialog nommé

État `login-activity-pagination` sur `/settings/users` (125 lignes seedées → 13 pages, ellipsis rendu). Popover ouvert :

- axe `aria-dialog-name` : **0 violation** ; axe total : **0 violation**
- DOM : `role="dialog"` porte **`aria-label="Jump to another page"`**, `aria-labelledby` absent
- `form[id^="pagination-page-entry-form"]` monté, input labellé « Jump to another page »

Source : `PagePopoverForm.tsx` — `<Popover.Content size="md" aria-label="Jump to another page">` ✓ **Claim exacte.**

### 3. Nouveaux états + seed top-up (claim « 125 lignes via POST /auth/login réels »)

- `states.json` : 11 états, incl. **`api-key-create-modal` + `login-activity-pagination`** ✓ ; les setups correspondants existent dans `audit.mjs` (clic `getByRole('button',{name:'Create API key'})` → attente `[role="dialog"]` ; clic `button[aria-label="Go to page"]` → attente du form).
- Seed rejoué par moi sur **db vraiment vierge** de l'ib : `register:200` (claim `isClaimed:false` → POST /auth/register), 2 librairies + 9 media READY dont 2 oneshots, puis **top-up `user_login_activity` → 125 lignes via POST /api/v2/auth/login réels** (`[seed] login activity : 124 lignes ajoutées → 125 total`). Idempotent ✓
- L'ellipsis `button[aria-label="Go to page"]` apparaît bien et ouvre le popover nommé (mesure §2 rejouée sur la db fraîche).

### 4. Rejeu complet des scans

| Mesure | Livré | Rejoué par moi |
|---|---|---|
| final-public (:27434) | 0 viol / 0 err / 2 inc | **0 / 0 / 2 — identique** |
| final-auth (:27434) | 0 viol / 0 err / 138 inc | **0 err, 137+1 inc, 0 viol réel** (voir flake §5) |
| install-build-public (:27435) | 0 / 0 / 2 | **0 / 0 / 2 — identique** |
| install-build-auth (:27435) | 0 / 0 / 138 | **0 / 0 / 138 — identique** |
| ensemble de scénarios | 53 | **53, identique** à scope.json livré (comparé nœud pour nœud, origine normalisée) |
| sondes :27434 | 140/140 | **140/140 conformes, 0 non conformes, 0 non retrouvées** |
| sondes :27435 | 140/140 | **140/140 conformes** |
| verify :27434 | 46P/1NA/0F | **46P/1NA/0F** (N-A = badge text-warning non rendu sur settings/jobs — même que livré) |
| verify :27435 | — | **46P/1NA/0F** |
| eval-final :27434 | 38/38 | **38/38, 3 N-A honnêtes** (skip-link absent, vars dark non résolues, motion non simulé) |

### 5. Le flake splash-screen — **reproduit live, trou de déterminisme confirmé**

Mon premier run `final-auth` a mesuré **`/settings/email/new` → 3 violations** (`landmark-one-main`, `page-has-heading-one`, `region` — cibles `html`/`#root`, signature exacte du `div.splash-container` d'`apps/web/src/index.html` scanné avant montage React) et 137 incomplets (l'incomplet réel de la page n'a pas été capturé). **3 re-scans isolés de la même page : 0 viol / 1 inc à chaque fois.** Le run install-build a été clean du premier coup. Le flake est donc **probabiliste**, pas une régression du patch — mais c'est un vrai trou de déterminisme du harnais :

- `audit.mjs` attend `waitUntil:'load'` + `--wait 500` + `settleAnimations` — **aucune garde d'hydratation** ; si le montage React dépasse 500 ms (chunk lazy lourd, box chargée), axe scanne le splash DOM.
- Le fixer l'avait documenté honnêtement (verdict-fixer-v3, install-build.log) — je le confirme par reproduction : le 0-viol livré est un passage clean, pas un fait garanti.
- Correctif suggéré pour le harnais : `waitForSelector('#root :not(.splash-container)')` ou poll `!document.querySelector('.splash-container')` avant `scanPage()`. À porter dans un cycle de durcissement harnais.

### 6. Provenance et warts

- `rehash-provenance.py cycles/stump --strict` exécuté **par moi** : **44/44 empreintes OK, spot-check 3/3, fichier bit-identique** (aucun diff au re-hash → hashes déjà corrects à la livraison).
- Wart package-lock **résolu** : `tools/package-lock.json` figure dans `files{}` uniquement (hash présent), `excluded[]` = `[provenance.json, tools/auth.json, tools/auth-ib.json]` — déduplication vérifiée.
- `states.json.note` documente correctement la dépendance du `statesHash` au port (mes hashes :27434/:27435 diffèrent des :19334/:19335 livrés — attendu, mécanisme re-vérifié dans `audit.mjs` : `statesDigest[name] = {url, setup.toString()}`).

---

## Chasse (résiduels, hors claims)

### F-v3 (nouveau — même famille que F1/F-v2, mécanisme différent) : `trigger={<ToolTip>}` × 3

Scan exhaustif `trigger={` sur `packages/` : tous les autres sites passent un élément natif (`<Button>/<button>/<IconButton>`). Trois sites passent un **wrapper `<ToolTip>`** comme trigger de `Sheet.Trigger asChild`/`Dialog.Trigger asChild` :

- `packages/browser/src/components/table/EntityTableColumnConfiguration.tsx:270` (Sheet « Configure columns »)
- `packages/browser/src/components/filters/URLFilterDrawer.tsx:53` (Sheet « Configure filters »)
- `packages/browser/src/components/navigation/sidebar/Logout.tsx:28` (ConfirmationModal « Sign out », chemin `UserMenu`)

Mécanisme : `SheetPrimitive.Trigger asChild` / `Dialog.Trigger asChild` clone le premier enfant — ici `<ToolTip>` — et lui injecte `onClick`, `aria-haspopup`, `aria-expanded`, `aria-controls` (ref). Or `packages/components/src/tooltip/ToolTip.tsx` déstructure `{children, content, align, side, size, isDisabled}` **sans spreader le reste** vers `ToolTipPrimitive.Trigger` → les props injectées sont avalées. **Prouvé en live** : l'item « Sign out » du menu utilisateur rend `div[role="menuitem"]` **sans `aria-haspopup`** alors que le ConfirmationModal l'a injecté au wrapper.

Impact : fonctionnel (le `<IconButton>` interne porte son propre `onClick`) mais a11y dégradée — le déclencheur de dialogue perd `aria-haspopup="dialog"`/`aria-expanded`/`aria-controls`. **Invisible à axe** (rien d'illégal ne se retrouve dans le DOM — `aria-allowed-attr` ne sonne pas sur un attr recommandé absent). Même famille que F-v2 (asChild→non-élément qui n'injecte pas), jamais détectable par le scope actuel. Correctif : spread `{...rest}` dans ToolTip → `ToolTipPrimitive.Trigger`, ou hisser le trigger hors du tooltip.

### Autres warts résiduels

- Aucun autre `trigger={<div}`/`asChild><div` dans `web/`/`packages/` post-patch (scan AST-lite exhaustif — les vrais positifs des 4 sites fixés sont confirmés corrigés, les faux positifs `ViewManagerDropdown`/`BookSearchOverlay`/`NextInSeries:100` écartés : le `<div>` est *imbriqué dans* le bouton trigger, ou est le contenu du Sheet).
- Le 3e wart potentiel — la non-déterminisme splash — est traité en §5.

---

## Verdict

**CONFIRMED.** Le correctif F-v2 (4 sites trigger→button + `PagePopoverForm` nommé) est vérifié en live dans les deux sens (patché : 0 violation mesurée ; vanilla : bug reproduit). Les 53 scénarios produisent 0 violation réelle / 0 erreur / 138 incomplets (tous sondés conformes ×2 instances), verify 46P/1NA/0F ×2, eval 38/38, provenance 44/44 strict vérifée par moi, install-build rejoué verbatim (build complet dans un clone indépendant, db vierge seedée 125 lignes via vrais POST login). Le flake `/settings/email/new` est un trou de déterminisme du harnais reproduit — documenté honnêtement, non lié au patch ; F-v3 (ToolTip×3) est un résiduel latent à ouvrir en v4. Aucune falsification détectée.

Ports utilisés : `:27434` (principal, binaire `~/work/stump-a3/target/debug/stump_server`), `:27435` (install-build, binaire `~/work/stump-a3-ib/target/debug/stump_server`). Reports rejoués : `~/work/c34v3-audit/reports/` (non commités — répétables par les auditCommands du manifest sur ces ports).
