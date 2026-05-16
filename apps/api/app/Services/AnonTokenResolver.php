<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AnonTokenResolver
{
    public function resolve(Request $request): string
    {
        $token = $request->cookie('anon_token') ?: $request->header('X-ANON-TOKEN');

        if (is_string($token) && $token !== '') {
            return $token;
        }

        return (string) Str::uuid();
    }
}
