<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('formularios');
    }

    public function down(): void
    {
        Schema::create('formularios', function (Blueprint $table) {
            $table->id();
            $table->string('nombreEmpresa', 255);
            $table->string('giro', 255);
            $table->json('estructura');
            $table->json('adscripciones');
            $table->string('empleados', 255);
            $table->string('domicilio', 255);
            $table->string('telefono', 20);
            $table->string('responsable', 255);
            $table->json('additionalQuestions');
            $table->json('answers');
            $table->timestamps();
        });
    }
};
