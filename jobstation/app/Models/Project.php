<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'title',
        'period',
        'working_hours',
        'workplace',
        'display_price',
        'skills',
        'summary',
        'head_count',
        'monthly_working_hours',
        'price',
        'start',
        'area',
        'remote',
        'business',
        'work',
        'frontend',
        'backend',
        'framework',
        'web_server',
        'middleware',
        'os',
        'database',
        'environment',
        'cloud',
        'infrastructure',
        'tool',
        'design',
        'others',
        'age_group',
        'is_only_japanese'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function entries(): HasMany
    {
        return $this->hasMany(Entry::class);
    }

    public function getIsFavoritedAttribute(): bool
    {
        if (!auth()->check()) {
            return false;
        }
        return $this->favoriteUsers()
            ->where('user_id', auth()->id())
            ->exists();
    }

    public function favoriteUsers(): HasMany
    {
        return $this->hasMany(UserFavoriteProject::class, 'project_id');
    }

    public function getRemoteWorkDisplayAttribute(): string
    {
        if ($this->remote) {
            $remoteOptions = config('constants.basic_info.desired_remote');

            // Find which bit is set (remote is a bitmask)
            for ($i = 1; $i <= 3; $i++) {
                if ($this->remote & (1 << ($i - 1))) {
                    return $remoteOptions[$i] ?? '相談';
                }
            }
        }
        return '相談'; // Default fallback
    }

    public function getHasEntryAttribute(): bool
    {
        if (!auth()->check()) {
            return false;
        }
        return $this->entries()
            ->where('user_id', auth()->id())
            ->where('status_id', 1) // Only consider active entries
            ->exists();
    }
}
