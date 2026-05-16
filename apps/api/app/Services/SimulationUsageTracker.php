<?php

namespace App\Services;

use App\Models\SimulationUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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
            $city = $this->firstHeader($request, ['CF-IPCity', 'X-Geo-City', 'X-Appengine-City']);
            $country = $this->firstHeader($request, ['CF-IPCountry', 'X-Geo-Country', 'X-Appengine-Country']);

            if ($city === null && $country === null) {
                [$city, $country] = $this->geoLookup($request->ip());
            }

            SimulationUsage::create([
                'simulation' => $simulation,
                'anon_token' => $anonToken,
                'ip_address' => $request->ip(),
                'city' => $city,
                'country' => $country,
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

    /**
     * @return array{0: string|null, 1: string|null}
     */
    private function geoLookup(string $ip): array
    {
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return [null, null];
        }

        try {
            $response = Http::timeout(2)->get("http://ip-api.com/json/{$ip}", [
                'fields' => 'status,city,country',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (($data['status'] ?? '') === 'success') {
                    return [$data['city'] ?? null, $data['country'] ?? null];
                }
            }
        } catch (\Throwable) {
            // geolocation is non-critical
        }

        return [null, null];
    }
}
