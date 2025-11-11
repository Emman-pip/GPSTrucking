<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\DropSite;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DropSiteController extends Controller
{
    public function post(Request $request)
    {
        $validated = $request->validate([
            'coordinates' => ['required', 'array'],
            'image' => ['file', 'mimes:jpg,png'],
            'description' => ['required'],
        ]);
        $barangay_id = Auth::user()->barangayOfficialInfo->barangay_id;
        $validated[ 'barangay_id' ] = $barangay_id;
        $validated[ 'coordinates' ] = json_encode($validated[ 'coordinates' ]);
        $path = $request->file('image')->store("dropsites/{$barangay_id}", 'public');
        $validated['image'] = $path;
        DropSite::create($validated);
    }

    public function dropSites(Request $request) {
        $barangay_id = $request['barangay_id'];
        return response()->json(DropSite::where('barangay_id', $barangay_id)->get());
    }
}
