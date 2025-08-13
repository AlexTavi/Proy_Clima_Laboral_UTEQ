<?php
namespace App\Exports;


use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;

class FrecuenciaExport implements WithMultipleSheets
{
    protected $id_cuestionario;

    public function __construct($id_cuestionario)
    {
        $this->id_cuestionario = $id_cuestionario;
    }

    public function sheets(): array
    {
        // Obtener todas las adscripciones
        $adscripciones = DB::table('participantes')
            ->where('id_cuestionario', $this->id_cuestionario)
            ->distinct()
            ->pluck('adscripcion');

        $sheets = [];

        foreach ($adscripciones as $adscripcion) {
            $sheets[] = new AdscripcionSheet($this->id_cuestionario, $adscripcion);
        }

        return $sheets;
    }
}

class AdscripcionSheet implements FromArray, WithTitle
{
    protected $id_cuestionario;
    protected $adscripcion;

    public function __construct($id_cuestionario, $adscripcion)
    {
        $this->id_cuestionario = $id_cuestionario;
        $this->adscripcion = $adscripcion;
    }

    public function array(): array
    {
        // Escala Likert de 5 puntos
        $likert = [
            1 => 'Muy en desacuerdo',
            2 => 'En desacuerdo',
            3 => 'Neutral',
            4 => 'De acuerdo',
            5 => 'Muy de acuerdo',
        ];

        // Obtener áreas de esa adscripción
        $areas = DB::table('participantes')
            ->where('id_cuestionario', $this->id_cuestionario)
            ->where('adscripcion', $this->adscripcion)
            ->distinct()
            ->pluck('area');

        $final = [];

        foreach ($areas as $area) {
            $final[] = ["Área: $area"];
            $final[] = ['Dimensión', 'Pregunta', ...array_values($likert)];

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
                ->where('p.adscripcion', $this->adscripcion)
                ->where('p.area', $area)
                ->groupBy('d.nombre', 'r.pregunta', 'val.respuesta')
                ->orderBy('d.nombre')
                ->orderBy('r.pregunta')
                ->orderBy('val.respuesta')
                ->get();

            $pivot = [];
            foreach ($rawData as $row) {
                $key = $row->dimension . '|' . $row->pregunta;
                if (!isset($pivot[$key])) {
                    $pivot[$key] = [
                        'dimension' => $row->dimension,
                        'pregunta' => $row->pregunta,
                        1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0
                    ];
                }
                $pivot[$key][$row->respuesta] = $row->total;
            }

            foreach ($pivot as $item) {
                $final[] = [
                    $item['dimension'],
                    $item['pregunta'],
                    $item[1] ?? 0,
                    $item[2] ?? 0,
                    $item[3] ?? 0,
                    $item[4] ?? 0,
                    $item[5] ?? 0,
                ];
            }

            $final[] = []; // Línea vacía entre áreas
        }

        return $final;
    }

    public function title(): string
    {
        return $this->adscripcion;
    }
}
