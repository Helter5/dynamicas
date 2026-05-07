<?php

namespace App\Services;

class StateSpaceSimulationService
{
    /**
     * @param  array<int, array<int, float>>  $a
     * @param  array<int, float>  $b
     * @param  array<int, float>  $k
     * @param  array<int, float>  $initialState
     * @param  array<int, string>  $stateKeys
     * @return array<int, array<string, float>>
     */
    public function simulateClosedLoop(
        array $a,
        array $b,
        array $k,
        float $n,
        float $reference,
        array $initialState,
        array $stateKeys,
        float $duration,
        float $dt,
    ): array {
        $steps = (int) floor($duration / $dt);
        $state = $initialState;
        $series = [];

        for ($i = 0; $i <= $steps; $i++) {
            $t = $i * $dt;
            $point = [
                't' => round($t, 5),
            ];

            foreach ($stateKeys as $index => $key) {
                $point[$key] = $state[$index];
            }

            $point['reference'] = $reference;
            $point['u'] = $this->controlInput($k, $n, $reference, $state);
            $series[] = $point;

            if ($i === $steps) {
                break;
            }

            $state = $this->rk4Step($a, $b, $k, $n, $reference, $state, $dt);
        }

        return $series;
    }

    /**
     * @param  array<int, array<int, float>>  $a
     * @param  array<int, float>  $b
     * @param  array<int, float>  $k
     * @param  array<int, float>  $state
     * @return array<int, float>
     */
    private function rk4Step(array $a, array $b, array $k, float $n, float $reference, array $state, float $dt): array
    {
        $k1 = $this->derivative($a, $b, $k, $n, $reference, $state);
        $k2 = $this->derivative($a, $b, $k, $n, $reference, $this->addScaled($state, $k1, $dt / 2));
        $k3 = $this->derivative($a, $b, $k, $n, $reference, $this->addScaled($state, $k2, $dt / 2));
        $k4 = $this->derivative($a, $b, $k, $n, $reference, $this->addScaled($state, $k3, $dt));

        $next = [];
        foreach ($state as $index => $value) {
            $next[$index] = $value + ($dt / 6) * ($k1[$index] + 2 * $k2[$index] + 2 * $k3[$index] + $k4[$index]);
        }

        return $next;
    }

    /**
     * @param  array<int, array<int, float>>  $a
     * @param  array<int, float>  $b
     * @param  array<int, float>  $k
     * @param  array<int, float>  $state
     * @return array<int, float>
     */
    private function derivative(array $a, array $b, array $k, float $n, float $reference, array $state): array
    {
        $u = $this->controlInput($k, $n, $reference, $state);
        $dx = [];

        foreach ($a as $rowIndex => $row) {
            $sum = 0.0;
            foreach ($row as $columnIndex => $coefficient) {
                $sum += $coefficient * $state[$columnIndex];
            }

            $dx[$rowIndex] = $sum + $b[$rowIndex] * $u;
        }

        return $dx;
    }

    /**
     * @param  array<int, float>  $k
     * @param  array<int, float>  $state
     */
    private function controlInput(array $k, float $n, float $reference, array $state): float
    {
        $feedback = 0.0;
        foreach ($k as $index => $gain) {
            $feedback += $gain * $state[$index];
        }

        return $n * $reference - $feedback;
    }

    /**
     * @param  array<int, float>  $state
     * @param  array<int, float>  $delta
     * @return array<int, float>
     */
    private function addScaled(array $state, array $delta, float $scale): array
    {
        $next = [];
        foreach ($state as $index => $value) {
            $next[$index] = $value + $delta[$index] * $scale;
        }

        return $next;
    }
}
