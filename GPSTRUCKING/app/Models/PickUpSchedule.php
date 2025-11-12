<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PickUpSchedule extends Model
{
    protected $fillable = [
        'day_of_the_week',
        'time',
        'barangay_id'
    ];

    public function barangay() {
        return $this->belongsTo(Barangay::class);
    }

    public function route() {
        return $this->belongsTo(Route::class);
    }
}
