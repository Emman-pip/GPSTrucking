<?php

namespace App\Http\Controllers;

use App\Models\PickUpSchedule;
use App\Models\Route;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RouteController extends Controller
{
    public function create(Request $request){
        // TODO LOAD THE NEW ROUTES (PER BARANGAY) IN THE MAP
        // TODO currently connecting the frontend form of routes to the backend
        // TODO the pickup schedule will be created first, then the route!!!
        $validated = $request->validate([
            'day_of_the_week' => ['required', 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'],
            'time' => ['required', 'date_format:H:i'],
            'coordinates' => ['required', 'array'],
        ]);
        $user = Auth::user();
        $barangay_id = $user->barangayOfficialInfo->barangay_id;
        $validated['barangay_id'] = $barangay_id;
        $validated['coordinates'] = json_encode($validated['coordinates']);
        DB::beginTransaction();
        try {
            $schedule = PickUpSchedule::create($validated);
            $validated['pickup_id'] = $schedule->id;
            Route::create($validated);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
        }
    }

    public function get(){
        $barangay_id = Auth::user()->barangayOfficialInfo->barangay_id;
        return response()->json(Route::where('barangay_id', $barangay_id)->with('schedule')->get());
    }
}
