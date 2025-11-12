<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    protected $fillable = [
        'barangay_id',
        'coordinates',
        'pickup_id'
    ];

    public function barangay() {
        return $this->belongsTo(Barangay::class);
    }

    public function schedule() {
        return $this->hasOne(PickUpSchedule::class, "id");
    }
}
