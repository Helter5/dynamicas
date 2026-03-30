<?php

use App\Http\Controllers\Api\CasController;
use App\Http\Controllers\Api\LogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'api',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::middleware('api.key')->group(function () {
    Route::post('/cas/eval', [CasController::class, 'eval']);
    Route::get('/logs/export.csv', [LogController::class, 'exportCsv']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');
});
