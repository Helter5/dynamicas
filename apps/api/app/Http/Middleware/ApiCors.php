<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiCors
{
    public function handle(Request $request, Closure $next): Response
    {
        $allowedOrigins = array_filter(
            array_map('trim', explode(',', (string) env('ALLOWED_ORIGINS', 'http://localhost:5173'))),
            fn (string $o) => $o !== '',
        );

        $origin = (string) $request->headers->get('Origin', '');
        $allowOrigin = in_array($origin, $allowedOrigins, true)
            ? $origin
            : $allowedOrigins[0];

        $headers = [
            'Access-Control-Allow-Origin' => $allowOrigin,
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, X-API-KEY, X-ANON-TOKEN, Authorization, X-Requested-With',
            'Access-Control-Allow-Credentials' => 'true',
            'Access-Control-Max-Age' => '3600',
            'Vary' => 'Origin',
        ];

        if ($request->isMethod('OPTIONS')) {
            return response('', 204, $headers);
        }

        $response = $next($request);

        foreach ($headers as $name => $value) {
            $response->headers->set($name, $value);
        }

        return $response;
    }
}
