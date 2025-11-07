<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (Features::enabled(Features::registration())){
        return redirect()->route('evaluate-user');
    }
    return redirect()->route('login');
    /* return Inertia::render('welcome', [ */
    /*     'canRegister' => Features::enabled(Features::registration()), */
    /* ]); */
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/evaluate-user', function () {
        $role = Auth::user()->role->name;
        if ($role === 'resident')
            return redirect()->route('resident.dashboard');
        else if ($role === 'barangay')
            return redirect()->route('barangay.dashboard');
        else if ($role === 'admin')
            return response('Hi admin');
    })->name('evaluate-user');
});

require __DIR__.'/settings.php';
require __DIR__.'/resident.php';
require __DIR__.'/barangay.php';
