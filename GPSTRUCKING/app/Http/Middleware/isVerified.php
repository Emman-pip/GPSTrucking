<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class isVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        $role = $user->role->name;

        if (!$user->isVerified && $role === 'barangay') {
            return redirect()->route('barangay.dashboard');
        }
        // else if (!$user->isVerified && $role === 'resident') {
        //     return redirect()->route('resident.dashboard');
        // }

        return $next($request);
    }
}
