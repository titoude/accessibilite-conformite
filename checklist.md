# Checklist de vérification — accessibilité

> Ce que l'audit automatisé ne peut PAS voir. À exécuter par un agent/humain **différent** de celui qui a corrigé.
>
> **Distinguer 3 natures de contrôle** (le rapport doit dire laquelle) :
> 1. **Test déterministe** — assertion rejouable (Playwright : « le focus revient au déclencheur »), trace conservée.
> 2. **Évaluation sémantique par agent** — pertinence d'un alt, cohérence d'un intitulé : jugement, éléments observés, incertitude signalée.
> 3. **Évaluation humaine** — lecteur d'écran réel, graphique complexe : personne, environnement, protocole, conclusion.
>
> Chaque critère reçoit un statut : `PASS` · `FAIL` · `NOT_APPLICABLE` (justifié) · `NOT_TESTED` · `NEEDS_HUMAN_REVIEW`. Une couverture manquante n'est jamais un PASS implicite.
>
> **Résultats axe `incomplete`** : chaque occurrence (axe n'a pas pu trancher, ex. contraste sur fond non mesurable) reçoit une **décision de résolution traçable par groupe** — regrouper par `rule_id × scénario`, puis pour chaque groupe : `RESOLVED` (mesuré manuellement, preuve jointe) · `NEEDS_HUMAN_REVIEW` (non tranchable par agent, escaladé) · `NOT_APPLICABLE` (justifié). Un `incomplete` sans décision de groupe n'est ni PASS ni FAIL — il reste ouvert dans le rapport. `--strict-incomplete` les fait compter comme erreurs du gate.

## 1. Navigation clavier complète (moteur — le test #1)

Parcourir **chaque page et chaque flow métier** au clavier seul :

- [ ] `Tab` atteint **toutes les fonctionnalités**, dans un ordre qui suit la lecture visuelle — NB : dans un composite à roving tabindex, un seul élément prend le Tab, les autres se parcourent aux flèches (pattern APG légitime, `tabindex="-1"` autorisé) : vérifier entrée, navigation interne et sortie
- [ ] Le focus n'est **jamais entièrement masqué** par un header/footer fixe ou une modale (2.4.11 minimum — 2.4.12 renforcé en AAA)
- [ ] `Shift+Tab` fonctionne en sens inverse sans saut
- [ ] Le focus est **visible** partout (outline non supprimé ou équivalent `:focus-visible`)
- [ ] **Aucun piège clavier** : on peut sortir de chaque composant/modal avec `Esc` ou `Tab`
- [ ] Lien d'évitement (« Aller au contenu ») présent et fonctionnel en premier `Tab`
- [ ] Modal/dialog : focus **déplacé** dans la modale à l'ouverture, arrière-plan **inerte** (pas seulement Tab cyclé : le reste ne doit recevoir ni focus ni interaction), fermeture `Esc`, **retour du focus au déclencheur**. Attention : « focus qui fuit derrière la modale » et « piège 2.1.2 » sont deux défauts différents — nommer la bonne exigence
- [ ] Menus, onglets, autocomplete, accordéons : flèches/Home/End conformes au pattern APG
- [ ] Pas de fonctionnalité réservée à la souris (hover-only, drag-only) sans alternative clavier
- [ ] Contenu affiché au survol ou au focus (infobulles, menus) : **refermable** (Esc), **persistant** (ne disparaît pas quand on le survole), **survolable** (1.4.13)
- [ ] Cibles tactiles/clic ≥ 24 × 24 px (WCAG 2.2 — 2.5.8) ou exception documentée
- [ ] Formulaires : navigation clavier dans les erreurs, l'authentification, les parcours multi-étapes
- [ ] Drag & drop : alternative **au pointeur simple** (bouton/menu, 2.5.7) ET alternative clavier — le clavier seul ne couvre pas l'utilisateur de souris incapable de glisser
- [ ] Transitions entre pages/états : focus déplacé de façon compréhensible, pas perdu sur un élément supprimé

## 2. Lecteur d'écran (cécité)

NVDA + Firefox (Windows, gratuit) ou VoiceOver + Safari (macOS). Sur les parcours critiques :

- [ ] Chaque page a un `title` pertinent et un `<html lang>` correct
- [ ] Landmarks présents : `header/main/nav/footer`, navigation par régions
- [ ] Hiérarchie de titres `h1 → h2 → h3` sans saut
- [ ] Chaque image informative a un `alt` **pertinent** (pas « image.png ») ; les décoratives ont `alt=""`
- [ ] Chaque champ de formulaire est annoncé avec son label + état (requis, erreur)
- [ ] Messages d'erreur/succès/chargement **annoncés** (live regions `aria-live`)
- [ ] Tableaux de données : `th` + `scope`/`headers` — en-têtes annoncés
- [ ] Composants custom : rôle + nom + état correctement annoncés (ARIA conforme APG)
- [ ] Annonces de statut : toasts, résultats de recherche, soumissions — `aria-live`/role=status entendu
- [ ] Tableaux complexes et graphiques : données accessibles autrement (tableau équivalent, description)
- [ ] Pas d'« image manquante » de contenu : tout le contenu visuel a un équivalent

## 3. Vision — zoom, contraste, reflow (malvoyance/daltonisme)

- [ ] Zoom navigateur à **200 %** : tout reste lisible et utilisable, rien de tronqué
- [ ] **Reflow** : largeur équivalente à 320 pixels CSS sans scroll horizontal — distinct du simple « zoom 400 % », c'est le critère 1.4.10 précis. **Exceptions légitimes** : contenus dont le sens exige 2 dimensions (tableaux de données, cartes, graphiques, canvas) — scroll toléré pour eux, pas pour la page entière
- [ ] Agrandissement du texte seul (espacement override) sans perte de contenu
- [ ] Aucune information véhiculée **par la couleur seule** (codes couleur doublés d'icône/texte)
- [ ] Contrastes texte ≥ 4,5:1 (3:1 grand texte), UI et focus ≥ 3:1 — spot-check sur les éléments stylés custom que le scanner peut rater
- [ ] Mode contraste élevé Windows / `forced-colors` : l'UI reste compréhensible

## 4. Mouvement, timing, cognition

- [ ] `prefers-reduced-motion` respecté : animations/parallaxe désactivées (NB : 2.3.3 animations déclenchées par interaction = **AAA** — à distinguer des exigences AA sur contenu clignotant)
- [ ] Aucun contenu qui clignote > 3 fois/seconde (photosensibilité)
- [ ] Aucun timeout brutal ; si délai, avertissement + possibilité d'extension
- [ ] Carrousels/autoplay pausables et controlables au clavier
- [ ] Erreurs de formulaire expliquées en texte (pas juste rouge) + suggestion de correction
- [ ] Titres/labels d'aide clairs, instructions avant le formulaire (pas après l'erreur)
- [ ] **Saisie redondante** (3.3.7, WCAG 2.2) : aucune info déjà fournie n'est redemandée — ou elle est pré-remplie/sélectionnable
- [ ] **Authentification accessible** (3.3.8) : pas de test cognitif obligatoire (puzzle, CAPTCHA visuel, mémorisation) sans alternative ; copier-coller de mot de passe non bloqué ; autofill/`autocomplete` présents
- [ ] **Identification des champs** (1.3.5) : `autocomplete` correct sur les champs personnels (nom, email, adresse…)

## 5. Multimédia (surdité)

- [ ] Toute vidéo/audio avec parole a des sous-titres synchronisés
- [ ] **Audiodescription** (1.2.5, AA) : vidéos dont l'action n'est pas audible ont une audiodescription ou une alternative textuelle complète
- [ ] Transcription textuelle pour les contenus audio
- [ ] Aucun son indispensable sans équivalent visuel

## 6. Devices & configurations

- [ ] Mobile : VoiceOver/iOS + TalkBack/Android sur le parcours principal
- [ ] Touch targets mobiles ≥ 44 px
- [ ] Le site fonctionne zoom texte 200 % sur mobile
- [ ] Pas de blocage orientation portrait/paysage

## 7. Obligations documentaires (France/RGAA)

- [ ] Mention de conformité (« Accessibilité : totalement/partiellement conforme ») en page d'accueil ou footer
- [ ] Page déclaration d'accessibilité : résultat d'audit, contenus exemptés, contact/remonter un défaut
- [ ] Mécanisme de signalement accessible (formulaire ou mail)
- [ ] Si organisme visé : schéma pluriannuel + plan d'action

## Résultat attendu

| Vérification | Critère de passage |
|---|---|
| `audit.mjs` | 0 violation ET 0 erreur de périmètre sur le scope figé (exit 2 si un scénario manque) |
| Clavier | 100 % des fonctionnalités atteignables + focus visible + 0 piège |
| Lecteur d'écran | Parcours clés compréhensibles de bout en bout |
| Zoom/reflow | Utilisable à 200 % / 400 % |
| CI | Gate `audit.mjs` (exit ≠ 0) en pipeline |

Tout point échoué → retour en correction, jamais contourné par une note « connu ».
