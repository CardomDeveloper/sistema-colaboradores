#!/usr/bin/env bash
set -e

echo "==> App starting..."
echo "==> PHP: $(php -v | head -n 1)"

# Si Render te pasa PORT, Apache ya está en 10000 en config.
# (Render enruta al contenedor igual)

# 🔥 Migraciones (siempre)
echo "==> Running migrations..."
php artisan migrate --force || true

# 🌱 Seeders solo si RUN_SEED=true
if [ "${RUN_SEED}" = "true" ]; then
  echo "==> Running seeders..."
  php artisan db:seed --force || true
else
  echo "==> Seed skipped (set RUN_SEED=true to run)"
fi

# Cache opcional (no obligatorio)
php artisan config:cache || true
php artisan route:cache || true

echo "==> Launching Apache..."
exec apache2-foreground
