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
        Schema::create('empresas', function (Blueprint $table) {
            $table->id('id_empresa'); // Clave primaria autoincremental

            $table->string('cod_empresa', 12)->unique();
            $table->string('nom_empresa', 60);
            $table->string('rfc_empresa', 12)->nullable();

            $table->string('calle', 60)->nullable();
            $table->string('num_ext', 10)->nullable();
            $table->string('num_int', 10)->nullable();
            $table->string('colonia', 50)->nullable();
            $table->string('cp', 5)->nullable();
            $table->string('municipio', 60)->nullable();
            $table->string('estado', 60)->nullable();

            $table->string('email_empresa', 40)->nullable();
            $table->string('giro', 80)->nullable();
            $table->string('num_empleados', 20)->nullable();
            $table->string('estructura', 30)->nullable();
            $table->string('adscripciones', 30)->nullable();

            $table->integer('cues_contratados')->nullable();
            $table->date('fecha_inicio_vigencia')->nullable();
            $table->date('fecha_fin_vigencia')->nullable();

            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
