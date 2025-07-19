<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // ✅ Usar SQL directo para casteo
        DB::statement('ALTER TABLE empresas ALTER COLUMN estructura TYPE json USING estructura::json');
        DB::statement('ALTER TABLE empresas ALTER COLUMN adscripciones TYPE json USING adscripciones::json');

        Schema::table('empresas', function (Blueprint $table) {
            $table->string('num_empleados', 255)->change();

            if (!Schema::hasColumn('empresas', 'telefono')) {
                $table->string('telefono', 20)->nullable();
            }
            if (!Schema::hasColumn('empresas', 'responsable')) {
                $table->string('responsable', 255)->nullable();
            }
            if (!Schema::hasColumn('empresas', 'additionalQuestions')) {
                $table->json('additionalQuestions')->nullable();
            }
            if (!Schema::hasColumn('empresas', 'answers')) {
                $table->json('answers')->nullable();
            }
        });
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE empresas ALTER COLUMN estructura TYPE character varying(30)');
        DB::statement('ALTER TABLE empresas ALTER COLUMN adscripciones TYPE character varying(30)');

        Schema::table('empresas', function (Blueprint $table) {
            $table->string('num_empleados', 20)->change();
            $table->dropColumn(['telefono', 'responsable', 'additionalQuestions', 'answers']);
        });
    }
};
