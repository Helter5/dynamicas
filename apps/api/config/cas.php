<?php

return [
    'driver' => env('CAS_DRIVER', 'mock'),

    'octave' => [
        'binary' => env('CAS_OCTAVE_BINARY', 'octave-cli'),
        'timeout_seconds' => (int) env('CAS_TIMEOUT_SECONDS', 8),
    ],

    'cooldown_seconds' => (int) env('CAS_COOLDOWN_SECONDS', 10),

    'simulation_stats_interval_seconds' => (int) env('SIMULATION_STATS_INTERVAL_SECONDS', 600),

    'simulation_delay_ms' => (int) env('SIMULATION_DELAY_MS', 0),
];
