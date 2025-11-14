<?php

use App\Http\Controllers\DropSiteController;
use App\Http\Controllers\RouteController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (Features::enabled(Features::registration())){
        return redirect()->route('evaluate-user');
    }
    return Inertia::render('hero-page');//redirect()->route('login');
    /* return Inertia::render('welcome', [ */
    /*     'canRegister' => Features::enabled(Features::registration()), */
    /* ]); */
})->name('home');

Route::get('/hero', function() {
    return Inertia::render('hero-page');//redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/evaluate-user', function () {
        $role = Auth::user()->role->name;
        if ($role === 'resident')
            return redirect()->route('resident.dashboard');
        else if ($role === 'barangay')
            return redirect()->route('barangay.dashboard');
        else if ($role === 'admin')
            return redirect('/admin');
    })->name('evaluate-user');
});

// public routes for getting data
Route::get('/get-routes', [RouteController::class, 'get'])->name('get.routes');
Route::get('/get-pickup-sites', [DropSiteController::class, 'dropSites'])->name('get.dropsites');

require __DIR__.'/settings.php';
require __DIR__.'/resident.php';
require __DIR__.'/barangay.php';
