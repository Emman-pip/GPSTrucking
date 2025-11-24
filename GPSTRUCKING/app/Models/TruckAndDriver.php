<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TruckAndDriver extends Model
{
    protected $fillable = [
        'barangay_id',
        'name',
        'truckID',
    ];

    public function barangay() {
        return $this->belongsTo(Barangay::class);
    }
}
