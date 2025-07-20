<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Formulario;
use Illuminate\Support\Facades\Log;

class FormularioController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $this->validateRequest($request);

            $formulario = Formulario::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Formulario guardado correctamente',
                'data' => $formulario
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e);

        } catch (\Exception $e) {
            Log::error('Error al guardar formulario: ' . $e->getMessage());
            return $this->serverErrorResponse($e);
        }
    }

    /**
     * Validate the request data
     */
    protected function validateRequest(Request $request): array
    {
        return $request->validate([
            'nombreEmpresa' => 'required|string|max:255',
            'giro' => 'required|string|max:255',
            'estructura' => 'required|array',
            'adscripciones' => 'required|array',
            'empleados' => 'required|string|max:100',
            'domicilio' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'responsable' => 'required|string|max:255',
            'additionalQuestions' => 'required|array',
            'answers' => 'required|array',
        ]);
    }

    /**
     * Handle validation errors
     */
    protected function validationErrorResponse(\Illuminate\Validation\ValidationException $e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Error de validación',
            'errors' => $e->errors()
        ], 422);
    }

    /**
     * Handle server errors
     */
    protected function serverErrorResponse(\Exception $e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Error al procesar el formulario',
            'error' => env('APP_DEBUG') ? $e->getMessage() : 'Error interno del servidor'
        ], 500);
    }
    // En App/Http/Controllers/FormularioController.php
    public function index()
    {
        try {
            $formularios = Formulario::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $formularios
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error al obtener formularios: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los formularios'
            ], 500);
        }
    }
}
