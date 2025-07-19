<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateDireccionInEmpresasTable extends Migration
{
    public function up()
    {
        Schema::table('empresas', function (Blueprint $table) {
            // Eliminar columnas antiguas
            $table->dropColumn(['calle', 'num_ext', 'num_int', 'colonia', 'num_empleados', 'cod_empresa']);

            // Agregar nuevas columnas
            $table->string('direccion')->after('rfc_empresa');
            $table->string('num')->nullable()->after('direccion');
            $table->string('empleados')->nullable()->after('adscripciones');
        });
    }

    public function down()
    {
        Schema::table('empresas', function (Blueprint $table) {
            // Revertir los cambios: volver a agregar y eliminar según corresponda
            $table->dropColumn(['direccion', 'num']);
            $table->string('calle')->nullable();
            $table->string('num_ext')->nullable();
            $table->string('num_int')->nullable();
            $table->string('colonia')->nullable();
            $table->string('num_empleados')->nullable();
            $table->string('cod_empresa')->nullable();
        });
    }
}
