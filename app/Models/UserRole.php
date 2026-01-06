<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Super Admin'],
            ['name' => 'Kepala Sekolah'],
            ['name' => 'Guru'],
            ['name' => 'Siswa'], // Tambahkan Role Siswa
        ];

        foreach ($roles as $role) {
            // firstOrCreate agar tidak duplikat saat di-seed ulang
            Role::firstOrCreate(['name' => $role['name']]);
        }
    }
}
