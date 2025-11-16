<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function view() {
        $user = Auth::user();

        $unreadNotifications = $user->unreadNotifications()
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function($notification){
            return $notification->data['sender_id'];
        })
            ->map(fn($group) => $group->first())
            ->toArray();

        $readNotifications = $user->readNotifications()
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function($notification){
            return $notification->data['sender_id'];
        })
            ->map(fn($group) => $group->first())
            ->toArray();
        return Inertia::render('barangay/chat', ['unread' => $unreadNotifications, 'read' =>$readNotifications]);
    }
}
