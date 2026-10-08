FROM php:8.3-apache
# Dolibarr 24.0 — extensions requises par htdocs/install/check.php :
# mbstring, json (bundled), GD, Curl, Calendar, Xml/dom (bundled), UTF8,
# Intl, ZIP (warnings tolérés mais on les installe), + driver mysqli/pdo_mysql.
# Pull via mirror.gcr.io si docker.io renvoie 429 (leçon 48) :
#   docker pull mirror.gcr.io/library/php:8.3-apache && docker tag ... php:8.3-apache
RUN apt-get update && apt-get install -y --no-install-recommends \
    libonig-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev libwebp-dev \
    libzip-dev libicu-dev libcurl4-openssl-dev libxml2-dev unzip \
 && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
 && docker-php-ext-install -j"$(nproc)" mysqli pdo_mysql mbstring gd zip intl \
    calendar exif opcache curl \
 && a2enmod rewrite \
 && rm -rf /var/lib/apt/lists/*
# DocumentRoot -> /var/www/html/htdocs (checkout Dolibarr bind-monté à /var/www/html)
RUN sed -ri 's!/var/www/html!/var/www/html/htdocs!g' /etc/apache2/sites-available/000-default.conf \
 && sed -ri 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf
# Uploads Dolibarr (factures PDF etc.) — valeurs raisonnables de bench
RUN printf 'upload_max_filesize=32M\npost_max_size=40M\nmemory_limit=512M\n' > /usr/local/etc/php/conf.d/doli.ini
WORKDIR /var/www/html
