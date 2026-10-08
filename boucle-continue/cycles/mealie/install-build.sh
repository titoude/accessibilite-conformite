#!/usr/bin/env bash
# install-build cycle 44 mealie — rejoué verbatim sur clone vierge
set -e
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
cd ~/work/run44
rm -rf mealie-install && git clone --depth 1 --filter=blob:none https://github.com/mealie-recipes/mealie.git mealie-install
cd mealie-install && git fetch --depth 1 origin 06ccc2b1a6eef90dece7cfcd5aa48e140f544bf9 && git checkout FETCH_HEAD
git apply --check ~/work/run44/cycles-prep/patch.diff && git apply ~/work/run44/cycles-prep/patch.diff
docker build -f docker/Dockerfile -t mealie-c44:install . 
docker rm -f mealie-i44 2>/dev/null || true
mkdir -p ~/work/run44/mealie-data-install
docker run -d --name mealie-i44 -p 7064:9000 -e DB_ENGINE=sqlite -v ~/work/run44/mealie-data-install:/app/data mealie-c44:install
sleep 45
curl -sf http://localhost:7064/api/app/about > /dev/null
cd ~/work/run44/tools && node seed.mjs http://localhost:7064 && node login.mjs http://localhost:7064 admin@example.com MyPassword && cp auth.json auth-install.json
node audit.mjs http://localhost:7064 --urls "$(paste -sd, urls-auth.txt)" --out reports/install-auth --wait 1500 --states "create-menu,settings-menu,language-dialog,search-dialog,recipe-context-menu,recipe-lastmade-dialog,shopping-item-editor,theme-dark,theme-dark-menu,mobile-drawer-390" --storage-state auth-install.json
echo "EXIT_INSTALL_AUTH=$?"
node audit.mjs http://localhost:7064 --urls "$(paste -sd, urls-public.txt)" --out reports/install-public --wait 1500 --states shared-recipe-menu
echo "EXIT_INSTALL_PUBLIC=$?"
