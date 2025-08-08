<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;

class ApiAuth
{
    public function handle(Request $request, Closure $next, ...$guards)
    {
        if (empty($guards)) {
            $guards = ['sanctum'];
        }

        foreach ($guards as $guard) {
            if (auth($guard)->check()) {
                return $next($request);
            }
        }

        return response()->json([
            'message' => 'Unauthenticated.'
        ], 401);
    }
}
