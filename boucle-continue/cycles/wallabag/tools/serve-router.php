<?php
// Router php -S pour le boot prod du bench (cycle 38).
// Monté hors docroot via compose.override.yaml : fichiers réels servis
// statiquement (assets build/*), tout le reste passe au kernel prod via
// web/index.php (SCRIPT_FILENAME forcé pour le Symfony Runtime).
$path = '/var/www/html/web' . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (is_file($path)) {
    return false;
}
$_SERVER['SCRIPT_FILENAME'] = '/var/www/html/web/index.php';
require '/var/www/html/web/index.php';
