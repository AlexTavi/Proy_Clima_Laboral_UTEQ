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
//        dd($cuestionario->cuestionario_cr);


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


}
