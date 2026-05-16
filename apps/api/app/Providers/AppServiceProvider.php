<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        RateLimiter::for('simulations', function (Request $request) {
            $maxAttempts = (int) config('cas.simulation_rate_limit', 30);

            return Limit::perMinute($maxAttempts)->by($request->ip());
        });
    }
}
