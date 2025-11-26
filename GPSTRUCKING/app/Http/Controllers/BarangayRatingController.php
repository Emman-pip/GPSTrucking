<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\BarangayRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class BarangayRatingController extends Controller
{
    public function __construct()
    {

    }

    // Admin / aggregated view
    public function index(Request $request)
    {
        $barangays = Barangay::withCount(['ratings as avg_rating' => function($query){
            $query->select(\DB::raw('COALESCE(AVG(rating),0)'));
        }, 'ratings as total_ratings'])->get();

        return Inertia::render('BarangayRatings/Index', [
            'barangays' => $barangays,
        ]);
    }

    // Resident submit rating
    public function store(Request $request)
    {
        $validated = $request->validate([
            'barangay_id' => 'required|exists:barangays,id',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $user_id = Auth::id();
        $week_start = Carbon::now()->startOfWeek()->toDateString();

        $existing = BarangayRating::where([
            ['user_id', $user_id],
            ['barangay_id', $validated['barangay_id']],
            ['week_start', $week_start]
        ])->first();

        if ($existing) {
            return back()->with('error', 'You have already submitted a rating this week.');
        }

        BarangayRating::create([
            'user_id' => $user_id,
            'barangay_id' => $validated['barangay_id'],
            'rating' => $validated['rating'],
            'week_start' => $week_start,
        ]);

        return back()->with('success', 'Rating submitted successfully!');
    }
}
