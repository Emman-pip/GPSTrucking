<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangayOfficialInformation extends Model
{
    protected $fillable = [
        'barangay_id',
        'proof_of_identity',
        'barangay_official_id',
        'contact_number',
        'email',
    ];


    public function user(){
        return $this->belongsTo(User::class);
    }

    public function barangay(){
        return $this->hasOne(Barangay::class, 'id');
    }
}
