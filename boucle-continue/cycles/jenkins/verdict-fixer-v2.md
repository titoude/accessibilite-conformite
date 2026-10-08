# Verdict FIXER v2 — cycle 42 — jenkinsci/jenkins @ db0e08291b113878ba08f97274d56c321be32078

Session fixer v2 (boucle continue). Traite la feuille de route auditeur (verdict-auditeur.md) : F-v2-1 périmètre étendu + 3 warts outillage.

## Résultat

| Mesure | Vanilla :6950 | Patché :6942 | Install-build :6943 |
|---|---|---|---|
| Violations axe (48 scénarios : 42 routes auth + 6 états) | **3003 occ / 16 règles** | **0 occ / 0 err** | **0 occ / 0 err** |
| Incomplets | 541 | 507 | 507 (distribution identique 382+125) |
| verify.mjs | 25 FAIL (sabotage = discriminant) | 31/31 PASS | — |
| eval-final.mjs | (assertions durcies) | 25/25, 0 FAIL | — |
| Sondes incomplets (pixel/composite) | 282 FAIL | **6 FAIL ⊆ vanilla** | — |

## F-v2-1 — périmètre étendu corrigé dans les vraies sources

Scope auth élargi 20 → 42 routes (`tools/urls-auth.txt`, v1 conservée `urls-auth-v1.txt.bak`) : pluginManager (+available +updates +installed), credentials domain+credential, computer/new+(built-in), systemInfo, /script, /cli/, restart+safeRestart, /about/, securityRealm/addUser, /oops, configures + consoles supplémentaires. Rebaseline honnête sur vanilla : **3003 occ / 16 règles**.

Correctifs v2 (patch.diff 53 fichiers, +232/−77) :

- `src/main/scss/base/_typography.scss` : `.jenkins-label--tertiary` opacity 0.7 retiré + `a.jenkins-label--tertiary` min-height 24px (target-size lien version installed).
- `src/main/js/templates/plugin-manager/available.hbs` : `<label for="plugin.{name}.{sourceId}">` + span visually-hidden displayName → 50 labels de cases plugin.
- `core/.../PluginManager/installed.jelly` : les 2 `<label class="attach-previous"></label>` reçoivent `<span class="jenkins-visually-hidden">${p.displayName}</span>` → 75 labels.
- `core/.../PluginManager/updates.jelly` : `<d:invokeBody/>` garde `attrs != null` — répare le crash amont `JellyTagException` (page rendue comme VUE Stapler, pas comme tag) qui vidait le body → landmark/region restaurés.
- `core/.../lib/hudson/scriptConsole.jelly` : `aria-label` sur le `<textarea>` + `core/.../lib/form/textarea/textarea.js` + `war/.../hudson-behavior.js` : `codemirror.getInputField().setAttribute("aria-label", …)` — le champ caché CodeMirror (`wrap="off"`) est nommé aux 2 points d'init.
- `core/.../Jenkins/oops.jelly` : `<img alt=""/>` ; `_restart.jelly` + `MasterComputer/configure.jelly` : `<l:app-bar>` → page-has-heading-one.
- `core/.../lib/layout/overflowButton.jelly` : `tooltip="${null}"` → fallback `'%More actions'` (bouton #button-install-after-restart nommé).
- `core/.../lib/hudson/propertyTable.jelly` + `property-table.css` : `jenkins-!-color-blue` → `-dark-blue` (reveal/hide valeurs sensibles : sonde pixel 4.26→>7 sur fond teinté ::before).
- `src/main/scss/components/_buttons.scss` : `.jenkins-button--primary[class*="color"]` fond `oklch(from var(--color) calc(l - 0.08) c h)` — blanc sur --red passe 4.18→~5 (bouton "Yes" /safeRestart + toutes confirmations primary colorées).
- `src/main/js/components/dialogs/index.js` : `aria-labelledby` → `jenkins-dialog-title-{n}` sur `<dialog class="jenkins-dialog">` — le titre visible devient le nom accessible programmatique (relevé par l'assertion eval durcie).

## Warts outillage corrigés

- **package.json** : `cycle37-linkding-tools` → `a11y-cycle42-jenkins-tools` (package.json + package-lock.json ×3).
- **verify.mjs** : assertion tautologique `header: true` supprimée — `.app-branding` n'existe que sur /login, déjà couvert par `login: header branding` (vrai sélecteur `header.app-branding`). 31 assertions, 0 FAIL patché / 25 FAIL vanilla.
- **eval-final.mjs** : `dlg.found === true && dlg.labelled === true` + sélecteur réel (`confirmation-link` par texte — href est `#`) + `dialog.jenkins-dialog[open]` (exclut la palette commande). L'assertion durcie a d'abord FAIL en révélant le vrai défaut (dialogue sans nom accessible) → corrigé dans les sources.
- **measure-contrast.mjs** : parse rgb/rgba + `color(srgb)` + `oklch(L c h)` → sRGB linéaire ; bug composite corrigé (alpha propagé — avant : eff NaN → ratio null dès ≥2 couches opaques).

## Sondes — 6 résidus documentés (hors dépôt)

`probes-v2.md` : 6 FAIL = `.ace_string` (oklch green 0.7 sur blanc, 2.41) du thème éditeur **workflow-cps** (WEB-INF/lib/workflow-cps.jar → workflow-editor.css — jpi binaire, repo workflow-cps-plugin distinct du produit audité). Pré-existants ⊆ 282 FAIL vanilla, zéro introduite. Les 8 `.ace_gutter-cell` vanilla ont été résolus par `--secondary` 60%→55%.

## Reproductibilité

- `git apply --check` : 0 rejet, 53 fichiers, clone @db0e0829.
- Install-build :6943 (jk42-home-ib, clone vierge + patch + mvn + seed) : rescan verbatim → 0 viol / 0 err, incomplets 507 = même distribution 382+125 que le build primaire.
- `patch.diff.sha256` régénéré ; provenance.json re-hachée en dernier.

## Registre

Ligne 42 mise à jour : worker livré (0 viol étendu) → CONFIRMED v1 → **fixer v2 livré, en attente ré-audit v2**.
