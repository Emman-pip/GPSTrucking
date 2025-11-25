<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DropSite extends Model
{
    protected $fillable = [
        'bin_name',
        'coordinates',
        'image',
        'description',
        'barangay_id'
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }

    public function status(){
        return $this->hasMany(BinStatus::class, 'bin_id');
    }
}
