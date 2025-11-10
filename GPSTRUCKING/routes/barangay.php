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
    Route::middleware(['ensure_has_profile'])->group(function() {
        // for barangay dashboard
        Route::get('/barangay/dashboard', [BarangayController::class, 'dashboard'] )->name('barangay.dashboard');

        Route::get('/barangay/profile', [BarangayOfficialInformationController::class, 'profile'])->name('barangay.profile');

        // for barangay to resident chat
        Route::get('/barangay/chats', [BarangayController::class, 'chat'])->name('barangay.chats');


        // mapupunta dapat dito yung
    });
    // for form
    Route::get('/barangay/create-profile', [BarangayOfficialInformationController::class, 'displayProfileForm'])->name('barangay.barangay-profile-form');
    Route::post('/barangay/create-profile', [BarangayOfficialInformationController::class, 'submitProfileForm'])->name('barangay.submit-barangay-profile-form');
    Route::get('/barangay/profile-edit', [BarangayOfficialInformationController::class, 'profile'])->name('barangay.profile.edit');
    Route::put('/barangay/update-contact', [BarangayOfficialInformationController::class, 'updateContactInfo'])->name('barangay.contact.update');
    Route::put('/barangay/update-assignment', [BarangayOfficialInformationController::class, 'updateAssignment'])->name('barangay.assignment.update');
    Route::put('/barangay/update-barangay-official-id', [BarangayOfficialInformationController::class, 'updateOfficialId'])->name('barangay.official-id.update');
    Route::put('/barangay/update-valid-id', [BarangayOfficialInformationController::class, 'updateValidID'])->name('barangay.valid-id.update');
    // create routes for files update
});
