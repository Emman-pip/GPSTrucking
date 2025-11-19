<?php

namespace App\Http\Controllers;

use App\Filament\Resources\Users\Tables\UsersTable;
use App\Notifications\Message;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        $readNotifications = $user->notifications()
            ->where('type', 'App\Notifications\Message')
            // ->whereJsonContains('data->sender_id', (int) $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($notification) {
                return $notification->data['sender_id'];
            })
            ->map(fn($group) => $group->first());

        $notifications = DB::table('notifications')
            ->where('type', 'App\Notifications\Message')
            ->whereJsonContains('data->sender_id', (int) $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($notification) {
                return $notification->notifiable_id;
            })
            ->map(fn($group) => $group->first())
            ->map(function ($group) use ($user) {
                $group->data = json_decode($group->data);
                return $group;
            })
            ->toArray();

        $chatToAdmin = [];
        if ($user->role->name === 'resident') {
            $chatToAdmin = User::all()
                ->where('role_id', 3)
                ->where('isVerified', true)
                ->where('barangayOfficialInfo.barangay_id', $user->barangayOfficialInfo ? $user->barangayOfficialInfo->barangay_id : $user->residency->barangay_id);
        }

        // dd($notifications);


        foreach ($notifications as $notifKey =>  $notif) {
            $to = User::find($notif->notifiable_id);
            $notif->data->sender_id = $to->id;
            $notif->data->sender_name = $to->name;
            $notif->data->real_sender_name = Auth::user()->name;
            $notifications[$notifKey] = $notif;
        }


        // dd($readNotifications[5]);
        foreach ($notifications as $notifKey => $notif){
            $notif->created_at = new DateTime($notif->created_at);
            foreach ($readNotifications as $key => $read) {
                // $read = json_decode(json_encode($read));
                $readNotifications[$key] = $read;
                // $read->created_at = new DateTime($read->created_at);
                // dd($read->data->sender_id);
                // join the notifications on the same channel
                // same channel means that
                // notifiable_id of one === sender_id of one
                // if ($read->created_at < $notif->created_at
                //     && ($notif->data->sender_id === $read->notifiable_id)
                if ($read->created_at < $notif->created_at
                    && ($notif->data->sender_id === $read->data['sender_id'])
                ) {
                    // $notif->data->real_sender_name = $notif->data->sender_name;
                    $notif->data->sender_name = $read->data['sender_name'];
                    $notif->data->sender_id = $read->data['sender_id'];
                    // dd($notif);
                    $readNotifications[$key] = $notif;
                    unset($notifications[$notifKey]);
                }
            }
        }
        $notifications = [...$notifications];

        $readNotifications = [...$readNotifications, ...$notifications ];
        usort($readNotifications, function ($a, $b) {
            return strtotime($b->created_at->format('Y-m-d H:i:s')) - strtotime($a->created_at->format('Y-m-d H:i:s'));
        });
        return Inertia::render('barangay/chat', ['unread' => [...$unreadNotifications], 'read' => [...$readNotifications], 'chatToAdmin' => [...$chatToAdmin]]);
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
