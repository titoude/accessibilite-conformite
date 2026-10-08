#!/usr/bin/env bash
# boot.sh — stack cycle 58 SuiteCRM-Core (web apache/php 8.3 + mariadb 11.4).
# Usage: bash tools/boot.sh <checkout-suitecrm-core> [web_port db_suffix]
#   checkout : clone SuiteCRM-Core au SHA épinglé (bind-monté, code audité)
#   web_port : port hôte exposé (défaut 9950)
#   suffix   : suffixe des noms de conteneurs (défaut = web_port) — permet
#              d'empiler patché / vanilla / install-build en parallèle.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
CHECKOUT="$(cd "$1" && pwd)"
PORT="${2:-9950}"
SUFFIX="${3:-$PORT}"
export SC_CHECKOUT="$CHECKOUT" SC_WEB_PORT="$PORT"
export COMPOSE_PROJECT_NAME="sc58-${SUFFIX}"

cd "$HERE"
docker compose build web
docker compose up -d --wait

# composer install dans le checkout bind-monté (vendor/ gitignoré) —
# idempotent : sauté si vendor/autoload.php existe déjà.
if [ ! -f "$CHECKOUT/vendor/autoload.php" ]; then
  echo "[boot] composer install (~3-6 min)…"
  # --no-dev impossible : les post-install scripts chargent DoctrineFixturesBundle
  docker exec "sc58-${SUFFIX}-web-1" composer install --prefer-dist --no-interaction
fi

# .env.local racine (writable via docker exec car bind-mount appartient à l'hôte)
docker exec "sc58-${SUFFIX}-web-1" bash -c '
  cat > /var/www/html/.env.local <<EOF
APP_ENV=prod
APP_DEBUG=0
DATABASE_URL="mysql://suitecrm:${SC_DB_PASS:-sc-app-pass}@db:3306/suitecrm"
APP_SECRET=700191d2e2b087d29089c8bf92dd651c
EOF
'

docker exec "sc58-${SUFFIX}-web-1" bash -c '
  set -e
  chown -R www-data:www-data /var/www/html/var /var/www/html/logs /var/www/html/public/legacy/cache /var/www/html/public/legacy/upload 2>/dev/null || true
  chmod -R 775 /var/www/html/public/legacy/cache /var/www/html/public/legacy/upload 2>/dev/null || true
'

# Install applicative : config.php legacy + schéma + admin — idempotent
# (sauté si config.php existe déjà ET contient notre site_name SC58).
if ! docker exec "sc58-${SUFFIX}-web-1" bash -c "grep -q \"'site_name' => 'SC58'\" /var/www/html/public/legacy/config.php 2>/dev/null"; then
  echo "[boot] suitecrm:app:install (~2-5 min)…"
  docker exec "sc58-${SUFFIX}-web-1" bash -c '
    php bin/console suitecrm:app:install \
      -U suitecrm -P "${SC_DB_PASS:-sc-app-pass}" -H db -Z 3306 -N suitecrm \
      -u admin -p "Sc58-Admin-Pass!" -S "http://localhost/'"$PORT"'" \
      -W true --no-interaction
    sed -i "s/\x27site_name\x27 => .*/\x27site_name\x27 => \x27SC58\x27,/" /var/www/html/public/legacy/config.php || true
    chown -R www-data:www-data /var/www/html/var /var/www/html/logs /var/www/html/public/legacy/cache /var/www/html/public/legacy/upload /var/www/html/public/legacy/config.php 2>/dev/null || true
  '
fi

# L'installateur réécrit .env.local (APP_SECRET random + env non prod) :
# ré-assertion prod après install — le profiler dev ne doit JAMAIS être servi.
docker exec "sc58-${SUFFIX}-web-1" bash -c '
  cat > /var/www/html/.env.local <<EOF
APP_ENV=prod
APP_DEBUG=0
DATABASE_URL="mysql://suitecrm:${SC_DB_PASS:-sc-app-pass}@db:3306/suitecrm"
APP_SECRET=700191d2e2b087d29089c8bf92dd651c
EOF
  rm -rf /var/www/html/var/cache/prod/* 2>/dev/null || true
  chown -R www-data:www-data /var/www/html/var 2>/dev/null || true
'

echo "[boot] prêt : http://localhost:$PORT (db interne : db:3306, base suitecrm)"
echo "[boot] seed   : node tools/seed.mjs $PORT  (comptes/contacts/leads/opp SC58, ids fixes)"
echo "[boot] login  : node tools/login.mjs $PORT (regénère tools/auth.json)"
