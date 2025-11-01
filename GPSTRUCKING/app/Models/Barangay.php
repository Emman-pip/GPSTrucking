<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    public function residency(){
        return $this->belongsTo(Residency::class);
    }

    public function dropSites(){
        return $this->hasMany(DropSite::class);
    }

    public function routes(){
        return $this->hasMany(Route::class);
    }
}
