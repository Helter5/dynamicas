<?php

namespace App\Services;

use RuntimeException;

class OctaveSimulationService
{
    public function __construct(
        private readonly CasEvaluatorService $casEvaluator,
    ) {}

    /**
     * @param  array<int, float>  $initialState  [x, v, theta, omega]
     * @return array<int, array<string, float>>
     */
    public function simulateInvertedPendulum(
        float $reference,
        array $initialState,
        float $duration,
        float $dt,
    ): array {
        $script = $this->buildScript(
            a: [
                [0.0, 1.0, 0.0, 0.0],
                [0.0, -0.181818181818182, 2.67272727272727, 0.0],
                [0.0, 0.0, 0.0, 1.0],
                [0.0, -0.454545454545455, 31.1818181818182, 0.0],
            ],
            b: [0.0, 1.81818181818182, 0.0, 4.54545454545455],
            k: [-1.0, -1.6567, 18.6854, 3.4594],
            n: -1.0,
            reference: $reference,
            initialState: $initialState,
            duration: $duration,
            dt: $dt,
        );

        $result = $this->casEvaluator->evaluate($script);

        return $this->parseOutput($result['output'], ['x', 'v', 'theta', 'omega']);
    }

    /**
     * @param  array<int, float>  $initialState  [r, r_dot, alpha, alpha_dot]
     * @return array<int, array<string, float>>
     */
    public function simulateBallAndBeam(
        float $reference,
        array $initialState,
        float $duration,
        float $dt,
    ): array {
        $script = $this->buildScript(
            a: [
                [0.0, 1.0, 0.0, 0.0],
                [0.0, 0.0, 7.0, 0.0],
                [0.0, 0.0, 0.0, 1.0],
                [0.0, 0.0, 0.0, 0.0],
            ],
            b: [0.0, 0.0, 0.0, 1.0],
            k: [1828.57142857143, 1028.57142857143, 2008.0, 104.0],
            n: 1828.57142857143,
            reference: $reference,
            initialState: $initialState,
            duration: $duration,
            dt: $dt,
        );

        $result = $this->casEvaluator->evaluate($script);

        return $this->parseOutput($result['output'], ['r', 'r_dot', 'alpha', 'alpha_dot']);
    }

    /**
     * @param  array<int, array<int, float>>  $a
     * @param  array<int, float>  $b
     * @param  array<int, float>  $k
     * @param  array<int, float>  $initialState
     */
    private function buildScript(
        array $a,
        array $b,
        array $k,
        float $n,
        float $reference,
        array $initialState,
        float $duration,
        float $dt,
    ): string {
        $aStr = $this->formatMatrix($a);
        $bStr = $this->formatColumnVector($b);
        $kStr = $this->formatRowVector($k);
        $x0Str = $this->formatColumnVector($initialState);
        $steps = (int) floor($duration / $dt);

        return <<<OCTAVE
        A = {$aStr};
        B = {$bStr};
        K = {$kStr};
        N = {$n};
        ref = {$reference};
        dt = {$dt};
        x = {$x0Str};
        steps = {$steps};
        result = zeros(steps+1, 7);
        for i = 1:steps+1
          t = (i-1)*dt;
          u = N*ref - K*x;
          result(i,:) = [t, x', ref, u];
          if i <= steps
            k1 = A*x + B*u;
            x2 = x + (dt/2)*k1; u2 = N*ref - K*x2;
            k2 = A*x2 + B*u2;
            x3 = x + (dt/2)*k2; u3 = N*ref - K*x3;
            k3 = A*x3 + B*u3;
            x4 = x + dt*k3; u4 = N*ref - K*x4;
            k4 = A*x4 + B*u4;
            x = x + (dt/6)*(k1 + 2*k2 + 2*k3 + k4);
          end
        end
        disp(jsonencode(result));
        OCTAVE;
    }

    /**
     * @param  array<int, array<int, float>>  $matrix
     */
    private function formatMatrix(array $matrix): string
    {
        $rows = array_map(
            fn (array $row) => implode(', ', $row),
            $matrix,
        );

        return '['.implode('; ', $rows).']';
    }

    /**
     * @param  array<int, float>  $vector
     */
    private function formatColumnVector(array $vector): string
    {
        return '['.implode('; ', $vector).']';
    }

    /**
     * @param  array<int, float>  $vector
     */
    private function formatRowVector(array $vector): string
    {
        return '['.implode(', ', $vector).']';
    }

    /**
     * @param  array<int, string>  $stateKeys
     * @return array<int, array<string, float>>
     */
    private function parseOutput(string $output, array $stateKeys): array
    {
        $jsonStart = strpos($output, '[[');
        $jsonEnd = strrpos($output, ']]');

        if ($jsonStart === false || $jsonEnd === false) {
            throw new RuntimeException('Failed to locate JSON in Octave simulation output.');
        }

        $jsonStr = substr($output, $jsonStart, $jsonEnd - $jsonStart + 2);

        /** @var array<int, array<int, float>>|null $raw */
        $raw = json_decode($jsonStr, true);

        if (! is_array($raw)) {
            throw new RuntimeException('Failed to decode Octave simulation JSON output.');
        }

        $stateCount = count($stateKeys);
        $series = [];

        foreach ($raw as $row) {
            $point = ['t' => round((float) $row[0], 5)];

            foreach ($stateKeys as $i => $key) {
                $point[$key] = (float) $row[$i + 1];
            }

            $point['reference'] = (float) $row[$stateCount + 1];
            $point['u'] = (float) $row[$stateCount + 2];
            $series[] = $point;
        }

        return $series;
    }
}
