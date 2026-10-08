FROM php:8.2-cli-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends \
    libicu-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev libwebp-dev libzip-dev unzip ffmpeg git default-mysql-client \
 && docker-php-ext-configure gd --with-webp --with-jpeg --with-freetype \
 && docker-php-ext-install intl mysqli pdo_mysql exif gd zip \
 && apt-get clean && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /app
