<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\FrecuenciaExport;
use Maatwebsite\Excel\Facades\Excel;

class FrecuenciaExportController extends Controller
{
    public function exportar($id_cuestionario)
    {
        return Excel::download(new FrecuenciaExport($id_cuestionario), 'frecuencia_cuestionario.xlsx');
    }
}
