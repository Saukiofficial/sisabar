<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    protected $guarded = [];

    // Relasi: Satu kelas bisa punya banyak siswa (nanti) atau satu wali kelas
    public function guru()
    {
        return $this->hasOne(Guru::class);
    }
}
