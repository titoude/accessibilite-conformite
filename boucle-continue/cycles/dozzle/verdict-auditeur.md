# Verdict auditeur indépendant — cycle 9 : amir20/dozzle @ b99f7f4

**Verdict : CONFIRMED** (score axe reproductible + patch sain)

Auditeur : session Devin cfaa8d51 (cycle boucle-continue, branche `devin/boucle-continue`)
Date : 2026-10-04 · Méthode : rejeu intégral des preuves sur machine propre, outils du cycle non modifiés sauf IDs conteneur docker (propres à l'hôte, comme le cycle l'avait fait).

## Ce que j'ai rejoué moi-même

| Étape | Résultat |
|---|---|
| sha256 patch.diff | OK — `c9c995a0…667b` conforme à patch.diff.sha256 |
| `git apply` sur clone propre @ b99f7f4 | OK (124 fichiers, +651/−405) |
| `bun install --frozen-lockfile` | PASS — 675 paquets (= install-build.json) |
| `bun run build` | PASS — 1531 modules, brotli 520 fichiers (= install-build.json) |
| Certificats via règles Makefile (`make shared_key.pem shared_cert.pem`) | PASS (Ed25519 + x509 auto-signé) |
| `go build -o dozzle .` | PASS (go1.27.1) |
| `./dozzle --addr :8083 --auth-provider simple --enable-actions --disable-setup-wizard` + `generate admin` | PASS — docker connecté, users.yml bcrypt |
| Seed 2 alpine (`a11y-web`=`e9ea7f3c9537`, `a11y-db`=`569371566bf2`) | PASS |
| `login.mjs` → auth.json (vrai formulaire, cookie jwt) | PASS |
| `audit.mjs` (9 scénarios, storageState) | **0 règle / 0 occurrence / 0 erreur** — conforme à final/report.json |
| `audit.mjs` /login (states none) | **0 / 0 / 0** — conforme à final/login/report.json |
| `verify.mjs` | **11/11 PASS** |
| `eval-final.mjs` | **6/6 PASS** |
| Re-hachage vs provenance.json | **33/33 fichiers conformes**, 0 manquant, 0 différent |
| **Baseline rejouée sur build NON patché (:8085)** | **8 règles / 189 occ** — dont 6 règles sur la vraie route `/container/e9ea7f3c9537` |

## Vérifications manuelles (sonde indépendante, hors outils du cycle)

- **Drag pointeur splitter nav** : 199.5→292.5px puis retour 227.5px — natif, les deux sens. ✅
- **Resize clavier** : splitter focusable (tabindex=0), ArrowRight élargit (+63px ≈ pas 5%), ArrowLeft réduit ; `aria-valuenow` suit 18→23→18. ✅
- **Landmarks** : splitter nav réellement DANS `<aside>` ; splitter interne DANS `[role=complementary]` labellisé `« Pinned log: a11y-db »`. ✅
- **Drag splitter interne** (pinned pane) : pane 519→581px. ✅
- `lang="en"` présent dans le HTML servi ; `/login` sous layout `splash` a bien un `<main>`. ✅
- Claims du commit : « routes par ID », « splitters reparentés dans landmarks, drag natif conservé », « h1 sr-only par page », « fallback CSP injectAxe » — tous vérifiés dans le code et en runtime.

## Patch sain — lecture intégrale (4103 lignes)

Aucune triche trouvée : pas de `display:none` ajouté pour masquer du contenu scanné, pas de suppression de fonctionnalité, pas d'aria décoratif déconnecté (les valeurs splitter sont synchronisées au DOM réel par ResizeObserver ; le resize clavier est l'implémentation native splitpanes `keyboardStep`, pas un shim). Composition : ~85 % de bumps d'opacité `text-base-content/{20–70}`→`/80` (contrastes réels), correctifs sémantiques (`<main>` dédupliqué dans ScrollableView, `role=main` sur le pane router-view, `<main>` splash, `<li>` dans `<ul>` skeleton, `lang`, `alt`), aria sur boutons-icônes réels, `role=complementary` + labels sur panes épinglés, 5–8 clés i18n ajoutées ×16 locales réellement traduites.

