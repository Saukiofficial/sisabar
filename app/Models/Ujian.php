<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ujian extends Model
{
    protected $guarded = [];

    // Relasi
    public function guru() { return $this->belongsTo(Guru::class); }
    public function mapel() { return $this->belongsTo(Mapel::class); }
    public function kelas() { return $this->belongsTo(Kelas::class); }

    // Relasi ke butir soal
    public function soals() { return $this->hasMany(UjianSoal::class); }
}
