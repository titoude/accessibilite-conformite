#!/usr/bin/env bash
# seed.sh — cycle 52 netbox. Seed rejouable + génération des artefacts dérivés.
# Usage : bash tools/seed.sh <app-container> <db-container>
#         ex. netbox52-app netbox52-db | netbox52-app-i netbox52-db-i
set -euo pipefail
APP="${1:?app container requis}"; DB="${2:?db container requis}"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[seed] seed.py via manage.py shell dans $APP..."
docker exec -i "$APP" python manage.py shell < "$TOOLS_DIR/seed.py" | grep -E "^SEED_ID|^SEED_DONE|Traceback|Error" | tail -8
echo "[seed] résolution ids depuis $DB..."
bash "$TOOLS_DIR/gen-urls.sh" "$DB"
