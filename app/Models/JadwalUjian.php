<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalUjian extends Model
{
    protected $guarded = [];

    // Relasi
    public function ujian() { return $this->belongsTo(Ujian::class); } // Paket Soal
    public function kelas() { return $this->belongsTo(Kelas::class); }
    public function guru()  { return $this->belongsTo(Guru::class); }
}
