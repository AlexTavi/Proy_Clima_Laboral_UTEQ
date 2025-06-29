<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try{
            $request->validate([
                'email' => 'required|email',
                'contrasena' => 'required',
            ], [
                'email.required' => 'El correo es obligatorio',
                'email.email' => 'El correo debe tener formato válido',
                'contrasena.required' => 'La contraseña es obligatoria',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->errors(),
                'message' => 'Datos inválidos, revisa los campos'
            ], 422);
        }

        // Buscar el usuario
        $usuario = Usuario::where('email', $request->email)->first();

        // Verificar si el usuario existe y la contraseña es correcta
        if (!$usuario || !Hash::check($request->contrasena, $usuario->contrasena)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Crear token de Sanctum
        $token = $usuario->createToken('auth-token')->plainTextToken;

        return response()->json([
            'mensaje' => 'Login exitoso',
            'usuario' => $usuario,
            'token' => $token,
            'token_tipo' => 'Bearer'
        ], 200);
    }

    public function logout(Request $request)
    {
        // Eliminar el token actual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout exitoso'
        ], 200);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    public function register(Request $request)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:255',
                'email' => 'required|email|unique:usuarios,email',
                'contrasena' => 'required|string|min:6',
            ], [
                'nombre.required' => 'El nombre es obligatorio',
                'email.required' => 'El correo es obligatorio',
                'email.email' => 'El correo debe tener formato válido',
                'email.unique' => 'El correo ya está registrado',
                'contrasena.required' => 'La contraseña es obligatoria',
                'contrasena.min' => 'La contraseña debe tener mínimo 6 caracteres',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->errors(),
                'mensaje' => 'Datos inválidos, revisa los campos'
            ], 422);
        }


        // Crear usuario con contraseña hasheada
        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'contrasena' => Hash::make($request->contrasena),
        ]);

        return response()->json([
            'mensaje' => 'Usuario registrado correctamente',
            'usuario' => $usuario
        ], 201);
    }
}
