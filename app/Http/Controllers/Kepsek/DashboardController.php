<?php

namespace App\Http\Controllers\Kepsek;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\Jurnal;
use App\Models\AbsensiGuru;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // 1. Siapkan Statistik Utama
        $stats = [
            'total_guru' => Guru::count(),
            'total_siswa' => Siswa::count(),
            'guru_hadir' => AbsensiGuru::whereDate('tanggal', $today)->count(),
            'jurnal_masuk' => Jurnal::whereDate('tanggal', $today)->count(),
        ];

        // 2. Siapkan Data Grafik (Opsional, array kosong dulu gpp)
        $chartData = [];

        // 3. Siapkan Jurnal Terbaru
        $recentJurnals = Jurnal::with(['guru.user', 'kelas', 'mapel'])
            ->latest()
            ->limit(5)
            ->get();

        // PENTING: Kirim semua variabel di atas ke Inertia
        return Inertia::render('Kepsek/DashboardKepsek', [
            'stats' => $stats,
            'chartData' => $chartData,
            'recentJurnals' => $recentJurnals
        ]);
    }

    public function monitoringJurnal(Request $request)
    {
        $date = $request->input('date', Carbon::today()->format('Y-m-d'));
        $jurnals = Jurnal::with(['guru.user', 'kelas', 'mapel'])->whereDate('tanggal', $date)->latest()->get();
        return Inertia::render('Kepsek/Monitoring/Jurnal', ['jurnals' => $jurnals, 'filterDate' => $date]);
    }

    public function monitoringAbsensi(Request $request)
    {
        $date = $request->input('date', Carbon::today()->format('Y-m-d'));
        $absensis = AbsensiGuru::with('guru.user')->whereDate('tanggal', $date)->orderBy('jam_masuk')->get();
        return Inertia::render('Kepsek/Monitoring/Absensi', ['absensis' => $absensis, 'filterDate' => $date]);
    }

    public function laporanSiswa(Request $request)
    {
        // Logika laporan siswa (kosongkan atau copas dari step sebelumnya jika sudah ada)
        // Agar tidak error method not found
        return Inertia::render('Kepsek/Monitoring/LaporanSiswa', [
            'laporan' => [],
            'kelas_list' => [],
            'filters' => []
        ]);
    }
}
