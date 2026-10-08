# Cycle 54 — verdict AUDITEUR INDÉPENDANT : **CONFIRMED**

Auditeur : session `aff8735a` — rejoue **zero-trust** la livraison v2 (`33d0ec0`)
du cycle 54 — twentyhq/twenty @`a9df5c3aad6c4cd4060b0f8bdc1a5f369acaf7b7`
(React 18 + NestJS + GraphQL + Linaria + Lingui + Nx / yarn 4.13).
Instance principale auditeur : `:9560` (PG `:9563`, Redis `:9564`) ;
install-build auditeur : `:9570` (PG `:9573`, Redis `:9574`) — **deuxième clone
propre**, fetch `--depth 1` du SHA pinné + `git apply` v2.

## Reproduction — toutes les claims éprouvées par re-exécution

| claim worker | auditeur :9560 | install-build :9570 | verdict |
|---|---|---|---|
| patch.diff sha256 `4b1762d7…dd54ea` | == sidecar | == sidecar | OK |
| `git apply --check` sur clone propre @SHA | 0 rejet (40 fichiers) | 0 rejet | OK |
| final-auth : 15/15 scénarios, 0r/0occ/0err, 463 inc | **identique** : 15/15, 0/0/0, **463** inc | **identique** : 15/15, 0/0/0, **463** inc | OK |
| final-public `/welcome` : 0/0/0 | 0/0/0 | 0/0/0 | OK |
| verify.mjs : 15P/0F/1N-A | 15P/0F/1N-A (« dark: aucun élément texte mesurable ») | — | OK |
| eval-final.mjs : 9P/0F/1N-A | 9P/0F/1N-A (« command menu non détecté ») | — | OK |
| sabotage.mjs : 6/6 | 6/6 DETECTED | — | OK |
| sondes incomplets : 456 N-A + 7 PASS / 0 FAIL | 456 N-A + 7 PASS / 0 FAIL | — | OK |
| provenance : 84 empreintes strict | 84/84 re-hashés OK pré-verdict (voir « verrues ») | — | OK |
| manifest/results.json sans auto-verdict | valeurs cohérentes avec ma propre mesure | — | OK |

Le compte **463 incomplets identique** sur trois instances indépendantes
(worker :9540, auditeur :9560, IB :9570) — déterminisme fort du périmètre.

## Épreuves manuelles (au-delà du rejouage)

- **Patch lu intégralement** (40 fichiers, 1002 lignes). Corrections = vraies
  sources : landmarks sémantiques (`styled.main/h1/header/nav`), dropdown
  `role=dialog` + `cloneElement` (role/tabIndex/onKeyDown), footer agrégat
  `aria-labelledby→{dropdownId}-value` + repli `aria-label`, colonne dnd 12→24px,
  tokens `color(display-p3 …)` dans `theme-light.css`/`theme-dark.css` +
  `Theme*.ts`, checkbox/EmailField/Logo nommés via Lingui `t\`…\``.
- **Aucun masquage** : pas de `aria-label` décorrélé du visible, pas de
  `display:none`/`clip` sur des violations, pas de rôle jeté sur un élément
  inerte pour satisfaire une règle. Les noms accessibles contiennent le texte
  visible (2.5.3) : trigger agrégat nommé par le contenu réel de la cellule
  (`aria-labelledby` → `<uuid>-footer-value`), avatar « A » ⊂
  `aria-label="A11y C54 Person"`.
- **Clavier réel prouvé** : `div[role=button]` injecté par `cloneElement` —
  Enter ouvre (`aria-expanded→true`), Escape ferme, Space ré-ouvre ; `tabindex=0`.
  Pas de perte d'opérabilité clavier (2.1.1).
- **nested-interactive** : `neutralizeDragActivatorSemantics` retire les attrs
  d'activation sur les surfaces contenant un descendant interactif (wrappers
  pointer-only), `observeDragActivatorAccessibleName` ré-écrit le nom depuis le
  texte visible (TreeWalker, `aria-hidden` exclus) à chaque mutation dnd-kit.
  Les poignées dédiées restent `role=button` `aria-label="Drag to reorder row"`.
