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

    // --- RELASI & HELPER (YANG MENYEBABKAN ERROR JIKA HILANG) ---

    // Relasi: User memiliki banyak Role
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    // Helper untuk cek role user
    public function hasRole($roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }
}
