<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BallAndBeamRequest;
use App\Http\Requests\InvertedPendulumRequest;
use App\Services\StateSpaceSimulationService;
use Illuminate\Http\JsonResponse;

class SimulationController extends Controller
{
    public function __construct(
        private readonly StateSpaceSimulationService $simulations,
    ) {}

    public function invertedPendulum(InvertedPendulumRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $duration = (float) ($validated['duration'] ?? 5.0);
        $dt = (float) ($validated['dt'] ?? 0.01);
        $steps = (int) floor($duration / $dt);
        $reference = (float) ($validated['reference'] ?? 0.2);

        // Constants mirror cas/models/kyvadlo.txt: CTMS state-space model with LQR feedback.
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
        ]);
    }

    public function ballAndBeam(BallAndBeamRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $duration = (float) ($validated['duration'] ?? 5.0);
        $dt = (float) ($validated['dt'] ?? 0.01);
        $steps = (int) floor($duration / $dt);
        $reference = (float) ($validated['reference'] ?? 0.25);

        // Constants mirror cas/models/gulicka.txt: CTMS state-space model with pole placement feedback.
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
        ]);
    }
}
