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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('summary');
            $table->string('period')->nullable();
            $table->string('working_hours')->nullable();
            $table->string('workplace')->nullable();
            $table->string('price')->nullable();
            $table->string('display_price')->nullable();
            $table->text('skills')->nullable();
            $table->string('head_count')->nullable();
            $table->string('monthly_working_hours')->nullable();

            // Bit fields for filtering
            $table->bigInteger('start')->nullable();
            $table->bigInteger('area')->nullable();
            $table->bigInteger('remote')->nullable();
            $table->bigInteger('frontend')->nullable();
            $table->bigInteger('backend')->nullable();
            $table->bigInteger('framework')->nullable();

            $table->boolean('is_only_japanese')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
