<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ColaboradorResource extends JsonResource
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

            'empresa_id' => $this->empresa_id,
            'empresa_razon_social' => $this->empresa?->razon_social,

            'nombre_completo' => $this->nombre_completo,
            'edad' => $this->edad,
            'telefono' => $this->telefono,
            'correo' => $this->correo,

            'activo' => $this->activo
        ];
    }
}
