<?php

namespace App\Http\Controllers;

use App\Models\BinStatus;
use Illuminate\Http\Request;

class BinStatusController extends Controller
{
    public function update(Request $request) {
        $validated = $request->validate([
            'status' => ['required', 'in:collected,uncollected,pending,missed'],
            'bin_id' => ['required', 'exists:drop_sites,id'],
        ]);
        $validated['week_number'] = now()->weekOfYear;
        $validated['year'] = now()->year;
        // change the table default value of week_number -> none nalang
        // change the default value of year -> none nalang
        BinStatus::updateOrCreate(
            [
                'bin_id' => $request->bin_id,
                'week_number' => $validated['week_number'],
                'year' => $validated['year'],
            ],
            [
                'status' => $request->status
            ]
        );
    }
}
