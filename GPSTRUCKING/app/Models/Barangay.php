<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    protected $fillable = [
        'name',
        'coordinates'
    ];

    public function residents(){
        return $this->hasMany(Residency::class, 'barangay_id');
    }

    public function barangayResidency(){
        return $this->hasMany(BarangayOfficialInformation::class, 'barangay_id');
    }

    public function TrucksAndDrivers() {
        return $this->hasMany(TruckAndDriver::class, 'barangay_id');
    }

    public function dropSites(){
        return $this->hasMany(DropSite::class);
    }

    public function routes(){
        return $this->hasMany(Route::class);
    }
}
