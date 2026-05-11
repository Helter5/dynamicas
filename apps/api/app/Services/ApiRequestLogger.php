<?php

namespace App\Services;

use App\Models\ApiLog;

class ApiRequestLogger
{
    /**
     * @param  array<string, mixed>  $meta
     */
    public function log(
        ?string $anonToken,
        string $endpoint,
        string $command,
        string $status,
        ?string $errorMessage = null,
        array $meta = [],
    ): void {
        ApiLog::create([
            'anon_token' => $anonToken,
            'endpoint' => $endpoint,
            'command' => $command,
            'status' => $status,
            'error_message' => $errorMessage,
            'meta' => $meta,
        ]);
    }
}
