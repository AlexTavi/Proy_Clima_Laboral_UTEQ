<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function resultadosDashboard($id_cuestionario): \Illuminate\Http\JsonResponse
    {
        $likert = [
            1 => 'Muy en desacuerdo',
            2 => 'En desacuerdo',
            3 => 'Neutral',
            4 => 'De acuerdo',
            5 => 'Muy de acuerdo'
        ];

        // ----------------------
        // 1. Resultados por Dimensión
        // ----------------------
        $rawDimensiones = DB::table('respuestas as val')
            ->join('participantes as p', 'p.id_participante', '=', 'val.id_participante')
            ->join('reactivos as r', 'r.id_reactivo', '=', 'val.id_reactivo')
            ->join('dimensions as d', 'd.id_dimension', '=', 'r.id_dimension')
            ->select('d.nombre as dimension', 'val.respuesta', DB::raw('COUNT(*) as total'))
            ->where('p.id_cuestionario', $id_cuestionario)
            ->groupBy('d.nombre', 'val.respuesta')
            ->orderBy('d.nombre')
            ->get();

        $pivotDimensiones = [];
        foreach ($rawDimensiones as $row) {
            if (!isset($pivotDimensiones[$row->dimension])) {
                $pivotDimensiones[$row->dimension] = [
                    'dimension' => $row->dimension,
                    $likert[1] => 0,
                    $likert[2] => 0,
                    $likert[3] => 0,
                    $likert[4] => 0,
                    $likert[5] => 0
                ];
            }
            $pivotDimensiones[$row->dimension][$likert[$row->respuesta]] = $row->total;
        }
        $resultadosPorDimension = array_values($pivotDimensiones);

        // ----------------------
        // 2. Resultados por Área y Dimensión
        // ----------------------
        $rawAreas = DB::table('respuestas as val')
            ->join('participantes as p', 'p.id_participante', '=', 'val.id_participante')
            ->join('reactivos as r', 'r.id_reactivo', '=', 'val.id_reactivo')
            ->join('dimensions as d', 'd.id_dimension', '=', 'r.id_dimension')
            ->select('p.area', 'd.nombre as dimension', 'val.respuesta', DB::raw('COUNT(*) as total'))
            ->where('p.id_cuestionario', $id_cuestionario)
            ->groupBy('p.area', 'd.nombre', 'val.respuesta')
            ->orderBy('p.area')
            ->orderBy('d.nombre')
            ->get();

        $pivotAreas = [];
        foreach ($rawAreas as $row) {
            $key = $row->area . '|' . $row->dimension;
            if (!isset($pivotAreas[$key])) {
                $pivotAreas[$key] = [
                    'area' => $row->area,
                    'dimension' => $row->dimension,
                    $likert[1] => 0,
                    $likert[2] => 0,
                    $likert[3] => 0,
                    $likert[4] => 0,
                    $likert[5] => 0
                ];
            }
            $pivotAreas[$key][$likert[$row->respuesta]] = $row->total;
        }
        $resultadosPorAreaDimension = array_values($pivotAreas);

        // ----------------------
        // 3. Resultados Globales
        // ----------------------
        $rawGlobales = DB::table('respuestas as val')
            ->join('participantes as p', 'p.id_participante', '=', 'val.id_participante')
            ->where('p.id_cuestionario', $id_cuestionario)
            ->select('val.respuesta', DB::raw('COUNT(*) as total'))
            ->groupBy('val.respuesta')
            ->orderBy('val.respuesta')
            ->get();

        $resultadosGlobales = [];
        foreach ($likert as $key => $label) {
            $resultadosGlobales[] = [
                'respuesta' => $label,
                'total' => $rawGlobales->firstWhere('respuesta', $key)->total ?? 0
            ];
        }

        // ----------------------
        // Respuesta final
        // ----------------------
        return response()->json([
            'por_dimension' => $resultadosPorDimension,
            'por_area_dimension' => $resultadosPorAreaDimension,
            'global' => $resultadosGlobales
        ]);
    }
}
