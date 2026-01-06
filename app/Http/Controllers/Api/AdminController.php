<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Jurnal;
use App\Models\AbsensiGuru;
use Carbon\Carbon;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AdminController extends Controller
{
    // GET /api/admin/dashboard-stats
    public function stats()
    {
        $stats = [
            'total_guru' => Guru::count(),
            'total_siswa' => Siswa::count(),
            'total_kelas' => Kelas::count(),
            'jurnal_hari_ini' => Jurnal::whereDate('tanggal', Carbon::today())->count(),
            'guru_hadir' => AbsensiGuru::whereDate('tanggal', Carbon::today())->count(),
        ];

        return response()->json(['success' => true, 'data' => $stats]);
    }

    // GET /api/admin/gurus
    public function gurus()
    {
        $gurus = Guru::with('user')->latest()->get();
        return response()->json(['success' => true, 'data' => $gurus]);
    }

    // GET /api/admin/kelas
    public function kelas()
    {
        $kelas = Kelas::all();
        return response()->json(['success' => true, 'data' => $kelas]);
    }

    // GET /api/qr/generate (Untuk display di layar tablet/kiosk)
    public function generateQrString()
    {
        // Token unik harian
        $token = 'ABSEN-' . date('Y-m-d') . '-SEKOLAH-ID';

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'date' => date('Y-m-d'),
                'message' => 'Gunakan library QR Code di Frontend/Mobile untuk render token ini.'
            ]
        ]);
    }

    // GET /api/kepsek/laporan-harian
    public function laporanHarian()
    {
        $today = Carbon::today();
        $jurnals = Jurnal::with(['guru.user', 'kelas', 'mapel'])
                        ->whereDate('tanggal', $today)
                        ->get();

        return response()->json(['success' => true, 'data' => $jurnals]);
    }
}
