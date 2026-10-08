# Verdict auditeur — cycle 41 jellyfin/jellyfin-web @1e507c58 (12.2.0)

**Verdict : CONFIRMED** — rejeu indépendant complet, zéro confiance (auditeur :
devin-4e3aa5d5, 2026-10-08). Trois instances propres construites par mes soins :
`:6711` (clone @SHA + patch appliqué par moi, `npm ci`-équivalent + build:production,
docker jellyfin/jellyfin:latest + dist bind-mount :ro), `:6712` (clone vierge
vanilla @SHA, même procédure — baseline), `:6713` (install-build : clone vierge
@SHA + `git apply` + build + rescan verbatim). Seed `tools/seed.sh` rejoué ×3 —
ids items déterministes identiques au worker (JF_MOVIE_ID 4df79bd2…), seuls
JF_USER_ID/JF_TOKEN/JF_SERVER_ID varient par instance comme attendu.

## Rejeu point par point

| Claim worker | Rejeu auditeur |
|---|---|
| patch sha256 `a12d51df…` sidecar, 59 fichiers +473/−144 | **sha256 confirmé à l'octet près** (mon hash = sidecar) ; `git apply --check` 0 rejet sur clone vierge @`1e507c58`. **Stats fausses** : réel = **60 fichiers +478/−147** (le patch a grossi après le fix IB, docs non réalignés) — W1 |
| baseline 763 auth + 4 public | **confirmé à la règle près** : vanilla :6712 → **769 occ auth / 16 règles** (15 règles identiques occurrence-pour-occurrence ; `color-contrast 8 vs 2` = +6 nœuds `defaultCardBackground2/3` — le défaut « Active Sessions » révélé en IB, dépendant du nb de sessions live pendant le scan ; mes 2+ sessions vs la sienne) + **public 4 occ / 2 règles identiques** (link-name×2, meta-viewport×2). Nœud-par-nœud : 1105/1106 livrés reproduits, deltas = nb de cartes session + user-id |
| final 76 scénarios : 0 viol / 0 err / 319 inc | **confirmé** : rescan :6711 = **0 viol / 0 err / 322 inc** (76 scénarios). Nœud-par-nœud : 314 communs, 5 livrés absents + 8 miens — tous aléa : user GUID par instance, cartes Active Sessions (nb sessions live), état plugin cast. 0 différence structurelle |
| 15 états déclarés, stateProofs déterministes | **confirmé ×2 stacks** : les 15 états rejoués sur :6711 ET :6713 — chaque `setup` se termine par un `waitForSelector` de preuve exclusif, 0 erreur nulle part. Garde hydratation React suffisante (`about:blank` avant chaque `goto` + `.page:not(.hide)` + `lastNavResponse`) |
| Fix IB-dévoilé : carte Active Sessions blanc/#00a4db 2.86 → corrigé dark+light | **mesuré pixel-vrai par moi-même, session live** : dark patché → blanc `rgb(255,255,255)` sur `#0076a0` efficace = **5.12** (vanilla `#00a4db` recalculé = 2.88, claim 2.86 ✓) ; light patché → noir sur `#0288d1` = **5.44** ; `dcb4` light `#388e3c`→`#43a047` vérifié sources + dist css. Fix réel, non cosmétique |
| verify 19/19, eval 34/34, sondes incomplets 0 FAIL | **rejoué** : verify **19/19** sur :6711 ET **19/19** sur :6713 (IB) ; eval-final **34/34** ; sondes sur mon rescan : 19 PASS + 111 N-A color-contrast, 155/21/10/6 N-A autres — **0 FAIL**. **Sabotage éprouvé** : retrait de l'`aria-label` du Paper UserMenu dans le bundle → verify **17/19, 2 FAIL** (labels vides détectés) ; corruption du label du bouton → timeout FAIL. La détection fonctionne |
| install-build verbatim : clone vierge + apply + build + rescan 0 viol / 322 inc | **rejoué de bout en bout** : :6713 → apply 0 rejet → build 79 s → mount → seed → rescan **0 viol / 0 err / 322 inc — nœud-par-nœud 322/322 IDENTIQUES au livré**. public 0/0/0 |
| provenance 87/87 --strict | **ÉCHOUÉ tel quel** : 3 fichiers git-trackés (`tools/env.sh`, `tools/public.json`, `tools/package-lock.json`) listés dans `excluded` mais `rehash-provenance.py --strict` les compte comme livrés non listés (git ls-files ne consulte pas `excluded`) → exit 1. Le rehash 87/87 du worker est antérieur à leur commit — W2. Correction documentaire appliquée ci-dessous |
| REGISTRE ligne 41 | présente, verdict `—` remplacé |

