<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TruckLocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $truckID;
    public $name;
    public $barangay_id;
    public $lng;
    public $lat;


    /**
     * Create a new event instance.
     */
    public function __construct($truckID, $name, $barangay_id, $lng, $lat)
    {
        $this->truckID = $truckID;
        $this->name = $name;
        $this->barangay_id = $barangay_id;
        $this->lng = $lng;
        $this->lat = $lat;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new Channel('barangay.' . $this->barangay_id);
    }
    public function broadcastAs()
    {
        return "gps.updated";
    }
}
