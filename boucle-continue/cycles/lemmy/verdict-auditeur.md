# Verdict auditeur — cycle 55 LemmyNet/lemmy-ui @18ec4ba2 (0.19.20)

**Verdict : CONFIRMED** — toutes les métriques à chaud du worker sont
reproduites sur instances, données et checkouts indépendants : patch sain
(sha256 `f6ba82fa…` conforme, `git apply --check` **0 rejet** sur les DEUX
checkouts, 38 fichiers +305/−176 recomptés), baseline public **bit-à-bit**
(257 occ / 11 règles / 120 inc), baseline auth identique en règles (16/16)
avec **Δ-1 occ** intégralement localisé sur un bouton toolbar d'un état
(détail ci-dessous), rescan patché + install-build verbatim **0 violation
/ 0 erreur** (39 scénarios, 20+31 inc), verify **32/32 ×2 instances**,
eval **17/17**, sabotage **FAIL nommé exact** puis restore 32/32, vanilla
**21 FAIL nommés + eval 4 FAIL** attendus, sondes incomplets **51/51 OK /
0 NON-CONFORME / 0 N-A** relues sur les rapports regénérés par l'auditeur,
provenance **44/44** sha256 conformes, i18n `i18n.t()` : les 9 clés du
patch résolvent en textes anglais réels dans lemmy-translations @64fe2ac.
Ceci mesure la reproductibilité du score axe et la santé du patch, pas la
conformité WCAG complète.

Auditeur : session indépendante
(devin-ac251a53a655489cb724490f587ad238), clone upstream frais
`git clone + checkout @18ec4ba2d1e2b1515f47eb7a63a8d7975a48ec59` +
submodule lemmy-translations @64fe2ac, trois instances docker propres :

- `:9655` patché (`~/work/c55/lemmy-ui`, suffixe `""`, containers lm55-*)
- `:9675` vanilla (`~/work/c55/lemmy-ui-v`, worktree @SHA pur, suffixe `-v`)
- `:9665` install-build verbatim (`~/work/c55/lemmy-ui-i`, clone vierge
  complet @SHA, suffixe `-i`)

Chaque instance : postgres16 + pictrs + dessalines/lemmy:0.19.20 +
lemmy-ui node:20-slim bind-mounté + nginx (tools/boot.sh verbatim, ports
965x/966x/967x), seed frais par `tools/seed.mjs` via API Lemmy (admin
`lemmy`, bench_user1/2, community a11ybench, 3 posts, 5 commentaires, 1 mp),
`gen-urls.mjs` + `login.mjs` par instance (auth.json non portable entre
DB — piège documenté par le worker, confirmé). Copie de tools/ par
instance (`tools-p`/`tools-v`/`tools-i`), node_modules `npm ci` réel dans
tools-p + liens symboliques dans les deux autres ; axe-core 4.14.0 +
playwright 1.63. Aucun artefact d'exécution du worker réutilisé.

## Pureté des instances (leçon 40)

Avant tout scan, marqueurs distinctifs du patch mesurés dans les bundles
servis : `role:"img"` ×5/fichier + teinte `#a83d0e` présents dans
`dist/js/{server,client}.js` du checkout patché et du build -i ;
**0 occurrence** des deux marqueurs dans le dist vanilla. Vanilla est bien
vanilla ; le patch est bien le patch.

## Résultats du rejeu

