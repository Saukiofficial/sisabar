<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    // Izinkan semua kolom diisi (mass assignment)
    protected $guarded = [];

    // Relasi: Absensi milik satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
