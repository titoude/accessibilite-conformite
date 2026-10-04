# Verdict auditeur — cycle 13 vikunja

**Verdict : CONFIRMED** — reproductibilité axe-score + patch sain. Ceci n'affirme PAS la conformité WCAG complète : périmètre axe seul (wcag2a/aa + best-practice) et 32 résultats `incomplete` non résolus restent à revue humaine.

Auditeur : session indépendante (devin-c617b2639b8e4b62bdaed0488bf9767c), VM neuve, rejeu complet sans réutilisation des artefacts du worker.

## Méthode de rejeu (indépendante)

- Clone frais `github.com/go-vikunja/vikunja` (filter=blob:none), checkout du commit épinglé `04373954353c22b78f552044ad551e1407a92f24` ("fix: use vite default build target").
- `git apply --check` puis `git apply` du `patch.diff` livré → OK, 17 fichiers, +50/-28 exactement comme annoncé.
- `cd frontend && pnpm install --frozen-lockfile` (12.2 s, pnpm 11.27.0) + `pnpm build` (vite 8.3.0) + `go build` (go1.27.0 installé pour l'occasion, `~/goroot`) — binaire patché OK.
- `git apply -R` + rebuild frontend + `go build` → binaire vanilla pour la baseline.
- Boot sqlite sur :3457 (`VIKUNJA_SERVICE_INTERFACE=":3457"`, publicurl, files basepath — cf. manifeste) pour les deux instances.
- Seed reproduit par API : `POST /api/v1/register` admin/adminpass123 → Inbox auto (projet 1, vues 1-4) ; `PUT /api/v1/projects` « Projet démo » → id 2 ; `PUT /api/v1/projects/2/tasks` ×3 → tâches 1-3 ; `GET /api/v1/projects/2/views` → vues 9=list/10=gantt/11=table/12=kanban. **IDs identiques à ceux documentés.**
- `node tools/login.mjs` puis `audit.mjs` avec les URLs du manifeste, `--states all`, `--wait 2000` — commandes rejouées à l'identique (seul le nom du fichier auth diffère).

## Résultats du rejeu

| Étape | Livré | Rejoué | Verdict |
|---|---|---|---|
| provenance.json (sha256 fichiers) | 27 entrées | **27/27 conformes** | OK — provenance elle-même non listée (cohérent : hashée en dernier) |
| patch.diff sha256 | `3d9588a4…` | `3d9588a4…` + `.sha256` concordant | OK |
| baseline :3457 | 55 occ / 6 règles / 32 inc | **55 occ / 6 règles / 32 inc, exit 1** | OK — distribution par règle identique (color-contrast 40, target-size 5, list 2, aria-required-parent 3, aria-prohibited-attr 3, link-in-text-block 2) |
| baseline-login | 3 occ / 3 règles | 3 occ / 3 règles (page-has-heading-one, region, target-size) | OK |
| final-clean (patch sur clone propre, :3457) | 0/0, 32 inc, exit 0 | **0/0, 32 inc, exit 0** | OK |
| final-login | 0 occ, 1 inc | 0 occ, 1 inc | OK |
| scopeHash baseline :3457 | `f1662265…` | `f1662265…` | **IDENTIQUE** |
| statesHash baseline :3457 | `cdcdf87d…` | `cdcdf87d…` | **IDENTIQUE** |
| verify.mjs | 22/22 | **22/22** | OK |
| eval-final.mjs | 7/7 | **7/7** | OK |
| install-build | OK (log) | pnpm install --frozen-lockfile + build + go build OK sur clone patché | OK — log livré partiel (F4) |

Note ports : `final` livré = :3456 → `final_scopeHash`/`statesHash` diffèrent mécaniquement (le hash couvre l'origine dans les ids de scénario). `scope-compare.json` est honnête (`scope_identique: false` + note explicative) ; la comparaison probante est baseline ≡ final-clean (même port, hash identique), que mon rejeu confirme.

## Lecture du patch (17 fichiers, +50/-28) — sain

- Contrastes : tokens du repo (`--text-muted`, `--primary-dark`, `--danger-text` avec `!important` global sur `.has-text-danger`), liens soulignés dans le texte — vraies corrections, pas de masquage.
- Gantt : wrapper `role=columnheader` orphelin (aria-required-parent) → `role=rowgroup` + `id`, et `aria-owns` sur le grid pour rattacher le header — structure table ARIA correcte (vérifié : les `role=columnheader` restent dans des `role=row` du rowgroup).
- NoAuthWrapper : `h2`→`h1` + `role=complementary` — vraie structure de page login.
- ProjectList : items wrappés dans `<li>` sous `ul.tasks` — vrai fix de la règle `list`.
- target-size : `min-width/height: 24px` (Password toggle, QuickAddMagic) — tailles réelles.
- TipTap : `role=textbox` + `aria-multiline` sur le contenteditable — réel.
- **Aucun** `display:none`, suppression DOM, `aria-hidden` abusif ou faux aria. Distribution `incomplete` identique baseline/final (31 color-contrast + 1 aria-required-children) — le patch ne déplace pas de défauts vers la zone grise.
- Sonde DOM live (leçon navidrome) : menu utilisateur ouvert = visible, zéro ancêtre `aria-hidden`.

## Outils

- `audit.mjs` v5 : runner sérieux (contrôles nav HTTP/redirect/origine post-setup, injection axe prouvée, écriture atomique, exit 2 sur périmètre incomplet). Non modifié entre mes runs — statesHash recalculé identique.
- `verify.mjs` : assertions dures sur défauts réels (texte des h1, contrastes **mesurés** par luminance calculée, structure grid, enfants `<li>`, Escape via visibilité v-show, reflow 320px). Pas de leurres sur le cœur.
- `eval-final.mjs` : 7 contrôles réellement indépendants (aria-current, labels de formulaires, Escape modale, souligné teams, cartes kanban nommées, zoom 200%, bascule aria-expanded).
- `results.json` : champs séparés et factuels (baseline/final/final_clean_clone/verify/eval/install_build), aucun verdict auto-proclamé. `manifest.json` : auditCommands rejouables, seed documenté avec les bons IDs, boot.notes honnêtes (interface pour le port, publicurl+CORS, rotation JWT — tous constatés).

## Findings

- **F1 (mineur)** — `states.json` déclare `statesHash: 0eb68ef7…` non reproductible : il ne correspond ni au digest du runner sous aucune origine testée (:3456, :3457, localhost, vide), ni au hash de la liste de noms, ni au source STATES. Les `statesHash` **dans les scope.json** sont eux cohérents et rejoués à l'identique — seul le fichier déclaratif est périmé ou calculé par une méthode non livrée (même classe que le finding navidrome).
- **F2 (mineur)** — `verify.mjs` a 3 assertions conditionnelles silencieuses (`if (measured.active)`, `if (labels)`, `if (danger)`) : un mutant qui *supprime* le lien « Create a label », le `menu-bottom-link` ou l'item `.has-text-danger` passe sans échec. `measured.muted` est capturé mais jamais asserté (grab mort). Le cœur (h1, landmarks, grid, liste, Escape, reflow) est inconditionnel.
- **F3 (mineur)** — `eval-final.mjs` : deux contrôles quasi-vacuums (`aria-current` passe si aucun lien actif ; « teams souligné » passe sur `absent` — justifié par l'état vide mais poreux aux mutants) et zoom 200% = proxy faible (`bodyText > 200` sans test de scroll/clipping).
- **F4 (mineur)** — `install-build.log` ne couvre que le build frontend (démarre mi-install, termine `INSTALL-BUILD-OK`) : pas de traces du clone/`git apply`/`go build`. Le worker a bien livré la preuve du build, pas celle de la chaîne complète — comblé par mon rejeu indépendant.
- **F5 (nit)** — `auditCommands` du manifeste ciblent tous :3457 alors que les artefacts livrés couvrent deux phases/ports (baseline :3457 vanilla, final :3456, final-clean :3457 patché) : la liste ne sépare pas les phases — le relecteur doit inférer le mapping depuis `scope-compare.json`. Le seed nomme les IDs sans donner les appels API exacts (`PUT`, pas `POST`, pour create projet/tâche — à savoir pour rejouer).

## Points de la mission

1. provenance : **27/27 OK** (hashée en dernier, non auto-listée).
2. patch sur clone propre au commit épinglé : **s'applique, OK**.
3. install verrouillée + build (pnpm + go) : **OK**, rejoués.
4. scope.json : hashes **recalculés identiques** ; scope-compare cohérent (écart de hash = artefact de port, documenté).
5. manifest : rejouable, seed honnête et reproduit aux IDs près, notes boot exactes.
6. results : champs séparés, pas d'auto-verdict.
7. assertions : réelles sur le cœur ; faiblesses = skips conditionnels (F2/F3) — un mutant « suppression d'élément » passerait ces seules branches, mais pas axe ni le reste.
8. audit final rejoué de bout en bout : **score 55→0 reproduit à l'occurrence près** + verify 22/22 + eval 7/7.
