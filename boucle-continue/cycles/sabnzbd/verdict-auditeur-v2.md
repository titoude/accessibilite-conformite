# Verdict auditeur v2 — cycle 25 sabnzbd/sabnzbd @a3737b9

**Verdict : CONFIRMED** — ré-audit indépendant complet après correctifs W1/W2 (commit 3bce3e4).
Auditeur : devin-42e710f6 (2026-10-05). Score axe reproductible, patch désormais sain.

Le patch v1 (f87617ff) était PARTIAL : sélecteurs jQuery cassés dans `config_rss.tmpl`
(SyntaxError tuant tout le bloc `ready` — testFeed/cleanFeed/evalFeed/delFilter/table-sort morts)
et couleurs `.success`/`.failed` sous la barre en nuit wizard. Le patch v2 (e7871924) corrige les
deux défauts **vérifiés en live**, et tout le reste du rejeu v1 se confirme inchangé.

## Rejeu effectué

Clone propre `sabnzbd/sabnzbd` @ `a3737b9b892e84b4cac1d80096c7539f7ec7092a` (~/work/sabnzbd-audit),
`git apply patch.diff` → **29 fichiers, 0 rejet** (sha256 réel `e7871924…bef51` = provenance.json).
Instance patchée :8080 — venv fraîche (`pip -r requirements.txt`, 47 paquets), data neuf
~/work/data-v2, boot verbatim `venv/bin/python SABnzbd.py -f <data>/sabnzbd.ini -s 127.0.0.1:8080
-b 0 --console --disable-file-log`, seed (`queue.slots=1 history.slots=2`), restart, login
(`auth.json`). Commandes `manifest.auditCommands` verbatim. Node v24.19.0, playwright+axe
depuis ~/audit-tools.

## W1 — sélecteurs jQuery : RÉSOLU (vérifié live, pas seulement au grep)

- Arbre appliqué : **0 occurrence** de `\[name="…" aria-label` dans `interfaces/` (grep exhaustif
  tmpl+html+js). `config_rss.tmpl` L599-603 réverté aux sélecteurs d'origine
  `select[name="filter_type"]` / `select:not([name="filter_type"])` ; les `aria-label="$T('rss-type')"`
  subsistent sur les `<select>` HTML (L147/220/296 — vérifié rendu : `aria-label="Type"` ×2).
- Live : `/config/rss` + `/config/rss?feed=benchmark-feed` → **0 pageerror**, fini le SyntaxError
  du v1. Le seul console.error est `invalid.example/favicon.ico` (hôte volontairement NXDOMAIN
  du seed) — bruit environnemental, préexistant.
- Clics réels : `.testFeed` → POST `test_rss_feed` observé + `setActiveIcon` (glyphicon-transfer,
  bouton disabled) ; `.delFilter` → submit `del_rss_filter` observé ; le handler `change` de
  `filter_type` (post-L598) (dés)active bien les 3 autres selects (`A`→0 disabled, `C`→3 disabled).
- N-A structurel : tables `rss-tab-matched/not-matched/done` et `.disabled_options_rule` absents
  avec un flux injoignable (feed.invalid.example) — le code `if (…table.length)` les garde ;
  la mort du bloc ready est réfutée par les handlers ci-dessus, tous situés APRÈS l'ancienne
  ligne fatale.

## W2 — couleurs wizard nuit : RÉSOLU (mesuré sur surfaces réelles)

`html[data-color-scheme]` forcé light/night, computed style + pile de fonds compositée :

| Surface | Classe | Clair | Nuit |
|---|---|---|---|
| `/wizard/two` `h2.success` réel (dans `#inner`) | `.success` | 5.51 (#FFF) | **7.54** (#303030) |
| `/wizard/one` `#serverResponse` (well/surface-alt) | `.success` | 5.06 (#F5F5F5) | **5.56** (#444) |
| `/wizard/one` `#serverResponse` | `.failed` | 5.40 (#F5F5F5) | **4.76** (#444) |

Toutes ≥4.5. Mesures identiques aux valeurs documentées dans `results.json`
(`5.51/7.54/5.56` et `5.89/6.45/4.76/10.27` — re-calcul WCAG conforme).

## Rejeu complet (hors W1/W2)

| Claim | Rejeu v2 |
|---|---|
| `git apply` | 0 rejet, 29 fichiers, sha256 `e7871924…` |
| Grep anti-W1 | 0 sélecteur cassé ; pas d'autre `aria-label` injecté dans des chaînes JS |
| Rescan final 48 scénarios (16 urls + 31 états + login) | **0 violation / 0 erreur / 218 incomplets**, 47/47 pages + login 0 — **nœud-pour-nœud identique** au rapport livré à 1 sélecteur près (`.session-device` vs `tr:nth-child(1)>.session-device`, même nœud, donnée dépendante — wart W7) |
| scopeHash `e97861748e26…` | recomputé identique sur mon rapport |
| statesHash `5fbb42e9…` | inchangé (`tools/audit.mjs` bit-identique, provenance vérifiée) |
| verify.mjs | **55/55 PASS** rejoué |
| eval-final.mjs | **0 échec** (10 PASS : scriptlog N-A, erreur réelle, filebrowser, nzbsearch, thème sombre ×2, aria-expanded navbar null, logout 302, login clean) |
| Sondes incomplets | **49 PASS / 7 N-A / 0 FAIL** sur 56 — verbatim du rejeu v1 ; delta 56↔60 livré = `.session-device` ×1 vs ×5 (sessions navigateur, données) ; 0 verdict divergent, 0 ratio >0.15 |
| Ordre des outils | sondes exécutées AVANT eval-final (POST /logout tue auth.json — piège W4 esquivé) |
| Chasse au masquage | propre : les `display:none` du diff sont des comportements amont (knockout `visible:` sur #feedback-slider, hover-reveal du ×) ; 0 suppression DOM, 0 aria-hidden ajouté |

## Wart corrigé par l'auditeur (précédent searxng v3)

- **`patch.diff.sha256` périmé** : resté au hash v1 `f87617ff…` alors que `patch.diff` = `e7871924…`
  en 3bce3e4 (provenance.json était correcte, elle). Fichier régénéré au hash réel et
  `provenance.json["patch.diff.sha256"]` re-haché en conséquence → provenance 34/34 OK,
  auto-cohérente. Documenté ici, même défaut de procédé que « hash de la version parente ».

## Héritage du v1 (inchangé, pas re-faulté)

Warts W3-W7 du verdict v1 persistent (sondes = échantillon 139/218, ordre eval→sondes,
assertions verify laxistes ×2, manifest CherryPy/Plush, comptes data-dépendants) — ce sont des
défauts de harnais/documentation, déjà tracés ; ils ne remettent pas en cause le score.

## Conclusion

CONFIRMED : le score 1490→0 (axe, 48 scénarios) est reproduit à l'identique sur un clone
indépendant patché à partir des seuls artefacts livrés ; W1 et W2 sont corrigés et vérifiés en
live ; le patch v2 est sain (pas de masquage, pas de régression fonctionnelle résiduelle mesurée).
Le seul écart restant était un artefact de checksum périmé, corrigé au rejeu.
