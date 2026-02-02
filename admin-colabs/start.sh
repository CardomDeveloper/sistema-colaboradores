#!/usr/bin/env bash
set -e

echo "==> Booting Laravel on Render..."

PORT="${PORT:-10000}"
echo "==> Using PORT=$PORT"

sed -i "s/Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/:80/:${PORT}/g" /etc/apache2/sites-available/000-default.conf

php artisan config:clear || true
php artisan route:clear || true
php artisan cache:clear || true

echo "==> Running migrations..."
php artisan migrate --force

if [ "${RUN_SEED}" = "true" ]; then
  echo "==> Running seeders..."
  php artisan db:seed --force
else
  echo "==> RUN_SEED not true, skipping seed."
fi

echo "==> Starting Apache..."
exec apache2-foreground
