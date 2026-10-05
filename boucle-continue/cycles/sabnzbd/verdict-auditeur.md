# Verdict auditeur — cycle 25 sabnzbd/sabnzbd @a3737b9

**Verdict : PARTIAL** — rejeu indépendant complet, sans confiance (auditeur : devin-c90e1e63, 2026-10-05).

Tous les chiffres axe, les hash et les artefacts rejouent **à l'identique** (baseline 1483+7=1490
nœud-pour-nœud, final/install-build 0 violation / 218 incomplets, scopeHash/statesHash recomputés
identiques, provenance 34/34, verify 55/55, eval 9/9, sondes concordantes). **MAIS** le patch n'est
pas sain : il injecte `aria-label` à l'intérieur de sélecteurs jQuery d'attribut (`config_rss.tmpl`),
ce qui produit un `Syntax error` live et **tue tout le code JS après la ligne 598** du bloc
`ready` — boutons `.testFeed`/`.cleanFeed`/`.evalFeed`/`.delFilter` morts (clics sans effet),
tablesort des 3 onglets RSS non initialisé, désactivation conditionnelle des options de filtre morte.
De plus deux couleurs introduites par le patch lui-même échouent en mode nuit wizard
(`.success` 2.94:1, `.failed` 3.63:1) — surfaces couvertes par le scope (wizard scanné), jamais
mesurées car dynamiques. Le score axe est confirmé ; la santé du patch non → PARTIAL.

Rejeu effectué : clone propre `sabnzbd/sabnzbd` @ `a3737b9b892e84b4cac1d80096c7539f7ec7092a`,
`git apply patch.diff` (29 fichiers, **0 rejet**, sha256 `f87617ff…` = déclaré), `venv` partagée
(pip -r requirements.txt), deux instances réelles : **vanilla sur :8090** (data ~/work/data-vanilla,
seed+login) pour la baseline, **patchée sur :8080** (clone indépendant + apply, data fraîche,
seed → restart → login) pour l'install-build. Commandes `manifest.auditCommands` verbatim.

## Rejeu point par point

