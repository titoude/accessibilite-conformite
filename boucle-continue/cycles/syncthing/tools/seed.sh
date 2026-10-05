#!/usr/bin/env bash
# Seed syncthing (instance st1 sur :8384) — idempotent.
# Usage : ./seed.sh [ST1_HOME] [DATA_DIR] [BASE_URL]
#   ST1_HOME = home syncthing de l'instance auditée (config.xml + DB)
#   DATA_DIR = dossiers synchronisés seedés (contenu réel)
# Pré-requis : st1 tourne (syncthing serve -H ST1_HOME --gui-address=BASE_URL)
# et le binaire syncthing compilé est à côté : $SYNCTHING_BIN (défaut ~/work/syncthing/syncthing)
set -euo pipefail

ST1_HOME=${1:-$HOME/work/st-home}
DATA=${2:-$HOME/work/st-data}
BASE=${3:-http://127.0.0.1:8384}
BIN=${SYNCTHING_BIN:-$HOME/work/syncthing/syncthing}
ST2_HOME=$DATA/st2-home
ST2_DATA=$DATA/st2-data

# Device ID distant épinglé — généré une fois via `syncthing generate` (valide,
# jamais en ligne → "Disconnected" dans le panneau Remote Devices).
ALICE_ID='H5TRW4T-N6OBRP7-ZRPPVBJ-KU67Y4G-GWHN3IW-KVNYZVI-C4BYAJV-H7P2HAZ'

APIKEY=$(grep -oP '(?<=<apikey>)[^<]+' "$ST1_HOME/config.xml")
ST1_ID=$(grep -oP '(?<=<device id=")[^"]+' "$ST1_HOME/config.xml" | head -1)
api() { curl -fsS -H "X-API-Key: $APIKEY" -H 'Content-Type: application/json' "$@"; }

echo "== seed st1 ($BASE) id=$ST1_ID"

# --- 1. Contenu réel des dossiers (protocole : littéraux exacts, lien Markdown) ---
mkdir -p "$DATA/sync-main/docs" "$DATA/sync-main/photos"
cat > "$DATA/sync-main/docs/README.md" <<'MD'
# Projet Atlas — notes de synchronisation

Lien de référence : [documentation Syncthing](https://docs.syncthing.net/).

- réunion 2026-10-05 : décisions & actions
- point ouvert : https://forum.syncthing.net/ (support)
MD
cat > "$DATA/sync-main/todo.txt" <<'TXT'
- répliquer photos/ vers laptop-alice
- vérifier .stversions après upgrade
TXT
printf 'JPEG-SEED-ATLAS' > "$DATA/sync-main/photos/plage.jpg"

# Dossier "archives" receive-only + versioning poubelle + vieille version posée
mkdir -p "$DATA/archives/.stversions"
cat > "$DATA/archives/rapport.txt" <<'TXT'
rapport 2026-Q3 — version courante (local addition)
TXT
cp "$DATA/archives/rapport.txt" "$DATA/archives/.stversions/rapport~20250930-120000.txt"

# --- 2. Config st1 : devices + folders via REST ---
api -X POST "$BASE/rest/config/devices" -d "{
  \"deviceID\": \"$ALICE_ID\", \"name\": \"laptop-alice\",
  \"addresses\": [\"dynamic\"], \"compression\": \"metadata\",
  \"introducer\": false, \"paused\": false, \"untrusted\": false
}" >/dev/null

# sync-main : sendreceive, partagé avec local + alice
api -X POST "$BASE/rest/config/folders" -d "{
  \"id\": \"sync-main\", \"label\": \"Main Sync\", \"path\": \"$DATA/sync-main\",
  \"type\": \"sendreceive\", \"rescanIntervalS\": 60, \"fsWatcherEnabled\": true,
  \"devices\": [
    {\"deviceID\": \"$ST1_ID\"},
    {\"deviceID\": \"$ALICE_ID\"}
  ]
}" >/dev/null

# archives : receiveonly → fichiers locaux = "Local Additions" (bouton Revert)
# + versioning poubelle → bouton "Restore Versions" alimenté par .stversions
api -X POST "$BASE/rest/config/folders" -d "{
  \"id\": \"archives\", \"label\": \"Archives\", \"path\": \"$DATA/archives\",
  \"type\": \"receiveonly\", \"rescanIntervalS\": 60, \"fsWatcherEnabled\": true,
  \"versioning\": {\"type\": \"trashcan\", \"params\": {\"cleanoutDays\": \"30\"}, \"cleanupIntervalS\": 3600},
  \"devices\": [{\"deviceID\": \"$ST1_ID\"}]
}" >/dev/null

# broken : chemin impossible → état d'erreur déterministe (panneau Errors +
# statut folder 'error' + ligne Failed dans le panneau Folders).
api -X POST "$BASE/rest/config/folders" -d "{
  \"id\": \"broken\", \"label\": \"Broken\", \"path\": \"/proc/nonexistent-xyz\",
  \"type\": \"sendreceive\", \"devices\": [{\"deviceID\": \"$ST1_ID\"}]
}" >/dev/null

