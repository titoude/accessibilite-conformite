#!/usr/bin/env bash
# boot.sh — cycle 55 lemmy. Démarre la stack officielle adaptée :
# postgres 16 + pictrs 0.5.16 + lemmy (image officielle dessalines/lemmy:TAG,
# backend non patché) + lemmy-ui buildé DEPUIS LE CLONE @SHA (pnpm install +
# pnpm build:prod → dist/, servi par node:20-slim bind-mount) + nginx proxy.
#
# Prérequis dans le checkout : `pnpm install && pnpm build:prod` déjà exécuté
# (dist/js/server.js + node_modules présents — node:20-slim = même glibc).
#
# Usage : bash tools/boot.sh <checkout-lemmy-ui> [UI_PORT] [API_PORT] [PICTRS_PORT] [PG_PORT] [SUFFIX]
#   défauts : 9655 9656 9657 9659 ""    (vanilla : 967x "-v", install-build : 966x "-i")
set -euo pipefail

CHECKOUT="$(cd "${1:?chemin du checkout lemmy-ui requis}" && pwd)"
UI_PORT="${2:-9655}"
API_PORT="${3:-9656}"
PICTRS_PORT="${4:-9657}"
PG_PORT="${5:-9659}"
SUFFIX="${6:-}"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export CHECKOUT UI_PORT API_PORT PICTRS_PORT PG_PORT SUFFIX TOOLS_DIR
PROJECT="lm55${SUFFIX}"

# Sanity : le build doit exister avant de monter le checkout
if [ ! -f "$CHECKOUT/dist/js/server.js" ] || [ ! -d "$CHECKOUT/node_modules" ]; then
  echo "[boot] ERREUR : $CHECKOUT/dist/js/server.js ou node_modules absent —" >&2
  echo "       exécuter d'abord : cd <checkout> && pnpm install && pnpm build:prod" >&2
  exit 1
fi

# Config lemmy.hjson par instance (hostname externe = port public de la stack)
mkdir -p "$TOOLS_DIR/generated"
sed "s/{{UI_PORT}}/${UI_PORT}/g" "$TOOLS_DIR/lemmy.hjson.tpl" > "$TOOLS_DIR/generated/lemmy${SUFFIX}.hjson"

docker compose -p "$PROJECT" -f "$TOOLS_DIR/docker-compose.yml" up -d

echo "[boot] attente lemmy api :$API_PORT…"
for i in $(seq 1 150); do
  if curl -fsS -o /dev/null "http://localhost:${API_PORT}/api/v3/site" 2>/dev/null; then break; fi
  [ "$i" = 150 ] && { docker logs --tail 40 "lm55-lemmy${SUFFIX}" >&2; exit 1; }
  sleep 2
done

echo "[boot] attente lemmy-ui via proxy :$UI_PORT…"
for i in $(seq 1 90); do
  if curl -fsS -o /dev/null -H "Accept: text/html" "http://localhost:${UI_PORT}/" 2>/dev/null; then break; fi
  [ "$i" = 90 ] && { docker logs --tail 40 "lm55-ui${SUFFIX}" >&2; exit 1; }
  sleep 2
done
echo "[boot] OK : http://localhost:${UI_PORT}/ (api :${API_PORT}, pg :${PG_PORT}, pictrs :${PICTRS_PORT})"
