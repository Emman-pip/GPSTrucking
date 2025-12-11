<?php

namespace App\Http\Controllers;

use App\Models\DropSiteReport;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

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
/**
     * Display a paginated list of drop site reports with optional filters.
     */
    public function index(Request $request)
    {
        // Validate the filter params lightly
        $validated = $request->validate([
            'status' => ['nullable', Rule::in(['pending','in_review','resolved','rejected'])],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
            'page' => ['nullable', 'integer'],
        ]);

        $query = DropSiteReport::query()
            ->with([
                'user:id,name,email',
                // load a few useful fields from dropSite
                'dropSite:id,bin_name'// ,latitude,longitude'
            ])
            // select only necessary fields on main model
            ->select(['id','drop_site_id','user_id','status','description','created_at']);

        if ($validated['status'] ?? null) {
            $query->where('status', $validated['status']);
        }

        if (!empty($validated['from']) && !empty($validated['to'])) {
            // ensure 'to' includes the whole day
            $from = Carbon::parse($validated['from'])->startOfDay();
            $to = Carbon::parse($validated['to'])->endOfDay();
            $query->whereBetween('created_at', [$from, $to]);
        } elseif (!empty($validated['from'])) {
            $from = Carbon::parse($validated['from'])->startOfDay();
            $query->where('created_at', '>=', $from);
        } elseif (!empty($validated['to'])) {
            $to = Carbon::parse($validated['to'])->endOfDay();
            $query->where('created_at', '<=', $to);
        }

        $reports = $query->orderByDesc('created_at')->paginate(10)->withQueryString();

        // Return only fields that the frontend needs.
        // Inertia will serialize the paginator with data, meta, links.
        return Inertia::render('Admin/DropSiteReports/Index', [
            'reports' => $reports,
            'filters' => [
                'status' => $validated['status'] ?? null,
                'from' => $validated['from'] ?? null,
                'to' => $validated['to'] ?? null,
            ],
        ]);
    }

    /**
     * Show a specific report
     */
    public function show(DropSiteReport $report)
    {
        $report->load([
            'user:id,name,email',
            'dropSite:id,bin_name' //,latitude,longitude'
        ]);

        // Return minimal nested objects
        return Inertia::render('Admin/DropSiteReports/Show', [
            'report' => $report,
        ]);
    }

    /**
     * Update report status
     */
    public function updateStatus(Request $request, DropSiteReport $report)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending','in_review','resolved','rejected'])],
        ]);

        $report->status = $validated['status'];
        $report->save();

        // Optionally flash a message
        return back()->with('success', 'Report status updated.');
    }
}
