<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;

class ChartController extends Controller
{
    public function residentsTrend($barangay_id) {
        // get the time where resident accounts got created
        $residents = User::all()
            ->where('residency.barangay_id', $barangay_id)
            ->groupBy(function ($group) {
                return new DateTime($group->created_at)->format('Y-m-d');
            })
            ->map(function ($group) {
                $date = new DateTime($group[0]?->created_at)->format('Y-m-d');
                $tmp = [];
                $tmp['date'] = $date;
                $tmp['count'] = count($group);
                return $tmp;
            });
        // ->toArray();


        $start = Carbon::today()->subDays(90);
        $end   = Carbon::today();

        $period = new \DatePeriod(
            new \DateTime($start->toDateString()),
            new \DateInterval('P1D'),
            (new \DateTime($end->toDateString()))->modify('+1 day') // inclusive
        );

        // Step 3: Fill missing dates
        $filled = collect();

        foreach ($period as $date) {
            $d = $date->format('Y-m-d');

            $filled->push([
                'date'  => $d,
                'count' => $residents->get($d)['count'] ?? 0,
            ]);
        }
        return response()->json($filled);
        // dd(array_values($residents));
        // filter to get the residents in X barangay
        // $residentsOfBarangayX = [];
        // foreach($residents as $resident) {
        //     // if not a resident --- continue loop
        //     if (!$resident?->residency)
        //         continue;
        //     if ($resident->residency->barangay_id === (int) $barangay_id) {
        //         $tmp = [];
        //         array_push($residentsOfBarangayX, $resident);
        //     }

        // fill the missing dates (IDK HOW)
        // return $residentsOfBarangayX;
    }
}
