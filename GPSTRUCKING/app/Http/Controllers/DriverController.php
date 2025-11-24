<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class DriverController extends Controller
{
    // add name, truck ID, capacity
    public function generate(Request $request) {
        return URL::temporarySignedRoute(
            'driver',
            now()->addMinutes(30),
            [
                'barangay_id' => Auth::user()->barangayOfficialInfo->barangay_id,
                'name' => $request->name,
                'truckID' => $request->truckID
            ]
        );
    }

    public function index(Request $request){
        return response($request->message);
    }

    public function barangayView() {
        return Inertia::render('barangay/drivers');
    }
}
