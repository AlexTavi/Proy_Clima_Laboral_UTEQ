<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogProtectedRequests
{
    public function handle(Request $request, Closure $next)
    {
        // Capturamos los datos principales de la solicitud
        Log::channel('daily')->info('📥 Solicitud a ruta protegida', [
            'ip'       => $request->ip(),
            'método'   => $request->method(),
            'url'      => $request->fullUrl(),
            'headers'  => $request->headers->all(),
            'cookies'  => $request->cookies->all(),
            'payload'  => $request->all(),
        ]);

        // Validar si falta token o cookie de Sanctum
        if (
            !$request->bearerToken() &&
            !$request->cookie(config('sanctum.cookie'))
        ) {
            Log::channel('daily')->warning('⚠️ Posible fallo de autenticación Sanctum: No se encontró token ni cookie', [
                'ip'      => $request->ip(),
                'headers' => $request->headers->all(),
            ]);
        }

        return $next($request);
    }
}
