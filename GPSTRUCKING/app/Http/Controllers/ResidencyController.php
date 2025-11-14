<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\Residency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResidencyController extends Controller
{
    public function form(){
        if (Auth::user()->residency) return redirect()->route('resident.dashboard');
        return Inertia::render('resident/profileForm', [ 'barangays' => Barangay::all()->select(['name', 'id']) ]);
    }

    public function submit(Request $request){
        if (Auth::user()->residency) return redirect()->route('resident.dashboard');
        $validated = $request->validate([
            'barangay_id' => ['required']
        ]);
        $validated['user_id'] = Auth::user()->id;
        Residency::create($validated);
        return redirect()->route('resident.dashboard');
    }
}
