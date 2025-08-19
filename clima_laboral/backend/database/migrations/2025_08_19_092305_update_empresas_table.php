<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            // Cambiar longitud de varchar (requiere doctrine/dbal instalado)
            $table->string('rfc_empresa', 15)->change();

            // Agregar columna nueva
            $table->string('colonia')->nullable()->after('rfc_empresa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            // Revertir cambios
            $table->string('rfc_empresa', 12)->change();
            $table->dropColumn('colonia');
        });
    }
};
