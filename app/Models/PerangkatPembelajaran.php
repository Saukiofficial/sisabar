<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerangkatPembelajaran extends Model
{
    use HasFactory;

    // Izinkan semua kolom diisi (Mass Assignment)
    protected $guarded = [];

    // PENTING: Ubah kolom ini otomatis jadi format Tanggal (Carbon)
    protected $casts = [
        'tanggal_validasi' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // --- RELASI ---

    // 1. Relasi ke Guru (Pemilik File)
    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    // 2. Relasi ke Mata Pelajaran
    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }

    // --- AKSESOR (Helper Tambahan) ---

    // Contoh pemakaian: $perangkat->warna_status
    // Berguna untuk memberi warna badge di frontend (Bootstrap/Tailwind)
    public function getWarnaStatusAttribute()
    {
        return match($this->status) {
            'Menunggu' => 'warning', // Kuning
            'Revisi' => 'danger',    // Merah
            'Valid' => 'success',    // Hijau
            default => 'secondary',  // Abu-abu
        };
    }
}
