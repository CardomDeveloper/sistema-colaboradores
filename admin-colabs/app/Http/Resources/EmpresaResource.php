<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmpresaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            // Fks
            'pais_id' => $this->pais_id,
            'pais_nombre' => $this->pais->nombre,

            'departamento_id' => $this->departamento_id,
            'departamento_nombre' => $this->departamento->nombre,

            'municipio_id' => $this->municipio_id,
            'municipio_nombre' => $this->municipio->nombre,

            'nit' => $this->nit,
            'razon_social' => $this->razon_social,
            'nombre_comercial' => $this->nombre_comercial,
            'telefono' => $this->telefono,
            'correo' => $this->correo,

            'activo' => $this->activo,
        ];
    }
}
