<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/resident-dashboard', function () {
        return Inertia::render('resident/dashboard');
    })->name('resident.dashboard');
});
