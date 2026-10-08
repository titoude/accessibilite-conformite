#!/usr/bin/env bash
# seed.sh — cycle 50 castopod. Init DB (migrations + AppSeeder) puis BenchSeeder
# (superadmin bench-admin, podcast @auditwaves, 3 épisodes publiés + 1 programmé,
# page custom, contributeur). Idempotent.
# Usage : bash tools/seed.sh <checkout-castopod> [NAME_SUFFIX]
set -euo pipefail

CHECKOUT="${1:?chemin du checkout castopod requis}"
SFX="${2:-}"
APP="castopod50${SFX}"
DB="castopod50-db${SFX}"
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# BenchSeeder.php vit dans tools/ (artefact du cycle) et est recopié dans le
# checkout pour que spark le découvre — fichier banc, jamais dans patch.diff.
cp "$TOOLS_DIR/BenchSeeder.php" "$CHECKOUT/app/Database/Seeds/BenchSeeder.php"

docker exec "$APP" php spark install:init-database
docker exec "$APP" php spark db:seed BenchSeeder

# Artefacts dérivés (seed-info.json + urls-auth.resolved.txt) : délégués à
# gen-urls.sh — source unique, rejouable seul quand la DB a dérivé sans
# re-seeder (leçon 44/46).
bash "$TOOLS_DIR/gen-urls.sh" "$DB"

echo "[seed] OK — seed-info.json écrit (db=$DB)"
