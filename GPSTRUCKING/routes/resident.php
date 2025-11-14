<?php

use App\Http\Controllers\ResidencyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    // profile form
    Route::get('/resident/profile-form', [ResidencyController::class, 'form'])->name('resident.profile-form');
    Route::post('/resident/profile-form', [ResidencyController::class, 'submit'])->name('resident.profile-form.submit');


    // ensure has profile form
    Route::middleware(['ensure_has_profile'])->group(function () {
        Route::get('/resident-dashboard', function () {
            return Inertia::render('resident/dashboard');
        })->name('resident.dashboard');

    });
});