| Claim | Rejeu auditeur |
|---|---|
| provenance.json (34 fichiers) | **34/34 sha256 OK** recomputés depuis le disque ; seul `provenance.json` hors carte (ne peut pas s'auto-hacher — normal) |
| sha256 patch.diff | `f87617ff9292ab58…cdf47` — **identique** au `.sha256` livré ; `git apply` 0 rejet, 29 fichiers |
| Baseline 1483 occ / 15 règles (+login 7/4 = 1490) | **reproduite exacte** sur vanilla :8090 : 1483/15 + 320 incomplets / 0 erreur ; distribution par règle **identique**, par page×règle **0 diff sur 47**, login rejoué **7 occ / 4 règles / 1 incomplet identique**. Seuls deltas de nœuds : ids aléatoires (`#tooltipNNNNNN`, `SABnzbd_nzf_*`, `td[data-timestamp]` du seed) — bruit de génération, pas de substance |
| Final / install-build 0 viol / 218 inc / 47 scénarios | **reproduit à l'identique** : mon install-build indépendant sur :8080 → **0 violation / 0 erreur / 218 incomplets**, distribution identique (176 color-contrast + 23 link-in-text-block + 18 aria-valid-attr-value + 1 frame-tested), **0 diff page-par-page**, 0 erreur |
| scopeHash `e97861748e26…` / login `21e3d78c…` | **recomputés identiques** sur les 6 report.json livrés (tri sha256 des labels) **et** sur mes propres rapports :8080 → hash recoupés = mêmes ensembles de scénarios. (Ma baseline :8090 a un hash différent par construction — le port fait partie du label ; comparaison sur les comptes, documenté) |
| statesHash `5fbb42e9…` | **recomputé depuis le source livré** `tools/audit.mjs` (url + `setup.toString()` des 31 états évalués par vm) = identique aux 3 scope.json → le runner livré EST celui qui a produit les rapports |
| verify.mjs 55/55 | **rejoué : 55/55 PASS** — assertions relues : landmarks/h1 ×13 pages, noms réels, th, tooltips dans `.main-content`, h4.modal-title→h3, opacity `.close` ≥.8, `#navbar-collapse` sans aria-expanded, `label-default` rgb(110,110,110), iframe wizard titré, login main+h1. Deux assertions plus faibles que leur libellé → W5 |
| eval-final.mjs 9/9 | **rejoué : 0 échec** — /scriptlog text/plain (N-A justifié), axe 0 sur erreur réelle /config/nope-xyz, filebrowser ouverte + titre h3 (JS KO à jour), nzbsearch post-requête, thème sombre / et /config/general, aria-expanded navbar absent (vérifié live : null post-transition), logout POST 302 + login clean |
| Sondes 60 : 53 PASS / 7 N-A / 0 FAIL | **rejoué verbatim : 49 PASS / 7 N-A / 0 FAIL** sur 56 verdicts — l'écart 56↔60 tient à `.session-device` ×1 vs ×5 (sessions navigateur accumulées, donnée). **Tous les sondes communs : verdicts identiques**, ratios concordants (ex. `.navbar-timeleft` 12.63, `.close` ~4.09 grand texte). 7 N-A = mêmes (nœuds KO `visible:false` 0×0 + iframe cross-origin wizard) — honnêtes |
| Hors périmètre Plush / smpl | **fantôme** : `interfaces/` ne contient que Config, Glitter, wizard dans cette version — exclusions déclarées pour des skins inexistants (doc, pas de trou de couverture) → W6 |

## Patch — chasse au masquage

Lu en entier (1761 lignes, 29 fichiers, +345/−207), appliqué sur clone propre. **Pas de masquage
axe** : zéro `display:none` ajouté, zéro `aria-hidden` sur contenu, zéro suppression de DOM ciblant
le harnais, équilibre des balises hN vérifié sur les 29 fichiers (renommages h4→h3/h5→p tous fermés),
tous les `label for` résolvent (0 pendant), les `aria-label` ajoutés reprennent les `$T()` des
`title=` existants (nécessaire : Bootstrap tooltip déplace title→data-original-title au runtime).
Corrections structurelles réelles : `<div id="content">`→`<main>` + h1 sr-only (Glitter/Config/wizard/
login), `form.modal`→`div.modal>form` (aria-allowed-role), meta viewport débridé ×3, contrastes via
`light-dark()` + classes, `#feedback-slider` h4→h2 + role=complementary, `.navbar-collapse`
aria-expanded retiré post-transition, `th` vides→sr-only `$T()` pertinents.

**Mais un vrai défaut fonctionnel** (W1) et une correction de couleur sous sa propre barre (W2) —
le patch modifie le produit au-delà de l'a11y sans que le harnais ne le détecte.

## Warts

- **W1 — régression fonctionnelle confirmée en live (RSS)** : patch L737-744 de `config_rss.tmpl`
  réécrit les sélecteurs JS en `select[name="filter_type" aria-label="$T('rss-type')"]` — **invalide**
  (deux paires attr/val dans un seul crochet). Vérifié sur :8080 patché : `PAGEERROR Syntax error,
  unrecognized expression` au chargement de `/config/rss` et `/config/rss?feed=…`. Conséquence :
  tout le bloc `jQuery(document).ready` après la ligne 598 est mort — `.testFeed`, `.cleanFeed`,
  `.evalFeed` (boutons `type="button"` → clics sans aucun effet), `.delFilter`, l'init `tablesort()`
  des onglets matched/not-matched/done, la désactivation conditionnelle des selects de filtre, et le
  `ajaxForm` des boutons download (dégradé : le `action` markup subsiste → POST pleine page au lieu
  d'ajax + spinner). axe ne voit rien (nœud masqué ? non — assertion comportementale absente de
  verify/eval : aucun test ne clique `.testFeed`). Cause probable : un sed en masse sur
  `name="filter_type"` qui a touché les chaînes JS. Correctif trivial : ne pas modifier ces
  sélecteurs (le markup `aria-label` suffit, `select[name="filter_type"]` matchait déjà).
- **W2 — couleurs du patch sous sa propre barre, mode nuit wizard** : `wizard/static/style.css`
  `.success` #00cc22→**#148a1c** : 4.49:1 sur blanc (< 4.5, borderline strict) et **2.94:1** sur fond
  nuit rgb(48,48,48) ; `.failed` `light-dark(#cc0000,#ff3333)` : nuit = **3.63:1 < 4.5**. Mesurés par
  moi sur :8080 (sonde dédiée, même calcul fg×opacité vs premier fond opaque). Ces spans n'existent
  qu'après un test serveur → jamais dans une page scannée ; mode nuit atteignable
  (`data-color-scheme="$color_scheme"`, Auto suit `prefers-color-scheme`). Le worker a validé sa
  correction en clair seulement — eval E teste le sombre sur `/` et `/config/general`, pas le wizard.
- **W3 — sondes = échantillon, non exhaustif** : les 60 sondes couvrent 139/218 occurrences
  (101 nœuds uniques ; 75 uniques non sondés, tous color-contrast). Ma sonde indépendante sur les
  non-couverts : **44 PASS / 7 N-A** (selects natifs au fond indéterminable) / **2 ABSENT**
  (variantes de sélecteur, équivalent couvert) / **0 FAIL** — conclusions cohérentes, mais le
  livrable ne dit pas que c'est un échantillon.
- **W4 — piège d'ordre : eval-final tue la session** : eval F2 fait un vrai `POST /logout` →
  `auth.json` devient caduc. Rejouer les sondes après eval avec le même fichier → tout en timeout
  (mesuré : 11 ERROR + 2 ABSENT, page rendue = /login). Non documenté dans `auditCommands` (les
  sondes n'y figurent pas ; le re-login nécessaire non plus). Après `login.mjs` : 49/7/0 OK.
- **W5 — verify.mjs, deux assertions laxistes** : (a) viewport : `meta?.content || ''` → meta absente
  = chaîne vide = PASS à vide (ici le meta existe et est correct — l'assertion est plus faible que
  son libellé) ; (b) « noms accessibles » compte `data-original-title` comme nom — Bootstrap le
  retire de `title` au runtime et il n'est **pas** dans le calcul d'accname → un contrôle d'icône
  sans nom réel passerait. Mitigé par axe (link-name/button-name 179+20→0, la vraie mesure).
- **W6 — manifest, imprécisions documentaires** : stack déclaré « CherryPy » alors que 5.2.0Beta1 =
  uvicorn/starlette (requirements.txt : pas de cherrypy) ; `horsPerimetre` cite Plush et smpl,
  absents de `interfaces/` (seuls Config/Glitter/wizard existent) ; `install: {}` vide alors que les
  étapes réelles ne vivent que dans install-build.log. Rien de bloquant, mais le manifeste décrit
  une stack et un périmètre qui ne sont pas ceux du produit.
- **W7 — comptes dépendants de la donnée** : `.session-device` ×5 livré / ×1 chez moi (sessions
  navigateur) ; `td[data-timestamp]` des lignes seed ; `#tooltipNNNNNN` KO. Verdicts identiques —
  conforme à la règle « comptes indicatifs sur données démo », à tracer.

## Détails de rejeu

- Instances : vanilla :8090 (data ~/work/data-vanilla, `auth-vanilla.json`), patchée :8080
  (~/work/sabnzbd-patched, data fraîche ~/work/data-patched, `auth.json`). Boot verbatim
  `venv/bin/python SABnzbd.py -f <data>/sabnzbd.ini -s 127.0.0.1:<port> -b 0 --console --disable-file-log`.
- Seed : `node seed.mjs` → queue.slots=1, history.slots=2 (Completed+Failed, script_log + retry),
  benchserv/news.invalid.example (enable=0) — idempotent, rejoué sans doublon.
- `--wait 1200`, `--storage-state auth.json`, `--states all|none`, `--urls` verbatim du manifest.
- Mesures additionnelles de l'auditeur (hors livrable) : sonde contrastes sur les 75 nœuds incomplets
  non couverts (`~/work/tools/audit-probe-extra.mjs`), vérifs live jQuery/tooltip/aria-expanded/
  wizard-nuit (`~/work/tools/audit-live-checks.mjs`).
- `results.json` ne porte pas d'auto-verdict (mesures seules) — conforme protocole.
