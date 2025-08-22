<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function resultadosDashboard($id_cuestionario)
    {
        // Mapeo de Likert a categorías
        $grupos = [
            1 => 'Insatisfecho',
            2 => 'Insatisfecho',
            3 => 'Indecisos',
            4 => 'Satisfechos',
            5 => 'Satisfechos',
        ];

        // Consulta a la BD
        $rawData = DB::table('respuestas as val')
            ->join('participantes as p', 'p.id_participante', '=', 'val.id_participante')
            ->join('reactivos as r', 'r.id_reactivo', '=', 'val.id_reactivo')
            ->join('dimensions as d', 'd.id_dimension', '=', 'r.id_dimension')
            ->select(
                'd.nombre as dimension',
                'val.respuesta',
                DB::raw('COUNT(*) as total')
            )
            ->where('p.id_cuestionario', $id_cuestionario)
            ->groupBy('d.nombre', 'val.respuesta')
            ->orderBy('d.nombre')
            ->get();

        // Pivot por dimensión
        $pivot = [];
        foreach ($rawData as $row) {
            $categoria = $grupos[$row->respuesta] ?? null;
            if (!$categoria) continue;

            if (!isset($pivot[$row->dimension])) {
                $pivot[$row->dimension] = [
                    'Insatisfecho' => 0,
                    'Indecisos' => 0,
                    'Satisfechos' => 0,
                    'total' => 0
                ];
            }

            $pivot[$row->dimension][$categoria] += $row->total;
            $pivot[$row->dimension]['total'] += $row->total;
        }

        // Convertir a porcentajes
        $final = [];
        foreach ($pivot as $dimension => $valores) {
            $total = $valores['total'] > 0 ? $valores['total'] : 1; // evitar división por 0
            $final[] = [
                'dimension' => $dimension,
                'Insatisfecho' => round(($valores['Insatisfecho'] / $total) * 100, 2),
                'Indecisos' => round(($valores['Indecisos'] / $total) * 100, 2),
                'Satisfechos' => round(($valores['Satisfechos'] / $total) * 100, 2),
            ];
        }

        return response()->json($final);
    }
}

