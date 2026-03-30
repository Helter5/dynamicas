<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvertedPendulumRequest;
use Illuminate\Http\JsonResponse;

class SimulationController extends Controller
{
    public function invertedPendulum(InvertedPendulumRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $duration = (float) ($validated['duration'] ?? 10.0);
        $dt = (float) ($validated['dt'] ?? 0.02);
        $steps = (int) floor($duration / $dt);

        $x = (float) ($validated['initial_x'] ?? 0.0);
        $v = (float) ($validated['initial_v'] ?? 0.0);
        $theta = (float) ($validated['initial_theta'] ?? 0.15);
        $omega = (float) ($validated['initial_omega'] ?? 0.0);

        $force = (float) ($validated['force'] ?? 0.0);
        $mCart = (float) ($validated['cart_mass'] ?? 1.0);
        $mPend = (float) ($validated['pendulum_mass'] ?? 0.2);
        $length = (float) ($validated['pendulum_length'] ?? 0.5);
        $gravity = (float) ($validated['gravity'] ?? 9.81);
        $cartDamping = (float) ($validated['cart_damping'] ?? 0.05);
        $pendulumDamping = (float) ($validated['pendulum_damping'] ?? 0.02);

        $points = [];

        for ($i = 0; $i <= $steps; $i++) {
            $t = $i * $dt;

            $points[] = [
                't' => round($t, 5),
                'x' => $x,
                'v' => $v,
                'theta' => $theta,
                'omega' => $omega,
            ];

            if ($i === $steps) {
                break;
            }

            $sinTheta = sin($theta);
            $cosTheta = cos($theta);
            $denominator = $mCart + $mPend * (1 - ($cosTheta ** 2));
            if (abs($denominator) < 1e-6) {
                $denominator = 1e-6;
            }

            $xAcc = (
                $force
                - $cartDamping * $v
                + $mPend * $sinTheta * ($length * ($omega ** 2) + $gravity * $cosTheta)
            ) / $denominator;

            $thetaAcc = (
                -$force * $cosTheta
                - $mPend * $length * ($omega ** 2) * $sinTheta * $cosTheta
                - ($mCart + $mPend) * $gravity * $sinTheta
                - $pendulumDamping * $omega
            ) / ($length * $denominator);

            $v += $xAcc * $dt;
            $x += $v * $dt;
            $omega += $thetaAcc * $dt;
            $theta += $omega * $dt;
        }

        return response()->json([
            'status' => 'success',
            'simulation' => 'inverted_pendulum',
            'config' => [
                'duration' => $duration,
                'dt' => $dt,
                'steps' => $steps,
            ],
            'series' => $points,
        ]);
    }
}
