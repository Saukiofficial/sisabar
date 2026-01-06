<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JawabanSiswa extends Model
{
    // Melindungi field id agar tidak bisa diisi massal
    protected $guarded = ['id'];

    // Relasi ke tabel 'hasil_ujians' (Jawaban ini bagian dari hasil ujian mana?)
    public function hasilUjian()
    {
        return $this->belongsTo(HasilUjian::class);
    }

    // Relasi ke tabel 'ujian_soals' (Jawaban ini untuk soal nomor berapa?)
    public function soal()
    {
        // Perhatikan nama foreign key jika tidak standar, misal 'ujian_soal_id'
        return $this->belongsTo(UjianSoal::class, 'ujian_soal_id');
    }
}
