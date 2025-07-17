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
        Schema::create('user_work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('branch_id');
            $table->integer('display_order');

            // Basic work experience info
            $table->integer('period')->default(0);
            $table->string('business', 15)->nullable();
            $table->integer('pj_scale_id')->default(1);
            $table->integer('team_size')->default(0);
            $table->string('position', 15)->nullable();

            // Work process flags
            $table->boolean('analysis')->default(false);
            $table->boolean('requirement_definition')->default(false);
            $table->boolean('basic_design')->default(false);
            $table->boolean('detail_design')->default(false);
            $table->boolean('programing')->default(false);
            $table->boolean('unit_test')->default(false);
            $table->boolean('integration_test')->default(false);
            $table->boolean('monitoring')->default(false);
            $table->boolean('maintenance')->default(false);
            $table->boolean('server_design')->default(false);
            $table->boolean('server_construction')->default(false);
            $table->boolean('network_design')->default(false);
            $table->boolean('network_construction')->default(false);

            // Description
            $table->text('description')->nullable();

            // Technical skills
            $table->string('language')->nullable();
            $table->string('os')->nullable();
            $table->string('db')->nullable();
            $table->string('fw')->nullable();
            $table->string('mw')->nullable();
            $table->string('server')->nullable();
            $table->string('environment')->nullable();
            $table->string('tool')->nullable();
            $table->string('network')->nullable();
            $table->string('others')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_work_experiences');
    }
};
