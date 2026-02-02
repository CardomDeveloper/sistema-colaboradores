FROM php:8.4-apache

WORKDIR /var/www/html

# Dependencias + extensiones
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev \
  && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip \
  && a2enmod rewrite \
  && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar proyecto
COPY . /var/www/html

# DocumentRoot a /public + AllowOverride All (Laravel .htaccess)
RUN sed -i 's#DocumentRoot /var/www/html#DocumentRoot /var/www/html/public#g' /etc/apache2/sites-available/000-default.conf \
 && printf '\n<Directory /var/www/html/public>\nAllowOverride All\nRequire all granted\n</Directory>\n' >> /etc/apache2/sites-available/000-default.conf

# Permisos Laravel
RUN mkdir -p storage bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache

# Instalar dependencias
RUN composer install --no-dev --optimize-autoloader

# Script de arranque
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
