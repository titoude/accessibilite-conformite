FROM php:8.3-apache
RUN apt-get update && apt-get install -y --no-install-recommends \
    libonig-dev libpng-dev libjpeg62-turbo-dev libzip-dev unzip \
 && docker-php-ext-install mysqli pdo_mysql mbstring gd zip \
 && a2enmod rewrite \
 && rm -rf /var/lib/apt/lists/*
