<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiLog extends Model
{
    protected $fillable = [
        'anon_token',
        'endpoint',
        'command',
        'status',
        'error_message',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];
}
