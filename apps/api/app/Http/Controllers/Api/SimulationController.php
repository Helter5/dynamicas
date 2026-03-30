<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SimulationController extends Controller
{
    public function invertedPendulum(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'duration' => ['nullable', 'numeric', 'min:0.5', 'max:60'],
            'dt' => ['nullable', 'numeric', 'min:0.001', 'max:0.2'],
            'initial_theta' => ['nullable', 'numeric', 'min:-1.57', 'max:1.57'],
            'initial_omega' => ['nullable', 'numeric', 'min:-20', 'max:20'],
            'initial_x' => ['nullable', 'numeric', 'min:-10', 'max:10'],
            'initial_v' => ['nullable', 'numeric', 'min:-20', 'max:20'],
            'force' => ['nullable', 'numeric', 'min:-100', 'max:100'],
            'cart_mass' => ['nullable', 'numeric', 'min:0.1', 'max:20'],
            'pendulum_mass' => ['nullable', 'numeric', 'min:0.05', 'max:10'],
            'pendulum_length' => ['nullable', 'numeric', 'min:0.1', 'max:5'],
            'gravity' => ['nullable', 'numeric', 'min:1', 'max:20'],
            'cart_damping' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'pendulum_damping' => ['nullable', 'numeric', 'min:0', 'max:5'],
        ]);

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
