<?php

namespace App\Http\Controllers;

use App\Http\Resources\MunicipioResource;
use App\Models\Municipio;
use Illuminate\Http\Request;

class MunicipioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return MunicipioResource::collection(
            Municipio::where('activo', 1)->orderBy('nombre')->get()
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

        $municipio = Municipio::create([
            'nombre' => $request->nombre,
            'activo' => 1
        ]);

        return new MunicipioResource($municipio);
    }

    /**
     * Display the specified resource.
     */
    public function show(Municipio $municipio)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $municipio = Municipio::findOrFail($id);

        $municipio->nombre = $request->nombre;
        $municipio->save();

        return new MunicipioResource($municipio);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $municipio = Municipio::findOrFail($id);

        $municipio->activo = 0;       
        $municipio->save(); 

        return response()->json(['ok' => true]);
    }
}
