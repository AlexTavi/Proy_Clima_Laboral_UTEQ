<?php
namespace App\Exports;


use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromArray;

class FrecuenciaExport implements FromArray
{
    protected $id_cuestionario;

    public function __construct($id_cuestionario)
    {
        $this->id_cuestionario = $id_cuestionario;
    }

    public function array(): array
    {
        $rawData = DB::table('respuestas as val')
            ->join('participantes as p', 'p.id_participante', '=', 'val.id_participante')
            ->join('reactivos as r', 'r.id_reactivo', '=', 'val.id_reactivo')
            ->join('dimensions as d', 'd.id_dimension', '=', 'r.id_dimension')
            ->select(
                'd.nombre as dimension',
                'r.pregunta',
                'val.respuesta',
                DB::raw('COUNT(*) as total')
            )
            ->where('p.id_cuestionario', $this->id_cuestionario)
            ->groupBy('d.nombre', 'r.pregunta', 'val.respuesta')
            ->orderBy('d.nombre')
            ->orderBy('r.pregunta')
            ->orderBy('val.respuesta')
            ->get();

        // Reestructurar los datos en formato pivote
        $pivot = [];

        foreach ($rawData as $row) {
            $key = $row->dimension . '|' . $row->pregunta;

            if (!isset($pivot[$key])) {
                $pivot[$key] = [
                    'dimension' => $row->dimension,
                    'pregunta' => $row->pregunta,
                    1 => 0,
                    2 => 0,
                    3 => 0,
                    4 => 0,
                    5 => 0,
                ];
            }

            $pivot[$key][$row->respuesta] = $row->total;
        }

        // Construir la estructura final para exportar
        $estructura = [];
        $estructura[] = ['Dimensión', 'Pregunta', '1', '2', '3', '4', '5'];

        foreach ($pivot as $item) {
            $estructura[] = [
                $item['dimension'],
                $item['pregunta'],
                $item[1] ?? 0,
                $item[2] ?? 0,
                $item[3] ?? 0,
                $item[4] ?? 0,
                $item[5] ?? 0,
            ];
        }

        return $estructura;
    }

}
