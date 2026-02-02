FROM php:8.4-apache

WORKDIR /var/www/html

# Dependencias del sistema + extensiones PHP + rewrite
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev \
  && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip \
  && a2enmod rewrite

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar proyecto
COPY . /var/www/html

# ✅ Apache debe servir /public (Laravel)
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
  && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
  && printf "\n<Directory /var/www/html/public>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n" >> /etc/apache2/apache2.conf

# Permisos (Laravel)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Instalar dependencias PHP
RUN composer install --no-dev --optimize-autoloader

# Render usa PORT
ENV PORT=10000
EXPOSE 10000

# Apache escuchando el PORT
RUN sed -i 's/Listen 80/Listen 10000/g' /etc/apache2/ports.conf \
 && sed -i 's/:80/:10000/g' /etc/apache2/sites-available/000-default.conf

CMD ["apache2-foreground"]
