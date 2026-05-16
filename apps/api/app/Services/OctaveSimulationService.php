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
        $x0 = implode('; ', array_map('strval', $initialState));
        $steps = (int) floor($duration / $dt);

        $script = <<<OCTAVE
        A = [0, 1, 0, 0; 0, -0.181818181818182, 2.67272727272727, 0; 0, 0, 0, 1; 0, -0.454545454545455, 31.1818181818182, 0];
        B = [0; 1.81818181818182; 0; 4.54545454545455];
        K = [-1.0, -1.6567, 18.6854, 3.4594];
        N = -1.0;
        ref = {$reference};
        dt = {$dt};
        x = [{$x0}];
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
        $x0 = implode('; ', array_map('strval', $initialState));
        $steps = (int) floor($duration / $dt);

        $script = <<<OCTAVE
        A = [0, 1, 0, 0; 0, 0, 7, 0; 0, 0, 0, 1; 0, 0, 0, 0];
        B = [0; 0; 0; 1];
        K = [1828.57142857143, 1028.57142857143, 2008.0, 104.0];
        N = 1828.57142857143;
        ref = {$reference};
        dt = {$dt};
        x = [{$x0}];
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

        $result = $this->casEvaluator->evaluate($script);

        return $this->parseOutput($result['output'], ['r', 'r_dot', 'alpha', 'alpha_dot']);
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
