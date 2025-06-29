<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Respuesta extends Model
{
    protected $table = 'respuestas';
    protected $primaryKey = 'id_respuesta';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'id_participante',
        'id_reactivo',
        'respuesta',
    ];
    public function respuesta_participante()
    {
        return $this->belongsTo(Participante::class, 'id_participante', 'id_participante');
    }
    public function reapuesta_reactivo()
    {
        return $this->belongsTo(Reactivo::class, 'id_reactivo', 'id_reactivo');
    }
}
