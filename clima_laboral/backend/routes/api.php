<?php

use App\Http\Controllers\EmpresaController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CuestionarioController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
// Rutas protegidas con Sanctum (requieren token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/forms', [EmpresaController::class, 'store']);
    Route::get('/forms', [EmpresaController::class, 'index']);
    Route::post('/destroy/empresa', [EmpresaController::class, 'destroy']);
    Route::get('/cuestionario/edit', [CuestionarioController::class, 'getCuestionarioEdit']);
    Route::put('/update/reactivo', [CuestionarioController::class, 'update']);

    // Aquí irían otras rutas que SÍ requieran autenticación
    // Ejemplo: Route::get('/user-forms', [FormularioController::class, 'index']);
});
