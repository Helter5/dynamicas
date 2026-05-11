<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvertedPendulumSimulationTest extends TestCase
{
    use RefreshDatabase;

    public function test_inverted_pendulum_requires_api_key(): void
    {
        config(['app.api_key' => 'test-api-key']);

        $response = $this->postJson('/api/simulations/inverted-pendulum', []);

        $response
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Invalid or missing API key.',
            ]);
    }

    public function test_inverted_pendulum_returns_series_data(): void
    {
        config(['app.api_key' => 'test-api-key']);

        $response = $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->postJson('/api/simulations/inverted-pendulum', [
                'duration' => 1.0,
                'dt' => 0.1,
                'initial_theta' => 0.1,
                'reference' => 0.2,
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('simulation', 'inverted_pendulum')
            ->assertJsonPath('config.duration', 1)
            ->assertJsonPath('config.dt', 0.1)
            ->assertJsonPath('config.steps', 10)
            ->assertJsonCount(11, 'series')
            ->assertJsonStructure([
                'series' => [
                    '*' => ['t', 'x', 'v', 'theta', 'omega', 'reference', 'u'],
                ],
            ]);
    }

    public function test_inverted_pendulum_validates_inputs(): void
    {
        config(['app.api_key' => 'test-api-key']);

        $response = $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->postJson('/api/simulations/inverted-pendulum', [
                'duration' => 0.1,
                'dt' => 0.0001,
                'initial_theta' => 2,
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['duration', 'dt', 'initial_theta']);
    }
}