# --- 2b. Auth GUI : user/password (requis par tools/login.mjs + audits) ---
"$BIN" cli -H "$ST1_HOME" config gui user set devin >/dev/null
"$BIN" cli -H "$ST1_HOME" config gui password set 'DevinA11y!2026' >/dev/null

# --- 2c. urAccepted/urSeen = 0 : la modale de rapport d'usage (#ur) s'ouvre au
# premier chargement authentifié — état réel du premier démarrage, rejouable
# (audit.mjs l'ouvre explicitement via l'état 'usage-report-open' de toute façon).
OPTS=$(api "$BASE/rest/config/options")
echo "$OPTS" | python3 -c 'import json,sys; o=json.load(sys.stdin); o["urAccepted"]=0; o["urSeen"]=0; print(json.dumps(o))' | api -X PUT "$BASE/rest/config/options" -d @- >/dev/null

# --- 2d. Devices/dossiers ignorés → onglets « Ignored Devices/Folders » de la
# modale Settings peuplés (tables + boutons Unignore réellement rendus).
# IGNORED_ID = device ID valide épinglé, généré une fois, jamais en ligne.
IGNORED_ID='FENBM3X-FZ525PI-LRBPUM4-KDIH777-W53VJ4G-CAOC2FF-EY5LRII-CCJE3QM'
CFG=$(api "$BASE/rest/config")
echo "$CFG" | python3 -c '
import json, sys
cfg = json.load(sys.stdin)
cfg["remoteIgnoredDevices"] = [{"time": "2026-09-30T12:00:00Z", "deviceID": sys.argv[1], "name": "", "address": "tcp://192.0.2.44:22000"}]
for d in cfg["devices"]:
    d.setdefault("ignoredFolders", [])
    if d["deviceID"].startswith("H5TRW4T"):
        d["ignoredFolders"] = [{"time": "2026-09-29T09:30:00Z", "id": "old-share", "label": "Old Share"}]
print(json.dumps(cfg))' "$IGNORED_ID" | api -X PUT "$BASE/rest/config" -d @- >/dev/null

# Applique la config (restart).
api -X POST "$BASE/rest/system/restart" >/dev/null || true
sleep 6

# --- 3. Instance st2 éphémère : produit les panneaux "New Device"/"New Folder" ---
# st2 connaît st1 (ID + adresse loopback explicite) et partage shared-docs ;
# st1 ne connaît pas st2 au moment de la connexion → pendingDevice, puis
# st1 ajoute st2 → offre de dossier → pendingFolder. Entrées persistées en DB.
if [ ! -f "$ST2_HOME/config.xml" ]; then
  "$BIN" generate -H "$ST2_HOME" >/dev/null
fi
ST2_ID=$(grep -oP '(?<=<device id=")[^"]+' "$ST2_HOME/config.xml" | head -1)
ST2_APIKEY=$(grep -oP '(?<=<apikey>)[^<]+' "$ST2_HOME/config.xml")

mkdir -p "$ST2_DATA/shared-docs"
cat > "$ST2_DATA/shared-docs/guide.md" <<'MD'
# Guide partagé depuis desktop-bob
Voir https://docs.syncthing.net/ pour la réplication.
MD

# Config st2 : GUI :8484, écoute :22001, ajoute st1 + dossier partagé.
api2() { curl -fsS -H "X-API-Key: $ST2_APIKEY" -H 'Content-Type: application/json' "$@"; }
"$BIN" cli -H "$ST2_HOME" --gui-address "http://127.0.0.1:8484" config gui-addresses set "http://127.0.0.1:8484" 2>/dev/null || true

# Édition directe du config.xml st2 (instance arrêtée) : ports + device st1 + folder.
python3 - "$ST2_HOME/config.xml" "$ST1_ID" "$ST2_DATA/shared-docs" <<'PY'
import re, sys
p, st1id, folder = sys.argv[1], sys.argv[2], sys.argv[3]
cfg = open(p).read()
# ports d'écoute distincts de st1
cfg = cfg.replace('<listenAddress>default</listenAddress>', '<listenAddress>tcp://:22001</listenAddress><listenAddress>quic://:22001</listenAddress>')
cfg = re.sub(r'<address>(127\.0\.0\.1|localhost):8384</address>', '<address>127.0.0.1:8484</address>', cfg)
# device st1 connu de st2, adresse loopback explicite (pas de découverte requise)
dev = f'<device id="{st1id}" name="devin-box" compression="metadata" introducer="false" skipIntroductionRemovals="false" introducedBy=""><address>tcp://127.0.0.1:22000</address><paused>false</paused></device>'
cfg = cfg.replace('</devices>', dev + '\n    </devices>', 1) if '</devices>' in cfg else re.sub(r'(<device [^>]+>.*?</device>)', r'\1\n    ' + dev, cfg, count=1, flags=re.S)
# dossier partagé avec st1
fol = f'<folder id="shared-docs" label="Shared Docs" path="{folder}" type="sendreceive" rescanIntervalS="3600" fsWatcherEnabled="true"><device id="{st1id}"></device></folder>'
cfg = re.sub(r'(<defaults>)', fol + '\n    \\1', cfg, count=1)
open(p, 'w').write(cfg)
PY

