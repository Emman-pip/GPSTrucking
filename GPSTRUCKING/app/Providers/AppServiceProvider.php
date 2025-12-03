<?php

namespace App\Providers;

use App\Http\Middleware\EnsureLinkIsValid;
use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\EnsureVerified;
use App\Http\Middleware\isVerified;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        DB::statement("SET SESSION sql_mode = REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '')");
        Route::aliasMiddleware('ensure_has_profile', EnsureVerified::class);
        Route::aliasMiddleware('ensure_verified', isVerified::class);
        Route::aliasMiddleware('ensure_role', EnsureRole::class);
        Route::aliasMiddleware('ensure_valid_link', EnsureLinkIsValid::class);
    }
}
