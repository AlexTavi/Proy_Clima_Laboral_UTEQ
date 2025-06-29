<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'empresas';
    protected $primaryKey = 'id_empresa';
    public $incrementing = true;
    protected $keyType = 'int';

    // Campos que se pueden llenar con create() o update()
    protected $fillable = [
        'cod_empresa',
        'nom_empresa',
        'rfc_empresa',
        'calle',
        'num_ext',
        'num_int',
        'colonia',
        'cp',
        'municipio',
        'estado',
        'email_empresa',
        'giro',
        'num_empleados',
        'estructura',
        'adscripciones',
        'cues_contratados',
        'fecha_inicio_vigencia',
        'fecha_fin_vigencia',
    ];
    public function empresa_usuarios(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Usuario::class, 'id_empresa', 'id_empresa');
    }
    public function empresa_participante(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Participante::class, 'id_empresa', 'id_empresa');
    }
    public function empresa_cuestionario(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Cuestionario::class, 'id_empresa', 'id_empresa');
    }
}
