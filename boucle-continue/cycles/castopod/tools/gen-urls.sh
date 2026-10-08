#!/usr/bin/env bash
# gen-urls.sh — cycle 50 castopod. Résout les ids réels du seed EN BASE
# (auto-incrément non prédictif — leçon 44/46) et régénère les artefacts
# dérivés du seed : seed-info.json + urls-auth.resolved.txt.
#
# POURQUOI : le resolved.txt du worker pointait /podcasts/1 alors que la DB de
# son instance contenait podcast=4 → 8 pages 404 jamais baselinées (F1). La
# résolution doit être rejouée sur LA MÊME DB que l'instance scannée, et AVANT
# chaque run si la DB a pu dériver — jamais commitée comme vérité figée.
#
# Usage : bash tools/gen-urls.sh <db-container>
#   ex. bash tools/gen-urls.sh castopod50-db        (instance dev)
#       bash tools/gen-urls.sh castopod50-db-f      (instance fixer -f)
set -euo pipefail

DB="${1:?nom du conteneur MariaDB requis (ex. castopod50-db-f)}"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Résolution DB : podcast banc par handle (pas par id), 1er épisode, 1re page,
# 1re personne — les mêmes SELECT que seed.sh (source unique déplacée ici).
read -r POD_ID EP_ID PAGE_ID PERSON_ID < <(
  docker exec "$DB" mariadb -ucastopod -pcp50secret castopod -sN -e "
    SELECT CONCAT(
      (SELECT id FROM cp_podcasts WHERE handle='auditwaves' ORDER BY id LIMIT 1), ' ',
      (SELECT id FROM cp_episodes WHERE podcast_id=(SELECT id FROM cp_podcasts WHERE handle='auditwaves') ORDER BY id LIMIT 1), ' ',
      (SELECT id FROM cp_pages ORDER BY id LIMIT 1), ' ',
      (SELECT id FROM cp_persons ORDER BY id LIMIT 1));"
)

for pair in "POD_ID=$POD_ID" "EP_ID=$EP_ID" "PAGE_ID=$PAGE_ID" "PERSON_ID=$PERSON_ID"; do
  name="${pair%%=*}"; val="${pair##*=}"
  if [ -z "$val" ] || [ "$val" = "NULL" ]; then
    echo "[gen-urls] ERREUR : $name non résolu — le seed BenchSeeder est-il présent dans $DB ?" >&2
    exit 1
  fi
done

# seed-info.json : ids réels lus en base. Note : /cp-admin/fediverse (sans
# suffixe) REDIRIGE vers blocked-actors — le runner refuse « document final
# différent » ; l'URL réelle de l'état est listée ici (F1/leçon 45).
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
  "auth": ["/cp-admin", "/cp-admin/settings", "/cp-admin/settings/theme", "/cp-admin/persons", "/cp-admin/persons/new", "/cp-admin/persons/$PERSON_ID", "/cp-admin/persons/$PERSON_ID/edit", "/cp-admin/podcasts", "/cp-admin/podcasts/new", "/cp-admin/podcasts/$POD_ID", "/cp-admin/podcasts/$POD_ID/edit", "/cp-admin/podcasts/$POD_ID/persons", "/cp-admin/podcasts/$POD_ID/analytics", "/cp-admin/podcasts/$POD_ID/episodes", "/cp-admin/podcasts/$POD_ID/episodes/new", "/cp-admin/podcasts/$POD_ID/episodes/$EP_ID", "/cp-admin/podcasts/$POD_ID/episodes/$EP_ID/edit", "/cp-admin/pages", "/cp-admin/pages/new", "/cp-admin/pages/$PAGE_ID/edit", "/cp-admin/fediverse/blocked-actors", "/cp-admin/my-account"]
 }
}
EOF

# urls-auth.resolved.txt : ids réels substitués dans urls-auth.txt — rejouable
# sur tout seed quel que soit l'ordre d'auto-incrément (leçon 37/44).
sed -e "s|@POD_ID@|$POD_ID|g" -e "s|@EP_ID@|$EP_ID|g" -e "s|@PAGE_ID@|$PAGE_ID|g" -e "s|@PERSON_ID@|$PERSON_ID|g" \
  "$TOOLS_DIR/urls-auth.txt" > "$TOOLS_DIR/urls-auth.resolved.txt"

echo "[gen-urls] OK — seed-info.json + urls-auth.resolved.txt (podcast=$POD_ID episode=$EP_ID page=$PAGE_ID person=$PERSON_ID, db=$DB)"
