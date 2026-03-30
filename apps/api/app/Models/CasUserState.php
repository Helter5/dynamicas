<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CasUserState extends Model
{
    protected $fillable = [
        'anon_token',
        'script',
        'last_eval_at',
    ];

    protected $casts = [
        'last_eval_at' => 'datetime',
    ];
}
