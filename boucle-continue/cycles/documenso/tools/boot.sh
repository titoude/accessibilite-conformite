#!/usr/bin/env bash
# Cycle 53 — boot rejouable documenso (dev server React Router 7 / vite).
# Usage : tools/boot.sh <repo-dir> <tools-dir>
# Ports injectables via env (défauts = instance principale du cycle) :
#   APP_PORT=9400 PG_PORT=9432 MAIL_WEB=9401 MAIL_SMTP=9402 MAIL_POP3=9403
#   CNT_PREFIX=c53   (suffixes -pg / -mail)
# Rejouable install-build : APP_PORT=9410 PG_PORT=9433 MAIL_WEB=9411
#   MAIL_SMTP=9412 MAIL_POP3=9413 CNT_PREFIX=c53ib tools/boot.sh <clone> <tools>
set -euo pipefail

REPO="$(cd "$1" && pwd)"
TOOLS="$(cd "$2" && pwd)"
APP_PORT="${APP_PORT:-9400}"
PG_PORT="${PG_PORT:-9432}"
MAIL_WEB="${MAIL_WEB:-9401}"
MAIL_SMTP="${MAIL_SMTP:-9402}"
MAIL_POP3="${MAIL_POP3:-9403}"
CNT="${CNT_PREFIX:-c53}"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -f "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "[boot] conteneurs postgres+inbucket ($CNT-*, pg:$PG_PORT mail:$MAIL_WEB/$MAIL_SMTP/$MAIL_POP3)"
for c in "$CNT-pg" "$CNT-mail"; do docker rm -f "$c" >/dev/null 2>&1 || true; done
docker run -d --name "$CNT-pg" \
  -e POSTGRES_USER=documenso -e POSTGRES_PASSWORD=password -e POSTGRES_DB=documenso \
  -p "127.0.0.1:${PG_PORT}:5432" mirror.gcr.io/library/postgres:15 >/dev/null
docker run -d --name "$CNT-mail" \
  -p "127.0.0.1:${MAIL_WEB}:9000" -p "127.0.0.1:${MAIL_SMTP}:2500" -p "127.0.0.1:${MAIL_POP3}:1100" \
  mirror.gcr.io/inbucket/inbucket >/dev/null

echo "[boot] .env"
cat > "$REPO/.env" <<EOF
NEXTAUTH_SECRET="c53-a11y-secret"
NEXT_PRIVATE_ENCRYPTION_KEY="0123456789abcdef0123456789abcdef"
NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY="fedcba9876543210fedcba9876543210"
NEXT_PUBLIC_WEBAPP_URL="http://localhost:${APP_PORT}"
NEXT_PRIVATE_INTERNAL_WEBAPP_URL="http://localhost:${APP_PORT}"
PORT=${APP_PORT}
NEXT_PRIVATE_DATABASE_URL="postgres://documenso:password@127.0.0.1:${PG_PORT}/documenso"
NEXT_PRIVATE_DIRECT_DATABASE_URL="postgres://documenso:password@127.0.0.1:${PG_PORT}/documenso"
NEXT_PRIVATE_SIGNING_TRANSPORT="local"
NEXT_PRIVATE_SIGNING_PASSPHRASE="c53-signing-passphrase"
NEXT_PUBLIC_UPLOAD_TRANSPORT="database"
NEXT_PRIVATE_SMTP_TRANSPORT="smtp-auth"
NEXT_PRIVATE_SMTP_HOST="127.0.0.1"
NEXT_PRIVATE_SMTP_PORT=${MAIL_SMTP}
NEXT_PRIVATE_SMTP_USERNAME="documenso"
NEXT_PRIVATE_SMTP_PASSWORD="password"
NEXT_PRIVATE_SMTP_UNSAFE_IGNORE_TLS="true"
NEXT_PRIVATE_SMTP_FROM_NAME="Documenso"
NEXT_PRIVATE_SMTP_FROM_ADDRESS="noreply@documenso.com"
NEXT_PRIVATE_JOBS_PROVIDER="local"
DOCUMENSO_DISABLE_TELEMETRY="true"
DANGEROUS_BYPASS_RATE_LIMITS="true"
EOF

cd "$REPO"
echo "[boot] npm ci (npm@11.19.1 via npx — engines exigent >=11.17)"
npx --yes npm@11.19.1 ci --no-audit --no-fund

echo "[boot] prisma generate + migrate + seed upstream"
npx npm@11.19.1 run prisma:generate
npx npm@11.19.1 run prisma:migrate-dev
npx npm@11.19.1 run prisma:seed

echo "[boot] seed cycle (MES données) via tools/seed.sh"
"$TOOLS/seed.sh" "$REPO" "$TOOLS"

echo "[boot] i18n compile"
npx npm@11.19.1 run translate:compile

echo "[boot] dev server :$APP_PORT (logs /tmp/c53-dev-${APP_PORT}.log)"
pkill -f "react-router dev.*:${APP_PORT}" 2>/dev/null || true
cd "$REPO"
nohup npx npm@11.19.1 run dev > "/tmp/c53-dev-${APP_PORT}.log" 2>&1 &
echo $! > "/tmp/c53-dev-${APP_PORT}.pid"

echo -n "[boot] attente HTTP 200 sur /signin"
for i in $(seq 1 240); do
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "http://localhost:${APP_PORT}/signin" || true)"
  if [ "$code" = "200" ]; then echo " — OK (${i}s)"; break; fi
  sleep 2
  if [ "$i" = 240 ]; then echo " — TIMEOUT"; tail -30 "/tmp/c53-dev-${APP_PORT}.log"; exit 1; fi
done

echo -n "[boot] préchauffage vite des routes du scope"
while IFS= read -r u; do curl -s -o /dev/null --max-time 120 "http://localhost:${APP_PORT}${u}" || true; done < "$TOOLS/urls-public.txt"
while IFS= read -r u; do curl -s -o /dev/null --max-time 120 "http://localhost:${APP_PORT}${u}" || true; done < "$TOOLS/urls-auth.txt"
echo " — fait"
echo "[boot] prêt : http://localhost:${APP_PORT} (login: node tools/login.mjs http://localhost:${APP_PORT})"
