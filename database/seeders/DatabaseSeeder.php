<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Guru;
use App\Models\Siswa; // Import Model Siswa
use App\Models\Kelas; // Import Model Kelas
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Jalankan RoleSeeder dulu (PENTING)
        $this->call(RoleSeeder::class);

        // ---------------------------------------------------------
        // 2. BUAT AKUN SUPER ADMIN
        // ---------------------------------------------------------
        $admin = User::create([
            'name' => 'Administrator',
            'username' => 'admin',
            'email' => 'admin@sekolah.id',
            'password' => Hash::make('password123'),
        ]);

        $roleAdmin = Role::where('name', 'Super Admin')->first();
        $admin->roles()->attach($roleAdmin);


        // ---------------------------------------------------------
        // 3. BUAT DATA KELAS (DUMMY)
        // ---------------------------------------------------------
        // Kita butuh kelas untuk assign guru (wali kelas) atau siswa
        $kelas = Kelas::create([
            'nama_kelas' => 'X RPL 1',
        ]);


        // ---------------------------------------------------------
        // 4. BUAT AKUN GURU (DUMMY)
        // ---------------------------------------------------------
        $guruUser = User::create([
            'name' => 'Pak Fhadol, S.Pd',
            'username' => 'guru_fhadol',
            'email' => 'fhadol@sekolah.id',
            'password' => Hash::make('password123'),
        ]);

        $roleGuru = Role::where('name', 'Guru')->first();
        $guruUser->roles()->attach($roleGuru);

        Guru::create([
            'user_id' => $guruUser->id,
            'kelas_id' => $kelas->id, // Jadikan Wali Kelas X RPL 1
            'status_aktif' => true,
        ]);


        // ---------------------------------------------------------
        // 5. BUAT AKUN KEPALA SEKOLAH
        // ---------------------------------------------------------
        $kepsek = User::create([
            'name' => 'Dr. Kepala Sekolah, M.Pd',
            'username' => 'kepsek',
            'email' => 'kepsek@sekolah.id',
            'password' => Hash::make('password123'),
        ]);

        $roleKepsek = Role::where('name', 'Kepala Sekolah')->first();
        $kepsek->roles()->attach($roleKepsek);


        // ---------------------------------------------------------
        // 6. BUAT AKUN SISWA (SAUKI ANNAIM)
        // ---------------------------------------------------------
        $siswaUser = User::create([
            'name' => 'Sauki Annaim',
            'username' => '12345678', // Gunakan NIS sebagai username
            'email' => 'sauki@sekolah.id',
            'password' => Hash::make('password123'),
        ]);

        $roleSiswa = Role::where('name', 'Siswa')->first();
        $siswaUser->roles()->attach($roleSiswa);

        Siswa::create([
            'user_id' => $siswaUser->id,
            'kelas_id' => $kelas->id, // Masuk ke kelas X RPL 1
            'nama' => 'Sauki Annaim',
            'nis' => '12345678',
            'jenis_kelamin' => 'L',
        ]);
    }
}
