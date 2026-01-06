<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    protected $guarded = [];

    // Ambil data user (nama, email, username)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }
}
