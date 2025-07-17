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
        Schema::create('check_item_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_enabled_display_rank')->default(false);
            $table->timestamps();
        });

        // Insert default skill groups
        DB::table('check_item_groups')->insert([
            ['name' => 'business', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'work', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'frontend', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'backend', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'framework', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'server', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'middleware', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'os', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'database', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'environment', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'tool', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'others', 'is_enabled_display_rank' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('check_item_groups');
    }
};
