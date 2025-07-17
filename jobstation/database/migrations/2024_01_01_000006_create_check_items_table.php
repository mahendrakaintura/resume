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
        Schema::create('check_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('check_item_group_id')->constrained('check_item_groups')->onDelete('cascade');
            $table->string('name');
            $table->string('display_name');
            $table->integer('bit_number');
            $table->integer('display_rank')->default(0);
            $table->timestamps();

            // Ensure unique bit_number within each group
            $table->unique(['check_item_group_id', 'bit_number']);
        });

        // Insert some basic check items for each group
        $this->insertCheckItems();
    }

    private function insertCheckItems()
    {
        $checkItems = [
            // Business skills (group_id: 1)
            ['check_item_group_id' => 1, 'name' => 'project_management', 'display_name' => 'プロジェクト管理', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 1, 'name' => 'business_analysis', 'display_name' => 'ビジネス分析', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 1, 'name' => 'requirement_gathering', 'display_name' => '要件定義', 'bit_number' => 3, 'display_rank' => 3],

            // Work skills (group_id: 2)
            ['check_item_group_id' => 2, 'name' => 'team_leadership', 'display_name' => 'チームリーダーシップ', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 2, 'name' => 'communication', 'display_name' => 'コミュニケーション', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 2, 'name' => 'documentation', 'display_name' => 'ドキュメント作成', 'bit_number' => 3, 'display_rank' => 3],

            // Frontend (group_id: 3)
            ['check_item_group_id' => 3, 'name' => 'html', 'display_name' => 'HTML', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 3, 'name' => 'css', 'display_name' => 'CSS', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 3, 'name' => 'javascript', 'display_name' => 'JavaScript', 'bit_number' => 3, 'display_rank' => 3],
            ['check_item_group_id' => 3, 'name' => 'react', 'display_name' => 'React', 'bit_number' => 4, 'display_rank' => 4],
            ['check_item_group_id' => 3, 'name' => 'vue', 'display_name' => 'Vue.js', 'bit_number' => 5, 'display_rank' => 5],

            // Backend (group_id: 4)
            ['check_item_group_id' => 4, 'name' => 'php', 'display_name' => 'PHP', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 4, 'name' => 'java', 'display_name' => 'Java', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 4, 'name' => 'python', 'display_name' => 'Python', 'bit_number' => 3, 'display_rank' => 3],
            ['check_item_group_id' => 4, 'name' => 'nodejs', 'display_name' => 'Node.js', 'bit_number' => 4, 'display_rank' => 4],
            ['check_item_group_id' => 4, 'name' => 'csharp', 'display_name' => 'C#', 'bit_number' => 5, 'display_rank' => 5],

            // Framework (group_id: 5)
            ['check_item_group_id' => 5, 'name' => 'laravel', 'display_name' => 'Laravel', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 5, 'name' => 'spring', 'display_name' => 'Spring', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 5, 'name' => 'django', 'display_name' => 'Django', 'bit_number' => 3, 'display_rank' => 3],
            ['check_item_group_id' => 5, 'name' => 'express', 'display_name' => 'Express', 'bit_number' => 4, 'display_rank' => 4],

            // Server (group_id: 6)
            ['check_item_group_id' => 6, 'name' => 'apache', 'display_name' => 'Apache', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 6, 'name' => 'nginx', 'display_name' => 'Nginx', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 6, 'name' => 'iis', 'display_name' => 'IIS', 'bit_number' => 3, 'display_rank' => 3],

            // Middleware (group_id: 7)
            ['check_item_group_id' => 7, 'name' => 'redis', 'display_name' => 'Redis', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 7, 'name' => 'memcached', 'display_name' => 'Memcached', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 7, 'name' => 'rabbitmq', 'display_name' => 'RabbitMQ', 'bit_number' => 3, 'display_rank' => 3],

            // OS (group_id: 8)
            ['check_item_group_id' => 8, 'name' => 'windows', 'display_name' => 'Windows', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 8, 'name' => 'linux', 'display_name' => 'Linux', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 8, 'name' => 'macos', 'display_name' => 'macOS', 'bit_number' => 3, 'display_rank' => 3],
            ['check_item_group_id' => 8, 'name' => 'unix', 'display_name' => 'Unix', 'bit_number' => 4, 'display_rank' => 4],

            // Database (group_id: 9)
            ['check_item_group_id' => 9, 'name' => 'mysql', 'display_name' => 'MySQL', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 9, 'name' => 'postgresql', 'display_name' => 'PostgreSQL', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 9, 'name' => 'oracle', 'display_name' => 'Oracle', 'bit_number' => 3, 'display_rank' => 3],
            ['check_item_group_id' => 9, 'name' => 'mongodb', 'display_name' => 'MongoDB', 'bit_number' => 4, 'display_rank' => 4],

            // Environment (group_id: 10)
            ['check_item_group_id' => 10, 'name' => 'docker', 'display_name' => 'Docker', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 10, 'name' => 'kubernetes', 'display_name' => 'Kubernetes', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 10, 'name' => 'aws', 'display_name' => 'AWS', 'bit_number' => 3, 'display_rank' => 3],
            ['check_item_group_id' => 10, 'name' => 'azure', 'display_name' => 'Azure', 'bit_number' => 4, 'display_rank' => 4],

            // Tool (group_id: 11)
            ['check_item_group_id' => 11, 'name' => 'git', 'display_name' => 'Git', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 11, 'name' => 'jenkins', 'display_name' => 'Jenkins', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 11, 'name' => 'gitlab', 'display_name' => 'GitLab', 'bit_number' => 3, 'display_rank' => 3],

            // Others (group_id: 12)
            ['check_item_group_id' => 12, 'name' => 'api_design', 'display_name' => 'API設計', 'bit_number' => 1, 'display_rank' => 1],
            ['check_item_group_id' => 12, 'name' => 'security', 'display_name' => 'セキュリティ', 'bit_number' => 2, 'display_rank' => 2],
            ['check_item_group_id' => 12, 'name' => 'performance_tuning', 'display_name' => 'パフォーマンスチューニング', 'bit_number' => 3, 'display_rank' => 3],
        ];

        foreach ($checkItems as $item) {
            $item['created_at'] = now();
            $item['updated_at'] = now();
            DB::table('check_items')->insert($item);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('check_items');
    }
};
