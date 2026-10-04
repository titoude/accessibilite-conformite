#!/usr/bin/env bash
# seed.sh — cycle 17 umami : rejoue le seed figé du manifeste à l'identique.
#
# Préconditions (déjà couvertes par manifest.boot) :
#   - conteneur postgres : `docker run -d --name umami-pg -p 5432:5432
#     -e POSTGRES_USER=umami -e POSTGRES_PASSWORD=umami -e POSTGRES_DB=umami postgres:15-alpine`
#   - `corepack pnpm install --frozen-lockfile && corepack pnpm prisma generate
#     && corepack pnpm db:migrate && corepack pnpm db:seed` exécutés dans $UMAMI_DIR
#     (db:seed crée 'Demo Blog' + 'Demo SaaS' avec des website_id GÉNÉRÉS aléatoires
#     — scripts/seed/index.ts:142 `const websiteId = uuid()`)
#   - application démarrée : `pnpm start` sur $BASE (défaut http://localhost:3000)
#
# Ce script produit les entités aux identifiants FIGÉS du manifest.json :
#   website a59bd9be-…/d4bdaf1e-… (remap SQL — ids serveur), link ec520c8a-…
#   (id+slug posés par l'API), pixel afa6189b-… (idem), board f08a66bc-…
#   (remap SQL — id serveur), share 6c2d7451-…/a11yumamishare (remap SQL —
#   slug ET id générés serveur, le champ slug du POST est ignoré).
#
# Usage : tools/seed.sh   (variables : BASE, UMAMI_DIR, PG=conteneur docker)
set -euo pipefail

BASE="${BASE:-http://localhost:3000}"
PG="${PG:-umami-pg}"
UMAMI_DIR="${UMAMI_DIR:-$HOME/work/umami}"
psql() { docker exec "$PG" psql -U umami -d umami "$@"; }

# Identifiants figés (manifest.json)
WS_BLOG=a59bd9be-c9ec-4715-b38f-0308bb00db13
WS_SAAS=d4bdaf1e-bca5-465f-848d-f33a9045daf3
LINK_ID=ec520c8a-0a22-4b18-9cde-5feb562e4563
PIXEL_ID=afa6189b-6717-41d9-b6ca-cb0c6838ec1b
BOARD_ID=f08a66bc-226d-484b-8446-71ac26a22375
SHARE_ID=6c2d7451-6b85-4252-9262-00e4efb5e957
SHARE_SLUG=a11yumamishare
LINK_SLUG=a11ylink01
PIXEL_SLUG=a11ypixel

echo "== 1/6 remap website_id générés → ids figés"
GEN_BLOG=$(psql -tAc "select website_id from website where domain='blog.example.com' and deleted_at is null" | head -1)
GEN_SAAS=$(psql -tAc "select website_id from website where domain='app.example.com'  and deleted_at is null" | head -1)
[ -n "$GEN_BLOG" ] && [ -n "$GEN_SAAS" ] || { echo "sites démo absents — lancer pnpm db:seed"; exit 1; }
remap_ws() { # $1 = id généré, $2 = id figé
  for t in session session_link website_event event_data session_data report \
           annotation segment revenue session_replay session_replay_saved \
           heatmap_event website; do
    psql -qc "update $t set website_id='$2' where website_id='$1'"
  done
  psql -qc "update share set entity_id='$2' where entity_id='$1'"
}
remap_ws "$GEN_BLOG" "$WS_BLOG"
remap_ws "$GEN_SAAS" "$WS_SAAS"
psql -tAc "select website_id,name from website order by name"

echo "== 2/6 login admin → token"
TOKEN=$(curl -sf -X POST "$BASE/api/auth/login" -H 'content-type: application/json' \
  -d '{"username":"admin","password":"umami"}' | jq -r .token)
[ "$TOKEN" != null ] && [ -n "$TOKEN" ] || { echo "login impossible"; exit 1; }
AUTH="authorization: Bearer $TOKEN"
CT='content-type: application/json'

echo "== 3/6 link + pixel (id/slug posés par l'API — POST accepte id? et slug)"
curl -sf -X POST "$BASE/api/links"  -H "$AUTH" -H "$CT" \
  -d "{\"id\":\"$LINK_ID\",\"name\":\"Campaign link\",\"url\":\"https://example.com/campaign\",\"slug\":\"$LINK_SLUG\"}" | jq -c '{id,name,slug}'
curl -sf -X POST "$BASE/api/pixels" -H "$AUTH" -H "$CT" \
  -d "{\"id\":\"$PIXEL_ID\",\"name\":\"Demo pixel\",\"slug\":\"$PIXEL_SLUG\"}" | jq -c '{id,name,slug}'

echo "== 4/6 board (id généré serveur → remap SQL)"
GEN_BOARD=$(curl -sf -X POST "$BASE/api/boards" -H "$AUTH" -H "$CT" \
  -d "{\"type\":\"website\",\"name\":\"Demo board\",\"description\":\"\",\"parameters\":{\"websiteId\":\"$WS_SAAS\"}}" | jq -r '.boardId // .id')
[ -n "$GEN_BOARD" ] && [ "$GEN_BOARD" != null ] || { echo "création board échouée"; exit 1; }
psql -qc "update board set board_id='$BOARD_ID' where board_id='$GEN_BOARD'"

echo "== 5/6 share (slug+id générés serveur → remap SQL)"
GEN_SHARE=$(curl -sf -X POST "$BASE/api/websites/$WS_SAAS/shares" -H "$AUTH" -H "$CT" \
  -d '{"name":"a11y share"}' | jq -r '.shareId // .id')
[ -n "$GEN_SHARE" ] && [ "$GEN_SHARE" != null ] || { echo "création share échouée"; exit 1; }
psql -qc "update share set share_id='$SHARE_ID', slug='$SHARE_SLUG' where share_id='$GEN_SHARE'"

echo "== 6/6 état final"
psql -tAc "select 'website '||website_id from website union all
           select 'link '||link_id from link union all
           select 'pixel '||pixel_id from pixel union all
           select 'board '||board_id from board union all
           select 'share '||share_id||' /'||slug from share order by 1"
echo "seed figé rejoué : /share/$SHARE_SLUG → $BASE/share/$SHARE_SLUG"
