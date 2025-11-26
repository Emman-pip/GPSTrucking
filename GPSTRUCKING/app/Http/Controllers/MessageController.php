<?php

namespace App\Http\Controllers;

use App\Filament\Resources\Users\Tables\UsersTable;
use App\Notifications\Message;
use App\Models\User;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use function PHPSTORM_META\map;

class MessageController extends Controller
{
    public function view() {
        $user = Auth::user();

        $chatToAdmin = [];
        $notifications = [];
        if ($user->role->name === 'resident') {
            $chatToAdmin = User::all()
                ->where('role_id', 3)
                ->where('isVerified', true)
                ->where('barangayOfficialInfo.barangay_id', $user->barangayOfficialInfo ? $user->barangayOfficialInfo->barangay_id : $user->residency->barangay_id);
            foreach ($chatToAdmin as $admin) {
                $id = $admin->id;
                try {
                $tmp = $user
                        ->notifications()
                        ->where('type', 'App\Notifications\Message')
                        ->whereJsonContains('data->sender_id', (int) $id)
                        ->orWhere(function ($q) use ($id) {
                            $q->where('notifiable_id', $id)
                                ->where('data->sender_id', Auth::user()->id);
                        })
                        ->get()
                        ->firstOrFail()->toArray();

                if ($tmp['data']['sender_name'] === $user->name) {
                    $tmp['data']['real_sender_name'] = $tmp['data']['sender_name'];
                    $tmp['data']['sender_id'] = $tmp['notifiable_id'];
                    $sender = User::find($tmp['notifiable_id']);
                    $tmp['data']['sender_name'] = $sender->name;
                }
                array_push($notifications, $tmp);
                } catch (Exception $e) {continue;}
            }
        } else {
            $residents = User::all()
                ->where('role_id', 2)
                ->where('residency.barangay_id', $user->barangayOfficialInfo->barangay_id);

            foreach ($residents as $resident) {
                $id = $resident->id;
                try {
                $tmp = $user
                    ->notifications()
                    ->where('type', 'App\Notifications\Message')
                    ->whereJsonContains('data->sender_id', (int) $id)
                    ->orWhere(function ($q) use ($id) {
                        $q->where('notifiable_id', $id)
                            ->where('data->sender_id', Auth::user()->id);
                    })
                    ->get()
                    ->firstOrFail()->toArray();

                if ($tmp['data']['sender_name'] === $user->name) {
                    $tmp['data']['real_sender_name'] = $tmp['data']['sender_name'];
                    $tmp['data']['sender_id'] = $tmp['notifiable_id'];
                    $sender = User::find($tmp['notifiable_id']);
                    $tmp['data']['sender_name'] = $sender->name;
                }
                array_push($notifications, $tmp);
                } catch (Exception $e) {continue;}
            }
        }

        usort($notifications, function ($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });
        return Inertia::render('barangay/chat', ['unread' => [], 'read' => [...$notifications], 'chatToAdmin' => [...$chatToAdmin]]);
    }

    public function viewSingle($id){
        $user = Auth::user();

        $user->unreadNotifications()
            ->where('type', 'App\Notifications\Message')
            ->whereJsonContains('data->sender_id', (int) $id)
            ->where('notifiable_id', $user->id)
            ->update(['read_at' => now()]);

        // dd($user->unreadNotifications()
        //     ->get());
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
