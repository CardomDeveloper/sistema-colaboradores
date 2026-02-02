<?php

namespace App\Http\Controllers;

use App\Http\Resources\ColaboradorResource;
use App\Models\Colaborador;
use Illuminate\Http\Request;

class ColaboradorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        return ColaboradorResource::collection(
            Colaborador::with('empresa')->where('activo', 1)->orderBy('nombre_completo')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'empresa_id' => ['required', 'integer', 'exists:empresas,id'],
            'nombre_completo' => ['required', 'string', 'max:160'],
            'edad' => ['required', 'integer', 'min:0', 'max:120'],
            'telefono' => ['nullable', 'string', 'max:30'],
            'correo' => ['nullable', 'email', 'max:120'],
        ]);

        $colaborador = Colaborador::create([
            ...$data,
            'activo' => 1
        ]);

        
        $colaborador->load('empresa');

        return new ColaboradorResource($colaborador);
    }

    /**
     * Display the specified resource.
     */
    public function show(Colaborador $colaborador)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $colaborador = Colaborador::findOrFail($id);

        $data = $request->validate([
            'empresa_id' => ['required', 'integer', 'exists:empresas,id'],
            'nombre_completo' => ['required', 'string', 'max:160'],
            'edad' => ['required', 'integer', 'min:0', 'max:120'],
            'telefono' => ['nullable', 'string', 'max:30'],
            'correo' => ['nullable', 'email', 'max:120'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $colaborador->update($data);
        $colaborador->load('empresa');

        return new ColaboradorResource($colaborador);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $colaborador = Colaborador::findOrFail($id);
        $colaborador->activo = 0;
        $colaborador->save();

        return response()->json(['ok' => true]);
    }
}
