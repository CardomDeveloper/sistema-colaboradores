<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmpresaResource;
use App\Models\Empresa;
use Illuminate\Http\Request;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return EmpresaResource::collection(
            Empresa::where('activo', 1)->orderBy('razon_social')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            // fks
            'pais_id' => ['required','integer','exists:paises,id'],
            'departamento_id' => ['required','integer','exists:departamentos,id'],
            'municipio_id' => ['required','integer','exists:municipios,id'],

            'nit' => ['required','string','max:30','unique:empresas,nit'],
            'razon_social' => ['required','string','max:160'],
            'nombre_comercial' => ['nullable','string','max:160'],
            'telefono' => ['nullable','string','max:30'],
            'correo' => ['nullable','email','max:120'],
        ]);

        $empresa = Empresa::create([
            ...$data,
            'activo' => 1
        ]);

        return new EmpresaResource($empresa);
    }

    /**
     * Display the specified resource.
     */
    public function show(Empresa $empresa)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
       $empresa = Empresa::findOrFail($id);

        $data = $request->validate([
            'pais_id' => ['required','integer','exists:paises,id'],
            'departamento_id' => ['required','integer','exists:departamentos,id'],
            'municipio_id' => ['required','integer','exists:municipios,id'],

            'nit' => ['required','string','max:30','unique:empresas,nit,' . $empresa->id],
            'razon_social' => ['required','string','max:160'],
            'nombre_comercial' => ['nullable','string','max:160'],
            'telefono' => ['nullable','string','max:30'],
            'correo' => ['nullable','email','max:120'],
            'activo' => ['nullable','boolean'],
        ]);

        $empresa->update($data);

        return new EmpresaResource($empresa);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $empresa = Empresa::findOrFail($id);
        $empresa->activo = 0;
        $empresa->save();

        return response()->json(['ok' => true]);
    }
}
