<?php

namespace App\Http\Controllers\Api;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Symfony\Component\Yaml\Yaml;

class DocumentationController
{
    private function loadSpec(): array
    {
        $path = resource_path('docs/openapi.yaml');

        return Yaml::parseFile($path);
    }

    public function openapi(): JsonResponse
    {
        return response()->json($this->loadSpec());
    }

    public function downloadPdf(): Response
    {
        $spec = $this->loadSpec();

        $pdf = Pdf::loadView('docs.api-pdf', compact('spec'))
            ->setOptions([
                'isPhpEnabled' => true,
                'defaultFont' => 'Helvetica',
                'isRemoteEnabled' => false,
            ])
            ->setPaper('a4', 'portrait');

        return $pdf->download('dynamicas-api-docs.pdf');
    }
}
