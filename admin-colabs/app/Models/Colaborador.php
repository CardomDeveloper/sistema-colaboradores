<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Colaborador extends Model
{
    protected $table = 'colaboradores';

    protected $fillable = [
        'empresa_id',
        'nombre_completo',
        'edad',
        'telefono',
        'correo',
        'activo',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }
}
