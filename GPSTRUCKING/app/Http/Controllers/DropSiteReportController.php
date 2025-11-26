<?php

namespace App\Http\Controllers;

use App\Models\DropSiteReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DropSiteReportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'drop_site_id' => 'required|integer|exists:drop_sites,id',
            'description'  => 'required|string|max:5000',
        ]);

        DropSiteReport::create([
            'drop_site_id' => $validated['drop_site_id'],
            'user_id'      => auth()->id(),
            'description'  => $validated['description'],
        ]);

        return back()->with('success', 'Report submitted successfully.');
    }
}
