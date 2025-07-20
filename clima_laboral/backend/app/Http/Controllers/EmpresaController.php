<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empresa;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class EmpresaController extends Controller
{
    public function store(Request $request)
    {
        try {
            $this->sanitizeRequest($request);

            $validated = $this->validateRequest($request);

            $formulario = Empresa::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Formulario guardado correctamente',
                'data' => $formulario
            ], 201);

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);

        } catch (\Exception $e) {
            Log::error('Error al guardar formulario: ' . $e->getMessage());
            return $this->serverErrorResponse($e);
        }
    }
    protected function validateRequest(Request $request): array
    {
        return $request->validate([
            'nom_empresa' => 'required|string|max:60',
            'rfc_empresa' => 'nullable|string|max:12',
            'cp' => 'required|string|max:5',
            'municipio' => 'required|string|max:60',
            'estado' => 'required|string|max:60',
            'email_empresa' => 'required|string|max:40',
            'giro' => 'required|string|max:80',
            'estructura' => 'required|array',
            'adscripciones' => 'required|array',
            'telefono' => 'nullable|string|max:20',
            'responsable' => 'required|string|max:255',
            'additionalQuestions' => 'nullable|array',
            'answers' => 'nullable|array',
            'direccion' => 'required|string|max:255',
            'num' => 'nullable|string|max:255',
            'empleados' => 'required|string|max:255',
        ]);
    }
    protected function sanitizeRequest(Request $request): void
    {
        $sanitized = [];
        foreach ($request->all() as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = trim($value);
            } elseif (is_array($value)) {
                $sanitized[$key] = array_map(function ($item) {
                    return is_string($item) ? trim($item) : $item;
                }, $value);
            } else {
                $sanitized[$key] = $value;
            }
        }
        $request->replace($sanitized);
    }
    protected function validationErrorResponse(ValidationException $e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Error de validación',
            'errors' => $e->errors()
        ], 201);
    }
    protected function serverErrorResponse(\Exception $e)
    {
        return response()->json([
            'success' => false,
            'message' => 'Error al procesar el formulario',
            'error' => env('APP_DEBUG') ? $e->getMessage() : 'Error interno del servidor'
        ], 201);
    }
    public function index()
    {
        try {
            $formularios = Empresa::orderBy('created_at', 'desc')->get();

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
