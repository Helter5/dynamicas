<?php

use App\Http\Controllers\Api\CasController;
use App\Http\Controllers\Api\DocumentationController;
use App\Http\Controllers\Api\LogController;
use App\Http\Controllers\Api\SimulationController;
use App\Http\Controllers\Api\StatsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('api.cors')->group(function () {
    Route::options('/{any}', function () {
        return response()->noContent();
    })->where('any', '.*');

    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'service' => 'api',
            'timestamp' => now()->toIso8601String(),
        ]);
    });

    Route::get('/docs/openapi.json', [DocumentationController::class, 'openapi']);
    Route::get('/docs/pdf', [DocumentationController::class, 'downloadPdf']);

    Route::middleware('api.key')->group(function () {
        Route::post('/cas/eval', [CasController::class, 'eval']);
        Route::delete('/cas/state', [CasController::class, 'resetState']);
        Route::middleware('throttle:simulations')->group(function () {
            Route::post('/simulations/inverted-pendulum', [SimulationController::class, 'invertedPendulum']);
            Route::post('/simulations/ball-and-beam', [SimulationController::class, 'ballAndBeam']);
        });
        Route::get('/logs/export.csv', [LogController::class, 'exportCsv']);
        Route::get('/stats/simulations', [StatsController::class, 'summary']);
        Route::get('/stats/simulations/{simulation}', [StatsController::class, 'details']);

        Route::get('/user', function (Request $request) {
            return $request->user();
        })->middleware('auth:sanctum');
    });
});
