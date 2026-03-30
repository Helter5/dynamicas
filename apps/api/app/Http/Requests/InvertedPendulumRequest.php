<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvertedPendulumRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'duration' => ['nullable', 'numeric', 'min:0.5', 'max:60'],
            'dt' => ['nullable', 'numeric', 'min:0.001', 'max:0.2'],
            'initial_theta' => ['nullable', 'numeric', 'min:-1.57', 'max:1.57'],
            'initial_omega' => ['nullable', 'numeric', 'min:-20', 'max:20'],
            'initial_x' => ['nullable', 'numeric', 'min:-10', 'max:10'],
            'initial_v' => ['nullable', 'numeric', 'min:-20', 'max:20'],
            'force' => ['nullable', 'numeric', 'min:-100', 'max:100'],
            'cart_mass' => ['nullable', 'numeric', 'min:0.1', 'max:20'],
            'pendulum_mass' => ['nullable', 'numeric', 'min:0.05', 'max:10'],
            'pendulum_length' => ['nullable', 'numeric', 'min:0.1', 'max:5'],
            'gravity' => ['nullable', 'numeric', 'min:1', 'max:20'],
            'cart_damping' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'pendulum_damping' => ['nullable', 'numeric', 'min:0', 'max:5'],
        ];
    }
}
