<?php

use App\Http\Controllers\EmpresaController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CuestionarioController;
use App\Http\Controllers\FrecuenciaExportController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
// Rutas protegidas con Sanctum (requieren token)
Route::middleware(['log.protected', 'auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/forms', [EmpresaController::class, 'store']);
    Route::get('/forms', [EmpresaController::class, 'index']);
    Route::post('/destroy/empresa', [EmpresaController::class, 'destroy']);
    Route::get('/cuestionarios', [CuestionarioController::class, 'index']);
    Route::post('/cuestionario/edit', [CuestionarioController::class, 'getCuestionarioEdit']);
    Route::put('/update-reactivos/{id_cr}', [CuestionarioController::class, 'update']);
    Route::delete('/delete-reactivos/{id_cr}', [CuestionarioController::class, 'destroyReactivo']);
    Route::get('/empresa/{id}/edit', [EmpresaController::class, 'edit']);
    Route::put('/empresa/{id}', [EmpresaController::class, 'update']);
    Route::delete('/forms/{id_cuestionario}', [CuestionarioController::class, 'destroyFormulario']);
    Route::get('/exportar-frecuencia/{id_cuestionario}', [FrecuenciaExportController::class, 'exportar']);
    Route::post('/create-reactivo', [CuestionarioController::class, 'store']);
});
