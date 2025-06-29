<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dimension extends Model
{
    protected $table = 'dimensions';
    protected $primaryKey = 'id_dimension';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];
    public function dimension_reactivo(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Reactivo::class, 'id_dimension', 'id_dimension');
    }

}
