# Cycle 46 — verdict worker (metabase/metabase)

- **SHA** : `811914645ddf9c92e997914ddb9ca3d9e148abed` (HEAD au moment du pin)
- **Boot** : image `metabase/metabase:v0.64.1.x` (v0.64.1.1) + frontend rebuildé du SHA pinné, monté via classpath `-cp /patched:/app/metabase.jar` (io/resource précède le jar). Écart backend honnête : le jar = v0.64.1.1, le frontend servi = SHA exact.
- **Baseline** : 20 règles uniques / 147 (règle×page) / **400 occurrences**, 0 erreur
- **Final** : **0 violation / 0 erreur** sur admin (15 URLs), public (2), states (8 états)
- **Install-build verbatim** : clone vierge → `git apply` (OK, 1 warning whitespace l.227) → build → boot :7603 → **0/0/0**
- **Gates** : verify 16/16 · eval-final 8/8 · probes 0 non conformes · type-check 0 erreur dans les fichiers édités
- **Patch** : 72 fichiers, +612/−211, `patch.diff` + sha256 sidecar, `git apply --check` OK
- **Verdict** : à l'auditeur.

## Pièges rencontrés (pour leçons futures)
- Mantine v8 clone aria-haspopup/expanded sur la cible quel que soit son rôle → observer bootstrap `cleanTargetAria`.
- dnd-kit sortable `role=button` + cellules interactives → nested-interactive ; restructuration : popover à l'intérieur du wrapper, `role=group` sur la ligne.
- kbar `li[role=option]` : aucun descendant interactif toléré (même tabindex −1) → contenu neutre + onAuxClick.
- shadow-cljs exige JDK 21 (box = 17) → cljs_release copié du même SHA (patch = 0 fichier cljs).
- Copie H2 ≠ état setup → rejouer `/api/setup` + seed verbatim.
- aria-label ≠ texte visible → label-content-name-mismatch ("Metabase Admin" ≠ "Metabase administration").
