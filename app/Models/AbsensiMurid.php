<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsensiMurid extends Model
{
    protected $guarded = [];

    // [PENTING] Relasi ke User (Akun Login)
    // Diperlukan agar $absensi->user->name bisa diakses di Controller/View
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Data Detail Siswa (NIS, Jurusan, dll)
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    // Relasi ke Guru (jika absen dilakukan di kelas oleh guru)
    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    // Relasi ke Kelas (agar bisa difilter per kelas)
    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }
}
