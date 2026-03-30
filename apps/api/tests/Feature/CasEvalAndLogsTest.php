<?php

namespace Tests\Feature;

use App\Models\ApiLog;
use App\Models\CasUserState;
use App\Services\CasEvaluatorService;
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

    public function test_cas_eval_uses_octave_driver_when_configured(): void
    {
        config([
            'app.api_key' => 'test-api-key',
            'cas.driver' => 'octave',
        ]);

        $serviceMock = $this->createMock(CasEvaluatorService::class);
        $serviceMock
            ->expects($this->once())
            ->method('evaluate')
            ->with('sqrt(4)')
            ->willReturn([
                'mock' => false,
                'output' => '2',
            ]);

        $this->app->instance(CasEvaluatorService::class, $serviceMock);

        $response = $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->withHeader('X-ANON-TOKEN', 'anon-octave-1')
            ->postJson('/api/cas/eval', [
                'command' => 'sqrt(4)',
                'source' => 'form',
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('result.mock', false)
            ->assertJsonPath('result.output', '2');

        $this->assertDatabaseHas('api_logs', [
            'anon_token' => 'anon-octave-1',
            'endpoint' => '/api/cas/eval',
            'command' => 'sqrt(4)',
            'status' => 'success',
        ]);
    }

    public function test_cas_eval_persists_state_between_requests(): void
    {
        config([
            'app.api_key' => 'test-api-key',
            'cas.driver' => 'octave',
        ]);

        $expectedScripts = ['a=1+1', "a=1+1\na+2"];
        $callIndex = 0;

        $serviceMock = $this->createMock(CasEvaluatorService::class);
        $serviceMock
            ->expects($this->exactly(2))
            ->method('evaluate')
            ->willReturnCallback(function (string $script) use (&$callIndex, $expectedScripts): array {
                $this->assertSame($expectedScripts[$callIndex], $script);

                $callIndex++;

                return $callIndex === 1
                    ? ['mock' => false, 'output' => '2']
                    : ['mock' => false, 'output' => '4'];
            });

        $this->app->instance(CasEvaluatorService::class, $serviceMock);

        $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->withHeader('X-ANON-TOKEN', 'anon-state-1')
            ->postJson('/api/cas/eval', [
                'command' => 'a=1+1',
                'source' => 'form',
            ])
            ->assertOk()
            ->assertJsonPath('result.output', '2');

        $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->withHeader('X-ANON-TOKEN', 'anon-state-1')
            ->postJson('/api/cas/eval', [
                'command' => 'a+2',
                'source' => 'form',
            ])
            ->assertOk()
            ->assertJsonPath('result.output', '4');

        $this->assertDatabaseHas('cas_user_states', [
            'anon_token' => 'anon-state-1',
            'script' => "a=1+1\na+2",
        ]);
    }

    public function test_cas_state_can_be_reset(): void
    {
        config([
            'app.api_key' => 'test-api-key',
        ]);

        CasUserState::create([
            'anon_token' => 'anon-state-reset-1',
            'script' => "a=1+1\na+2",
        ]);

        $this
            ->withHeader('X-API-KEY', 'test-api-key')
            ->withHeader('X-ANON-TOKEN', 'anon-state-reset-1')
            ->deleteJson('/api/cas/state')
            ->assertOk()
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseMissing('cas_user_states', [
            'anon_token' => 'anon-state-reset-1',
        ]);
    }
}
