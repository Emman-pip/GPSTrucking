<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function map() {
        return Inertia::render('barangay/customizeMap');
    }

}
