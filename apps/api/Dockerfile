FROM php:8.4-cli-alpine

RUN apk add --no-cache git unzip libzip-dev icu-dev oniguruma-dev sqlite-dev \
    && docker-php-ext-install pdo pdo_sqlite mbstring intl zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-progress --optimize-autoloader --no-scripts

COPY . .

EXPOSE 8000

CMD ["sh", "-lc", "touch database/database.sqlite && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000"]
