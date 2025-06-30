<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Formulario extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'nombreEmpresa',
        'giro',
        'estructura',
        'adscripciones',
        'empleados',
        'domicilio',
        'telefono',
        'responsable',
        'additionalQuestions',
        'answers',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'estructura' => 'array',
        'adscripciones' => 'array',
        'additionalQuestions' => 'array',
        'answers' => 'array',
        'created_at' => 'datetime:Y-m-d H:i:s', // Formato consistente para fechas
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        // 'campo_sensible', // Si hay algún campo que no deba exponerse en respuestas JSON
    ];

    /**
     * Accesor para el teléfono formateado
     */
    protected function telefono(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->formatPhoneNumber($value),
            set: fn ($value) => preg_replace('/[^0-9]/', '', $value),
        );
    }

    /**
     * Formatea el número de teléfono
     */
    private function formatPhoneNumber(string $phone): string
    {
        // Implementa tu lógica de formateo aquí
        return $phone;
    }

    /**
     * Scope para filtrar por nombre de empresa
     */
    public function scopePorEmpresa($query, string $nombre)
    {
        return $query->where('nombreEmpresa', 'like', "%{$nombre}%");
    }

    /**
     * Scope para formularios recientes
     */
    public function scopeRecientes($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Boot del modelo
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Lógica adicional al crear (ej: sanitización)
            $model->nombreEmpresa = trim($model->nombreEmpresa);
            $model->responsable = trim($model->responsable);
        });
    }
}