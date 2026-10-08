#!/usr/bin/env bash
# Cycle 48 — seed rejouable plausible/analytics (TES données).
# Usage : source ../env.sh (ou variables équivalentes) puis bash seed.sh
# Pré-requis : containers ${PG_NAME} / ${CH_NAME} démarrés, mix deps.get + assets faits.
# Données : seed upstream priv/repo/seeds.exs (user@plausible.test/plausible,
# sites dummy.site + another.site, goals, funnels, imports, 720j de stats CH)
# + shared link « Audit C48 » slug audit-c48-shared (SQL direct, idempotent).
set -euo pipefail
cd "$(dirname "$0")/.."   # racine du cycle — pas du repo plausible
PLAUSIBLE_DIR="${PLAUSIBLE_DIR:-/home/ubuntu/work/c48/plausible}"
cd "$PLAUSIBLE_DIR"

mix run priv/repo/seeds.exs

docker exec "${PG_NAME:-c48-pg}" psql -U postgres -d plausible_dev -c \
  "INSERT INTO shared_links (site_id, slug, name, inserted_at, updated_at) \
   SELECT s.id, 'audit-c48-shared', 'Audit C48 Shared Link', now(), now() \
   FROM sites s WHERE s.domain='dummy.site' \
   ON CONFLICT DO NOTHING"

cat > "$(dirname "$0")/seed-info.json" <<'JSON'
{"user":{"email":"user@plausible.test","password":"plausible","name":"Jane Smith"},
 "sites":["dummy.site","another.site"],"sharedLink":{"slug":"audit-c48-shared",
 "url":"/share/dummy.site?auth=audit-c48-shared"}}
JSON
echo "[seed] OK — user@plausible.test / dummy.site / shared-link audit-c48-shared"
