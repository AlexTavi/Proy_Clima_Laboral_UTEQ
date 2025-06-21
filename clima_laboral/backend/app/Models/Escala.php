<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Escala extends Model
{
    protected $table = 'escalas';
    protected $primaryKey = 'id_escalas';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nombre',
        'valor_min',
        'valor_max',
        'etquetas',
    ];
    public function escala_cr(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Cuestionario_reactivo::class, 'id_escala', 'id_escala');
    }
}
