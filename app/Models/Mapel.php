<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mapel extends Model
{
    protected $guarded = [];

    public function gurus()
    {
        return $this->hasMany(Guru::class);
    }
}
