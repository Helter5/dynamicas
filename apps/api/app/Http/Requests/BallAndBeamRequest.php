<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BallAndBeamRequest extends FormRequest
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
            'reference' => ['nullable', 'numeric', 'min:-2', 'max:2'],
            'initial_r' => ['nullable', 'numeric', 'min:-2', 'max:2'],
            'initial_r_dot' => ['nullable', 'numeric', 'min:-20', 'max:20'],
            'initial_alpha' => ['nullable', 'numeric', 'min:-1.57', 'max:1.57'],
            'initial_alpha_dot' => ['nullable', 'numeric', 'min:-20', 'max:20'],
        ];
    }
}
