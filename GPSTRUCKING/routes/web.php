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
        $user = Auth::user();
        if ($user->role_id === 2)
            return redirect()->route('resident.dashboard');
        else if ($user->role_id === 3)
            return redirect()->route('barangay.dashboard');
        else if ($user->role_id === 1)
            return response('Hi admin');
    })->name('evaluate-user');
});

require __DIR__.'/settings.php';
require __DIR__.'/resident.php';
require __DIR__.'/barangay.php';
