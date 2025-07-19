<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    protected $table = 'tokens';
    protected $primaryKey = 'id_token';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'id_cuestionario',
        'id_empresa',
        'token',
        'usado',
        'usado_en',
    ];
    public function token_cuestionario(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Cuestionario::class, 'id_cuestionario', 'id_cuestionario');
    }
    public function token_empresa(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'id_empresa', 'id_empresa');
    }
}
