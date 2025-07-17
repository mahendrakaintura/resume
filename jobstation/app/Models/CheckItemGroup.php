<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckItemGroup extends Model
{
    protected $fillable = [
        'name',
        'is_enabled_display_rank'
    ];

    protected $casts = [
        'is_enabled_display_rank' => 'boolean'
    ];

    public function checkItems()
    {
        return $this->hasMany(CheckItem::class, 'check_item_group_id', 'id');
    }
}
