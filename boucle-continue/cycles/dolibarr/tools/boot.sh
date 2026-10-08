#!/usr/bin/env bash
# boot.sh — cycle 57 dolibarr. Démarre la stack : mariadb 11.8 + web
# php:8.3-apache (image doli57-web:24.0.2 buildée depuis tools/Dockerfile)
# avec le CHECKOUT Dolibarr @SHA bind-monté sur /var/www/html (le patch
# porte sur htdocs/ — la montée directe du working tree rend le patch
# observable sans rebuild) + /var/www/documents en volume nommé.
#
# Setup complet rejouable : si htdocs/conf/conf.php manque (clone propre —
# conf.php est gitignored upstream), boot.sh rejoue l'install CLI officielle
# (step1 conf+db → step2 tables → step4 → step5 admin) + install.lock.
# Idempotent : conf présente + db remplie => les étapes sont sautées.
#
# Usage : bash tools/boot.sh <checkout-dolibarr> [UI_PORT] [SUFFIX]
#   défauts : 9800 ""    (vanilla : 9820 "-v", install-build : 9810 "-i")
set -euo pipefail

CHECKOUT="$(cd "${1:?chemin du checkout dolibarr requis}" && pwd)"
UI_PORT="${2:-9800}"
SUFFIX="${3:-}"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export CHECKOUT UI_PORT SUFFIX TOOLS_DIR
PROJECT="doli57${SUFFIX}"
IMAGE="doli57-web:24.0.2"

DB_PASS='Doli57-Bench-2026'
ADMIN_PASS='Doli57-Admin-2026'
export DB_PASS

[ -d "$CHECKOUT/htdocs" ] || { echo "[boot] ERREUR : $CHECKOUT/htdocs absent" >&2; exit 1; }

if ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
  echo "[boot] build image $IMAGE depuis tools/Dockerfile…"
  docker build -t "$IMAGE" -f "$TOOLS_DIR/Dockerfile" "$TOOLS_DIR"
fi

docker compose -p "$PROJECT" -f "$TOOLS_DIR/docker-compose.yml" up -d

WEB="${PROJECT}-web"; DB="${PROJECT}-db"
echo "[boot] attente mariadb…"
for i in $(seq 1 60); do
  if docker exec "$DB" mariadb -uroot -prootpass -e 'SELECT 1' >/dev/null 2>&1; then break; fi
  [ "$i" = 60 ] && { docker logs --tail 30 "$DB" >&2; exit 1; }
  sleep 2
done

echo "[boot] attente web :$UI_PORT…"
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:${UI_PORT}/index.php" 2>/dev/null || true)
  [ "$code" = "200" ] || [ "$code" = "302" ] && break
  [ "$i" = 60 ] && { docker logs --tail 30 "$WEB" >&2; exit 1; }
  sleep 2
done

# ---------- install CLI si nécessaire ----------
# Cas : (a) conf.php absente (clone propre) -> step1..5 ;
#       (b) conf présente mais base vide (nouveau volume) -> step2..5 ;
#       (c) conf + tables -> tout est sauté.
TABLES=$(docker exec "$DB" mariadb -udoli -p"$DB_PASS" dolibarr -N -e \
  "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='dolibarr' AND table_name='llx_user'" 2>/dev/null || echo 0)

# volume nommé : docker le crée en root:root — www-data doit pouvoir y écrire
docker exec -u root "$WEB" bash -c 'mkdir -p /var/www/documents && chown www-data:www-data /var/www/documents'

if [ ! -f "$CHECKOUT/htdocs/conf/conf.php" ]; then
  echo "[boot] install : conf/conf.php + wizard CLI…"
  # un clone propre a conf/ en 755 ubuntu — www-data (33) ne peut pas y ecrire
  chmod 777 "$CHECKOUT/htdocs/conf"
  docker exec -u www-data "$WEB" bash -c 'touch /var/www/html/htdocs/conf/conf.php && chmod 666 /var/www/html/htdocs/conf/conf.php'
  docker exec -u www-data -w /var/www/html/htdocs/install "$WEB" php step1.php set en_US \
    /var/www/html/htdocs /var/www/documents "http://localhost:${UI_PORT}" \
    root rootpass mysqli "$DB" dolibarr doli "$DB_PASS" 3306 llx_ 0 0 > /dev/null \
    || { echo "[boot] ERREUR step1 — relancer à la main pour voir le détail" >&2; exit 1; }
  [ -s "$CHECKOUT/htdocs/conf/conf.php" ] || { echo "[boot] ERREUR : conf.php vide après step1" >&2; exit 1; }
fi

if [ "${TABLES:-0}" = "0" ]; then
  echo "[boot] base vide : step2 (tables) + step4 + step5 (admin)…"
  docker exec -u www-data -w /var/www/html/htdocs/install "$WEB" php step2.php set en_US > /dev/null
  docker exec -u www-data -w /var/www/html/htdocs/install "$WEB" php step4.php en_US > /dev/null
  docker exec -u www-data -w /var/www/html/htdocs/install "$WEB" php step5.php \
    '24.0.0' '24.0.2' en_US set admin "$ADMIN_PASS" "$ADMIN_PASS" 1 > /dev/null
  docker exec -u www-data "$WEB" bash -c 'mkdir -p /var/www/documents && touch /var/www/documents/install.lock'
  echo "[boot] install OK (admin/${ADMIN_PASS})"
else
  echo "[boot] conf + tables présentes — install sautée"
fi

echo "[boot] OK : http://localhost:${UI_PORT}/index.php (admin/${ADMIN_PASS})"
