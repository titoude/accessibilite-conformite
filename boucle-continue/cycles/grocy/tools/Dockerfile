FROM php:8.5-cli
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev libicu-dev libonig-dev libsqlite3-dev unzip \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j$(nproc) pdo_sqlite gd intl mbstring \
 && rm -rf /var/lib/apt/lists/*
RUN php -r "copy('https://getcomposer.org/installer','/tmp/c.php');" && php /tmp/c.php --install-dir=/usr/local/bin --filename=composer && rm /tmp/c.php
WORKDIR /app
