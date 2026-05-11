<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BallAndBeamSimulationTest extends TestCase
{
    use RefreshDatabase;

    public function test_ball_and_beam_requires_api_key(): void
    {
        config(['app.api_key' => 'test-api-key']);

        $response = $this->postJson('/api/simulations/ball-and-beam', []);

        $response
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Invalid or missing API key.',
            ]);
    }

    public function test_ball_and_beam_returns_series_data(): void
    {
        config(['app.api_key' => 'test-api-key']);

        $response = $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->postJson('/api/simulations/ball-and-beam', [
                'duration' => 1.0,
                'dt' => 0.1,
                'reference' => 0.25,
                'initial_r' => 0,
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('simulation', 'ball_and_beam')
            ->assertJsonPath('config.duration', 1)
            ->assertJsonPath('config.dt', 0.1)
            ->assertJsonPath('config.steps', 10)
            ->assertJsonCount(11, 'series')
            ->assertJsonStructure([
                'series' => [
                    '*' => ['t', 'r', 'r_dot', 'alpha', 'alpha_dot', 'reference', 'u'],
                ],
            ]);
    }

    public function test_ball_and_beam_validates_inputs(): void
    {
        config(['app.api_key' => 'test-api-key']);

        $response = $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->postJson('/api/simulations/ball-and-beam', [
                'duration' => 0.1,
                'dt' => 0.0001,
                'initial_alpha' => 2,
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['duration', 'dt', 'initial_alpha']);
    }
}
