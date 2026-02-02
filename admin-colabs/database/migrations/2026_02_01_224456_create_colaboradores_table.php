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
        Schema::create('colaboradores', function (Blueprint $table) {
            // fks
            $table->foreignId('empresa_id')->constrained('empresas');

            $table->string('nombre_completo', 160);
            $table->unsignedTinyInteger('edad');
            $table->string('telefono', 30)->nullable();
            $table->string('correo', 120)->nullable();

            // Borrado lógico
            $table->boolean('activo')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('colaboradores');
    }
};
