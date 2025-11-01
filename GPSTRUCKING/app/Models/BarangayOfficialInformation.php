<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangayOfficialInformation extends Model
{
    protected $fillable = [
        'barangay_id',
        'proof_of_identity',
        'contact_number',
        'email',
        'user_id',
    ];


    public function user(){
        return $this->belongsTo(User::class);
    }
}
