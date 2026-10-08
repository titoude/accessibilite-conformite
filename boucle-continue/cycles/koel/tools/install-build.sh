#!/usr/bin/env bash
# install-build.sh — cycle 49 koel : rejoue l'install verbatim depuis zéro.
# clone propre @SHA -> git apply --check patch.diff -> deps -> build -> docker -> init -> seed -> rescan.
set -euxo pipefail
SHA=72ab1e8d9bc4b744b2043a5259e1a06d733a9a29
WORK=$HOME/work/koel49-install
MEDIA=$HOME/work/koel49-install-media
HERE="$(cd "$(dirname "$0")" && pwd)"
CYCLE="$(dirname "$HERE")"
export NVM_DIR=$HOME/.nvm; . "$NVM_DIR/nvm.sh"

rm -rf "$WORK" "$MEDIA"
mkdir -p "$MEDIA"

# 1. clone propre à l'exact SHA du manifeste
git clone https://github.com/koel/koel.git "$WORK"
cd "$WORK" && git checkout "$SHA"

# 2. patch : check sec puis application
git apply --check "$CYCLE/patch.diff"
git apply "$CYCLE/patch.diff"

# 3. dépendances front + build vite (mêmes commandes que l'install d'origine)
pnpm install --frozen-lockfile
pnpm build

# 4. env : même contenu que l'install d'origine, seul le port change (9048)
cp .env.example .env
sed -i \
  -e 's|^APP_URL=.*|APP_URL=http://localhost:9048|' \
  -e 's|^DB_CONNECTION=.*|DB_CONNECTION=sqlite-persistent|' \
  -e 's|^DB_DATABASE=.*|DB_DATABASE=/koel/database/koel.sqlite|' \
  -e 's|^MEDIA_PATH=.*|MEDIA_PATH=/media|' \
  -e 's|^YOUTUBE_API_KEY=.*|YOUTUBE_API_KEY=koel49-dummy-audit-key|' \
  .env
mkdir -p database && touch database/koel.sqlite

# 5. composer via conteneur jetable (vendor doit exister avant artisan serve)
docker run --rm -v "$WORK:/koel" koel49-php composer install --no-dev --optimize-autoloader

# 6. conteneur : même image koel49-php (Dockerfile koel49-runtime), port 9048
docker rm -f koel49-install 2>/dev/null || true
docker run -d --name koel49-install -p 9048:8000 \
  -v "$WORK:/koel" -v "$MEDIA:/media" \
  koel49-php php artisan serve --host=0.0.0.0 --port=8000

# 7. init koel (verbatim install d'origine)
docker exec koel49-install php artisan key:generate --force
docker exec koel49-install php artisan koel:init -n --no-assets --no-scheduler
docker exec koel49-install php artisan config:cache

# 8. seed rejouable (mêmes données que l'install d'origine)
KOEL_CONTAINER=koel49-install SEED_MEDIA_DIR="$MEDIA" python3 "$HERE/seed.py" http://localhost:9048 "$MEDIA"

# 9. login -> auth-install.json, puis rescan complet
cd "$HERE"
KOEL_BASE=http://localhost:9048 node login.mjs http://localhost:9048 auth-install.json || true
node audit.mjs --urls "$(paste -sd, urls-public.txt)" --out ../reports/installbuild-public --states none --wait-for '#app' --wait 2500 http://localhost:9048
node audit.mjs --urls "$(paste -sd, urls-auth.txt)" --out ../reports/installbuild-auth --states none --storage-state auth-install.json --wait-for '#app nav' --wait 2500 http://localhost:9048
node audit.mjs --urls "/#/songs" --out ../reports/installbuild-states --states all --storage-state auth-install.json --wait-for '#app nav' --wait 2500 http://localhost:9048
