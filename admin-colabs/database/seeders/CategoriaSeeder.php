<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categorias')->insert([
            'icono' => 'pais',
            'nombre' => 'Mantenimiento países',
            'activo' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('categorias')->insert([
            'icono' => 'departamento',
            'nombre' => 'Mantenimiento departamentos',
            'activo' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('categorias')->insert([
            'icono' => 'municipio',
            'nombre' => 'Mantenimiento municipios',
            'activo' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('categorias')->insert([
            'icono' => 'empresa',
            'nombre' => 'Mantenimiento Empresas',
            'activo' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('categorias')->insert([
            'icono' => 'colaborador',
            'nombre' => 'Mantenimiento Colaboradores',
            'activo' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);        
    }
}
