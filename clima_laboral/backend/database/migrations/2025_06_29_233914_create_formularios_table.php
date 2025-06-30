<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('formularios', function (Blueprint $table) {
        $table->id();
        $table->string('nombreEmpresa');
        $table->string('giro');
        $table->json('estructura');
        $table->json('adscripciones');
        $table->string('empleados');
        $table->string('domicilio');
        $table->string('telefono');
        $table->string('responsable');
        $table->json('additionalQuestions');
        $table->json('answers');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formularios');
    }
};
