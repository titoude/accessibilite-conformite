#!/usr/bin/env bash
# boot.sh — cycle 52 netbox. Démarre PostgreSQL + Redis + l'app NetBox
# (python:3.12 image cycle, requirements.txt verbatim) sur les ports du cycle.
#
# Usage : bash tools/boot.sh <checkout-netbox> [APP_PORT] [DB_PORT] [REDIS_PORT] [NAME_SUFFIX]
#   défauts : 9300 9311 9312 ""    (install-build : suffixe "-i", ports 9380/9381/9382)
set -euo pipefail

CHECKOUT="$(cd "${1:?chemin du checkout netbox requis}" && pwd)"
APP_PORT="${2:-9300}"
DB_PORT="${3:-9311}"
REDIS_PORT="${4:-9312}"
SFX="${5:-}"
NET="nb52${SFX}"
APP="netbox52-app${SFX}"
DB="netbox52-db${SFX}"
RDS="netbox52-redis${SFX}"
IMG="nb52-app:v4.7.2"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

docker network create "$NET" 2>/dev/null || true

# ---- Image applicative (install verrouillée : requirements.txt verbatim) ----
if ! docker image inspect "$IMG" >/dev/null 2>&1; then
  echo "[boot] build image $IMG (pip install -r requirements.txt)…"
  docker build -f "$TOOLS_DIR/Dockerfile" -t "$IMG" "$CHECKOUT" >/dev/null
fi

# ---- PostgreSQL ----
docker rm -f "$DB" 2>/dev/null || true
docker run -d --name "$DB" --network "$NET" --network-alias netbox52-db \
  -p "${DB_PORT}:5432" \
  -e POSTGRES_USER=netbox -e POSTGRES_PASSWORD=nb52secret -e POSTGRES_DB=netbox \
  postgres:17-alpine >/dev/null

# ---- Redis ----
docker rm -f "$RDS" 2>/dev/null || true
docker run -d --name "$RDS" --network "$NET" --network-alias netbox52-redis \
  -p "${REDIS_PORT}:6379" \
  redis:7-alpine >/dev/null

echo "[boot] attente postgres ($DB)…"
for i in $(seq 1 60); do
  if docker exec "$DB" pg_isready -U netbox -d netbox >/dev/null 2>&1; then break; fi
  [ "$i" = 60 ] && { echo "postgres injoignable" >&2; exit 1; }
  sleep 1
done

# ---- configuration.py (banc, gitignoré upstream) ----
cp "$TOOLS_DIR/configuration.py" "$CHECKOUT/netbox/netbox/configuration.py"

# ---- Migrations (une fois par DB neuve) ----
docker run --rm --network "$NET" --network-alias netbox52-db-check \
  -v "$CHECKOUT:/opt/netbox" -w /opt/netbox/netbox \
  "$IMG" python manage.py migrate --no-input >/dev/null

# ---- App (runserver DEBUG, templates+static servis depuis les sources) ----
docker rm -f "$APP" 2>/dev/null || true
docker run -d --name "$APP" --network "$NET" -p "${APP_PORT}:8000" \
  -v "$CHECKOUT:/opt/netbox" -w /opt/netbox/netbox \
  "$IMG" python manage.py runserver 0.0.0.0:8000 --noreload --insecure >/dev/null

echo "[boot] attente http :$APP_PORT…"
for i in $(seq 1 90); do
  if curl -fsS -o /dev/null "http://localhost:${APP_PORT}/login/" 2>/dev/null; then break; fi
  [ "$i" = 90 ] && { docker logs --tail 30 "$APP" >&2; exit 1; }
  sleep 1
done
echo "[boot] OK : http://localhost:${APP_PORT}/ (admin : login après tools/seed.sh)"
