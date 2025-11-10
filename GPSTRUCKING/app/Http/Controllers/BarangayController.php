<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\BarangayOfficialInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BarangayController extends Controller
{
    // barangay stuff here
    public function dashboard() {
        return Inertia::render('barangay/dashboard');
    }

    public function chat() {
        return response('chats');
    }
}
