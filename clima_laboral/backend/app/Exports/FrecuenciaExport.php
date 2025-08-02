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
        $data = DB::table('respuestas as val')
            ->join('participantes as p', 'p.id_participante', '=', 'val.id_participante')
            ->join('reactivos as r', 'r.id_reactivo', '=', 'val.id_reactivo')
            ->join('dimensions as d', 'd.id_dimension', '=', 'r.id_dimension')
            ->select(
                'd.nombre as dimension',
                'r.pregunta',
                'val.respuesta',
                DB::raw('COUNT(*) as repeticiones')
            )
            ->where('p.id_cuestionario', $this->id_cuestionario)
            ->groupBy('d.nombre', 'r.pregunta', 'val.respuesta')
            ->orderBy('d.nombre')
            ->orderBy('r.pregunta')
            ->orderBy('val.respuesta')
            ->get();

        $estructura = [];
        $estructura[] = ['Dimensión', 'Pregunta', 'Respuesta', 'Repeticiones'];

        foreach ($data as $row) {
            $estructura[] = [
                $row->dimension,
                $row->pregunta,
                $row->respuesta,
                $row->repeticiones,
            ];
        }

        return $estructura;
    }
}
