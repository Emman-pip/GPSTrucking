<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\DropSite;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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

    public function updateDescription(Request $request) {
        $validated = $request->validate([
            'description' => ['required' ],
            'id' => ['required', 'exists:drop_sites,id']
        ]);

        DropSite::find($validated['id'])->update([ 'description' => $validated['description'] ]);
    }


    public function updateImage(Request $request) {
        $validated = $request->validate([
            'id' => ['required', 'exists:drop_sites,id'],
            'image' => ['required', 'file', 'mimes:jpg,png' ],
        ]);
        $dropsite = DropSite::find($validated['id']);
        Storage::disk('public')->delete($dropsite->image);
        $path = $request->file('image')->store("dropsites/{$dropsite->barangay_id}", 'public');
        DropSite::find($validated['id'])->update([ 'image' => $path ]);
    }

    public function updateCoordinates(Request $request) {
        $validated = $request->validate([
            'id' => ['required', 'exists:drop_sites,id'],
            'coordinates' => ['required', 'array'],
            'coordinates.*' => ['required'],
        ]);
        DropSite::find($validated['id'])->update([ 'coordinates' => $validated['coordinates'] ]);
    }
}
