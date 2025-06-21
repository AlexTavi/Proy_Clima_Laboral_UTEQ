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
        Schema::create('reactivos', function (Blueprint $table) {
            $table->id('id_reactivo'); // Clave primaria

            // Clave foránea que apunta a empresas.id_empresa
            $table->unsignedBigInteger('id_dimension');
            $table->foreign('id_dimension')->references('id_dimension')->on('dimensions')->onDelete('cascade');

            $table->text('pregunta');
            $table->enum('tipo', ['abierta', 'cerrada'])->default('cerrada');

            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reactivos');
    }
};
