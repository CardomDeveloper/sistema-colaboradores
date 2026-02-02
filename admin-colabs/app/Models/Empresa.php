<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    // protected $table = 'empresas';

    protected $fillable = [
        'pais_id',
        'departamento_id',
        'municipio_id',
        'nit',
        'razon_social',
        'nombre_comercial',
        'telefono',
        'correo',
        'activo',
    ];

    //relaciones
    public function pais() { return $this->belongsTo(Pais::class); }
    public function departamento() { return $this->belongsTo(Departamento::class); }
    public function municipio() { return $this->belongsTo(Municipio::class); }
}