| Étape | Livré | Rejoué | Verdict |
|---|---|---|---|
| patch.diff sha256 | `f6ba82fa…423ac76` | identique | OK |
| `git apply --check` | 0 rejet | **0 rejet** :9655 ET :9665 | OK |
| Fichiers du patch | 38 f, +305/−176 | identique | OK |
| Baseline public vanilla | 257 occ / 11 règles / 120 inc | **257 / 11 / 120** — bit-à-bit | OK |
| Baseline auth vanilla | 453 occ / 16 règles / 227 inc | **452 / 16 / 227** — Δ-1 localisé (ci-dessous) | OK (écart expliqué) |
| Union baseline | 710 occ / 17 règles | **709 occ / 17 règles** (11 public + 16 auth, overlap color-contrast…) | OK |
| Rescan patché :9655 | 0/0 + 20+31 inc | **0 viol / 0 err / 20+31 inc**, 17+22 scénarios | OK |
| Install-build :9665 | 0/0 + verify 32/32 | **0 viol / 0 err / 20+31 inc** + verify **32/32** (verbatim : clone @SHA → apply --check → `pnpm install --frozen-lockfile` → `pnpm run build:prod` → seed → rescan) | OK |
| Skips silencieux (leçon 45) | 0 | **39/39 scénarios audités, 0 erreur** ×3 instances | OK |
| verify.mjs patché | 32/32 | **32/32** (1 N-A `contrast code` — élément `<code>` absent, même N-A livré) | OK |
| eval-final patché | 17/17 | **17/17** (1 N-A régions live absentes du produit) | OK |
| Sondes incomplets | 51/51 OK | **51 OK / 0 NC / 0 N-A** — `--reports` pointé sur MES rapports regénérés | OK |
| Sabotage | FAIL nommé | revert `role:"img"` ×4 spans vote-display (server.js+client.js servis, badge intact) → restart (leçon 41) → **FAIL « vote-display: spans statistiques avec role »** 31/32 → restore → 32/32 | OK |
| Vanilla verify | 21 FAIL | **21 FAIL nommés identiques** (404 lang/title, login inputs, password id, th vide, `aria-labelledby="#remoteFetchModalTitle"`, contrastes 3.19/3.14/3.98:1, targets 16×17/14×17, SearchableSelect, h1 settings, 10 panes admin sans cible, create_community nsfw/visibility+uploads, menu More absolute, ids dropdown dupliqués, toolbar <24px, badges sans rôle, vote-display sans rôle) + 1 N-A code | OK |
| Vanilla eval | 4 FAIL | **4 FAIL** (h1 settings/legal/instances + 1 label auth for sans cible) + 1 N-A | OK |
| Leçon 47 (≥2 états vanilla) | — | **les 9 états rejoués sur vanilla** : nav-user-menu, post-more-menu, comment-more-menu, comment-reply-editor, community-combobox, markdown-preview, inbox-all-filter, mobile-390, route-404 — tous audités (violations réelles), **0 erreur de setup** → stateProof/setup vanilla-safe éprouvés exhaustivement | OK |
| provenance.json | 44 entrées | **44/44 sha256 conformes** | OK |
| i18n (leçon 43) | résolutions réelles | 9/9 clés du patch (error_page_title, not_found_page_title, more, body, search, upvote, downvote, comments, subscribed) → textes EN réels dans en.json @64fe2ac | OK |

## Δ-1 baseline auth (452 vs 453)

L'écart total est intégralement localisé : `/post/1 [state:comment-more-menu]`
target-size 6 vs 7 — le worker a flaggé `button[data-tippy-content="header"]`
(toolbar markdown <24px) à l'instant de son run ; au mien ce bouton rendait
≥24px (état tippy/rendu à l'instant T). Même règle, même page, même famille
de nœuds ; les 10 autres pages target-size sont **identiques nœud par nœud**
(inbox 4/4, post/1 5/5, …). Public : bit-à-bit. Dérive de contenu dynamique
connue de la boucle — pas un trou de couverture ni une violation masquée.

## Leçons éprouvées par le rejeu

- **47** : les 9 setups d'état tournent sur vanilla (tous, pas 2) — sélecteurs
  présents sans patch.
- **41** : sabotage dans dist/ → `docker restart lm55-ui` obligatoire
  (Express cache le bundle) ; confirmé.
- **40** : marqueurs de pureté distinants mesurés avant scan.
- **43** : clés i18n résolues contre le submodule réel, pas supposées.
- **45** : 0 skip silencieux — `audited=39/39` sur les trois instances.
- Sondes : `--reports` impérativement sur les rapports du run courant
  (leçon boucle) — fait, 51/51.

## Warts

- **W1** (worker, reporté) : `results.json` marque install-build « EN
  COURS » alors que les rapports existent et reproduisent — prose stale.
- **W2** (nouveau, mineur) : la colonne chiffres du REGISTRE liste des
  états sous d'anciens noms (comment-sort, post-form-open,
  create-post-community-open…) ≠ les ids réellement audités
  (nav-user-menu, post-more-menu, comment-more-menu, comment-reply-editor,
  community-combobox, markdown-preview, inbox-all-filter, mobile-390,
  route-404). Les rapports livrés portent les bons ids — divergence de
  prose uniquement, pas de scope.
- **W3** (mineur) : friction d'environnement — `pnpm build` n'existe pas
  (verbatim = `pnpm run build:prod`, correct dans le manifest) et le pnpm
  global v11 échoue devEngines : il faut `corepack prepare pnpm@10.11.0
  --activate` ou l'appel corepack-pinné avant `build:prod` (les sous-scripts
  `prebuild:prod` → `pnpm clean`/`rimraf` résolvent le pnpm du PATH).
- **W4** (mineur) : claim « vanilla 21 FAIL » confirmé à l'unité ; claim
  « eval vanilla 4 FAIL » confirmé (la ligne REGISTRE n'énumérait pas les
  noms — ils sont listés ci-dessus pour la postérité).

## Conclusion

Patch, chaîne de mesure et artefacts du worker : **reproductibles à
l'identique** à Δ-1 près (dérive dynamique localisée et expliquée). Le
score 710→0 est réel ; les gardiens (verify/eval/sondes/sabotage/vanilla)
se comportent comme documenté ; l'install-build verbatim tient.
**CONFIRMED.**
