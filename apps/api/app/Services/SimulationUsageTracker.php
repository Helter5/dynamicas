<?php

namespace App\Services;

use App\Models\SimulationUsage;
use Illuminate\Http\Request;

class SimulationUsageTracker
{
    public function __construct(
        private readonly AnonTokenResolver $anonTokenResolver,
    ) {}

    public function record(Request $request, string $simulation): string
    {
        $anonToken = $this->anonTokenResolver->resolve($request);
        $intervalSeconds = (int) config('cas.simulation_stats_interval_seconds', 600);
        $latestUse = SimulationUsage::query()
            ->where('simulation', $simulation)
            ->where('anon_token', $anonToken)
            ->latest('used_at')
            ->first();

        if ($latestUse === null || $latestUse->used_at?->copy()->addSeconds($intervalSeconds)->isPast()) {
            SimulationUsage::create([
                'simulation' => $simulation,
                'anon_token' => $anonToken,
                'ip_address' => $request->ip(),
                'city' => $this->firstHeader($request, ['CF-IPCity', 'X-Geo-City', 'X-Appengine-City']),
                'country' => $this->firstHeader($request, ['CF-IPCountry', 'X-Geo-Country', 'X-Appengine-Country']),
                'used_at' => now(),
            ]);
        }

        return $anonToken;
    }

    /**
     * @param  list<string>  $headers
     */
    private function firstHeader(Request $request, array $headers): ?string
    {
        foreach ($headers as $header) {
            $value = $request->headers->get($header);
            if (is_string($value) && $value !== '') {
                return $value;
            }
        }

        return null;
    }
}
