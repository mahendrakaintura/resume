<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserWorkExperience extends Model
{
    protected $table = 'user_work_experiences';

    protected $fillable = [
        'user_id',
        'branch_id',
        'display_order',

        'period',
        'business',
        'pj_scale_id',
        'team_size',
        'position',

        'analysis',
        'requirement_definition',
        'basic_design',
        'detail_design',
        'programing',
        'unit_test',
        'integration_test',
        'monitoring',
        'maintenance',
        'server_design',
        'server_construction',
        'network_design',
        'network_construction',

        'description',
        'language',
        'os',
        'db',
        'fw',
        'mw',
        'server',
        'environment',
        'tool',
        'network',
        'others',
    ];

    protected $casts = [
        'analysis' => 'boolean',
        'requirement_definition' => 'boolean',
        'basic_design' => 'boolean',
        'detail_design' => 'boolean',
        'programing' => 'boolean',
        'unit_test' => 'boolean',
        'integration_test' => 'boolean',
        'monitoring' => 'boolean',
        'maintenance' => 'boolean',
        'server_design' => 'boolean',
        'server_construction' => 'boolean',
        'network_design' => 'boolean',
        'network_construction' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
