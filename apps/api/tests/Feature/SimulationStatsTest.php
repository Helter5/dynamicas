<?php

namespace Tests\Feature;

use App\Models\SimulationUsage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SimulationStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_simulation_stats_summary_and_details_are_returned(): void
    {
        config(['app.api_key' => 'test-api-key']);

        SimulationUsage::create([
            'simulation' => 'inverted_pendulum',
            'anon_token' => 'anon-stats-1',
            'ip_address' => '127.0.0.1',
            'city' => 'Bratislava',
            'country' => 'SK',
            'used_at' => now(),
        ]);

        $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->getJson('/api/stats/simulations')
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('items.0.simulation', 'inverted_pendulum')
            ->assertJsonPath('items.0.total', 1);

        $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->getJson('/api/stats/simulations/inverted_pendulum')
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('items.0.city', 'Bratislava')
            ->assertJsonPath('items.0.country', 'SK');
    }
}
