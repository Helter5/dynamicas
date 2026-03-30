<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    public function test_api_health_endpoint_returns_ok_status(): void
    {
        $response = $this->getJson('/api/health');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'status',
                'service',
                'timestamp',
            ])
            ->assertJson([
                'status' => 'ok',
                'service' => 'api',
            ]);
    }
}
