# Verdict auditeur v4 — cycle stump (stumpapp/stump @42a9918c1542, v0.1.10)

**Statut : CONFIRMED** — toutes les claims du fixer v4 (commit `3edfe36`) rejouées par moi, de bout en bout, sur une infra 100% indépendante : mes propres clones vierges @SHA, le patch appliqué par moi, mes builds (yarn + vite + cargo), mes db (sqlite fraîches, seed rejoué ×2), mes ports (`:24434` instance principale, `:24435` install-build, `:24436` proxy adversarial) — jamais :30434 ni aucun port des auditeurs précédents. Zéro confiance aux artefacts livrés : chaque chiffre a été recalculé ou re-mesuré par mes scripts (`~/work/c34v4/`).

Rappel protocole : le verdict porte sur la reproductibilité axe et la santé du patch sur le périmètre déclaré, pas sur la conformité WCAG du produit.

---

## Ce que j'ai rejoué et vérifié

### 0. Espace de travail indépendant

- `~/work/stump-a4` — clone vierge `@42a9918c` + `git apply patch.diff` : **0 rejet, 138 fichiers, +565/−315** (sha256 `fba5623290388426921c295e2e3d393109c7d940719f0167fde886b8d35809f9` — le `patch.diff` livré à `3edfe36`, calculé par moi).
- `~/work/stump-a4-ib` — second clone + même patch → **install-build vraiment indépendant** (`git apply --check` 0 rejet ; `yarn install` 71 s, `yarn web build` 17.4 s/18.1 s, `cargo build -p stump_server` 3m37s/3m43s exécutés *dans* chaque clone). `strings` du binaire ib prouvé : il sert `~/work/stump-a4-ib/apps/web/dist` (mécanisme `debug_setup()` compile-time).
- `~/work/stump-a4-vanilla` — clone sans patch, dist vanilla construite par moi (17.45 s) puis **swappée sur :24434** (dist servie du disque, pas de restart) pour le contrôle négatif F-v3. Restaurée après.
- Sessions créées par moi (`admin`/`adminpass123`, `auth-24434.json` / `auth-24435.json`), db `core/dev.db` de chaque clone — UUIDs épinglés réécrits par moi via sqlite (13 refs main / 11+2 refs ib, `PRAGMA foreign_key_check` propre). Serveur enregistré (`POST /api/v2/auth/register` → 200) puis `seed.mjs` rejoué : 2 librairies, 5 series, 9 media READY, top-up `user_login_activity` → 125 lignes via vrais POST `/auth/login`.

### 1. F-v3 — `trigger={<ToolTip>}` × 3 : props `*.Trigger asChild` avalées

**Sources patchées relues** (pas juste grep) :

