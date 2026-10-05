#!/usr/bin/env bash
# seed.sh — seed déterministe BookStack (cycle 23), rejoué verbatim.
# Prérequis : stack docker compose démarrée (voir manifest.boot).
# Produit : contenu démo upstream + livre/chapitre/pages/commentaire aux
# slugs DÉTERMINISTES référencés par le manifeste + accès public activé.
# Les ids numériques sont capturés des réponses API (pas figés).
set -euo pipefail
cd "$(dirname "$0")"   # exécuter depuis n'importe où ; les commandes docker
                       # compose ciblent le répertoire du clone via -f.
COMPOSE_DIR="${BOOKSTACK_DIR:-$HOME/work/bookstack}"

# 1) Contenu démo upstream : 2 utilisateurs (editor+viewer), 5 livres ×
#    (3 chapitres × 3 pages + 3 pages directes), 1 « Large book »
#    (50 chapitres + 200 pages), 10 étagères, token API apitoken/password.
docker compose -f "$COMPOSE_DIR/docker-compose.yml" exec -T app php artisan db:seed --class=DummyContentSeeder --force

# 2) Accès public (fonctionnalité native : le rôle système 'public' a déjà
#    toutes les permissions *-view-all) → pages auditables sans session.
docker compose -f "$COMPOSE_DIR/docker-compose.yml" exec -T app php artisan tinker --execute='setting()->put("app-public", "true");'

API="${A11Y_BASE:-http://localhost:8080}/api"
AUTH="Authorization: Token apitoken:password"
jid() { python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }

# 3) Livre démo — description HTML contenant UN LIEN (règle seed littérale).
BOOK=$(curl -sf -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"name":"Demo A11y Book","description_html":"<p>Livre de d&eacute;monstration pour l'"'"'audit d'"'"'accessibilit&eacute;. Voir <a href=\"https://www.bookstackapp.com/docs/\">la documentation officielle</a> pour les d&eacute;tails.</p>","tags":[{"name":"demo"},{"name":"a11y","value":"cycle-23"}]}' \
  "$API/books")
BOOK_ID=$(echo "$BOOK" | jid id); BOOK_SLUG=$(echo "$BOOK" | jid slug)
echo "book $BOOK_ID $BOOK_SLUG"   # attendu : slug demo-a11y-book

# 4) Chapitre démo.
CHAPTER=$(curl -sf -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d "{\"book_id\":$BOOK_ID,\"name\":\"Chapitre Demo A11y\",\"description_html\":\"<p>Chapitre de d&eacute;monstration avec <a href=\\\"https://example.org/\\\">un lien de test</a>.</p>\"}" \
  "$API/chapters")
CHAPTER_ID=$(echo "$CHAPTER" | jid id)
echo "chapter $CHAPTER_ID $(echo "$CHAPTER" | jid slug)"   # attendu : chapitre-demo-a11y

# 5) Page démo — contenu RÉELLEMENT RENDU : h2+h3, liste, tableau, 2 liens.
PAGE=$(curl -sf -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d "{\"book_id\":$BOOK_ID,\"name\":\"Page Demo A11y\",\"html\":\"<h2 id=\\\"section-intro\\\">Introduction</h2><p>Ceci est une page de d&eacute;monstration pour l\\u0027audit d\\u0027accessibilit&eacute;, contenant un <a href=\\\"https://example.com/lien\\\">lien externe de test</a> ainsi qu\\u0027un second <a href=\\\"/books\\\">lien interne</a>.</p><h3>Sous-section</h3><ul><li>Premier &eacute;l&eacute;ment de liste</li><li>Second &eacute;l&eacute;ment</li></ul><p>Texte en <strong>gras</strong>, <em>italique</em> et <code>code inline</code>.</p><table><thead><tr><th>Colonne A</th><th>Colonne B</th></tr></thead><tbody><tr><td>Valeur 1</td><td>Valeur 2</td></tr></tbody></table>\"}" \
  "$API/pages")
PAGE_ID=$(echo "$PAGE" | jid id)
echo "page $PAGE_ID $(echo "$PAGE" | jid slug)"   # attendu : page-demo-a11y

# 6) Page dans le chapitre (le chapitre n'est pas vide).
PAGE2=$(curl -sf -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d "{\"chapter_id\":$CHAPTER_ID,\"book_id\":$BOOK_ID,\"name\":\"Page Chapitre Demo\",\"html\":\"<p>Page dans le chapitre de d&eacute;monstration avec <a href=\\\"https://example.net/\\\">lien</a> et contenu r&eacute;el.</p>\"}" \
  "$API/pages")
echo "page $(echo "$PAGE2" | jid id) $(echo "$PAGE2" | jid slug)"   # attendu : page-chapitre-demo

# 7) Commentaire sur la page démo (rend le composant commentaires non vide).
curl -sf -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d "{\"page_id\":$PAGE_ID,\"html\":\"<p>Commentaire de d&eacute;monstration avec <a href=\\\"https://example.com/\\\">lien</a> pour tester le rendu.</p>\"}" \
  "$API/comments" | jid id | xargs -I{} echo "comment {}"

echo "seed terminé : /books/$BOOK_SLUG + chapitre + 2 pages + 1 commentaire, accès public ON"
