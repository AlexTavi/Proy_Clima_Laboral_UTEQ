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
        'nom_empresa',
        'rfc_empresa',
        'cp',
        'municipio',
        'estado',
        'email_empresa',
        'giro',
        'estructura',
        'adscripciones',
        'cues_contratados',
        'fecha_inicio_vigencia',
        'fecha_fin_vigencia',
        'telefono',
        'responsable',
        'additionalQuestions',
        'answers',
        'direccion',
        'num',
        'empleados',
        'colonia'
    ];

    protected $casts = [
        'estructura' => 'array',
        'adscripciones' => 'array',
        'additionalQuestions' => 'array',
        'answers' => 'array',
    ];

    protected function telefono(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => preg_replace('/[^0-9]/', '', $value),
        );
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            $model->nom_empresa = trim($model->nom_empresa);
            $model->responsable = trim($model->responsable);
        });
    }

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
    public function empresa_token(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Token::class, 'id_empresa', 'id_empresa');
    }
}
