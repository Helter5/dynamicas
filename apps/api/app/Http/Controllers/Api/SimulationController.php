<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BallAndBeamRequest;
use App\Http\Requests\InvertedPendulumRequest;
use App\Services\ApiRequestLogger;
use App\Services\SimulationUsageTracker;
use App\Services\StateSpaceSimulationService;
use Illuminate\Http\JsonResponse;

class SimulationController extends Controller
{
    public function __construct(
        private readonly StateSpaceSimulationService $simulations,
        private readonly SimulationUsageTracker $usageTracker,
        private readonly ApiRequestLogger $apiRequestLogger,
    ) {}

    public function invertedPendulum(InvertedPendulumRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $duration = (float) ($validated['duration'] ?? 5.0);
        $dt = (float) ($validated['dt'] ?? 0.01);
        $steps = (int) floor($duration / $dt);
        $reference = (float) ($validated['reference'] ?? 0.2);

        $series = $this->simulations->simulateClosedLoop(
            a: [
                [0.0, 1.0, 0.0, 0.0],
                [0.0, -0.18181818181818182, 2.6727272727272737, 0.0],
                [0.0, 0.0, 0.0, 1.0],
                [0.0, -0.45454545454545453, 31.181818181818183, 0.0],
            ],
            b: [0.0, 1.8181818181818181, 0.0, 4.545454545454545],
            k: [-1.0, -1.6567, 18.6854, 3.4594],
            n: -1.0,
            reference: $reference,
            initialState: [
                (float) ($validated['initial_x'] ?? 0.0),
                (float) ($validated['initial_v'] ?? 0.0),
                (float) ($validated['initial_theta'] ?? 0.0),
                (float) ($validated['initial_omega'] ?? 0.0),
            ],
            stateKeys: ['x', 'v', 'theta', 'omega'],
            duration: $duration,
            dt: $dt,
        );

        $anonToken = $this->usageTracker->record($request, 'inverted_pendulum');
        $this->logSimulationRequest($anonToken, '/api/simulations/inverted-pendulum', $validated);

        return response()->json([
            'status' => 'success',
            'simulation' => 'inverted_pendulum',
            'config' => [
                'duration' => $duration,
                'dt' => $dt,
                'steps' => $steps,
                'reference' => $reference,
            ],
            'series' => $series,
        ])->cookie('anon_token', $anonToken, 60 * 24 * 365, null, null, false, false, false, 'Lax');
    }

    public function ballAndBeam(BallAndBeamRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $duration = (float) ($validated['duration'] ?? 5.0);
        $dt = (float) ($validated['dt'] ?? 0.01);
        $steps = (int) floor($duration / $dt);
        $reference = (float) ($validated['reference'] ?? 0.25);

        $series = $this->simulations->simulateClosedLoop(
            a: [
                [0.0, 1.0, 0.0, 0.0],
                [0.0, 0.0, 7.0, 0.0],
                [0.0, 0.0, 0.0, 1.0],
                [0.0, 0.0, 0.0, 0.0],
            ],
            b: [0.0, 0.0, 0.0, 1.0],
            k: [1828.5714285714282, 1028.5714285714282, 2008.0, 104.0],
            n: 1828.5714285714282,
            reference: $reference,
            initialState: [
                (float) ($validated['initial_r'] ?? 0.0),
                (float) ($validated['initial_r_dot'] ?? 0.0),
                (float) ($validated['initial_alpha'] ?? 0.0),
                (float) ($validated['initial_alpha_dot'] ?? 0.0),
            ],
            stateKeys: ['r', 'r_dot', 'alpha', 'alpha_dot'],
            duration: $duration,
            dt: $dt,
        );

        $anonToken = $this->usageTracker->record($request, 'ball_and_beam');
        $this->logSimulationRequest($anonToken, '/api/simulations/ball-and-beam', $validated);

        return response()->json([
            'status' => 'success',
            'simulation' => 'ball_and_beam',
            'config' => [
                'duration' => $duration,
                'dt' => $dt,
                'steps' => $steps,
                'reference' => $reference,
            ],
            'series' => $series,
        ])->cookie('anon_token', $anonToken, 60 * 24 * 365, null, null, false, false, false, 'Lax');
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function logSimulationRequest(string $anonToken, string $endpoint, array $payload): void
    {
        $this->apiRequestLogger->log(
            anonToken: $anonToken,
            endpoint: $endpoint,
            command: json_encode($payload, JSON_THROW_ON_ERROR),
            status: 'success',
            meta: [
                'source' => 'animation',
            ],
        );
    }
}
