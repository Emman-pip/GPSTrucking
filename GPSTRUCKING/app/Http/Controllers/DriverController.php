<?php

namespace App\Http\Controllers;

use App\Events\TruckLocationUpdated;
use App\Models\Barangay;
use App\Models\BinStatus;
use App\Models\DropSite;
use App\Models\TruckAndDriver;
use App\Models\User;
use App\Notifications\Alert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
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

    public function postGPS(Request $request){
        $data = $request->validate([
            'truckID' => 'required',
            'name' => 'required',
            'barangay_id' => 'required',
            'lng' => 'required',
            'lat' => 'required',
        ]);
        TruckLocationUpdated::dispatch(
            $data['truckID'],
            $data['name'],
            $data['barangay_id'],
            $data['lng'],
            $data['lat'],
        );
    }


    public function barangayView() {
        $truckData =  TruckAndDriver::all()->where('barangay_id', Auth::user()->barangayOfficialInfo->barangay_id)->toArray();
        return Inertia::render('barangay/drivers', ['truckData' => array_values($truckData)]);
    }

    public function create(Request $request) {
        $validated = $request->validate([
            'name' => ['string'],
            'truckID' => ['required', 'unique:truck_and_drivers,truckID'],
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

    public function  notifyStart($id) {
        // notify all residents and barangay
        $barangayUsers = User::all();
        $arr = [];
        $id = (int)$id;
        foreach ($barangayUsers as $user) {
            if (($user?->barangayOfficialInfo && $user?->barangayOfficialInfo->barangay_id === $id) ||
                ($user?->residency && $user?->residency->barangay_id === $id)
            ) {
                array_push($arr, $user);
            }
        }
        Notification::send($barangayUsers, new Alert('Garbage collection in your barangay has started.',
                                                     'The garbage collection team in your barangay has started collecting. Please ensure you follow the guidelines the barangay has provided you!',
                                                     ['info']
        ));
    }

    public function notifyEnd($id)
    {
        // notify all residents and barangay
        $dropsites = DropSite::where('barangay_id', $id)->get();
        foreach ($dropsites as $dropsite) {
            $tmp = $dropsite?->status?->first();
            if ($tmp?->week_number === now()->weekOfYear && $tmp?->year === now()->year) {
                if ($dropsite?->status->first()->status === 'collected')
                    continue;
            }
            // BinStatus::updateOrCreate(
            //     [
            //         'bin_id' => $dropsite->id,
            //         'week_number' => now()->weekOfYear,
            //         'year' => now()->year,
            //     ],
            //     [
            //         'status' => 'missed'
            //     ]
            // );
        }
        $barangayUsers = User::all();
        $arr = [];
        $id = (int)$id;
        foreach ($barangayUsers as $user) {
            if (($user?->barangayOfficialInfo && $user?->barangayOfficialInfo->barangay_id === $id) ||
                ($user?->residency && $user?->residency->barangay_id === $id)
            ) {
                array_push($arr, $user);
            }
        }
        Notification::send($barangayUsers, new Alert(
            'Garbage collection in your barangay has ended.',
            'The garbage collection team in your barangay has finished collecting!',
            ['info']
        ));
        // update the bins that are uncollected, pending, or does not have a status yet
    }
}
