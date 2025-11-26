<?php

use App\Models\Barangay;
use App\Models\BinStatus;
use App\Models\DropSite;
use App\Models\PickUpSchedule;
use App\Models\User;
use App\Notifications\Alert;
use App\Notifications\Message;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    // get the current date and time
    //
    // get the resident users per barangay
    $day = Carbon::now('Asia/Manila')->subDay()->format('l');
    $schedules = PickUpSchedule::all();
    foreach ($schedules as $sched){
        if ($sched->day_of_the_week !== $day) {
            continue;
        }

        $residencies = Barangay::find($sched->barangay_id)->residents;

        foreach ($residencies as $resident) {
            User::find($resident->user_id)->notify(
                new Alert(
                    'Garbage Collection in Your Area Soon!',
                    'Garbage trucks are scheduled at ' . $sched->day_of_the_week . ' ' . $sched->time . '. Prepare your garbage for a cleaner world!',
                    ['Garback Pick Up', 'Prepare']
                )
            );
        }
    }
})
    ->timezone('Asia/Manila')
    ->dailyAt('4:00');


Schedule::call(function () {
    // get the current date and time
    //
    // get the resident users per barangay
    $day = Carbon::now('Asia/Manila')->format('l');
    $time = Carbon::now('Asia/Manila')->format('H:i');

    $schedules = PickUpSchedule::all();
    foreach ($schedules as $sched){
        if ($sched->day_of_the_week !== $day || $time !== $sched->time) {
            continue;
        }

        $residencies = Barangay::find($sched->barangay_id)->residents;

        foreach ($residencies as $resident) {
            User::find($resident->user_id)->notify(
                new Alert(
                    'Garbage Trucks Will Soon Go Through Your Area',
                    'Garbage trucks are scheduled at ' . $sched->day_of_the_week . ' ' . $sched->time . '. This is a gentle reminder for you to take your trash out.',
                    ['Garback Pick Up', 'Ongoing']
                )
            );
        }
    }
})
    ->timezone('Asia/Manila')
    ->everyMinute();

// testing
// Schedule::call(function () {
//     // get the current date and time
//     //
//     // get the resident users per barangay
//     $day = Carbon::now('Asia/Manila')->subDay()->format('l');
//     $schedules = PickUpSchedule::all();
//     foreach ($schedules as $sched){
//         if ($sched->day_of_the_week !== $day) {
//             continue;
//         }

//         $residencies = Barangay::find($sched->barangay_id)->residents;

//         foreach ($residencies as $resident) {
//             User::find($resident->user_id)->notify(
//                 new Alert(
//                     'Garbage Collection in Your Area Soon!',
//                     'Garbage trucks are scheduled at ' . $sched->day_of_the_week . ' ' . $sched->time . '. Prepare your garbage for a cleaner world!',
//                     ['Garback Pick Up', 'Prepare']
//                 )
//             );
//         }
//     }
// })
//     ->timezone('Asia/Manila')
//     ->everyMinute();

// create bin statuses per week
Schedule::call(function () {
    // get all bins
    $dropsites = DropSite::all();
    // create a status per dropsite
    foreach ($dropsites as $dropsite) {
        BinStatus::updateOrCreate([
            'bin_id' => $dropsite->id,
            'week_number' => now()->weekOfYear,
            'year' => now()->year,
        ], []);
    }
})
    ->timezone('Asia/Manila')
    ->weekly();
