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
        Schema::create('entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->integer('status_id')->default(1);
            $table->string('project_title');
            $table->string('project_period')->nullable();
            $table->string('project_working_hours')->nullable();
            $table->string('project_workplace')->nullable();
            $table->string('project_price')->nullable();
            $table->text('project_skills')->nullable();
            $table->text('project_summary')->nullable();
            $table->string('project_head_count')->nullable();
            $table->string('project_monthly_working_hours')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entries');
    }
};
