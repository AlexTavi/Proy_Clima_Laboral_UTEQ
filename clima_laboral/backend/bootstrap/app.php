<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Configurar qué hacer cuando un usuario no está autenticado
        $middleware->redirectGuestsTo(function ($request) {
            // Para APIs, no redirigir - esto evita el error "Route [login] not defined"
            if ($request->expectsJson() || $request->is('api/*')) {
                return null;
            }

            // Para web, solo redirigir si existe la ruta login
            try {
                return route('login');
            } catch (\Exception $e) {
                return null;
            }
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
