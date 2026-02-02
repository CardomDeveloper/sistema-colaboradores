<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartamantoResource;
use App\Models\Departamento;
use Illuminate\Http\Request;

class DepartamentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return DepartamantoResource::collection(
            Departamento::where('activo', 1)->orderBy('nombre')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100'
        ]);

        $departamento = Departamento::create([
            'nombre' => $request->nombre,
            'activo' => 1
        ]);

        return new DepartamantoResource($departamento);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $departamento = Departamento::findOrFail($id);

        $departamento->nombre = $request->nombre;
        $departamento->save();

        return new DepartamantoResource($departamento);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $departamento = Departamento::findOrFail($id);

        $departamento->activo = 0;       
        $departamento->save(); 

        return response()->json(['ok' => true]);
    }
}
