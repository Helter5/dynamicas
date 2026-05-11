<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SimulationUsage extends Model
{
    protected $fillable = [
        'simulation',
        'anon_token',
        'ip_address',
        'city',
        'country',
        'used_at',
    ];

    protected $casts = [
        'used_at' => 'datetime',
    ];
}
