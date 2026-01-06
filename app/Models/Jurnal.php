<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jurnal extends Model
{
    protected $guarded = [];

    // Relasi
    public function guru() { return $this->belongsTo(Guru::class); }
    public function kelas() { return $this->belongsTo(Kelas::class); }
    public function mapel() { return $this->belongsTo(Mapel::class); }
}
