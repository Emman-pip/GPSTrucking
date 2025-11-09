<?php

use App\Http\Controllers\BarangayController;
use App\Http\Controllers\BarangayOfficialInformationController;
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
        Route::get('/barangay/dashboard', [BarangayController::class, 'dashboard'] )->name('barangay.dashboard');
        // for barangay personel profile
        Route::get('/barangay/profile', [BarangayController::class, 'profile'])->name('barangay.profile');

        // for barangay to resident chat
        Route::get('/barangay/chats', [BarangayController::class, 'chat'])->name('barangay.chats');
    });
    // for form
    Route::get('/barangay/create-profile', [BarangayOfficialInformationController::class, 'displayProfileForm'])->name('barangay.barangay-profile-form');
    Route::post('/barangay/create-profile', [BarangayOfficialInformationController::class, 'submitProfileForm'])->name('barangay.submit-barangay-profile-form');
});
