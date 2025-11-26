<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\BarangayRatingController;
use App\Http\Controllers\ResidencyController;
use App\Models\Barangay;
use Carbon\Carbon;
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

            $week_start = Carbon::now()->startOfWeek()->toDateString();

            $userRatingThisWeek = \App\Models\BarangayRating::where('user_id', auth()->id())
                ->where('barangay_id', Auth::user()->residency->barangay_id)
                ->where('week_start', $week_start)
                ->exists();

            return Inertia::render('resident/dashboard', [
                'barangayData' => $data,
                'barangays' => Barangay::all()->select(['id', 'name']),
                'userRatingThisWeek' => $userRatingThisWeek
            ]);

        })->name('resident.dashboard');

        Route::get('/alerts', [AlertController::class, 'view'])
            ->name('resident.alerts');
        Route::put('/alerts', [AlertController::class, 'markRead'])
            ->name('resident.alerts.makeRead');

        // for updating profile form
        Route::put('/resident/update-profile-form', [ResidencyController::class, 'update'])->name('resident.profile-form.update');

        // for ratings
        Route::get('/barangay-ratings', [BarangayRatingController::class, 'index'])->name('barangay.ratings.index');
        Route::post('/barangay-ratings', [BarangayRatingController::class, 'store'])->name('barangay.ratings.store');
    });
});
