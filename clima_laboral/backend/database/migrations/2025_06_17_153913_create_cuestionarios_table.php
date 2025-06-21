<?php

use Illuminate\Support\Facades\DB;
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
        Schema::create('cuestionarios', function (Blueprint $table) {
            $table->id('id_cuestionario'); // Clave primaria

            // Clave foránea que apunta a empresas.id_empresa
            $table->unsignedBigInteger('id_empresa');
            $table->foreign('id_empresa')->references('id_empresa')->on('empresas')->onDelete('cascade');

            $table->enum('tipo', ['Clima laboral', 'NOM 035'])->nullable();
            $table->date('fecha_creacion')->default(DB::raw('CURRENT_DATE'))->nullable();
            $table->jsonb('secciones', 12)->nullable();
            $table->string('logo_empresa', 255)->nullable();
            $table->boolean('aleatorio')->default(true)->nullable();

            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuestionarios');
    }
};
