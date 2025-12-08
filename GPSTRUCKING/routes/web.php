<?php

use App\Http\Controllers\BinStatusController;
use App\Http\Controllers\ChartController;
use Illuminate\Http\Request;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\DropSiteController;
use App\Http\Controllers\DropSiteReportController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\RouteController;
use App\Mail\ContactUs;
use App\Models\Barangay;
use App\Models\User;
use App\Notifications\Message;
use App\Notifications\SampleNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (!Auth::user()) {
        return Inertia::render('landing/LandingPage');//redirect()->route('login');
    }
    if (Features::enabled(Features::registration())){
        return redirect()->route('evaluate-user');
    }
    /* return Inertia::render('welcome', [ */
    /*     'canRegister' => Features::enabled(Features::registration()), */
    /* ]); */
})->name('home');

Route::get('/hero', function() {
    return Inertia::render('landing/LandingPage');//redirect()->route('login');
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
    // for chats
    Route::middleware(['ensure_verified', 'ensure_has_profile'])->group(function () {
        Route::get('/chats', [MessageController::class, 'view'])->name('chat');
        Route::get('/chats-{id}', [MessageController::class, 'viewSingle'])->name('individualChat');
        Route::post('/send-chat', [MessageController::class, 'send'])->name('sendChat');
    });
    Route::get('/unread-chats', function() {
        return response()->json([ 'count' => Auth::user()->unreadNotifications()->where('type', 'App\Notifications\Message')->get()->count() ]);
    })->name('count.chats');
    Route::get('/unread-alerts', function() {
        return response()->json([ 'count' => Auth::user()->unreadNotifications()->where('type', 'App\Notifications\Alert')->get()->count() ]);
    })->name('count.alerts');
});

// public routes for getting data
Route::get('/get-routes', [RouteController::class, 'get'])->name('get.routes');
Route::get('/get-routes-{id}', [RouteController::class, 'getForDriver'])->name('get.routes.driver');
Route::get('/get-pickup-sites', [DropSiteController::class, 'dropSites'])->name('get.dropsites');

require __DIR__.'/settings.php';
require __DIR__.'/resident.php';
require __DIR__.'/barangay.php';

Route::get('/sample-{id}', function ($id) {
    User::find($id)->notify(new Message('Hello there barangay 10 - 1'));
});


Route::middleware(['ensure_valid_link'])->group(function () {
    Route::get('/driver', [DriverController::class, 'index'])
        ->name('driver');
    Route::put('/driver', [BinStatusController::class, 'update'])
        ->name('driver.updateBin');
});

Route::post('/update-location', [DriverController::class, 'postGPS'])
    ->name('truck.updateGPS');

Route::post('/drop-site-reports', [DropSiteReportController::class, 'store'])
    ->name('drop-site-reports.store');

Route::post('/start-collection-{id}', [DriverController::class, 'notifyStart'])
    ->name('collection.start') ;

Route::post('/end-collection-{id}', [DriverController::class, 'notifyEnd'])
    ->name('collection.end') ;

Route::get('/get-barangay-{barangay_id}', [ChartController::class, 'residentsTrend']);

Route::post('/contact-us', function (Request $request) {
    $data = $request->validate([
        'name' => 'required',
        'email' => 'required',
        'message' => 'required',
    ]);
    try {
        // Send email
        Mail::to('gpstrucking50@gmail.com')->send(
            new ContactUs(
                $data['name'],
                $data['email'],
                $data['message']
            )
        );
    } catch (Exception $e) {
        dd($e);
        return;
    }
})->name('contact.us');
