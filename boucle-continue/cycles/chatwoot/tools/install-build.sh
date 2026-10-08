#!/usr/bin/env bash
# install-build.sh — cycle 56 chatwoot : rejoue l'install verbatim depuis zéro.
# clone propre @SHA -> git apply --check patch.diff -> docker build -> boot -> seed -> rescan.
# Usage : bash tools/install-build.sh [PORT]   (défaut 9760 ; DB=+1, redis=+2)
set -euxo pipefail
SHA=f4bc89957b5e49dab3cd1d1c074248e60ac43d2e
PORT="${1:-9760}"
WORK=$HOME/work/chatwoot56-install
HERE="$(cd "$(dirname "$0")" && pwd)"
CYCLE="$(dirname "$HERE")"
SFX=i   # projet compose cw56i — disjoint de l'instance dev cw56 (:9700)

# 1. clone propre à l'exact SHA du manifeste
rm -rf "$WORK"
git clone https://github.com/chatwoot/chatwoot.git "$WORK"
cd "$WORK" && git checkout "$SHA"

# 2. patch : check sec puis application
git apply --check "$CYCLE/patch.diff"
git apply "$CYCLE/patch.diff"

# 3. build image (verbatim Dockerfile officiel docker/Dockerfile)
docker build -f docker/Dockerfile -t cw56i-app:latest .

# 4. boot stack (compose cycle : rails+sidekiq+postgres+redis)
CW_IMAGE=cw56i-app:latest bash "$HERE/boot.sh" "$WORK" "$PORT" "$SFX" --no-build || true
# 4b. volume vierge → migrations non jouées par l'entrypoint : db:prepare puis restart
CW_IMAGE=cw56i-app:latest docker compose --env-file "$HERE/.env${SFX}" -f "$HERE/docker-compose.yml" run --rm --entrypoint bundle rails exec rails db:prepare
docker start "cw56${SFX}-rails-1" "cw56${SFX}-sidekiq-1"
for i in $(seq 1 120); do
  curl -fsS -o /dev/null "http://localhost:$PORT/app/login" 2>/dev/null && break
  sleep 5
done

# 5. seed rejouable (mêmes données, ids résolus par l'app → seed-info.json régénéré)
bash "$HERE/seed.sh" "$SFX"

# 6. login -> auth-install.json, puis rescan complet (mêmes urls/états que le final)
cd "$HERE"
node login.mjs "http://localhost:$PORT"
mv -f auth.json auth-install.json
PUB=$(paste -sd, urls-public.txt)
AUTH=$(paste -sd, urls-auth.resolved.txt)
node audit.mjs "http://localhost:$PORT" --urls "$PUB" --states none --out ../reports/installbuild-public
node audit.mjs "http://localhost:$PORT" --urls "$AUTH" --states all --storage-state auth-install.json --out ../reports/installbuild-auth
