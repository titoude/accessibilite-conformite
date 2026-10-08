# Verdict fixer-v3 — cycle 40 redmine

Produit : redmine/redmine @10d61f8aea263a12ebc028dba5f0e8a373938212 (Redmine 7.0.2.devel, Rails 8.1.4 + ERB + jQuery + propshaft + sqlite). Patch v3 : `patch.diff` sha256 `e134664e17e32a951305c9380bd6d96ce65455defb65fadf255869fa21934a12` (102 fichiers, +1360/−1088), régénéré depuis l'arbre vérifié :6801, `git apply --check` OK, install-replay :6802 exécuté (clone vierge + apply 0 rejet + build + seed + rescan).

## Résidus v2 fermés

**R3 — fuite inert (prioritaire)** : `contextMenuRealTarget` sans try/finally — `jQuery.trigger('contextmenu')` (coords undefined) → TypeError dans `elementFromPoint` → inert restait levé sous menu aria-modal. Fix : garde `isFinite(clientX/Y)` (retour sûr `event.target`) + try/finally `lift→hit-test→re-inert`. Preuve live verify §13 : trigger synthétique sur `tr.hascontextmenu.eq(1)` → `threw=null`, `inert=true`, `open=true`. Sabotage v2 :6804 → `TypeError: elementFromPoint non-finite` + `inert=false open=true` (la fuite reproduite).

**R1 — clic-gauche sur l'enfant `<svg>` de `.js-contextmenu`** : la garde `target.is('a.js-contextmenu')` ratait le nœud svg (~44% de la surface de l'ancre). Fix : `resolved.closest('a.js-contextmenu')` sur la cible résolue. Preuve live : menu ouvert ligne 0 → clic glyphe d'une ligne non couverte (pick=3) → menu reciblé, `sel=3`. Sabotage v2 → `open:false sel:3` (ferme au lieu de recibler). Vanilla amont → `open:true sel:4` (parité : le délégué `.js-contextmenu` natif recible déjà — le patch restaure ce comportement).

**R2 — clic normal absorbé par inert** : fixe « down-close-up-leave » en deux temps. (a) `pointerover` hors menu lève inert — menu ouvert — car Chrome fixe la cible mousedown au hit-test du pointerdown et ne re-hit-teste plus avant la fin de la press (le click va à l'ancêtre commun des cibles press = BODY) : inert doit être levé AVANT la press, le survol est le seul signal pré-presse fiable. (b) `pointerdown`/`mousedown` hors menu → `contextMenuHide` (down-close), le reste du geste se dispatche nativement (up-leave). Fallback mousedown pour moteurs sans pointer events (parité v2, dégradation sans crash). Preuve dédiée : menu ouvert → clic `td.subject a` → v2 :6804 `navigated:false` (clic absorbé), vanilla :6803 `/issues/11` ✓, v3 :6801 `/issues/11` ✓ — parité amont restaurée.

**W-v2-4 — `a.lost_password`** : `a.lost_password{display:inline-block;min-height:24px;line-height:24px}` global — couvre `#sudo-form` (gate sudo, modal + page) là où la règle `#login-form` ne s'appliquait pas. eval-final durci : sonde A2 conditionnelle `#sudo-form a.lost_password` + pin déterministe section D `/login` → h=24 (fin de la flakiness selon fenêtre sudo ; le gate est documenté dans eval).

**W-v2-5 — 27 `th` sans `scope`** : toutes les vues `app/views/help/wiki_syntax/**` scopées — 71 `scope="col"` (en-têtes d'échantillons/lexers), 194 `scope="colgroup"` (séparateurs `colspan`), 301 `scope="row"` (en-têtes de lignes). Verify §13 : `/help/wiki_syntax` → 0 non scopé. Sabotage v2 → `missing:27`.

## Chiffres (rejeu exécuté, pas recopiés)

- Scan final :6801 : auth **0 viol/0 err** 37 scénarios (142 incomplets), public **0 viol/0 err** 18 scénarios (58 incomplets), axe-core 4.14.0.
- verify.mjs : **52 PASS / 0 FAIL** (:6801) ; install :6802 → **52 PASS / 0 FAIL**.
- incomplete-probes : **115 PASS / 27 N-A / 0 FAIL** (n=142).
- eval-final : **0 FAIL** (25 sondes, lost_password h=24 déterministe sur /login).
- Install-replay :6802 : rescan **0 viol/0 err** auth+public + eval **0 FAIL** + verify 52/0.
- Sabotage v2 :6804 : verify **47 PASS / 5 FAIL** — R3/R1/W-v2-4/W-v2-5 mordent ; R2 via sonde dédiée (la chaîne R1→R2 dégénère quand R1 ferme le menu).

## Registre des outils modifiés

`tools/verify.mjs` §13 (R3/R1/R2/W probes), `tools/eval-final.mjs` (A2 sudo + pin D /login), `tools/auth*.json` éphémères. patch.diff + sidecar `patch.diff.sha256` régénérés depuis l'arbre vérifié. provenance.json re-hachée EN DERNIER (`rehash-provenance.py --strict`).
