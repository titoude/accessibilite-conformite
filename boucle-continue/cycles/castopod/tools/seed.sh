#!/usr/bin/env bash
# seed.sh — cycle 50 castopod. Init DB (migrations + AppSeeder) puis BenchSeeder
# (superadmin bench-admin, podcast @auditwaves, 3 épisodes publiés + 1 programmé,
# page custom, contributeur). Idempotent.
# Usage : bash tools/seed.sh <checkout-castopod> [NAME_SUFFIX]
set -euo pipefail

CHECKOUT="${1:?chemin du checkout castopod requis}"
SFX="${2:-}"
APP="castopod50${SFX}"
DB="castopod50-db${SFX}"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# BenchSeeder.php vit dans tools/ (artefact du cycle) et est recopié dans le
# checkout pour que spark le découvre — fichier banc, jamais dans patch.diff.
cp "$TOOLS_DIR/BenchSeeder.php" "$CHECKOUT/app/Database/Seeds/BenchSeeder.php"

docker exec "$APP" php spark install:init-database
docker exec "$APP" php spark db:seed BenchSeeder

# seed-info.json : ids/slugs réels lus en base (ids auto-incrément non prédictifs)
read -r POD_ID EP_ID PAGE_ID PERSON_ID < <(
  docker exec "$DB" mariadb -ucastopod -pcp50secret castopod -sN -e "
    SELECT CONCAT(
      (SELECT id FROM cp_podcasts WHERE handle='auditwaves' ORDER BY id LIMIT 1), ' ',
      (SELECT id FROM cp_episodes WHERE podcast_id=(SELECT id FROM cp_podcasts WHERE handle='auditwaves') ORDER BY id LIMIT 1), ' ',
      (SELECT id FROM cp_pages ORDER BY id LIMIT 1), ' ',
      (SELECT id FROM cp_persons ORDER BY id LIMIT 1));"
)
cat > "$TOOLS_DIR/seed-info.json" <<EOF
{
 "admin": {"username": "bench-admin", "email": "bench-admin@c50.local", "password": "AuditC50-Pass-Seed!"},
 "podcast": {"handle": "auditwaves", "title": "Audit Waves", "id": $POD_ID},
 "episodes": [
  {"id": $EP_ID, "slug": "reperage-page-publique", "number": 1, "title": "Repérage : la page publique du podcast"},
  {"slug": "contrastes-mesurer-avant-corriger", "number": 2, "title": "Contrastes : mesurer avant de corriger"},
  {"slug": "player-embarque-au-clavier", "number": 3, "title": "Le player embarqué passé au clavier"},
  {"slug": "episode-programme-banc", "number": 4, "title": "Épisode programmé du banc", "published": "future"}
 ],
 "person": {"id": $PERSON_ID, "uniqueName": "nadia-reve"},
 "page": {"id": $PAGE_ID, "slug": "a-propos-du-banc"},
 "urls": {
  "public": ["/@auditwaves", "/@auditwaves/episodes", "/@auditwaves/episodes/reperage-page-publique", "/@auditwaves/episodes/reperage-page-publique/embed", "/@auditwaves/episodes/reperage-page-publique/embed/dark", "/@auditwaves/about", "/@auditwaves/links", "/pages/a-propos-du-banc", "/cp-auth/login"],
  "auth": ["/cp-admin", "/cp-admin/settings", "/cp-admin/settings/theme", "/cp-admin/persons", "/cp-admin/persons/new", "/cp-admin/persons/$PERSON_ID", "/cp-admin/persons/$PERSON_ID/edit", "/cp-admin/podcasts", "/cp-admin/podcasts/new", "/cp-admin/podcasts/$POD_ID", "/cp-admin/podcasts/$POD_ID/edit", "/cp-admin/podcasts/$POD_ID/persons", "/cp-admin/podcasts/$POD_ID/analytics", "/cp-admin/podcasts/$POD_ID/episodes", "/cp-admin/podcasts/$POD_ID/episodes/new", "/cp-admin/podcasts/$POD_ID/episodes/$EP_ID", "/cp-admin/podcasts/$POD_ID/episodes/$EP_ID/edit", "/cp-admin/pages", "/cp-admin/pages/new", "/cp-admin/pages/$PAGE_ID/edit", "/cp-admin/fediverse", "/cp-admin/my-account"]
 }
}
EOF
# urls-auth.resolved.txt : ids réels substitués (rejouable sur seed frais quel
# que soit l'ordre d'auto-incrément — leçon 37/44)
sed -e "s|@POD_ID@|$POD_ID|g" -e "s|@EP_ID@|$EP_ID|g" -e "s|@PAGE_ID@|$PAGE_ID|g" \
  "$TOOLS_DIR/urls-auth.txt" > "$TOOLS_DIR/urls-auth.resolved.txt"

echo "[seed] OK — seed-info.json écrit (podcast=$POD_ID episode=$EP_ID page=$PAGE_ID person=$PERSON_ID)"
