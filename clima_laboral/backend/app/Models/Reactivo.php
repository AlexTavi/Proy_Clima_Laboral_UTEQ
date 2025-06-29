<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reactivo extends Model
{
    protected $table = 'reactivos';
    protected $primaryKey = 'id_reactivo';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'id_dimension',
        'pregunta',
        'tipo',
    ];
    public function dimension(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Dimension::class, 'id_dimension', 'id_dimension');
    }
    public function reactivo_cr(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Cuestionario_reactivo::class, 'id_reactivo', 'id_reactivo');
    }
    public function reactivo_respuesta(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Respuesta::class, 'id_reactivo', 'id_reactivo');
    }
}
