<?php

namespace App\Http\Controllers\Api;

use App\Models\ApiLog;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class CasController extends Controller
{
    public function eval(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'command' => ['required', 'string', 'max:5000'],
            'source' => ['nullable', 'string', 'max:100'],
        ]);

        $command = trim($validated['command']);
        $anonToken = $request->cookie('anon_token') ?: $request->header('X-ANON-TOKEN');

        try {
            $result = [
                'mock' => true,
                'output' => "mock-result: {$command}",
            ];

            ApiLog::create([
                'anon_token' => $anonToken,
                'endpoint' => '/api/cas/eval',
                'command' => $command,
                'status' => 'success',
                'meta' => [
                    'source' => $validated['source'] ?? 'form',
                ],
            ]);

            return response()->json([
                'status' => 'success',
                'result' => $result,
            ]);
        } catch (Throwable $exception) {
            ApiLog::create([
                'anon_token' => $anonToken,
                'endpoint' => '/api/cas/eval',
                'command' => $command,
                'status' => 'error',
                'error_message' => $exception->getMessage(),
                'meta' => [
                    'source' => $validated['source'] ?? 'form',
                ],
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'CAS command execution failed.',
            ], 500);
        }
    }
}
