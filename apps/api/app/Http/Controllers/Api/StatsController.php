<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SimulationUsage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function summary(): JsonResponse
    {
        $rows = SimulationUsage::query()
            ->select('simulation', DB::raw('count(*) as total'))
            ->groupBy('simulation')
            ->orderBy('simulation')
            ->get()
            ->map(fn (SimulationUsage $usage) => [
                'simulation' => $usage->simulation,
                'total' => (int) $usage->total,
            ]);

        return response()->json([
            'status' => 'success',
            'interval_seconds' => (int) config('cas.simulation_stats_interval_seconds', 600),
            'items' => $rows,
        ]);
    }

    public function details(string $simulation): JsonResponse
    {
        $details = SimulationUsage::query()
            ->where('simulation', $simulation)
            ->latest('used_at')
            ->limit(200)
            ->get()
            ->map(fn (SimulationUsage $usage) => [
                'simulation' => $usage->simulation,
                'anon_token' => substr($usage->anon_token, 0, 12),
                'city' => $usage->city,
                'country' => $usage->country,
                'used_at' => $usage->used_at?->toIso8601String(),
            ]);

        return response()->json([
            'status' => 'success',
            'simulation' => $simulation,
            'items' => $details,
        ]);
    }
}
