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
        Schema::create('entry_status', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('display_name');
        });

        // Insert default entry statuses
        DB::table('entry_status')->insert([
            ['id' => 1, 'name' => 'pending', 'display_name' => '選考中'],
            ['id' => 2, 'name' => 'accepted', 'display_name' => '合格'],
            ['id' => 3, 'name' => 'rejected', 'display_name' => '不合格'],
            ['id' => 4, 'name' => 'cancelled', 'display_name' => 'キャンセル'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entry_status');
    }
};
