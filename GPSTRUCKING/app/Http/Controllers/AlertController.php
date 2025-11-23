<?php

namespace App\Http\Controllers;

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
}