## Findings

1. **[minor] `aria-valuenow` du splitter interne sur mauvais dénominateur.** `setupSplitters` calcule `prev.width / outerSplitpanes.width` avec `outer = root.querySelector('.splitpanes')` (le plus externe). Pour le splitter des panes épinglés, le dénominateur devrait être son splitpanes parent (~1037px, pas 1265px) : mesuré `valuenow=36` pour une position réelle ~44 %. Valeur dynamique et cohérente en tendance, mais sémantiquement imprécise. → Dénominateur : `prev.closest('.splitpanes')`.
2. **[minor] `aria-valuemin/max="10/90"` codés en dur sur les deux splitters.** La nav est bornée à `min-size=10` et `onResized` clamp `menuWidth ≤ 50` — un AT lit max 90 inaccessible ; les panes épinglés n'ont pas de min déclaré. → Bornes par splitter issues des props réelles.
3. **[minor] `lang="en"` statique.** Satisfait `html-has-lang`, mais ne suit pas la locale active (16 locales i18n). → Lier `<html lang>` à la locale vue-i18n.
4. **[minor] La passe globale `/80` supprime des affordances.** `text-base-content/80 hover:text-base-content/80` = hover mort (Search.vue drag-handle, ChatSteps.vue, ContainerTitle.vue) ; `placeholder:/80` ≈ texte saisi ; états `disabled`/idle/obsolète désormais quasi identiques aux actifs (StepModal, IOCard, CalendarRange out-of-month). Non masquant — régression cosmétique. → Conserver `/60` pour les états inactifs non-textuels, hover `/100`.
5. **[info] `useMutationObserver(shell, setupSplitters, {subtree:true})`** re-scan les splitters à chaque batch de mutations du flux de logs (churn DOM continu). Coût faible mais permanent. → Observer le conteneur splitpanes seul.
6. **[info] Libellés aria des splitters figés** à la langue du montage (switch de langue ultérieur non propagé).
7. **[info, pas un finding] Baseline sous-comptait la page conteneur.** Routes par nom → NotFound 200 dans la baseline (5 pages/162 occ) ; la vraie route par ID n'y était pas. Documenté honnêtement dans scope-compare.json ; scan7 mid-cycle (routes réelles) : 6 règles/217 occ. Mon replay vanilla confirme la vraie route violait (6 règles). Le « 162→0 » affiché est conservateur — le vrai delta est ~217→0.
8. **[info] Incomplets non comparables inter-hôtes** : 553 (cycle) vs 159 (mon run) — `elmPartiallyObscured` varie avec le volume de lignes de logs rendues. Hors score.
9. **[info] scopeHash/statesHash intrinsèquement hôte-dépendants** : ils embarquent les IDs docker des conteneurs (cycle : `0b8bb5aa3e7f` ; moi : `e9ea7f3c9537`). Périmètre fonctionnel identique à un ID près — c'est la seule adaptation faite aux outils (byte-identique sinon, vérifié par diff inverse).

## Conclusion

Le score « 0 violation axe sur 9 scénarios + login » est **reproductible** : je l'ai obtenu en rejouant les commandes du manifest avec les outils du cycle (identiques hors IDs conteneur). La baseline est **indépendamment confirmée** (build vanilla → 8 règles/189 occ, y compris sur la vraie route conteneur). Le patch est **sain** : corrections réelles de contrastes/landmarks/ARIA, drag et resize clavier fonctionnels, rien de masqué. `verify.mjs` 11/11 et `eval-final.mjs` 6/6 rejoués. 33/33 fichiers intègres.

**CONFIRMED.** Les findings sont des défauts mineurs du correctif lui-même (aria-valuenow approximé, bornes figées, lang statique, affordances émoussées) — à signaler en notes pour un éventuel upstream, pas bloquants pour le verdict.
