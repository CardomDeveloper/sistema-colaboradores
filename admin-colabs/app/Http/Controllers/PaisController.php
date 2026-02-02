<?php

namespace App\Http\Controllers;

use App\Models\Pais;
use Illuminate\Http\Request;
use App\Http\Resources\PaisResource;
use Illuminate\Container\Attributes\Log;

class PaisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PaisResource::collection(
            Pais::where('activo', 1)->orderBy('nombre')->get()
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

        $pais = Pais::create([
            'nombre' => $request->nombre,
            'activo' => 1
        ]);

        return new PaisResource($pais);
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
    public function update(Request $request, $id)
    {
        $pais = Pais::findOrFail($id);

        $pais->nombre = $request->nombre;
        $pais->save();

        return new PaisResource($pais);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $pais = Pais::findOrFail($id);

        $pais->activo = 0;       
        $pais->save(); 

        return response()->json(['ok' => true]);
    }
}
