<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    public function to(){
        return $this->belongsTo(User::class, 'to');
    }

    public function from(){
        return $this->belongsTo(User::class, 'from');
    }
}
