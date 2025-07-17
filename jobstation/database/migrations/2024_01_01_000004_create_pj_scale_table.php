<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pj_scale', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // Insert default data
        DB::table('pj_scale')->insert([
            ['id' => 1, 'name' => 'small', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'medium', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'large', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'extra_large', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'huge', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'name' => 'mega', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pj_scale');
    }
};
