# Verdict auditeur — cycle 38 wallabag

**VERDICT : CONFIRMED** (reproductibilité axe + santé du patch — jamais un claim de conformité WCAG)

Auditeur : session indépendante, ports **:6380** (vanilla→patché) et **:6382** (install-build), base sqlite propre à l'auditeur. Zéro confiance : tout rejoué, comparé nœud-par-nœud aux rapports livrés. Commit worker audité : `3a7d4a0` sur `devin/boucle-continue`.

## Tableau de rejeu

| # | Item | Livré | Rejeu auditeur | Conforme |
|---|---|---|---|---|
| 1 | `git apply --check` + sidecar | 49 fichiers, 0 rejet | 0 rejet (×2 clones @`496db5b`), sha256 `c0284a11…9a1` conforme au sidecar | oui |
| 2 | baseline + final 36+2 scénarios | 1126 occ / 12 règles / 0 err / 173 inc auth + 15/8/2 public → 0/0/45+2 | **bit-identique** : 1126/12/0/173 + 15/8/2, 0 page divergente nœud-par-nœud ; final 0/0/45 + 0/0/2, les 47 incomplets sélecteur-identiques | oui |
| 3 | 11 états / stateProofs | tous PASS | les 11 rejoués : scans produits, aucune erreur de proof ; sélecteurs déterministes (`data-target`, `data-action`, ids stables, restore symétrique dark-theme + cookie `theme`) | oui |
| 4 | sondes incomplets | 37 cc PASS + 4 litb PASS + 4 N-A auth, 2 N-A public | rejoué sur MON report : verdicts identiques, 0 divergent ; ratio min 4.89 | oui |
| 5 | verify.mjs | 29/29 | 29/29 PASS ; contrastes composite alpha (fg ET bg, leçons 31/35) revérifiés par les sondes (effectiveBg jusqu'à opaque) + mesures manuelles | oui |
| 6 | install-build | 0 viol/45+2 inc | clone vierge + apply + composer + yarn --frozen-lockfile + build:prod + `wallabag:install --env=prod` + seed + login + rescan verbatim : **0/0/45 + 0/0/2, nœud-identique** | oui |
| 7 | eval-final + provenance + REGISTRE | 26 assertions 0 FAIL, 40/40 | 26/26 rejoué 0 FAIL ; provenance re-hash strict **40/40 frais** ; ligne 38 présente | oui |
| 8 | chasse | — | voir § Chasse | — |

## N-A audités (pas des PASS déguisés)

Les 4 N-A auth (`#tagging_rule_rule`, `#tagging_rule_tags`, `.btn > span`, `.file-path` sur l'onglet /config « règles ») rapportés « cachés » : rouvert l'onglet set5 en vrai état et mesuré les computed colors — **21.00 / 21.00 / 5.32 / 21.00**, tous ≥ 4.5. N-A honnêtes.

## Chasse

- **W1 — Couverture : 3 templates patchés hors de toute évidence.** `templates/Import/Chrome`, `Shaarli`, `PocketHtml` sont modifiés par le patch mais absents du scope (25 urls) ET des 16 pages EXTRA de l'eval. Je les ai sondés moi-même (axe full tags) : **0 viol / 0 inc chacun** — trou d'évidence, pas de violation. Le patch déborde la preuve ; écart documenté.
- **W2 — Triggers Materialize sans ARIA d'état.** Les `<a data-target>` sidenav (slide-out, filters, export) et le dropdown `#news_menu` n'ont ni `aria-expanded`, ni `aria-controls`, ni `aria-haspopup`. Pas de règle axe violée (best-practice APG), gap amont Materialize non corrigé par le patch — résidu qualitatif.
- **W3 — Wiring select Materialize vérifié de visu.** Le patch pose `aria-labelledby` sur le select natif (contrôleur `materialize--form-select`) ; Materialize étiquette son input généré par `<label for="m_select-input-…">` — les deux extrémités couvertes, axe propre.
- **W4 — lcnm / WCAG 2.5.3 (leçon 36).** axe 4.14.0 (wcag21a → `label-content-name-mismatch` actif) : 0 viol partout, + sonde dédiée `/unread` + `/config` → 0 viol. Les `aria-label` des liens-image de cartes portent le titre complet sans texte visible → critère non applicable par design ; aucun label patché ne contredit un texte visible.
- **W5 — scopeHash/statesHash incluent baseUrl.** Mes hashs (:6380/:6382) diffèrent nécessairement des livrés (:8038/:8039) — sémantique par design, comparabilité par champs uniquement. Constat, pas un défaut.
- **W6 — Boot prod impossible sur vanilla sans le fix Sentry** (`config_prod.yml` `dsn` invalide → `wallabag:install --env=prod` crashe). Bug amont que le patch corrige (`dsn: ""`) : vérifié en vrai — l'IB patchée installe prod proprement. Mon baseline a donc été mesuré sur vanilla + cette seule ligne (install `--env=dev` sur la même sqlite puis service prod) — résultat **bit-identique** au livré malgré tout.
- **W7 — Benignes.** `composer install` post-cmd `cache:clear` exit 1 dans le conteneur (deps OK) ; aucune `.modal` Materialize dans le périmètre rendu (sidénav/dropdown couverts, modales absentes des routes scannées) ; `/site-credentials` 404 pour le seed user (voter amont, exclusion documentée et vérifiée).

## Chiffres auditeur

baseline :6380 **1126 occ / 12 règles / 0 err / 173 inc** (36 sc.) + public **15 / 8 / 0 / 2** — final :6380 **0 / 0 / 0 / 45** + **0 / 0 / 0 / 2** — install-build :6382 **0 / 0 / 0 / 45** + **0 / 0 / 0 / 2** — sondes **37+4 PASS, 4+2 N-A, 0 FAIL** — verify **29/29** — eval **26/26** — provenance **40/40 strict**.