# Démarre st2, attend que st1 voie le device pending, ajoute st2 à st1,
# attend l'offre de dossier, puis stoppe st2 (les entrées persistent en DB).
env STGUIASSETS= "$BIN" serve -H "$ST2_HOME" --no-browser > "$DATA/st2.log" 2>&1 &
ST2_PID=$!
echo "st2 pid=$ST2_PID id=$ST2_ID — attente pending device…"
for i in $(seq 1 60); do
  P=$(curl -fsS -H "X-API-Key: $APIKEY" "$BASE/rest/cluster/pending/devices" 2>/dev/null || echo '{}')
  echo "$P" | grep -q "$ST2_ID" && break
  # déjà connu de st1 (rejeu) → inutile d'attendre
  curl -fsS -H "X-API-Key: $APIKEY" "$BASE/rest/config/devices" 2>/dev/null | grep -q "$ST2_ID" && break
  sleep 1
done
curl -fsS -H "X-API-Key: $APIKEY" "$BASE/rest/cluster/pending/devices" || true; echo

# st1 connaît maintenant st2 (nommé desktop-bob) → l'offre de dossier arrive.
api -X POST "$BASE/rest/config/devices" -d "{
  \"deviceID\": \"$ST2_ID\", \"name\": \"desktop-bob\",
  \"addresses\": [\"dynamic\"], \"compression\": \"metadata\",
  \"introducer\": false, \"paused\": false, \"untrusted\": false
}" >/dev/null
echo "attente pending folder shared-docs…"
for i in $(seq 1 90); do
  N=$(curl -fsS -H "X-API-Key: $APIKEY" "$BASE/rest/cluster/pending/folders" 2>/dev/null | grep -c 'shared-docs' || true)
  [ "$N" -ge 1 ] && break; sleep 1
done
curl -fsS -H "X-API-Key: $APIKEY" "$BASE/rest/cluster/pending/folders" || true; echo

kill $ST2_PID 2>/dev/null || true
sleep 2

# --- 4. Instance st3 "knocker" : se connecte une fois, JAMAIS ajoutée à st1 →
# panneau "New Device" persistant (pendingDevice en DB, sans expiration).
ST3_HOME=$DATA/st3-home
if [ ! -f "$ST3_HOME/config.xml" ]; then
  "$BIN" generate -H "$ST3_HOME" >/dev/null
fi
ST3_ID=$(grep -oP '(?<=<device id=")[^"]+' "$ST3_HOME/config.xml" | head -1)
# Port d'écoute distinct + device st1 (loopback explicite).
python3 - "$ST3_HOME/config.xml" "$ST1_ID" <<'PY'
import re, sys
p, st1id = sys.argv[1], sys.argv[2]
cfg = open(p).read()
cfg = cfg.replace('<listenAddress>default</listenAddress>', '<listenAddress>tcp://:22002</listenAddress><listenAddress>quic://:22002</listenAddress>')
cfg = re.sub(r'<address>(127\.0\.0\.1|localhost):8384</address>', '<address>127.0.0.1:8485</address>', cfg)
dev = f'<device id="{st1id}" name="devin-box" compression="metadata" introducer="false" skipIntroductionRemovals="false" introducedBy=""><address>tcp://127.0.0.1:22000</address><paused>false</paused></device>'
cfg = re.sub(r'(<device [^>]+>.*?</device>)', r'\1\n    ' + dev, cfg, count=1, flags=re.S)
open(p, 'w').write(cfg)
PY
env STGUIASSETS= "$BIN" serve -H "$ST3_HOME" --no-browser > "$DATA/st3.log" 2>&1 &
ST3_PID=$!
echo "st3 pid=$ST3_PID id=$ST3_ID — attente pending device (knocker)…"
for i in $(seq 1 60); do
  N=$(curl -fsS -H "X-API-Key: $APIKEY" "$BASE/rest/cluster/pending/devices" 2>/dev/null | grep -c "$ST3_ID" || true)
  [ "$N" -ge 1 ] && break; sleep 1
done
curl -fsS -H "X-API-Key: $APIKEY" "$BASE/rest/cluster/pending/devices" || true; echo
kill $ST3_PID 2>/dev/null || true
sleep 1
echo "== seed terminé (pending device st3 + pending folder st2 + devices/folders réels)"
