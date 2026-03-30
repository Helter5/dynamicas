<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApiLog;
use App\Models\CasUserState;
use App\Services\CasEvaluatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class CasController extends Controller
{
    public function __construct(
        private readonly CasEvaluatorService $casEvaluatorService,
    ) {
    }

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

        // Check cooldown
        if ($state->last_eval_at !== null) {
            $cooldownSeconds = (int) config('cas.cooldown_seconds', 10);
            if ($cooldownSeconds > 0) {
                $lastEvalTime = $state->last_eval_at;
                $nextEvalTime = $lastEvalTime->addSeconds($cooldownSeconds);
                $now = now();

                if ($now->isBefore($nextEvalTime)) {
                    $secondsRemaining = (int) $nextEvalTime->diffInSeconds($now);
                    return response()->json([
                        'status' => 'error',
                        'message' => 'CAS evaluation is on cooldown.',
                        'cooldown' => [
                            'enabled' => true,
                            'total_seconds' => $cooldownSeconds,
                            'seconds_remaining' => $secondsRemaining,
                            'next_eval_at' => $nextEvalTime->toIso8601String(),
                        ],
                    ], 429);
                }
            }
        }

        $composedScript = $state->script === ''
            ? $command
            : $state->script."\n".$command;

        try {
            $result = $this->casEvaluatorService->evaluate($composedScript);
            $driver = (string) config('cas.driver', 'mock');

            $state->update([
                'script' => $composedScript,
                            'last_eval_at' => now(),
            ]);

            ApiLog::create([
                'anon_token' => $anonToken,
                'endpoint' => '/api/cas/eval',
                'command' => $command,
                'status' => 'success',
                'meta' => [
                    'source' => $validated['source'] ?? 'form',
                    'driver' => $driver,
                    'state_lines' => $composedScript === '' ? 0 : count(explode("\n", $composedScript)),
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
                    'driver' => (string) config('cas.driver', 'mock'),
                    'state_lines' => $state->script === '' ? 0 : count(explode("\n", $state->script)),
                ],
            ]);

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
        $token = $request->cookie('anon_token') ?: $request->header('X-ANON-TOKEN');

        if (is_string($token) && $token !== '') {
            return $token;
        }

        return hash('sha256', ($request->ip() ?? '0.0.0.0')."|".$request->userAgent());
    }
}
