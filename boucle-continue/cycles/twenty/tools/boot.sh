#!/usr/bin/env bash
# Cycle 54 — boot rejouable twentyhq/twenty @ SHA pinné (manifest.json).
# Chemin retenu : build local depuis les sources (yarn + nx) — le docker compose
# officiel embarque une image publiée dont le SHA n'est pas pinnable/patchable ;
# l'écart image/SHA est donc nul ici (leçon : justifier l'écart image/SHA).
# Usage : bash boot.sh   (idempotent : containers, .env, build, migrate, seed dev, serveur)
set -euo pipefail
cd "$(dirname "$0")"
source ./env.sh

need() { command -v "$1" >/dev/null || { echo "[boot] MISSING: $1" >&2; exit 1; }; }
need docker; need node; need curl

# --- 1. Infra : Postgres :PG_PORT + Redis :REDIS_PORT ---
docker start "$PG_NAME" >/dev/null 2>&1 || docker run -d --name "$PG_NAME" \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=default \
  -p "127.0.0.1:${PG_PORT}:5432" "$PG_IMAGE" >/dev/null
docker start "$REDIS_NAME" >/dev/null 2>&1 || docker run -d --name "$REDIS_NAME" \
  -p "127.0.0.1:${REDIS_PORT}:6379" "$REDIS_IMAGE" >/dev/null
for i in $(seq 1 30); do
  docker exec "$PG_NAME" pg_isready -U postgres >/dev/null 2>&1 && break || sleep 2
done

# --- 2. Config serveur (NODE_PORT est le port réel — pas PORT) ---
cat > "$REPO_DIR/packages/twenty-server/.env" <<EOF
NODE_ENV=production
NODE_PORT=${APP_PORT}
PG_DATABASE_URL=postgres://postgres:postgres@localhost:${PG_PORT}/default
REDIS_URL=redis://localhost:${REDIS_PORT}
APP_SECRET=${APP_SECRET:-c54a11yappsecret0000000000000000000000000000}
SIGN_IN_PREFILLED=true
IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS=false
FRONTEND_URL=${BASE}
SERVER_URL=${BASE}
STORAGE_TYPE=local
STORAGE_LOCAL_PATH=.local-storage
LOGGER_DRIVER=console
EXCEPTION_HANDLER_DRIVER=console
EOF
cat > "$REPO_DIR/packages/twenty-front/.env" <<EOF
REACT_APP_SERVER_BASE_URL=${BASE}
VITE_BUILD_SOURCEMAP=false
EOF

# --- 3. Deps + builds (twenty-shared AVANT tout le reste, AGENTS.md) ---
cd "$REPO_DIR"
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"; [ -f "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
yarn install --immutable
npx nx build twenty-shared
npx nx build twenty-server
if [ "${SKIP_FRONT_BUILD:-0}" != "1" ]; then
  npx nx run twenty-front:lingui:extract
  npx nx run twenty-front:lingui:compile
  NODE_OPTIONS=--max-old-space-size=12288 npx nx build twenty-front
  rm -rf packages/twenty-server/dist/front
  cp -r packages/twenty-front/build packages/twenty-server/dist/front
fi

# --- 4. DB : init + migrations + seed dev (crée workspaces Apple + YCombinator,
#         users tim@apple.dev/…, ~1200 people / 599 companies / 150 opportunities) ---
cd packages/twenty-server
node dist/database/scripts/setup-db.js || node dist/scripts/setup-db.js || true
npx nx run twenty-server:database:migrate -- --include-slow || npx nx run twenty-server:database:migrate
npx nx command-no-deps twenty-server -- workspace:seed:dev || true

# --- 5. Serveur ---
PID=$(ss -tlnp 2>/dev/null | grep ":${APP_PORT} " | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2); [ -n "${PID:-}" ] && kill "$PID" 2>/dev/null || true
sleep 2
(nohup node dist/main.js > "${SERVER_LOG:-/tmp/c54-server.log}" 2>&1 &)
for i in $(seq 1 60); do
  curl -sf -o /dev/null "${BASE}/healthz" 2>/dev/null && break
  curl -sf -o /dev/null "${BASE}/welcome" 2>/dev/null && break
  sleep 2
done
curl -sf -o /dev/null "${BASE}/welcome" && echo "[boot] OK ${BASE}" || { echo "[boot] FAIL serveur" >&2; tail -20 "${SERVER_LOG:-/tmp/c54-server.log}" >&2; exit 1; }
