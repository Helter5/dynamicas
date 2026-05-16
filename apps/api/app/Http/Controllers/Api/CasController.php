<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CasUserState;
use App\Services\AnonTokenResolver;
use App\Services\ApiRequestLogger;
use App\Services\CasEvaluatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class CasController extends Controller
{
    public function __construct(
        private readonly CasEvaluatorService $casEvaluatorService,
        private readonly ApiRequestLogger $apiRequestLogger,
        private readonly AnonTokenResolver $anonTokenResolver,
    ) {}

    public function eval(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'command' => ['required', 'string', 'max:5000'],
            'source' => ['nullable', 'string', 'max:100'],
        ]);

        $command = trim($validated['command']);
        $anonToken = $this->resolveAnonToken($request);

        $state = CasUserState::firstOrCreate(
            ['anon_token' => $anonToken],
            ['script' => ''],
        );

        if ($state->last_eval_at !== null) {
            $cooldownSeconds = (int) config('cas.cooldown_seconds', 10);

            if ($cooldownSeconds > 0) {
                $nextEvalTime = $state->last_eval_at->copy()->addSeconds($cooldownSeconds);
                $now = now();

                if ($now->isBefore($nextEvalTime)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'CAS evaluation is on cooldown.',
                        'cooldown' => [
                            'enabled' => true,
                            'total_seconds' => $cooldownSeconds,
                            'seconds_remaining' => (int) ceil($now->diffInSeconds($nextEvalTime)),
                            'next_eval_at' => $nextEvalTime->toIso8601String(),
                        ],
                    ], 429);
                }
            }
        }

        $composedScript = $state->script === ''
            ? $command
            : $state->script."\n".$command;

        $maxBytes = (int) config('cas.max_script_bytes', 50000);
        if (strlen($composedScript) > $maxBytes) {
            return response()->json([
                'status' => 'error',
                'message' => 'CAS session script limit reached. Reset state to continue.',
            ], 422);
        }

        try {
            $result = $this->casEvaluatorService->evaluate($composedScript);
            $driver = (string) config('cas.driver', 'mock');

            $state->update([
                'script' => $composedScript,
                'last_eval_at' => now(),
            ]);

            $this->apiRequestLogger->log(
                anonToken: $anonToken,
                endpoint: '/api/cas/eval',
                command: $command,
                status: 'success',
                meta: [
                    'source' => $validated['source'] ?? 'form',
                    'driver' => $driver,
                    'state_lines' => $composedScript === '' ? 0 : count(explode("\n", $composedScript)),
                ],
            );

            return response()->json([
                'status' => 'success',
                'result' => $result,
            ]);
        } catch (Throwable $exception) {
            $this->apiRequestLogger->log(
                anonToken: $anonToken,
                endpoint: '/api/cas/eval',
                command: $command,
                status: 'error',
                errorMessage: $exception->getMessage(),
                meta: [
                    'source' => $validated['source'] ?? 'form',
                    'driver' => (string) config('cas.driver', 'mock'),
                    'state_lines' => $state->script === '' ? 0 : count(explode("\n", $state->script)),
                ],
            );

            return response()->json([
                'status' => 'error',
                'message' => 'CAS command execution failed.',
            ], 500);
        }
    }

    public function resetState(Request $request): JsonResponse
    {
        $anonToken = $this->resolveAnonToken($request);

        CasUserState::query()
            ->where('anon_token', $anonToken)
            ->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'CAS state reset completed.',
        ]);
    }

    private function resolveAnonToken(Request $request): string
    {
        return $this->anonTokenResolver->resolve($request);
    }
}
