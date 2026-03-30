<?php

namespace App\Services;

use RuntimeException;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class CasEvaluatorService
{
    /**
     * @return array{mock: bool, output: string}
     */
    public function evaluate(string $command): array
    {
        $driver = (string) config('cas.driver', 'mock');

        if ($driver === 'octave') {
            return $this->evaluateWithOctave($command);
        }

        return [
            'mock' => true,
            'output' => "mock-result: {$command}",
        ];
    }

    /**
     * @return array{mock: bool, output: string}
     */
    private function evaluateWithOctave(string $command): array
    {
        $binary = (string) config('cas.octave.binary', 'octave-cli');
        $timeout = (int) config('cas.octave.timeout_seconds', 8);

        $process = new Process([
            $binary,
            '--quiet',
            '--no-window-system',
            '--eval',
            $command,
        ]);
        $process->setTimeout($timeout);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        $output = trim($process->getOutput());

        if ($output === '') {
            $output = trim($process->getErrorOutput());
        }

        if ($output === '') {
            throw new RuntimeException('Octave did not return output.');
        }

        return [
            'mock' => false,
            'output' => $output,
        ];
    }
}
