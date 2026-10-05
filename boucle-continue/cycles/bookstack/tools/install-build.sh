#!/usr/bin/env bash
# install-build.sh — rejoue TOUTE la chaîne sur clone propre au SHA épinglé :
# clone → checkout SHA → apply patch.diff → docker compose up → composer +
# migrate + build node (via les entrypoints upstream) → seed → sonde HTTP.
# Sortie : install-build.txt (log verbatim). Ports : DEV_PORT=8081.
set -euo pipefail

CYCLE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SHA="f585a7d9100a99cba8479c1ef5fd56e05562daea"
WORK="${BOOKSTACK_INSTALL_DIR:-$HOME/work/bookstack-install-build}"
PORT="${A11Y_PORT:-8081}"
MAIL_PORT="${A11Y_MAIL_PORT:-8026}"

echo "== clone propre → $WORK"
if [ -f "$WORK/docker-compose.yml" ]; then
  docker compose -f "$WORK/docker-compose.yml" down -v 2>/dev/null || true
fi
if [ -d "$WORK" ]; then
  # fichiers root créés par les conteneurs (vendor, storage, .env, dist) →
  # suppression du clone entier via docker (rm -rf local échoue sur eux)
  docker run --rm -v "$WORK:/w" node:22-alpine sh -c 'rm -rf /w/* /w/.[!.]*' 2>/dev/null || true
fi
rm -rf "$WORK"
git clone --quiet "$HOME/work/bookstack" "$WORK"
cd "$WORK"
git checkout --quiet "$SHA"
git rev-parse HEAD

echo "== apply patch.diff"
git apply --check "$CYCLE_DIR/patch.diff"
git apply "$CYCLE_DIR/patch.diff"
git diff --stat | tail -3

echo "== .env depuis .env.example (verbatim manifest.boot)"
cp .env.example .env

echo "== docker compose up (DEV_PORT=$PORT DEV_MAIL_PORT=$MAIL_PORT)"
DEV_PORT=$PORT DEV_MAIL_PORT=$MAIL_PORT docker compose up -d --build
docker compose ps --format 'table {{.Name}}\t{{.Status}}'

echo "== attente app (composer install + migrate dans entrypoint.app.sh)"
for i in $(seq 1 90); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/login" || true)
  [ "$code" = "200" ] && break
  sleep 5
done
code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/login")
echo "GET /login → $code"

echo "== key:generate (verbatim manifest.boot)"
docker compose exec -T app php artisan key:generate --force
code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/login")
echo "GET /login post-key → $code"
[ "$code" = "200" ]

echo "== attente build node (dist/styles.css sert le patch)"
for i in $(seq 1 60); do
  curl -sf "http://localhost:$PORT/dist/styles.css" | grep -q 'menu-backdrop' && break
  sleep 5
done
curl -sf "http://localhost:$PORT/dist/styles.css" | grep -c 'menu-backdrop\|scroll-padding' || true

echo "== seed démo (seed.sh verbatim)"
BOOKSTACK_DIR="$WORK" A11Y_BASE="http://localhost:$PORT" bash "$CYCLE_DIR/tools/seed.sh"

echo "== sondes HTTP post-seed"
for u in / /books /books/demo-a11y-book "/books/demo-a11y-book/page/page-demo-a11y" /login; do
  echo "GET $u → $(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT$u")"
done

echo "== install-build terminé : clone + patch + compose + migrate + build + seed OK"
