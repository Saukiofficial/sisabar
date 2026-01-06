<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AbsensiMurid extends Model
{
    protected $guarded = [];
    public function siswa() { return $this->belongsTo(Siswa::class); }
    public function guru() { return $this->belongsTo(Guru::class); }
    public function kelas() { return $this->belongsTo(Kelas::class); }
}
