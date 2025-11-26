<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BinStatus extends Model
{
    protected $fillable = [
        'status',
        'bin_id',
        'week_numer',
        'year',
    ];


    public function bin(){
        return $this->belongsTo(DropSite::class);
    }
}
