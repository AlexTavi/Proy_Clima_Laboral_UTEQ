<?php

use Illuminate\Support\Facades\Route;

// Ruta de prueba para verificar que la API responde
Route::get('/ping', function () {
    return response()->json([
        'message' => 'pong',
    ]);
});
