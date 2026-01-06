<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UjianSoal extends Model
{
    protected $guarded = [];

    public function ujian() { return $this->belongsTo(Ujian::class); }
}
