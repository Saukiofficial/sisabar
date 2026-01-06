<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HasilUjian extends Model
{
    // Melindungi field id agar tidak bisa diisi massal
    protected $guarded = ['id'];

    // Relasi ke tabel 'ujians' (Satu hasil ujian milik satu ujian)
    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }

    // Relasi ke tabel 'siswas' (Satu hasil ujian milik satu siswa)
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    // Relasi ke tabel 'jawaban_siswas' (Satu hasil ujian punya banyak jawaban)
    public function jawabans()
    {
        return $this->hasMany(JawabanSiswa::class);
    }
}
