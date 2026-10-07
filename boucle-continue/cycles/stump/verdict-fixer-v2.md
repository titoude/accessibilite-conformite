# Verdict fixer v2 — cycle 34 stump/stump @42a9918c1542

Réponse à `verdict-auditeur.md` (commit `616e682`, verdict CONFIRMED + findings F1 + warts W2–W6).
Toutes les corrections ont été **exécutées et rejouées** — aucun correctif livré non vérifié.

## F1 — routes settings hors-scope + `aria-allowed-attr` résiduels

**Constat** : `/libraries/<id>/settings/delete` (et les autres onglets settings) n'étaient pas auditées ;
`ConfirmationModal`/`DeleteLibraryConfirmation` recevaient `trigger={<div><Button/></div>}` → Radix
`Dialog.Trigger asChild` injectait `aria-haspopup/expanded/controls/…` sur un `<div>` non interactif →
2× `aria-allowed-attr` résiduels.

**Correctif (patch.diff v2, 136 fichiers)** : les 4 sites `trigger={<div>}` passent le `<Button>`
directement comme trigger — `DeleteLibrary.tsx`, `CleanLibrary.tsx` (settings/delete),
`DangerSettingsScene.tsx` (smart-list), `DeleteBookClubSection.tsx` (bookClub, préventif hors-scope).
Le div wrapper non interactif disparaît ; Radix injecte sur l'élément interactif réel.

**Scope** : `tools/urls-auth.txt` 36 → **42 urls** : + `settings/{reading,thumbnails,analysis,metadata,delete}`,
+ `/libraries/<id>/oneshots` (seed enrichi : `_oneshots/` + `oneshotsDirectory`),
+ `/server-connection-error` (vraie route `ServerConnectionErrorScene`).

**Rejeu** : baseline de ces 7 routes sur dist **vanilla** @42a9918 (swap dist sur :11334) :
**163 occurrences / 12 règles** — dont 8× `aria-allowed-attr`, 1× `aria-valid-attr-value` (ComboBox, W6),
`landmark-one-main`+`region` (error scene). Post-patch : **0 violation** (`reports/final-auth`,
`baseline-newscope`).

## W2 — seed.mjs cassé sur serveur vierge

`GET /api/v2/claim` retourne `{"isClaimed":false}` (camelCase), le seed testait `is_claimed === false`
→ `register` jamais appelé. Corrigé : accepte les deux formes. **Exécuté sur 2 bases vraiment vierges**
(:11334 core/dev.db fraîche, :11335 clone ib) : `POST /api/v2/auth/register` → 200, création libs,
9 media READY dont 2 oneshots, **exit 0** les deux fois.

## W3 — install-build servait la mauvaise dist (mécanisme faux)

Le v1 relançait le binaire du clone principal avec CWD=clone-ib en croyant que `client_dir` du
Stump.toml décidait de la dist servie. Réalité (mesurée) : `debug_setup()` dans
`apps/server/src/main.rs` fait `set_var("STUMP_CLIENT_DIR", env!("CARGO_MANIFEST_DIR")+"/../web/dist")`
sous `debug_assertions` → **le chemin est gravé dans le binaire à la compilation** et prime sur le
toml et l'env shell. Preuve `strings` : chaque binaire embarque le chemin dist de SON clone.

**Refait proprement** : `cargo build -p stump_server` **dans** `~/work/stump-ib` (~3m36s, toolchain
rust 1.97.1 + shims pkgconf/cmake) → :11335 sert `~/work/stump-ib/apps/web/dist` (sa propre dist,
construite par `yarn web build` dans le clone). `install-build.log` réécrit, `manifest.json`
corrige `boot.client_dir_real`.

## W4 — verify.mjs db-dépendant

La boucle badges comptait les éléments `text-destructive|success|warning` rendus → nombre
d'assertions variable selon la db. Remplacé par **exactement 3 assertions déterministes** (une par
famille, pire ratio mesuré ≥4.5 vs fond résolu, `N-A` si la famille n'est pas rendue).
Rejeu :11334 et :11335 : **41 assertions → 40 PASS / 1 N-A / 0 FAIL** (N-A = `text-warning`
absent des deux seeds — verdict honnête, pas silencieux).

## W5 — sonde h1 « non rendu » fausse

Le h1 utilise `bg-linear-to-r … bg-clip-text text-transparent` (gradient-clip) : le texte **est**
rendu, axe ne peut juste pas mesurer son fond. La sonde notait « non rendu ». Corrigé : branche
`bgClip==='text'` → parse les stops du dégradé (attention : code injecté dans template literal —
**backslashes doublés**, pas de backticks) → pire ratio stop-vs-fond vs seuil 3:1 (large-text).
Mesuré **3.01:1 ≥ 3:1** → conforme. probes :11334 132/132, :11335 133/133.

## W6 — `aria-controls` mort sur ComboBox fermé

`Popover.Trigger` (Radix Popover) émettait `aria-controls` vers un contenu lazy non monté →
`aria-valid-attr-value`. Fix : `useId()` → `aria-controls={open ? listboxId : undefined}` sur le
Trigger + `id={listboxId}` sur `Popover.Content` (Radix 1.1.1 spread les props après les défauts →
surchargeable des deux côtés). Baseline-newscope portait 1× `aria-valid-attr-value` de cette cause →
final 0.

## Chiffres rejoués (tous exécutés cette session)

| Rejeu | Résultat |
|---|---|
| baseline-newscope (:11334, dist vanilla, 7 routes) | 163 occ / 12 règles / 0 err / 8 inc |
| final-public (:11334) | 0 règle / 0 occ / 0 err / 2 inc |
| final-auth (:11334, 42 urls + 9 states = 51 scans) | 0 / 0 / 0 / 130 inc |
| incomplete-probes (:11334) | 132 sondes → 132 conformes, 0 NC, 0 NR |
| verify.mjs (:11334 / :11335) | 41 assertions → 40 PASS / 1 N-A / 0 FAIL |
| eval-final.mjs (:11334) | 38/38 (3 N-A) |
| install-build :11335 (public + auth 51 scans) | 0 / 0 / 0 / 2+131 inc |
| incomplete-probes-ib (:11335, rapports ib) | 133 sondes → 133 conformes |
| seed.mjs vierge (:11334 + :11335) | register 200, exit 0 ×2 |
| patch.diff | 136 fichiers, `git apply --check` sur clone propre : 0 rejet |

**Totals cycle** : baseline élargi **1126 occurrences / 20 règles / 53 surfaces** → final **0**.

## Limites résiduelles (honnêtes)

- `/settings/users/<id>/manage` (redirect si id non résolvable) et `/settings/email/<id>/edit`
  (entité email non seedable via API) restent hors scope — **divulgués** dans `manifest.excluded`.
- `statesHash`/`scopeHash` auth diffèrent v1↔v2 : le scope a été **étendu** (trahison assumée et
  documentée dans `scope-compare.json`, pas masquée).
- Les 2 instances tournent en debug (`debug_assertions`) — le mécanisme compile-time décrit ici
  vaut pour les binaires debug ; un `--release` n'injecterait pas `STUMP_CLIENT_DIR` (chemin toml
  classique), hors périmètre de ce cycle.
- Incomplets : 130–133 éléments `incomplete` restants = contrastes indécidables axe (images de
  couverture, scrims) — tous sondés conformes, 0 non conforme.
