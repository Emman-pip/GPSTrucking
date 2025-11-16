<?php

use App\Http\Controllers\ResidencyController;
use App\Models\Barangay;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    // profile form
    Route::get('/resident/profile-form', [ResidencyController::class, 'form'])->name('resident.profile-form');
    Route::post('/resident/profile-form', [ResidencyController::class, 'submit'])->name('resident.profile-form.submit');


    // ensure has profile form
    Route::middleware(['ensure_has_profile'])->group(function () {
        Route::get('/resident-dashboard', function () {
            $data = Auth::user()->residency->barangay;
            $data['coordinates']=  json_decode($data['coordinates']);
            return Inertia::render('resident/dashboard', [
                'barangayData' => $data,
                'barangays' => Barangay::all()->select(['id', 'name']),
            ]);

        })->name('resident.dashboard');

        // for updating profile form
        Route::put('/resident/update-profile-form', [ResidencyController::class, 'update'])->name('resident.profile-form.update');
    });
});
