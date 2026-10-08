#!/usr/bin/env bash
# seed.sh — cycle 56 chatwoot : rejoue tools/seed.rb dans le container rails,
# récupère /tmp/c56-seed-info.json → tools/seed-info.json (source unique des
# ids, leçons 44/46) puis régénère tools/urls-auth.resolved.txt via gen-urls.sh.
# Usage : bash tools/seed.sh [SFX]   (ex. "-i" pour l'instance install-build)
set -euo pipefail
SFX="${1:-}"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RAILS_CTR="$(docker ps --format '{{.Names}}' | grep -E "cw56${SFX}-?rails-1$" | head -1)"
[ -z "$RAILS_CTR" ] && { echo "[seed] container rails introuvable (sfx='$SFX')" >&2; exit 1; }
echo "[seed] container=$RAILS_CTR"
# Le flag d'onboarding (posé par db/seeds.rb upstream) vit dans Redis — on le
# lève pour exposer /app/login à la place du wizard (le seed fournit déjà
# compte+admin, le wizard est redondant pour l'audit).
docker exec -i "$RAILS_CTR" bundle exec rails runner 'Redis::Alfred.delete(Redis::Alfred::CHATWOOT_INSTALLATION_ONBOARDING)'
docker exec -i "$RAILS_CTR" bundle exec rails runner - < "$TOOLS_DIR/seed.rb"
docker exec -i "$RAILS_CTR" cat /tmp/c56-seed-info.json > "$TOOLS_DIR/seed-info.json"
echo "[seed] seed-info.json :"
cat "$TOOLS_DIR/seed-info.json"
bash "$TOOLS_DIR/gen-urls.sh"
echo "[seed] OK — $(wc -l < "$TOOLS_DIR/urls-auth.resolved.txt") urls auth, $(wc -l < "$TOOLS_DIR/urls-public.txt") urls public"
