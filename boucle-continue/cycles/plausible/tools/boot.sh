#!/usr/bin/env bash
# Cycle 48 — boot rejouable plausible/analytics sur :89xx (premier Elixir de la boucle).
# Usage : BOOT_ROOT=/home/ubuntu/work/c48 REPO=$BOOT_ROOT/plausible bash boot.sh
# Rejoue : containers PG/CH sur ports 89xx, CONFIG_DIR overrides, ecto+assets,
# tracker deploy, geo db, seed, serveur :8950 (démon via nohup).
set -euo pipefail
BOOT_ROOT="${BOOT_ROOT:-/home/ubuntu/work/c48}"
REPO="${REPO:-$BOOT_ROOT/plausible}"
APP_PORT="${APP_PORT:-8950}"
PG_PORT="${PG_PORT:-8952}"
CH_PORT="${CH_PORT:-8953}"
PG_NAME="${PG_NAME:-c48-pg}"
CH_NAME="${CH_NAME:-c48-ch}"

# 1. Containers (mirror.gcr.io — docker.io rate-limité)
docker run -d --name "$PG_NAME" -e POSTGRES_PASSWORD=postgres \
  -p 127.0.0.1:${PG_PORT}:5432 -v c48-pg:/var/lib/postgresql \
  mirror.gcr.io/library/postgres:18 2>/dev/null || docker start "$PG_NAME"
docker run -d --name "$CH_NAME" -p 127.0.0.1:${CH_PORT}:8123 \
  -e CLICKHOUSE_SKIP_USER_SETUP=1 -e CLICKHOUSE_DB=plausible_events_db \
  mirror.gcr.io/clickhouse/clickhouse-server:25.11.5.8-alpine \
  2>/dev/null || docker start "$CH_NAME"

# 2. Toolchain (PATH — voir env.sh)
export PATH="$HOME/runtimes/otp/OTP-28.5.0.5/OTP-28.5.0.5/bin:$HOME/runtimes/elixir/v1.20.4-otp-28/bin:$PATH"
export MIX_ENV=dev CONFIG_DIR="$BOOT_ROOT/secrets" \
  SECRET_KEY_BASE=/njrhntbycvastyvtk1zycwfm981vpo/0xrvwjjvemdakc/vsvbrevlwsc6u8rcg \
  TOTP_VAULT_KEY=3C7A3874614A832A63326C6A696E6E633266726B5A676E316F4E796C6444314A634F726950554942773D \
  ENVIRONMENT=dev MAILER_ADAPTER=Bamboo.LocalAdapter SELFHOST=false \
  DISABLE_CRON=true ADMIN_USER_IDS=1 SHOW_CITIES=true LOG_LEVEL=info SECURE_COOKIE=false
mkdir -p "$CONFIG_DIR"
printf 'postgres://postgres:postgres@127.0.0.1:%s/plausible_dev' "$PG_PORT" > "$CONFIG_DIR/DATABASE_URL"
printf 'http://127.0.0.1:%s/plausible_events_db' "$CH_PORT" > "$CONFIG_DIR/CLICKHOUSE_DATABASE_URL"
printf 'http://localhost:%s' "$APP_PORT" > "$CONFIG_DIR/BASE_URL"
printf '%s' "$APP_PORT" > "$CONFIG_DIR/HTTP_PORT"
source "$HOME/.nvm/nvm.sh" 2>/dev/null || true

TOOLS_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$REPO"
mix local.hex --force && mix local.rebar --force
mix deps.get
mix ecto.create && mix ecto.migrate
npm ci --prefix assets && npm ci --prefix tracker
mix assets.setup && mix assets.build
npm run deploy --prefix tracker
mix download_country_database
PG_NAME="$PG_NAME" PLAUSIBLE_DIR="$REPO" bash "$TOOLS_DIR/seed.sh"

# 3. Serveur
nohup mix phx.server > "$BOOT_ROOT/server.log" 2>&1 &
echo "[boot] phx.server pid=$! — http://localhost:${APP_PORT}"
sleep 12
curl -sf -o /dev/null "http://localhost:${APP_PORT}/login" && echo "[boot] /login 200"
