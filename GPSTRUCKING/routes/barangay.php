<?php

use App\Http\Controllers\BarangayController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
 * Barangay will have these functions
 * - PROFILE
 * - DASHBOARD
 * - CHATS
 * - SETTINGS
 * - RESIDENT LIST
 *
 */
Route::middleware(['auth', 'verified',])->group(function () {
    // must be verified first
    Route::middleware(['ensure_verified'])->group(function() {
        // for barangay dashboard
        Route::get('/barangay/dashboard', function () {
            return Inertia::render('barangay/dashboard');
        })->name('barangay.dashboard');

        // for barangay personel profile
        Route::get('/barangay/profile', function () {
            return response('profile of barangay');
        })->name('barangay.profile');

        // for barangay to resident chat
        Route::get('/barangay/chats', function () {
            return response('chats');
        })->name('barangay.chats');
    });
    // for form
    Route::get('/barangay/create-profile', [BarangayController::class, 'displayProfileForm'])->name('barangay.barangay-profile-form');
    Route::post('/barangay/create-profile', [BarangayController::class, 'submitProfileForm'])->name('barangay.submit-barangay-profile-form');
});
