# Cycle 54 — environnement commun (sourcé par boot.sh / seed.sh / audit scripts).
# Toutes les constantes sont env-paramétrables (leçon 22).
export CYCLE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")/.." && pwd)"
export REPO_DIR="${REPO_DIR:-/home/ubuntu/work/c54/twenty}"
export APP_PORT="${APP_PORT:-9540}"
export PG_PORT="${PG_PORT:-9543}"
export REDIS_PORT="${REDIS_PORT:-9544}"
export PG_NAME="${PG_NAME:-c54-pg}"
export REDIS_NAME="${REDIS_NAME:-c54-redis}"
export BASE="${BASE:-http://localhost:${APP_PORT}}"
export TWENTY_USER="${TWENTY_USER:-tim@apple.dev}"
export TWENTY_PASS="${TWENTY_PASS:-tim@apple.dev}"
export PG_IMAGE="${PG_IMAGE:-mirror.gcr.io/library/postgres:16}"
export REDIS_IMAGE="${REDIS_IMAGE:-mirror.gcr.io/library/redis:7}"
