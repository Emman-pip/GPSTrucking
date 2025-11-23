<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\PickUpSchedule;
use App\Models\User;
use App\Notifications\Alert;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AlertController extends Controller
{
    public function view() {
        $alerts = Auth::user()->notifications()
           ->where('type', 'App\Notifications\Alert')
           ->get();
        return Inertia::render('resident/alerts', ['alerts' => $alerts]);
    }

    public function markRead() {
        $user = Auth::user();
        $user->unreadNotifications()
            ->where('type', 'App\Notifications\Alert')
            ->update(['read_at' => now()]);
    }

    public function makeAlerts() {
        $alerts = Auth::user()->notifications()
            ->where('type', 'App\Notifications\Alert')
            ->get();
        return Inertia::render('barangay/alert', ['alerts' => $alerts]);
    }

    public function postAlerts(Request $request) {
        $validated = $request->validate([
            'title' => ['required'],
            'message' => ['required'],
            'tags' => ['required'],
        ]);

        $day = Carbon::now('Asia/Manila')->format('l');
        $time = Carbon::now('Asia/Manila')->format('H:i');

        $barangay_id = Auth::user()->barangayOfficialInfo->barangay_id;

        $residencies = Barangay::find($barangay_id)->residents;

        foreach ($residencies as $resident) {
            User::find($resident->user_id)->notify(
                new Alert(
                    $validated['title'],
                    $validated['message'],
                    $validated['tags']
                )
            );
        }
    }
}
