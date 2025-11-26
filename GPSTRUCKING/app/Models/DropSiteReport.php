<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class DropSiteReport extends Model
{
    protected $table = 'drop_site_reports';

    protected $fillable = [
        'drop_site_id',
        'user_id',
        'description',
        'status',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    protected static function booted()
    {
        // Automatically assign UUID to primary key
        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function dropSite()
    {
        return $this->belongsTo(DropSite::class, 'drop_site_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
