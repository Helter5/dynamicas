<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApiLog;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LogController extends Controller
{
    public function exportCsv(Request $request): StreamedResponse
    {
        $logs = ApiLog::query()
            ->latest('created_at')
            ->get();

        $fileName = 'api-logs-'.now()->format('Ymd_His').'.csv';

        return response()->streamDownload(function () use ($logs) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'created_at',
                'anon_token',
                'endpoint',
                'command',
                'status',
                'error_message',
            ]);

            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log->created_at?->toIso8601String(),
                    $log->anon_token,
                    $log->endpoint,
                    $log->command,
                    $log->status,
                    $log->error_message,
                ]);
            }

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
