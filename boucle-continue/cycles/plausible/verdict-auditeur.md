# Verdict auditeur — cycle 48 : plausible/analytics @b89b749cd1beee2bc4bb75a32c437bcf58e0253a

**Auditeur** : devin-53be513cc4a24133ad01444bbf48fe07 (session indépendante)
**Date** : 2026-10-08 · **Verdict** : **CONFIRMÉ** (réserves mineures : warts de reproductibilité tooling, aucun sur le produit)

Rejeu intégral zéro-confiance : MES containers `c48a-pg`/postgres:18 :8992,
`c48a-ch`/clickhouse:25.11.5.8 :8993 (plus `c48i-pg`/`c48i-ch` :8997/:8998 pour
l'install-build), MON seed (`priv/repo/seeds.exs` rejoué + `shared_links` SQL),
MES ports **:8990 patché·vanilla / :8995 install-build**, DEUX clones propres à
moi @SHA pinné. Toolchain Elixir/OTP portée dans le conteneur `c48a-elixir`
(uid 1000, FS monté) — adaptation documentée, séquence boot.sh verbatim
inchangée. Aucune assertion worker prise pour argent comptant.

---

## 1. Intégrité du patch (claim : sha256 91a123b5…, 35 f, +157/−105)

| Vérification | Résultat |
|---|---|
| `sha256sum patch.diff` | `91a123b5025651f2f7bf123bfec7d84066fd2b7a7786c918bb4b91126d4d63bc` — **identique** à `patch.diff.sha256` et à `provenance.json` |
| `git apply --check` clone vierge @b89b749c | **0 rejet** ; appliqué proprement sur DEUX clones distincts |
| `git apply --stat` + recomptage (leçon 39) | **35 fichiers, +157/−105** — conforme au manifest |
| Relecture des 1167 lignes hunk par hunk | 100 % a11y : hiérarchie h1/h2/h3, `aside`→`div` (region), footer landmark + h4→h2, navs dédupliquées + `aria-label="Main"`, `role="switch"`+`aria-checked` string, labels sur inputs/icon-buttons/dropdowns/modals, `alt=""` décoratif, `sr-only` h1 React, focus canvas topbar, contrastes indigo-500→600/gray-400→500-600, link-in-text-block, FlowProgress div→ol/li, `<a href="javascript:">`→`<button type="button">` |
| Hors-scope | aucun hunk hors a11y ; `csv_export.ex` = contraste lien inline — in scope |
| Provenance `--strict` (rehash-provenance.py) | **37/37 hash OK, 0 missing, 0 diff** |

Piège soupçonné levé : `id="user_current_email"` posé sur DEUX inputs de
`settings/security.html.heex` — les deux blocs sont sous `:if` mutuellement
exclusifs (`Users.type == :standard` vs `:sso`) → un seul rendu par profil,
**pas de duplicate-id** (confirmé en DOM : axe 0 violation sur la route).

## 2. Baseline vanilla (claim : 209 occ / 19 règles)

Vanilla obtenu par `git stash` du patch + `mix compile` + `mix assets.build` +
redémarrage :8990. **Pureté vérifiée (leçon 40)** : marqueurs patch absents
(`/login` sans `py-1`, `/` sans `<footer>` ni `aria-label="Main"`, navs
imbriquées présentes, `sr-only` absent du bundle app.js).

| Scan | Worker | Auditeur |
|---|---|---|
| baseline-auth (18 routes × 11 états = 29 scans) | 13 règles / 195 occ / 0 err | **13 règles / 195 occ / 0 err — identique** |
| baseline-public (6 routes) | 6 règles / 14 occ / 0 err | **6 règles / 14 occ / 0 err — identique** |
| **Total** | **209 occ / 19 règles** (13+6 sommées par scope) | **209 occ — identique ; mêmes 13 IDs de règles exactement** |

Règles : aria-dialog-name, aria-prohibited-attr, button-name, color-contrast,
heading-order, image-alt, label, landmark-unique, link-in-text-block,
link-name, page-has-heading-one, region, target-size.

## 3. Scans finaux patché :8990

| Scan | Worker | Auditeur |
|---|---|---|
| final-auth | 0 viol / 0 err / 29 inc-rules | **0 / 0 / 29 — identique** |
| final-public | 0 viol / 0 err / 3 inc | **0 / 0** / 1 inc (variance nœuds incomplets axe, non-significative) |

29/29 pages scannées, toutes HTTP 200, **0 erreur, 0 skip silencieux**
(leçon 45). Scope deltas vérifiés en live : `/settings` index →
`redirect /settings/preferences` (controller lu + route observée),
`/not-a-real-page-xyz` → 404 réel.

## 4. install-build verbatim (claim : rescan 0 viol/0 err)

Deuxième clone vierge @SHA + `git apply` (re-vérification de l'application) +
chaîne complète `deps.get → ecto.create+migrate → npm ci assets+tracker →
assets.setup/build → tracker deploy → download_country_database → seeds.exs +
shared_links` sur containers **frais** c48i-pg/c48i-ch, serveur :8995.

| Scan | Worker | Auditeur |
|---|---|---|
| install-build (29 scans) | 0 viol / 0 err | **0 / 0 / 29 inc — identique** |
| install-public (6) | 0 viol / 0 err | **0 / 0 — identique** |

**Prérequis non documenté** : `auth.json` ne suit pas d'un boot à l'autre —
la session est validée côté DB (tokens) ; mon auth.json issu de :8990 rendait
/dummy.site **404** sur :8995 → re-login obligatoire par instance (voir W3).

## 5. verify / eval / vanilla / sabotage

| Claim | Rejeu auditeur |
|---|---|
| verify 37/37 | **37/37 OK, 0 FAIL, 3 N-A** — identique (N-A identiques : liens docs /login, footer focus_box, edit/delete /sites) |
| eval 8/8 | **8/8 OK, 0 FAIL, 1 N-A** (régions aria-live) — identique |
| vanilla → ~18 FAIL | **exactement 18 FAIL** / 18 OK / 4 N-A — noms discriminants : `security: section "Account" en h2`, `choose-plan: plans en h2`, `dashboard: h1`, `boutons options/calendrier nommés`, `modales: role=dialog nommé` |
| sabotage aria-label → FAIL nommé | suppression de `aria-label={"Actions for #{@site.domain}"}` sur le trigger site → recompile → **`FAIL sites: menus par site ont un nom dynamique ["Most visitors","",""]`** ; revert → **37/37** restauré |

## 6. Sondes incomplets (claim : 325 sondés → 322 conf / 0 NC / 3 non-retrouvées)

Rejeu complet (pas un échantillon) : **307 sondes → 304 conformes / 0 NON
CONFORMES / 3 non retrouvées**.

- Les **3 non-retrouvées sont IDENTIQUES** : ticks SVG d3
  `g[transform="translate(80.4..,0)] > .translate-y` etc. en dark-dashboard —
  positions de ticks non déterministes, documentées par le worker.
- **0 NC** dans les deux runs.
- Delta 325→307 : 20 sondes worker seulement (kbd du period-menu ×15, kbd
  site-switcher ×2, textes SVG realtime ×2, target-size login/register) vs 2
  miennes (dimension-value truncate breakdown + share) — **variance de
  génération des nœuds "incomplete" axe** (soumis à timing/hover/data-state),
  pas de différence de conformité.

## 7. Pièges Phoenix (rejoués)

- **Attrs HEEx non déclarés droppés** : le patch déclare `attr :button_aria_label`,
  `attr :label` (required sur `toggle_submit` — 3 callers tous mis à jour),
  `attr :label` sur modals → les attrs arrivent réellement au DOM (mesuré par
  verify en live : boutons nommés, dialogs nommés).
- **aria-checked booléen omis** : le patch émet `"true"`/`"false"` en string
  (`if @set_to, do: "true", else: "false"` et idem `show_toggle`) — correct,
  confirmé DOM.
- **seeds.exs non idempotent** : rejoué → `Ecto.ConstraintError` (unique users)
  à la 2e passe — claim confirmé, documentation honnête ("reset avant rejeu").
- **`2.5.3` / slugs i18n (leçon 43)** : labels dynamiques contiennent le texte
  visible (`Actions for {domain}`, `button_aria_label={@current_user.name}` =
  nom affiché) ; dist patché greppé — **zéro clé i18n**, libellés anglais
  littéraux dans dashboard.js.

## 8. Warts (réserves — tooling/reproductibilité, pas le produit)

- **W1** — `manifest.auditCommands.incompleteProbes` documente
  `node tools/incomplete-probes.mjs reports/final-auth reports/final-public`
  **sans `<baseUrl>`** : positionnels mangés comme authPath/reportDirs → crash
  `EISDIR`. Forme réelle : `<baseUrl> [--storage-state …]`.
- **W2** — ancrage dépendances fragile : `audit.mjs`/`incomplete-probes.mjs`
  font `createRequire(resolve(process.cwd(),'package.json'))` → exigent
  package.json+node_modules à la racine d'exécution (non committés : le
  BOOT_ROOT/package.json du worker n'est pas dans le dépôt) ; `eval-final.mjs`
  hardcode `auth.json` au CWD. Reproductible une fois compris, fragile verbatim.
- **W3** — sessions DB-backed : un `auth.json` par instance requis (login par
  boot) ; le manifest réutilise `tools/auth.json` pour installBuild sans le dire.
- **W4** — `seed.sh` écrit `tools/seed-info.json` (hors gitignore) mais le
  fichier n'est pas committé ; le manifest embarque les credentials →
  reproductible quand même, cohérence leçon 46 néanmoins vérifiée (aucun
  artefact ne référence un seed-info absent).
- **W5** — `tools/node_modules` (22 M, axe-core+playwright+playwright-core)
  committé malgré `tools/.gitignore` (`node_modules/`) — choix délibéré de
  vendoring pour rejeu offline, mais discordance avec le .gitignore.

## 9. Conclusion

Toutes les claims produit reproduites à l'identique ou mieux : **209 occ/19r
vanilla → 0 viol/0 err patché** (scans identiques node-à-node sur les
violations), **verify 37/37, eval 8/8, sabotage nommé, vanilla 18 FAIL,
install-build 0 viol, sondes 0 NC / 3 non-retrouvées identiques,
provenance --strict 37/37**. Premier Elixir de la boucle correctement opéré ;
les pièges Phoenix spécifiques (HEEx attrs, aria-checked string, session
DB-backed) sont gérés dans le patch ET documentés dans les gotchas.

Réserves = warts W1–W5 (docs/tooling), dont W1-W3 à corriger idéalement dans
une passe fixer du cycle (commande manifest + ancrage createRequire + note
auth.json par instance). Aucun n'invalide les résultats.

**Verdict : CONFIRMÉ.**
