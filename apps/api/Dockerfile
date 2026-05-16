FROM php:8.4-cli-alpine

RUN apk add --no-cache git unzip libzip-dev icu-dev oniguruma-dev sqlite-dev \
        libpng-dev libjpeg-turbo-dev freetype-dev libxml2-dev octave \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_sqlite mbstring intl zip gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-progress --optimize-autoloader --no-scripts

COPY . .

EXPOSE 8000

CMD ["sh", "-lc", "touch database/database.sqlite && mkdir -p storage/fonts && php artisan migrate --force && php -S 0.0.0.0:8000 -t public public/index.php"]
