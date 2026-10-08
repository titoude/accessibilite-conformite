# Verdict auditeur — cycle 43 TryGhost/Ghost @a327c539f866

**Verdict : CONFIRMED** — rejeu indépendant complet, zéro confiance (auditeur :
devin-564121644839492b8350303d5eadd6ca, 2026-10-08). Deux instances construites
par mes soins : `:7430` (vanilla même SHA + submodules casper@a3f4914 /
source@9d3414e) et `:7431` (patch appliqué + `nx run @tryghost/admin:build` +
4 bind mounts) ; données refaites (`tools/seed.mjs` + corrections manuelles
pour reproduire la baseline), auth `auth-v.json`/`auth-p.json` propres. Le trou
« install-build non rejoué » du worker est **refermé ici** : la procédure
documentée est rejouable (avec un wart de commande, W1).

## Rejeu point par point

| Claim worker | Rejeu auditeur |
|---|---|
| clone @`a327c539`, patch 41 fichiers, sha256 sidecar | **confirmé** : sha256 patch.diff = `431bf41d…b5a63` conforme ; 41 diffs (35 racine + 6 `.hbs` sous-module `source`) ; **mais** `git apply patch.diff` verbatim **échoue** sur les 6 hunks thème (chemins relatifs au sous-module, apply atomique → 0 fichier appliqué) — application en 2 passes obligatoire (voir W1) |
| mount sert réellement le code patché | **confirmé** : `docker inspect` = 4 bind mounts de répertoires (`built/admin`, `built/embed-renderer`, casper, source) ; `:7431` sert `viewport-fit=cover` déverrouillé, `:7430` sert `user-scalable=no, maximum-scale=1` — les deux arbres sont bien servis |
| final public 0 viol / 68 inc | **confirmé à l'identique** : 0 violation, 0 erreur, 68 incomplets |
| final admin 96 occ / 16 règles | **reproduit à +2 près** : mon rescan → **98 occ / mêmes 16 règles** ; l'écart = bruit d'état (thème dark/light persistant entre états séquentiels + kbd sur fond translucide) |
| baseline public 73 occ / 7 règles | **reproduite nœud-par-nœud** : 72 + 1 heading-order (seed convertit le h3 about — réinjecté via Admin API pour retrouver la 73e) |
| baseline admin 297 occ / 24 règles / 0 err | **non reproduite — sous-estimée** : mon vanilla réel = **~426 occ / 24 règles** (376 + 50 sur les 3 états que leurs sélecteurs post-patch ne peuvent ouvrir sur vanilla). Écart concentré : `color-contrast` sur `muted-foreground` gray-700 (~+10-12/page). La baseline worker a été mesurée sur une dist portant déjà le fix de tokens — erreur **conservatrice** (sous-estime l'amont, n'arrange pas le bilan). Vraie trajectoire : ~426 → 98 |
| résidu ⊆ vanilla (zéro introduite) | **confirmé nœud-par-nœud** : 90/98 strict-match + 8 mêmes url+règle (sérialisation `dark`/accent) ; règles finales (16) ⊆ règles vanilla (24) — **aucune règle introduite** ; `label-content-name-mismatch` (WCAG 2.5.3) présent en vanilla → **éliminé** par le patch |
| distribution résiduelle honnête | **confirmée** : color-contrast 20 (kbd `Ctrl+K` sur bouton à fond translucide 30% alpha — échec réel mesuré `oklch(0.867)`/`oklab(0.368/0.3)`, text-gray-700 littéral staff), listitem 30 + list 12 (markup shadcn `data-sidebar="menu"` amont), nested-interactive 6 (dropzones + inputs Ember tag/author), aria-hidden-focus 4 (modales Radix), heading-order 3, page-has-heading-one 4, target-size/tabindex 2+2. Échantillon 5 sites : **5/5 nœuds amont exacts** |
| fixes rapides ratés ? | **un, mineur** : `text-gray-700` **littéral** subsiste sur `/settings/staff` (~3 occ) — le patch corrige les tokens `--muted-foreground`/`--text-secondary` mais pas ce literal ; surface faible, non bloquant |
| pièges stack documentés | **confirmés + un manquant** : restart docker post-build = réel (mount sur inode de répertoire + `assembleAdminAssets` rm/recrée `built/admin`) ; nx cache réel (19/19 + 7/7 hits Nx Cloud sur mon clone vierge — dist livrée vérifiée patchée : viewport + gray-800 dans `index-Bp9U2CF3.css`) ; les 2 `index.html` (Ember shell + React vite) patchés et reflétés dans `built/admin/index.html`. **Manquant à la doc : Ghost compile les `.hbs` en mémoire — toute modif de thème exige `docker restart`** (constaté en direct : fichier conteneur modifié, page servie en cache) |
| verify.mjs 25/25 | **rejoué : 25/25 OK** sur :7431 |
| eval-final.mjs 6/6 | **rejoué : 6/6 OK** (3 N-A : modale search sans bouton dédié, skip-link absent produit, motion via CSS) |
| sondes 119 → 86P/1NC/36NR | **rejoué : 112 sondes → 79 conformes / 1 NON-CONFORME / 35 non-retrouvées** ; 5 états en timeout sur mes données (titres de posts seed différents) ; **la NC est reproduite** : `aria-hidden-focus` sur `#root` en `admin-mobile-nav-390` — 18 focusables dans une région aria-hidden sans modale |
| sabotage détecté ? | **oui, double couche** : suppression de `aria-label="{{name}}"` (lien auteur icône, post.hbs:30) → verify.mjs **24/25 FAIL `post: liens auteur nommés`** + axe **`link-name` 1 occ** — la chaîne de détection fonctionne |
| install-build non rejoué | **comblé par moi** : clone vierge @SHA → corepack pnpm i --frozen-lockfile → apply 2 passes → nx build (cache-hit) → 4 mounts → restart → seed → audits. **Rejouable**, unique écart = la commande apply verbatim (W1) |
| provenance --strict 31/31 | **échoue sur checkout propre** : `tools/auth.json` listé mais gitignoré (`auth*.json`) → 30/31 vérifiables ; entrée retirée + re-hash complet au commit auditeur (verdict + probes + seed-info inclus) |
| hors-scope + 2.5.3 | **propre** : UMD portal/comments/sodo-search/signup **non touchés** par le patch (hors-scope réel) ; `global-search-modal.tsx` modifié = recherche **admin** (dans périmètre) ; aucune violation introduite, 2.5.3 éliminé |

