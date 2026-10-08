#!/usr/bin/env bash
# boot.sh — cycle 50 castopod. Démarre MariaDB + php spark serve sur les ports du cycle.
# Usage : bash tools/boot.sh <checkout-castopod> [APP_PORT] [DB_PORT] [NAME_SUFFIX]
#   défauts : 9170 9171 ""   (install-build : suffixe "-i", ports 9180/9181)
set -euo pipefail

CHECKOUT="${1:?chemin du checkout castopod requis}"
APP_PORT="${2:-9170}"
DB_PORT="${3:-9171}"
SFX="${4:-}"
NET="cp50${SFX}"
APP="castopod50${SFX}"
DB="castopod50-db${SFX}"

docker network create "$NET" 2>/dev/null || true

# ---- MariaDB ----
docker rm -f "$DB" 2>/dev/null || true
docker run -d --name "$DB" --network "$NET" -p "${DB_PORT}:3306" \
  -e MARIADB_ROOT_PASSWORD=cp50root \
  -e MARIADB_DATABASE=castopod \
  -e MARIADB_USER=castopod \
  -e MARIADB_PASSWORD=cp50secret \
  mariadb:11.4 >/dev/null

# ---- .env (idempotent : ne régénère que si absent ou port différent) ----
ENV_FILE="$CHECKOUT/.env"
if [ ! -f "$ENV_FILE" ] || ! grep -q "localhost:${APP_PORT}/" "$ENV_FILE"; then
  SALT="$(head -c32 /dev/urandom | od -An -tx1 | tr -d ' \n')"
  cat > "$ENV_FILE" <<EOF
app.baseURL="http://localhost:${APP_PORT}/"
media.baseURL="http://localhost:${APP_PORT}/media/"
admin.gateway="cp-admin"
auth.gateway="cp-auth"
analytics.salt="${SALT}"
database.default.hostname="${DB}"
database.default.database="castopod"
database.default.username="castopod"
database.default.password="cp50secret"
database.default.DBPrefix="cp_"
cache.handler="file"
app.forceGlobalSecureRequests=false
EOF
fi

# ---- Attente DB ----
echo "[boot] attente mariadb ($DB)…"
for i in $(seq 1 60); do
  if docker exec "$DB" mariadb -ucastopod -pcp50secret -e 'SELECT 1' castopod >/dev/null 2>&1; then
    break
  fi
  [ "$i" = 60 ] && { echo "mariadb injoignable" >&2; exit 1; }
  sleep 1
done

# ---- App (php spark serve) ----
docker rm -f "$APP" 2>/dev/null || true
mkdir -p "$CHECKOUT/writable" "$CHECKOUT/public/media"
docker run -d --name "$APP" --network "$NET" -p "${APP_PORT}:8080" \
  -v "$CHECKOUT:/app" -w /app \
  cp50-php:8.2 php spark serve --host 0.0.0.0 --port 8080 >/dev/null

echo "[boot] attente http :$APP_PORT…"
for i in $(seq 1 60); do
  if curl -fsS -o /dev/null "http://localhost:${APP_PORT}/health" 2>/dev/null; then
    break
  fi
  [ "$i" = 60 ] && { docker logs --tail 20 "$APP" >&2; exit 1; }
  sleep 1
done
echo "[boot] OK : http://localhost:${APP_PORT}/"
