<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Mail;
use App\Mail\UnregisterNotification;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'email',
        'password',
        'type',

        'name',

        'initial',
        'age',
        'sex',
        'years_of_experience',
        'address',
        'education',
        'train_line',
        'station',
        'is_japanese',
        'nationality',
        'qualifications',

        'skill_score',

        'desired_price',
        'desired_start',
        'desired_area',
        'desired_remote',

        'skill_business',
        'skill_work',
        'skill_frontend',
        'skill_backend',
        'skill_framework',
        'skill_server',
        'skill_middleware',
        'skill_os',
        'skill_database',
        'skill_environment',
        'skill_tool',
        'skill_others',

        'personality',
        'age_group'
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'qualifications' => 'array',
            'skill_score' => 'object',
            'personality' => 'object',
            'self_analysis' => 'object',
        ];
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function workExperiences()
    {
        return $this->hasMany(UserWorkExperience::class);
    }

    public function getHasSkillSheetAttribute(): bool
    {
        return !empty($this->name) && $this->workExperiences()->exists();
    }

    public function entries()
    {
        return $this->hasMany(Entry::class);
    }

    public function offers()
    {
        return $this->hasMany(Offer::class);
    }

    public function favoriteProjects()
    {
        return $this->hasManyThrough(Project::class, UserFavoriteProject::class, 'user_id', 'id', 'id', 'project_id')
            ->withCount([
                'entries as has_entry' => function ($query) {
                    $query->where('user_id', $this->id);
                }
            ]);
    }

    protected static function booted()
    {
        static::deleted(function ($user) {
            Mail::to($user->email)->send(new UnregisterNotification($user));
        });
    }
}
