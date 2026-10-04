# Audit indépendant — cycle 5 : NginxProxyManager/nginx-proxy-manager @f64d43b

Auditeur : session indépendante (rejeu complet, pas relecture). Date : 2026-10-04.

## Verdict : CONFIRMED (avec réserves intégrées)

Le score axe « 113→0 app + 12→0 login » est **reproduit** : exécution complète
(clone épinglé → patch → install verrouillée → boot → baseline → final → verify
→ eval-final), provenance intègre, périmètre identique, patch sain,
install-build rejoué PASS. Deux claims du worker sont inexacts dans le détail
(findings 1 et 2) sans remettre en cause le 0-violation axe.

## Métriques mesurées (rejeu) vs déclarées

| Mesure | Déclaré (artefacts) | Rejoué (moi) | Constat |
|---|---|---|---|
| Baseline login | 5 règles / 12 occ | 5 règles / 12 occ | identique |
| Baseline app | 13 règles / 113 occ, 16 inc. | 16 règles / 177 occ, 66 inc. | toutes familles déclarées reproduites + 3 familles suppl. (données /logs plus peuplées — timing dépendant, cf. leçon audits-tiers #7) |
| Final login | 0 viol / 0 err | 0 viol / 0 err / 0 inc | identique |
| Final app | 0 viol / 0 err, 182 inc. | 0 viol / 0 err, 64 inc. | 0 violation identique ; incompletes même pattern (color-contrast /logs + modale + user-menu), cardinal données-dépendant |
| scopeHash app | 9c0e5f65… | 9c0e5f65… | identique baseline/final |
| scopeHash login | a1a25d52… | a1a25d52… | identique |
| statesHash | 7cd271ae… (scope.json) | 7cd271ae… | identique — MAIS voir finding 3 |
| verify.mjs | « 96 assertions PASS » | 97/97 PASS | OK (décompte 96 approximatif) |
| eval-final.mjs | « 7 PASS + 1 INFO » | 6 PASS + 1 FAIL + 1 INFO | divergent → finding 1 |
| install-build | PASS | PASS (checkout propre : clone → f64d43b → patch → yarn --frozen-lockfile → locale-compile → `yarn build` tsc+vite) ; `yarn lint` biome propre | reproduit |
| provenance | 13 hash | 13/13 sha256 exacts sur disque | intègre |

## Findings

1. **eval-final FAIL reproduit — « Tab reste piégé dans la modale (25 pressions) ».** Séquence mesurée (2 runs + sonde) : Tab 12 « Save » → Tab 13 `body` → Tab 14 **skip-link** (élément ajouté par le patch) → Tab 15 retour dans `.modal.show` → cycle interne ensuite. La modale (react-bootstrap/@restart) ne rend **aucun garde-focus** : le trap rattrape en asynchrone, donc une sortie transitoire est structurelle sous Playwright — le PASS déclaré n'est pas reproductible. Le focus ne vagabonde pas durablement (rattrapé, cycle interne repris) : c'est (a) une assertion harnais instable qui mesure un transitoire, ET (b) un vrai wart introduit par le patch — le skip-link devient atteignable pendant qu'une modale est ouverte (2.4.3 focus order, mineur).
2. **Incomplete non absorbé : placeholder react-select à 3,95:1.** `#react-select-3-placeholder` (« Start typing to add domain… ») mesuré à 3,95 < 4,5:1 sur fond blanc — le claim « 182 incompletes vérifiés conformes » est faux sur ce nœud. Reste en `incomplete` axe (pas une violation → le gate tient), mais le balayage « reviewed-NA » était trop large. Probablement partagé par tous les placeholders react-select de l'app.
3. **`scope-comparison.json` incohérent en interne.** Il déclare `statesHash: fbaed39a…` alors que les scope.json baseline ET final (et mon rejeu) portent `7cd271ae…`. Le document censé prouver l'identité de périmètre contredit les artefacts qu'il compare — valeur périmée ou recette différente (à régénérer DEPUIS les artefacts, leçon audits-tiers #2).
4. **Commandes d'audit non reproductibles depuis le manifeste.** Ni `manifest.json` ni `scope.json` (runner v5 n'émet pas waitFor/wait) ne consignent les invocations exactes (flags, `--wait-for`, `--wait`). Reconstruction nécessaire depuis la sémantique des scope.json ; asymétrie baseline/final des waits indétectable a posteriori (violation de la leçon audits-tiers #8 déjà inscrite).
5. **`results.json` auto-décerne `verdictCalculated: CONFIRMED` + « findings résolus ».** Le verdict appartient à l'auditeur ; le détail « eval-final 7 PASS » et « incompletes tous conformes » est surévalué (findings 1–2). Cosmétique mais à corriger dans le registre.
6. (Note, non-patch) Backend : `GET /tokens` → 500 « error is not defined » — bug upstream préexistant dans le handler d'erreur, hors périmètre du patch.

## Chasse à la triche — RAS

- **Patch sain** : 55 fichiers, tous sous `frontend/` (src + `biome.json` + `en.json`). Aucune fonctionnalité supprimée (revue des 259 lignes `-` : transformations/reformat uniquement — `Modal`+`aria-labelledby`, `ul`→`div[role=tablist]` canonique, `label` imbriqué→`span`, `h2`→`h1`, `header`→`nav`, `{...rest}` sur Button, `inputId` react-select). Pas de `display:none`/`visibility`/`aria-hidden` ajouté pour masquer. 3 `!important` ciblés et justifiés (navbar `.text-secondary` ×2, `.logBox .text-danger`) — cascade dynamique Tabler documentée. Aucun `aria-*` décoratif (labels portés par des éléments interactifs/landmarks). `vite.config.ts` exclu du patch (adaptation harnais déclarée, reproduite : proxy `/api`→`:3000` avec rewrite).
- **Provenance** : calculée en dernier depuis le disque (`computedLast: true`) — 13/13 hash exacts, patch.sha256 concordant.
- **Périmètre** : scopeHash+statesHash strictement identiques baseline/final, réprouvés par rejeu. Hors périmètre déclaré cohérent (`/setup` inaccessible car admin créé via env — vérifié : isSetup() true ; 2FA/TOTP ; nginx réel hors docker — warnings logrotate/ip_ranges observés, connus).
- **INCOMPLETES** : 64 nœuds rejoués (même répartition /logs 61 + modale 2 + user-menu 1) ; sondes indépendantes : selects 10,31:1, loglines 16,98:1, text-danger log 7,16:1, dead-hosts 10,31:1 — conformes AA sauf finding 2.

## Défauts harnais (à corriger)

1. `eval-final.mjs` : assertion « piège 25 Tab » instable sur modales sans gardes-focus — mesure l'`activeElement` transitoire avant le rattrapage asynchrone → PASS/FAIL non déterministe. Fix : tolérer la transitoire (vérifier que le focus NE PEUT PAS quitter durablement : N tabs consécutifs hors modale = fail ; un simple passage = ignorer) ou attendre un délai avant mesure.
2. `scope-comparison.json` généré avec un `statesHash` incohérent (finding 3) — régénérer depuis scope.json.
3. `manifest.json` : pas de commandes d'audit ni de waits consignés (finding 4) — ajouter `audit.commands` explicites et émettre `waitFor`/`wait` dans scope.json.
4. `verify.mjs`/`eval-final.mjs`/`login.mjs` : `storageState: 'auth.json'` en chemin relatif CWD — correct documenté mais fragile ; un `--auth` ou env AUTH_STATE serait plus sûr.
5. `results.json` : retirer `verdictCalculated` (le worker ne se juge pas) et corriger les claims eval-final/incompletes.

## Défauts patch (résiduels, non bloquants)

1. Skip-link atteignable pendant l'ouverture d'une modale (intercalé dans la boucle Tab sous trap sans gardes) — wart 2.4.3 mineur introduit par le patch.
2. Placeholders react-select (#808080) < 4,5:1 — résidu contraste non corrigé (couvert par axe `incomplete`, pas par `violations`).
3. Re-indentation complète d'`App.css` (tabs→espaces) : bruit de diff acceptable, non fonctionnel.

## Recommandations protocole

1. **Interdire l'auto-verdict** : `results.json` ne doit pas contenir de `verdictCalculated` — l'artefact du worker décrit des mesures, pas un jugement.
2. **Rendre les claims eval-final/incompletes sourcés** : exiger pour chaque « incompletes vérifiés » la liste des sondes + ratios mesurés dans un fichier `incomplete-probes.json` rejouable (pas un résumé textuel).
3. **Consigner les commandes** : `manifest.json.auditCommands[]` obligatoire (chaîne exacte par run) + `waitFor`/`wait` émis dans `scope.json` (runner v5+).
4. **Assertion trap modale robuste** (pattern CyberChef généralisé) : la mesure doit tolérer le transitoire des traps sans gardes ; fail seulement si le focus reste dehors sur N mesures consécutives, ou si un contrôle du fond est activable.
5. **scope-compare régénéré depuis artefacts** (CI-check : `scope.compare.statesHash == scope.json.statesHash`) — l'écart trouvé aurait été attrapé par un tel contrôle.
6. **Baseline data-dépendante** : consigner dans `manifest.json` les prérequis de données (ex. /logs nécessite des lignes réelles) car les comptes baseline varient avec le contenu — déjà couvert par leçon #7 mais le prérequis n'est pas inscrit.

## Annexes — commandes rejouées

```
# tools/ (npm i playwright axe-core, npx playwright install chromium)
node audit.mjs http://localhost:5173 --urls /login --states none \
  --wait-for form --wait 1200 --out baseline/login
node audit.mjs http://localhost:5173 --urls /,/nginx/proxy,/nginx/redirection,/nginx/404,\
/nginx/stream,/certificates,/access,/users,/audit-log,/logs,/settings \
  --states all --storage-state auth.json \
  --wait-for 'a.nav-link[data-bs-toggle="dropdown"]' --wait 1200 --out baseline/app
# final : même commandes ; login --wait-for '#main-content', app --states add-host-modal,user-menu
node login.mjs        # -> auth.json (POST /api/tokens admin@example.com)
node verify.mjs http://localhost:5173
node eval-final.mjs http://localhost:5173
# backend : unshare -rm (bind ~/data->/data) ; DB_SQLITE_FILE INITIAL_ADMIN_* node index.js
# frontend : yarn dev (:5173) + proxy /api->:3000 rewrite
```
