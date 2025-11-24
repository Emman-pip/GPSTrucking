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
        $user = Auth::user();
        $barangay_id = $user->barangayOfficialInfo ? $user->barangayOfficialInfo->barangay_id : $user->residency->barangay_id;
        return response()->json(Route::where('barangay_id', $barangay_id)->with('schedule')->get());
    }

    public function getForDriver($id){
        return response()->json(Route::where('barangay_id', $id)->with('schedule')->get());
    }

    public function update(Request $request) {
        $validated = $request->validate([
            'sched_id' => ['required', 'exists:pick_up_schedules,id'],
            'day_of_the_week' => ['required', 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'],
            'time' => ['required', 'date_format:H:i'],
        ]);
        try {
            $schedule = PickUpSchedule::find($validated['sched_id']);
            $schedule->day_of_the_week = $validated['day_of_the_week'];
            $schedule->time = $validated['time'];
            $schedule->save();
        } catch (Exception $e) {
        }
    }

    public function delete($id) {
        $id = Route::find($id);
        $ps = PickUpSchedule::find($id->pickup_id);
        $id->delete();
        $ps->delete();
    }
}
