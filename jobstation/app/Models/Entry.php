<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Entry extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'status_id',
        'project_title',
        'project_period',
        'project_working_hours',
        'project_workplace',
        'project_price',
        'project_skills',
        'project_summary',
        'project_head_count',
        'project_monthly_working_hours'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}