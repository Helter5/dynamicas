<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $expectedApiKey = config('app.api_key');

        if (! is_string($expectedApiKey) || $expectedApiKey === '') {
            return response()->json([
                'message' => 'Service API key is not configured.',
            ], 503);
        }

        $providedApiKey = $request->header('X-API-KEY');

        if (! is_string($providedApiKey) || ! hash_equals($expectedApiKey, $providedApiKey)) {
            return response()->json([
                'message' => 'Invalid or missing API key.',
            ], 401);
        }

        return $next($request);
    }
}
