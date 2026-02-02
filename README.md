# Sistema de Colaboradores

Proyecto CRUD con Laravel(backend) API y React (frontend).

## Tecnologías
- Laravel
- React (Vite)
- MySQL
- Docker
- Axios
- TailwindCSS

## Funcionalidades
- CRUD de Países
- CRUD de Departamentos
- CRUD de Municipios
- CRUD de Empresas
- CRUD de Colaboradores

## Backend (Laravel)

Entrar a la carpeta:
cd admin-colabs
composer install

## Configurar entorno
cp .env.example .env
php artisan key:generate

## Migrara base de datos
php artisan migrate

## Levantat servidor
php artisan serve

## Frontend (React)
cd react-colabs
npm install
npm run dev