- **target-size réel** : mesuré 24×32 (poignée ligne), 64×24 (« Options »),
  174×24 (« All Companies · 600 ») — dimensions réelles, pas de hack CSS.
- **Contraste pixel-true** (canvas srgb, alpha composite, leçon 31) sur les
  incomplets : « General » 5.45:1, « Security/Invite/Roles » 5.74:1,
  « Team » 12.63:1 ; `/objects/people` : 0 texte < 4.5:1 mesuré.
- **Leçon 47 (stateProof sur vanilla)** : tous les sélecteurs de preuve sont
  upstream — `data-floating-ui-viewport`, `side-panel-focus`,
  `persistedColorSchemeState`, tab labels, libellés de stage kanban (données
  seed). Aucun ne dépend du patch.
- **Spot-check incomplets** : 38 nœuds mesurés à la main + les 463 par les
  sondes. Distribution : `aria-allowed-attr` 420 (poignées `aria-roledescription
  =draggable` sur role=button — needs-review axe, attribut permis), `aria-valid-
  attr-value` 23 (triggers `aria-haspopup=true` valeur 1.1 héritée), color-
  contrast 14 (display-p3 non mesurable par axe ; ma mesure ≥4.5:1), lcnm 4,
  aria-toggle-field-name 2 — tous needs-review honnêtes, 0 FAIL en mesure.
- **Sondes saines** : mesure réelle (luminance + composite), pas de trust-me.

## Verrues documentées (non bloquantes — les claims tiennent)

- **W1 — race `dist/front` dans boot.sh verbatim** : le `cp` du front vers
  `packages/twenty-server/dist/front` (étape 3) précède `nx run …:migrate` /
  `command-no-deps` (étape 4) qui ré-émet `dist/` et **efface `dist/front`** →
  `/welcome` 404 à la fin du boot. Reproduit à l'identique sur mes **deux**
  boots verbatim (clone principal et IB) — déterministe sur clone frais.
  Contournement appliqué (re-`cp` + restart serveur), conforme à la leçon du
  worker (« rsync après chaque build ») ; après ce fix l'audit rejoue 0/0/0.
  À consolider : déplacer le `cp` **après** les étapes nx dans `boot.sh`.
- **W2 — divergence tokens TS↔CSS** : `ThemeLight.ts` extraLight `0.55` vs
  `theme-light.css` `0.45` (et dark 0.68/0.55/0.4 vs 0.7/0.7/0.72). La source
  rendue est la CSS var → conformité préservée et mesurée ; mais tout
  consommateur du theme JS verrait une autre valeur. Divergence cosmétique.
- **W3 — fichiers régénérés au replay** : `seed-info.json` et
  `reports/probes/incomplete.json` changent dès qu'un auditeur rejoue (ids
  dynamiques, leçon 44 — voulu). `auth.json`/`auth-ib.json` (tokens locaux)
  sont gitignorés et exclus de la provenance (supprimés avant re-hash).

## Chaîne de preuve auditeur

```
clone :9560 a9df5c3 + apply --check OK → boot → seed+login → rescan
  audit-auth-auditeur  : 15/15, 0r/0occ/0err, 463 inc
  audit-public-auditeur: 0/0/0
  verify 15P/0F/1N-A · eval 9P/0F/1N-A · sabotage 6/6 · sondes 456NA+7P/0F
clone :9570 (IB) a9df5c3 + apply --check OK → yarn --immutable → nx builds →
  seed+login → rescan ib-auth-auditeur 15/15 0/0/0 463 inc · ib-public 0/0/0
```

**CONFIRMED** — la livraison v2 est reproductible de bout en bout, le patch est
sain (corrections aux vraies sources, sans masquage ni régression clavier), les
chiffres worker se reproduisent à l'identique sur deux instances indépendantes,
et les 463 incomplets sont des needs-review axe honnêtes (mesures réelles ≥4.5:1,
noms conformes 2.5.3, cibles ≥24px).
