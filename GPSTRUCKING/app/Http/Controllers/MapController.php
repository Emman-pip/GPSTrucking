<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MapController extends Controller
{
    public function map() {
        $barangay = Auth::user()->barangayOfficialInfo->barangay;
        $barangay['coordinates'] = json_decode($barangay['coordinates']);
        return Inertia::render('barangay/customizeMap', [
            'barangayData' => $barangay
        ]);
    }

}
