#!/usr/bin/env bash
# Boot EspoCRM patché (cycle 47) — image espocrm/espocrm:latest (10.0.9 = 6c369056) + mariadb
# Le patch s'applique au checkout ~/work/espocrm ; seuls les livrables servis sont montés.
set -e
CHECKOUT="${1:-/home/ubuntu/work/espocrm}"
docker rm -f espo47 espo47-db 2>/dev/null || true
docker network rm espo47 2>/dev/null || true
docker network create espo47 >/dev/null
docker run -d --name espo47-db --network espo47 \
  -e MARIADB_ROOT_PASSWORD=espo47root -e MARIADB_DATABASE=espocrm \
  -e MARIADB_USER=espocrm -e MARIADB_PASSWORD=espo47dbpass \
  -v espo47-db-data:/var/lib/mysql mariadb:11.4 >/dev/null
sleep 12
docker run -d --name espo47 --network espo47 -p 7747:80 \
  -e ESPOCRM_DATABASE_HOST=espo47-db -e ESPOCRM_DATABASE_NAME=espocrm \
  -e ESPOCRM_DATABASE_USER=espocrm -e ESPOCRM_DATABASE_PASSWORD=espo47dbpass \
  -e ESPOCRM_ADMIN_USERNAME=admin -e ESPOCRM_ADMIN_PASSWORD='AuditC47-Espo-Pass!' \
  -e ESPOCRM_LANGUAGE=en_US -e ESPOCRM_SITE_URL=http://localhost:7747 \
  -v "$CHECKOUT/client:/usr/src/espocrm/client:ro" \
  -v espo47-client-served:/var/www/html/client \
  -v espo47-client-custom:/var/www/html/client/custom \
  -v espo47-custom:/var/www/html/custom \
  -v /home/ubuntu/work/espo47-data:/var/www/html/data \
  -v "$CHECKOUT/html/main.html:/var/www/html/html/main.html:ro" \
  -v "$CHECKOUT/application/Espo/Core/Utils/ClientManager.php:/var/www/html/application/Espo/Core/Utils/ClientManager.php:ro" \
  espocrm/espocrm:latest >/dev/null
echo "booting..."; for i in $(seq 1 60); do sleep 2; code=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:7747/ || true); [ "$code" = "200" ] && { echo "UP :7747"; exit 0; }; done
echo "TIMEOUT"; docker logs --tail 20 espo47; exit 1
