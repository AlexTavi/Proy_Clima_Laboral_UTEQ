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
        Schema::create('respuestas', function (Blueprint $table) {
            $table->id('id_respuesta'); // Clave primaria

            // Clave foránea que apunta a participantes.id_participante
            $table->unsignedBigInteger('id_participante');
            $table->foreign('id_participante')->references('id_participante')->on('participantes')->onDelete('cascade');

            // Clave foránea que apunta a empresas.id_empresa
            $table->unsignedBigInteger('id_reactivo');
            $table->foreign('id_reactivo')->references('id_reactivo')->on('reactivos')->onDelete('cascade');

            $table->text('respuesta')->nullable();

            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respuestas');
    }
};
