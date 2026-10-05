# Mesures clavier F5 — v2 (fixes) vs v1 (patch audité) vs vanilla

Méthode : vrai clavier Playwright (`page.keyboard`) + `.focus()` DOM réel, instances
live :3400 (vanilla @99053ce), :3401 (patch v2 appliqué+rebuildé).
v1 = mesures de l'auditeur (verdict-auditeur.md) — reproduction interdite ici puisque
le binaire v1 n'existe plus (arbre patché passé en v2).

## Navbar user-menu (`.dropdown:has(.user-menu)` — menu-button)

| Action | vanilla :3400 | patch v1 (auditeur) | patch v2 :3401 |
|---|---|---|---|
| focus | ouvre le menu (showOnFocus) | rien (focus interne invisible pour fomantic) | focus sur `SPAN.text`, menu fermé |
| Enter menu fermé | toggle (ferme après focus-open) | **rien** | **ouvre** + `aria-expanded=true` |
| Espace menu fermé | toggle/ferme | rien | **ouvre** |
| ArrowDown menu fermé | ouvre (keydown fomantic) | rien | **ouvre** |
| flèches menu ouvert | navigue `.item.selected` | n/a (jamais ouvert) | navigue `.item.selected` ✓ |
| Escape menu ouvert | ferme, focus reste racine | n/a | ferme + **focus restauré sur trigger** |

## Sidebar combo labels (`.issue-sidebar-combo:has(input[name=label_ids]) .ui.dropdown`)

| Action | vanilla :3400 | patch v1 (auditeur) | patch v2 :3401 |
|---|---|---|---|
| Enter menu fermé | menu déjà ouvert (focus) puis **clique `.item.selected` = « Clear labels » → label_ids `1`→`""`, focus → BODY** | clique `.item.selected` = « Clear labels », focus → BODY | **ouvre**, focus entre dans `input.search` (comme vanilla), `label_ids` inchangé `1`→`1` |
| ArrowDown menu fermé | (menu déjà ouvert) | rien | ouvre |
| flèches menu ouvert | navigue | n/a | navigue (`.item.selected` = « bug ») |
| Escape menu ouvert | ferme, focus → BODY | n/a | ferme + **focus restauré sur `a.fixed-text.muted`** |

## Constat notable (honnêteté)

Le clic destructif « Clear labels » sur Enter **existe aussi en vanilla amont**
(mesuré :3400 : `label_ids` vidé `1`→`""`, focus perdu sur BODY). La régression v1
était pire (menu jamais ouvert + même destructivité) ; v2 livre le contrat APG
menu-button **et** neutralise la voie destructive amont : l'activation d'item ne se
produit plus que sur menu ouvert (intention « activer », pas « ouvrir »).

Assertions équivalentes intégrées à `tools/verify.mjs` (section 3b, 7 assertions) —
rejouées sur :3401 : 58/58 OK.
