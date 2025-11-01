<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/evaluate-user', function () {
        $user = Auth::user();
        if ($user->role_id === 2)
            return response('Hi resident');
        else if ($user->role_id === 3)
            return response('Hi barangay');
        else if ($user->role_id === 1)
            return response('Hi admin');
    });
});

require __DIR__.'/settings.php';
