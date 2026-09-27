# tests-validateurs — suite de mutants pour les assertions a11y

Cette suite ne teste pas un produit : elle teste les **façons de tester**.
Chaque cas confronte une assertion *faible* (anti-patron documenté par la
revue externe V2) à l'assertion *durcie* prescrite par `SKILL.md` règles 13–17.

Résultat attendu : chaque assertion durcie passe sur le témoin correct et
échoue sur le mutant. Les assertions faibles passent à tort sur 4/5 mutants —
c'est précisément la faille que la suite documente.

## Lancer

```bash
npm i -D playwright && npx playwright install chromium
node tests-validateurs/validateurs.mjs   # exit 0 = 5/5 détectés, 0 faux négatifs
```

## Mutants couverts

| mutant | assertion faible | assertion durcie | règle |
|---|---|---|---|
| `read` vs `unread` | `className.includes('read')` | `classList.contains('read')` | 13 |
| nom accessible vide | `aria-labelledby` présent | `getByRole({name})` + cible labelledby résoluble | 15 |
| app masquée | `clientWidth > 0` | visibilité d'un repère métier | 17 |
| élément requis absent | `catch` muet → `true` | `count()===0` = FAIL | 14 |
| page d'erreur servie | `title !== null` | repère métier + gabarit d'erreur absent | 14/16 |

## Enseignement propre à la suite

Chromium retombe sur le contenu de l'élément quand `aria-labelledby` pointe
vers un id inexistant : `getByRole({name:'OK'})` seul NE détecte PAS un
labelledby cassé. L'assertion durcie est donc composée : nom calculé ET
résolution effective des ids référencés.