## Corrections structurelles — vérifiées en live

- **Menus/popovers MUI** `slotProps.paper` `role=region` + `aria-label` —
  sabotage-éprouvé (fail si retiré).
- **dialogHelper** `role=dialog` + `aria-modal` + nommage par titre visible
  (ou `Menu` en repli) — dialogs rejoués ouverts, nommés.
- **cardBuilder** : accessible name `« Name N »` contigu (badge visible miroir
  dans l'aria-label, indicators `aria-hidden`, espace texte explicite) —
  leçon lcnm visibleVirtual respectée par construction.
- **TablePage** : `mrt-row-spacer` `aria-hidden` + `tabIndex=-1`, actions
  colonne `opacity`/`pointer-events` sur hover/focus-within (target-size
  partiallyObscured résolu).
- **Thème** : `defaultCardBackground` dark×2 assombries, light×1 éclaircie —
  mesures propres ci-dessus.
- **lcnm axe 4.14** : règle standard `label-content-name-mismatch` — 0 viol
  sur 76 scénarios patchés → tous les aria-labels ajoutés contiennent le
  texte visible. Non-violations introduites : aucune détectée.

## Hors-scope restant (chasse active — scanné par mes soins)

Routes réelles du routeur absentes des 76 scénarios — **toutes propres** sur
l'instance patchée :

- `#/dashboard/tasks/:id` (éditeur de tâche planifiée) → 0 viol
- `#/dashboard/remoteaccess` → 0 viol
- `#/dashboard/plugins/catalog` → 0 viol, 2 inc
- `#/dashboard/livetv/guide` + `#/livetv/guide` → 0 viol
- `#/mypreferencesdisplay` → erreur de scan **comme documenté** (spinner,
  `.page:not(.hide)` jamais résolu — exclusion justifiée)
- Exclusions manifest confirmées raisonnables : `#/video` (.strm injouable),
  `logs/<fichier>` (rotation non déterministe), `metadataeditor` (500 amont),
  `#/wizard` (consommé). `forgotpasswordpin`, `addserver`, `selectserver`,
  `livetv/tuner`, `plugins/:pluginId` restent non couverts — gap de
  déclaration, pas de violation cachée (sous-pages non navigables sans
  données correspondantes).

## Warts (non bloquants)

- **W1** — stats patch livrées (59f +473/−144) < réelles (60f +478/−147) :
  delta du fix IB post-daté dans les docs ; le sha256 sidecar lui est juste.
- **W2** — provenance `--strict` échoue à la livraison (3 fichiers trackés en
  `excluded`). Corrigé dans ce commit : déplacés dans `files{}` avec leur
  empreinte (env.sh/public.json = transparence délibérée ; package-lock =
  pin des tools).
- **W3** — `measure-contrast.mjs` livré sans `locale: 'en-US'` → RangeError
  Intl sur cette box (audit.mjs la pose ; la copie patchée mesure
  correctement). Fragilité env, pas de résultat faussé.
- **W4** — manifest « 2292 fichiers » vs **2348 réels** (dist locale ET
  webroot image) : compte périmé ; la structure dist↔webroot reste identique
  modulo noms hashés — mécanisme bind-mount valide.
- **W5** — `scopeHash` mélange host+user-id : égalité baseline↔final vraie
  seulement sur une même instance ; normalisés, mes ensembles sont
  identiques entre eux et au livré (0 diff symétrique).
- **W6** — setups d'états sélectionnent par libellé traduit
  (`button[aria-label="User Menu"]`) — fragile hors locale en-US.
- **W7** — incomplets 319 (dev livré) vs 322 (IB livré + mes 2 stacks) :
  delta honnête data-dépendant, reproductible et expliqué.

## Note finale

CONFIRMED = reproductibilité axe + santé du patch (protocole boucle), pas une
attestation de conformité WCAG. Points forts du cycle : mécanisme bind-mount
dist sans rebuild image (boot ~10 s), seed déterministe à ids stables, fix IB
mesuré pixel-vrai par mes soins en dark (5.12) et light (5.44), sabotage
aria-label détecté par verify, install-build **nœud-identique** au livré.
