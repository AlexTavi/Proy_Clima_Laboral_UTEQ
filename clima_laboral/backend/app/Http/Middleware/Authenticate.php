<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Si es una petición API, no redirigir (esto soluciona el error)
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        // Solo para peticiones web, intentar redirigir a login
        return route('login');
    }
}
