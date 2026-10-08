# Image web cycle 58 — SuiteCRM-Core @SHA bind-monté (le code audité = sources du clone).
# Base miroir gcr : docker.io est rate-limité (429) sur cette box — leçon 48.
FROM mirror.gcr.io/library/php:8.3-apache

# Extensions PHP requises par composer.json + install checker SuiteCRM 8.9
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev libicu-dev \
    libxml2-dev libonig-dev libcurl4-openssl-dev libldap2-dev unzip git \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j"$(nproc)" \
    gd intl ldap mysqli pdo_mysql soap zip opcache \
 && a2enmod rewrite headers \
 && rm -rf /var/lib/apt/lists/*

# Composer depuis l'image composer:2 (miroir)
COPY --from=mirror.gcr.io/library/composer:2 /usr/bin/composer /usr/bin/composer

# DocumentRoot → public/ (front controller Symfony index.php + legacy/)
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf \
 && { \
      echo '<Directory /var/www/html/public>'; \
      echo '  AllowOverride All'; \
      echo '  Require all granted'; \
      echo '  FallbackResource /index.php'; \
      echo '</Directory>'; \
      echo '<Directory /var/www/html/public/legacy>'; \
      echo '  AllowOverride All'; \
      echo '  Require all granted'; \
      echo '  FallbackResource disabled'; \
      echo '</Directory>'; \
    } > /etc/apache2/conf-available/suitecrm.conf \
 && a2enconf suitecrm

# php.ini de banc : mémoire SuiteCRM + upload + timezone déterministe
RUN { \
      echo 'memory_limit=512M'; \
      echo 'upload_max_filesize=32M'; \
      echo 'post_max_size=32M'; \
      echo 'max_execution_time=180'; \
      echo 'date.timezone=UTC'; \
      echo 'opcache.enable=1'; \
      echo 'opcache.validate_timestamps=1'; \
      echo 'opcache.revalidate_freq=0'; \
      echo 'display_errors=Off'; \
      echo 'log_errors=On'; \
      echo 'error_reporting=E_ALL & ~E_DEPRECATED & ~E_STRICT & ~E_NOTICE & ~E_WARNING'; \
    } > /usr/local/etc/php/conf.d/suitecrm-bench.ini

WORKDIR /var/www/html
