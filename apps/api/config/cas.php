<?php

return [
    'driver' => env('CAS_DRIVER', 'mock'),

    'octave' => [
        'binary' => env('CAS_OCTAVE_BINARY', 'octave-cli'),
        'timeout_seconds' => (int) env('CAS_TIMEOUT_SECONDS', 8),
    ],
];
