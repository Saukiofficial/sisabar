<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Siswa;
use App\Models\Absensi;
use Carbon\Carbon;
use Illuminate\Database\QueryException;

class DashboardController extends Controller
{
    /**
     * Menampilkan Dashboard Utama Siswa
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // [PENTING] Ambil daftar role (array string) agar Sidebar muncul
        // Contoh hasil: ['Siswa']
        $roles = $user->roles->pluck('name');

        // 1. Ambil Data Siswa (Relasi Kelas)
        $siswa = Siswa::with('kelas')->where('user_id', $user->id)->first();

        // 2. Siapkan Statistik (Default 0)
        $stats = [
            'hadir' => 0,
            'terlambat' => 0,
            'alpha' => 0,
            'persentase_kehadiran' => 0
        ];

        // 3. Hitung Statistik Real jika data siswa ada
        if ($siswa) {
            $bulanIni = Carbon::now()->month;
            $tahunIni = Carbon::now()->year;

            try {
                // Query dasar absensi bulan ini
                // Pastikan tabel 'absensis' memiliki kolom 'user_id'
                $queryAbsen = Absensi::where('user_id', $user->id)
                    ->whereMonth('tanggal', $bulanIni)
                    ->whereYear('tanggal', $tahunIni);

                // Hitung jumlah per status
                $stats['hadir'] = (clone $queryAbsen)->where('status', 'Hadir')->count();
                $stats['terlambat'] = (clone $queryAbsen)->where('status', 'Terlambat')->count();
                $stats['alpha'] = (clone $queryAbsen)->where('status', 'Alpha')->count();

                // Hitung Persentase Kehadiran
                $totalMasuk = $stats['hadir'] + $stats['terlambat'];
                $hariBerjalan = $queryAbsen->count();

                if ($hariBerjalan > 0) {
                    $stats['persentase_kehadiran'] = round(($totalMasuk / $hariBerjalan) * 100);
                }
            } catch (QueryException $e) {
                // Fallback jika tabel belum siap, biarkan stats 0
            }
        }

        // 4. Render ke View React
        return Inertia::render('Siswa/DashboardSiswa', [
            // [FIX] Kirim struktur auth lengkap dengan roles
            'auth' => [
                'user' => $user,
                'roles' => $roles // <--- INI KUNCINYA AGAR SIDEBAR MUNCUL
            ],
            'siswa' => $siswa,
            'stats' => $stats,
            'tanggal_hari_ini' => Carbon::now()->translatedFormat('l, d F Y')
        ]);
    }
}
