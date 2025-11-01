<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DropSite extends Model
{
    protected $fillable = [
        'coordinates',
        'image',
        'description',
        'barangay_id'
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}
