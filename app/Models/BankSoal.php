<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankSoal extends Model
{
    protected $guarded = [];

    // Relasi
    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }
}
