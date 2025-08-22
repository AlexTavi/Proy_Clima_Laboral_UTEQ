<?php
namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromArray;
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

        // Hojas por adscripción
        foreach ($adscripciones as $adscripcion) {
            $sheets[] = new AdscripcionSheet($this->id_cuestionario, $adscripcion);
        }

        // Hoja global de respuestas agrupadas por dimensión
        $sheets[] = new DimensionSheet($this->id_cuestionario);

        // Hoja de totales de dimensión por área
        $sheets[] = new DimensionAreaSheet($this->id_cuestionario);

        return $sheets;
    }
}

/**
 * Hoja por Adscripción (ya la tienes)
 */
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
        $likert = [
            1 => 'Totalmente en desacuerdo',
            2 => 'En desacuerdo',
            3 => 'Parcialmente de acuerdo',
            4 => 'De acuerdo',
            5 => 'Totalmente de acuerdo',
        ];

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

            $final[] = [];
        }

        return $final;
    }

    public function title(): string
    {
        return $this->adscripcion;
    }
}

/**
 * Hoja global: Respuestas agrupadas por dimensión
 */
class DimensionSheet implements FromArray, WithTitle
{
    protected $id_cuestionario;

    public function __construct($id_cuestionario)
    {
        $this->id_cuestionario = $id_cuestionario;
    }

    public function array(): array
    {
        $final = [];
        $final[] = ['Dimensión', 'Pregunta', 'Respuesta', 'Total'];

        $data = DB::table('respuestas as val')
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

        foreach ($data as $row) {
            $final[] = [$row->dimension, $row->pregunta, $row->respuesta, $row->total];
        }

        return $final;
    }

    public function title(): string
    {
        return 'Por Dimensión';
    }
}

/**
 * Hoja: Totales de dimensión por área
 */
class DimensionAreaSheet implements FromArray, WithTitle
{
    protected $id_cuestionario;

    public function __construct($id_cuestionario)
    {
        $this->id_cuestionario = $id_cuestionario;
    }

    public function array(): array
    {
        $final = [];
        $final[] = ['Área', 'Dimensión', 'Total respuestas'];

        $data = DB::table('respuestas as val')
            ->join('participantes as p', 'p.id_participante', '=', 'val.id_participante')
            ->join('reactivos as r', 'r.id_reactivo', '=', 'val.id_reactivo')
            ->join('dimensions as d', 'd.id_dimension', '=', 'r.id_dimension')
            ->select(
                'p.area',
                'd.nombre as dimension',
                DB::raw('COUNT(val.respuesta) as total')
            )
            ->where('p.id_cuestionario', $this->id_cuestionario)
            ->groupBy('p.area', 'd.nombre')
            ->orderBy('p.area')
            ->orderBy('d.nombre')
            ->get();

        foreach ($data as $row) {
            $final[] = [$row->area, $row->dimension, $row->total];
        }

        return $final;
    }

    public function title(): string
    {
        return 'Totales Dimensión/Área';
    }
}
