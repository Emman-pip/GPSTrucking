<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\BarangayOfficialInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BarangayController extends Controller
{
    public function displayProfileForm() {
        $user = Auth::user();
        if ($user->barangayOfficialInfo) {
            return redirect()->route('barangay.dashboard');
        }
        $barangays = Barangay::all()->select(['id', 'name']);
        return Inertia::render('barangay/profileForm', ['barangays' => $barangays]);
    }

    public function submitProfileForm(Request $request) {
        $user = Auth::user();
        if ($user->barangayOfficialInfo) {
            return redirect()->route('barangay.dashboard');
        }

        $validated = $request->validate([
            'barangay_official_id' => ['required', 'mimes:jpg,png,pdf'],
            'proof_of_identity' => ['required', 'file', 'mimes:jpg,png,pdf,jpeg'],
            'contact_number' => [ 'required', 'digits:11' ],
            'email' => [ 'required', 'email', 'unique:barangay_official_information,email' ],
            'barangay_id' => ['required', 'exists:barangays,id'],
        ]);
        $path_identity = $request->file('proof_of_identity')->store("media/barangay/{$user->id}/proofs", 'public');
        $path_valid_id = $request->file('barangay_official_id')->store("media/barangay/{$user->id}/ID", 'public');

        // dd($path_valid_id, $path_identity, $validated);
        $user->barangayOfficialInfo()->create([
            'barangay_official_id' => $path_valid_id,
            'proof_of_identity' => $path_identity,
            'contact_number' => $validated['contact_number'],
            'email' => $validated['email'],
            'barangay_id' => $validated['barangay_id'],
        ]);

        return redirect()->route('barangay.dashboard');
        // $barangays = Barangay::all()->select(['id', 'name']);
        // return Inertia::render('barangay/profileForm', ['barangays' => $barangays]);
    }
}
