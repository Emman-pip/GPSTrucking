<?php

namespace App\Http\Controllers;

use App\Models\TruckAndDriver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class DriverController extends Controller
{
    // add name, truck ID, capacity
    public function generate(Request $request) {
        // dd($request->hours);
        return URL::temporarySignedRoute(
            'driver',
            now()->addHours((int)$request->hours),
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
        $truckData =  TruckAndDriver::all()->where('barangay_id', Auth::user()->barangayOfficialInfo->barangay_id);
        return Inertia::render('barangay/drivers', ['truckData' => $truckData]);
    }

    public function create(Request $request) {
        $validated = $request->validate([
            'name' => ['string'],
            'truckID' => ['required'],
        ]);

        $validated['barangay_id'] = Auth::user()->barangayOfficialInfo->barangay_id;
        TruckAndDriver::create($validated);
    }
}
