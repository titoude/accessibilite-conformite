# Verdict fixer — cycle 50 : ad-aures/castopod @12720055b475d6d27c9e1e9f9053d0fa491c061c (v1.15.5)

**Fixer** : devin-2fd66a4ce3d745a299bbc3cc4a090242 · **Date** : 2026-10-08
**Base** : verdict-auditeur.md (devin-4a66e5a1, CONFIRMÉ avec réserves F1–F6)
**Mes instances** : vanilla :9150/:9151 (`castopod50-fv`), patchée :9160/:9161 (`castopod50-f`),
install-build :9180/:9181 (`castopod50-i`) — MES données, MON seed (podcast=1 episode=1
page=1 person=1, résolu par `tools/gen-urls.sh` sur la DB seedée).

## Clôture des findings

| Finding | Correction | Preuve |
|---|---|---|
| **F1** baseline scope troué, ids périmés (leçon 44/45/46) | (a) **`tools/gen-urls.sh`** — interroge la DB du seed (cp_podcasts par handle `@auditwaves`, premier épisode/page/personne), valide non-null, écrit `seed-info.json` + `urls-auth.resolved.txt` ; `seed.sh` lui délègue désormais la génération (source unique). (b) **Baseline vanilla complète** rejouée :9150. (c) manifest/results/verdicts resynchronisés. (d) erreurs nominatives via `tools/aggregate-results.mjs` (`erreurs_liste[]`). | baseline **341 occ / 14 règles** (313 auth + 28 public), **36/36 scénarios audités, 0 erreur** — vs « 235 » livré sur scope troué. Les 8 pages podcast + fediverse jamais baselinées sont couvertes : `/cp-admin/podcasts/1*` ×8 + `/cp-admin/fediverse/blocked-actors` (l'URL `/fediverse` nue redirige — URL réelle déclarée). |
| **F2** `erreurs:0` mensonger | `aggregate-results.mjs` régénère les sections baseline/final/install_build_verbatim depuis les `report.json` — comptes = rapports, `erreurs` + `erreurs_liste` nominative toujours présentes. | results.json : `erreurs:0` **vrai** cette fois (0 erreur dans les rapports commités) ; 10 erreurs de l'ancien rapport disparues par rejeu réel, pas par gomme. |
| **F3** route-404 « exclusion » jamais scannée | La 404 CI4 est **content-négociée** : `Accept: text/html` → vraie page HTML 23 Kio (`error_404.php` : h1 « 404 », « Page Not Found », « Go back ») ; le JSON vide n'est servi qu'aux clients non-HTML. Le runner refusait via la garde d'hydratation (pas de `header nav`/`main` sur la page d'erreur). Fix outillage : **`expectHttp` bypasse waitHydrated/settleEspoSession** (`skipHydration`), le setup vérifie h1 visible + corps non vide (distinction HTML vs JSON nu). | route-404 **réellement scannée** : vanilla **3 règles / 6 occ** (region×3, landmark-one-main×1, color-contrast×1), patchée **0**. Ce n'est plus une exclusion : c'est un scénario audité. |
| **F4** verify.mjs id en dur | Résolution dynamique : liste `/cp-admin/podcasts` → premier id (préférence carte « Audit Waves ») ; repli `seed-info.json` ; échec des deux → FAIL nommé, jamais d'id durcodé. | verify **20/20** sur :9160 (podcast=1) — contre 18/19 de l'auditeur sur la page morte `/podcasts/4`. |
| **F5** sondes d'incomplets sans rejeu d'états | `incomplete-probes.mjs` décode le label `… [state:nom]` du rapport et **rejoue `STATES[nom].setup`** avant de sonder ; état inconnu → N-A honnête nommé. | « sélecteur non résolu » : **177→4** ; sondes : **155 → 67 OK / 0 NC / 88 N-A** (80 texte-sur-image/scrim, 4 listbox Choices.js vide, 4 sélecteurs) — les N-A restants sont de vraies limites de mesure. |
| **F6** (nit) pnpm manifest 12.10.1 vs box 11.21.0 | — | Laissé : le build passe sous 11.21 ; dérive cosmétique consignée ici. |

## Source produit ajoutée par le fixer

`app/Views/errors/html/error_404.php` : contenu enveloppé dans `<main class="flex flex-col
items-center">` — supprime `landmark-one-main` + `region`×3 sur la page 404 (color-contrast
y était déjà couvert par la palette). Page jamais scannée avant F3 : vraie violation réelle,
cas « +sources » prévu par le mandat. patch.diff **30→31 fichiers, +145/−63**.

## Chiffres rejoués (mes instances)

| Run | Scénarios | Violations | Erreurs | Incomplets |
|---|---|---|---|---|
| baseline-auth :9150 | 25/25 | **313 occ / 11 règles** | 0 | 141 |
| baseline-public :9150 | 11/11 | **28 occ / 6 règles** | 0 | 23 |
| final-auth :9160 | 25/25 | **0** | 0 | 127 |
| final-public :9160 | 11/11 | **0** | 0 | 28 |
| install_build-auth :9180 | 25/25 | **0** | 0 | 127 |
| install_build-public :9180 | 11/11 | **0** | 0 | 28 |

Total baseline réelle : **341 occ** (auditeur estimait ~336 — les +5 = route-404 désormais
scannée, 6 occ, moins re-comptes axe). Delta baseline→final : **341→0, 14 règles**.

- **verify.mjs** : 20/20 (:9160) · **eval-final.mjs** : 10/10 (2 N-A identiques : skip-link,
  aria-live) (:9160)
- **Sabotage** : stash `themes/cp_app/podcast/episodes.php` + purge → FAIL nommé
  « 2.5.3: bouton listes — pas d'aria-label divergent du texte aria-label=More texte=2026 »
  (19/20) ; restore + purge → 20/20.
- **install-build verbatim** : clone vierge @SHA + `git apply --check` **0 rejet** sur le
  nouveau patch (sha256 `a794bcd8…`) + composer + pnpm build + boot :9180 + seed + rescan
  **0 viol/0 err/36 scénarios**.
- **Sondes** : 155 sondés → 67 OK / **0 NON-CONFORME** / 88 N-A honnêtes.

## Notes d'exécution

- Purge triple cache effectuée avant **chaque** rescan et avant/après sabotage.
- `urls-auth.txt` : `@PERSON_ID@` désormais paramétré comme les autres ids (leçon 44).
- Runner `audit.mjs` bumpé `v11-c50 → v12-c50` (marqueur du fix expectHttp dans les rapports).
- Les artefacts commités (`seed-info.json`, `urls-auth.resolved.txt`, rapports, sondes,
  results.json) proviennent tous des runs ci-dessus — cohérents entre eux (leçon 46).
