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
        $barangay = Auth::user()->barangayOfficialInfo->barangay;
        $barangay['coordinates'] = json_decode($barangay['coordinates']);
        return Inertia::render('barangay/dashboard', [ 'barangay' => $barangay]);
    }

    public function chat() {
        return response('chats');
    }

    public function map() {
        return response('customize map here');
    }
}
