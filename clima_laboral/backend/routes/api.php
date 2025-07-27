<?php

use App\Http\Controllers\EmpresaController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CuestionarioController;

// ==============================
// Rutas públicas (sin autenticación)
// ==============================
Route::get('/cuestionarios', [CuestionarioController::class, 'index']);
Route::post('/cuestionario/edit', [CuestionarioController::class, 'getCuestionarioEdit']);
Route::put('/update-reactivos/{id_cr}', [CuestionarioController::class, 'update']);
Route::delete('/delete-reactivos/{id_cr}', [CuestionarioController::class, 'destroyReactivo']);


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ==============================
// Rutas protegidas (requieren token Sanctum)
// ==============================
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/forms', [EmpresaController::class, 'store']);
    Route::get('/forms', [EmpresaController::class, 'index']);
    Route::post('/destroy/empresa', [EmpresaController::class, 'destroy']);
});
