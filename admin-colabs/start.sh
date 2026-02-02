#!/usr/bin/env bash
set -e

echo "==> Booting Laravel on Render..."

# 1) Render inyecta $PORT. Si no existe, usa 10000
PORT="${PORT:-10000}"
echo "==> Using PORT=$PORT"

# 2) Ajustar Apache al puerto correcto
sed -i "s/Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/:80/:${PORT}/g" /etc/apache2/sites-available/000-default.conf

# 3) Cache/optimizaciones (opcionales pero útiles en prod)
php artisan config:clear || true
php artisan route:clear || true
php artisan cache:clear || true

# 4) Migraciones
echo "==> Running migrations..."
php artisan migrate --force

# 5) Seed SOLO si RUN_SEED=true
if [ "${RUN_SEED}" = "true" ]; then
  echo "==> Running seeders..."
  php artisan db:seed --force
else
  echo "==> RUN_SEED not true, skipping seed."
fi

echo "==> Starting Apache..."
exec apache2-foreground
