<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckItem extends Model
{
    // Use composite key approach since this table uses multiple columns as key
    protected $primaryKey = ['check_item_group_id', 'bit_number'];
    public $incrementing = false;
    protected $keyType = 'array';

    protected $fillable = [
        'check_item_group_id',
        'name',
        'display_name',
        'bit_number',
        'display_rank'
    ];

    protected $casts = [
        'check_item_group_id' => 'integer',
        'bit_number' => 'integer',
        'display_rank' => 'integer'
    ];
}
