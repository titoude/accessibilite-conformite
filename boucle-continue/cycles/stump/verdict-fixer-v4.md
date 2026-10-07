# Verdict fixer v4 — cycle 34 stump/stump @42a9918c1542

Réponse à `verdict-auditeur-v3.md` (commit `c4faf89`, verdict CONFIRMED + résiduels F-v3/F-v4).
Toutes les corrections ont été **exécutées et mesurées live** — aucun correctif livré non vérifié.
Clone `~/work/stump-f4` @42a9918c + patch 138f appliqué + fixes ci-dessous, rebuild
`yarn web build` (25 s) + `cargo build -p stump_server` (5m13s) **dans le clone**, instance :30434.

## F-v3 — `trigger={<ToolTip>}` : props de `*.Trigger asChild` avalées

**Mécanisme** : `Sheet.Trigger asChild`/`Dialog.Trigger asChild` clone l'enfant référencé et y
injecte `type`/`aria-haspopup`/`aria-expanded`/`aria-controls` (monté)/`data-state`/`onClick`/`ref`.
Quand l'enfant est le composant maison `<ToolTip>` — qui déstructurait ses props sans les
respreader — toute la chaîne ARIA était avalée : widget fonctionnel, contrat perdu, invisible à axe.

**Chasse exhaustive** (au-delà des 3 sites cités) : `trigger={<X>}` ×33 sites + `*.Trigger asChild`
×21 sites scannés par regex + lecture — seuls les 3 ToolTip wrappaient un composant non-spreadant ;
tous les autres triggers sont `<Button>`/`<button>`/`<IconButton>` qui spreadent déjà.

| Fichier | Site | Fix |
|---|---|---|
| `packages/components/src/tooltip/ToolTip.tsx` | `ToolTipPrimitive.Trigger` | `...rest` déstructuré et respread sur le Trigger (`{...rest}` placé AVANT `asChild`/`ref`/`disabled` pour que les props maison gagnent) ; `ToolTipProps` étendu à `Omit<ComponentPropsWithoutRef<Trigger>, 'asChild'\|'children'\|'disabled'\|'content'\|'size'\|'align'\|'side'>`. Corrige les 3 sites d'un coup. |
| `packages/browser/src/components/filters/URLFilterDrawer.tsx` | enfant du ToolTip = `<span class="relative inline-flex">` autour de l'`<IconButton>` | Restructuré : le badge `activeFilters` devient enfant de l'`<IconButton class="relative">` — l'enfant unique du tooltip est le bouton natif (le `<span>` aurait avalé la chaîne même après le fix ToolTip : Radix n'injecte les aria que sur l'élément cloné, pas ses descendants). |
| `packages/browser/src/components/UserMenu.tsx` | « Sign out » `Dropdown.Item` → `ConfirmationModal` contrôlé sans `trigger` prop | `aria-haspopup="dialog"` posé sur le `Dropdown.Item` — `DropdownItem` forwardRef spreade déjà `{...props}`. **Site réel de la preuve live de l'auditeur** (« Sign out » = div[role=menuitem] sans aria-haspopup) ; le site déclaré `Logout.tsx:28` est dead code (aucun importeur — vérifié), corrigé quand même via le fix ToolTip (son enfant est déjà `<IconButton>`). |
| `EntityTableColumnConfiguration.tsx` | trigger Sheet | Corrigé par le fix ToolTip seul (enfant déjà `<IconButton>`) — aucune ligne modifiée. |

**Vérif live :30434** — DOM rendu mesuré (pas axe) :
- `button[aria-label="Configure filters"]` **fermé** : `type=button`, `aria-haspopup="dialog"`,
  `aria-expanded="false"`, `data-state="closed"` ; **ouvert** : `aria-expanded="true"`,
  `aria-controls="radix-_r_13_"` et `getElementById` le résout (Sheet montée).
- `button[aria-label="Configure columns"]` (layout table — le bouton n'existe que là) :
  `type=button`, `aria-haspopup="dialog"`, `aria-expanded="false"`, `data-state="closed"`.
- « Sign out » `div[role=menuitem]` : `aria-haspopup="dialog"` présent (avant : absent).
- Détail Radix : `aria-controls` n'est émis que vers un contenu monté
  (`context.open ? contentId : undefined` dans `@radix-ui/react-dialog`) — verify.mjs §14 mesure
  donc fermé ET ouvert, pas une simple présence d'attributs.

## F-v4 — garde d'hydratation (harnais, `tools/audit.mjs` v7)

`waitHydrated()` appelée dans `applyPreconditions()` — donc sur CHAQUE scénario : urls ET états
(la re-navigation `about:blank`→url post-setup réaffiche le splash ; la garde s'y rejoue).
Marqueur : `.splash-container` absent **ET** `#root` peuplé. Timeout 15 s.

**Retry durci** après interception réelle d'un stall en run complet : pré-setup / page simple →
`page.reload()` une fois (aucun état interactif à perdre, cache chaud) ; post-setup → **replay
du setup complet** une fois (le reload détruirait la modale ouverte — le setup re-navigue de
toute façon) ; stall survivant → `error` honnête, jamais de scan sur DOM splash.

**Preuve de déterminisme** : 3 runs consécutifs `/settings/email/new` → `pages` byte-identiques
(sha256 `7df2eb32fe7d0e88`) : **0 violation + 1 incomplete** (`color-contrast` serious sur
`select[aria-label="SMTP provider preset"]`, bgImage indéterminable — needs-review réel, pas le
flake splash des 3 pseudo-violations landmark/h1/region de l'auditeur).

## Chiffres rejoués (tous exécutés cette session, :30434)

| Rejeu | Résultat |
|---|---|
| final-v4-public (/auth + login-failed) | **0 règle / 0 occ / 0 err / 2 inc** |
| final-v4-auth (42 urls + 11 states = 53 scans) | **0 / 0 / 0 / 138 inc** — identique à v3 |
| verify.mjs (54 assertions dont 7 nouvelles §14 F-v3) | **53 PASS / 1 N-A / 0 FAIL** |
| incomplete-probes.mjs (--reports final-v4-*) | **140 sondes : 140 conformes / 0 NC / 0 absentes** |
| eval-final.mjs | **38/38 (0 FAIL, 3 N-A)** |
| `/settings/email/new` ×3 (garde hydratation) | pages-hash identique ×3 : 0 viol + 1 inc |
| patch.diff | 138 fichiers (2925→2987 lignes : +ToolTip/URLFilterDrawer/UserMenu) — `git apply --check` OK sur clone vierge @42a9918c |

## Incidents en route (honnêteté)

- **Stall d'hydratation réel intercepté** : premier run `final-v4-auth`, `/settings/email/new`
  → splash non remplacé après 15 s → scénario en ERREUR au lieu de 3 fausses violations.
  C'est exactement le trou de déterminisme du ré-audit v3 — la garde fait son travail.
  Re-run isolé : passe en 1,5 s. La garde a été durcie (retry ci-dessus) puis le run complet
  rejoué → 53/53 audités, 0 erreur.
- `verify.mjs` §14 : « Configure columns » n'existe qu'en layout table ; le toggle est cliqué
  seulement s'il est actif (§6 l'a peut-être déjà basculé — le layout persiste dans le store).
