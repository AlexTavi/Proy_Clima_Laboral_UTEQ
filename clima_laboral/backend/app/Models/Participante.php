<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participante extends Model
{
    protected $table = 'participantes';
    protected $primaryKey = 'id_participante';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'id_empresa',
        'id_cuestionario',
        'token_acceso',
        'adscripcion',
        'area',
        'puesto',
        'reporta_a',
        'antiguedad',
        'tipo_contrato',
        'escolaridad',
        'discapacidad',
        'tipo_discapacidad',
        'sector_poblacional',
    ];
    public function participante_empresa(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'id_empresa', 'id_empresa');
    }
    public function participante_cuestionario(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Cuestionario::class, 'id_cuestionario', 'id_cuestionario');
    }
    public function participante_respuesta(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Respuesta::class, 'id_participante', 'id_participante');
    }
}
