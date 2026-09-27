# tests-validateurs — suite de mutants pour les assertions a11y

Cette suite ne teste pas un produit : elle teste les **façons de tester**.
Chaque cas confronte une assertion *faible* (anti-patron documenté par les
revues externes V2 et V3) à l'assertion *durcie* prescrite par `SKILL.md`
règles 13–17, implémentée dans `assertions.mjs`.

`assertions.mjs` est le module **partagé** — les helpers sont importés par la
suite ici ET réutilisables tels quels dans les `verify.mjs` / `eval-final.mjs`
produits pendant un run (les mutants éprouvent le code qui sert réellement à
valider, pas un exemple parallèle).

## Lancer

```bash
npm i -D playwright && npx playwright install chromium
node tests-validateurs/validateurs.mjs   # exit 0 = 9/9 détectés, 0 faux négatifs
```

## Mutants couverts

| mutant | piège de l'assertion faible | assertion durcie (helper) |
|---|---|---|
| `read` vs `unread` | `className.includes('read')` | `classList.contains('read')` — effet exact |
| nom accessible vide | `aria-labelledby` présent | `accNameMatches` — nom calculé + cibles résolues |
| leurre même nom | `getByRole` à l'échelle page | `accNameMatches` sur le locator exact |
| labelledby cible vide | attribut + cible existante | `accNameMatches` — cible doit apporter du contenu accessible (texte, `aria-label`, `alt` d'img) |
| app masquée | `clientWidth > 0` | `isTrulyVisible` — repère métier réellement visible |
| `opacity:0` | `isVisible()` l'ignore | `isTrulyVisible` — remonte la chaîne d'ancêtres |
| élément requis absent | `catch` muet → `true` | `effectObserved` — l'action lève, élément absent = FAIL |
| filtre sans effet métier | `selectOption` a marché | `effectObserved` — l'effet sur `#results` est mesuré |
| page d'erreur servie | `title !== null` | repère métier `isTrulyVisible` + gabarit d'erreur absent |

## Enseignements propres à la suite

- Chromium retombe sur le contenu de l'élément quand `aria-labelledby` pointe
  vers un id inexistant : `getByRole({name:'OK'})` seul NE détecte PAS un
  labelledby cassé. L'assertion durcie est donc composée : nom calculé ET
  résolution effective des ids référencés — y compris le cas légitime où la
  cible est une image dont le `alt` fournit le nom (pas de `textContent`).
- `locator.isVisible()` accepte `opacity:0` — la visibilité réelle exige
  `getComputedStyle` sur l'élément **et ses ancêtres** + boîte non vide.
- Un contrôle peut exister et fonctionner mécaniquement sans produire
  l'effet métier : `effectObserved` sépare l'action de sa preuve.
