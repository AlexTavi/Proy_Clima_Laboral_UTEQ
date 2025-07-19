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
        Schema::create('tokens', function (Blueprint $table) {
            $table->id('id_token'); // Clave primaria

            $table->unsignedBigInteger('id_cuestionario');
            $table->foreign('id_cuestionario')->references('id_cuestionario')->on('cuestionarios')->onDelete('cascade');

            $table->unsignedBigInteger('id_empresa');
            $table->foreign('id_empresa')->references('id_empresa')->on('empresas')->onDelete('cascade');

            $table->string('token', 50);
            $table->boolean('usado')->default(false);
            $table->date('usado_en');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tokens');
    }
};
