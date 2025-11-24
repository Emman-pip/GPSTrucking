<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
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
        $barangay = Barangay::find($request->barangay_id);
        $barangay->coordinates = json_decode($barangay->coordinates);
        $user = ['name' => $request->name, 'truckID' => $request->truckID, 'residency' => ['barangay_id' => $barangay->id], 'barangay_official_info' => []];
        return Inertia::render('driver/driversAndTrucks', ['barangay' => $barangay, 'user' => $user]);
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

    public function update(Request $request) {
        $validated = $request->validate([
            'name' => ['string'],
            'truckID' => ['required'],
            'id' => ['required']
        ]);

        $truck = TruckAndDriver::find($validated['id']);
        unset($validated['id']);

        $truck->update($validated);
    }

    public function delete(Request $request, $id) {
        TruckAndDriver::destroy($id);
    }
}