## Warts outillage (à corriger cycle 44+)

- **W1** — `git apply patch.diff` verbatim **inopérant** : les 6 hunks thème sont relatifs au sous-module `ghost/core/content/themes/source`. Fix doc : `git apply --include='apps/*' --include='ghost/*' patch.diff` + `git -C <theme> apply -p1 --include=… patch.diff`.
- **W2** — `audit.mjs` : 3 états (user-menu, appearance, dark-mode) attendent `button[data-sidebar="menu-button"]:has(.sr-only)` — élément **post-patch** → baseline vanilla rejoue ces états en erreur (3 errors déterministes). Sélecteurs baseline-compatibles nécessaires.
- **W3** — `seed.mjs` crash `ReferenceError: log` ligne 108 (exit 1) **après** écriture des données — non fatal mais trompeur.
- **W4** — baseline admin worker sous-comptée (297 vs ~426 réel) : mesurée sur dist déjà partiellement patchée (token gray-800). Direction conservatrice — pas une falsification, mais la baseline chiffrée n'est pas la vanilla réelle.
- **W5** — `provenance.json` inclut `tools/auth.json` (gitignoré) → `--strict` impossible hors poste worker. Entrée retirée au re-hash.
- **W6** — doc des pièges incomplète : le restart-obligatoire vaut aussi pour les `.hbs` du thème (templates compilés en mémoire), pas seulement pour `built/admin`.
- **W7** — fix rapide raté : `text-gray-700` littéral (`/settings/staff`) échappe au fix par token.
- **W8** — sondes : 5 états dépendent de titres de posts seedés (`has-text("Refonte du portail membres")`) — fragiles à tout seed parallèle.

## Conclusion

**CONFIRMED.** Les chiffres de sortie se reproduisent (final admin ~96-98/16,
public 0/68inc), le résidu est authentiquement amont (0 violation introduite,
2.5.3 éliminé), la détection de sabotage fonctionne aux deux couches
(assertions + axe), et le gap install-build est refermé par rejeu complet.
Le seul vrai écart mesuré — baseline 297 sous-évaluée (~426 réel) — est
conservateur et documenté (W4) ; il amplifie, il ne fabrique pas, le progrès.
Warts W1-W8 à reprendre au fixer ; aucun n'invalide le résultat.
