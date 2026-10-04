#!/usr/bin/env bash
# seed.sh — seed figé du cycle 15 gotify (verbatim, rejouable).
# Usage: ./seed.sh <baseUrl> <adminPass> <outAuth.json>
# Ordre figé -> ids déterministes : bob=2, client harnais devin-audit=1,
# app Monitoring=1, client Firefox-Desktop=2, messages=1(texte),2(markdown+liens).
set -euo pipefail
BASE="${1:-http://127.0.0.1:8095}"
PASS="${2:-gotify-admin-audit}"
AUTH="${3:-./auth.json}"
DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. utilisateur non-admin 'bob' (id=2)
curl -s -u "admin:${PASS}" -X POST "$BASE/user" \
  -H 'Content-Type: application/json' \
  -d '{"name":"bob","pass":"bob-audit-pass","admin":false}'
echo

# 2. session harnais : purge+crée le client 'devin-audit' (id=1), écrit le storage-state
node "$DIR/login.mjs" "$BASE" admin "$PASS" "$AUTH"

# 3. application 'Monitoring' (id=1, image static/defaultapp.png par défaut)
curl -s -u "admin:${PASS}" -X POST "$BASE/application" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Monitoring","description":"Alertes infrastructure"}'
echo

# 4. client UI 'Firefox-Desktop' (id=2)
curl -s -u "admin:${PASS}" -X POST "$BASE/client" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Firefox-Desktop"}'
echo

# 5. message 1 — texte plein, priorité 0
curl -s -u "admin:${PASS}" -X POST "$BASE/message" \
  -H 'Content-Type: application/json' \
  -d '{"appid":1,"title":"Sauvegarde nightly","message":"Sauvegarde du serveur terminée sans erreur à 03:12.","priority":0}'
echo

# 6. message 2 — markdown priorité 8, DEUX liens réels rendus en <a href>
curl -s -u "admin:${PASS}" -X POST "$BASE/message" \
  -H 'Content-Type: application/json' \
  -d '{"appid":1,"title":"Déploiement prod","message":"Build [#482](https://ci.example.internal/builds/482) déployé en production — voir le [changelog complet](https://ci.example.internal/changelog).","priority":8,"extras":{"client::display":{"contentType":"text/markdown"}}}'
echo
echo "seed terminé sur $BASE"
