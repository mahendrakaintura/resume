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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->integer('type')->default(1);
            $table->string('name')->nullable();

            // Basic Info
            $table->string('initial', 5)->nullable();
            $table->integer('age')->nullable();
            $table->enum('sex', ['man', 'woman'])->nullable();
            $table->integer('years_of_experience')->nullable();
            $table->string('address', 40)->nullable();
            $table->string('education', 40)->nullable();
            $table->string('train_line', 10)->nullable();
            $table->string('station', 15)->nullable();
            $table->boolean('is_japanese')->nullable();
            $table->string('nationality', 40)->nullable();
            $table->json('qualifications')->nullable();

            // Skills
            $table->json('skill_score')->nullable();

            // Preferences
            $table->integer('desired_price')->nullable();
            $table->integer('desired_start')->nullable();
            $table->integer('desired_area')->nullable();
            $table->integer('desired_remote')->nullable();

            // Skill bits
            $table->integer('skill_business')->nullable();
            $table->integer('skill_work')->nullable();
            $table->integer('skill_frontend')->nullable();
            $table->integer('skill_backend')->nullable();
            $table->integer('skill_framework')->nullable();
            $table->integer('skill_server')->nullable();
            $table->integer('skill_middleware')->nullable();
            $table->integer('skill_os')->nullable();
            $table->integer('skill_database')->nullable();
            $table->integer('skill_environment')->nullable();
            $table->integer('skill_tool')->nullable();
            $table->integer('skill_others')->nullable();

            // Personality
            $table->json('personality')->nullable();
            $table->integer('age_group')->nullable();

            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
