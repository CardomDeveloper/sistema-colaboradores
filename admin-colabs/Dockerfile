FROM php:8.4-apache

WORKDIR /var/www/html

# Dependencias del sistema + extensiones
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev \
  && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip \
  && a2enmod rewrite \
  && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar proyecto (desde admin-colabs)
COPY . /var/www/html

# Permisos Laravel (si existen)
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache \
 && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Instalar dependencias PHP
RUN composer install --no-dev --optimize-autoloader

# Render usa PORT (lo setea Render), pero dejamos default 10000
ENV PORT=10000
EXPOSE 10000

# Apache escuchando el PORT 10000
RUN sed -i 's/Listen 80/Listen 10000/g' /etc/apache2/ports.conf \
 && sed -i 's/:80/:10000/g' /etc/apache2/sites-available/000-default.conf

# ✅ Para que Laravel routes funcionen bien
# (si tu proyecto usa /public como document root)
RUN sed -i 's#DocumentRoot /var/www/html#DocumentRoot /var/www/html/public#g' /etc/apache2/sites-available/000-default.conf \
 && sed -i 's#<Directory /var/www/>#<Directory /var/www/html/public/>#g' /etc/apache2/apache2.conf

# Start script (migrate + opcional seed)
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
