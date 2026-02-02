<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('empresas', function (Blueprint $table) {
            $table->id();
            // FKS
            $table->foreignId('pais_id')->constrained('paises');
            $table->foreignId('departamento_id')->constrained('departamentos');
            $table->foreignId('municipio_id')->constrained('municipios');

            $table->string('nit', 30);
            $table->string('razon_social', 160);
            $table->string('nombre_comercial', 160)->nullable();
            $table->string('telefono', 30)->nullable();
            $table->string('correo', 120)->nullable();
            $table->boolean('activo')->default(true); 
            $table->timestamps();

            // Opcional: si el NIT debe ser único
            $table->unique('nit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
