#!/usr/bin/env bash
# Boot rejouable du cycle 33 (changedetection.io @ a1ce35619aae).
# Usage : bash tools/boot.sh  (depuis la racine du clone cible, voir CD_REPO)
# Sortie : logs dans /tmp/cd-app.log ; app sur http://127.0.0.1:5005
# Exigences : .venv déjà installé :
#   pip install -r requirements.txt playwright
#   (requirements.txt n'installe PAS playwright python — amont le fait au
#   Dockerfile ; le module est requis pour add-watch-ui/browser-steps live)
# + chromium playwright (~/audit-tools).
set -u

CD_REPO="${CD_REPO:-$HOME/work/changedetection}"
CYCLE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVE_DIR="${CD_FIXTURE_SERVE:-/tmp/cd-fixture-serve}"
DATASTORE="${CD_DATASTORE:-$HOME/work/cd-datastore}"
FIXTURE_PORT="${CD_FIXTURE_PORT:-5599}"
APP_PORT="${CD_PORT:-5005}"

mkdir -p "$SERVE_DIR" "$DATASTORE"
# Fixtures v1 dans le répertoire servi (le seed fera la bascule v2)
cp "$CYCLE_DIR/tools/fixtures/api-docs-v1.html" "$SERVE_DIR/api-docs.html"
cp "$CYCLE_DIR/tools/fixtures/pricing-v1.html" "$SERVE_DIR/pricing.html"
cp "$CYCLE_DIR/tools/fixtures/rates-v1.json" "$SERVE_DIR/rates.json"

# 1. serveur de fixtures statiques
pkill -f "http.server ${FIXTURE_PORT}" 2>/dev/null || true
(cd "$SERVE_DIR" && exec python3 -m http.server "$FIXTURE_PORT" -b 127.0.0.1) \
    > /tmp/cd-fixtures.log 2>&1 &

# 2. proxy CDP spawn-per-connection (équivalent local de sockpuppetbrowser) :
#    le fetcher pyppeteer appelle browser.close() à chaque fetch, donc le proxy
#    relance un chromium frais par connexion entrante sur ws://127.0.0.1:9333.
pkill -f 'remote-debugging-port=4' 2>/dev/null || true
pkill -f 'cdp-spawn-proxy' 2>/dev/null || true
rm -rf /tmp/cd-chrome-*
"$CD_REPO/.venv/bin/python" "$CYCLE_DIR/tools/cdp-spawn-proxy.py" > /tmp/cd-chrome.log 2>&1 &

# 3. app changedetection.io — motif crochets : ne s'auto-tue pas, mais tue quand
#    même une AUTRE instance déjà en cours (ne pas lancer 2 boots en parallèle
#    sans ports distincts : ce pkill arrêtera la première).
pkill -f 'changedetection[.]py' 2>/dev/null || true
export PLAYWRIGHT_DRIVER_URL="ws://127.0.0.1:9333/devtools/browser/local"
export FAST_PUPPETEER_CHROME_FETCHER=True   # html_webdriver => pyppeteer via CDP (playwright python reste requis : browser_steps l'importe)
export ALLOW_IANA_RESTRICTED_ADDRESSES=true # autorise les fixtures locales (SSRF guard upstream)
export SALTED_PASS='Y3ljbGUzMy1jaGFuZ2VkZXRlY3Rpb24tYTExeS0wc2EgVp1SMwYVdjpe6TBzH18rsfEl30QagSq4fagBMT0JnQ=='
# ^ password UI : "audit-c33-changedetection" (base64(salt32 + pbkdf2_sha256(pw, salt, 100k)))
export FETCH_WORKERS=4
cd "$CD_REPO"
exec .venv/bin/python changedetection.py -d "$DATASTORE" -h 127.0.0.1 -p "$APP_PORT"
