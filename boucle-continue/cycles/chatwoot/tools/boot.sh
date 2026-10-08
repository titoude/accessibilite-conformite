#!/usr/bin/env bash
# boot.sh — cycle 56 chatwoot. Build l'image via docker/Dockerfile upstream
# VERBATIM sur le checkout courant (écart image/SHA nul), puis lance le
# compose officiel adapté (rails+sidekiq+postgres+redis) sur les ports cycle.
#
# Usage : bash tools/boot.sh <checkout-chatwoot> [APP_PORT] [SFX] [--no-build]
#   ex. dev   : bash tools/boot.sh ~/work/chatwoot 9700
#   ex. ib    : bash tools/boot.sh ~/work/chatwoot-ib 9710 -i --no-build (image déjà buildée)
# SFX = suffixe projet/noms ("" dev, "-i" install-build). Ports dérivés du
# APP_PORT : db=APP_PORT+1, redis=APP_PORT+2.
set -euo pipefail
CHECKOUT="$(cd "${1:?checkout}" && pwd)"
APP_PORT="${2:-9700}"
SFX="${3:-}"
NO_BUILD="${4:-}"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SHA="$(git -C "$CHECKOUT" rev-parse HEAD)"
IMG="cw56-app:${SHA:0:12}"
DB_PORT=$((APP_PORT+1)); REDIS_PORT=$((APP_PORT+2))
PROJ="cw56${SFX//-}"

if [ "$NO_BUILD" != "--no-build" ]; then
  echo "[boot] build image $IMG depuis docker/Dockerfile upstream (patience : bundle+pnpm+precompile)…"
  git -C "$CHECKOUT" rev-parse HEAD > /dev/null
  docker build -f "$CHECKOUT/docker/Dockerfile" -t "$IMG" "$CHECKOUT"
fi

ENVF="$TOOLS_DIR/.env${SFX//-}"
sed -e "s/^FRONTEND_URL=.*/FRONTEND_URL=http:\/\/localhost:${APP_PORT}/" \
    -e "s/^APP_PORT=.*/APP_PORT=${APP_PORT}/" \
    -e "s/^DB_PORT=.*/DB_PORT=${DB_PORT}/" \
    -e "s/^REDIS_PORT=.*/REDIS_PORT=${REDIS_PORT}/" \
    -e "s/^CW_IMAGE=.*/CW_IMAGE=${IMG}/" \
    -e "s/^COMPOSE_PROJECT_NAME=.*/COMPOSE_PROJECT_NAME=${PROJ}/" \
    "$TOOLS_DIR/env.tpl" > "$ENVF"

docker compose --env-file "$ENVF" -f "$TOOLS_DIR/docker-compose.yml" up -d --remove-orphans
echo "[boot] attente http :$APP_PORT…"
for i in $(seq 1 240); do
  if curl -fsS -o /dev/null "http://localhost:${APP_PORT}/app/login" 2>/dev/null; then
    echo "[boot] OK http://localhost:${APP_PORT}/app/login"
    exit 0
  fi
  # rails mort (ex. volume DB vierge sans migrations) → sortie anticipée bruyante
  if [ "$(docker inspect -f '{{.State.Status}}' "${PROJ}-rails-1" 2>/dev/null)" = "exited" ]; then
    echo "[boot] rails-1 exited — migration probablement requise (db:prepare)" >&2
    docker compose --env-file "$ENVF" -f "$TOOLS_DIR/docker-compose.yml" logs rails --tail 20 >&2
    exit 1
  fi
  [ "$i" = 240 ] && { docker compose --env-file "$ENVF" -f "$TOOLS_DIR/docker-compose.yml" logs rails --tail 60 >&2; exit 1; }
  sleep 2
done
