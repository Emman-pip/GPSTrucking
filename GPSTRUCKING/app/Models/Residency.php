<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Residency extends Model
{
    protected $fillable = [
        'barangay_id',
        'user_id',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}