- `packages/components/src/tooltip/ToolTip.tsx` — `({children, content, align, side, size, isDisabled, ...rest}, ref)` → `<ToolTipPrimitive.Trigger {...rest} asChild disabled={isDisabled} ref={ref}>` ; `ToolTipProps = Omit<ComponentPropsWithoutRef<Trigger>, 'asChild'|'children'|'disabled'|'content'|'size'|'align'|'side'>`. `{...rest}` placé AVANT `asChild`/`ref`/`disabled` — les props injectées par le parent (Sheet/Dialog/Trigger) survivent ✓
- `packages/browser/src/components/filters/URLFilterDrawer.tsx` — le `<span class="relative inline-flex">` intermédiaire (2e point d'avalage) supprimé : le badge `activeFilters` est devenu enfant de l'`<IconButton class="relative" aria-label="Configure filters">` ✓
- `packages/browser/src/components/UserMenu.tsx` — « Sign out » `Dropdown.Item` porte `aria-haspopup="dialog"` directement (ConfirmationModal contrôlé, pas de `trigger` prop) ; le trigger a aussi basculé `<div>` → `<button type="button">` (correctif sémantique constaté par le contrôle négatif ci-dessous) ✓
- `packages/browser/src/components/navigation/sidebar/Logout.tsx` — **dead code confirmé** : 0 importeur dans le repo (le vrai site live était bien `UserMenu`, corrigé là) ; le fix ToolTip le couvre quand même ✓
- `EntityTableColumnConfiguration.tsx` — corrigé par le fix ToolTip seul (enfant déjà `<IconButton>`), aucune ligne touchée — cohérent avec la table du fixer ✓

**Mesure live patché (:24434), mon script (`/tmp/measure-f3.mjs`)** :

| Site | Fermé | Ouvert |
|---|---|---|
| `Configure filters` | `BUTTON type=button aria-haspopup=dialog aria-expanded=false data-state=closed` | `aria-expanded=true`, `aria-controls=radix-_r_13_` → `getElementById` résout vers `role=dialog` (Sheet montée) |
| `Configure columns` (layout table) | idem pattern | `aria-controls=radix-_r_2n_` résolu ✓ |
| `Sign out` | `DIV role=menuitem` **`aria-haspopup=dialog`** | ouvre un vrai `role=dialog` avec `aria-labelledby` |

Détail Radix confirmé : `aria-controls` n'est émis que lorsque `context.open` — les assertions mesurent donc fermé ET ouvert, pas une simple présence d'attributs.

**Contrôle négatif vanilla** (dist swappée sur :24434, mon script) :

| Site | Vanilla @42a9918c (non patché) |
|---|---|
| `Configure filters` | `<IconButton>` **aucun `aria-*`** — le `<span>` wrapper n'a reçu que `data-state=closed` (double avalage : Sheet→ToolTip sans spread, ToolTip→span) |
| Trigger UserMenu | `DIV type=button` (non focalisable clavier, sémantique cassée) — le patch l'a remplacé par `<button>` |
| `Sign out` | `DIV role=menuitem` **sans `aria-haspopup`** |

Le contraste est total : ma mesure détecte le bug en vanilla ET sa disparition en patché. **F-v3 CONFIRMED, dans les deux sens.**

### 2. F-v4 — garde `waitHydrated()` dans `audit.mjs` v7

**Mécanisme relu dans le code** (`runnerVersion='audit.mjs v7'`, ~l.490-535) :

- Critère : `!document.querySelector('.splash-container')` **ET** `#root.childElementCount > 0` — poll 100 ms, timeout 15 s.
- Appelée dans `applyPreconditions()` → **couvre urls ET états** ; post-setup la re-navigation `about:blank`→url réaffiche le splash, `applyPreconditions({hydrationRetry:false})` re-vérifie, et sur stall l'état rejoue **l'intégralité de son `extraSetup`** (le `reload` nu détruirait la modale montée).
- Stall survivant → erreur honnête « écran de chargement non remplacé », **jamais** de scan sur DOM splash.

**Déterminisme rejoué** : `/settings/email/new` ×3 consécutifs → `pages` byte-identiques ×3 (mon sha256 `JSON.stringify(pages)` = `895c44dd…`, stable inter-runs) : **0 violation + 1 incomplete réel** (`color-contrast` serious sur `select[aria-label="SMTP provider preset"]` — needs-review authentique, pas le flake). Le hash livré `7df2eb32` correspond à la sérialisation propre du fixer ; la substance (déterminisme) est confirmée par ma propre sérialisation.

**Épreuve adversariale par proxy (`/tmp/stall-proxy.mjs` sur :24436, bloque `/assets/index-*.js`)** :

| Mode | Résultat |
|---|---|
| `STALL_MODE=once` (bundle tué 1×) | garde détecte → retry `page.reload()` → **scan aboutit : 0 viol / 1 inc** |
| `STALL_MODE=always` (bundle tué ×2) | **scénario en ERREUR** (« splash-container persiste ou #root vide — scan refusé »), code retour 2, aucune violation enregistrée |

L'honnêteté de la garde est éprouvée : elle récupère un stall transitoire ET refuse de scanner un stall persistant — exactement le trou de déterminisme du ré-audit v3.

**F-v4 CONFIRMED.**

### 3. Rejeu complet des scans

| Mesure | Livré | Rejoué par moi |
|---|---|---|
| final-v4-public (:24434) | 0 viol / 0 err / 2 inc | **0 / 0 / 2 — identique** |
| final-v4-auth (:24434) | 53 scans (42 urls + 11 states), 0/0/138 inc | **53 scans, 0 viol / 0 err / 138 inc nœuds — distribution par règle identique** (color-contrast 116 + aria-valid-attr-value 11 + aria-hidden-focus 11) |
| install-build-public (:24435) | 0 / 0 / 2 | **0 / 0 / 2 — identique** |
| install-build-auth (:24435) | 0 / 0 / 138 | **0 / 0 / 138 — identique** (même distribution) |
| ensemble scénarios | 53 | 53, scope identique à `scope.json` livré (comparé origine-normalisé) |
| sondes :24434 | 140/140 | **140/140 conformes, 0 NC, 0 non retrouvées** (`probes-a4.json`) |
| sondes :24435 | 140/140 | **140/140 conformes** (`probes-a4-ib.json`) |
| verify.mjs :24434 | 54 assertions → 53P/1NA/0F | **53 PASS / 1 N-A / 0 FAIL** (N-A = badge `text-warning` non rendu sur settings/jobs — identique à livré) |
| verify.mjs :24435 | — | **53 PASS / 1 N-A / 0 FAIL** |
| eval-final :24434 | 38/38 | **38/38 (0 FAIL, 3 N-A honnêtes : skip-link absent, vars dark non résolues, motion non simulé)** |
| runnerVersion | audit.mjs v7 | **v7 dans mes 4 reports** ; axe-core **4.10.2** des deux côtés (`tools/package.json` épinglé) |

### 4. Provenance — vérifiée par moi, puis un wart corrigé par moi

- `rehash-provenance.py cycles/stump --strict` exécuté **par moi** sur l'arbre livré : **53/53 empreintes, spot-check 3/3, exit 0, aucun diff** au re-hash → toutes les empreintes livrées étaient déjà correctes.
- **Wart trouvé et corrigé** : le sidecar `patch.diff.sha256` contenait `34124c25…` — le hash du patch **v3** — alors que le `patch.diff` actuel hache `fba56232…`. `git diff c4faf89 3edfe36` prouve que le sidecar n'a **jamais été régénéré** en v4 (le patch a grandi 2925→2987 lignes sans re-hash du sidecar). `provenance.json` lui-même hashait correctement le fichier réel — wart documentaire, pas falsification. Corrigé par moi (sidecar = `fba56232…`), re-hash `--strict` rejoué → 53/53 OK, puis mon propre verdict ajouté à `files{}` avant commit. **Récidive du wart « empreinte de fichier auxiliaire » déjà observé** (leçon pma v4).

### 5. Chasse résiduelle

- **Autres ToolTip-like (composants destructurant sans spreader dans web/ + packages/)** : scan exhaustif des composants wrappés en `trigger={` / `*.Trigger asChild` (33 + 21 sites) — `Button`, `IconButton`, `ControlButton` (×2), `TopBarLinkListItem`, `EmojiPicker` spreadent tous `{...props}`/`{...rest}` ou rendent un natif spreadant. **Aucun autre avalage** — le fix ToolTip a couvert la famille entière.
- **Couverture de la garde sur les états** : vérifiée par lecture du code — post-setup, `applyPreconditions` re-vérifie l'hydratation après la navigation `about:blank`→url du setup, et le retry rejoue le setup complet (pas un reload destructeur). Les états post-navigation sont couverts.
- **Warts restants** : aucun autre hors le sidecar corrigé (§4). La sérialisation du « pages-hash » (`7df2eb32`) n'est pas documentée dans le verdict fixer — substance confirmée, mais un schéma de sérialisation explicite rendrait les claims de déterminisme directement rejouables octet par octet.

---

## Verdict

**CONFIRMED.** F-v3 (chaîne ARIA avalée par `ToolTip` + span intermédiaire + `Sign out` sans `aria-haspopup`) corrigé et prouvé live dans les deux sens (patché : contrat complet résolu y compris `aria-controls` vers le contenu monté ; vanilla : bug reproduit tel quel). F-v4 (garde d'hydratation) éprouvée adversarialement : récupère un stall transitoire, échoue honnêtement sur stall persistant, `/settings/email/new` déterministe ×3. Chiffres rejoués : 53+2 scénarios 0 viol/0 err/138 inc ×2 instances, sondes 140/140 ×2, verify 53P/1NA/0F ×2, eval 38/38, provenance 53/53 strict (dont 1 sidecar périmé corrigé par moi), install-build verbatim dans clone indépendant. Aucune falsification détectée.

Ports utilisés : `:24434` (principal, `~/work/stump-a4/target/debug/stump_server`), `:24435` (install-build, `~/work/stump-a4-ib/target/debug/stump_server`), `:24436` (proxy adversarial `/tmp/stall-proxy.mjs`). Reports rejoués : `~/work/c34v4/cycle/reports/` (non commités — répétables par les `auditCommands` du manifest sur ces ports).
