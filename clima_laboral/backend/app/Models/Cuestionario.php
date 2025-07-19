<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cuestionario extends Model
{
    protected $table = 'cuestionarios';
    protected $primaryKey = 'id_cuestionario';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'id_empresa',
        'tipo',
        'fecha_creacion',
        'secciones',
        'logo_empresa',
        'aleatorio',
    ];
    public function cuestionario_empresa(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'id_empresa', 'id_empresa');
    }
    public function cuestionario_cr(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Cuestionario_reactivo::class, 'id_cuestionario', 'id_cuestionario');
    }
    public function cuestionario_participante(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Participante::class, 'id_cuestionario', 'id_cuestionario');
    }
    public function cuestionario_token(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Token::class, 'id_cuestionario', 'id_cuestionario');
    }
}
