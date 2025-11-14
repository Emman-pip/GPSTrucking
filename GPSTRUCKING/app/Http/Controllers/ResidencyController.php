<?php

namespace App\Http\Controllers;

use App\Models\Residency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResidencyController extends Controller
{
    public function form(){
        return Inertia::render('resident/profileForm');
    }

    public function submit(Request $request){
        $validated = $request->validate([
            'barangay_id'
        ]);
        $validated['user_id'] = Auth::user()->id;
        Residency::create($validated);
    }
}
