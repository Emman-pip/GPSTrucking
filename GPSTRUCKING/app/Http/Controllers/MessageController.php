<?php

namespace App\Http\Controllers;

use App\Notifications\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function PHPSTORM_META\map;

class MessageController extends Controller
{
    public function view() {
        $user = Auth::user();

        $unreadNotifications = $user->unreadNotifications()
            ->where('type', 'App\Notifications\Message')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function($notification){
            return $notification->data['sender_id'];
        })
            ->map(fn($group) => $group->first())
            ->toArray();

        $readNotifications = $user->readNotifications()
            ->where('type', 'App\Notifications\Message')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function($notification){
            return $notification->data['sender_id'];
        })
            ->map(fn($group) => $group->first())
            ->toArray();
        return Inertia::render('barangay/chat', ['unread' => [...$unreadNotifications], 'read' => [...$readNotifications]]);
    }

    public function viewSingle($id){
        $user = Auth::user();

        $user->unreadNotifications()
            ->whereJsonContains('data->sender_id', (int) $id)
            ->where('notifiable_id', $user->id)
            ->update(['read_at' => now()]);

        $messages = $user
            ->notifications()
            ->where('type', 'App\Notifications\Message')
            ->whereJsonContains('data->sender_id', (int) $id)
            ->orWhere(function ($q) use ($id) {
                $q->where('notifiable_id', $id)
                    ->where('data->sender_id', Auth::user()->id);
            })
            ->get()
            ->reverse();
        $chatMate = User::find($id);
        return  Inertia::render('barangay/singleChat',[
            'chatMate' => $chatMate,
            'messages' => [...$messages]
        ]);
    }

    public function send(Request $request) {
        User::find($request->id)->notify(new Message($request->message));
    }
}
