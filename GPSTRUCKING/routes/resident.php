<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    // profile form
    Route::get('/resident/profile-form', (function () {
        return response('hi world');
    }))->name('resident.profile-form');

    // ensure has profile form
    Route::middleware(['ensure_has_profile'])->group(function () {
        Route::get('/resident-dashboard', function () {
            return Inertia::render('resident/dashboard');
        })->name('resident.dashboard');
    });
});
