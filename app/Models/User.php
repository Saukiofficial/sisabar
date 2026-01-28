<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'avatar', // Tambahkan ini jika pakai fitur upload foto profil
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- RELASI UTAMA (WAJIB ADA) ---

    // 1. Relasi ke Role (Many-to-Many)
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    // Helper untuk cek role user
    public function hasRole($roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    // 2. Relasi ke Data Siswa (One-to-One)
    // Jika user ini adalah siswa, dia punya 1 data di tabel siswas
    public function siswa()
    {
        return $this->hasOne(Siswa::class);
    }

    // 3. Relasi ke Data Guru (One-to-One)
    // Jika user ini adalah guru, dia punya 1 data di tabel gurus
    public function guru()
    {
        return $this->hasOne(Guru::class);
    }
}
