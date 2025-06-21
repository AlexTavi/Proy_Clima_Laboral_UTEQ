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
        Schema::create('participantes', function (Blueprint $table) {
            $table->id('id_participante'); // Clave primaria

            // Clave foránea que apunta a empresas.id_empresa
            $table->unsignedBigInteger('id_empresa');
            $table->foreign('id_empresa')->references('id_empresa')->on('empresas')->onDelete('cascade');

            // Clave foránea que apunta a cuestionarios.id_cuestionario
            $table->unsignedBigInteger('id_cuestionario');
            $table->foreign('id_cuestionario')->references('id_cuestionario')->on('cuestionarios')->onDelete('cascade');

            $table->string('token_acceso', 36)->unique();
            $table->string('adscripcion', 60)->nullable();
            $table->string('area', 60)->nullable();
            $table->string('puesto', 60)->nullable();
            $table->string('reporta_a', 60)->unique();
            $table->string('antiguedad', 30);
            $table->string('tipo_contrato', 30)->nullable();
            $table->string('escolaridad', 30)->default(false);
            $table->boolean('discapacidad')->nullable();
            $table->string('tipo_discapacidad', 50)->nullable();
            $table->string('sector_poblacional', 60)->nullable();
            $table->date('fecha_asignacion')->default(DB::raw('CURRENT_DATE'))->nullable();
            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participantes');
    }
};
