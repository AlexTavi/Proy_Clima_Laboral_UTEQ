<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cuestionario;
use App\Models\Dimension;
use App\Models\Escala;
use App\Models\Cuestionario_reactivo;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CuestionarioController extends Controller
{
    public function index()
    {
        $cuestionarios = Cuestionario::with('cuestionario_empresa', 'cuestionario_token')
            ->get()
            ->map(function($c) {
                $totalTokens = $c->cuestionario_token->count();
                $tokensUsados = $c->cuestionario_token->where('usado', true)->count();
                $statusToken = $totalTokens > 0 ? 'activo' : 'inactivo';

                return [
                    'id_cuestionario' => $c->id_cuestionario,
		            'id_empresa' => $c->id_empresa,
                    'nom_empresa' => $c->cuestionario_empresa ? $c->cuestionario_empresa->nom_empresa : null,
                    'tipo' => $c->tipo,
                    'created_at' => $c->fecha_creacion,
                    'updated_at' => $c->updated_at,
                    'tokens' => $totalTokens,
                    'tokens_usados' => $tokensUsados,
                    'status_token' => $statusToken,
                ];
            });

        return response()->json($cuestionarios);
    }

    public function getCuestionarioEdit(Request $request)
    {
        $id_cuestionario = $request->input('id_cuestionario');
        // Trae los reactivos de ese cuestionario con sus escalas y datos de la pregunta
        $cuestionario = Cuestionario::with([
            'cuestionario_cr.cr_reactivo.dimension',
            'cuestionario_cr.cr_escala'
        ])->findOrFail($id_cuestionario);

        // Catálogo de dimensiones
        $dimensiones = Dimension::all(['id_dimension', 'nombre']);
        // Catálogo de escalas
        $escalas = Escala::all(['id_escala', 'nombre']);
        //dd($cuestionario->cuestionario_cr);


        // Estructura para frontend
        $preguntas = $cuestionario->cuestionario_cr->map(function($cr) {
            return [
                'id_cr' => $cr->id_cr,
                'id_cuestionario' => $cr->id_cuestionario,
                'id_reactivo' => $cr->id_reactivo,
                'pregunta' => $cr->cr_reactivo?->pregunta,
                'id_dimension' => $cr->cr_reactivo?->id_dimension,
                'nom_dimension' => $cr->cr_reactivo?->dimension->nombre ?? null,
                'id_escala' => $cr->id_escala,
                'nom_escala' => $cr->cr_escala->nombre ?? null
            ];
        });

        return response()->json([
            'cuestionario' => [
                'id_cuestionario' => $cuestionario->id_cuestionario,
                'preguntas' => $preguntas
            ],
            'dimensiones' => $dimensiones,
            'escalas' => $escalas
        ]);
    }

    public function update(Request $request, $id_cr)
    {
        // Buscar el registro pivote
        $cuestionarioReactivo = Cuestionario_reactivo::findOrFail($id_cr);

        // Actualizar escala si viene en la petición
        if ($request->has('id_escala')) {
            $cuestionarioReactivo->id_escala = $request->input('id_escala');
        }
        $cuestionarioReactivo->save();

        // Actualizar datos del reactivo (pregunta y dimensión) si vienen en la petición
        if ($cuestionarioReactivo->cr_reactivo) {
            $reactivo = $cuestionarioReactivo->cr_reactivo;
            if ($request->has('pregunta')) {
                $reactivo->pregunta = $request->input('pregunta');
            }
            if ($request->has('id_dimension')) {
                $reactivo->id_dimension = $request->input('id_dimension');
            }
            $reactivo->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Pregunta actualizada correctamente'
        ]);
    }
    public function destroyReactivo($id_cr)
    {
        try {
            $reactivo = Cuestionario_reactivo::find($id_cr);

            if (!$reactivo) {
                return response()->json([
                    'success' => false,
                    'message' => ' Reactivo no encontrado.'
                ], 200);
            }

            $reactivo->delete();

            return response()->json([
                'success' => true,
                'message' => '✅ Pregunta eliminada correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => ' Error al eliminar: ' . $e->getMessage()
            ], 200);
        }
    }
    public function destroyFormulario($id_cuestionario)
    {
        try {
            $formulario = Cuestionario::find($id_cuestionario);

            if (!$formulario) {
                return response()->json([
                    'success' => false,
                    'message' => ' Reactivo no encontrado.'
                ], 200);
            }

            $formulario->delete();

            return response()->json([
                'success' => true,
                'message' => '✅ Formulario eliminada correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => ' Error al eliminar: ' . $e->getMessage()
            ], 200);
        }
    }


}
