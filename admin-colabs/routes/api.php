<?php

use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ColaboradorController;
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\PaisController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('/categorias', CategoriaController::class);
Route::apiResource('/paises', PaisController::class);
Route::apiResource('/departamentos', DepartamentoController::class);
Route::apiResource('/municipios', MunicipioController::class);
Route::apiResource('/empresas', EmpresaController::class);
Route::apiResource('/colaboradores', ColaboradorController::class);
