<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/barangay-dashboard', function () {
        return Inertia::render('barangay/dashboard');
    })->name('barangay.dashboard');
});
