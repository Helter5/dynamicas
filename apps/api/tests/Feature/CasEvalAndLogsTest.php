<?php

namespace Tests\Feature;

use App\Models\ApiLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CasEvalAndLogsTest extends TestCase
{
    use RefreshDatabase;

    public function test_cas_eval_requires_api_key(): void
    {
        config(['app.api_key' => 'test-api-key']);

        $response = $this->postJson('/api/cas/eval', [
            'command' => '1+1',
        ]);

        $response
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Invalid or missing API key.',
            ]);
    }

    public function test_cas_eval_returns_mock_result_and_logs_request(): void
    {
        config(['app.api_key' => 'test-api-key']);

        $response = $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->withHeader('X-ANON-TOKEN', 'anon-test-001')
            ->postJson('/api/cas/eval', [
                'command' => 'a=1+1',
                'source' => 'form',
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('result.mock', true)
            ->assertJsonPath('result.output', 'mock-result: a=1+1');

        $this->assertDatabaseHas('api_logs', [
            'anon_token' => 'anon-test-001',
            'endpoint' => '/api/cas/eval',
            'command' => 'a=1+1',
            'status' => 'success',
        ]);
    }

    public function test_logs_can_be_exported_as_csv(): void
    {
        config(['app.api_key' => 'test-api-key']);

        ApiLog::create([
            'anon_token' => 'anon-export-1',
            'endpoint' => '/api/cas/eval',
            'command' => 'a+2',
            'status' => 'success',
            'error_message' => null,
            'meta' => ['source' => 'form'],
        ]);

        $response = $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->get('/api/logs/export.csv');

        $response->assertOk();
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');

        $csvContent = $response->streamedContent();

        $this->assertStringContainsString('created_at,anon_token,endpoint,command,status,error_message', $csvContent);
        $this->assertStringContainsString('anon-export-1', $csvContent);
        $this->assertStringContainsString('/api/cas/eval', $csvContent);
        $this->assertStringContainsString('a+2', $csvContent);
    }
}
