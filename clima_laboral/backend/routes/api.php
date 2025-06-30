<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FormularioController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forms', [FormularioController::class, 'store']); // <-- Ruta pública
// En routes/api.php
Route::get('/forms', [FormularioController::class, 'index']); // Ruta pública para obtener formularios

// Rutas protegidas con Sanctum (requieren token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Aquí irían otras rutas que SÍ requieran autenticación
    // Ejemplo: Route::get('/user-forms', [FormularioController::class, 'index']);
});