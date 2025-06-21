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
        Schema::create('cuestionario_reactivos', function (Blueprint $table) {
            $table->id('id_cr'); // Clave primaria

            // Clave foránea que apunta a empresas.id_empresa
            $table->unsignedBigInteger('id_cuestionario');
            $table->foreign('id_cuestionario')->references('id_cuestionario')->on('cuestionarios')->onDelete('cascade');

            // Clave foránea que apunta a empresas.id_empresa
            $table->unsignedBigInteger('id_reactivo');
            $table->foreign('id_reactivo')->references('id_reactivo')->on('reactivos')->onDelete('cascade');

            // Clave foránea que apunta a empresas.id_empresa
            $table->unsignedBigInteger('id_escala');
            $table->foreign('id_escala')->references('id_escala')->on('escalas')->onDelete('cascade');

            $table->integer('orden')->nullable();

            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuestionario_reactivos');
    }
};
