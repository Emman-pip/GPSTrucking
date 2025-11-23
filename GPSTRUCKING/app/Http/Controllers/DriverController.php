<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class DriverController extends Controller
{
    public function generate() {
        return URL::temporarySignedRoute(
            'driver',
            now()->addMinutes(30),
            [
                'barangay_id' => 'hi world',
                'token' => 'ewandin',
            ]
        );
    }

    public function index(Request $request){
        return response($request->message);
    }

    public function barangayView() {
        return response('hi world');
    }
}
