<?php

namespace App\Imports;

use App\Models\Siswa;
use App\Models\User;
use App\Models\Role;
use App\Models\Kelas;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Support\Facades\DB;

class SiswaImport implements ToCollection, WithHeadingRow, WithValidation
{
    /**
    * @param Collection $rows
    */
    public function collection(Collection $rows)
    {
        // Ambil role Siswa sekali saja untuk efisiensi
        $roleSiswa = Role::where('name', 'Siswa')->first();

        // Loop setiap baris data Excel
        foreach ($rows as $row) {

            // 1. Cari ID Kelas berdasarkan Nama Kelas (Misal: "X-RPL-1")
            // Jika tidak ketemu, lewati baris ini atau bisa buat kelas baru (opsional)
            $kelas = Kelas::where('nama_kelas', $row['kelas'])->first();

            if (!$kelas) {
                // Opsi: Skip jika kelas tidak valid
                continue;
            }

            // Gunakan Transaction agar data User & Siswa masuk bersamaan
            DB::transaction(function() use ($row, $roleSiswa, $kelas) {

                // A. Buat Akun User
                // Cek dulu apakah user dengan username/NIS ini sudah ada
                if (User::where('username', $row['nis'])->exists()) {
                    return; // Skip jika duplikat
                }

                $user = User::create([
                    'name'     => $row['nama_lengkap'],
                    'username' => $row['nis'], // Username = NIS
                    'email'    => $row['nis'] . '@sekolah.id', // Email dummy default
                    'password' => Hash::make('12345678'), // Password default
                ]);

                // Assign Role
                if ($roleSiswa) {
                    $user->roles()->attach($roleSiswa->id);
                }

                // B. Buat Data Siswa
                Siswa::create([
                    'user_id'       => $user->id,
                    'kelas_id'      => $kelas->id,
                    'nis'           => $row['nis'],
                    'nama'          => $row['nama_lengkap'],
                    'jenis_kelamin' => strtoupper($row['jenis_kelamin']), // L / P
                ]);
            });
        }
    }

    // Validasi Data Excel
    public function rules(): array
    {
        return [
            'nis'           => 'required|unique:siswas,nis',
            'nama_lengkap'  => 'required',
            'kelas'         => 'required',
            'jenis_kelamin' => 'required|in:L,P,l,p',
        ];
    }
}
