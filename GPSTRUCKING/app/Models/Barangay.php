<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    public function residency(){
        return $this->belongsTo(Residency::class);
    }
}
