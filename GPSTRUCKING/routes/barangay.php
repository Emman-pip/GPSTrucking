<?php

use App\Http\Controllers\BarangayController;
use App\Http\Controllers\BarangayOfficialInformationController;
use App\Http\Controllers\DropSiteController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\RouteController;
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
Route::middleware(['auth', 'ensure_role:barangay', 'verified',])->group(function () {
    // must be verified first
    Route::middleware(['ensure_has_profile'])->group(function() {
        // for barangay dashboard
        Route::get('/barangay/dashboard', [BarangayController::class, 'dashboard'] )->name('barangay.dashboard');

        Route::get('/barangay/profile', [BarangayOfficialInformationController::class, 'profile'])->name('barangay.profile');

        // for barangay to resident chat

        // TODO lagay dito na dapat verified din yung user as barangay!!!
        Route::middleware(['ensure_verified'])->group(function() {

            // for pickup sites
            Route::get('/barangay/map', [MapController::class, 'map'])->name('barangay.map');
            Route::post('barangay/create-pickup-site', [DropSiteController::class, 'post'])->name('barangay.new.dropsite');
            Route::put('barangay/update-pickup-description', [DropSiteController::class, 'updateDescription'])->name('barangay.update.dropsites.description');
            Route::put('barangay/update-pickup-image', [DropSiteController::class, 'updateImage'])->name('barangay.update.dropsites.image');
            Route::put('barangay/update-pickup-coordinates', [DropSiteController::class, 'updateCoordinates'])->name('barangay.update.dropsites.coordinates');
            Route::delete('barangay/delete-pickupsite-{id}', [DropSiteController::class, 'delete'])->name('barangay.delete.dropsites');
            // for routes
            Route::post('/barangay/create-route', [RouteController::class, 'create'])->name('barangay.create.route');
            // updating routes
            Route::put('/barangay/update-route', [RouteController::class, 'update'])->name('barangay.update.route');
            Route::delete('/barangay/delete-route-{id}', [RouteController::class, 'delete'])->name('barangay.delete.route');

            // for chats
            Route::get('/barangay/chats', [MessageController::class, 'view'])->name('barangay.chats');
            Route::get('/barangay/chats-{id}', [MessageController::class, 'viewSingle'])->name('barangay.chats.individual');
        });
    });
    // for form
    Route::get('/barangay/create-profile', [BarangayOfficialInformationController::class, 'displayProfileForm'])->name('barangay.barangay-profile-form');
    Route::post('/barangay/create-profile', [BarangayOfficialInformationController::class, 'submitProfileForm'])->name('barangay.submit-barangay-profile-form');
    Route::get('/barangay/profile-edit', [BarangayOfficialInformationController::class, 'profile'])->name('barangay.profile.edit');
    Route::put('/barangay/update-contact', [BarangayOfficialInformationController::class, 'updateContactInfo'])->name('barangay.contact.update');
    Route::put('/barangay/update-assignment', [BarangayOfficialInformationController::class, 'updateAssignment'])->name('barangay.assignment.update');
    Route::put('/barangay/update-barangay-official-id', [BarangayOfficialInformationController::class, 'updateOfficialId'])->name('barangay.official-id.update');
    Route::put('/barangay/update-valid-id', [BarangayOfficialInformationController::class, 'updateValidID'])->name('barangay.valid-id.update');
    // get routes information
    Route::get('/barangay/get-routes', [RouteController::class, 'get'])->name('barangay.get.routes');
    Route::get('barangay/get-pickup-sites', [DropSiteController::class, 'dropSites'])->name('barangay.get.dropsites');
});
