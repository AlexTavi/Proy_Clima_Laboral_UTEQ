<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cuestionario_reactivo extends Model
{
    protected $table = 'cuestionario_reactivos';
    protected $primaryKey = 'id_cr';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'id_cuestionario',
        'id_reactivo',
        'id_escala',
        'orden',
    ];
    public function cr_cuestionario(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Cuestionario::class, 'id_cuestionario', 'id_cuestionario');
    }
    public function cr_reactivo(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Reactivo::class, 'id_reactivo', 'id_reactivo');
    }
    public function cr_escala(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Escala::class, 'id_escala', 'id_escala');
    }
}
